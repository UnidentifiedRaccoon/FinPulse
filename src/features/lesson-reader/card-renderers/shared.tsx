import { Fragment, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { Check, CheckCircle2, Circle } from 'lucide-react'

import type { Card } from '@/content/program'
import { cn } from '@/lib/utils'

import { parseRichText, splitRichTextParagraphs } from './richText'

type CardStatistics = NonNullable<Card['statistics']>

const noBreakNumberUnitPattern =
  /~?\d+(?:[ \u00A0]\d{3})+(?:[ \u00A0]+(?:₽(?:[ \u00A0]+в[ \u00A0]+(?:месяц|день|неделю|год))?|месяц(?:а|ев)?|мес\.|день|дня|дней|трат(?:а|ы)?|зарплат(?:а|ы)?))?|~?\d+(?:[–-]\d+)?[ \u00A0]+(?:₽(?:[ \u00A0]+в[ \u00A0]+(?:месяц|день|неделю|год))?|месяц(?:а|ев)?|мес\.|день|дня|дней|трат(?:а|ы)?|зарплат(?:а|ы)?)/g

export function NoBreakText({ text }: { text: string }) {
  const parts = splitNoBreakNumberUnits(text)

  return (
    <>
      {parts.map((part, index) =>
        part.noBreak ? (
          <span className="whitespace-nowrap" key={`${part.text}-${index}`}>
            {part.text}
          </span>
        ) : (
          part.text
        ),
      )}
    </>
  )
}

export function RichText({ text }: { text: string }) {
  const segments = parseRichText(text)

  return (
    <>
      {segments.map((segment, index) => {
        const key = `${segment.kind}-${index}-${segment.text}`

        if (segment.kind === 'text') {
          return (
            <Fragment key={key}>
              <NoBreakText text={segment.text} />
            </Fragment>
          )
        }

        if (segment.kind === 'strong') {
          return (
            <strong className="font-semibold" key={key}>
              <NoBreakText text={segment.text} />
            </strong>
          )
        }

        if (segment.kind === 'emphasis') {
          return (
            <em className="italic" key={key}>
              <NoBreakText text={segment.text} />
            </em>
          )
        }

        if (segment.kind === 'underline') {
          return (
            <u className="underline underline-offset-2" key={key}>
              <NoBreakText text={segment.text} />
            </u>
          )
        }

        if (segment.kind === 'link') {
          return (
            <a
              className="font-semibold text-[var(--fr-color-sky-600)] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fr-color-sky-500)]"
              href={segment.href}
              key={key}
              rel="noreferrer"
              target="_blank"
            >
              <NoBreakText text={segment.text} />
            </a>
          )
        }

        return null
      })}
    </>
  )
}

export function RichTextParagraphs({
  text,
  as = 'p',
  className,
  paragraphClassName,
}: {
  text: string
  as?: 'p' | 'span' | 'div'
  className?: string
  paragraphClassName?: string
}) {
  const paragraphs = splitRichTextParagraphs(text)
  const Component = as
  const renderedParagraphs = paragraphs.flatMap((paragraph, index) => [
    <Component
      className={cn(as === 'span' && 'block', paragraphClassName)}
      key={`${index}-${paragraph}`}
    >
      <RichText text={paragraph} />
    </Component>,
    as === 'span' && index < paragraphs.length - 1 ? <Fragment key={`${index}-separator`}> </Fragment> : null,
  ])

  if (!renderedParagraphs.length) return null

  if (className) {
    return <div className={className}>{renderedParagraphs}</div>
  }

  return <>{renderedParagraphs}</>
}

function splitNoBreakNumberUnits(text: string) {
  const parts: Array<{ text: string; noBreak: boolean }> = []
  let cursor = 0

  for (const match of text.matchAll(noBreakNumberUnitPattern)) {
    const matchText = match[0]
    const index = match.index ?? 0

    if (index > cursor) {
      parts.push({ text: text.slice(cursor, index), noBreak: false })
    }

    parts.push({ text: matchText, noBreak: true })
    cursor = index + matchText.length
  }

  if (cursor < text.length) {
    parts.push({ text: text.slice(cursor), noBreak: false })
  }

  return parts.length > 0 ? parts : [{ text, noBreak: false }]
}

export function StatisticsPanel({ statistics }: { statistics: CardStatistics }) {
  const title = statistics.title ?? 'Статистика'

  return (
    <aside className="rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-[var(--fr-space-4)]">
      <h3 className="text-[length:var(--fr-type-caption-sm-size)] font-bold uppercase leading-[var(--fr-type-caption-sm-line)] tracking-normal text-[var(--fr-color-sky-600)]">
        {title}
      </h3>
      <dl className="mt-[var(--fr-space-3)] flex flex-col gap-[var(--fr-space-3)]">
        {statistics.items.map((item) => (
          <div
            className="grid grid-cols-[minmax(4.5rem,max-content)_minmax(0,1fr)] gap-[var(--fr-space-3)] rounded-[var(--fr-radius-md)] bg-[var(--fr-surface-card)] px-[var(--fr-space-3)] py-[var(--fr-space-2)]"
            key={`${item.value}-${item.label}`}
          >
            <dt className="text-[length:var(--fr-type-body-md-size)] font-bold leading-[var(--fr-type-body-md-line)] text-[var(--fr-text-primary)]">
              <NoBreakText text={item.value} />
            </dt>
            <dd className="min-w-0 text-pretty text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]">
              <RichTextParagraphs text={item.label} />
            </dd>
          </div>
        ))}
      </dl>
      {statistics.sources?.length ? (
        <RichTextParagraphs
          paragraphClassName="mt-[var(--fr-space-3)] text-pretty text-[length:var(--fr-type-caption-md-size)] leading-[var(--fr-type-caption-md-line)] text-[var(--fr-text-tertiary)]"
          text={`Источники: ${statistics.sources.join('; ')}.`}
        />
      ) : null}
    </aside>
  )
}

export function PillList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-[var(--fr-space-2)]">
      {items.map((item) => (
        <li
          className="inline-flex min-h-9 max-w-full items-center rounded-[var(--fr-radius-full)] bg-[var(--fr-surface-soft)] px-[var(--fr-space-3)] py-[var(--fr-space-2)] text-[length:var(--fr-type-body-sm-size)] font-semibold leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]"
          key={item}
        >
          <NoBreakText text={item} />
        </li>
      ))}
    </ul>
  )
}

