import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { LessonBottomAction } from './LessonBottomAction'
import { LessonFeedback } from './LessonFeedback'

const meta = {
  title: 'Lesson/BottomAction',
  component: LessonBottomAction,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LessonBottomAction>

export default meta
type Story = StoryObj

function BottomActionCanvas({
  disabled = false,
  busy = false,
  withBack = false,
  withFeedback = false,
}: {
  disabled?: boolean
  busy?: boolean
  withBack?: boolean
  withFeedback?: boolean
}) {
  const [count, setCount] = useState(0)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[520px] flex-col justify-end bg-[var(--fr-surface-canvas)] px-4">
      <div className="pb-36 text-sm leading-6 text-[var(--fr-text-secondary)]">
        <p className="rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] p-4 shadow-[var(--fr-shadow-sm)]">
          Sticky action area keeps the primary step reachable on mobile. Click count: {count}
        </p>
      </div>
      <LessonBottomAction
        feedback={
          withFeedback ? (
            <LessonFeedback tone="correct">
              <p>Ответ подходит: в нем есть сумма, срок и спокойный первый шаг.</p>
            </LessonFeedback>
          ) : null
        }
        isBusy={busy}
        onPrimary={() => setCount((current) => current + 1)}
        onSecondary={withBack ? () => setCount((current) => Math.max(0, current - 1)) : undefined}
        primaryDisabled={disabled}
        primaryLabel={busy ? 'Сохраняем' : 'Далее'}
        primaryTone="continue"
        secondaryLabel={withBack ? 'Назад' : undefined}
      />
    </main>
  )
}

export const Default: Story = {
  render: () => <BottomActionCanvas />,
}

export const WithBack: Story = {
  render: () => <BottomActionCanvas withBack />,
}

export const WithFeedback: Story = {
  render: () => <BottomActionCanvas withBack withFeedback />,
}

export const Disabled: Story = {
  render: () => <BottomActionCanvas disabled />,
}

export const Loading: Story = {
  render: () => <BottomActionCanvas busy />,
}
