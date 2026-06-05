import { api, type ProgressResponse } from '@/api/client'
import { useApiQuery } from '@/api/useApiQuery'
import { buildProgramLearningPath } from '@/features/program-navigation/learningPath'
import { ModulePathNode } from '@/features/program-navigation/ModulePathNode'

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

  return (
    <div className="flex flex-col gap-6 pb-8">
      <section className="flex flex-col gap-3 pt-2">
        <h1 className="text-[2rem] font-bold leading-9 tracking-normal text-[var(--fr-text-primary)]">Тиры</h1>
      </section>

      <section className="flex flex-col gap-3" aria-label="Тиры программы">
        {path.modules.length > 0 ? (
          <div className="flex flex-col gap-3">
            {path.modules.map((module, index) => (
              <ModulePathNode index={index + 1} item={module} key={module.module.id} />
            ))}
          </div>
        ) : (
          <div className="rounded-[20px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 text-sm leading-6 text-[var(--fr-text-secondary)]">
            Материалы программы пока не добавлены.
          </div>
        )}
      </section>
    </div>
  )
}

function PageState({ title, description }: { title: string; description?: string }) {
  return (
    <section className="rounded-[20px] border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 text-[var(--fr-text-primary)]">
      <h1 className="text-xl font-bold">{title}</h1>
      {description ? <p className="mt-1 text-sm leading-6 text-[var(--fr-text-secondary)]">{description}</p> : null}
    </section>
  )
}
