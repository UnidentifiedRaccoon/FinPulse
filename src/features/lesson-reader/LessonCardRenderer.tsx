import { useState } from 'react'
import { CheckCircle2, Circle, ExternalLink, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Card } from '@/content/program'
import { cn } from '@/lib/utils'

const cardTypeLabels: Record<Card['type'], string> = {
  theory: 'Теория',
  video: 'Видео',
  callout: 'Заметка',
  single_choice: 'Выбор',
  reflection: 'Рефлексия',
  scenario: 'Сценарий',
  artifact: 'Артефакт',
  checklist: 'Чеклист',
  summary: 'Итог',
}

export function LessonCardRenderer({
  card,
  onCardProgress,
}: {
  card: Card
  onCardProgress?: (cardId: string) => void | Promise<void>
}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground [overflow-wrap:anywhere]">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
          {cardTypeLabels[card.type]}
          {card.sourceSection ? ` · ${card.sourceSection}` : ''}
        </p>
        {card.title ? <h2 className="text-xl font-semibold leading-tight tracking-normal">{card.title}</h2> : null}
        {card.thinkingType || card.develops ? (
          <p className="text-xs leading-5 text-muted-foreground">
            {[card.thinkingType, card.develops].filter(Boolean).join(' · ')}
          </p>
        ) : null}
      </header>

      <CardBody card={card} onCardProgress={onCardProgress} />
    </section>
  )
}

