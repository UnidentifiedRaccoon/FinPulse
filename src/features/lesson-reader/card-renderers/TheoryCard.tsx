import type { ReactNode } from 'react'

import type { Card } from '@/content/program'

import { NoBreakText, PillList, StaticChecklist, StaticChoiceList } from './shared'

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
        <TextParagraphs paragraphs={splitParagraphs(card.body)} size="sm" />
      </ExplanatorySurface>
    )
  }

  if (card.type === 'summary') {
    return (
      <div className="flex flex-col gap-[var(--fr-space-5)]">
        {card.body ? <ExplanatoryBlock body={card.body} /> : null}
        <StaticChecklist items={card.points} checked />
        {card.nextStep ? (
          <ExplanatorySurface tone="soft">
            <p className="text-[length:var(--fr-type-caption-md-size)] font-bold leading-[var(--fr-type-caption-md-line)] text-[var(--fr-color-sky-600)]">
              Следующий шаг
            </p>
            <p className="mt-[var(--fr-space-2)] text-pretty text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]">
              <NoBreakText text={card.nextStep} />
            </p>
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
        <p className="text-pretty text-[length:var(--fr-type-body-lg-size)] font-semibold leading-[var(--fr-type-body-lg-line)] text-[var(--fr-text-primary)]">
          <NoBreakText text={card.question} />
        </p>
      ) : null}
      {'options' in card && card.options ? <StaticChoiceList options={card.options} /> : null}
      {'feedback' in card && card.feedback ? (
        <ExplanatorySurface tone="soft">
          <p className="text-pretty text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]">
            <NoBreakText text={card.feedback} />
          </p>
        </ExplanatorySurface>
      ) : null}
    </div>
  )
}

function ExplanatoryBlock({ body, examples }: { body: string; examples?: string[] }) {
  const blocks = getExplanatoryBlocks(splitParagraphs(body))

  return (
    <div className="flex flex-col gap-[var(--fr-space-5)]">
      {blocks.map((block) =>
        block.type === 'insight' ? (
          <InsightPanel key={block.text} text={block.text} />
        ) : (
          <TextParagraphs key={block.paragraphs.join('\n')} paragraphs={block.paragraphs} />
        ),
      )}
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

function InsightPanel({ text }: { text: string }) {
  const calculation = getCalculationSteps(text)
  const label = getInsightLabel(text)
  const body = getInsightBody(text, Boolean(calculation))

  return (
    <ExplanatorySurface>
      <p className="text-[length:var(--fr-type-caption-sm-size)] font-bold uppercase leading-[var(--fr-type-caption-sm-line)] tracking-normal text-[var(--fr-color-sky-600)]">
        {label}
      </p>
      {calculation ? <CalculationSteps steps={calculation.steps} operators={calculation.operators} /> : null}
      {body ? (
        <p className="mt-[var(--fr-space-3)] text-pretty text-[length:var(--fr-type-body-sm-size)] font-medium leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-primary)]">
          <NoBreakText text={body} />
        </p>
      ) : null}
    </ExplanatorySurface>
  )
}

function CalculationSteps({ steps, operators }: { steps: string[]; operators: string[] }) {
  return (
    <div className="fr-calculation-container mt-[var(--fr-space-3)]" data-step-count={steps.length}>
      <div className="fr-calculation-steps" data-step-count={steps.length}>
        {steps.map((step, index) => (
          <CalculationFragment index={index} key={`${step}-${index}`} operators={operators} step={step} steps={steps} />
        ))}
      </div>
    </div>
  )
}

function CalculationFragment({
  step,
  steps,
  index,
  operators,
}: {
  step: string
  steps: string[]
  index: number
  operators: string[]
}) {
  const isResult = index === steps.length - 1
  const operator = operators[index]

  return (
    <>
      <div
        className={
          isResult
            ? 'fr-calculation-step fr-calculation-step--result'
            : 'fr-calculation-step'
        }
      >
        <NoBreakText text={step} />
      </div>
      {operator ? (
        <span className="fr-calculation-operator">
          {operator}
        </span>
      ) : null}
    </>
  )
}

function TextParagraphs({
  paragraphs,
  size = 'lg',
}: {
  paragraphs: string[]
  size?: 'lg' | 'sm'
}) {
  if (paragraphs.length === 0) return null

  return (
    <div className="flex flex-col gap-[var(--fr-space-4)]">
      {paragraphs.map((paragraph) => (
        <p
          className={
            size === 'lg'
              ? 'text-pretty text-[length:var(--fr-type-body-lg-size)] leading-[var(--fr-type-body-lg-line)] text-[var(--fr-text-secondary)]'
              : 'text-pretty text-[length:var(--fr-type-body-sm-size)] leading-[var(--fr-type-body-sm-line)] text-[var(--fr-text-secondary)]'
          }
          key={paragraph}
        >
          <NoBreakText text={paragraph} />
        </p>
      ))}
    </div>
  )
}

function splitParagraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

type ExplanatoryBlockItem = { type: 'text'; paragraphs: string[] } | { type: 'insight'; text: string }

function getExplanatoryBlocks(paragraphs: string[]) {
  const blocks: ExplanatoryBlockItem[] = []
  let textGroup: string[] = []

  for (const paragraph of paragraphs) {
    if (!isInsightParagraph(paragraph)) {
      textGroup.push(paragraph)
      continue
    }

    if (textGroup.length > 0) {
      blocks.push({ type: 'text', paragraphs: textGroup })
      textGroup = []
    }

    blocks.push({ type: 'insight', text: paragraph })
  }

  if (textGroup.length > 0) {
    blocks.push({ type: 'text', paragraphs: textGroup })
  }

  return blocks
}

function isInsightParagraph(paragraph: string) {
  return /^(Факт|Формула|Пример|Простой тест)/i.test(paragraph) || /формула/i.test(paragraph)
}

function getInsightLabel(text: string) {
  if (/формула/i.test(text)) return 'Формула'
  if (/пример/i.test(text)) return 'Пример'
  if (/тест/i.test(text)) return 'Проверка'
  return 'Расчёт'
}

function getInsightBody(text: string, hasCalculation: boolean) {
  const cleanText = text.replace(/^(Факт из сценария урока|Факт из сценария|Формула простая|Пример из сценария|Простой тест из сценария):\s*/i, '')

  if (!hasCalculation) return cleanText

  const [, ...rest] = cleanText.split(/\. +/)
  return rest.join('. ').trim()
}

function getCalculationSteps(text: string) {
  const compact = text.replace(/\s+/g, ' ')

  if (/5 трат/i.test(compact) && /200 ₽/.test(compact) && /30 000 ₽/.test(compact)) {
    return {
      steps: ['5 трат', '200 ₽', '30 дней', '30 000 ₽'],
      operators: ['×', '×', '='],
    }
  }

  if (/подушка\s*=|расходы\s*×\s*3/i.test(compact)) {
    return {
      steps: ['обязательные расходы', '3-6 месяцев', 'подушка'],
      operators: ['×', '='],
    }
  }

  return null
}
