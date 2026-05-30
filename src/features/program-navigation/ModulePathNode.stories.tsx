import { MemoryRouter } from 'react-router'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { modulePathItems } from '@/features/storybook/fixtures'

import { ModulePathNode } from './ModulePathNode'

const meta = {
  title: 'Learning/ModulePathNode',
  component: ModulePathNode,
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
} satisfies Meta<typeof ModulePathNode>

export default meta
type Story = StoryObj<typeof meta>

export const Current: Story = {
  args: {
    item: modulePathItems.current,
    index: 1,
  },
}

export const Completed: Story = {
  args: {
    item: modulePathItems.completed,
    index: 1,
  },
}

export const Locked: Story = {
  args: {
    item: modulePathItems.locked,
    index: 2,
  },
}
