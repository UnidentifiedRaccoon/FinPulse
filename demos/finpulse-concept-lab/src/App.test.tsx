import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'

import { AppRoutes } from './App'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('FinPulse concept lab', () => {
  it('frames the library as six alternatives, not a sequence of lessons', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem')
    renderAt('/lab')

    expect(screen.getByRole('heading', { name: 'Один эпизод — шесть самостоятельных версий' })).toBeInTheDocument()
    expect(screen.getByText(/история в шести главах/)).toBeInTheDocument()
    expect(screen.getByText(/первом годе Саши после переезда ради новой работы/)).toBeInTheDocument()
    expect(screen.getByText(/альтернативные версии одной демки, не уроки по порядку/)).toBeInTheDocument()
    expect(screen.getByText(/можно пропустить без изменения сюжета/)).toBeInTheDocument()
    expect(within(screen.getByRole('navigation', { name: 'Самостоятельные версии демки' })).getAllByRole('link')).toHaveLength(6)
    expect(screen.getByText('Без регистрации. Ответы не отправляются и исчезают после выхода.')).toBeInTheDocument()
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(storageSpy).not.toHaveBeenCalled()
  })

  it('keeps the six originals and exposes three consilium mechanics in a separate navigation', () => {
    renderAt('/lab')

    const originalNavigation = screen.getByRole('navigation', { name: 'Самостоятельные версии демки' })
    const consiliumNavigation = screen.getByRole('navigation', { name: 'Новые механики консилиума' })

    expect(within(originalNavigation).getAllByRole('link')).toHaveLength(6)
    expect(within(consiliumNavigation).getAllByRole('link')).toHaveLength(3)
    expect(screen.getByRole('heading', { name: 'Деньги на жильё — три самостоятельные версии' })).toBeInTheDocument()
    expect(within(consiliumNavigation).getByRole('link', { name: /Порог доверия/ })).toHaveAttribute('href', '/concept/a0')
    expect(within(consiliumNavigation).getByRole('link', { name: /Обратная репетиция срока/ })).toHaveAttribute('href', '/concept/b1')
    expect(within(consiliumNavigation).getByRole('link', { name: /Неизменный мотив/ })).toHaveAttribute('href', '/concept/c2')
    expect(within(consiliumNavigation).getByText('Выбрано жюри')).toBeInTheDocument()
    expect(within(originalNavigation).queryByText('Выбрано жюри')).not.toBeInTheDocument()
  })

  it('opens as one clear learner lesson without research labels or competing routes', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem')
    renderAt('/')

    expect(screen.getByRole('heading', { level: 1, name: 'Деньги нужны к сроку' })).toHaveFocus()
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
    expect(screen.getByRole('heading', { name: 'Эти деньги уже были нужны для жилья' })).toHaveFocus()
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

    await user.click(screen.getByRole('link', { name: 'Все версии' }))
    await user.click(screen.getByRole('link', { name: /Обратная репетиция срока/ }))
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
    ['/', 'Деньги нужны к сроку'],
    ['/lab', 'Один эпизод — шесть самостоятельных версий'],
    ['/concept/a', 'Что известно до развязки?'],
    ['/concept/z', 'Такая версия не найдена'],
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

    await user.click(screen.getByRole('link', { name: 'Все версии' }))
    await user.click(screen.getByRole('link', { name: /Правило с поправками/ }))
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
    expect(screen.getByRole('heading', { name: 'Такая версия не найдена' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Все версии' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'О демке' })).not.toBeInTheDocument()
  })
})
