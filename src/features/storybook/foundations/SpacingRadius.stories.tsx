import type { Meta, StoryObj } from '@storybook/react-vite'

const spacingTokens = [
  ['space.1', '4px'],
  ['space.2', '8px'],
  ['space.3', '12px'],
  ['space.4', '16px'],
  ['space.5', '20px'],
  ['space.6', '24px'],
  ['space.8', '32px'],
  ['space.10', '40px'],
] as const

const radiusTokens = [
  ['radius.xs', '8px'],
  ['radius.sm', '10px'],
  ['radius.md', '12px'],
  ['radius.lg', '16px'],
  ['radius.xl', '20px'],
  ['radius.full', '999px'],
] as const

const meta = {
  title: 'Foundations/Spacing & Radius',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Rhythm: Story = {
  render: () => (
    <section className="mx-auto grid w-full max-w-5xl gap-8 p-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[var(--fr-color-brand-700)]">4px base</p>
          <h1 className="text-2xl font-bold tracking-normal text-[var(--fr-text-primary)]">Spacing rhythm</h1>
          <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">
            Use compact gaps for relation, larger gaps for section changes.
          </p>
        </header>
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 shadow-[var(--fr-shadow-sm)]">
          {spacingTokens.map(([token, value]) => (
            <div className="grid grid-cols-[88px_64px_minmax(0,1fr)] items-center gap-3" key={token}>
              <p className="text-sm font-semibold text-[var(--fr-text-primary)]">{token}</p>
              <p className="text-xs text-[var(--fr-text-secondary)]">{value}</p>
              <div className="h-5 rounded-full bg-[var(--fr-color-sky-500)]" style={{ width: value }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-[var(--fr-color-brand-700)]">Soft geometry</p>
          <h2 className="text-2xl font-bold tracking-normal text-[var(--fr-text-primary)]">Radius scale</h2>
          <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">
            Main learning cards use `16-20px`; controls stay tighter.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 shadow-[var(--fr-shadow-sm)]">
          {radiusTokens.map(([token, value]) => (
            <article className="flex flex-col gap-2" key={token}>
              <div className="h-24 border border-[var(--fr-border-strong)] bg-[var(--fr-color-brand-50)]" style={{ borderRadius: value }} />
              <div>
                <p className="text-sm font-semibold text-[var(--fr-text-primary)]">{token}</p>
                <p className="text-xs text-[var(--fr-text-secondary)]">{value}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  ),
}
