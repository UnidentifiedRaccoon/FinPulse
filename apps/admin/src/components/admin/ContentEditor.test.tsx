import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { adminApi } from '../../lib/adminApi'
import type {
  AdminContentPreviewResponse,
  AdminContentSelection,
  AdminContentTreeResponse,
  AdminMeResponse,
} from '../../lib/types'

import { ContentEditor } from './ContentEditor'

vi.mock('next/navigation', () => ({
  usePathname: () => '/content',
}))

vi.mock('../../lib/adminApi', async () => {
  const actual = await vi.importActual<typeof import('../../lib/adminApi')>('../../lib/adminApi')

  return {
    AdminApiError: actual.AdminApiError,
    adminApi: {
      getMe: vi.fn(),
      getContentTree: vi.fn(),
      getContentPreview: vi.fn(),
      updateContentSlice: vi.fn(),
      logout: vi.fn(),
    },
  }
})

const scope = {
  access: 'global_all_users',
  organizationFiltering: {
    enabled: false,
    mode: 'not_enabled',
  },
  rbac: {
    enabled: false,
  },
  reflectionAnswerText: {
    includedByDefault: false,
  },
} as const

const meResponse: AdminMeResponse = {
  admin: {
    login: 'admin@example.com',
  },
  scope,
}

const selectedCard: AdminContentSelection = {
  kind: 'card',
  levelSlug: 'level-1-start',
  sectionSlug: 'money-and-operations',
  lessonSlug: 'where-money-goes',
  cardId: 'card_l1s1l1_01_hook',
}

const secondCardSelection: AdminContentSelection = {
  kind: 'card',
  levelSlug: 'level-1-start',
  sectionSlug: 'money-and-operations',
  lessonSlug: 'where-money-goes',
  cardId: 'card_l1s1l1_02_theory',
}

