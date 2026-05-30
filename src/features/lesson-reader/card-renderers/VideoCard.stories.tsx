import type { Meta, StoryObj } from '@storybook/react-vite'

import { videoCard } from '@/features/storybook/fixtures'
import { LessonStoryFrame } from '@/features/storybook/LessonStoryFrame'

import { VideoCard } from './VideoCard'

const meta = {
  title: 'Lesson/VideoCard',
  component: VideoCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof VideoCard>

export default meta
type Story = StoryObj

export const RutubeEmbed: Story = {
  render: () => (
    <LessonStoryFrame card={videoCard} current={3}>
      <VideoCard card={videoCard} />
    </LessonStoryFrame>
  ),
}
