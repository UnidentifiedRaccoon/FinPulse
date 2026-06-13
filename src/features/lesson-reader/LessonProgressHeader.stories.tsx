import { MemoryRouter } from 'react-router'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { lessonFixture, levelFixture, sectionFixture } from '@/features/storybook/fixtures'

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
        <main className="mx-auto min-h-svh w-full max-w-[480px] bg-[var(--fr-surface-canvas)] px-5">
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
    backTo: `/levels/${levelFixture.slug}`,
    backLabel: `Вернуться к уровню ${levelFixture.title}`,
    context: `${levelFixture.title} · ${sectionFixture.title}`,
    title: lessonFixture.title,
    current: 2,
    total: 9,
    isComplete: false,
    isSavedComplete: false,
  },
}

export const SavedComplete: Story = {
  args: {
    backTo: `/levels/${levelFixture.slug}`,
    backLabel: `Вернуться к уровню ${levelFixture.title}`,
    context: `${levelFixture.title} · ${sectionFixture.title}`,
    title: lessonFixture.title,
    current: 9,
    total: 9,
    isComplete: false,
    isSavedComplete: true,
  },
}

export const Complete: Story = {
  args: {
    backTo: `/levels/${levelFixture.slug}`,
    backLabel: `Вернуться к уровню ${levelFixture.title}`,
    context: `${levelFixture.title} · ${sectionFixture.title}`,
    title: lessonFixture.title,
    current: 9,
    total: 9,
    isComplete: true,
    isSavedComplete: true,
  },
}

export const LongRussianTitle: Story = {
  args: {
    backTo: `/levels/${levelFixture.slug}`,
    backLabel: `Вернуться к уровню ${levelFixture.title}`,
    context: 'T1 Старт · Раздел 1. Деньги и операции',
    title: 'Куда уходят деньги: первые денежные утечки без осуждения',
    current: 1,
    total: 7,
    isComplete: false,
    isSavedComplete: false,
  },
}
