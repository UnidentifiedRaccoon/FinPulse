import type { Meta, StoryObj } from '@storybook/react-vite'

import { LessonFeedback } from './LessonFeedback'

const meta = {
  title: 'Lesson/Feedback',
  component: LessonFeedback,
  parameters: {
    layout: 'centered',
  },
  decorators: [(Story) => <div className="w-[420px] max-w-full"><Story /></div>],
  tags: ['autodocs'],
} satisfies Meta<typeof LessonFeedback>

export default meta
type Story = StoryObj<typeof meta>

export const Correct: Story = {
  args: {
    tone: 'correct',
    children: <p>Есть сумма и срок. Такой шаг легко проверить без давления.</p>,
  },
}

export const Almost: Story = {
  args: {
    tone: 'almost',
    children: <p>Направление понятное, но стоит добавить конкретный первый шаг.</p>,
  },
}

export const Retry: Story = {
  args: {
    tone: 'retry',
    children: <p>Попробуйте выбрать вариант, где есть действие, срок или сумма.</p>,
  },
}

export const Info: Story = {
  args: {
    tone: 'info',
    title: 'Черновик принят',
    children: <p>Ответ принят как личная заметка.</p>,
  },
}
