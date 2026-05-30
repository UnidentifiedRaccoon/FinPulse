import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ReflectionCard } from '@/features/lesson-reader/card-renderers/ReflectionCard'
import {
  emptyReflectionState,
  type ReflectionCard as ReflectionCardData,
  type ReflectionState,
} from '@/features/lesson-reader/lessonInteraction'
import { reflectionCard, reflectionMultiCard, reflectionSelectCard } from '@/features/storybook/fixtures'
import { LessonStoryFrame } from '@/features/storybook/LessonStoryFrame'

const meta = {
  title: 'Lesson/ReflectionCard',
  component: ReflectionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReflectionCard>

export default meta
type Story = StoryObj

function ReflectionExample({
  card = reflectionCard,
  initialState = emptyReflectionState,
}: {
  card?: ReflectionCardData
  initialState?: ReflectionState
}) {
  const [state, setState] = useState(initialState)

  return (
    <LessonStoryFrame card={card} current={5}>
      <ReflectionCard card={card} onChange={setState} state={state} />
    </LessonStoryFrame>
  )
}

export const Freeform: Story = {
  render: () => <ReflectionExample />,
}

export const FilledDraft: Story = {
  render: () => (
    <ReflectionExample
      initialState={{
        ...emptyReflectionState,
        textValue: 'Отложить 2 000 ₽ в резерв в день зарплаты.',
      }}
    />
  ),
}

export const SingleSelect: Story = {
  render: () => (
    <ReflectionExample
      card={reflectionSelectCard}
      initialState={{
        ...emptyReflectionState,
        singleValue: 'Резерв',
      }}
    />
  ),
}

export const MultiSelect: Story = {
  render: () => (
    <ReflectionExample
      card={reflectionMultiCard}
      initialState={{
        ...emptyReflectionState,
        multiValues: ['Есть регулярный доход', 'Есть сумма для первого шага'],
      }}
    />
  ),
}

export const ReadOnly: Story = {
  render: () => <ReflectionExample card={{ ...reflectionSelectCard, readOnly: true }} />,
}
