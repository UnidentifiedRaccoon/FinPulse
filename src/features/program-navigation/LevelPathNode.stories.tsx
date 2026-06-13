import { MemoryRouter } from 'react-router'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { levelPathItems } from '@/features/storybook/fixtures'

import { LevelPathNode } from './LevelPathNode'

const meta = {
  title: 'Learning/LevelPathNode',
  component: LevelPathNode,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="w-[380px] max-w-full">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof LevelPathNode>

export default meta
type Story = StoryObj<typeof meta>

export const Current: Story = {
  args: {
    item: levelPathItems.current,
    index: 1,
  },
}

export const Completed: Story = {
  args: {
    item: levelPathItems.completed,
    index: 1,
  },
}

export const Locked: Story = {
  args: {
    item: levelPathItems.locked,
    index: 2,
  },
}
