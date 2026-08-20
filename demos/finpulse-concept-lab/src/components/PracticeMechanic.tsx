import type {
  LearnerLabelBodyItem,
  LearnerPracticeScreen,
  LearnerPrompt,
} from '../learnerLessonCatalog'

interface PracticeMechanicProps {
  answers: readonly string[][]
  onChange: (prompt: LearnerPrompt, values: string[]) => void
  practice: LearnerPracticeScreen
  presentation?: PracticeMechanicPresentation
}

export interface PracticeMechanicPresentation {
  deadlineStepLabels?: readonly string[]
  deadlineTimelineLabels?: readonly [string, string, string]
  threadAriaLabel?: string
  threadStepLabels?: readonly string[]
}

interface ChoiceClusterProps {
  onChange: (values: string[]) => void
  prompt: LearnerPrompt
  value: readonly string[]
  variant: string
}

function ChoiceCluster({ onChange, prompt, value, variant }: ChoiceClusterProps) {
  const selected = new Set(value)
  const multiple = prompt.mode === 'multiple'

  return (
    <fieldset className={`practice-mechanic__choice-cluster practice-mechanic__choice-cluster--${variant}`}>
      <legend>{prompt.legend}</legend>
      <div className="practice-mechanic__choice-list">
        {prompt.options.map((option) => {
          const isSelected = selected.has(option.id)

          return (
            <label className={isSelected ? 'is-selected' : ''} key={option.id}>
              <input
                checked={isSelected}
                name={prompt.id}
                onChange={() => {
                  if (!multiple) {
                    onChange([option.id])
                    return
                  }

                  const next = new Set(value)
                  if (isSelected) next.delete(option.id)
                  else next.add(option.id)
                  onChange([...next].sort())
                }}
                type={multiple ? 'checkbox' : 'radio'}
                value={option.id}
              />
              <span aria-hidden="true" className="practice-mechanic__choice-dot" />
              <span>
                {option.label}
                {option.body ? <small>{option.body}</small> : null}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function ContextCards({ className, items }: { className: string; items: readonly LearnerLabelBodyItem[] }) {
  if (items.length === 0) return null

  return (
    <div className={className}>
      {items.map((item) => (
        <article key={item.label}>
          <strong>{item.label}</strong>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  )
}

export function PracticeMechanic({ answers, onChange, practice, presentation }: PracticeMechanicProps) {
  const choice = (prompt: LearnerPrompt, index: number, variant: string) => (
    <ChoiceCluster
      key={prompt.id}
      onChange={(values) => onChange(prompt, values)}
      prompt={prompt}
      value={answers[index] ?? []}
      variant={variant}
    />
  )

  if (practice.kind === 'status') {
    return (
      <section aria-label="Разметка сведений" className="practice-mechanic practice-mechanic--status">
        <p className="practice-mechanic__instruction">Для каждой фразы выберите её статус в этой точке истории.</p>
        <div className="practice-mechanic__status-board">
          {practice.prompts.map((prompt, index) => choice(prompt, index, 'status'))}
        </div>
      </section>
    )
  }

  if (practice.kind === 'sources') {
    return (
      <section aria-label="Источники и их ответы" className="practice-mechanic practice-mechanic--sources">
        <p className="practice-mechanic__instruction">Соедините каждый след с ролью, которую он выполняет в проверке.</p>
        <div className="practice-mechanic__dossier">
          {practice.prompts.map((prompt, index) => (
            <article className="practice-mechanic__dossier-card" key={prompt.id}>
              <div className="practice-mechanic__source-tab">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{practice.contextItems[index]?.label ?? `Источник ${index + 1}`}</strong>
                  {practice.contextItems[index]?.body ? <p>{practice.contextItems[index].body}</p> : null}
                </div>
              </div>
              {choice(prompt, index, 'source')}
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (practice.kind === 'comparison') {
    return (
      <section aria-label="Сравнение двух путей" className="practice-mechanic practice-mechanic--comparison">
        <ContextCards className="practice-mechanic__split-view" items={practice.contextItems} />
        <div className="practice-mechanic__delta-list">
          <p className="practice-mechanic__instruction">Отметьте только то, что следует из одного изменённого условия.</p>
          {practice.prompts.map((prompt, index) => choice(prompt, index, 'delta'))}
        </div>
      </section>
    )
  }

  if (practice.kind === 'roles') {
    return (
      <section aria-label="Карта ролей" className="practice-mechanic practice-mechanic--roles">
        <p className="practice-mechanic__instruction">Пройдите по действиям сцены и верните каждое тому, кто его выполнил.</p>
        <div className="practice-mechanic__role-map">
          {practice.prompts.map((prompt, index) => (
            <div className="practice-mechanic__role-row" key={prompt.id}>
              <span aria-hidden="true" className="practice-mechanic__role-index">{index + 1}</span>
              {choice(prompt, index, 'role')}
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (practice.kind === 'thread') {
    return (
      <section aria-label={presentation?.threadAriaLabel ?? 'Два вопроса и два ответа'} className="practice-mechanic practice-mechanic--thread">
        <ContextCards className="practice-mechanic__thread-moments" items={practice.contextItems} />
        <ol className="practice-mechanic__thread-line">
          {practice.prompts.map((prompt, index) => (
            <li key={prompt.id}>
              <span aria-hidden="true" className="practice-mechanic__thread-node" />
              <div>
                <small>{presentation?.threadStepLabels?.[index] ?? (index < 2 ? `Источник для шага ${index + 1}` : 'Граница ответа')}</small>
                {choice(prompt, index, 'thread')}
              </div>
            </li>
          ))}
        </ol>
      </section>
    )
  }

  if (practice.kind === 'revision') {
    const revisionLabels = ['Первый вывод', 'Что добавилось', 'Итоговый вывод']

    return (
      <section aria-label="Уточнение вывода" className="practice-mechanic practice-mechanic--revision">
        <ContextCards className="practice-mechanic__revision-sources" items={practice.contextItems} />
        <ol className="practice-mechanic__revision-stack">
          {practice.prompts.map((prompt, index) => (
            <li key={prompt.id}>
              <span>{revisionLabels[index] ?? `Шаг ${index + 1}`}</span>
              {choice(prompt, index, 'revision')}
            </li>
          ))}
        </ol>
      </section>
    )
  }

  if (practice.kind === 'evidence') {
    return (
      <section aria-label="Проверка известных фактов" className="practice-mechanic practice-mechanic--evidence">
        <p className="practice-mechanic__instruction">Проверьте каждое звено. Неподтверждённое звено не исчезает — оно показывает границу вывода.</p>
        <ol className="practice-mechanic__evidence-chain">
          {practice.prompts.map((prompt, index) => (
            <li key={prompt.id}>
              <span aria-hidden="true" className="practice-mechanic__evidence-node">{index + 1}</span>
              {choice(prompt, index, 'evidence')}
            </li>
          ))}
        </ol>
      </section>
    )
  }

  const deadlineTimelineLabels = presentation?.deadlineTimelineLabels
    ?? ['Проверка', 'Изменение плана', 'Жилищная дата']

  return (
    <section aria-label="Сравнение сроков" className="practice-mechanic practice-mechanic--deadline">
      <ContextCards className="practice-mechanic__deadline-tracks" items={practice.contextItems} />
      <div aria-hidden="true" className="practice-mechanic__timeline">
        <span>{deadlineTimelineLabels[0]}</span><i /><span>{deadlineTimelineLabels[1]}</span><i /><span>{deadlineTimelineLabels[2]}</span>
      </div>
      <ol className="practice-mechanic__deadline-decisions">
        {practice.prompts.map((prompt, index) => (
          <li key={prompt.id}>
            <span>{presentation?.deadlineStepLabels?.[index] ?? (index === 0 ? 'Поставьте проверку' : 'Ограничьте вывод')}</span>
            {choice(prompt, index, 'deadline')}
          </li>
        ))}
      </ol>
    </section>
  )
}
