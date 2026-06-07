import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { MultiSelectCard } from '@/features/lesson-reader/card-renderers/MultiSelectCard'
import {
  emptyMultiSelectState,
  type MultiSelectCard as MultiSelectCardData,
  type MultiSelectState,
} from '@/features/lesson-reader/lessonInteraction'
import { multiSelectCard } from '@/features/storybook/fixtures'
import { LessonStoryFrame } from '@/features/storybook/LessonStoryFrame'

const meta = {
  title: 'Lesson/MultiSelectCard',
  component: MultiSelectCard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MultiSelectCard>

export default meta
type Story = StoryObj

function MultiSelectExample({
  card = multiSelectCard,
  initialState = emptyMultiSelectState,
}: {
  card?: MultiSelectCardData
  initialState?: MultiSelectState
}) {
  const [state, setState] = useState(initialState)

  return (
    <LessonStoryFrame card={card} current={5}>
      <MultiSelectCard
        card={card}
        onToggle={(optionId) =>
          setState((current) => ({
            selectedOptionIds: current.selectedOptionIds.includes(optionId)
              ? current.selectedOptionIds.filter((selectedOptionId) => selectedOptionId !== optionId)
              : [...current.selectedOptionIds, optionId],
            isChecked: false,
          }))
        }
        state={state}
      />
    </LessonStoryFrame>
  )
}

export const Default: Story = {
  render: () => <MultiSelectExample />,
}

export const Selected: Story = {
  render: () => (
    <MultiSelectExample initialState={{ selectedOptionIds: ['repair', 'income-gap'], isChecked: false }} />
  ),
}

export const Correct: Story = {
  render: () => (
    <MultiSelectExample
      initialState={{ selectedOptionIds: ['repair', 'income-gap', 'treatment'], isChecked: true }}
    />
  ),
}

export const Retry: Story = {
  render: () => (
    <MultiSelectExample initialState={{ selectedOptionIds: ['repair', 'status-phone'], isChecked: true }} />
  ),
}
