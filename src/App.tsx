import { BookOpen } from 'lucide-react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router'

import { parsedProgram } from '@/content/loadProgram'
import { LessonPage } from '@/pages/LessonPage'
import { ModulePage } from '@/pages/ModulePage'
import { ProgramOverviewPage } from '@/pages/ProgramOverviewPage'
import { UnitPage } from '@/pages/UnitPage'

function App() {
  if (!parsedProgram.success) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-6 text-foreground">
        <section className="flex max-w-sm flex-col gap-3 rounded-lg border border-border bg-card p-5 text-card-foreground">
          <p className="text-sm font-medium text-destructive">Content error</p>
          <h1 className="text-2xl font-semibold">Program JSON is invalid</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Run <code>npm run check:content</code> to see the schema issues.
          </p>
        </section>
      </main>
    )
  }

  const program = parsedProgram.data

  return (
    <BrowserRouter>
      <div className="min-h-svh bg-background text-foreground">
        <header className="border-b border-border bg-background/95">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
            <Link className="flex items-center gap-2 text-sm font-semibold" to="/">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen aria-hidden="true" />
              </span>
              <span>{program.title}</span>
            </Link>
            <span className="text-xs text-muted-foreground">MVP reader</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl px-4 py-6">
          <Routes>
            <Route path="/" element={<ProgramOverviewPage program={program} />} />
            <Route path="/modules/:moduleSlug" element={<ModulePage program={program} />} />
            <Route path="/modules/:moduleSlug/units/:unitSlug" element={<UnitPage program={program} />} />
            <Route path="/lessons/:lessonSlug" element={<LessonPage program={program} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
