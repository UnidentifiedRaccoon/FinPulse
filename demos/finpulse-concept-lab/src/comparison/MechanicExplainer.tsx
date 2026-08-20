import { ChevronDown } from 'lucide-react'

import type { SameEpisodeMechanic } from './sameEpisodeCatalog'

const stepLabels = ['Что дано', 'Ваше действие', 'Результат рассуждения'] as const

interface MechanicExplainerProps {
  title: string
  explainer: SameEpisodeMechanic['explainer']
}

export function MechanicExplainer({ title, explainer }: MechanicExplainerProps) {
  return (
    <details className="comparison-explainer">
      <summary>
        <span>Как работает способ</span>
        <span className="comparison-explainer__sr-only"> «{title}»</span>
        <ChevronDown aria-hidden="true" />
      </summary>

      <div className="comparison-explainer__content">
        <p className="comparison-explainer__essence">
          <strong>Суть.</strong> {explainer.essence}
        </p>

        <ol
          aria-label={`Схема способа «${title}»`}
          className="comparison-explainer__flow"
          role="list"
        >
          {explainer.steps.map((body, index) => (
            <li key={stepLabels[index]} role="listitem">
              <span>{stepLabels[index]}</span>
              <p>{body}</p>
            </li>
          ))}
        </ol>

        <dl className="comparison-explainer__guidance">
          <div>
            <dt>Когда может пригодиться</dt>
            <dd>{explainer.usefulWhen}</dd>
          </div>
          <div>
            <dt>Ограничение</dt>
            <dd>{explainer.limitation}</dd>
          </div>
        </dl>
      </div>
    </details>
  )
}
