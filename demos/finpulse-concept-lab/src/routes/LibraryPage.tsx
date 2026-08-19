import { ArrowRight, Clock, LockKeyhole } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

import { learnerLessonEntries } from '../learnerLessonCatalog'

type LibraryLesson = {
  slug: string
  title: string
  labDescription: string
  duration: string
}

const oneFactLesson: LibraryLesson = {
  slug: 'one-fact-one-conclusion',
  title: 'Что изменил один новый факт?',
  labDescription: 'Увидеть, какой вывод меняет новый факт — и какие вопросы остаются открытыми.',
  duration: '4 мин',
}

function LessonGroup({
  lessons,
  title,
}: {
  lessons: LibraryLesson[]
  title: string
}) {
  const headingId = `learner-library-${lessons[0]?.slug ?? title}`

  return (
    <section className="learner-library__group" aria-labelledby={headingId}>
      <h2 className="learner-library__group-title" id={headingId}>
        {title}
      </h2>
      <ul className="learner-library__list">
        {lessons.map((lesson) => (
          <li className="learner-library__item" key={lesson.slug}>
            <article className="learner-library__card">
              <div className="learner-library__card-copy">
                <h3 className="learner-library__card-title">{lesson.title}</h3>
                <p className="learner-library__description">{lesson.labDescription}</p>
                <p className="learner-library__duration">
                  <Clock aria-hidden="true" />
                  {lesson.duration}
                </p>
              </div>
              <Link
                className="learner-library__link"
                to={`/lesson/${lesson.slug}/1`}
                aria-label={`Открыть урок «${lesson.title}»`}
              >
                Открыть урок
                <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function LibraryPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    document.title = 'ФинПульс · Короткие уроки'
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  const messageLessons = learnerLessonEntries.filter((lesson) => lesson.group === 'message')
  const deadlineLessons = [
    ...learnerLessonEntries.filter((lesson) => lesson.group === 'deadline'),
    oneFactLesson,
  ]

  return (
    <div className="learner-library">
      <a className="learner-library__skip-link" href="#learner-library-title">
        К основному содержанию
      </a>

      <main className="learner-library__main">
        <header className="learner-library__intro">
          <p className="learner-library__brand">ФинПульс</p>
          <h1 id="learner-library-title" ref={titleRef} tabIndex={-1}>
            Выберите короткий урок
          </h1>
          <p className="learner-library__promise">
            Уроки не зависят друг от друга: начните с любого и за несколько минут разберите одну небольшую ситуацию.
          </p>
        </header>

        <div className="learner-library__groups">
          <LessonGroup lessons={messageLessons} title="Сообщение и проверка" />
          <LessonGroup lessons={deadlineLessons} title="Деньги и срок" />
        </div>

        <p className="learner-library__privacy">
          <LockKeyhole aria-hidden="true" />
          Без регистрации. Ответы не отправляются и не сохраняются в аккаунте.
        </p>
      </main>
    </div>
  )
}
