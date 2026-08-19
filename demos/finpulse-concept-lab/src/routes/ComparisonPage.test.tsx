import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HashRouter, MemoryRouter } from 'react-router'

import { AppRoutes } from '../App'
import {
  comparisonMechanicEntries,
  comparisonMechanics,
  comparisonStory,
  sharedComparisonFact,
} from '../comparison/comparisonMechanics'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  window.location.hash = ''
  vi.restoreAllMocks()
})

describe('same-fragment comparison', () => {
  it('renders one shared story and all nine choices without changing the lab launcher', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem')
    renderAt('/compare')

    expect(screen.getByRole('heading', { level: 1, name: 'Одна история — разные способы разобраться' })).toHaveFocus()
    expect(screen.getAllByRole('combobox')).toHaveLength(2)
    expect(screen.getAllByRole('option')).toHaveLength(18)
    expect(new Set(comparisonMechanicEntries.map((mechanic) => mechanic.slug))).toHaveLength(9)

    for (const paragraph of comparisonStory.paragraphs) {
      expect(screen.getAllByText(paragraph)).toHaveLength(1)
    }
    expect(screen.getAllByText(sharedComparisonFact)).toHaveLength(1)

    expect(screen.getByRole('link', { name: 'К урокам' })).toHaveAttribute('href', '/lab')
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(storageSpy).not.toHaveBeenCalled()

    cleanup()
    renderAt('/lab')
    expect(screen.getByRole('heading', { name: 'Выберите короткий урок' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Открыть урок/ })).toHaveLength(9)
    expect(screen.queryByRole('link', { name: /сравнен/i })).not.toBeInTheDocument()
  })

  it('keeps the counterfactual wording identical in the two one-change methods', () => {
    const delta = comparisonMechanics['one-change']
    const conclusion = comparisonMechanics['one-fact-one-conclusion']

    expect(delta.renderer).toBe('practice')
    expect(conclusion.renderer).toBe('conclusion')
    if (delta.renderer !== 'practice' || conclusion.renderer !== 'conclusion') return
    expect(delta.practice.notice).toBe(sharedComparisonFact)
    expect(conclusion.notice).toBe(sharedComparisonFact)
  })

  it.each(comparisonMechanicEntries)(
    'opens $shortTitle against the unchanged shared fragment',
    (mechanic) => {
      const other = mechanic.slug === 'one-fact-one-conclusion'
        ? 'facts-before-reveal'
        : 'one-fact-one-conclusion'
      renderAt(`/compare?first=${mechanic.slug}&second=${other}&view=first`)

      const panel = screen.getByRole('tabpanel', { name: /Первый/ })
      expect(within(panel).getByText(mechanic.task)).toBeInTheDocument()
      expect(within(panel).getByRole('heading', { name: mechanic.title })).toBeInTheDocument()
      expect(screen.getAllByText(comparisonStory.paragraphs[0])).toHaveLength(1)
    },
  )

  it('runs two different methods and reveals a neutral side-by-side comparison', async () => {
    const user = userEvent.setup()
    renderAt('/compare')

    const firstPanel = screen.getByRole('tabpanel', { name: /Первый/ })
    const expectedFirst = [
      'Дано как условие истории',
      'Заявлено только в рекламе',
      'В истории сказано: подтверждения не нашли',
    ]
    const firstGroups = within(firstPanel).getAllByRole('group')
    for (const [index, label] of expectedFirst.entries()) {
      await user.click(within(firstGroups[index]!).getByRole('radio', { name: label }))
    }

    const secondPanel = screen.getByRole('tabpanel', { name: /Второй/ })
    await user.click(within(secondPanel).getByRole('radio', {
      name: 'Известен срок получения доступного тогда остатка; остальные вопросы и решение остаются открытыми.',
    }))

    await user.click(within(firstPanel).getByRole('button', { name: 'Показать разбор' }))
    await user.click(within(secondPanel).getByRole('button', { name: 'Показать разбор' }))

    expect(within(firstPanel).getByText('Сверка совпала')).toBeInTheDocument()
    expect(within(secondPanel).getByText('Сверка совпала')).toBeInTheDocument()
    expect(within(firstPanel).getByRole('button', { name: 'Разбор показан' })).toBeDisabled()
    expect(within(secondPanel).getByRole('button', { name: 'Разбор показан' })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'Сравните не ответы, а работу способов' })).toBeInTheDocument()
    expect(screen.getByText('Помогает не превращать привлекательное утверждение в установленный факт.')).toBeInTheDocument()
    expect(screen.getByText('Проверяет, останется ли новая реплика такой же ограниченной, как новое свидетельство.')).toBeInTheDocument()
  })

  it('explains why an imprecise classification does not fit the fragment', async () => {
    const user = userEvent.setup()
    renderAt('/compare')

    const firstPanel = screen.getByRole('tabpanel', { name: /Первый/ })
    const groups = within(firstPanel).getAllByRole('group')
    await user.click(within(groups[0]!).getByRole('radio', { name: 'Заявлено только в рекламе' }))
    await user.click(within(groups[1]!).getByRole('radio', { name: 'Дано как условие истории' }))
    await user.click(within(groups[2]!).getByRole('radio', { name: 'Заявлено только в рекламе' }))
    await user.click(within(firstPanel).getByRole('button', { name: 'Показать разбор' }))

    expect(within(firstPanel).getByText('Есть нюанс')).toBeInTheDocument()
    expect(within(firstPanel).getByText(/Дата окончания временной аренды задана самим фрагментом/)).toBeInTheDocument()
    expect(within(firstPanel).getByText(/Высокий доход относится к обещанию публикации/)).toBeInTheDocument()
    expect(within(firstPanel).getByText(/Фрагмент прямо сообщает итог поиска/)).toBeInTheDocument()
  })

  it('keeps answers transient and repairs invalid comparison state', async () => {
    window.location.hash = '#/compare?first=one-fact-one-conclusion&second=facts-before-reveal&view=first&answer-one-fact-one-conclusion-compare-conclusion=bounded&checked-one-fact-one-conclusion=1'
    render(<HashRouter><AppRoutes /></HashRouter>)

    expect(screen.getByRole('radio', {
      name: 'Известен срок получения доступного тогда остатка; остальные вопросы и решение остаются открытыми.',
      checked: false,
    })).toBeInTheDocument()
    expect(screen.queryByText('Сверка совпала')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(window.location.hash).not.toContain('answer-')
      expect(window.location.hash).not.toContain('checked-')
    })

    cleanup()
    window.location.hash = '#/compare?first=missing&second=missing&view=third&checked-facts-before-reveal=1'
    render(<HashRouter><AppRoutes /></HashRouter>)

    await waitFor(() => {
      expect(window.location.hash).toContain('first=facts-before-reveal')
      expect(window.location.hash).toContain('second=one-fact-one-conclusion')
      expect(window.location.hash).toContain('view=first')
      expect(window.location.hash).not.toContain('checked-facts-before-reveal=1')
    })
    for (const button of screen.getAllByRole('button', { name: 'Показать разбор' })) {
      expect(button).toBeDisabled()
    }
  })

  it('changes and swaps methods without adding answer clicks to browser history', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/compare'
    render(<HashRouter><AppRoutes /></HashRouter>)

    const firstSelect = screen.getByRole('combobox', { name: 'Первый способ: выберите способ' })
    await user.selectOptions(firstSelect, 'source-scope')
    expect(window.location.hash).toContain('first=source-scope')

    await user.click(screen.getByRole('button', { name: 'Поменять способы местами' }))
    expect(window.location.hash).toContain('first=one-fact-one-conclusion')
    expect(window.location.hash).toContain('second=source-scope')
    expect(screen.getAllByText(comparisonStory.paragraphs[0])).toHaveLength(1)
  })

  it('supports arrow-key navigation between the mobile comparison tabs', async () => {
    const user = userEvent.setup()
    renderAt('/compare')

    const firstTab = document.getElementById('comparison-tab-first') as HTMLButtonElement
    const secondTab = document.getElementById('comparison-tab-second') as HTMLButtonElement
    firstTab.focus()
    await user.keyboard('{ArrowRight}')
    expect(secondTab).toHaveFocus()
    expect(secondTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowLeft}')
    expect(firstTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'true')
  })
})
