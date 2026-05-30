import type { Meta, StoryObj } from '@storybook/react-vite'

import { scenarioCard, summaryCard, theoryCard } from '@/features/storybook/fixtures'
import { LessonStoryFrame } from '@/features/storybook/LessonStoryFrame'

import { TheoryCard } from './TheoryCard'

const meta = {
  title: 'Lesson/TheoryCard',
  component: TheoryCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TheoryCard>

export default meta
type Story = StoryObj

export const ShortTheory: Story = {
  render: () => (
    <LessonStoryFrame card={theoryCard}>
      <TheoryCard card={theoryCard} />
    </LessonStoryFrame>
  ),
}

export const ReadOnlyScenario: Story = {
  render: () => (
    <LessonStoryFrame card={scenarioCard} current={3}>
      <TheoryCard card={{ ...scenarioCard, readOnly: true }} />
    </LessonStoryFrame>
  ),
}

export const Summary: Story = {
  render: () => (
    <LessonStoryFrame card={summaryCard} current={9}>
      <TheoryCard card={summaryCard} />
    </LessonStoryFrame>
  ),
}