const treeResponse: AdminContentTreeResponse = {
  scope,
  tree: {
    program: {
      slug: 'finpulse-mvp',
      title: 'ФинПульс',
    },
    levels: [
      {
        slug: 'level-1-start',
        title: 'Уровень 1 · Старт',
        revision: 1,
        sections: [
          {
            slug: 'money-and-operations',
            title: 'Раздел 1. Деньги и операции',
            revision: 1,
            lessons: [
              {
                slug: 'where-money-goes',
                title: 'Куда уходят деньги',
                revision: 1,
                cards: [
                  {
                    id: 'card_l1s1l1_01_hook',
                    type: 'single_choice',
                    title: 'Деньги были... или нет?',
                    order: 1,
                  },
                  {
                    id: 'card_l1s1l1_02_theory',
                    type: 'theory',
                    title: 'Денежный поток',
                    order: 2,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}

const initialSlice = {
  id: 'card_l1s1l1_01_hook',
  type: 'single_choice',
  order: 1,
  title: 'Деньги были... или нет?',
  question: 'Узнаёшь **себя**?\n\nВыбери ближайший вариант.',
  options: [
    {
      id: 'often',
      label: 'Часто',
      feedback: 'Это нормальная точка старта.',
    },
    {
      id: 'rarely',
      label: 'Редко',
      feedback: 'Тоже хороший повод свериться.',
    },
  ],
}

const updatedSlice = {
  ...initialSlice,
  title: 'Обновлённый экран',
  question: 'Узнаёшь **себя** после правки?',
}

const secondSlice = {
  id: 'card_l1s1l1_02_theory',
  type: 'theory',
  order: 2,
  title: 'Денежный поток',
  body: 'Короткое объяснение.',
}

function lessonDetailsFor(card: typeof initialSlice | typeof secondSlice) {
  const lesson = {
    id: 'lesson-where-money-goes',
    slug: 'where-money-goes',
    title: 'Куда уходят деньги',
    order: 1,
    learningGoal: 'Понять, почему деньги заканчиваются незаметно.',
    cards: [
      card.id === initialSlice.id ? card : initialSlice,
      card.id === secondSlice.id ? card : secondSlice,
      {
        id: 'card_l1s1l1_03_practice',
        type: 'categorization',
        order: 3,
        title: 'Разложи траты',
        question: 'Что куда относится?',
        categories: [
          { id: 'need', label: 'Нужно' },
          { id: 'want', label: 'Хочется' },
        ],
        items: [
          { id: 'rent', label: 'Аренда', correctCategoryId: 'need' },
          { id: 'game', label: 'Игра', correctCategoryId: 'want' },
        ],
      },
      { id: 'card_l1s1l1_04_summary', type: 'summary', order: 4, points: ['Итог'] },
      { id: 'card_l1s1l1_05_summary', type: 'summary', order: 5, points: ['Итог'] },
      { id: 'card_l1s1l1_06_summary', type: 'summary', order: 6, points: ['Итог'] },
      { id: 'card_l1s1l1_07_summary', type: 'summary', order: 7, points: ['Итог'] },
      { id: 'card_l1s1l1_08_summary', type: 'summary', order: 8, points: ['Итог'] },
    ],
  }
  const section = {
    schemaVersion: 1,
    id: 'section-money-and-operations',
    slug: 'money-and-operations',
    title: 'Раздел 1. Деньги и операции',
    order: 1,
    source: 'test',
    lessons: [lesson],
  }
  const level = {
    schemaVersion: 1,
    id: 'level-1-start',
    slug: 'level-1-start',
    title: 'Уровень 1 · Старт',
    order: 1,
    sections: [section],
  }

  return {
    level,
    section,
    lesson,
    previous: null,
    next: null,
  }
}

const initialPreviewResponse: AdminContentPreviewResponse = {
  scope,
  preview: {
    kind: 'card',
    revision: 1,
    slice: initialSlice,
    preview: {
      details: lessonDetailsFor(initialSlice),
      card: initialSlice,
    },
  },
}

const updatedPreviewResponse: AdminContentPreviewResponse = {
  scope,
  preview: {
    kind: 'card',
    revision: 2,
    slice: updatedSlice,
    preview: {
      details: lessonDetailsFor(updatedSlice),
      card: updatedSlice,
    },
  },
}

const secondPreviewResponse: AdminContentPreviewResponse = {
  scope,
  preview: {
    kind: 'card',
    revision: 1,
    slice: secondSlice,
    preview: {
      details: lessonDetailsFor(secondSlice),
      card: secondSlice,
    },
  },
}

const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect

function createRect({ height, left, top, width }: { height: number; left: number; top: number; width: number }) {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  } as DOMRect
}

describe('ContentEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
    window.scrollTo = vi.fn()
    Element.prototype.scrollIntoView = vi.fn()
    Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
      if (this instanceof HTMLElement && this.classList.contains('admin-route-preview-shell')) {
        return createRect({
          height: 520,
          left: 28,
          top: 40,
          width: 384,
        })
      }

      return originalGetBoundingClientRect.call(this)
    }
    vi.mocked(adminApi.getMe).mockResolvedValue(meResponse)
    vi.mocked(adminApi.getContentTree).mockResolvedValue(treeResponse)
    vi.mocked(adminApi.getContentPreview).mockImplementation(async (selection) => {
      if (selection.kind === 'card' && selection.cardId === secondCardSelection.cardId) {
        return secondPreviewResponse
      }

      return initialPreviewResponse
    })
    vi.mocked(adminApi.updateContentSlice).mockResolvedValue(updatedPreviewResponse)
    vi.mocked(adminApi.logout).mockResolvedValue(undefined)
  })

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
    vi.unstubAllGlobals()
  })

  it('loads a card slice, previews edits, and publishes the selected slice', async () => {
    const actor = userEvent.setup()
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const editor = await screen.findByRole('textbox', { name: 'Редактируемый JSON фрагмент' })
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(initialSlice, null, 2))
    })
    expect(screen.queryByRole('button', { name: 'Обновить дерево' })).not.toBeInTheDocument()
    expect(screen.queryByText(/rev\s+1/i)).not.toBeInTheDocument()

    fireEvent.change(editor, {
      target: {
        value: JSON.stringify(updatedSlice, null, 2),
      },
    })

    const preview = await screen.findByTestId('production-learner-route-preview')
    expect(within(preview).getByRole('heading', { name: 'Куда уходят деньги' })).toBeInTheDocument()
    expect(within(preview).getByText('1 из 8')).toBeInTheDocument()
    expect(within(preview).getByLabelText('Цель урока')).toHaveTextContent('Понять, почему деньги заканчиваются незаметно.')
    expect(within(preview).getByRole('heading', { name: 'Обновлённый экран' })).toBeInTheDocument()
    expect(within(preview).getByText('себя').tagName).toBe('STRONG')
    await actor.click(within(preview).getByRole('radio', { name: 'Часто' }))
    expect(within(preview).getByRole('button', { name: 'Далее' })).toBeEnabled()

    await actor.click(within(preview).getByRole('button', { name: 'Далее' }))
    expect(await within(preview).findByRole('heading', { name: 'Денежный поток' })).toBeInTheDocument()

    await actor.click(within(preview).getByLabelText('Вернуться к уровню Уровень 1 · Старт'))
    const compactHeader = await within(preview).findByTestId('compact-path-header')
    expect(within(compactHeader).getByRole('heading', { name: 'Деньги и операции' })).toBeInTheDocument()

    await actor.click(within(preview).getByRole('link', { name: 'Уровень 1 раздел 1' }))
    expect(await within(preview).findByRole('heading', { name: 'Уровни' })).toBeInTheDocument()

    await actor.click(within(preview).getByRole('link', { name: 'Далее' }))
    const lessonNode = await within(preview).findByRole('button', {
      name: /Куда уходят деньги.*Показать описание урока/u,
    })
    await actor.click(lessonNode)
    const dialog = await screen.findByRole('dialog', { name: 'Куда уходят деньги' })
    const overlay = document.querySelector('[data-slot="dialog-overlay"]')
    expect(dialog).toHaveAttribute('data-dialog-bounded', 'true')
    expect(dialog).toHaveStyle({
      left: '220px',
      top: '300px',
    })
    expect(overlay).toHaveAttribute('data-dialog-bounded', 'true')
    expect(overlay).toHaveStyle({
      height: '520px',
      left: '28px',
      top: '40px',
      width: '384px',
    })
    await actor.click(screen.getByRole('button', { name: 'Не сейчас' }))
    expect(globalThis.fetch).not.toHaveBeenCalled()

    await actor.click(screen.getByRole('button', { name: /Сохранить/u }))

    await waitFor(() => {
      expect(adminApi.updateContentSlice).toHaveBeenCalledWith(selectedCard, 1, updatedSlice)
    })
    expect(await screen.findByText('Сохранено. Learner API уже отдаёт обновлённый контент.')).toBeInTheDocument()
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(updatedSlice, null, 2))
    })
  })

  it('renders an aria-hidden syntax highlight layer while preserving the native textarea', async () => {
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const editor = await screen.findByRole('textbox', { name: 'Редактируемый JSON фрагмент' })
    const highlight = await screen.findByTestId('json-editor-highlight')
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(initialSlice, null, 2))
    })

    expect(highlight).toHaveAttribute('aria-hidden', 'true')
    expect(highlight.textContent).toBe(JSON.stringify(initialSlice, null, 2))
    expect(highlight.querySelector('.json-token.key')).toHaveTextContent('"id"')
    expect(highlight.querySelector('.json-token.string')).toHaveTextContent('"card_l1s1l1_01_hook"')
    expect(highlight.querySelector('.json-token.number')).toHaveTextContent('1')
    expect(highlight.querySelector('.json-token.punctuation')).toHaveTextContent('{')

    const tokenFixture = '{\n  "enabled": true,\n  "empty": null,\n  "count": 3\n}'
    fireEvent.change(editor, {
      target: {
        value: tokenFixture,
      },
    })

    expect(editor).toHaveValue(tokenFixture)
    expect(highlight.textContent).toBe(tokenFixture)
    expect(highlight.querySelector('.json-token.boolean')).toHaveTextContent('true')
    expect(highlight.querySelector('.json-token.null')).toHaveTextContent('null')
    expect(highlight.querySelector('.json-token.number')).toHaveTextContent('3')
  })

  it('keeps syntax highlighting and validation feedback for invalid JSON drafts', async () => {
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const editor = await screen.findByRole('textbox', { name: 'Редактируемый JSON фрагмент' })
    const highlight = await screen.findByTestId('json-editor-highlight')
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(initialSlice, null, 2))
    })

    const invalidJson = '{\n  "enabled": true,\n  "empty": null,\n'
    fireEvent.change(editor, {
      target: {
        value: invalidJson,
      },
    })

    expect(highlight.textContent).toBe(invalidJson)
    expect(highlight.querySelector('.json-token.boolean')).toHaveTextContent('true')
    expect(highlight.querySelector('.json-token.null')).toHaveTextContent('null')
    expect(screen.getByRole('button', { name: /Сохранить/u })).toBeDisabled()
    expect(
      screen.getByText((content, element) => {
        return Boolean(
          element?.classList.contains('status-text') &&
            element.classList.contains('danger') &&
            content.includes('JSON'),
        )
      }),
    ).toBeInTheDocument()
  })

  it('syncs the syntax highlight layer scroll position with the textarea', async () => {
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const editor = await screen.findByRole('textbox', { name: 'Редактируемый JSON фрагмент' })
    const highlight = await screen.findByTestId('json-editor-highlight')
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(initialSlice, null, 2))
    })

    editor.scrollTop = 48
    editor.scrollLeft = 12
    fireEvent.scroll(editor)

    expect(highlight.scrollTop).toBe(48)
    expect(highlight.scrollLeft).toBe(12)
  })

  it('opens the selected content tree card in the learner route preview', async () => {
    const actor = userEvent.setup()
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const tree = screen.getByLabelText('Дерево контента')

    await actor.click(within(tree).getByRole('button', { name: /2\s*Денежный поток/u }))

    const editor = await screen.findByRole('textbox', { name: 'Редактируемый JSON фрагмент' })
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(secondSlice, null, 2))
    })
    expect(adminApi.getContentPreview).toHaveBeenCalledWith(secondCardSelection)

    const preview = await screen.findByTestId('production-learner-route-preview')
    expect(within(preview).getByText('2 из 8')).toBeInTheDocument()
    expect(within(preview).getByRole('heading', { name: 'Денежный поток' })).toBeInTheDocument()
    expect(within(preview).queryByLabelText('Цель урока')).not.toBeInTheDocument()
  })

  it('resets only the current learner preview screen', async () => {
    const actor = userEvent.setup()
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const preview = await screen.findByTestId('production-learner-route-preview')

    await actor.click(within(preview).getByRole('radio', { name: 'Часто' }))
    await actor.click(within(preview).getByRole('button', { name: 'Далее' }))
    await actor.click(await within(preview).findByRole('button', { name: 'Далее' }))

    expect(await within(preview).findByRole('heading', { name: 'Разложи траты' })).toBeInTheDocument()
    expect(within(preview).getByText('3 из 8')).toBeInTheDocument()

    const firstItem = within(preview).getByRole('group', { name: 'Аренда' })
    await actor.click(within(firstItem).getByRole('radio', { name: 'Нужно' }))
    await waitFor(() => {
      expect(within(preview).getByRole('group', { name: 'Игра' })).toBeInTheDocument()
    })

    await actor.click(screen.getByRole('button', { name: 'Сбросить текущий экран preview' }))

    expect(await within(preview).findByRole('heading', { name: 'Разложи траты' })).toBeInTheDocument()
    expect(within(preview).getByText('3 из 8')).toBeInTheDocument()
    const resetFirstItem = within(preview).getByRole('group', { name: 'Аренда' })
    expect(within(resetFirstItem).getByRole('radio', { name: 'Нужно' })).not.toBeChecked()
    expect(within(preview).queryByRole('group', { name: 'Игра' })).not.toBeInTheDocument()
    expect(within(preview).getByRole('button', { name: 'Проверить' })).toBeDisabled()
  })

  it('keeps unsaved JSON when content tree switching is cancelled', async () => {
    const actor = userEvent.setup()
    const confirm = vi.fn(() => false)
    vi.stubGlobal('confirm', confirm)
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const editor = await screen.findByRole('textbox', { name: 'Редактируемый JSON фрагмент' })
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(initialSlice, null, 2))
    })
    const dirtyText = JSON.stringify(updatedSlice, null, 2)
    fireEvent.change(editor, {
      target: {
        value: dirtyText,
      },
    })

    await actor.click(within(screen.getByLabelText('Дерево контента')).getByRole('button', { name: /2\s*Денежный поток/u }))

    expect(confirm).toHaveBeenCalledWith('Несохранённые изменения в JSON будут потеряны при переключении. Продолжить?')
    expect(editor).toHaveValue(dirtyText)
    expect(adminApi.getContentPreview).toHaveBeenCalledTimes(1)
    expect(within(await screen.findByTestId('production-learner-route-preview')).getByText('1 из 8')).toBeInTheDocument()
  })

  it('switches after dirty confirmation and resets the saved JSON baseline', async () => {
    const actor = userEvent.setup()
    const confirm = vi.fn(() => true)
    vi.stubGlobal('confirm', confirm)
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const editor = await screen.findByRole('textbox', { name: 'Редактируемый JSON фрагмент' })
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(initialSlice, null, 2))
    })
    fireEvent.change(editor, {
      target: {
        value: JSON.stringify(updatedSlice, null, 2),
      },
    })

    const tree = screen.getByLabelText('Дерево контента')
    await actor.click(within(tree).getByRole('button', { name: /2\s*Денежный поток/u }))

    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(secondSlice, null, 2))
    })
    expect(confirm).toHaveBeenCalledTimes(1)

    confirm.mockClear()
    await actor.click(within(tree).getByRole('button', { name: /1\s*Деньги были\.\.\. или нет\?/u }))

    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(initialSlice, null, 2))
    })
    expect(confirm).not.toHaveBeenCalled()
  })

  it('does not warn when the dirty current tree item is selected again', async () => {
    const actor = userEvent.setup()
    const confirm = vi.fn(() => false)
    vi.stubGlobal('confirm', confirm)
    render(<ContentEditor />)

    await screen.findByText('Деньги были... или нет?')
    const editor = await screen.findByRole('textbox', { name: 'Редактируемый JSON фрагмент' })
    await waitFor(() => {
      expect(editor).toHaveValue(JSON.stringify(initialSlice, null, 2))
    })
    const dirtyText = JSON.stringify(updatedSlice, null, 2)
    fireEvent.change(editor, {
      target: {
        value: dirtyText,
      },
    })

    await actor.click(within(screen.getByLabelText('Дерево контента')).getByRole('button', { name: /1\s*Деньги были\.\.\. или нет\?/u }))

    expect(confirm).not.toHaveBeenCalled()
    expect(editor).toHaveValue(dirtyText)
    expect(adminApi.getContentPreview).toHaveBeenCalledTimes(1)
  })
})
