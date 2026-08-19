/*
THESIS: One fixed story is the control; only the learner action changes. It refuses a catalog of unrelated examples.
OWN-WORLD: The established FinPulse learner canvas, navy type, sky-blue actions, white 14px panels and quiet blue-gray rules.
STORY: Read one housing-and-deadline episode, run two different ways of examining it, then compare what each makes visible.
FIRST VIEWPORT: Wordmark and exit above a compact thesis; the shared excerpt anchors the left while two equal work areas begin beside it.
FORM: A pairwise comparison workbench, the strongest of six structures considered; no seed was used because the request precisely fixes the surface.
*/

import { ArrowLeft, ArrowRightLeft, BookOpenText, ChevronDown, LockKeyhole } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link, useSearchParams } from 'react-router'

import { ComparisonMethodPanel } from '../comparison/ComparisonMethodPanel'
import { mechanicIsComplete } from '../comparison/comparisonAnswerState'
import {
  comparisonMechanicEntries,
  comparisonMechanics,
  comparisonStory,
  isComparisonMechanicSlug,
  mechanicPrompts,
  sharedComparisonFact,
  type ComparisonMechanic,
  type ComparisonMechanicSlug,
} from '../comparison/comparisonMechanics'
import type { LearnerPrompt } from '../learnerLessonCatalog'
import '../comparison.css'

const defaultFirst: ComparisonMechanicSlug = 'facts-before-reveal'
const defaultSecond: ComparisonMechanicSlug = 'one-fact-one-conclusion'

type ComparisonSide = 'first' | 'second'
type AnswerState = Partial<Record<ComparisonMechanicSlug, string[][]>>
type RevealState = Partial<Record<ComparisonMechanicSlug, boolean>>

function emptyAnswers(mechanic: ComparisonMechanic) {
  return mechanicPrompts(mechanic).map(() => [])
}

function fallbackSecond(first: ComparisonMechanicSlug) {
  if (defaultSecond !== first) return defaultSecond
  return comparisonMechanicEntries.find((mechanic) => mechanic.slug !== first)?.slug ?? defaultFirst
}

function resolveSelection(params: URLSearchParams) {
  const rawFirst = params.get('first')
  const first = isComparisonMechanicSlug(rawFirst) ? rawFirst : defaultFirst
  const rawSecond = params.get('second')
  const secondCandidate = isComparisonMechanicSlug(rawSecond) ? rawSecond : fallbackSecond(first)
  const second = secondCandidate === first ? fallbackSecond(first) : secondCandidate
  const view: ComparisonSide = params.get('view') === 'second' ? 'second' : 'first'
  return { first, second, view }
}

