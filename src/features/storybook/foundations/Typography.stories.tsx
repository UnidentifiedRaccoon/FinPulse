import type { Meta, StoryObj } from '@storybook/react-vite'

const typeSamples = [
  ['display.sm', '28 / 34 · 700', 'Большой результат', 'text-[28px] font-bold leading-[34px]'],
  ['heading.lg', '24 / 30 · 700', 'Маршрут обучения', 'text-2xl font-bold leading-[30px]'],
  ['heading.md', '20 / 26 · 700', 'Короткий урок', 'text-xl font-bold leading-[26px]'],
  ['heading.sm', '18 / 24 · 600', 'Практический шаг', 'text-lg font-semibold leading-6'],
  ['body.lg', '16 / 24 · 400-500', 'Один экран должен объяснять одну мысль и вести к понятному действию.', 'text-base leading-6'],
  ['body.md', '15 / 22 · 400-500', 'Стандартный текст интерфейса для карточек и подсказок.', 'text-[15px] leading-[22px]'],
  ['body.sm', '14 / 20 · 400-500', 'Второстепенная подпись без потери читаемости.', 'text-sm leading-5'],
  ['caption.md', '13 / 18 · 400-500', 'Метаданные и спокойные уточнения.', 'text-[13px] leading-[18px]'],
  ['caption.sm', '11 / 14 · 500-600', 'КОМПАКТНАЯ МЕТКА', 'text-[11px] font-semibold leading-[14px]'],
  ['number.md', '20 / 24 · 700', '68%', 'text-xl font-bold leading-6 tabular-nums'],
] as const

const meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Scale: Story = {
  render: () => (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[var(--fr-color-brand-700)]">FinPulse typography</p>
        <h1 className="text-2xl font-bold tracking-normal text-[var(--fr-text-primary)]">Mobile-first type scale</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--fr-text-secondary)]">
          Keep lesson text compact, readable, and calm. Do not scale type with viewport width.
        </p>
      </header>
      <div className="overflow-hidden rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] shadow-[var(--fr-shadow-sm)]">
        {typeSamples.map(([token, spec, sample, className]) => (
          <article className="grid gap-3 border-b border-[var(--fr-border-subtle)] p-4 last:border-b-0 md:grid-cols-[180px_minmax(0,1fr)]" key={token}>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-[var(--fr-text-primary)]">{token}</p>
              <p className="text-xs leading-5 text-[var(--fr-text-secondary)]">{spec}</p>
            </div>
            <p className={`${className} text-[var(--fr-text-primary)]`}>{sample}</p>
          </article>
        ))}
      </div>
    </section>
  ),
}
