import { MemoryRouter } from 'react-router'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { lessonFixture } from '@/features/storybook/fixtures'

import { PathStepNode } from './PathStepNode'

const meta = {
  title: 'Learning/PathStepNode',
  component: PathStepNode,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="w-[360px] max-w-full">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PathStepNode>

export default meta
type Story = StoryObj<typeof meta>

export const Current: Story = {
  args: {
    title: lessonFixture.title,
    description: lessonFixture.description,
    meta: '4 мин',
    state: 'current',
    to: `/lessons/${lessonFixture.slug}`,
    index: 2,
  },
}

export const Completed: Story = {
  args: {
    title: 'Цель уже собрана',
    description: 'Пользователь завершил этот короткий шаг.',
    meta: '3 мин',
    state: 'completed',
    to: '/lessons/money-goal-completed',
    index: 1,
  },
}

export const Locked: Story = {
  args: {
    title: 'Следующий шаг маршрута',
    description: 'Визуально будущий урок, без жесткой блокировки доступа.',
    meta: '5 мин',
    state: 'locked',
    to: '/lessons/money-goal-locked',
    index: 3,
  },
}