function CardBody({
  card,
  onCardProgress,
}: {
  card: Card
  onCardProgress?: (cardId: string) => void | Promise<void>
}) {
  if (card.type === 'theory') {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-7 text-muted-foreground">{card.body}</p>
        {card.examples ? <PillList items={card.examples} /> : null}
      </div>
    )
  }

  if (card.type === 'video') {
    return (
      <div className="flex flex-col gap-3">
        <a
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          href={card.src}
          rel="noreferrer"
          target="_blank"
        >
          Открыть видео
          <ExternalLink aria-hidden="true" />
        </a>
        {card.timecodes ? (
          <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
            {card.timecodes.map((timecode) => (
              <li className="flex gap-2" key={`${timecode.time}-${timecode.label}`}>
                <span className="font-medium text-foreground">{timecode.time}</span>
                <span>{timecode.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }

  if (card.type === 'callout') {
    return <p className="rounded-lg bg-muted p-3 text-sm leading-6 text-muted-foreground">{card.body}</p>
  }

  if (card.type === 'single_choice') {
    if (!card.readOnly) {
      return (
        <ChoiceInteraction
          cardId={card.id}
          feedback={card.feedback}
          options={card.options}
          question={card.question}
          correctOptionId={card.correctOptionId}
          onCardProgress={onCardProgress}
        />
      )
    }

    return (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-7">{card.question}</p>
        <StaticChoiceList options={card.options} />
        {card.feedback ? <p className="text-sm leading-6 text-muted-foreground">{card.feedback}</p> : null}
      </div>
    )
  }

  if (card.type === 'reflection') {
    if (!card.readOnly) {
      return <ReflectionInteraction card={card} onCardProgress={onCardProgress} />
    }

    return (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-7">{card.prompt}</p>
        {card.options ? <PillList items={card.options} /> : null}
        {card.guidance ? <p className="text-sm leading-6 text-muted-foreground">{card.guidance}</p> : null}
      </div>
    )
  }

  if (card.type === 'scenario') {
    if (!card.readOnly && card.options) {
      return (
        <div className="flex flex-col gap-3">
          <p className="rounded-lg bg-muted p-3 text-sm leading-6 text-muted-foreground">{card.body}</p>
          {card.question ? (
            <ChoiceInteraction
              cardId={card.id}
              feedback={card.feedback}
              options={card.options}
              question={card.question}
              correctOptionId={card.correctOptionId}
              onCardProgress={onCardProgress}
            />
          ) : (
            <ChoiceInteraction
              cardId={card.id}
              feedback={card.feedback}
              options={card.options}
              question="Выбери вариант"
              correctOptionId={card.correctOptionId}
              onCardProgress={onCardProgress}
            />
          )}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        <p className="rounded-lg bg-muted p-3 text-sm leading-6 text-muted-foreground">{card.body}</p>
        {card.question ? <p className="text-base leading-7">{card.question}</p> : null}
        {card.options ? <StaticChoiceList options={card.options} /> : null}
        {card.feedback ? <p className="text-sm leading-6 text-muted-foreground">{card.feedback}</p> : null}
      </div>
    )
  }

  if (card.type === 'artifact') {
    if (!card.readOnly) {
      return <ArtifactInteraction card={card} onCardProgress={onCardProgress} />
    }

    return (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-7 text-muted-foreground">{card.body}</p>
        {card.template ? <StaticChecklist items={card.template} /> : null}
        {card.variants ? <PillList items={card.variants} /> : null}
      </div>
    )
  }

  if (card.type === 'checklist') {
    return (
      <div className="flex flex-col gap-3">
        {card.body ? <p className="text-base leading-7 text-muted-foreground">{card.body}</p> : null}
        <ChecklistInteraction cardId={card.id} items={card.items} onCardProgress={onCardProgress} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {card.body ? <p className="text-base leading-7 text-muted-foreground">{card.body}</p> : null}
      <StaticChecklist items={card.points} checked />
      {card.nextStep ? <p className="text-sm leading-6 text-muted-foreground">{card.nextStep}</p> : null}
    </div>
  )
}

type ChoiceOption = Extract<Card, { type: 'single_choice' }>['options'][number]
type ReflectionCard = Extract<Card, { type: 'reflection' }>
type ArtifactCard = Extract<Card, { type: 'artifact' }>

function ChoiceInteraction({
  cardId,
  question,
  options,
  correctOptionId,
  feedback,
  onCardProgress,
}: {
  cardId: string
  question: string
  options: ChoiceOption[]
  correctOptionId?: string
  feedback?: string
  onCardProgress?: (cardId: string) => void | Promise<void>
}) {
  const [selectedOptionId, setSelectedOptionId] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const correctOption = getCorrectOption(options, correctOptionId)
  const selectedOption = options.find((option) => option.id === selectedOptionId)
  const isCorrect = Boolean(correctOption && selectedOption?.id === correctOption.id)
  const hasObjectiveAnswer = Boolean(correctOption)
  const feedbackId = `${cardId}-choice-feedback`
  const groupName = `${cardId}-choice`

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-7">{question}</p>
      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">{question}</legend>
        <ul className="flex flex-col gap-2">
          {options.map((option) => {
            const isSelected = selectedOptionId === option.id
            const shouldShowStatus = isChecked && isSelected && hasObjectiveAnswer
            const optionIsCorrect = Boolean(correctOption && option.id === correctOption.id)

            return (
              <li key={option.id}>
                <label
                  className={cn(
                    'flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-border px-3 py-2 text-sm leading-6 transition-colors [overflow-wrap:anywhere] hover:bg-muted/60 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
                    isSelected && 'border-primary bg-primary/5 text-foreground',
                    shouldShowStatus && optionIsCorrect && 'border-primary bg-primary/10',
                    shouldShowStatus && !optionIsCorrect && 'border-destructive/60 bg-destructive/5',
                  )}
                >
                  <input
                    aria-describedby={shouldShowStatus ? feedbackId : undefined}
                    checked={isSelected}
                    className="mt-1 size-4 shrink-0 accent-primary"
                    name={groupName}
                    onChange={() => {
                      setSelectedOptionId(option.id)
                      setIsChecked(false)
                    }}
                    type="radio"
                    value={option.id}
                  />
                  <span className="flex flex-col gap-1">
                    <span>{option.label}</span>
                    {shouldShowStatus ? (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 text-xs font-medium',
                          optionIsCorrect ? 'text-primary' : 'text-destructive',
                        )}
                      >
                        {optionIsCorrect ? (
                          <CheckCircle2 aria-hidden="true" className="size-4" />
                        ) : (
                          <XCircle aria-hidden="true" className="size-4" />
                        )}
                        {optionIsCorrect ? 'Верно' : 'Нужно пересмотреть'}
                      </span>
                    ) : null}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>

      <Button
        className="h-auto min-h-11 w-fit whitespace-normal"
        disabled={!selectedOptionId}
        onClick={() => {
          setIsChecked(true)
          void onCardProgress?.(cardId)
        }}
        type="button"
        variant="outline"
      >
        {hasObjectiveAnswer ? 'Проверить ответ' : 'Показать обратную связь'}
      </Button>

      {isChecked && selectedOption ? (
        <div
          aria-live="polite"
          className="flex flex-col gap-2 rounded-lg bg-muted p-3 text-sm leading-6 text-muted-foreground"
          id={feedbackId}
          role="status"
        >
          {hasObjectiveAnswer ? (
            <p className="font-medium text-foreground">
              {isCorrect ? 'Ответ верный.' : 'Это не лучший вариант.'}
            </p>
          ) : null}
          {hasObjectiveAnswer && !isCorrect && correctOption ? (
            <p>
              Лучший вариант: <span className="font-medium text-foreground">{correctOption.label}</span>
            </p>
          ) : null}
          {selectedOption.feedback ? <p>{selectedOption.feedback}</p> : null}
          {feedback ? <p>{feedback}</p> : null}
        </div>
      ) : null}
    </div>
  )
}

function ReflectionInteraction({
  card,
  onCardProgress,
}: {
  card: ReflectionCard
  onCardProgress?: (cardId: string) => void | Promise<void>
}) {
  const [textValue, setTextValue] = useState('')
  const [singleValue, setSingleValue] = useState('')
  const [multiValues, setMultiValues] = useState<string[]>([])
  const inputType = card.inputType ?? 'freeform'
  const guidanceId = card.guidance ? `${card.id}-guidance` : undefined
  const statusId = `${card.id}-local-status`

  if (inputType === 'single_select' && card.options?.length) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-7">{card.prompt}</p>
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">{card.prompt}</legend>
          <ul className="flex flex-col gap-2">
            {card.options.map((option) => (
              <li key={option}>
                <label
                  className={cn(
                    'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm leading-6 transition-colors hover:bg-muted/60 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
                    singleValue === option && 'border-primary bg-primary/5 text-foreground',
                  )}
                >
                  <input
                    aria-describedby={joinIds(guidanceId, statusId)}
                    checked={singleValue === option}
                    className="size-4 shrink-0 accent-primary"
                    name={`${card.id}-reflection`}
                    onChange={() => {
                      setSingleValue(option)
                      void onCardProgress?.(card.id)
                    }}
                    type="radio"
                    value={option}
                  />
                  <span>{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
        <LocalDraftStatus id={statusId} isActive={Boolean(singleValue)} text="Выбор отмечен на этом экране." />
        {card.guidance ? <p className="text-sm leading-6 text-muted-foreground" id={guidanceId}>{card.guidance}</p> : null}
      </div>
    )
  }

  if (inputType === 'multi_select' && card.options?.length) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-7">{card.prompt}</p>
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">{card.prompt}</legend>
          <ul className="flex flex-col gap-2">
            {card.options.map((option) => {
              const isChecked = multiValues.includes(option)

              return (
                <li key={option}>
                  <label
                    className={cn(
                      'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm leading-6 transition-colors hover:bg-muted/60 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
                      isChecked && 'border-primary bg-primary/5 text-foreground',
                    )}
                  >
                    <input
                      aria-describedby={joinIds(guidanceId, statusId)}
                      checked={isChecked}
                      className="size-4 shrink-0 accent-primary"
                      onChange={() => {
                        setMultiValues((current) =>
                          current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
                        )
                        void onCardProgress?.(card.id)
                      }}
                      type="checkbox"
                      value={option}
                    />
                    <span>{option}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
        <LocalDraftStatus
          id={statusId}
          isActive={multiValues.length > 0}
          text={`Выбрано: ${multiValues.length}. Отметки хранятся только на этом экране.`}
        />
        {card.guidance ? <p className="text-sm leading-6 text-muted-foreground" id={guidanceId}>{card.guidance}</p> : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-7">{card.prompt}</p>
      <label className="sr-only" htmlFor={`${card.id}-textarea`}>
        {inputType === 'table' ? 'Заполнить таблицу' : 'Ответ'}
      </label>
      <textarea
        aria-describedby={joinIds(guidanceId, statusId)}
        className="min-h-32 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        id={`${card.id}-textarea`}
        onChange={(event) => setTextValue(event.target.value)}
        onBlur={() => {
          if (textValue.trim().length > 0) {
            void onCardProgress?.(card.id)
          }
        }}
        placeholder={inputType === 'table' ? 'Заполни строки в свободной форме' : 'Напиши ответ здесь'}
        rows={inputType === 'table' ? 6 : 4}
        value={textValue}
      />
      <LocalDraftStatus
        id={statusId}
        isActive={textValue.trim().length > 0}
        text="Черновик заполнен. Он исчезнет при перезагрузке."
      />
      {card.guidance ? <p className="text-sm leading-6 text-muted-foreground" id={guidanceId}>{card.guidance}</p> : null}
    </div>
  )
}

function ArtifactInteraction({
  card,
  onCardProgress,
}: {
  card: ArtifactCard
  onCardProgress?: (cardId: string) => void | Promise<void>
}) {
  const [templateValues, setTemplateValues] = useState(() => card.template?.map(() => '') ?? [''])
  const [checkedRows, setCheckedRows] = useState<string[]>([])
  const [fallbackValue, setFallbackValue] = useState('')
  const [selectedVariant, setSelectedVariant] = useState('')
  const hasTemplate = Boolean(card.template?.length)
  const statusId = `${card.id}-artifact-status`

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-7 text-muted-foreground">{card.body}</p>

      {card.variants?.length ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Вариант</p>
          <div className="flex flex-wrap gap-2">
            {card.variants.map((variant) => (
              <button
                aria-pressed={selectedVariant === variant}
                className={cn(
                  'min-h-11 rounded-full border border-border px-3 py-1 text-sm leading-5 transition-colors hover:bg-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  selectedVariant === variant && 'border-primary bg-primary/10 text-foreground',
                )}
                key={variant}
                onClick={() => {
                  setSelectedVariant((current) => (current === variant ? '' : variant))
                  void onCardProgress?.(card.id)
                }}
                type="button"
              >
                {variant}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {hasTemplate && card.template ? (
        <ul className="flex flex-col gap-3">
          {card.template.map((item, index) => {
            const rowKey = String(index)
            const isChecked = checkedRows.includes(rowKey)

            return (
              <li className="flex flex-col gap-2 rounded-lg border border-border p-3" key={`${item}-${index}`}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium leading-6">
                  <input
                    checked={isChecked}
                    className="size-4 shrink-0 accent-primary"
                    onChange={() => {
                      setCheckedRows((current) =>
                        current.includes(rowKey) ? current.filter((key) => key !== rowKey) : [...current, rowKey],
                      )
                      void onCardProgress?.(card.id)
                    }}
                    type="checkbox"
                  />
                  <span>{item}</span>
                </label>
                <label className="sr-only" htmlFor={`${card.id}-template-${index}`}>
                  {item}
                </label>
                <textarea
                  aria-describedby={statusId}
                  className="min-h-20 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  id={`${card.id}-template-${index}`}
                  onChange={(event) => {
                    const nextValue = event.target.value
                    setTemplateValues((current) =>
                      current.map((value, valueIndex) => (valueIndex === index ? nextValue : value)),
                    )
                  }}
                  onBlur={() => {
                    if (templateValues[index]?.trim()) {
                      void onCardProgress?.(card.id)
                    }
                  }}
                  placeholder="Заполни локально на этом экране"
                  rows={2}
                  value={templateValues[index] ?? ''}
                />
              </li>
            )
          })}
        </ul>
      ) : (
        <>
          <label className="sr-only" htmlFor={`${card.id}-artifact-textarea`}>
            Рабочий ответ
          </label>
          <textarea
            aria-describedby={statusId}
            className="min-h-32 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            id={`${card.id}-artifact-textarea`}
            onChange={(event) => setFallbackValue(event.target.value)}
            onBlur={() => {
              if (fallbackValue.trim().length > 0) {
                void onCardProgress?.(card.id)
              }
            }}
            placeholder="Заполни артефакт здесь"
            rows={4}
            value={fallbackValue}
          />
        </>
      )}

      <LocalDraftStatus
        id={statusId}
        isActive={
          selectedVariant.length > 0 ||
          checkedRows.length > 0 ||
          fallbackValue.trim().length > 0 ||
          templateValues.some((value) => value.trim().length > 0)
        }
        text="Рабочий блок заполнен локально. После перезагрузки он очистится."
      />
    </div>
  )
}

function ChecklistInteraction({
  cardId,
  items,
  onCardProgress,
}: {
  cardId: string
  items: string[]
  onCardProgress?: (cardId: string) => void | Promise<void>
}) {
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const statusId = `${cardId}-checklist-status`

  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => {
          const itemKey = String(index)
          const isChecked = checkedItems.includes(itemKey)

          return (
            <li key={`${item}-${index}`}>
              <label
                className={cn(
                  'flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-border px-3 py-2 text-sm leading-6 transition-colors hover:bg-muted/60 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
                  isChecked && 'border-primary bg-primary/5 text-foreground',
                )}
              >
                <input
                  aria-describedby={statusId}
                  checked={isChecked}
                  className="mt-1 size-4 shrink-0 accent-primary"
                  onChange={() => {
                    setCheckedItems((current) =>
                      current.includes(itemKey)
                        ? current.filter((currentItem) => currentItem !== itemKey)
                        : [...current, itemKey],
                    )
                    void onCardProgress?.(cardId)
                  }}
                  type="checkbox"
                />
                <span>{item}</span>
              </label>
            </li>
          )
        })}
      </ul>
      <p aria-live="polite" className="text-sm leading-6 text-muted-foreground" id={statusId} role="status">
        Отмечено {checkedItems.length} из {items.length}. Отметки хранятся только на этом экране.
      </p>
    </div>
  )
}

function StaticChoiceList({ options }: { options: Array<{ id: string; label: string; isCorrect?: boolean }> }) {
  return (
    <ul className="flex flex-col gap-2">
      {options.map((option) => (
        <li
          className="flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-sm leading-6"
          key={option.id}
        >
          {option.isCorrect ? (
            <CheckCircle2 aria-hidden="true" className="mt-1 text-primary" />
          ) : (
            <Circle aria-hidden="true" className="mt-1 text-muted-foreground" />
          )}
          <span>
            {option.isCorrect ? <span className="sr-only">Правильный ответ: </span> : null}
            {option.label}
          </span>
        </li>
      ))}
    </ul>
  )
}

function StaticChecklist({ items, checked = false }: { items: string[]; checked?: boolean }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li className="flex items-start gap-2 text-sm leading-6 text-muted-foreground" key={item}>
          {checked ? (
            <CheckCircle2 aria-hidden="true" className="mt-1 text-primary" />
          ) : (
            <Circle aria-hidden="true" className="mt-1 text-muted-foreground" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function LocalDraftStatus({ id, isActive, text }: { id: string; isActive: boolean; text: string }) {
  return (
    <p aria-live="polite" className="text-sm leading-6 text-muted-foreground" id={id} role="status">
      {isActive ? text : 'Ответ пока не заполнен.'}
    </p>
  )
}

function PillList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li className="rounded-full bg-muted px-3 py-1 text-xs leading-5 text-muted-foreground" key={item}>
          {item}
        </li>
      ))}
    </ul>
  )
}

function getCorrectOption(options: ChoiceOption[], correctOptionId?: string) {
  if (correctOptionId) {
    return options.find((option) => option.id === correctOptionId)
  }

  return options.find((option) => option.isCorrect)
}

function joinIds(...ids: Array<string | undefined>) {
  const joinedIds = ids.filter(Boolean).join(' ')
  return joinedIds || undefined
}
