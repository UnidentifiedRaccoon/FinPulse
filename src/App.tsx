import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import programJson from '@/content/program.json'
import {
  getAllLessons,
  getOrderedLessons,
  getOrderedModules,
  type LessonBlock,
  parseProgram,
} from '@/content/program'

const parsedProgram = parseProgram(programJson)

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

  return (
    <BrowserRouter>
      <div className="min-h-svh bg-background text-foreground">
        <header className="border-b border-border bg-background/95">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
            <Link className="flex items-center gap-2 text-sm font-semibold" to="/">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen aria-hidden="true" />
              </span>
              <span>{parsedProgram.data.title}</span>
            </Link>
            <span className="text-xs text-muted-foreground">MVP reader</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl px-4 py-6">
          <Routes>
            <Route path="/" element={<ProgramOverview />} />
            <Route path="/modules/:moduleSlug" element={<ModulePage />} />
            <Route path="/lessons/:lessonSlug" element={<LessonPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function ProgramOverview() {
  const program = parsedProgram.success ? parsedProgram.data : null
  if (!program) return null

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-medium text-muted-foreground">Educational program</p>
        <h1 className="text-4xl font-semibold leading-tight tracking-normal">{program.title}</h1>
        {program.description ? (
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">{program.description}</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-xl font-semibold">
          Modules
        </h2>
        <div className="flex flex-col gap-3">
          {getOrderedModules(program).map((module) => (
            <Link
              className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted"
              key={module.id}
              to={`/modules/${module.slug}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold">{module.title}</h3>
                  {module.description ? (
                    <p className="text-sm leading-6 text-muted-foreground">{module.description}</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground">
                    {getOrderedLessons(module).length} lessons
                  </p>
                </div>
                <ChevronRight aria-hidden="true" className="mt-1 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function ModulePage() {
  const program = parsedProgram.success ? parsedProgram.data : null
  const { moduleSlug } = useParams()
  const module = program?.modules.find((item) => item.slug === moduleSlug)

  if (!program || !module) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to="/">
          <ChevronLeft data-icon="inline-start" />
          Program
        </Link>
      </Button>

      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Module {module.order}</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal">{module.title}</h1>
        {module.description ? (
          <p className="text-base leading-7 text-muted-foreground">{module.description}</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-3" aria-label={`${module.title} lessons`}>
        {getOrderedLessons(module).map((lesson) => (
          <Link
            className="rounded-lg border border-border bg-card p-4 text-card-foreground transition-colors hover:bg-muted"
            key={lesson.id}
            to={`/lessons/${lesson.slug}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{lesson.title}</h2>
                {lesson.description ? (
                  <p className="text-sm leading-6 text-muted-foreground">{lesson.description}</p>
                ) : null}
                {lesson.estimatedMinutes ? (
                  <p className="text-xs text-muted-foreground">{lesson.estimatedMinutes} min read</p>
                ) : null}
              </div>
              <ChevronRight aria-hidden="true" className="mt-1 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}

function LessonPage() {
  const program = parsedProgram.success ? parsedProgram.data : null
  const { lessonSlug } = useParams()
  const lessons = program ? getAllLessons(program) : []
  const currentIndex = lessons.findIndex(({ lesson }) => lesson.slug === lessonSlug)
  const current = currentIndex >= 0 ? lessons[currentIndex] : null
  const previous = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const next = currentIndex >= 0 ? lessons[currentIndex + 1] : null

  if (!program || !current) {
    return <Navigate to="/" replace />
  }

  return (
    <article className="flex flex-col gap-6">
      <Button asChild variant="ghost" className="w-fit">
        <Link to={`/modules/${current.module.slug}`}>
          <ChevronLeft data-icon="inline-start" />
          {current.module.title}
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          {current.module.title} · Lesson {current.lesson.order}
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-normal">{current.lesson.title}</h1>
        {current.lesson.description ? (
          <p className="text-base leading-7 text-muted-foreground">{current.lesson.description}</p>
        ) : null}
      </header>

      <div className="flex flex-col gap-5">
        {current.lesson.blocks.map((block, index) => (
          <ContentBlock block={block} key={`${block.type}-${index}`} />
        ))}
      </div>

      <nav className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2" aria-label="Lesson navigation">
        {previous ? (
          <Button asChild variant="outline" className="justify-start">
            <Link to={`/lessons/${previous.lesson.slug}`}>
              <ChevronLeft data-icon="inline-start" />
              {previous.lesson.title}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild className="justify-end">
            <Link to={`/lessons/${next.lesson.slug}`}>
              {next.lesson.title}
              <ChevronRight data-icon="inline-end" />
            </Link>
          </Button>
        ) : null}
      </nav>
    </article>
  )
}

function ContentBlock({ block }: { block: LessonBlock }) {
  if (block.type === 'heading') {
    const Heading = block.level === 2 ? 'h2' : 'h3'
    return <Heading className="text-2xl font-semibold leading-tight tracking-normal">{block.text}</Heading>
  }

  if (block.type === 'paragraph') {
    return <p className="text-base leading-7 text-muted-foreground">{block.text}</p>
  }

  if (block.type === 'list') {
    return (
      <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-7 text-muted-foreground">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  if (block.type === 'quote') {
    return (
      <blockquote className="border-l-2 border-border pl-4 text-base leading-7 text-muted-foreground">
        {block.text}
      </blockquote>
    )
  }

  if (block.type === 'callout') {
    return (
      <aside className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4">
        {block.title ? <p className="text-sm font-semibold">{block.title}</p> : null}
        <p className="text-sm leading-6 text-muted-foreground">{block.text}</p>
      </aside>
    )
  }

  if (block.type === 'image') {
    return <img className="w-full rounded-lg border border-border" src={block.src} alt={block.alt} />
  }

  return (
    <a
      className="rounded-lg border border-border bg-card p-4 text-sm font-medium text-card-foreground"
      href={block.src}
    >
      {block.title}
    </a>
  )
}

export default App
