/*
 * THESIS: один и тот же эпизод делает различия между девятью учебными действиями наблюдаемыми.
 * OWN-WORLD: знакомый learner-flow ФинПульса — светлый canvas, одна карточка, спокойный feedback, один CTA.
 * STORY: переезд, сверка двух дат, согласованный перенос и строгая граница того, что осталось неизвестным.
 * FIRST VIEWPORT: название способа, короткое обещание, цель и один полностью видимый CTA.
 * FORM: восемь URL-экранов; общая история живёт отдельно от mechanic definition и не может разъехаться по вариантам.
 */
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Info,
  LockKeyhole,
  RotateCcw,
} from 'lucide-react'
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'

import { PracticeMechanic } from '../components/PracticeMechanic'
import { practiceActionLabel } from '../components/practiceMechanicLabels'
import type { LearnerPrompt } from '../learnerLessonCatalog'
import {
  getSameEpisodeMechanic,
  sharedSameEpisode,
} from './sameEpisodeCatalog'

const TOTAL_STEPS = 8

type LessonLocationState = {
  fromLessonStep?: number
}

function lessonPath(slug: string, step: number, search?: URLSearchParams) {
  const query = search?.toString()
  return `/compare/${slug}/${step}${query ? `?${query}` : ''}`
}

function promptKey(prefix: 'practice' | 'checkpoint', prompt: LearnerPrompt) {
  return `${prefix}-${prompt.id}`
}

function readSelection(
  search: URLSearchParams,
  prefix: 'practice' | 'checkpoint',
  prompt: LearnerPrompt,
) {
  const allowed = new Set(prompt.options.map((option) => option.id))
  const raw = search.get(promptKey(prefix, prompt))
  if (!raw) return []
  const values = raw.split(',').filter((value) => allowed.has(value))
  return prompt.mode === 'multiple' ? [...new Set(values)].sort() : values.slice(0, 1)
}

function sameSelection(actual: readonly string[], expected: readonly string[]) {
  if (actual.length !== expected.length) return false
  const actualSet = new Set(actual)
  return expected.every((value) => actualSet.has(value))
}

function labelsFor(prompt: LearnerPrompt, values: readonly string[]) {
  const selected = new Set(values)
  return prompt.options.filter((option) => selected.has(option.id)).map((option) => option.label)
}

function LessonProgress({ current, onBack, title }: { current: number; onBack: () => void; title: string }) {
  const progress = Math.round((current / TOTAL_STEPS) * 100)

  return (
    <header className="user-lesson__progress-header">
      <div className="user-lesson__progress-inner">
        <div className="user-lesson__progress-row">
          <button className="user-lesson__back" onClick={onBack} type="button" aria-label="Назад">
            <ArrowLeft aria-hidden="true" />
          </button>
          <div className="user-lesson__progress-copy"><strong>{title}</strong></div>
          <span className="user-lesson__step-count">{current} из {TOTAL_STEPS}</span>
        </div>
        <div
          aria-label="Прогресс урока"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="user-lesson__progress-track"
          role="progressbar"
        >
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>
    </header>
  )
}

function LessonAction({
  disabled = false,
  icon = 'forward',
  label,
  onClick,
}: {
  disabled?: boolean
  icon?: 'forward' | 'repeat' | 'none'
  label: string
  onClick: () => void
}) {
  return (
    <footer className="user-lesson__action">
      <button className="user-lesson__primary" disabled={disabled} onClick={onClick} type="button">
        <span>{label}</span>
        {icon === 'forward' ? <ArrowRight aria-hidden="true" /> : null}
        {icon === 'repeat' ? <RotateCcw aria-hidden="true" /> : null}
      </button>
    </footer>
  )
}

function StoryCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <article className="user-lesson__card user-lesson__story-card">
      <h1 tabIndex={-1}>{title}</h1>
      <div className="user-lesson__story-copy">{children}</div>
    </article>
  )
}

