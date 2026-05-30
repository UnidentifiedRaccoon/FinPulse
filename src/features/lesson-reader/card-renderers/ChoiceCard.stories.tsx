import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ChoiceCard } from '@/features/lesson-reader/card-renderers/ChoiceCard'
import { emptyChoiceState, type ChoiceCard as ChoiceCardData, type ChoiceState } from '@/features/lesson-reader/lessonInteraction'
import { choiceCard, scenarioCard } from '@/features/storybook/fixtures'
import { LessonStoryFrame } from '@/features/storybook/LessonStoryFrame'

const meta = {
  title: 'Lesson/ChoiceCard',
  component: ChoiceCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChoiceCard>

export default meta
type Story = StoryObj

function ChoiceExample({
  card = choiceCard,
  initialState = emptyChoiceState,
}: {
  card?: ChoiceCardData
  initialState?: ChoiceState
}) {
  const [state, setState] = useState(initialState)

  return (
    <LessonStoryFrame card={card} current={2}>
      <ChoiceCard
        card={card}
        onSelect={(optionId) =>
          setState({
            selectedOptionId: optionId,
            isChecked: false,
          })
        }
        state={state}
      />
    </LessonStoryFrame>
  )
}

export const Default: Story = {
  render: () => <ChoiceExample />,
}

export const Selected: Story = {
  render: () => <ChoiceExample initialState={{ selectedOptionId: 'measurable', isChecked: false }} />,
}

export const Correct: Story = {
  render: () => <ChoiceExample initialState={{ selectedOptionId: 'measurable', isChecked: true }} />,
}

export const Retry: Story = {
  render: () => <ChoiceExample initialState={{ selectedOptionId: 'abstract', isChecked: true }} />,
}

export const Scenario: Story = {
  render: () => (
    <ChoiceExample card={scenarioCard} initialState={{ selectedOptionId: 'reserve', isChecked: true }} />
  ),
}
