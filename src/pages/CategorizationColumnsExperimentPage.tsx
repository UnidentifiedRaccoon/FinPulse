import { ArrowRightLeft, RotateCcw } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

type MockCategory = {
  id: string
  label: string
  hint: string
  tone: 'blue' | 'green' | 'amber' | 'rose'
}

type MockItem = {
  id: string
  label: string
  correctCategoryId: string
}

type Assignments = Record<string, string>
type ItemOrderByCategoryId = Record<string, string[]>

type MockExample = {
  id: string
  title: string
  eyebrow: string
  question: string
  categories: MockCategory[]
  items: MockItem[]
  initialAssignments: Assignments
}

type ExampleState = {
  assignments: Assignments
  itemOrderByCategoryId: ItemOrderByCategoryId
  selectedItemId: string | null
  isChecked: boolean
}

const COLUMN_HEADER_TITLE_CLAMP_STYLE: CSSProperties = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
}

const COLUMN_HEADER_HINT_CLAMP_STYLE: CSSProperties = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 1,
}

const examples: MockExample[] = [
  {
    id: 'two-columns',
    eyebrow: '2 варианта ответа',
    title: 'Подушка или желание',
    question: 'Финальная сверка после распределения ситуаций.',
    categories: [
      {
        id: 'fund',
        label: 'Подушка помогает',
        hint: 'неожиданное и важное',
        tone: 'green',
      },
      {
        id: 'not-fund',
        label: 'Не для подушки',
        hint: 'плановые желания',
        tone: 'amber',
      },
    ],
    items: [
      { id: 'income-delay', label: 'Задержали зарплату', correctCategoryId: 'fund' },
      { id: 'sale-sneakers', label: 'Кроссовки на распродаже', correctCategoryId: 'not-fund' },
      { id: 'phone-repair', label: 'Срочный ремонт телефона', correctCategoryId: 'fund' },
      { id: 'concert', label: 'Билет на концерт', correctCategoryId: 'not-fund' },
    ],
    initialAssignments: {
      'income-delay': 'fund',
      'sale-sneakers': 'fund',
      'phone-repair': 'fund',
      concert: 'not-fund',
    },
  },
  {
    id: 'three-columns',
    eyebrow: '3 варианта ответа',
    title: 'Траты по приоритету',
    question: 'Проверка распределения расходов без таблицы.',
    categories: [
      {
        id: 'mandatory',
        label: 'Обязательное',
        hint: 'жизнь и базовые платежи',
        tone: 'blue',
      },
      {
        id: 'desired',
        label: 'Желаемое',
        hint: 'комфорт и радости',
        tone: 'amber',
      },
      {
        id: 'postpone',
        label: 'Можно отложить',
        hint: 'не срочно сейчас',
        tone: 'rose',
      },
    ],
    items: [
      { id: 'rent', label: 'Аренда жилья', correctCategoryId: 'mandatory' },
      { id: 'delivery', label: 'Доставка вместо ужина дома', correctCategoryId: 'desired' },
      { id: 'new-chair', label: 'Новое кресло при рабочем старом', correctCategoryId: 'postpone' },
      { id: 'medicine', label: 'Лекарства по назначению', correctCategoryId: 'mandatory' },
      { id: 'streaming', label: 'Подписка на кино', correctCategoryId: 'desired' },
    ],
    initialAssignments: {
      rent: 'mandatory',
      delivery: 'desired',
      'new-chair': 'desired',
      medicine: 'mandatory',
      streaming: 'postpone',
    },
  },
  {
    id: 'four-columns',
    eyebrow: '4 варианта ответа',
    title: 'Бюджетные корзины',
    question: 'Самый плотный мок: четыре колонки, как в карточке с четырьмя вариантами ответа.',
    categories: [
      {
        id: 'mandatory',
        label: 'Обязательное',
        hint: 'то, без чего месяц не держится',
        tone: 'blue',
      },
      {
        id: 'pay-yourself',
        label: 'Сначала себе',
        hint: 'резерв и накопления',
        tone: 'green',
      },
      {
        id: 'desired',
        label: 'Желаемое',
        hint: 'приятное, но гибкое',
        tone: 'amber',
      },
      {
        id: 'unexpected',
        label: 'Непредвиденное',
        hint: 'запас на сюрпризы',
        tone: 'rose',
      },
    ],
    items: [
      { id: 'utilities', label: 'ЖКХ и связь', correctCategoryId: 'mandatory' },
      { id: 'reserve-transfer', label: 'Перевод 10% в резерв', correctCategoryId: 'pay-yourself' },
      { id: 'coffee', label: 'Кофе и десерт после работы', correctCategoryId: 'desired' },
      { id: 'dentist', label: 'Внезапный визит к стоматологу', correctCategoryId: 'unexpected' },
      { id: 'groceries', label: 'Продукты на неделю', correctCategoryId: 'mandatory' },
      { id: 'trip-fund', label: 'Копилка на поездку', correctCategoryId: 'pay-yourself' },
      { id: 'taxi', label: 'Такси вместо автобуса', correctCategoryId: 'desired' },
    ],
    initialAssignments: {
      utilities: 'mandatory',
      'reserve-transfer': 'desired',
      coffee: 'desired',
      dentist: 'mandatory',
      groceries: 'mandatory',
      'trip-fund': 'pay-yourself',
      taxi: 'unexpected',
    },
  },
]

