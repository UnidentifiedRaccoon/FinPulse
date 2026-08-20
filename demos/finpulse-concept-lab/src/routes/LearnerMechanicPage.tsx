/*
 * THESIS: девять разных учебных приёмов ощущаются как одна понятная часть ФинПульса.
 * OWN-WORLD: светлый canvas v1, navy-текст, sky-blue действие, одна активная карточка.
 * STORY: короткая сцена ведёт к одному наблюдаемому действию, спокойному разбору и переносу.
 * FIRST VIEWPORT: название, обещание, цель и один CTA; никаких кодов и редакторских пометок.
 * FORM: Operate-mode, восемь URL-экранов, ответы ограничены вариантами и не оцениваются баллом.
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
import { getLearnerLesson } from '../learnerLessonCatalog'
import { NotFoundPage } from './NotFoundPage'

const TOTAL_STEPS = 8

type LessonLocationState = {
  fromLessonStep?: number
}

type LessonOption = {
  id: string
  label: string
  body?: string
}

type LessonPrompt = {
  id: string
  legend: string
  options: readonly LessonOption[]
  expected: readonly string[]
  mode?: 'single' | 'multiple'
}

function lessonPath(slug: string, step: number, search?: URLSearchParams) {
  const query = search?.toString()
  return `/lesson/${slug}/${step}${query ? `?${query}` : ''}`
}

function promptKey(prefix: 'practice' | 'transfer', prompt: LessonPrompt) {
  return `${prefix}-${prompt.id}`
}

function readSelection(search: URLSearchParams, prefix: 'practice' | 'transfer', prompt: LessonPrompt) {
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

function labelsFor(prompt: LessonPrompt, values: readonly string[]) {
  const selected = new Set(values)
  return prompt.options.filter((option) => selected.has(option.id)).map((option) => option.label)
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
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

function PromptField({
  onChange,
  prompt,
  value,
}: {
  onChange: (value: string[]) => void
  prompt: LessonPrompt
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

export function LearnerMechanicPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const headingContainerRef = useRef<HTMLDivElement>(null)
  const lesson = getLearnerLesson(params.lessonSlug ?? '')
  const parsedStep = Number(params.step)
  const step = Number.isInteger(parsedStep) && parsedStep >= 1 && parsedStep <= TOTAL_STEPS ? parsedStep : 1
  const done = searchParams.get('done') === '1'
  const transferChecked = searchParams.get('transfer-checked') === '1'

  const practiceAnswers = useMemo(
    () => lesson?.practice.prompts.map((prompt) => readSelection(searchParams, 'practice', prompt)) ?? [],
    [lesson, searchParams],
  )
  const transferAnswers = useMemo(
    () => lesson?.transfer.prompts.filter(isDefined).map((prompt) => readSelection(searchParams, 'transfer', prompt)) ?? [],
    [lesson, searchParams],
  )

  const practiceComplete = Boolean(lesson) && practiceAnswers.every((answer) => answer.length > 0)
  const transferComplete = Boolean(lesson) && transferAnswers.every((answer) => answer.length > 0)
  const practiceExact = lesson ? lesson.practice.prompts.every((prompt, index) => (
    sameSelection(practiceAnswers[index] ?? [], prompt.expected)
  )) : false
  const transferExact = lesson ? lesson.transfer.prompts.filter(isDefined).every((prompt, index) => (
    sameSelection(transferAnswers[index] ?? [], prompt.expected)
  )) : false

  useEffect(() => {
    if (!lesson) return
    document.title = `${step === 8 && done ? 'Урок завершён' : lesson.title} · ФинПульс`
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    headingContainerRef.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [done, lesson, step])

  useEffect(() => {
    if (!lesson || parsedStep === step) return
    navigate(lessonPath(lesson.slug, 1), { replace: true })
  }, [lesson, navigate, parsedStep, step])

  useEffect(() => {
    if (!lesson) return
    if (step === 5 && !practiceComplete) {
      navigate(lessonPath(lesson.slug, 4, searchParams), { replace: true })
    }
    if (step === 8 && !transferComplete) {
      navigate(lessonPath(lesson.slug, 7, searchParams), { replace: true })
    }
  }, [lesson, navigate, practiceAnswers, practiceComplete, searchParams, step, transferComplete])

  if (!lesson) return <NotFoundPage />

  const activeLesson = lesson

  function goTo(nextStep: number, paramsOverride = searchParams) {
    const next = new URLSearchParams(paramsOverride)
    navigate(lessonPath(activeLesson.slug, nextStep, next), { state: { fromLessonStep: step } })
  }

  function updateSelection(prefix: 'practice' | 'transfer', prompt: LessonPrompt, values: string[]) {
    const next = new URLSearchParams(searchParams)
    const key = promptKey(prefix, prompt)
    if (values.length === 0) next.delete(key)
    else next.set(key, [...values].sort().join(','))
    if (prefix === 'transfer') next.delete('transfer-checked')
    setSearchParams(next, { replace: true, state: location.state })
  }

  function goBack() {
    if (step === 1) {
      navigate('/lab')
      return
    }
    const previousStep = (location.state as LessonLocationState | null)?.fromLessonStep
    if (previousStep === step - 1) {
      navigate(-1)
      return
    }
    navigate(lessonPath(activeLesson.slug, Math.max(1, step - 1), searchParams), { replace: true })
  }

  return (
    <div className={step === 1 ? 'user-lesson user-lesson--entry' : 'user-lesson'} data-kind={lesson.practice.kind} data-step={step}>
      <a className="skip-link" href="#user-lesson-content">К основному содержанию</a>
      {step === 1 ? (
        <header className="user-lesson__entry-header">
          <span className="user-lesson__wordmark">ФинПульс</span>
          <button className="user-lesson__entry-library" onClick={() => navigate('/lab')} type="button">
            <ArrowLeft aria-hidden="true" /> Все уроки
          </button>
        </header>
      ) : (
        <LessonProgress current={step} onBack={goBack} title={lesson.title} />
      )}

      <main className="user-lesson__main" id="user-lesson-content" ref={headingContainerRef}>
        {step === 1 ? (
          <section className="user-lesson__entry-screen">
            <p className="user-lesson__meta">Короткий урок · {lesson.duration}</p>
            <h1 tabIndex={-1}>{lesson.title}</h1>
            <p className="user-lesson__lead">{lesson.introLead}</p>
            <section className="user-lesson__goal" aria-labelledby="lesson-goal-title">
              <h2 id="lesson-goal-title">Цель урока</h2>
              <p>{lesson.goal}</p>
            </section>
          </section>
        ) : null}

        {step === 2 ? (
          <StoryCard title={lesson.story.title}>
            {lesson.story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </StoryCard>
        ) : null}

        {step === 3 ? (
          <article className="user-lesson__card user-lesson__focus-card">
            <h1 tabIndex={-1}>{lesson.focus.title}</h1>
            <p className="user-lesson__focus-lead">{lesson.focus.lead}</p>
            <dl className="user-lesson__evidence">
              {lesson.focus.items.map((item) => (
                <div key={item.label}><dt>{item.label}</dt><dd>{item.body}</dd></div>
              ))}
            </dl>
          </article>
        ) : null}

        {step === 4 ? (
          <article className="user-lesson__card user-lesson__practice-card">
            <p className="user-lesson__meta">Практика</p>
            <h1 tabIndex={-1}>{lesson.practice.title}</h1>
            {lesson.practice.notice ? (
              <div className="user-lesson__scenario user-lesson__scenario--notice">
                <strong>Вариант для сравнения</strong><p>{lesson.practice.notice}</p>
              </div>
            ) : null}
            <PracticeMechanic
              answers={practiceAnswers}
              onChange={(prompt, value) => updateSelection('practice', prompt, value)}
              practice={lesson.practice}
            />
          </article>
        ) : null}

        {step === 5 ? (
          <article className={practiceExact ? 'user-lesson__card user-lesson__feedback is-correct' : 'user-lesson__card user-lesson__feedback is-almost'}>
            <div className="user-lesson__feedback-icon" aria-hidden="true">
              {practiceExact ? <CheckCircle2 /> : <Info />}
            </div>
            <h1 tabIndex={-1}>{practiceExact ? lesson.feedback.successTitle : lesson.feedback.nuanceTitle}</h1>
            {lesson.feedback.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="user-lesson__answer-review">
              {lesson.practice.prompts.map((prompt, index) => {
                const actual = practiceAnswers[index] ?? []
                const exact = sameSelection(actual, prompt.expected)
                return (
                  <div className={exact ? 'is-correct' : 'is-almost'} key={prompt.id}>
                    {exact ? <CheckCircle2 aria-hidden="true" /> : <Info aria-hidden="true" />}
                    <div>
                      <strong>{prompt.legend}</strong>
                      <p>
                        {exact
                          ? labelsFor(prompt, actual).join('; ')
                          : `Точнее здесь: ${labelsFor(prompt, prompt.expected).join('; ')}`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            {lesson.feedback.facts.length > 0 ? (
              <dl className="user-lesson__evidence user-lesson__feedback-facts">
                {lesson.feedback.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.body}</dd></div>)}
              </dl>
            ) : null}
          </article>
        ) : null}

        {step === 6 ? (
          <StoryCard title={lesson.outcome.title}>
            {lesson.outcome.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {lesson.outcome.resultItems?.length ? (
              <div className="user-lesson__story-result">
                <strong>{lesson.outcome.resultLabel ?? 'Что изменилось'}</strong>
                {lesson.outcome.resultItems.map((item) => (
                  <p key={item.label}><strong>{item.label}:</strong> {item.body}</p>
                ))}
              </div>
            ) : null}
          </StoryCard>
        ) : null}

        {step === 7 ? (
          <article className="user-lesson__card user-lesson__practice-card">
            <p className="user-lesson__meta">Похожая ситуация</p>
            <h1 tabIndex={-1}>{lesson.transfer.title}</h1>
            <div className="user-lesson__scenario"><p>{lesson.transfer.scenario}</p></div>
            <div className="user-lesson__transfer-prompts">
              {lesson.transfer.prompts.filter(isDefined).map((prompt, index) => (
                <PromptField
                  key={prompt.id}
                  onChange={(value) => updateSelection('transfer', prompt, value)}
                  prompt={prompt}
                  value={transferAnswers[index] ?? []}
                />
              ))}
            </div>
            {transferChecked ? (
              <aside className={transferExact ? 'user-lesson__inline-feedback is-correct' : 'user-lesson__inline-feedback is-almost'} aria-live="polite">
                {transferExact ? <CheckCircle2 aria-hidden="true" /> : <Info aria-hidden="true" />}
                <div>
                  <strong>{transferExact ? lesson.transfer.feedback.success : lesson.transfer.feedback.nuance}</strong>
                  <p>{lesson.transfer.feedback.copy}</p>
                </div>
              </aside>
            ) : null}
            {transferChecked ? (
              <div className="user-lesson__answer-review">
                {lesson.transfer.prompts.filter(isDefined).map((prompt, index) => {
                  const actual = transferAnswers[index] ?? []
                  const exact = sameSelection(actual, prompt.expected)
                  return (
                    <div className={exact ? 'is-correct' : 'is-almost'} key={prompt.id}>
                      {exact ? <CheckCircle2 aria-hidden="true" /> : <Info aria-hidden="true" />}
                      <div>
                        <strong>{prompt.legend}</strong>
                        <p>
                          {exact
                            ? labelsFor(prompt, actual).join('; ')
                            : `Точнее в этой ситуации: ${labelsFor(prompt, prompt.expected).join('; ')}`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </article>
        ) : null}

        {step === 8 && !done ? (
          <article className="user-lesson__card user-lesson__summary">
            <div className="user-lesson__summary-icon" aria-hidden="true"><CheckCircle2 /></div>
            <p className="user-lesson__meta">Итог</p>
            <h1 tabIndex={-1}>{lesson.summary.title}</h1>
            <dl>
              {lesson.summary.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.body}</dd></div>)}
            </dl>
            <p className="user-lesson__disclaimer">{lesson.summary.takeaway}</p>
          </article>
        ) : null}

        {step === 8 && done ? (
          <article className="user-lesson__card user-lesson__complete">
            <div className="user-lesson__complete-icon" aria-hidden="true"><Check /></div>
            <p className="user-lesson__meta">Готово · 8 из 8</p>
            <h1 tabIndex={-1}>Урок завершён</h1>
            <p>{lesson.summary.takeaway}</p>
            <button
              className="user-lesson__text-action"
              onClick={() => navigate(lessonPath(lesson.slug, 1))}
              type="button"
            >
              <RotateCcw aria-hidden="true" /> Пройти ещё раз
            </button>
            <p className="user-lesson__privacy"><LockKeyhole aria-hidden="true" /> Ответы не отправлялись и не сохранялись в аккаунте.</p>
          </article>
        ) : null}
      </main>

      {step === 1 ? <LessonAction label={lesson.startLabel} onClick={() => goTo(2)} /> : null}
      {step === 2 ? <LessonAction label="Продолжить" onClick={() => goTo(3)} /> : null}
      {step === 3 ? <LessonAction label="Попробовать" onClick={() => goTo(4)} /> : null}
      {step === 4 ? (
        <LessonAction
          disabled={!practiceComplete}
          icon="none"
          label={practiceActionLabel(lesson.practice.kind)}
          onClick={() => goTo(5)}
        />
      ) : null}
      {step === 5 ? <LessonAction label="Продолжить историю" onClick={() => goTo(6)} /> : null}
      {step === 6 ? <LessonAction label="Попробовать на другой ситуации" onClick={() => goTo(7)} /> : null}
      {step === 7 ? (
        <LessonAction
          disabled={!transferComplete}
          icon={transferChecked ? 'forward' : 'none'}
          label={transferChecked ? 'К итогу' : 'Проверить'}
          onClick={() => {
            if (!transferComplete) return
            if (transferChecked) goTo(8)
            else {
              const next = new URLSearchParams(searchParams)
              next.set('transfer-checked', '1')
              setSearchParams(next, { replace: true, state: location.state })
            }
          }}
        />
      ) : null}
      {step === 8 && !done ? <LessonAction icon="none" label="Завершить" onClick={() => {
        const next = new URLSearchParams(searchParams)
        next.set('done', '1')
        setSearchParams(next, { replace: true, state: location.state })
      }} /> : null}
      {step === 8 && done ? <LessonAction label="Выбрать другой урок" onClick={() => navigate('/lab')} /> : null}
    </div>
  )
}
