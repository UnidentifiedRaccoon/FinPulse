import { MemoryRouter } from 'react-router'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { lessonFixture } from '@/features/storybook/fixtures'

import { CurrentStepCta } from './CurrentStepCta'

const meta = {
  title: 'Learning/CurrentStepCta',
  component: CurrentStepCta,
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
} satisfies Meta<typeof CurrentStepCta>

export default meta
type Story = StoryObj<typeof meta>

export const NextLesson: Story = {
  args: {
    lesson: lessonFixture,
    isComplete: false,
    fallbackTo: '/modules/personal-finance-start',
  },
}

export const EmptyStart: Story = {
  args: {
    lesson: null,
    isComplete: false,
    fallbackTo: '/modules/personal-finance-start',
  },
}

export const RouteComplete: Story = {
  args: {
    lesson: lessonFixture,
    isComplete: true,
    fallbackTo: '/modules/personal-finance-start',
  },
}
