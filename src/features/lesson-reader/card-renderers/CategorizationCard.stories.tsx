import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { CategorizationCard } from '@/features/lesson-reader/card-renderers/CategorizationCard'
import {
  emptyCategorizationState,
  type CategorizationCard as CategorizationCardData,
  type CategorizationState,
} from '@/features/lesson-reader/lessonInteraction'
import { categorizationCard } from '@/features/storybook/fixtures'
import { LessonStoryFrame } from '@/features/storybook/LessonStoryFrame'

const meta = {
  title: 'Lesson/CategorizationCard',
  component: CategorizationCard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CategorizationCard>

export default meta
type Story = StoryObj

function CategorizationExample({
  card = categorizationCard,
  initialState = emptyCategorizationState,
}: {
  card?: CategorizationCardData
  initialState?: CategorizationState
}) {
  const [state, setState] = useState(initialState)

  return (
    <LessonStoryFrame card={card} current={6}>
      <CategorizationCard
        card={card}
        onSelect={(itemId, categoryId) =>
          setState((current) => ({
            selectedCategoryIdsByItemId: {
              ...current.selectedCategoryIdsByItemId,
              [itemId]: categoryId,
            },
            isChecked: false,
          }))
        }
        state={state}
      />
    </LessonStoryFrame>
  )
}

export const Default: Story = {
  render: () => <CategorizationExample />,
}

export const Selected: Story = {
  render: () => (
    <CategorizationExample
      initialState={{
        selectedCategoryIdsByItemId: {
          utilities: 'required',
          transport: 'required',
        },
        isChecked: false,
      }}
    />
  ),
}

export const Correct: Story = {
  render: () => (
    <CategorizationExample
      initialState={{
        selectedCategoryIdsByItemId: {
          utilities: 'required',
          transport: 'required',
          streaming: 'desired',
          console: 'desired',
        },
        isChecked: true,
      }}
    />
  ),
}

export const Retry: Story = {
  render: () => (
    <CategorizationExample
      initialState={{
        selectedCategoryIdsByItemId: {
          utilities: 'desired',
          transport: 'required',
          streaming: 'required',
          console: 'desired',
        },
        isChecked: true,
      }}
    />
  ),
}
