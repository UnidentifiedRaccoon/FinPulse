import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { CurrentStepCta } from '@/features/program-navigation/CurrentStepCta'
import { buildProgramLearningPath } from '@/features/program-navigation/learningPath'
import { ModulePathNode } from '@/features/program-navigation/ModulePathNode'
import { PathProgressSummary } from '@/features/program-navigation/PathProgressSummary'
import { PathStepNode } from '@/features/program-navigation/PathStepNode'

export function ProgramOverviewPage({ progress }: { progress: ProgressResponse | null }) {
  const programQuery = useApiQuery(api.getProgram, [])

  if (programQuery.status === 'loading') {
    return <PageState title="Загружаем программу" />
  }

  if (programQuery.status === 'error') {
    return <PageState title="Не удалось загрузить программу" description={programQuery.error.message} />
  }

  const program = programQuery.data
  const path = buildProgramLearningPath(program, progress)
  const activeModule = path.modules.find((module) => module.state === 'current') ?? path.modules[0] ?? null
  const previewLessons = activeModule?.units.flatMap((unit) => unit.lessons).slice(0, 5) ?? []

  return (
    <div className="flex flex-col gap-6 pb-8">
      <section className="flex flex-col gap-3 pt-2">
        <p className="text-sm font-semibold text-[var(--fr-color-brand-700)]">Текущий модуль</p>
        <h1 className="text-[2rem] font-bold leading-9 tracking-normal text-[var(--fr-text-primary)]">
          {activeModule?.module.title ?? program.title}
        </h1>
        {activeModule?.module.description ?? program.description ? (
          <p className="text-base leading-7 text-[var(--fr-text-secondary)]">
            {activeModule?.module.description ?? program.description}
          </p>
        ) : null}
      </section>

      <PathProgressSummary completed={path.completedLessons} total={path.totalLessons} />

      <CurrentStepCta
        fallbackTo={activeModule ? `/modules/${activeModule.module.slug}` : '/'}
        isComplete={path.isComplete}
        lesson={path.currentLesson?.lesson ?? previewLessons[0]?.lesson ?? null}
      />

      <section className="flex flex-col gap-3" aria-labelledby="path-preview-heading">
        <h2 id="path-preview-heading" className="text-xl font-bold leading-7 tracking-normal text-[var(--fr-text-primary)]">
          Путь обучения
        </h2>
        {previewLessons.length > 0 ? (
          <div className="flex flex-col gap-3">
            {previewLessons.map((item, index) => (
              <PathStepNode
                description={item.lesson.description}
                index={index + 1}
                key={item.lesson.id}
                meta={item.lesson.estimatedMinutes ? `${item.lesson.estimatedMinutes} мин` : undefined}
                state={item.state}
                title={item.lesson.title}
                to={`/lessons/${item.lesson.slug}`}
              />
            ))}
          </div>
        ) : (
          <PageState title="В маршруте пока нет уроков" />
        )}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-xl font-bold leading-7 tracking-normal text-[var(--fr-text-primary)]">
          Модули
        </h2>
        <div className="flex flex-col gap-3">
          {path.modules.map((module, index) => (
            <ModulePathNode index={index + 1} item={module} key={module.module.id} />
          ))}
        </div>
      </section>
    </div>
  )
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="flex flex-col gap-2 rounded-[20px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 text-[var(--fr-text-primary)]">
      <h1 className="text-xl font-bold">{title}</h1>
      {description ? <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">{description}</p> : null}
    </section>
  )
}
