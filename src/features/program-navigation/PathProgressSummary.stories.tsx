import type { Meta, StoryObj } from '@storybook/react-vite'

import { PathProgressSummary } from './PathProgressSummary'

const meta = {
  title: 'Learning/PathProgressSummary',
  component: PathProgressSummary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PathProgressSummary>

export default meta
type Story = StoryObj<typeof meta>

export const CurrentProgress: Story = {
  args: {
    completed: 1,
    total: 3,
    label: 'Ваш прогресс',
  },
  decorators: [(Story) => <div className="w-[360px] max-w-full"><Story /></div>],
}

export const Completed: Story = {
  args: {
    completed: 3,
    total: 3,
    label: 'Маршрут завершен',
  },
  decorators: [(Story) => <div className="w-[360px] max-w-full"><Story /></div>],
}