export function StaticChecklist({
  items,
  checked = false,
  richText = false,
}: {
  items: string[]
  checked?: boolean
  richText?: boolean
}) {
  return (
    <ul className="flex flex-col gap-[var(--fr-space-2)]">
      {items.map((item) => (
        <li
          className="grid min-h-12 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-[var(--fr-space-3)] rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-soft)] px-[var(--fr-space-3)] py-[var(--fr-space-2)] text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]"
          key={item}
        >
          {checked ? (
            <CheckCircle2 aria-hidden="true" className="shrink-0 text-[var(--fr-color-learn-correct-500)]" />
          ) : (
            <Circle aria-hidden="true" className="shrink-0 text-[var(--fr-text-tertiary)]" />
          )}
          <span>
            {richText ? (
              <RichTextParagraphs
                as="span"
                className="flex min-w-0 flex-col gap-[var(--fr-space-1)]"
                text={item}
              />
            ) : (
              <NoBreakText text={item} />
            )}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function StaticChoiceList({ options }: { options: Array<{ id: string; label: string; isCorrect?: boolean }> }) {
  return (
    <ul className="flex flex-col gap-[var(--fr-space-2)]">
      {options.map((option) => (
        <li
          className={cn(
            'grid min-h-12 grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-[var(--fr-space-3)] rounded-[var(--fr-radius-lg)] border px-[var(--fr-space-3)] py-[var(--fr-space-2)] text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)]',
            option.isCorrect
              ? 'border-[var(--fr-color-learn-correct-500)]/30 bg-[var(--fr-color-learn-correct-50)] text-[var(--fr-text-primary)]'
              : 'border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] text-[var(--fr-text-secondary)]',
          )}
          key={option.id}
        >
          {option.isCorrect ? (
            <CheckCircle2 aria-hidden="true" className="shrink-0 text-[var(--fr-color-learn-correct-500)]" />
          ) : (
            <Circle aria-hidden="true" className="shrink-0 text-[var(--fr-text-tertiary)]" />
          )}
          <span>
            {option.isCorrect ? <span className="sr-only">Подходящий вариант: </span> : null}
            <NoBreakText text={option.label} />
          </span>
        </li>
      ))}
    </ul>
  )
}

type SelectableOptionState = 'default' | 'selected' | 'correct' | 'retry'

export function SelectableOption({
  children,
  inputProps,
  state = 'default',
  className,
}: {
  children: ReactNode
  inputProps: InputHTMLAttributes<HTMLInputElement>
  state?: SelectableOptionState
  className?: string
}) {
  const { className: inputClassName, type = 'radio', checked, ...restInputProps } = inputProps
  const isCheckbox = type === 'checkbox'
  const isChecked = Boolean(checked)
  const isMarked = isChecked || state === 'correct' || state === 'retry'

  return (
    <label
      className={cn(
        'group relative grid min-h-15 cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-3 rounded-2xl border bg-[var(--fr-surface-card)] px-4 py-3 text-[15px] leading-6 text-[var(--fr-text-secondary)] shadow-[var(--fr-shadow-sm)] transition-[background-color,border-color,box-shadow,transform] duration-200 [overflow-wrap:anywhere] hover:border-[var(--fr-border-strong)] hover:bg-[var(--fr-surface-soft)] active:translate-y-px focus-within:ring-4 focus-within:ring-[var(--fr-color-brand-500)]/15',
        state === 'selected' && 'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-brand-50)] text-[var(--fr-text-primary)]',
        state === 'correct' &&
          'border-[var(--fr-color-learn-correct-500)]/60 bg-[var(--fr-color-learn-correct-50)] text-[var(--fr-text-primary)]',
        state === 'retry' &&
          'border-[var(--fr-color-learn-almost-500)]/60 bg-[var(--fr-color-learn-almost-50)] text-[var(--fr-text-primary)]',
        className,
      )}
    >
      <input
        checked={checked}
        className={cn('peer absolute size-px -m-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]', inputClassName)}
        type={type}
        {...restInputProps}
      />
      <span
        aria-hidden="true"
        className={cn(
          'flex size-5 shrink-0 items-center justify-center self-center border text-[var(--fr-text-tertiary)] transition-[background-color,border-color,color] duration-200',
          isCheckbox ? 'rounded-md' : 'rounded-full',
          !isMarked && 'border-[var(--fr-border-strong)] bg-[var(--fr-surface-card)]',
          isMarked &&
            state !== 'correct' &&
            state !== 'retry' &&
            'border-[var(--fr-color-sky-500)] bg-[var(--fr-color-sky-500)] text-[var(--fr-text-inverse)]',
          state === 'correct' &&
            'border-[var(--fr-color-learn-correct-500)] bg-[var(--fr-color-learn-correct-500)] text-[var(--fr-text-inverse)]',
          state === 'retry' &&
            'border-[var(--fr-color-learn-almost-500)] bg-[var(--fr-color-learn-almost-500)] text-[var(--fr-surface-card)]',
        )}
      >
        {isCheckbox || state === 'correct' ? (
          isMarked ? <Check aria-hidden="true" className="size-3.5" /> : null
        ) : state === 'retry' ? (
          <span className="text-xs font-bold leading-none">!</span>
        ) : isMarked ? (
          <span className="size-2 rounded-full bg-current" />
        ) : null}
      </span>
      <span className="block min-w-0 text-pretty">
        {typeof children === 'string' ? <NoBreakText text={children} /> : children}
      </span>
    </label>
  )
}

export function CustomOptionTextarea({
  describedBy,
  id,
  label = 'Мой вариант',
  onValueChange,
  placeholder = 'Заполни здесь',
  rows = 3,
  value,
}: {
  describedBy?: string
  id: string
  label?: string
  onValueChange: (value: string) => void
  placeholder?: string
  rows?: TextareaHTMLAttributes<HTMLTextAreaElement>['rows']
  value: string
}) {
  return (
    <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-3">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-describedby={describedBy}
        autoFocus
        className="min-h-20 w-full resize-y rounded-xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] px-3 py-2 text-sm leading-6 text-[var(--fr-text-primary)] outline-none transition placeholder:text-[var(--fr-text-tertiary)] focus-visible:border-[var(--fr-color-brand-500)] focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/15"
        id={id}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    </div>
  )
}
