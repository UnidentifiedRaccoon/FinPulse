import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ChecklistCard } from '@/features/lesson-reader/card-renderers/ChecklistCard'
import { emptyChecklistState, type ChecklistState } from '@/features/lesson-reader/lessonInteraction'
import { checklistCard } from '@/features/storybook/fixtures'
import { LessonStoryFrame } from '@/features/storybook/LessonStoryFrame'

const meta = {
  title: 'Lesson/ChecklistCard',
  component: ChecklistCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChecklistCard>

export default meta
type Story = StoryObj

function ChecklistExample({ initialState = emptyChecklistState }: { initialState?: ChecklistState }) {
  const [state, setState] = useState(initialState)

  return (
    <LessonStoryFrame card={checklistCard} current={4}>
      <ChecklistCard
        card={checklistCard}
        onToggle={(itemKey) =>
          setState((current) => ({
            checkedItems: current.checkedItems.includes(itemKey)
              ? current.checkedItems.filter((item) => item !== itemKey)
              : [...current.checkedItems, itemKey],
          }))
        }
        state={state}
      />
    </LessonStoryFrame>
  )
}

export const Default: Story = {
  render: () => <ChecklistExample />,
}

export const PartlyCompleted: Story = {
  render: () => <ChecklistExample initialState={{ checkedItems: ['0', '2'] }} />,
}

export const Completed: Story = {
  render: () => <ChecklistExample initialState={{ checkedItems: ['0', '1', '2'] }} />,
}
