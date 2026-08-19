import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'

import { LabHeader } from '../components/LabHeader'

export function NotFoundPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    document.title = 'Версия не найдена · ФинПульс'
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    titleRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#not-found-title">К основному содержанию</a>
      <LabHeader />
      <main className="not-found">
        <h1 id="not-found-title" ref={titleRef} tabIndex={-1}>Такая версия не найдена</h1>
        <p>Вернитесь в лабораторию и выберите одну из самостоятельных версий.</p>
        <Link className="button button--primary" to="/lab">
          <ArrowLeft aria-hidden="true" />
          К версиям
        </Link>
      </main>
    </div>
  )
}