const initialExampleStates = examples.reduce<Record<string, ExampleState>>((states, example) => {
  states[example.id] = {
    assignments: example.initialAssignments,
    itemOrderByCategoryId: createItemOrderByCategoryId(example, example.initialAssignments),
    selectedItemId: null,
    isChecked: false,
  }

  return states
}, {})

export function CategorizationColumnsExperimentPage() {
  const [exampleStates, setExampleStates] = useState<Record<string, ExampleState>>(() => initialExampleStates)

  function updateExample(exampleId: string, getNextState: (current: ExampleState) => ExampleState) {
    setExampleStates((current) => ({
      ...current,
      [exampleId]: getNextState(current[exampleId]),
    }))
  }

  return (
    <div className="min-h-svh bg-[var(--fr-surface-canvas)] px-[var(--fr-space-4)] py-[var(--fr-space-5)] sm:px-[var(--fr-space-6)] lg:px-[var(--fr-space-8)]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-[var(--fr-space-6)]">
        <header className="flex flex-col gap-[var(--fr-space-3)] border-b border-[var(--fr-border-subtle)] pb-[var(--fr-space-5)]">
          <div className="flex flex-wrap items-center gap-[var(--fr-space-2)]">
            <span className="rounded-[var(--fr-radius-full)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-[var(--fr-space-3)] py-[var(--fr-space-1)] text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-color-sky-600)]">
              Эксперимент
            </span>
            <span className="text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-tertiary)]">
              Финальная часть третьего экрана
            </span>
          </div>
          <div className="grid gap-[var(--fr-space-3)] lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="flex flex-col gap-[var(--fr-space-2)]">
              <h1 className="max-w-[820px] text-pretty text-[length:var(--fr-type-display-sm-size)] font-bold leading-[var(--fr-type-display-sm-line)] tracking-normal text-[var(--fr-text-primary)]">
                Финальная сверка колонками
              </h1>
              <p className="max-w-[680px] text-[length:var(--fr-type-body-md-size)] font-normal leading-[var(--fr-type-body-md-line)] text-[var(--fr-text-secondary)]">
                Моковая версия результата: ответы лежат в колонках по вариантам ответа, а не в итоговой таблице.
              </p>
            </div>
            <div className="rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-[var(--fr-space-3)] shadow-[var(--fr-shadow-sm)]">
              <div className="flex items-center gap-[var(--fr-space-2)] text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-primary)]">
                <ArrowRightLeft aria-hidden="true" className="size-4 text-[var(--fr-color-sky-600)]" />
                Click-to-move
              </div>
              <p className="mt-[var(--fr-space-1)] text-[length:var(--fr-type-caption-md-size)] font-normal leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-secondary)]">
                Выбранный ответ переносится кликом по другой колонке.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-[var(--fr-space-5)]">
          {examples.map((example) => (
            <ColumnCheckExample
              example={example}
              key={example.id}
              onCheck={() =>
                updateExample(example.id, (current) => ({
                  ...current,
                  selectedItemId: null,
                  isChecked: true,
                }))
              }
              onMoveSelectedItem={(categoryId) =>
                updateExample(example.id, (current) => moveSelectedItem(current, categoryId))
              }
              onReset={() =>
                updateExample(example.id, () => ({
                  assignments: example.initialAssignments,
                  itemOrderByCategoryId: createItemOrderByCategoryId(example, example.initialAssignments),
                  selectedItemId: null,
                  isChecked: false,
                }))
              }
              onSelectItem={(itemId) =>
                updateExample(example.id, (current) => ({
                  ...current,
                  selectedItemId: current.selectedItemId === itemId ? null : itemId,
                }))
              }
              state={exampleStates[example.id]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ColumnCheckExample({
  example,
  state,
  onSelectItem,
  onMoveSelectedItem,
  onCheck,
  onReset,
}: {
  example: MockExample
  state: ExampleState
  onSelectItem: (itemId: string) => void
  onMoveSelectedItem: (categoryId: string) => void
  onCheck: () => void
  onReset: () => void
}) {
  const headingId = `${example.id}-title`
  const assignedItemsByCategoryId = useMemo(
    () => getAssignedItemsByCategoryId(example, state.assignments, state.itemOrderByCategoryId),
    [example, state.assignments, state.itemOrderByCategoryId],
  )
  const correctCount = example.items.filter((item) => state.assignments[item.id] === item.correctCategoryId).length

  return (
    <section
      aria-labelledby={headingId}
      className="overflow-hidden rounded-[var(--fr-radius-xl)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] shadow-[var(--fr-shadow-md)]"
    >
      <div className="flex flex-col gap-[var(--fr-space-3)] border-b border-[var(--fr-border-subtle)] bg-[var(--fr-surface-soft)] p-[var(--fr-space-4)] lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-[var(--fr-space-1)]">
          <span className="text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-color-sky-600)]">
            {example.eyebrow}
          </span>
          <h2
            className="text-pretty text-[length:var(--fr-type-heading-md-size)] font-bold leading-[var(--fr-type-heading-md-line)] text-[var(--fr-text-primary)]"
            id={headingId}
          >
            Пример: {example.title}
          </h2>
          <p className="text-[length:var(--fr-type-body-sm-size)] font-normal leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]">
            {example.question}
          </p>
        </div>
        <div className="flex flex-wrap gap-[var(--fr-space-2)]">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-[var(--fr-space-2)] rounded-[var(--fr-radius-full)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-[var(--fr-space-3)] text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-secondary)] shadow-[var(--fr-shadow-sm)] transition-[border-color,color,transform] active:translate-y-px hover:border-[var(--fr-border-strong)] hover:text-[var(--fr-text-primary)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
            onClick={onReset}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Сбросить
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-[var(--fr-space-2)] rounded-[var(--fr-radius-full)] bg-[var(--fr-color-brand-500)] px-[var(--fr-space-4)] text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-inverse)] shadow-[var(--fr-shadow-sm)] transition-[background-color,transform] active:translate-y-px hover:bg-[var(--fr-color-brand-600)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/20"
            onClick={onCheck}
            type="button"
          >
            Проверить
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-[var(--fr-space-3)] p-[var(--fr-space-4)]">
        <div className="flex min-h-6 flex-wrap items-center gap-x-[var(--fr-space-3)] gap-y-[var(--fr-space-1)] text-[length:var(--fr-type-caption-md-size)] font-normal leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-secondary)]">
          <span>
            Колонок: <strong className="font-bold text-[var(--fr-text-primary)]">{example.categories.length}</strong>
          </span>
          {state.selectedItemId ? (
            <span className="text-[var(--fr-color-sky-600)]">
              Выбрано: <strong className="font-bold">{getItemLabel(example, state.selectedItemId)}</strong>
            </span>
          ) : null}
          {state.isChecked ? (
            <span>
              Совпало: <strong className="font-bold text-[var(--fr-text-primary)]">{correctCount}/{example.items.length}</strong>
            </span>
          ) : null}
        </div>

        <div className="overflow-x-auto overscroll-x-contain pb-[var(--fr-space-1)] [scrollbar-width:thin]">
          <div
            className="grid min-w-full gap-[var(--fr-space-3)]"
            style={{
              gridTemplateColumns: `repeat(${example.categories.length}, minmax(12rem, 1fr))`,
              minWidth: `${example.categories.length * 13}rem`,
            }}
          >
            {example.categories.map((category) => (
              <AnswerColumn
                category={category}
                example={example}
                items={assignedItemsByCategoryId[category.id] ?? []}
                key={category.id}
                onMoveSelectedItem={onMoveSelectedItem}
                onSelectItem={onSelectItem}
                selectedItemId={state.selectedItemId}
                state={state}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AnswerColumn({
  example,
  category,
  items,
  state,
  selectedItemId,
  onSelectItem,
  onMoveSelectedItem,
}: {
  example: MockExample
  category: MockCategory
  items: MockItem[]
  state: ExampleState
  selectedItemId: string | null
  onSelectItem: (itemId: string) => void
  onMoveSelectedItem: (categoryId: string) => void
}) {
  const canReceiveSelectedItem = Boolean(selectedItemId && state.assignments[selectedItemId] !== category.id)

  function handleColumnClick() {
    if (canReceiveSelectedItem) {
      onMoveSelectedItem(category.id)
    }
  }

  return (
    <section
      aria-label={`Колонка ${category.label}`}
      className={cn(
        'flex min-h-72 flex-col overflow-hidden rounded-[var(--fr-radius-lg)] border bg-[var(--fr-surface-muted)] transition-[border-color,background-color,box-shadow]',
        getColumnToneClassName(category.tone),
        canReceiveSelectedItem && 'cursor-pointer shadow-[var(--fr-shadow-md)]',
      )}
      onClick={handleColumnClick}
    >
      <div className="flex min-h-[57px] flex-col justify-center gap-[var(--fr-space-1)] border-b border-[var(--fr-border-default)] bg-[#e9edf2] px-[var(--fr-space-3)] py-[var(--fr-space-2)]">
        <div className="flex min-w-0 items-start">
          <h3
            className="overflow-hidden text-[length:var(--fr-type-body-md-size)] font-bold leading-[var(--fr-type-body-md-line)] text-[var(--fr-text-primary)] [overflow-wrap:anywhere]"
            style={COLUMN_HEADER_TITLE_CLAMP_STYLE}
          >
            {category.label}
          </h3>
        </div>
        <p
          className="overflow-hidden text-[length:var(--fr-type-caption-md-size)] font-normal leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-secondary)]"
          style={COLUMN_HEADER_HINT_CLAMP_STYLE}
        >
          {category.hint}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-[var(--fr-space-2)] p-[var(--fr-space-3)]">
        {items.length ? (
          items.map((item) => (
            <AnswerPill
              categoryId={category.id}
              example={example}
              item={item}
              key={item.id}
              onMoveSelectedItem={onMoveSelectedItem}
              onSelectItem={onSelectItem}
              selectedItemId={selectedItemId}
              state={state}
            />
          ))
        ) : (
          <div className="flex min-h-24 flex-1 items-center justify-center rounded-[var(--fr-radius-md)] border border-dashed border-[var(--fr-border-strong)] bg-[var(--fr-surface-card)] px-[var(--fr-space-3)] text-center text-[length:var(--fr-type-caption-md-size)] font-normal leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-tertiary)]">
            Пустая колонка
          </div>
        )}
      </div>

      {canReceiveSelectedItem ? (
        <button
          className="mx-[var(--fr-space-3)] mb-[var(--fr-space-3)] mt-auto inline-flex min-h-10 items-center justify-center rounded-[var(--fr-radius-md)] border border-[var(--fr-color-sky-500)]/40 bg-[var(--fr-color-brand-50)] px-[var(--fr-space-3)] text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-color-sky-600)] transition-[background-color,transform] active:translate-y-px hover:bg-[var(--fr-color-brand-100)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
          onClick={(event) => {
            event.stopPropagation()
            onMoveSelectedItem(category.id)
          }}
          type="button"
        >
          Переместить сюда
        </button>
      ) : null}
    </section>
  )
}

function AnswerPill({
  example,
  item,
  categoryId,
  state,
  selectedItemId,
  onSelectItem,
  onMoveSelectedItem,
}: {
  example: MockExample
  item: MockItem
  categoryId: string
  state: ExampleState
  selectedItemId: string | null
  onSelectItem: (itemId: string) => void
  onMoveSelectedItem: (categoryId: string) => void
}) {
  const isSelected = selectedItemId === item.id
  const isCorrect = categoryId === item.correctCategoryId

  return (
    <button
      aria-label={`${item.label}. Сейчас: ${getCategoryLabel(example, categoryId)}`}
      aria-pressed={isSelected}
      className={cn(
        'group flex min-h-14 w-full items-start rounded-[var(--fr-radius-md)] border bg-[var(--fr-surface-card)] p-[var(--fr-space-3)] text-left shadow-[var(--fr-shadow-sm)] transition-[border-color,background-color,box-shadow,transform] active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15',
        isSelected && 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-brand-50)] shadow-[var(--fr-shadow-md)]',
        !isSelected && 'border-[var(--fr-border-default)] hover:border-[var(--fr-border-strong)] hover:shadow-[var(--fr-shadow-md)]',
        state.isChecked && isCorrect && 'border-[var(--fr-color-learn-correct-500)]/50 bg-[var(--fr-color-learn-correct-50)]',
        state.isChecked && !isCorrect && 'border-[var(--fr-color-learn-almost-500)]/50 bg-[var(--fr-color-learn-almost-50)]',
      )}
      onClick={(event) => {
        event.stopPropagation()
        if (selectedItemId && selectedItemId !== item.id && state.assignments[selectedItemId] !== categoryId) {
          onMoveSelectedItem(categoryId)
          return
        }

        onSelectItem(item.id)
      }}
      type="button"
    >
      <span className="min-w-0 text-[length:var(--fr-type-body-sm-size)] font-bold leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-primary)] [overflow-wrap:anywhere]">
        {item.label}
      </span>
    </button>
  )
}

function moveSelectedItem(current: ExampleState, categoryId: string): ExampleState {
  const itemId = current.selectedItemId

  if (!itemId || current.assignments[itemId] === categoryId) {
    return current
  }

  return {
    ...current,
    assignments: {
      ...current.assignments,
      [itemId]: categoryId,
    },
    itemOrderByCategoryId: moveItemToCategoryEnd(current.itemOrderByCategoryId, itemId, categoryId),
    selectedItemId: null,
  }
}

function createItemOrderByCategoryId(example: MockExample, assignments: Assignments): ItemOrderByCategoryId {
  return example.categories.reduce<ItemOrderByCategoryId>((itemOrderByCategoryId, category) => {
    itemOrderByCategoryId[category.id] = example.items
      .filter((item) => assignments[item.id] === category.id)
      .map((item) => item.id)

    return itemOrderByCategoryId
  }, {})
}

function moveItemToCategoryEnd(
  itemOrderByCategoryId: ItemOrderByCategoryId,
  itemId: string,
  categoryId: string,
): ItemOrderByCategoryId {
  const nextItemOrderByCategoryId = Object.entries(itemOrderByCategoryId).reduce<ItemOrderByCategoryId>(
    (nextOrder, [currentCategoryId, itemIds]) => {
      nextOrder[currentCategoryId] = itemIds.filter((currentItemId) => currentItemId !== itemId)
      return nextOrder
    },
    {},
  )

  nextItemOrderByCategoryId[categoryId] = [...(nextItemOrderByCategoryId[categoryId] ?? []), itemId]

  return nextItemOrderByCategoryId
}

function getAssignedItemsByCategoryId(
  example: MockExample,
  assignments: Assignments,
  itemOrderByCategoryId: ItemOrderByCategoryId,
) {
  const itemById = new Map(example.items.map((item) => [item.id, item]))

  return example.categories.reduce<Record<string, MockItem[]>>((groups, category) => {
    const assignedItems = example.items.filter((item) => assignments[item.id] === category.id)
    const assignedItemIds = new Set(assignedItems.map((item) => item.id))
    const orderedItems = (itemOrderByCategoryId[category.id] ?? []).reduce<MockItem[]>((items, itemId) => {
      const item = itemById.get(itemId)
      if (item && assignedItemIds.has(item.id)) {
        items.push(item)
      }
      return items
    }, [])
    const orderedItemIds = new Set(orderedItems.map((item) => item.id))

    groups[category.id] = [...orderedItems, ...assignedItems.filter((item) => !orderedItemIds.has(item.id))]
    return groups
  }, {})
}

function getItemLabel(example: MockExample, itemId: string) {
  return example.items.find((item) => item.id === itemId)?.label ?? itemId
}

function getCategoryLabel(example: MockExample, categoryId: string) {
  return example.categories.find((category) => category.id === categoryId)?.label ?? categoryId
}

function getColumnToneClassName(tone: MockCategory['tone']) {
  if (tone === 'green') {
    return 'border-[var(--fr-color-learn-correct-500)]/25'
  }

  if (tone === 'amber') {
    return 'border-[var(--fr-color-learn-almost-500)]/25'
  }

  if (tone === 'rose') {
    return 'border-[var(--fr-color-danger-500)]/20'
  }

  return 'border-[var(--fr-color-sky-500)]/25'
}
