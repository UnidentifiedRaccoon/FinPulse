/*
 * THESIS: один общий эпизод позволяет оценивать девять способов разбора без сюжетных помех.
 * OWN-WORLD: тот же спокойный каталог ФинПульса, что и основная Concept Lab.
 * STORY: пользователь выбирает один способ, проходит полный восьмиэкранный разбор и возвращается сюда.
 * FIRST VIEWPORT: бренд, ясное обещание и начало единого списка — без кодов, рейтингов и исследовательских подписей.
 * FORM: каталог самостоятельных маршрутов; попарного workbench, фильтров и сравнительных controls нет.
 */
import { ArrowRight, Clock, LockKeyhole } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router'

import { sameEpisodeMechanicEntries, sharedSameEpisode } from '../comparison/sameEpisodeCatalog'

export function ComparisonPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    document.title = 'ФинПульс · Один эпизод, девять способов'
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
            Один эпизод, девять способов
          </h1>
          <p className="learner-library__promise">
            Во всех разборах — один и тот же первый вечер Саши после переезда. Текст, факты и финал не меняются: отличается только ваше действие.
          </p>
        </header>

        <div className="learner-library__groups">
          <section className="learner-library__group" aria-labelledby="same-episode-group-title">
            <h2 className="learner-library__group-title" id="same-episode-group-title">
              Первый вечер после переезда
            </h2>
            <ul className="learner-library__list">
              {sameEpisodeMechanicEntries.map((mechanic) => (
                <li className="learner-library__item" key={mechanic.slug}>
                  <article className="learner-library__card">
                    <div className="learner-library__card-copy">
                      <h3 className="learner-library__card-title">{mechanic.title}</h3>
                      <p className="learner-library__description">{mechanic.description}</p>
                      <p className="learner-library__duration">
                        <Clock aria-hidden="true" />
                        {sharedSameEpisode.duration}
                      </p>
                    </div>
                    <Link
                      aria-label={`Открыть разбор «${mechanic.title}»`}
                      className="learner-library__link"
                      to={`/compare/${mechanic.slug}/1`}
                    >
                      Открыть разбор
                      <ArrowRight aria-hidden="true" />
                    </Link>
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
