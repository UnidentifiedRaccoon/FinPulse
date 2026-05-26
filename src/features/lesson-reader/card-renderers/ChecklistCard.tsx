import type { ChecklistCard as ChecklistCardType, ChecklistState } from '@/features/lesson-reader/lessonInteraction'
import { cn } from '@/lib/utils'

export function ChecklistCard({
  card,
  state,
  onToggle,
}: {
  card: ChecklistCardType
  state: ChecklistState
  onToggle: (itemKey: string) => void
}) {
  const statusId = `${card.id}-checklist-status`

  return (
    <div className="flex flex-col gap-4">
      {card.body ? <p className="text-base leading-7 text-[var(--fr-text-secondary)]">{card.body}</p> : null}
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">{card.title ?? 'Чеклист'}</legend>
        <ul className="flex flex-col gap-3">
          {card.items.map((item, index) => {
            const itemKey = String(index)
            const isChecked = state.checkedItems.includes(itemKey)

            return (
              <li key={`${item}-${index}`}>
                <label
                  className={cn(
                    'flex min-h-14 cursor-pointer items-start gap-3 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-4 py-3 text-sm leading-6 text-[var(--fr-text-secondary)] shadow-[var(--fr-shadow-sm)] transition-colors [overflow-wrap:anywhere] hover:bg-[var(--fr-surface-soft)] focus-within:ring-4 focus-within:ring-[var(--fr-color-brand-500)]/15',
                    isChecked &&
                      'border-[var(--fr-color-brand-500)] bg-[var(--fr-color-brand-50)] text-[var(--fr-text-primary)]',
                  )}
                >
                  <input
                    aria-describedby={statusId}
                    checked={isChecked}
                    className="mt-1 size-4 shrink-0 accent-[var(--fr-color-brand-500)]"
                    onChange={() => onToggle(itemKey)}
                    type="checkbox"
                  />
                  <span>{item}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>
      <p aria-live="polite" className="text-sm leading-6 text-[var(--fr-text-secondary)]" id={statusId} role="status">
        Отмечено {state.checkedItems.length} из {card.items.length}. Отметки хранятся только на этом экране.
      </p>
    </div>
  )
}
