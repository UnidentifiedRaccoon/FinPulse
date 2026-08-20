import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HashRouter, MemoryRouter } from 'react-router'

import { AppRoutes } from './App'
import { practiceActionLabel } from './components/practiceMechanicLabels'
import { learnerLessonEntries } from './learnerLessonCatalog'

const bannedLearnerCopy = /(?:канон(?:ическ[а-яё]*)?|учебн[а-яё]*|досье|модел[а-яё]*|консилиум[а-яё]*|жюри|исследовательск[а-яё]*|механик[а-яё]*|нить решения|обратн[а-яё]* дорожк[а-яё]*)/iu

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  window.history.replaceState(null, '', '/')
  vi.restoreAllMocks()
})

describe('FinPulse concept lab', () => {
  it('shows a clean launcher with nine independent learner routes', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem')
    renderAt('/lab')

    expect(screen.getByRole('heading', { name: 'Выберите короткий урок' })).toHaveFocus()
    expect(screen.getByText(/Уроки не зависят друг от друга/)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Сообщение и проверка' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Деньги и срок' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Открыть урок/ })).toHaveLength(9)
    expect(screen.getByText('Без регистрации. Ответы не отправляются и не сохраняются в аккаунте.')).toBeInTheDocument()
    expect(screen.queryByText(/выбрано жюри|консилиум|самостоятельные версии|исследователь/i)).not.toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(storageSpy).not.toHaveBeenCalled()
  })

  it('links every launcher card to its user-test lesson route', () => {
    renderAt('/lab')

    for (const lesson of learnerLessonEntries) {
      expect(screen.getByRole('link', { name: `Открыть урок «${lesson.title}»` }))
        .toHaveAttribute('href', `/lesson/${lesson.slug}/1`)
    }
    expect(screen.getByRole('link', { name: 'Открыть урок «Что изменил один новый факт?»' }))
      .toHaveAttribute('href', '/lesson/one-fact-one-conclusion/1')
  })

  it('opens and restores the real hash-router lesson route', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/lab'
    render(<HashRouter><AppRoutes /></HashRouter>)

    const firstLesson = screen.getByRole('link', { name: 'Открыть урок «Что известно до ответа?»' })
    expect(firstLesson).toHaveAttribute('href', '#/lesson/facts-before-reveal/1')
    await user.click(firstLesson)
    expect(window.location.hash).toBe('#/lesson/facts-before-reveal/1')
    expect(screen.getByRole('heading', { name: 'Что известно до ответа?' })).toHaveFocus()

    cleanup()
    window.location.hash = '#/lesson/facts-before-reveal/4?practice-a-details=observed&practice-a-operation=claimed&practice-a-sender=unknown'
    render(<HashRouter><AppRoutes /></HashRouter>)

    expect(screen.getByRole('heading', { name: 'Разберите три фразы' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Есть в истории', checked: true })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Проверить разметку' })).toBeEnabled()
  })

  it('keeps the canonical lesson out of a forward-back loop', async () => {
    const user = userEvent.setup()
    window.location.hash = '#/lesson/one-fact-one-conclusion/3'
    render(<HashRouter><AppRoutes /></HashRouter>)

    await user.click(screen.getByRole('button', { name: 'Добавить один новый факт' }))
    expect(window.location.hash).toBe('#/lesson/one-fact-one-conclusion/4')

    await user.click(screen.getByRole('button', { name: 'Назад' }))
    expect(window.location.hash).toBe('#/lesson/one-fact-one-conclusion/3')

    window.history.back()
    await waitFor(() => expect(window.location.hash).toBe(''))

    cleanup()
    window.location.hash = '#/lesson/one-fact-one-conclusion/8'
    render(<HashRouter><AppRoutes /></HashRouter>)

    expect(await screen.findByRole('heading', { name: 'Что можно обсудить, а что всё ещё неизвестно?' })).toHaveFocus()
    expect(window.location.hash).toBe('#/lesson/one-fact-one-conclusion/7')
    expect(screen.getByRole('button', { name: 'Проверить' })).toBeDisabled()
  })

  it('keeps the complete learner catalog free of research and editorial labels', () => {
    expect(JSON.stringify(learnerLessonEntries)).not.toMatch(bannedLearnerCopy)
  })

  it.each([
    ['facts-before-reveal', 'Разметка сведений'],
    ['source-scope', 'Источники и их ответы'],
    ['one-change', 'Сравнение двух путей'],
    ['help-and-agency', 'Карта ролей'],
    ['question-and-source', 'Два вопроса и два ответа'],
    ['revise-explanation', 'Уточнение вывода'],
    ['evidence-chain', 'Проверка известных фактов'],
    ['deadline-backward', 'Сравнение сроков'],
  ])('renders a distinct practice surface for %s', (slug, accessibleName) => {
    renderAt(`/lesson/${slug}/4`)

    const lesson = learnerLessonEntries.find((entry) => entry.slug === slug)!
    expect(screen.getByRole('region', { name: accessibleName })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: practiceActionLabel(lesson.practice.kind) })).toBeDisabled()
    expect(document.body.textContent ?? '').not.toMatch(bannedLearnerCopy)
  })

  it('opens as one clear learner lesson without research labels or competing routes', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem')
    renderAt('/')

    expect(screen.getByRole('heading', { level: 1, name: 'Деньги могли понадобиться к сроку' })).toHaveFocus()
    expect(screen.getByText('Короткий урок · 4 минуты')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Цель урока' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Начать' })).toBeInTheDocument()
    expect(screen.queryByText(/A0|B1|C2|выбрано жюри|консилиум|канон|посылка/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(storageSpy).not.toHaveBeenCalled()
  })

  it('completes the public eight-step flow with calm feedback and no blocked mistake path', async () => {
    const user = userEvent.setup()
    renderAt('/')

    await user.click(screen.getByRole('button', { name: 'Начать' }))
    expect(screen.getByRole('heading', { name: 'Эти деньги были частью плана на жильё' })).toHaveFocus()
    expect(screen.getByText('2 из 8')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Посмотреть, что удалось проверить' }))
    expect(screen.getByRole('heading', { name: 'Один удачный пример оставил вопросы' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Добавить один новый факт' }))

    const checkPrimary = screen.getByRole('button', { name: 'Проверить' })
    expect(checkPrimary).toBeDisabled()
    expect(screen.queryByText(/C2|вымышленный дубль|граница реплики/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Вся внесённая сумма точно сохранится.' }))
    expect(checkPrimary).toBeEnabled()
    await user.click(checkPrimary)

    expect(screen.getByRole('heading', { name: 'Есть нюанс' })).toHaveFocus()
    expect(screen.getByText(/не подтверждает сохранность всей внесённой суммы/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Продолжить историю' }))
    expect(screen.getByRole('heading', { name: 'Как решил Саша' })).toHaveFocus()
    expect(screen.getByText(/Я сюда вкладываться не буду/)).toBeInTheDocument()
    expect(screen.getByText(/Из отложенных денег Саша оплатил первый месяц продлённой аренды/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Попробовать на другой ситуации' }))
    const transferCheck = screen.getByRole('button', { name: 'Проверить' })
    expect(transferCheck).toBeDisabled()
    await user.click(screen.getByRole('radio', { name: 'Заменить им основной план всей постановки.' }))
    await user.click(transferCheck)
    expect(screen.getByText('Есть нюанс')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'К итогу' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'К итогу' }))
    expect(screen.getByRole('heading', { name: 'Один факт меняет только связанный с ним вывод' })).toHaveFocus()
    expect(screen.getByText(/не индивидуальная финансовая рекомендация/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Завершить' }))
    expect(screen.getByRole('heading', { name: 'Урок завершён' })).toHaveFocus()
    expect(screen.getByText('Готово · 8 из 8')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Пройти ещё раз' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Выбрать другой урок' })).toBeInTheDocument()
  })

  it.each(learnerLessonEntries)(
    'completes the adapted learner route $slug from story to summary',
    async (lesson) => {
      const user = userEvent.setup()
      renderAt(`/lesson/${lesson.slug}/1`)

      expect(screen.getByRole('heading', { level: 1, name: lesson.title })).toHaveFocus()
      expect(screen.queryByText(/A0|B1|C2|жюри|консилиум/i)).not.toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: lesson.startLabel }))
      expect(screen.getByRole('heading', { name: lesson.story.title })).toHaveFocus()
      await user.click(screen.getByRole('button', { name: 'Продолжить' }))
      expect(screen.getByRole('heading', { name: lesson.focus.title })).toHaveFocus()
      await user.click(screen.getByRole('button', { name: 'Попробовать' }))

      for (const prompt of lesson.practice.prompts) {
        const group = screen.getByRole('group', { name: prompt.legend })
        for (const expectedId of prompt.expected) {
          const option = prompt.options.find((candidate) => candidate.id === expectedId)
          expect(option).toBeDefined()
          const input = group.querySelector<HTMLInputElement>(`input[value="${expectedId}"]`)
          expect(input).not.toBeNull()
          await user.click(input!)
        }
      }
      await user.click(screen.getByRole('button', { name: practiceActionLabel(lesson.practice.kind) }))

      expect(screen.getByRole('heading', { name: lesson.feedback.successTitle })).toHaveFocus()
      await user.click(screen.getByRole('button', { name: 'Продолжить историю' }))
      expect(screen.getByRole('heading', { name: lesson.outcome.title })).toHaveFocus()
      await user.click(screen.getByRole('button', { name: 'Попробовать на другой ситуации' }))

      for (const prompt of lesson.transfer.prompts) {
        if (!prompt) continue
        const group = screen.getByRole('group', { name: prompt.legend })
        for (const expectedId of prompt.expected) {
          const option = prompt.options.find((candidate) => candidate.id === expectedId)
          expect(option).toBeDefined()
          const input = group.querySelector<HTMLInputElement>(`input[value="${expectedId}"]`)
          expect(input).not.toBeNull()
          await user.click(input!)
        }
      }

      await user.click(screen.getByRole('button', { name: 'Проверить' }))
      expect(screen.getByText(lesson.transfer.feedback.success)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'К итогу' }))
      expect(screen.getByRole('heading', { name: lesson.summary.title })).toHaveFocus()
      await user.click(screen.getByRole('button', { name: 'Завершить' }))
      expect(screen.getByRole('heading', { name: 'Урок завершён' })).toHaveFocus()
      expect(screen.getByRole('button', { name: 'Выбрать другой урок' })).toBeInTheDocument()
    },
  )

  it('explains an imprecise choice without blocking the learner', async () => {
    const user = userEvent.setup()
    const lesson = learnerLessonEntries.find((entry) => entry.slug === 'facts-before-reveal')!
    renderAt(`/lesson/${lesson.slug}/1`)

    await user.click(screen.getByRole('button', { name: lesson.startLabel }))
    await user.click(screen.getByRole('button', { name: 'Продолжить' }))
    await user.click(screen.getByRole('button', { name: 'Попробовать' }))

    for (const prompt of lesson.practice.prompts) {
      const wrong = prompt.options.find((option) => !prompt.expected.includes(option.id))!
      const group = screen.getByRole('group', { name: prompt.legend })
      await user.click(within(group).getByRole('radio', { name: wrong.label }))
    }
    await user.click(screen.getByRole('button', { name: practiceActionLabel(lesson.practice.kind) }))

    expect(screen.getByRole('heading', { name: lesson.feedback.nuanceTitle })).toHaveFocus()
    expect(screen.getAllByText(/Точнее здесь:/)).toHaveLength(lesson.practice.prompts.length)
    expect(screen.getByRole('button', { name: 'Продолжить историю' })).toBeEnabled()
  })

  it('returns a direct feedback URL without answers to the required question', async () => {
    renderAt('/lesson/facts-before-reveal/5')

    expect(await screen.findByRole('heading', { name: 'Разберите три фразы' })).toHaveFocus()
    expect(screen.getAllByRole('group')).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Проверить разметку' })).toBeDisabled()
  })

  it('keeps the current one-fact lesson available on its canonical lab route', async () => {
    const user = userEvent.setup()
    renderAt('/lesson/one-fact-one-conclusion/1')

    expect(screen.getByRole('heading', { name: 'Деньги могли понадобиться к сроку' })).toHaveFocus()
    await user.click(screen.getByRole('button', { name: 'Начать' }))
    expect(screen.getByRole('heading', { name: 'Эти деньги были частью плана на жильё' })).toHaveFocus()
  })

  it.each([
    ['/concept/a0', 'На чём держится вывод Саши?', 'Читать сцену главы 3'],
    ['/concept/b1', 'Что должно остаться доступным к сроку?', 'Открыть поздний канонический результат'],
    ['/concept/c2', 'Какая часть реплики могла бы измениться?', 'Читать сцену до решения Саши'],
  ])('opens consilium route %s with a focused heading and chapter-3 boundary', (path, title, startAction) => {
    renderAt(path)

    expect(screen.getByRole('heading', { level: 1, name: title })).toHaveFocus()
    expect(screen.getByRole('link', { name: 'К основному содержанию' })).toBeInTheDocument()
    expect(screen.getByText(/«Свой маршрут» · глава 3 из 6/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: startAction })).toBeInTheDocument()
    expect(screen.getByText(/исчезнут после выхода/)).toBeInTheDocument()
    expect(screen.queryByText(/балл|очки|профиль риска|персональная рекомендация/i)).not.toBeInTheDocument()
  })

  it('A0 exposes the broken causal link and returns to the housing payoff', async () => {
    const user = userEvent.setup()
    renderAt('/concept/a0')

    await user.click(screen.getByRole('button', { name: 'Читать сцену главы 3' }))
    expect(screen.getByRole('heading', { name: 'Предложение и совместная проверка' })).toHaveFocus()
    expect(screen.getByText(/Эти деньги он больше не считал свободными/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Проверить причинные связи' }))
    expect(screen.getByRole('heading', { name: 'Что подтверждено, а где связь обрывается?' })).toHaveFocus()
    await user.click(screen.getAllByRole('radio', { name: 'Подтверждено сценой' })[2])
    await user.click(screen.getByRole('button', { name: 'Сверить причинную цепочку · отмечено 1 из 6' }))

    expect(screen.getByRole('heading', { name: 'Какой вывод выдерживает сцена?' })).toHaveFocus()
    expect(screen.getByText(/Один прошлый удачный пример подтверждает только/)).toBeInTheDocument()
    expect(screen.getByRole('generic', { name: 'Ограниченная причинная цепочка' })).toBeInTheDocument()
    expect(screen.getByText(/Решение относится к этому предложению, этим деньгам, цели и сроку Саши/)).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Проверить ту же связь в театре' }))
    await user.click(screen.getByRole('radio', { name: /Раз это случилось однажды/ }))
    await user.click(screen.getByRole('button', { name: 'Показать границу театрального вывода' }))
    expect(screen.getByText(/не подтверждает, что новую постановку примут к указанной дате/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Восстановить канон и прочитать итог' }))
    expect(screen.getByText(/Я сюда вкладываться не буду/)).toBeInTheDocument()
    expect(screen.getByText(/Из отложенных денег Саша оплатил первый месяц продлённой аренды/)).toBeInTheDocument()
  })

  it('B1 reveals the payoff first and reconstructs two information-only deadline tracks', async () => {
    const user = userEvent.setup()
    renderAt('/concept/b1')

    await user.click(screen.getByRole('button', { name: 'Открыть поздний канонический результат' }))
    expect(screen.getByText('Канонический результат · позже в главе 3')).toBeInTheDocument()
    expect(screen.getByText(/Из отложенных денег Саша оплатил первый месяц продлённой аренды/)).toBeInTheDocument()
    expect(screen.queryByText(/Я увидела рекламу одной инвестиционной платформы/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Развернуть две дорожки назад' }))
    const tracks = screen.getByRole('region', { name: 'Две обратные дорожки срока' })
    expect(within(tracks).getByText('Деньги остались в жилищном плане')).toBeInTheDocument()
    expect(within(tracks).getByText('Срок доступа заканчивается позже')).toBeInTheDocument()
    expect(screen.getByText(/Такого условия в истории не было/)).toBeInTheDocument()
    expect(screen.getByText(/Когда даты найдены и сопоставлены/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /вложить|перевести|купить/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'До изменения плана на жильё' }))
    await user.click(screen.getByRole('button', { name: 'Сопоставить сроки дорожек' }))
    expect(screen.getByText(/уточняет только сроки/)).toBeInTheDocument()
    expect(screen.getByText(/не подтверждает сохранность всей первоначально внесённой суммы/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Проверить обратный срок в театре' }))
    await user.click(screen.getByRole('radio', { name: /До того, как расписание начнёт зависеть/ }))
    await user.click(screen.getByRole('button', { name: 'Сопоставить срок репетиции' }))
    await user.click(screen.getByRole('button', { name: 'Вернуться к истории и прочитать канон по порядку' }))

    const ids = Array.from(document.querySelectorAll('[id]'), (element) => element.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(screen.getByText(/Я сюда вкладываться не буду/)).toBeInTheDocument()
  })

  it('C2 changes only withdrawal timing, compares a bounded line, and restores canon', async () => {
    const user = userEvent.setup()
    renderAt('/concept/c2')

    await user.click(screen.getByRole('button', { name: 'Читать сцену до решения Саши' }))
    await user.click(screen.getByRole('button', { name: 'Открыть один вымышленный дубль' }))

    const pair = screen.getByRole('region', { name: 'Канон и одна вымышленная посылка' })
    expect(within(pair).getByText('Срок получения всей суммы не подтверждён')).toBeInTheDocument()
    expect(within(pair).getByText('Подтверждён срок доступного тогда остатка')).toBeInTheDocument()
    expect(screen.getByText(/доступного на тот момент остатка и получить его к дате решения по жилью/)).toBeInTheDocument()
    expect(screen.getByText(/не подтверждает сохранность всей первоначально внесённой суммы/)).toBeInTheDocument()
    const locked = screen.getByRole('generic', { name: 'Что остаётся неизменным' })
    expect(within(locked).getByText(/Лера предлагает совместную проверку/)).toBeInTheDocument()
    expect(within(locked).getByText(/Повторяемость результата, сохранность всей суммы/)).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: /Изменяется только основание о сроке/ }))
    await user.click(screen.getByRole('button', { name: 'Сравнить границу реплики' }))
    expect(screen.getByText('Дельта ограничена сроком')).toBeInTheDocument()
    expect(screen.getByText(/Решение в учебном дубле может измениться или не измениться/)).toBeInTheDocument()
    expect(screen.getByText(/Теперь понятно, что доступную на тот момент сумму можно вывести/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Восстановить канон и прочитать решение Саши' }))
    expect(screen.getByText(/Мы так и не нашли подтверждений, что результат повторится/)).toBeInTheDocument()
    expect(screen.getByText(/Из отложенных денег Саша оплатил первый месяц продлённой аренды/)).toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('C2 requires both a bounded theatre action and an explicit limit', async () => {
    const user = userEvent.setup()
    renderAt('/concept/c2')

    await user.click(screen.getByRole('button', { name: 'Читать сцену до решения Саши' }))
    await user.click(screen.getByRole('button', { name: 'Не открывать вымышленный дубль — прочитать каноническое решение' }))
    await user.click(screen.getByRole('button', { name: 'Проверить границу в театральном дубле' }))
    await user.click(screen.getByRole('radio', { name: /Обсудить его как дополнительный приём/ }))
    await user.click(screen.getByRole('button', { name: 'Сверить действие и явный предел' }))
    expect(screen.getByText('Одной части не хватает')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Уточнить действие и явный предел' }))
    await user.click(screen.getByRole('radio', { name: /Неизвестно, ускорит ли приём всю постановку/ }))
    await user.click(screen.getByRole('button', { name: 'Сверить действие и явный предел' }))
    expect(screen.getByText('Обе части удержаны')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Завершить механику' }))
    expect(screen.getByRole('heading', { name: 'Одно новое свидетельство не переписывает героя' })).toBeInTheDocument()
  })

  it.each([
    [
      '/concept/a0',
      'Читать сцену главы 3',
      'Пропустить редакторский разбор — открыть канонический итог',
      'Перейти к итогу механики',
      'Итог истории · редакторский разбор пропущен',
    ],
    [
      '/concept/b1',
      'Открыть поздний канонический результат',
      'Не открывать обратную репетицию — прочитать канон по порядку',
      'Перейти к итогу механики',
      'Итог истории · обратная репетиция пропущена',
    ],
    [
      '/concept/c2',
      'Читать сцену до решения Саши',
      'Не открывать вымышленный дубль — прочитать каноническое решение',
      'Не открывать театральный дубль — перейти к итогу механики',
      'Итог истории · вымышленный дубль пропущен',
    ],
  ])('follows a real skip path on %s to the same canonical outcome', async (path, start, skip, finish, finalLabel) => {
    const user = userEvent.setup()
    renderAt(path)

    await user.click(screen.getByRole('button', { name: start }))
    await user.click(screen.getByRole('button', { name: skip }))

    expect(screen.getByText(/Я сюда вкладываться не буду/)).toBeInTheDocument()
    expect(screen.getByText(/Из отложенных денег Саша оплатил первый месяц продлённой аренды/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: finish }))
    expect(screen.getByText(finalLabel)).toBeInTheDocument()
    expect(screen.queryByText(/ошибка|не пройдено|неполный результат/i)).not.toBeInTheDocument()
  })

  it('repeat clears the C2 prediction and returns to its intro', async () => {
    const user = userEvent.setup()
    renderAt('/concept/c2')

    await user.click(screen.getByRole('button', { name: 'Читать сцену до решения Саши' }))
    await user.click(screen.getByRole('button', { name: 'Открыть один вымышленный дубль' }))
    await user.click(screen.getByRole('radio', { name: 'Теперь предложение безопасно и подходит Саше.' }))
    await user.click(screen.getByRole('button', { name: 'Сравнить границу реплики' }))
    await user.click(screen.getByRole('button', { name: 'Восстановить канон и прочитать решение Саши' }))
    await user.click(screen.getByRole('button', { name: 'Не открывать театральный дубль — перейти к итогу механики' }))
    await user.click(screen.getByRole('button', { name: 'Пройти ещё раз' }))

    expect(screen.getByRole('heading', { name: 'Одна посылка, прежний герой' })).toBeInTheDocument()
    expect(screen.queryByText('Вывод стал шире свидетельства')).not.toBeInTheDocument()
    expect(screen.getByText('История Саши').closest('li')).toHaveAttribute('aria-current', 'true')
  })

  it('leaving and reopening B1 destroys its structured selection', async () => {
    const user = userEvent.setup()
    renderAt('/concept/b1')

    await user.click(screen.getByRole('button', { name: 'Открыть поздний канонический результат' }))
    await user.click(screen.getByRole('button', { name: 'Развернуть две дорожки назад' }))
    await user.click(screen.getByRole('radio', { name: 'До изменения плана на жильё' }))
    expect(screen.getByRole('radio', { name: 'До изменения плана на жильё' })).toBeChecked()

    cleanup()
    renderAt('/concept/b1')
    await user.click(screen.getByRole('button', { name: 'Открыть поздний канонический результат' }))
    await user.click(screen.getByRole('button', { name: 'Развернуть две дорожки назад' }))

    expect(screen.getByRole('radio', { name: 'До изменения плана на жильё' })).not.toBeChecked()
  })

  it('uses neither network nor persistent storage during a consilium interaction', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem')
    const user = userEvent.setup()
    renderAt('/concept/a0')

    await user.click(screen.getByRole('button', { name: 'Читать сцену главы 3' }))
    await user.click(screen.getByRole('button', { name: 'Проверить причинные связи' }))
    await user.click(screen.getAllByRole('radio', { name: 'Подтверждено сценой' })[0])

    expect(fetchSpy).not.toHaveBeenCalled()
    expect(storageSpy).not.toHaveBeenCalled()
  })

  it.each([
    ['/', 'Деньги могли понадобиться к сроку'],
    ['/lab', 'Выберите короткий урок'],
    ['/concept/a', 'Что известно до развязки?'],
    ['/concept/z', 'Такой урок не найден'],
  ])('moves focus to the new route heading at %s', (path, title) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: title })).toHaveFocus()
    expect(screen.getByRole('link', { name: 'К основному содержанию' })).toBeInTheDocument()
  })

  it.each([
    ['/concept/a', 'Что известно до развязки?'],
    ['/concept/b', 'Какой источник что подтвердил?'],
    ['/concept/c', 'Что меняет путь к проверке?'],
    ['/concept/d', 'Кто помогал, кто действовал?'],
    ['/concept/e', 'Как меняется вопрос Саши?'],
    ['/concept/f', 'Как уточнить объяснение?'],
  ])('opens %s with the same learner orientation contract', (path, title) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument()
    const premiseHeading = screen.getByRole('heading', { level: 2, name: 'Первый год Саши в новом городе' })
    expect(premiseHeading).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
    expect(screen.getByText(/после переезда ради новой работы/)).toBeInTheDocument()
    expect(screen.getByText(/непрерывное начало главы 1/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Читать начало истории' })).toBeInTheDocument()
    expect(screen.getByText(/можно пропустить/i)).toBeInTheDocument()
    expect(screen.getByText(/История и решение Саши не меняются/)).toBeInTheDocument()
    expect(screen.getByText(/исчезнут после выхода/)).toBeInTheDocument()
    expect(screen.queryByText(/балл|очки|профиль риска/i)).not.toBeInTheDocument()
    expect(within(premiseHeading.closest('section')!).getAllByRole('button')).toHaveLength(1)
  })

  it.each([
    '/concept/a',
    '/concept/b',
    '/concept/c',
    '/concept/d',
    '/concept/e',
    '/concept/f',
  ])('starts the literary excerpt at Sasha\'s canonical arrival on %s', async (path) => {
    const user = userEvent.setup()
    renderAt(path)

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))

    expect(screen.getByRole('heading', { level: 2, name: 'Первый месяц' })).toHaveFocus()
    expect(screen.getByText('Канонический фрагмент · глава 1 из 6')).toBeInTheDocument()

    const arrival = screen.getByText(/Саша приехал в новый город в воскресенье вечером/)
    const temporaryRoom = screen.getByText(/Комнату он снял на несколько месяцев.*испытательный срок/)
    const reminders = screen.getByText(/На экране было сразу четыре напоминания/)
    const rentDate = screen.getByText(/новую дату они зафиксировали в переписке/)
    const subscriptionMorning = screen.getByText(/Утром Саша заполнил анкету нового сотрудника/)

    expect(arrival.compareDocumentPosition(temporaryRoom) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(temporaryRoom.compareDocumentPosition(reminders) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(reminders.compareDocumentPosition(rentDate) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(rentDate.compareDocumentPosition(subscriptionMorning) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(screen.getAllByText(/Саша приехал в новый город в воскресенье вечером/)).toHaveLength(1)
  })

  it('shows the canonical opening once before E moves to its second scene', async () => {
    const user = userEvent.setup()
    renderAt('/concept/e')

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    expect(screen.getByText(/Саша приехал в новый город в воскресенье вечером/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Пропустить запись и читать следующую сцену' }))
    expect(screen.getByRole('heading', { name: 'Сообщение после отмены' })).toBeInTheDocument()
    expect(screen.queryByText(/Саша приехал в новый город в воскресенье вечером/)).not.toBeInTheDocument()
  })

  it('moves focus to the changing stage heading instead of repeating the concept title', async () => {
    const user = userEvent.setup()
    renderAt('/concept/a')

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Первый месяц' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Разобрать, что уже известно' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Что известно до ответа поддержки?' })).toHaveFocus()
  })

  it('gives every B practice state its own focused heading', async () => {
    const user = userEvent.setup()
    renderAt('/concept/b')

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    await user.click(screen.getByRole('button', { name: 'Разобрать три фрагмента сцены' }))
    expect(screen.getByRole('heading', { name: 'Три фрагмента из прочитанной сцены' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Перейти к общему выводу' }))
    expect(screen.getByRole('heading', { name: 'Какой вывод выдерживают три источника?' })).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Показать вывод по источникам' }))
    expect(screen.getByRole('heading', { name: 'Что выдержал разбор источников?' })).toHaveFocus()
  })

  it('keeps the observer pause scoped to what the chapter establishes', async () => {
    const user = userEvent.setup()
    renderAt('/concept/a')

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    expect(screen.getByText('Пауза в истории · развязка ещё впереди')).toBeInTheDocument()
    expect(screen.getByText(/ответ поддержки ещё не показан/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Пропустить разбор и читать развязку' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Разобрать, что уже известно' }))
    const revealButton = screen.getByRole('button', { name: 'Показать границы знания' })
    await user.click(revealButton)

    expect(screen.getByText(/Личность отправителя пока не установлена/)).toBeInTheDocument()
    expect(screen.getByText(/не содержимое ссылки/)).toBeInTheDocument()
    expect(revealButton).toHaveFocus()

    await user.click(screen.getByRole('button', { name: 'Читать каноническую развязку' }))
    expect(screen.getByText(/никакой зависшей операции нет/)).toBeInTheDocument()
  })

  it('uses one explicit non-canon bridge and a static two-path comparison in C', async () => {
    const user = userEvent.setup()
    renderAt('/concept/c')

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    expect(screen.getByText('Сцена завершена · дальше отдельное учебное сравнение')).toBeInTheDocument()
    expect(screen.getByText(/Авторы демки заменили только один параметр/)).toBeInTheDocument()
    expect(screen.getByText(/Такого действия в истории не было/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Открыть модель' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Открыть сравнение' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Сравнить два пути проверки' }))
    expect(screen.getByText('Придуманный вариант — не часть истории')).toBeInTheDocument()
    expect(screen.getByText('Как было в истории')).toBeInTheDocument()
    expect(screen.getByText('Придуманный вариант для сравнения')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Придуманный вариант для сравнения/ })).not.toBeInTheDocument()

    await user.click(screen.getAllByRole('radio', { name: 'Меняется напрямую' })[0])
    await user.click(screen.getByRole('button', { name: 'Показать разбор · отмечено 1 из 6' }))

    expect(screen.getByRole('heading', { name: 'Что показало сравнение?' })).toBeInTheDocument()
    expect(screen.getByText('Ваши отметки · без балла')).toBeInTheDocument()
    expect(screen.getByText(/Владелец ссылки, личность отправителя/)).toBeInTheDocument()
    expect(screen.getByText(/не доказывает, что сообщение было мошенническим/)).toBeInTheDocument()
  })

  it('makes the C skip destination explicit while preserving the same story', async () => {
    const user = userEvent.setup()
    renderAt('/concept/c')

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    await user.click(screen.getByRole('button', { name: 'Не открывать придуманный вариант — перейти к итогу' }))

    expect(screen.getByText('Итог эпизода · сравнение пропущено')).toBeInTheDocument()
    expect(screen.getByText(/Пропущено только учебное сравнение/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'История Саши не изменилась' })).toBeInTheDocument()
  })

  it('clears optional text and describes the F skip path truthfully', async () => {
    const user = userEvent.setup()
    renderAt('/concept/f')

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    await user.click(screen.getByRole('button', { name: 'Сформулировать первую мысль' }))
    expect(screen.getByText('Учебная практика').closest('li')).toHaveAttribute('aria-current', 'true')
    const textarea = screen.getByRole('textbox', { name: 'Необязательная фраза' })
    await user.type(textarea, 'Личная временная формулировка')
    await user.click(screen.getByRole('button', { name: 'Очистить формулировку и перейти к главе 3' }))

    expect(screen.queryByDisplayValue('Личная временная формулировка')).not.toBeInTheDocument()
    expect(screen.getByText(/Ваша первая формулировка удалена/)).toBeInTheDocument()

    cleanup()
    renderAt('/concept/f')
    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    await user.click(screen.getByRole('button', { name: 'Перейти к главе 3 без формулировки' }))

    expect(screen.getByText(/Вы продолжили без своей формулировки/)).toBeInTheDocument()
    expect(screen.queryByText(/Ваша первая формулировка удалена/)).not.toBeInTheDocument()
  })

  it('renders the F comparison as visible paired scenes instead of a horizontal table', async () => {
    const user = userEvent.setup()
    renderAt('/concept/f')

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    await user.click(screen.getByRole('button', { name: 'Перейти к главе 3 без формулировки' }))
    await user.click(screen.getByRole('button', { name: 'Читать сцену из главы 3' }))
    await user.click(screen.getByRole('button', { name: 'Сопоставить две прочитанные сцены' }))

    const comparison = screen.getByRole('region', { name: 'Сравнение двух канонических сцен' })
    expect(within(comparison).getAllByText('Глава 1 · сообщение об отмене')).toHaveLength(4)
    expect(within(comparison).getAllByText('Глава 3 · письмо по обращению')).toHaveLength(4)
    expect(within(comparison).queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Сформулировать вывод после двух сцен' })).toBeInTheDocument()
  })

  it('focuses the authored F conclusion after optional reconstruction is skipped', async () => {
    const user = userEvent.setup()
    renderAt('/concept/f')

    await user.click(screen.getByRole('button', { name: 'Читать начало истории' }))
    await user.click(screen.getByRole('button', { name: 'Перейти к главе 3 без формулировки' }))
    await user.click(screen.getByRole('button', { name: 'Читать сцену из главы 3' }))
    await user.click(screen.getByRole('button', { name: 'Не сравнивать самому — перейти к формулировке' }))
    await user.click(screen.getByRole('button', { name: 'Не формулировать самому — показать вывод' }))

    expect(screen.getByRole('heading', { name: 'Что добавила вторая сцена?' })).toHaveFocus()
  })

  it.each([
    [
      '/concept/b',
      ['Читать начало истории', 'Разобрать три фрагмента сцены', 'Перейти к общему выводу', 'Показать вывод по источникам', 'Перейти к итогу эпизода'],
      'Следы не переписали сцену',
    ],
    [
      '/concept/d',
      ['Читать начало истории', 'Разметить роли в сцене', 'Показать, что есть в тексте', 'Посмотреть необязательные фразы помощи', 'Перейти к итогу эпизода'],
      'Помощь не отменила автономию Саши',
    ],
    [
      '/concept/e',
      ['Читать начало истории', 'Посмотреть первую запись по сцене', 'Читать следующую сцену Саши', 'Разобрать вторую запись по сцене', 'Сверить с текстом', 'Сопоставить две записи', 'Перейти к итогу эпизода'],
      'Другой вопрос потребовал другого источника',
    ],
  ])('completes the full state path for %s', async (path, actions, finalHeading) => {
    const user = userEvent.setup()
    renderAt(path)

    for (const action of actions) {
      await user.click(screen.getByRole('button', { name: action }))
    }

    expect(screen.getByRole('heading', { level: 2, name: finalHeading })).toBeInTheDocument()
  })

  it('renders an intentional fallback for an unknown route', () => {
    renderAt('/concept/z')
    expect(screen.getByRole('heading', { name: 'Такой урок не найден' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'К урокам' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'О демке' })).not.toBeInTheDocument()
  })
})