function ChoiceField({
  onChange,
  prompt,
  value,
}: {
  onChange: (value: string[]) => void
  prompt: LearnerPrompt
  value: string[]
}) {
  const selected = new Set(value)
  const multiple = prompt.mode === 'multiple'

  return (
    <fieldset className="user-lesson__choices">
      <legend>{prompt.legend}</legend>
      <div>
        {prompt.options.map((option) => {
          const isSelected = selected.has(option.id)
          return (
            <label className={isSelected ? 'user-lesson__choice is-selected' : 'user-lesson__choice'} key={option.id}>
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
              <span className="user-lesson__choice-mark" aria-hidden="true">
                {isSelected ? <Check /> : <Circle />}
              </span>
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

export function SameEpisodeLessonPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const headingContainerRef = useRef<HTMLDivElement>(null)
  const mechanic = getSameEpisodeMechanic(params.mechanicSlug ?? '')
  const parsedStep = Number(params.step)
  const step = Number.isInteger(parsedStep) && parsedStep >= 1 && parsedStep <= TOTAL_STEPS ? parsedStep : 1
  const done = searchParams.get('done') === '1'
  const checkpointChecked = searchParams.get('checkpoint-checked') === '1'
  const checkpointPrompt = sharedSameEpisode.checkpoint.prompt

  const practiceAnswers = useMemo(
    () => mechanic?.practice.prompts.map((prompt) => readSelection(searchParams, 'practice', prompt)) ?? [],
    [mechanic, searchParams],
  )
  const checkpointAnswer = useMemo(
    () => readSelection(searchParams, 'checkpoint', checkpointPrompt),
    [checkpointPrompt, searchParams],
  )
  const practiceComplete = Boolean(mechanic) && practiceAnswers.every((answer) => answer.length > 0)
  const practiceExact = mechanic ? mechanic.practice.prompts.every((prompt, index) => (
    sameSelection(practiceAnswers[index] ?? [], prompt.expected)
  )) : false
  const checkpointComplete = checkpointAnswer.length > 0
  const checkpointExact = sameSelection(checkpointAnswer, checkpointPrompt.expected)

  useEffect(() => {
    if (!mechanic) return
    document.title = `${step === 8 && done ? 'Урок завершён' : mechanic.title} · ФинПульс`
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    headingContainerRef.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [done, mechanic, step])

  useEffect(() => {
    if (!mechanic || parsedStep === step) return
    navigate(lessonPath(mechanic.slug, 1), { replace: true })
  }, [mechanic, navigate, parsedStep, step])

  useEffect(() => {
    if (!mechanic) return
    if (step === 5 && !practiceComplete) {
      navigate(lessonPath(mechanic.slug, 4, searchParams), { replace: true })
    }
    if (step === 8 && (!checkpointComplete || !checkpointChecked)) {
      navigate(lessonPath(mechanic.slug, 7, searchParams), { replace: true })
    }
  }, [checkpointChecked, checkpointComplete, mechanic, navigate, practiceComplete, searchParams, step])

  useEffect(() => {
    if (!mechanic || step === 8 || !done) return
    const next = new URLSearchParams(searchParams)
    next.delete('done')
    setSearchParams(next, { replace: true, state: location.state })
  }, [done, location.state, mechanic, searchParams, setSearchParams, step])

  useEffect(() => {
    if (mechanic) return
    navigate('/compare', { replace: true })
  }, [mechanic, navigate])

  if (!mechanic) return null
  const activeMechanic = mechanic

  function goTo(nextStep: number, paramsOverride = searchParams) {
    const next = new URLSearchParams(paramsOverride)
    if (nextStep < 8) next.delete('done')
    navigate(lessonPath(activeMechanic.slug, nextStep, next), { state: { fromLessonStep: step } })
  }

  function updateSelection(
    prefix: 'practice' | 'checkpoint',
    prompt: LearnerPrompt,
    values: string[],
  ) {
    const next = new URLSearchParams(searchParams)
    const key = promptKey(prefix, prompt)
    if (values.length === 0) next.delete(key)
    else next.set(key, [...values].sort().join(','))
    if (prefix === 'checkpoint') next.delete('checkpoint-checked')
    setSearchParams(next, { replace: true, state: location.state })
  }

  function goBack() {
    if (step === 1) {
      navigate('/compare', { replace: true })
      return
    }
    const previousStep = (location.state as LessonLocationState | null)?.fromLessonStep
    if (previousStep === step - 1) {
      navigate(-1)
      return
    }
    const next = new URLSearchParams(searchParams)
    if (step === 8) next.delete('done')
    navigate(lessonPath(activeMechanic.slug, Math.max(1, step - 1), next), { replace: true })
  }

  return (
    <div className={step === 1 ? 'user-lesson user-lesson--entry' : 'user-lesson'} data-kind={mechanic.practice.kind} data-step={step}>
      <a className="skip-link" href="#same-episode-content">К основному содержанию</a>
      {step === 1 ? (
        <header className="user-lesson__entry-header">
          <span className="user-lesson__wordmark">ФинПульс</span>
          <button className="user-lesson__entry-library" onClick={() => navigate('/compare', { replace: true })} type="button">
            <ArrowLeft aria-hidden="true" /> Все способы
          </button>
        </header>
      ) : (
        <LessonProgress current={step} onBack={goBack} title={mechanic.title} />
      )}

      <main className="user-lesson__main" id="same-episode-content" ref={headingContainerRef}>
        {step === 1 ? (
          <section className="user-lesson__entry-screen">
            <p className="user-lesson__meta">Один общий эпизод · {sharedSameEpisode.duration}</p>
            <h1 tabIndex={-1}>{mechanic.title}</h1>
            <p className="user-lesson__lead">{sharedSameEpisode.introLead}</p>
            <section className="user-lesson__goal" aria-labelledby="same-episode-goal-title">
              <h2 id="same-episode-goal-title">Что вы попробуете</h2>
              <p>{mechanic.goal}</p>
            </section>
          </section>
        ) : null}

        {step === 2 ? (
          <StoryCard title={sharedSameEpisode.opening.title}>
            {sharedSameEpisode.opening.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </StoryCard>
        ) : null}

        {step === 3 ? (
          <StoryCard title={sharedSameEpisode.beforeReveal.title}>
            {sharedSameEpisode.beforeReveal.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p className="user-lesson__focus-lead">{sharedSameEpisode.beforeReveal.lead}</p>
            <dl className="user-lesson__evidence">
              {sharedSameEpisode.beforeReveal.facts.map((fact) => (
                <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.body}</dd></div>
              ))}
            </dl>
          </StoryCard>
        ) : null}

        {step === 4 ? (
          <article className="user-lesson__card user-lesson__practice-card">
            <p className="user-lesson__meta">Ответ Тамары</p>
            <div className="user-lesson__scenario"><p>{sharedSameEpisode.reveal}</p></div>
            <h1 tabIndex={-1}>{mechanic.practice.title}</h1>
            <PracticeMechanic
              answers={practiceAnswers}
              onChange={(prompt, value) => updateSelection('practice', prompt, value)}
              practice={mechanic.practice}
            />
          </article>
        ) : null}

        {step === 5 ? (
          <article className={practiceExact ? 'user-lesson__card user-lesson__feedback is-correct' : 'user-lesson__card user-lesson__feedback is-almost'}>
            <div className="user-lesson__feedback-icon" aria-hidden="true">
              {practiceExact ? <CheckCircle2 /> : <Info />}
            </div>
            <h1 tabIndex={-1}>{practiceExact ? mechanic.feedback.successTitle : mechanic.feedback.nuanceTitle}</h1>
            {mechanic.feedback.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="user-lesson__answer-review">
              {mechanic.practice.prompts.map((prompt, index) => {
                const actual = practiceAnswers[index] ?? []
                const exact = sameSelection(actual, prompt.expected)
                return (
                  <div className={exact ? 'is-correct' : 'is-almost'} key={prompt.id}>
                    {exact ? <CheckCircle2 aria-hidden="true" /> : <Info aria-hidden="true" />}
                    <div>
                      <strong>{prompt.legend}</strong>
                      <p>{exact
                        ? labelsFor(prompt, actual).join('; ')
                        : `Точнее здесь: ${labelsFor(prompt, prompt.expected).join('; ')}`}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <dl className="user-lesson__evidence user-lesson__feedback-facts">
              {sharedSameEpisode.outcome.facts.map((fact) => (
                <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.body}</dd></div>
              ))}
            </dl>
          </article>
        ) : null}

        {step === 6 ? (
          <StoryCard title={sharedSameEpisode.outcome.title}>
            {sharedSameEpisode.outcome.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="user-lesson__story-result">
              <strong>Граница эпизода</strong>
              {sharedSameEpisode.outcome.facts.map((fact) => (
                <p key={fact.label}><strong>{fact.label}:</strong> {fact.body}</p>
              ))}
            </div>
          </StoryCard>
        ) : null}

        {step === 7 ? (
          <article className="user-lesson__card user-lesson__practice-card">
            <p className="user-lesson__meta">Тот же эпизод</p>
            <h1 tabIndex={-1}>{sharedSameEpisode.checkpoint.title}</h1>
            <div className="user-lesson__scenario"><p>{sharedSameEpisode.checkpoint.scenario}</p></div>
            <div className="user-lesson__transfer-prompts">
              <ChoiceField
                onChange={(value) => updateSelection('checkpoint', checkpointPrompt, value)}
                prompt={checkpointPrompt}
                value={checkpointAnswer}
              />
            </div>
            {checkpointChecked ? (
              <aside className={checkpointExact ? 'user-lesson__inline-feedback is-correct' : 'user-lesson__inline-feedback is-almost'} aria-live="polite">
                {checkpointExact ? <CheckCircle2 aria-hidden="true" /> : <Info aria-hidden="true" />}
                <div>
                  <strong>{checkpointExact
                    ? sharedSameEpisode.checkpoint.feedback.success
                    : sharedSameEpisode.checkpoint.feedback.nuance}</strong>
                  <p>{sharedSameEpisode.checkpoint.feedback.copy}</p>
                </div>
              </aside>
            ) : null}
          </article>
        ) : null}

        {step === 8 && !done ? (
          <article className="user-lesson__card user-lesson__summary">
            <div className="user-lesson__summary-icon" aria-hidden="true"><CheckCircle2 /></div>
            <p className="user-lesson__meta">Итог</p>
            <h1 tabIndex={-1}>{sharedSameEpisode.summary.title}</h1>
            <dl>
              {sharedSameEpisode.summary.items.map((item) => (
                <div key={item.label}><dt>{item.label}</dt><dd>{item.body}</dd></div>
              ))}
            </dl>
            <p className="user-lesson__disclaimer">{sharedSameEpisode.summary.takeaway}</p>
          </article>
        ) : null}

        {step === 8 && done ? (
          <article className="user-lesson__card user-lesson__complete">
            <div className="user-lesson__complete-icon" aria-hidden="true"><Check /></div>
            <p className="user-lesson__meta">Готово · 8 из 8</p>
            <h1 tabIndex={-1}>Разбор завершён</h1>
            <p>{sharedSameEpisode.summary.takeaway}</p>
            <button
              className="user-lesson__text-action"
              onClick={() => navigate(lessonPath(mechanic.slug, 1), { replace: true })}
              type="button"
            >
              <RotateCcw aria-hidden="true" /> Пройти ещё раз
            </button>
            <p className="user-lesson__privacy"><LockKeyhole aria-hidden="true" /> Ответы не отправлялись и не сохранялись в аккаунте.</p>
          </article>
        ) : null}
      </main>

      {step === 1 ? <LessonAction label="Начать разбор" onClick={() => goTo(2)} /> : null}
      {step === 2 ? <LessonAction label="Продолжить историю" onClick={() => goTo(3)} /> : null}
      {step === 3 ? <LessonAction label="Увидеть ответ Тамары" onClick={() => goTo(4)} /> : null}
      {step === 4 ? (
        <LessonAction
          disabled={!practiceComplete}
          icon="none"
          label={practiceActionLabel(mechanic.practice.kind)}
          onClick={() => goTo(5)}
        />
      ) : null}
      {step === 5 ? <LessonAction label="Вернуться к эпизоду" onClick={() => goTo(6)} /> : null}
      {step === 6 ? <LessonAction label="Проверить границу вывода" onClick={() => goTo(7)} /> : null}
      {step === 7 ? (
        <LessonAction
          disabled={!checkpointComplete}
          icon={checkpointChecked ? 'forward' : 'none'}
          label={checkpointChecked ? 'К итогу' : 'Проверить'}
          onClick={() => {
            if (!checkpointComplete) return
            if (checkpointChecked) goTo(8)
            else {
              const next = new URLSearchParams(searchParams)
              next.set('checkpoint-checked', '1')
              setSearchParams(next, { replace: true, state: location.state })
            }
          }}
        />
      ) : null}
      {step === 8 && !done ? (
        <LessonAction icon="none" label="Завершить" onClick={() => {
          const next = new URLSearchParams(searchParams)
          next.set('done', '1')
          setSearchParams(next, { replace: true, state: location.state })
        }} />
      ) : null}
      {step === 8 && done ? <LessonAction label="Выбрать другой способ" onClick={() => navigate('/compare', { replace: true })} /> : null}
    </div>
  )
}
