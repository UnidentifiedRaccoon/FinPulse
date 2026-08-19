/*
 * THESIS: один понятный учебный маршрут вместо каталога исследовательских версий.
 * OWN-WORLD: светлый canvas v1, navy-текст, sky-blue действие, одна белая смысловая карточка.
 * STORY: человек читает решение Саши, проверяет предел одного нового факта и переносит правило.
 * FIRST VIEWPORT: слово ФинПульс, короткий контекст, цель урока и один CTA «Начать».
 * FORM: Operate-mode, восьмиэкранный focus shell с прогрессом и закреплённым действием.
 */
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Info,
  RotateCcw,
} from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'

import {
  chapterThreeDecision,
  chapterThreeGoalAndOffer,
  chapterThreeHousingPayoff,
  chapterThreeJointCheck,
} from '../demoContent'

const TOTAL_STEPS = 8

type PrimaryAnswer = 'timing' | 'principal' | 'suitable'
type TransferAnswer = 'bounded' | 'replace' | 'guarantee'

const primaryOptions: Array<{ id: PrimaryAnswer; label: string }> = [
  {
    id: 'timing',
    label: 'Подтверждён только срок получения доступного остатка.',
  },
  {
    id: 'principal',
    label: 'Вся внесённая сумма точно сохранится.',
  },
  {
    id: 'suitable',
    label: 'Предложение точно подходит Саше.',
  },
]

const transferOptions: Array<{ id: TransferAnswer; label: string }> = [
  {
    id: 'bounded',
    label: 'Обсудить небольшой тест и сохранить основной план.',
  },
  {
    id: 'replace',
    label: 'Заменить им основной план всей постановки.',
  },
  {
    id: 'guarantee',
    label: 'Считать, что он точно ускорит подготовку к премьере.',
  },
]

function isPrimaryAnswer(value: string | null): value is PrimaryAnswer {
  return value === 'timing' || value === 'principal' || value === 'suitable'
}

function isTransferAnswer(value: string | null): value is TransferAnswer {
  return value === 'bounded' || value === 'replace' || value === 'guarantee'
}

function stepPath(step: number, query?: Record<string, string>) {
  const pathname = step === 1 ? '/' : `/lesson/${step}`
  const search = new URLSearchParams(query).toString()
  return search ? `${pathname}?${search}` : pathname
}

