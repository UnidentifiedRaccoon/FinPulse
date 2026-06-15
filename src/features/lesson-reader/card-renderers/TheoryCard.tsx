import type { ReactNode } from 'react'

import type { Card } from '@/content/program'

import { PillList, RichTextParagraphs, StaticChecklist, StaticChoiceList } from './shared'

type PassiveCard =
  | Extract<Card, { type: 'theory' }>
  | Extract<Card, { type: 'callout' }>
  | Extract<Card, { type: 'scenario' }>
  | Extract<Card, { type: 'single_choice' }>
  | Extract<Card, { type: 'summary' }>

export function TheoryCard({ card }: { card: PassiveCard }) {
  if (card.type === 'theory') {
    return <ExplanatoryBlock body={card.body} examples={card.examples} />
  }

  if (card.type === 'callout') {
    return (
      <ExplanatorySurface>
        <RichTextParagraphs
          className="flex flex-col gap-[var(--fr-space-4)]"
          paragraphClassName="text-pretty text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]"
          text={card.body}
        />
      </ExplanatorySurface>
    )
  }

  if (card.type === 'summary') {
    return (
      <div className="flex flex-col gap-[var(--fr-space-5)]">
        {card.body ? <ExplanatoryBlock body={card.body} /> : null}
        <StaticChecklist items={card.points} checked richText />
        {card.nextStep ? (
          <ExplanatorySurface tone="soft">
            <p className="text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-color-sky-600)]">
              Следующий шаг
            </p>
            <RichTextParagraphs
              className="mt-[var(--fr-space-2)] flex flex-col gap-[var(--fr-space-2)]"
              paragraphClassName="text-pretty text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]"
              text={card.nextStep}
            />
          </ExplanatorySurface>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[var(--fr-space-5)]">
      {'body' in card ? (
        <ExplanatoryBlock body={card.body} />
      ) : null}
      {'question' in card && card.question ? (
        <RichTextParagraphs
          paragraphClassName="text-pretty text-[length:var(--fr-type-body-lg-size)] font-semibold leading-[var(--fr-type-body-lg-line)] text-[var(--fr-text-primary)]"
          text={card.question}
        />
      ) : null}
      {'options' in card && card.options ? <StaticChoiceList options={card.options} /> : null}
      {'feedback' in card && card.feedback ? (
        <ExplanatorySurface tone="soft">
          <RichTextParagraphs
            className="flex flex-col gap-[var(--fr-space-2)]"
            paragraphClassName="text-pretty text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]"
            text={card.feedback}
          />
        </ExplanatorySurface>
      ) : null}
    </div>
  )
}

function ExplanatoryBlock({ body, examples }: { body: string; examples?: string[] }) {
  return (
    <div className="flex flex-col gap-[var(--fr-space-5)]">
      <RichTextParagraphs
        className="flex flex-col gap-[var(--fr-space-4)]"
        paragraphClassName="text-pretty text-[length:var(--fr-type-body-lg-size)] leading-[var(--fr-type-body-lg-line)] text-[var(--fr-text-secondary)]"
        text={body}
      />
      {examples?.length ? <PillList items={examples} /> : null}
    </div>
  )
}

function ExplanatorySurface({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'soft'
}) {
  return (
    <div
      className={
        tone === 'soft'
          ? 'rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-subtle)] bg-[var(--fr-surface-soft)] p-[var(--fr-space-4)]'
          : 'rounded-[var(--fr-radius-lg)] border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-[var(--fr-space-4)]'
      }
    >
      {children}
    </div>
  )
}
