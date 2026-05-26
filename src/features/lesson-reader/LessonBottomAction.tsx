import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'

type PrimaryActionTone = 'continue' | 'check' | 'finish'

const actionIcons = {
  continue: ArrowRight,
  check: Check,
  finish: Check,
} satisfies Record<PrimaryActionTone, typeof ArrowRight>

export function LessonBottomAction({
  primaryLabel,
  primaryTone,
  primaryDisabled,
  isBusy,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: {
  primaryLabel: string
  primaryTone: PrimaryActionTone
  primaryDisabled?: boolean
  isBusy?: boolean
  secondaryLabel?: string
  onPrimary: () => void
  onSecondary?: () => void
}) {
  const Icon = actionIcons[primaryTone]

  return (
    <div
      className="sticky bottom-0 z-20 -mx-4 border-t border-[var(--fr-border-subtle)] bg-[var(--fr-surface-card)]/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(18,52,89,0.06)] backdrop-blur sm:mx-0 sm:rounded-t-2xl sm:border-x"
      data-lesson-bottom-action
    >
      <div className="mx-auto flex w-full max-w-[520px] items-center gap-3">
        {secondaryLabel && onSecondary ? (
          <Button
            aria-label={secondaryLabel}
            className="size-12 shrink-0 rounded-xl border-[var(--fr-border-default)] text-[var(--fr-color-brand-700)]"
            onClick={onSecondary}
            size="icon-lg"
            type="button"
            variant="outline"
          >
            {secondaryLabel === 'Назад' ? <ArrowLeft aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}
          </Button>
        ) : null}
        <Button
          className="min-h-12 flex-1 rounded-xl bg-[var(--fr-color-brand-500)] px-4 text-[15px] font-semibold text-white shadow-[var(--fr-shadow-sm)] hover:bg-[var(--fr-color-brand-600)] disabled:bg-[var(--fr-color-brand-100)] disabled:text-[var(--fr-text-tertiary)]"
          disabled={primaryDisabled || isBusy}
          onClick={onPrimary}
          type="button"
        >
          {primaryLabel}
          <Icon data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