function LessonProgress({ current, onBack }: { current: number; onBack: () => void }) {
  const progress = Math.round((current / TOTAL_STEPS) * 100)

  return (
    <header className="user-lesson__progress-header">
      <div className="user-lesson__progress-inner">
        <div className="user-lesson__progress-row">
          <button className="user-lesson__back" onClick={onBack} type="button" aria-label="Назад">
            <ArrowLeft aria-hidden="true" />
          </button>
          <div className="user-lesson__progress-copy">
            <strong>Деньги нужны к сроку</strong>
          </div>
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

function ChoiceList<T extends string>({
  legend,
  onChange,
  options,
  value,
}: {
  legend: string
  onChange: (value: T) => void
  options: Array<{ id: T; label: string }>
  value?: T
}) {
  return (
    <fieldset className="user-lesson__choices">
      <legend>{legend}</legend>
      <div>
        {options.map((option) => {
          const selected = value === option.id
          return (
            <label className={selected ? 'user-lesson__choice is-selected' : 'user-lesson__choice'} key={option.id}>
              <input
                checked={selected}
                name={legend}
                onChange={() => onChange(option.id)}
                type="radio"
                value={option.id}
              />
              <span className="user-lesson__choice-mark" aria-hidden="true">
                {selected ? <Check /> : <Circle />}
              </span>
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
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

function FeedbackCard({ answer }: { answer?: PrimaryAnswer }) {
  const correct = answer === 'timing'
  const title = correct ? 'Именно так' : 'Есть нюанс'
  const lead =
    answer === 'principal'
      ? 'Новый факт говорит о сроке получения доступного остатка, но не подтверждает сохранность всей внесённой суммы.'
      : answer === 'suitable'
        ? 'Подтверждённый срок доступа не доказывает, что предложение подходит Саше.'
        : 'Новый факт отвечает только на вопрос о сроке.'

  return (
    <article
      aria-live="polite"
      className={correct ? 'user-lesson__card user-lesson__feedback is-correct' : 'user-lesson__card user-lesson__feedback is-almost'}
    >
      <div className="user-lesson__feedback-icon" aria-hidden="true">
        {correct ? <CheckCircle2 /> : <Info />}
      </div>
      <h1 tabIndex={-1}>{title}</h1>
      <p>{lead}</p>
      <p>
        Повторяемость результата, возможные потери и сохранность суммы всё ещё не подтверждены. Решение остаётся за
        Сашей.
      </p>
    </article>
  )
}

function TransferFeedback({ answer }: { answer?: TransferAnswer }) {
  if (!answer) {
    return null
  }

  const correct = answer === 'bounded'
  const copy =
    answer === 'replace'
      ? 'Два свойства нового приёма не дают оснований заменять им весь план постановки.'
      : answer === 'guarantee'
        ? 'Пригодность для новичков и возможность отмены не доказывают, что приём ускорит всю подготовку.'
        : 'Можно обсудить небольшой обратимый тест, не делая выводов о результате всей постановки.'

  return (
    <aside
      aria-live="polite"
      className={correct ? 'user-lesson__inline-feedback is-correct' : 'user-lesson__inline-feedback is-almost'}
    >
      {correct ? <CheckCircle2 aria-hidden="true" /> : <Info aria-hidden="true" />}
      <div>
        <strong>{correct ? 'Верно' : 'Есть нюанс'}</strong>
        <p>{copy}</p>
      </div>
    </aside>
  )
}

export function UserTestLessonPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const headingContainerRef = useRef<HTMLDivElement>(null)
  const parsedStep = Number(params.step ?? 1)
  const step = Number.isInteger(parsedStep) && parsedStep >= 1 && parsedStep <= TOTAL_STEPS ? parsedStep : 1
  const primaryAnswer = isPrimaryAnswer(searchParams.get('answer')) ? searchParams.get('answer') as PrimaryAnswer : undefined
  const transferAnswer = isTransferAnswer(searchParams.get('transfer'))
    ? searchParams.get('transfer') as TransferAnswer
    : undefined
  const transferChecked = searchParams.get('checked') === '1'
  const done = searchParams.get('done') === '1'

  useEffect(() => {
    document.title = `${step === 8 && done ? 'Урок завершён' : 'Деньги нужны к сроку'} · ФинПульс`
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    headingContainerRef.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [done, step])

  useEffect(() => {
    if (step === 5 && !primaryAnswer) {
      navigate('/lesson/4', { replace: true })
    }
  }, [navigate, primaryAnswer, step])

  function goTo(nextStep: number, query?: Record<string, string>) {
    navigate(stepPath(nextStep, query))
  }

  function updateSearch(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    }
    setSearchParams(next, { replace: true })
  }

  function goBack() {
    if (step === 2) {
      goTo(1)
      return
    }
    if (step === 5 && primaryAnswer) {
      goTo(4, { answer: primaryAnswer })
      return
    }
    if (step === 6 && primaryAnswer) {
      goTo(5, { answer: primaryAnswer })
      return
    }
    if (step === 8 && transferAnswer) {
      goTo(7, { transfer: transferAnswer, checked: '1' })
      return
    }
    goTo(Math.max(1, step - 1))
  }

  return (
    <div className={step === 1 ? 'user-lesson user-lesson--entry' : 'user-lesson'} data-step={step}>
      <a className="skip-link" href="#user-lesson-content">К основному содержанию</a>
      {step === 1 ? (
        <header className="user-lesson__entry-header">
          <span className="user-lesson__wordmark">ФинПульс</span>
        </header>
      ) : (
        <LessonProgress current={step} onBack={goBack} />
      )}

      <main className="user-lesson__main" id="user-lesson-content" ref={headingContainerRef}>
        {step === 1 ? (
          <section className="user-lesson__entry-screen">
            <p className="user-lesson__meta">Короткий урок · 4 минуты</p>
            <h1 tabIndex={-1}>Деньги нужны к сроку</h1>
            <p className="user-lesson__lead">
              Саша отложил деньги на жильё. Лера показывает рекламу, где обещают быстро увеличить часть суммы.
            </p>
            <section className="user-lesson__goal" aria-labelledby="lesson-goal-title">
              <h2 id="lesson-goal-title">Цель урока</h2>
              <p>Отделять подтверждённый факт от более широкого вывода.</p>
            </section>
          </section>
        ) : null}

        {step === 2 ? (
          <StoryCard title="Эти деньги уже были нужны для жилья">
            <p>{chapterThreeGoalAndOffer[0]}</p>
            <p>{chapterThreeGoalAndOffer[1]}</p>
            <p>{chapterThreeGoalAndOffer[2]}</p>
          </StoryCard>
        ) : null}

        {step === 3 ? (
          <StoryCard title="Один удачный пример оставил вопросы">
            <p>{chapterThreeJointCheck[0]}</p>
            <p>{chapterThreeJointCheck[2]}</p>
            <dl className="user-lesson__evidence">
              <div>
                <dt>Удалось подтвердить</dt>
                <dd>Цифры относились к прошлому периоду.</dd>
              </div>
              <div>
                <dt>Осталось неизвестно</dt>
                <dd>Повторится ли результат и получится ли забрать всю сумму к сроку.</dd>
              </div>
            </dl>
          </StoryCard>
        ) : null}

        {step === 4 ? (
          <article className="user-lesson__card user-lesson__practice-card">
            <h1 tabIndex={-1}>Что теперь можно сказать?</h1>
            <div className="user-lesson__scenario">
              <strong>Представим другой вариант</strong>
              <p>Источник подтвердил: доступный остаток можно получить к дате решения по жилью.</p>
            </div>
            <ChoiceList
              legend="Какой вывод поддерживает новый факт?"
              onChange={(value) => updateSearch({ answer: value })}
              options={primaryOptions}
              value={primaryAnswer}
            />
          </article>
        ) : null}

        {step === 5 ? <FeedbackCard answer={primaryAnswer} /> : null}

        {step === 6 ? (
          <StoryCard title="Как решил Саша">
            {chapterThreeDecision.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <div className="user-lesson__story-result">
              <strong>Позже</strong>
              <p>{chapterThreeHousingPayoff[2]}</p>
              <p>{chapterThreeHousingPayoff[3]}</p>
            </div>
          </StoryCard>
        ) : null}

        {step === 7 ? (
          <article className="user-lesson__card user-lesson__practice-card">
            <p className="user-lesson__meta">Похожая ситуация без денег</p>
            <h1 tabIndex={-1}>Что можно обсудить, а что всё ещё неизвестно?</h1>
            <div className="user-lesson__scenario">
              <p>
                Команда обсуждает новый сценический приём. Известно, что он подходит новичкам и его можно проверить
                на одной некритичной сцене, не меняя основной план. Неизвестно, ускорит ли он всю постановку и
                сохранит ли готовность к премьере.
              </p>
            </div>
            <ChoiceList
              legend="Какой вывод учитывает и новые факты, и оставшиеся вопросы?"
              onChange={(value) => updateSearch({ transfer: value, checked: undefined })}
              options={transferOptions}
              value={transferAnswer}
            />
            {transferChecked ? <TransferFeedback answer={transferAnswer} /> : null}
          </article>
        ) : null}

        {step === 8 && !done ? (
          <article className="user-lesson__card user-lesson__summary">
            <div className="user-lesson__summary-icon" aria-hidden="true"><CheckCircle2 /></div>
            <p className="user-lesson__meta">Итог</p>
            <h1 tabIndex={-1}>Один факт меняет только связанный с ним вывод</h1>
            <dl>
              <div>
                <dt>Подтверждено</dt>
                <dd>Срок получения доступного на тот момент остатка.</dd>
              </div>
              <div>
                <dt>Не подтверждено</dt>
                <dd>Сохранность всей суммы и повторение результата.</dd>
              </div>
              <div>
                <dt>Не следует автоматически</dt>
                <dd>Какое решение нужно принять человеку.</dd>
              </div>
            </dl>
            <p className="user-lesson__disclaimer">
              Это образовательная история, а не индивидуальная финансовая рекомендация.
            </p>
          </article>
        ) : null}

        {step === 8 && done ? (
          <article className="user-lesson__card user-lesson__complete">
            <div className="user-lesson__complete-icon" aria-hidden="true"><Check /></div>
            <p className="user-lesson__meta">Готово · 8 из 8</p>
            <h1 tabIndex={-1}>Урок завершён</h1>
            <p>
              Теперь у вас есть простой ориентир: сначала назвать, на какой вопрос отвечает новый факт, а затем
              проверить, какие вопросы он не закрывает.
            </p>
          </article>
        ) : null}
      </main>

      {step === 1 ? <LessonAction label="Начать" onClick={() => goTo(2)} /> : null}
      {step === 2 ? <LessonAction label="Посмотреть, что удалось проверить" onClick={() => goTo(3)} /> : null}
      {step === 3 ? <LessonAction label="Добавить один новый факт" onClick={() => goTo(4)} /> : null}
      {step === 4 ? (
        <LessonAction
          disabled={!primaryAnswer}
          icon="none"
          label="Проверить"
          onClick={() => primaryAnswer && goTo(5, { answer: primaryAnswer })}
        />
      ) : null}
      {step === 5 ? (
        <LessonAction
          label="Продолжить историю"
          onClick={() => goTo(6, primaryAnswer ? { answer: primaryAnswer } : undefined)}
        />
      ) : null}
      {step === 6 ? <LessonAction label="Попробовать на другой ситуации" onClick={() => goTo(7)} /> : null}
      {step === 7 ? (
        <LessonAction
          disabled={!transferAnswer}
          icon={transferChecked ? 'forward' : 'none'}
          label={transferChecked ? 'К итогу' : 'Проверить'}
          onClick={() => {
            if (!transferAnswer) return
            if (transferChecked) {
              goTo(8, { transfer: transferAnswer })
            } else {
              updateSearch({ checked: '1' })
            }
          }}
        />
      ) : null}
      {step === 8 && !done ? (
        <LessonAction icon="none" label="Завершить" onClick={() => updateSearch({ done: '1' })} />
      ) : null}
      {step === 8 && done ? (
        <LessonAction icon="repeat" label="Пройти ещё раз" onClick={() => navigate('/')} />
      ) : null}
    </div>
  )
}
