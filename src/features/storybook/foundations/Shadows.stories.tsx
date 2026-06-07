import type { Meta, StoryObj } from '@storybook/react-vite'

const shadowTokens = [
  ['shadow.sm', '--fr-shadow-sm', 'Small cards and list items'],
  ['shadow.md', '--fr-shadow-md', 'Focused lesson cards'],
  ['shadow.focus', '--fr-shadow-focus', 'Visible focus affordance'],
] as const

const stateTokens = [
  ['Default', 'border-[var(--fr-border-default)] bg-[var(--fr-surface-card)]'],
  ['Current', 'border-[var(--fr-color-sky-500)] bg-white shadow-[0_8px_24px_rgba(30,155,215,0.16)]'],
  ['Completed', 'border-[var(--fr-color-learn-correct-500)]/35 bg-[var(--fr-color-learn-correct-50)]'],
  ['Locked', 'border-[var(--fr-border-default)] bg-[var(--fr-surface-muted)] opacity-90'],
] as const

const meta = {
  title: 'Foundations/Shadows',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ElevationAndStates: Story = {
  render: () => (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[var(--fr-color-brand-700)]">Soft elevation</p>
        <h1 className="text-2xl font-bold tracking-normal text-[var(--fr-text-primary)]">Shadows and semantic states</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--fr-text-secondary)]">
          ФинПульс uses cold, low-contrast elevation and non-red learning states.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {shadowTokens.map(([label, token, usage]) => (
          <article
            className="flex min-h-36 flex-col justify-between rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4"
            key={token}
            style={{ boxShadow: `var(${token})` }}
          >
            <div>
              <p className="text-lg font-bold text-[var(--fr-text-primary)]">{label}</p>
              <p className="text-sm leading-6 text-[var(--fr-text-secondary)]">{usage}</p>
            </div>
            <p className="break-all text-xs text-[var(--fr-text-tertiary)]">{token}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {stateTokens.map(([label, className]) => (
          <article className={`min-h-28 rounded-2xl border p-4 shadow-[var(--fr-shadow-sm)] ${className}`} key={label}>
            <p className="font-semibold text-[var(--fr-text-primary)]">{label}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--fr-text-secondary)]">
              State must be recognizable by border, icon, shape, or copy, not color alone.
            </p>
          </article>
        ))}
      </div>
    </section>
  ),
}
