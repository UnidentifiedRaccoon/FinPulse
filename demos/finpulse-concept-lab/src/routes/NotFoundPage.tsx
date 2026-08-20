import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

export function NotFoundPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    document.title = 'Урок не найден · ФинПульс'
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="learner-library">
      <a className="learner-library__skip-link" href="#not-found-title">К основному содержанию</a>
      <main className="not-found learner-library__main">
        <p className="learner-library__brand">ФинПульс</p>
        <h1 id="not-found-title" ref={titleRef} tabIndex={-1}>Такой урок не найден</h1>
        <p>Вернитесь к коротким урокам и выберите другой урок.</p>
        <Link className="learner-library__link" to="/lab">
          <ArrowLeft aria-hidden="true" />
          К урокам
        </Link>
      </main>
    </div>
  )
}
