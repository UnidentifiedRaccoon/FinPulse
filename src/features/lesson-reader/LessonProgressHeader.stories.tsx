import { MemoryRouter } from 'react-router'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { lessonFixture, moduleFixture, unitFixture } from '@/features/storybook/fixtures'

import { LessonProgressHeader } from './LessonProgressHeader'

const meta = {
  title: 'Lesson/ProgressHeader',
  component: LessonProgressHeader,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <main className="mx-auto min-h-svh w-full max-w-[520px] bg-[var(--fr-surface-canvas)] px-4">
          <Story />
        </main>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof LessonProgressHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Current: Story = {
  args: {
    backTo: `/modules/${moduleFixture.slug}`,
    backLabel: `Вернуться к модулю ${moduleFixture.title}`,
    context: `${moduleFixture.title} · ${unitFixture.title}`,
    title: lessonFixture.title,
    current: 2,
    total: 9,
    isComplete: false,
    isSavedComplete: false,
  },
}

export const SavedComplete: Story = {
  args: {
    backTo: `/modules/${moduleFixture.slug}`,
    backLabel: `Вернуться к модулю ${moduleFixture.title}`,
    context: `${moduleFixture.title} · ${unitFixture.title}`,
    title: lessonFixture.title,
    current: 9,
    total: 9,
    isComplete: false,
    isSavedComplete: true,
  },
}

export const Complete: Story = {
  args: {
    backTo: `/modules/${moduleFixture.slug}`,
    backLabel: `Вернуться к модулю ${moduleFixture.title}`,
    context: `${moduleFixture.title} · ${unitFixture.title}`,
    title: lessonFixture.title,
    current: 9,
    total: 9,
    isComplete: true,
    isSavedComplete: true,
  },
}
