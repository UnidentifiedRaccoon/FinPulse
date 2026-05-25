import { CheckCircle2, Circle, ExternalLink } from 'lucide-react'

import type { Card } from '@/content/program'

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

export function LessonCardRenderer({ card }: { card: Card }) {
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

      <CardBody card={card} />
    </section>
  )
}

function CardBody({ card }: { card: Card }) {
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
    return (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-7">{card.question}</p>
        <ChoiceList options={card.options} />
        {card.feedback ? <p className="text-sm leading-6 text-muted-foreground">{card.feedback}</p> : null}
      </div>
    )
  }

  if (card.type === 'reflection') {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-7">{card.prompt}</p>
        {card.options ? <PillList items={card.options} /> : null}
        {card.guidance ? <p className="text-sm leading-6 text-muted-foreground">{card.guidance}</p> : null}
      </div>
    )
  }

  if (card.type === 'scenario') {
    return (
      <div className="flex flex-col gap-3">
        <p className="rounded-lg bg-muted p-3 text-sm leading-6 text-muted-foreground">{card.body}</p>
        {card.question ? <p className="text-base leading-7">{card.question}</p> : null}
        {card.options ? <ChoiceList options={card.options} /> : null}
        {card.feedback ? <p className="text-sm leading-6 text-muted-foreground">{card.feedback}</p> : null}
      </div>
    )
  }

  if (card.type === 'artifact') {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-base leading-7 text-muted-foreground">{card.body}</p>
        {card.template ? <Checklist items={card.template} /> : null}
        {card.variants ? <PillList items={card.variants} /> : null}
      </div>
    )
  }

  if (card.type === 'checklist') {
    return (
      <div className="flex flex-col gap-3">
        {card.body ? <p className="text-base leading-7 text-muted-foreground">{card.body}</p> : null}
        <Checklist items={card.items} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {card.body ? <p className="text-base leading-7 text-muted-foreground">{card.body}</p> : null}
      <Checklist items={card.points} checked />
      {card.nextStep ? <p className="text-sm leading-6 text-muted-foreground">{card.nextStep}</p> : null}
    </div>
  )
}

function ChoiceList({ options }: { options: Array<{ id: string; label: string; isCorrect?: boolean }> }) {
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

function Checklist({ items, checked = false }: { items: string[]; checked?: boolean }) {
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