export function ComparisonPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [storyExpanded, setStoryExpanded] = useState(false)
  const [answersByMechanic, setAnswersByMechanic] = useState<AnswerState>({})
  const [revealedByMechanic, setRevealedByMechanic] = useState<RevealState>({})
  const titleRef = useRef<HTMLHeadingElement>(null)
  const searchKey = searchParams.toString()
  const { first, second, view } = useMemo(
    () => resolveSelection(new URLSearchParams(searchKey)),
    [searchKey],
  )
  const firstMechanic = comparisonMechanics[first]
  const secondMechanic = comparisonMechanics[second]
  const firstAnswers = answersByMechanic[first] ?? emptyAnswers(firstMechanic)
  const secondAnswers = answersByMechanic[second] ?? emptyAnswers(secondMechanic)
  const firstRevealed = Boolean(revealedByMechanic[first]) && mechanicIsComplete(firstMechanic, firstAnswers)
  const secondRevealed = Boolean(revealedByMechanic[second]) && mechanicIsComplete(secondMechanic, secondAnswers)

  useEffect(() => {
    document.title = 'Одна история — разные способы · ФинПульс'
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const next = new URLSearchParams(searchKey)
    next.set('first', first)
    next.set('second', second)
    next.set('view', view)

    for (const key of [...next.keys()]) {
      if (key.startsWith('answer-') || key.startsWith('checked-')) next.delete(key)
    }

    if (next.toString() !== searchKey) setSearchParams(next, { replace: true })
  }, [first, searchKey, second, setSearchParams, view])

  const replaceParams = (change: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams)
    change(next)
    setSearchParams(next, { replace: true })
  }

  const updateAnswer = (
    mechanic: ComparisonMechanic,
    prompt: LearnerPrompt,
    values: string[],
  ) => {
    setAnswersByMechanic((current) => {
      const prompts = mechanicPrompts(mechanic)
      const promptIndex = prompts.findIndex((candidate) => candidate.id === prompt.id)
      if (promptIndex < 0) return current
      const nextAnswers = [...(current[mechanic.slug] ?? emptyAnswers(mechanic))]
      nextAnswers[promptIndex] = [...new Set(values)].sort()
      return { ...current, [mechanic.slug]: nextAnswers }
    })
    setRevealedByMechanic((current) => ({ ...current, [mechanic.slug]: false }))
  }

  const clearMechanic = (mechanic: ComparisonMechanic) => {
    setAnswersByMechanic((current) => ({ ...current, [mechanic.slug]: emptyAnswers(mechanic) }))
    setRevealedByMechanic((current) => ({ ...current, [mechanic.slug]: false }))
  }

  const selectMechanic = (side: ComparisonSide, slug: ComparisonMechanicSlug) => {
    const previous = side === 'first' ? first : second
    setAnswersByMechanic((current) => {
      const next = { ...current }
      delete next[previous]
      return next
    })
    setRevealedByMechanic((current) => {
      const next = { ...current }
      delete next[previous]
      return next
    })
    replaceParams((next) => {
      next.set(side, slug)
      next.set('view', side)
    })
  }

  const reveal = (mechanic: ComparisonMechanic) => {
    setRevealedByMechanic((current) => ({ ...current, [mechanic.slug]: true }))
  }

  const swap = () => {
    replaceParams((next) => {
      next.set('first', second)
      next.set('second', first)
      next.set('view', view === 'first' ? 'second' : 'first')
    })
  }

  const setMobileView = (side: ComparisonSide, moveFocus = false) => {
    replaceParams((next) => next.set('view', side))
    if (moveFocus) {
      document.getElementById(`comparison-tab-${side}`)?.focus()
    }
  }

  const moveBetweenTabs = (event: KeyboardEvent<HTMLButtonElement>, side: ComparisonSide) => {
    let nextSide: ComparisonSide | null = null
    if (event.key === 'Home') nextSide = 'first'
    if (event.key === 'End') nextSide = 'second'
    if (event.key === 'ArrowRight') nextSide = side === 'first' ? 'second' : 'first'
    if (event.key === 'ArrowLeft') nextSide = side === 'first' ? 'second' : 'first'
    if (!nextSide) return
    event.preventDefault()
    setMobileView(nextSide, true)
  }

  return (
    <div className="user-lesson comparison-page">
      <a className="same-story-skip" href="#comparison-workspace">
        К сравнению
      </a>

      <header className="same-story-topbar">
        <span className="same-story-wordmark">ФинПульс</span>
        <Link className="same-story-exit" to="/lab">
          <ArrowLeft aria-hidden="true" />
          К урокам
        </Link>
      </header>

      <main className="same-story-main">
        <header className="same-story-intro">
          <div>
            <p className="same-story-kicker">Сравнение на равных условиях</p>
            <h1 ref={titleRef} tabIndex={-1}>Одна история — разные способы разобраться</h1>
          </div>
          <p className="same-story-intro__lead">
            Выберите два способа и попробуйте их на одном и том же фрагменте. Общий текст и условие не меняются.
          </p>
        </header>

        <div className="same-story-mobile-tabs" role="tablist" aria-label="Стороны сравнения" aria-orientation="horizontal">
          <button
            aria-controls="comparison-first"
            aria-selected={view === 'first'}
            id="comparison-tab-first"
            onClick={() => setMobileView('first')}
            onKeyDown={(event) => moveBetweenTabs(event, 'first')}
            role="tab"
            tabIndex={view === 'first' ? 0 : -1}
            type="button"
          >
            Первый
            <small>{firstMechanic.shortTitle}</small>
          </button>
          <button
            aria-controls="comparison-second"
            aria-selected={view === 'second'}
            id="comparison-tab-second"
            onClick={() => setMobileView('second')}
            onKeyDown={(event) => moveBetweenTabs(event, 'second')}
            role="tab"
            tabIndex={view === 'second' ? 0 : -1}
            type="button"
          >
            Второй
            <small>{secondMechanic.shortTitle}</small>
          </button>
        </div>

        <div className="same-story-workspace" id="comparison-workspace">
          <aside className="same-story-source" aria-labelledby="same-story-title">
            <header>
              <BookOpenText aria-hidden="true" />
              <div>
                <p>Общий фрагмент</p>
                <h2 id="same-story-title">{comparisonStory.title}</h2>
              </div>
            </header>
            <div className="same-story-shared-condition">
              <strong>Общее условие для всех способов — не часть истории</strong>
              <p>{sharedComparisonFact}</p>
            </div>
            <div className={`same-story-source__copy ${storyExpanded ? 'is-expanded' : ''}`}>
              {comparisonStory.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <button
              aria-expanded={storyExpanded}
              className="same-story-source__toggle"
              onClick={() => setStoryExpanded((expanded) => !expanded)}
              type="button"
            >
              {storyExpanded ? 'Свернуть фрагмент' : 'Прочитать весь фрагмент'}
              <ChevronDown aria-hidden="true" />
            </button>
          </aside>

          <section
            aria-labelledby="comparison-tab-first"
            className={`same-story-workspace__method ${view === 'first' ? 'is-mobile-active' : ''}`}
            id="comparison-first"
            role="tabpanel"
            tabIndex={0}
          >
            <h2 className="same-story-panel-title" id="comparison-first-title">{firstMechanic.title}</h2>
            <ComparisonMethodPanel
              answers={firstAnswers}
              mechanic={firstMechanic}
              onAnswer={(prompt, values) => updateAnswer(firstMechanic, prompt, values)}
              onClear={() => clearMechanic(firstMechanic)}
              onMechanicChange={(slug) => selectMechanic('first', slug)}
              onReveal={() => reveal(firstMechanic)}
              otherSlug={second}
              revealed={firstRevealed}
              side="first"
            />
          </section>

          <button aria-label="Поменять способы местами" className="same-story-swap" onClick={swap} type="button">
            <ArrowRightLeft aria-hidden="true" />
          </button>

          <section
            aria-labelledby="comparison-tab-second"
            className={`same-story-workspace__method ${view === 'second' ? 'is-mobile-active' : ''}`}
            id="comparison-second"
            role="tabpanel"
            tabIndex={0}
          >
            <h2 className="same-story-panel-title" id="comparison-second-title">{secondMechanic.title}</h2>
            <ComparisonMethodPanel
              answers={secondAnswers}
              mechanic={secondMechanic}
              onAnswer={(prompt, values) => updateAnswer(secondMechanic, prompt, values)}
              onClear={() => clearMechanic(secondMechanic)}
              onMechanicChange={(slug) => selectMechanic('second', slug)}
              onReveal={() => reveal(secondMechanic)}
              otherSlug={first}
              revealed={secondRevealed}
              side="second"
            />
          </section>
        </div>

        {firstRevealed && secondRevealed ? (
          <section className="same-story-result" aria-labelledby="comparison-result-title">
            <header>
              <p>После двух разборов</p>
              <h2 id="comparison-result-title">Сравните не ответы, а работу способов</h2>
            </header>
            <div className="same-story-result__grid">
              {[firstMechanic, secondMechanic].map((mechanic) => (
                <article key={mechanic.slug}>
                  <h3>{mechanic.title}</h3>
                  <p>{mechanic.comparisonLens}</p>
                  <dl>
                    <div>
                      <dt>Держит в фокусе</dt>
                      <dd>{mechanic.feedback.supported}</dd>
                    </div>
                    <div>
                      <dt>Не закрывает сам по себе</dt>
                      <dd>{mechanic.feedback.open}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <footer className="same-story-privacy">
          <LockKeyhole aria-hidden="true" />
          Ответы не отправляются и исчезнут после перезагрузки. Здесь нет баллов или оценки вашей финансовой ситуации: выбор сверяется только с фактами фрагмента.
        </footer>
      </main>
    </div>
  )
}
