import type { Meta, StoryObj } from '@storybook/react-vite'

const colorGroups = [
  {
    name: 'Brand',
    tokens: [
      ['brand.50', '--fr-color-brand-50', '#EFF7FF'],
      ['brand.100', '--fr-color-brand-100', '#DDF0FF'],
      ['brand.200', '--fr-color-brand-200', '#BDE0FF'],
      ['brand.300', '--fr-color-brand-300', '#8FC9FA'],
      ['brand.400', '--fr-color-brand-400', '#55ADF4'],
      ['brand.500', '--fr-color-brand-500', '#1787F2'],
      ['brand.600', '--fr-color-brand-600', '#0D6FE8'],
      ['brand.700', '--fr-color-brand-700', '#0758C7'],
      ['sky.400', '--fr-color-sky-400', '#5BC0EB'],
      ['sky.500', '--fr-color-sky-500', '#1E9BD7'],
      ['sky.600', '--fr-color-sky-600', '#1479B8'],
    ],
  },
  {
    name: 'Surfaces and text',
    tokens: [
      ['surface.canvas', '--fr-surface-canvas', '#F7FBFF'],
      ['surface.card', '--fr-surface-card', '#FFFFFF'],
      ['surface.soft', '--fr-surface-soft', '#F1F7FE'],
      ['surface.muted', '--fr-surface-muted', '#F6F8FB'],
      ['border.subtle', '--fr-border-subtle', '#EEF4FB'],
      ['border.default', '--fr-border-default', '#DDE9F6'],
      ['border.strong', '--fr-border-strong', '#BFD6EF'],
      ['text.primary', '--fr-text-primary', '#10234A'],
      ['text.secondary', '--fr-text-secondary', '#637188'],
      ['text.tertiary', '--fr-text-tertiary', '#9AA8BA'],
    ],
  },
  {
    name: 'Learning states',
    tokens: [
      ['learn.correct.50', '--fr-color-learn-correct-50', '#EAFBF4'],
      ['learn.correct.500', '--fr-color-learn-correct-500', '#26C895'],
      ['learn.almost.50', '--fr-color-learn-almost-50', '#FFF7E8'],
      ['learn.almost.500', '--fr-color-learn-almost-500', '#FFB547'],
      ['learn.retry.50', '--fr-color-learn-retry-50', '#FFF3F1'],
      ['learn.retry.500', '--fr-color-learn-retry-500', '#E86B5C'],
      ['danger.50', '--fr-color-danger-50', '#FFF1F1'],
      ['danger.500', '--fr-color-danger-500', '#E84B4B'],
    ],
  },
] as const

const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Palette: Story = {
  render: () => (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[var(--fr-color-brand-700)]">FinPulse tokens</p>
        <h1 className="text-2xl font-bold tracking-normal text-[var(--fr-text-primary)]">Color system</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--fr-text-secondary)]">
          Use the FinPulse `--fr-*` tokens for product surfaces, learning states, and UI accents.
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-3">
        {colorGroups.map((group) => (
          <section className="flex flex-col gap-3" key={group.name}>
            <h2 className="text-lg font-bold tracking-normal text-[var(--fr-text-primary)]">{group.name}</h2>
            <div className="grid gap-3">
              {group.tokens.map(([label, token, value]) => (
                <article
                  className="grid grid-cols-[72px_minmax(0,1fr)] overflow-hidden rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] shadow-[var(--fr-shadow-sm)]"
                  key={token}
                >
                  <div className="min-h-20 border-r border-[var(--fr-border-default)]" style={{ background: `var(${token})` }} />
                  <div className="flex min-w-0 flex-col justify-center gap-1 p-3">
                    <p className="font-semibold text-[var(--fr-text-primary)]">{label}</p>
                    <p className="break-all text-xs leading-5 text-[var(--fr-text-secondary)]">{token}</p>
                    <p className="text-xs font-semibold uppercase text-[var(--fr-text-tertiary)]">{value}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  ),
}
