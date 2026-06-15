import type { ChecklistCard as ChecklistCardType, ChecklistState } from '@/features/lesson-reader/lessonInteraction'
import { cn } from '@/lib/utils'

import { RichTextParagraphs, SelectableOption } from './shared'

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
      {card.body ? (
        <RichTextParagraphs
          paragraphClassName="text-base leading-6 text-pretty text-[var(--fr-text-secondary)]"
          text={card.body}
        />
      ) : null}
      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">{card.title ?? 'Чеклист'}</legend>
        <ul className="flex flex-col gap-3">
          {card.items.map((item, index) => {
            const itemKey = String(index)
            const isChecked = state.checkedItems.includes(itemKey)

            return (
              <li key={`${item}-${index}`}>
                <SelectableOption
                  inputProps={{
                    'aria-describedby': statusId,
                    checked: isChecked,
                    name: `${card.id}-checklist`,
                    onChange: () => onToggle(itemKey),
                    type: 'checkbox',
                    value: itemKey,
                  }}
                  state={isChecked ? 'selected' : 'default'}
                >
                  {item}
                </SelectableOption>
              </li>
            )
          })}
        </ul>
      </fieldset>
      <p
        aria-live="polite"
        className={cn('text-sm leading-6 text-[var(--fr-text-secondary)]', state.checkedItems.length === 0 && 'sr-only')}
        id={statusId}
        role="status"
      >
        {state.checkedItems.length > 0
          ? `Отмечено ${state.checkedItems.length} из ${card.items.length}.`
          : 'Пункты пока не отмечены.'}
      </p>
    </div>
  )
}
