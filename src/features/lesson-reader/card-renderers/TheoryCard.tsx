import { ExternalLink } from 'lucide-react'

import type { Card } from '@/content/program'

import { PillList, StaticChecklist } from './shared'

type PassiveCard =
  | Extract<Card, { type: 'theory' }>
  | Extract<Card, { type: 'video' }>
  | Extract<Card, { type: 'callout' }>
  | Extract<Card, { type: 'scenario' }>
  | Extract<Card, { type: 'single_choice' }>
  | Extract<Card, { type: 'summary' }>

export function TheoryCard({ card }: { card: PassiveCard }) {
  if (card.type === 'theory') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base leading-7 text-[var(--fr-text-secondary)]">{card.body}</p>
        {card.examples ? <PillList items={card.examples} /> : null}
      </div>
    )
  }

  if (card.type === 'video') {
    return (
      <div className="flex flex-col gap-4">
        <a
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--fr-color-brand-700)] transition-colors hover:bg-[var(--fr-color-brand-50)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/20"
          href={card.src}
          rel="noreferrer"
          target="_blank"
        >
          Открыть видео
          <ExternalLink aria-hidden="true" />
        </a>
        {card.timecodes ? (
          <ul className="flex flex-col gap-2 text-sm leading-6 text-[var(--fr-text-secondary)]">
            {card.timecodes.map((timecode) => (
              <li className="flex gap-2" key={`${timecode.time}-${timecode.label}`}>
                <span className="font-semibold text-[var(--fr-text-primary)]">{timecode.time}</span>
                <span>{timecode.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }

  if (card.type === 'callout') {
    return (
      <p className="rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-4 text-sm leading-6 text-[var(--fr-text-secondary)]">
        {card.body}
      </p>
    )
  }

  if (card.type === 'summary') {
    return (
      <div className="flex flex-col gap-4">
        {card.body ? <p className="text-base leading-7 text-[var(--fr-text-secondary)]">{card.body}</p> : null}
        <StaticChecklist items={card.points} checked />
        {card.nextStep ? (
          <p className="rounded-2xl bg-[var(--fr-surface-soft)] p-4 text-sm leading-6 text-[var(--fr-text-secondary)]">
            {card.nextStep}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {'body' in card ? (
        <p className="rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-4 text-sm leading-6 text-[var(--fr-text-secondary)]">
          {card.body}
        </p>
      ) : null}
      {'question' in card && card.question ? (
        <p className="text-base leading-7 text-[var(--fr-text-primary)]">{card.question}</p>
      ) : null}
      {'options' in card && card.options ? <StaticChoiceList options={card.options} /> : null}
      {'feedback' in card && card.feedback ? (
        <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">{card.feedback}</p>
      ) : null}
    </div>
  )
}

function StaticChoiceList({ options }: { options: Array<{ id: string; label: string; isCorrect?: boolean }> }) {
  return (
    <ul className="flex flex-col gap-2">
      {options.map((option) => (
        <li
          className="rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-3 text-sm leading-6 text-[var(--fr-text-secondary)]"
          key={option.id}
        >
          {option.label}
        </li>
      ))}
    </ul>
  )
}
