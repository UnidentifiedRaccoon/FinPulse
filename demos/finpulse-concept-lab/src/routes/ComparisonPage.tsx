/*
 * THESIS: девять способов можно сравнить на двух одинаково разбитых последовательных эпизодах.
 * OWN-WORLD: тот же спокойный каталог ФинПульса, что и основная Concept Lab.
 * STORY: пользователь сначала выбирает способ, затем один из двух эпизодов и проходит полный восьмиэкранный разбор.
 * FIRST VIEWPORT: бренд, ясное обещание и начало матрицы 9 × 2 — без кодов, рейтингов и исследовательских подписей.
 * FORM: каталог самостоятельных маршрутов; попарного workbench, фильтров и сравнительных controls нет.
 */
import { ArrowRight, Clock, LockKeyhole } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'

import {
  comparisonEpisodeEntries,
  comparisonLessonPath,
} from '../comparison/comparisonLessonCatalog'
import { MechanicExplainer } from '../comparison/MechanicExplainer'
import { sameEpisodeMechanicEntries, sharedSameEpisode } from '../comparison/sameEpisodeCatalog'
import '../comparison/twoEpisodeCatalog.css'

export function ComparisonPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    document.title = 'ФинПульс · Девять способов, два эпизода'
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (location.pathname !== '/compare') {
      navigate('/compare', { replace: true })
      return
    }
    if (searchParams.size > 0) setSearchParams({}, { replace: true })
  }, [location.pathname, navigate, searchParams, setSearchParams])

  return (
    <div className="learner-library">
      <a className="learner-library__skip-link" href="#same-episode-library-title">
        К основному содержанию
      </a>

      <main className="learner-library__main">
        <header className="learner-library__intro">
          <p className="learner-library__brand">ФинПульс</p>
          <h1 id="same-episode-library-title" ref={titleRef} tabIndex={-1}>
            Девять способов, два эпизода
          </h1>
          <p className="learner-library__promise">
            Два эпизода в каждом способе устроены одинаково: текст и финал общие, меняется только действие ученика. Если выбираете механику для курса, раскройте «Как работает способ» — там показаны её ход, задача и ограничение. Это не рейтинг: выбор зависит от задачи урока.
          </p>
        </header>

        <div className="learner-library__groups">
          <section className="learner-library__group" aria-labelledby="same-episode-group-title">
            <h2 className="learner-library__group-title" id="same-episode-group-title">
              Выберите способ, затем эпизод
            </h2>
            <ul className="learner-library__list">
              {sameEpisodeMechanicEntries.map((mechanic) => (
                <li className="learner-library__item" key={mechanic.slug}>
                  <article className="learner-library__card comparison-catalog__card">
                    <div className="learner-library__card-copy">
                      <p className="comparison-catalog__method-label">{mechanic.shortLabel}</p>
                      <h3 className="learner-library__card-title">{mechanic.title}</h3>
                      <p className="learner-library__description">{mechanic.catalogDescription}</p>
                      <p className="learner-library__duration">
                        <Clock aria-hidden="true" />
                        2 урока · каждый по {sharedSameEpisode.duration}
                      </p>
                      <MechanicExplainer title={mechanic.title} explainer={mechanic.explainer} />
                    </div>
                    <div className="comparison-catalog__lesson-area">
                      <h4>Выберите один из двух эпизодов</h4>
                      <div className="comparison-catalog__lessons" aria-label={`Уроки способа «${mechanic.title}»`}>
                        {comparisonEpisodeEntries.map((episode) => (
                          <Link
                            aria-label={`${episode.sequenceLabel}: ${episode.title}. Способ «${mechanic.title}»`}
                            className="comparison-catalog__lesson-link"
                            key={episode.slug}
                            to={comparisonLessonPath(mechanic.slug, episode, 1)}
                          >
                            <span>{episode.sequenceLabel}</span>
                            <strong>{episode.title}</strong>
                            <small>{episode.cardSummary}</small>
                            <ArrowRight aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <p className="learner-library__privacy">
          <LockKeyhole aria-hidden="true" />
          Без регистрации. Ответы не отправляются и не сохраняются в аккаунте.
        </p>
      </main>
    </div>
  )
}
