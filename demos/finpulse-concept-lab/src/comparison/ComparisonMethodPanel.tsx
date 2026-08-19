import { Check, RotateCcw } from 'lucide-react'

import { PracticeMechanic } from '../components/PracticeMechanic'
import type { LearnerPrompt } from '../learnerLessonCatalog'
import {
  mechanicIsComplete,
  mechanicIsExact,
  sameAnswerValues,
} from './comparisonAnswerState'
import {
  comparisonMechanicEntries,
  type ComparisonMechanic,
  type ComparisonMechanicSlug,
  mechanicPrompts,
} from './comparisonMechanics'

interface ComparisonMethodPanelProps {
  answers: readonly string[][]
  mechanic: ComparisonMechanic
  onAnswer: (prompt: LearnerPrompt, values: string[]) => void
  onClear: () => void
  onMechanicChange: (slug: ComparisonMechanicSlug) => void
  onReveal: () => void
  otherSlug: ComparisonMechanicSlug
  revealed: boolean
  side: 'first' | 'second'
}

function ConclusionChoice({
  answer,
  mechanic,
  onAnswer,
}: {
  answer: readonly string[]
  mechanic: Extract<ComparisonMechanic, { renderer: 'conclusion' }>
  onAnswer: (prompt: LearnerPrompt, values: string[]) => void
}) {
  return (
    <section aria-label="Точное изменение вывода" className="same-story-conclusion">
      <fieldset>
        <legend>{mechanic.prompt.legend}</legend>
        <div className="same-story-conclusion__options">
          {mechanic.prompt.options.map((option) => {
            const selected = answer.includes(option.id)
            return (
              <label className={selected ? 'is-selected' : ''} key={option.id}>
                <input
                  checked={selected}
                  name={mechanic.prompt.id}
                  onChange={() => onAnswer(mechanic.prompt, [option.id])}
                  type="radio"
                  value={option.id}
                />
                <span aria-hidden="true" />
                {option.label}
              </label>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}

export function ComparisonMethodPanel({
  answers,
  mechanic,
  onAnswer,
  onClear,
  onMechanicChange,
  onReveal,
  otherSlug,
  revealed,
  side,
}: ComparisonMethodPanelProps) {
  const complete = mechanicIsComplete(mechanic, answers)
  const exact = mechanicIsExact(mechanic, answers)
  const prompts = mechanicPrompts(mechanic)
  const ordinal = side === 'first' ? 'Первый способ' : 'Второй способ'

  return (
    <article className="same-story-method" data-side={side}>
      <header className="same-story-method__header">
        <label>
          <span>{ordinal}</span>
          <select
            aria-label={`${ordinal}: выберите способ`}
            onChange={(event) => onMechanicChange(event.target.value as ComparisonMechanicSlug)}
            value={mechanic.slug}
          >
            {comparisonMechanicEntries.map((option) => (
              <option disabled={option.slug === otherSlug} key={option.slug} value={option.slug}>
                {option.shortTitle}{option.slug === otherSlug ? ' — уже выбран' : ''}
              </option>
            ))}
          </select>
        </label>
        <p>{mechanic.task}</p>
      </header>

      <div className="same-story-method__body">
        {mechanic.renderer === 'practice' ? (
          <PracticeMechanic answers={answers} onChange={onAnswer} practice={mechanic.practice} />
        ) : (
          <ConclusionChoice
            answer={answers[0] ?? []}
            mechanic={mechanic}
            onAnswer={onAnswer}
          />
        )}
      </div>

      <footer className="same-story-method__footer">
        <button
          className="same-story-primary"
          disabled={!complete || revealed}
          onClick={onReveal}
          type="button"
        >
          <Check aria-hidden="true" />
          {revealed ? 'Разбор показан' : 'Показать разбор'}
        </button>
        {answers.some((answer) => answer.length > 0) ? (
          <button className="same-story-clear" onClick={onClear} type="button">
            <RotateCcw aria-hidden="true" />
            Очистить ответы
          </button>
        ) : null}
      </footer>

      <div aria-live="polite" aria-atomic="true" className="same-story-announcer">
        {revealed
          ? `${exact ? 'Сверка совпала' : 'Есть нюанс'}. ${exact ? mechanic.feedback.successTitle : mechanic.feedback.nuanceTitle}`
          : ''}
      </div>

      {revealed ? (
        <section
          className={`same-story-feedback ${exact ? 'is-exact' : 'has-nuance'}`}
        >
          <p className="same-story-feedback__status">{exact ? 'Сверка совпала' : 'Есть нюанс'}</p>
          <h3>{exact ? mechanic.feedback.successTitle : mechanic.feedback.nuanceTitle}</h3>
          <p>{mechanic.feedback.explanation}</p>
          {!exact ? (
            <ul className="same-story-feedback__corrections">
              {prompts.map((prompt, index) => {
                if (sameAnswerValues(answers[index] ?? [], prompt.expected)) return null
                const expectedLabels = prompt.expected
                  .map((id) => prompt.options.find((option) => option.id === id)?.label)
                  .filter((label): label is string => Boolean(label))
                return (
                  <li key={prompt.id}>
                    <span>{prompt.legend}</span>
                    <strong>Точнее: {expectedLabels.join(', ')}.</strong>
                    <span>{mechanic.rationales[prompt.id] ?? mechanic.feedback.explanation}</span>
                  </li>
                )
              })}
            </ul>
          ) : null}
          <dl>
            <div>
              <dt>Подтверждено</dt>
              <dd>{mechanic.feedback.supported}</dd>
            </div>
            <div>
              <dt>Осталось открытым</dt>
              <dd>{mechanic.feedback.open}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </article>
  )
}
