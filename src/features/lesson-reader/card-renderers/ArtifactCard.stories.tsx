import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ArtifactCard } from '@/features/lesson-reader/card-renderers/ArtifactCard'
import { createArtifactState, type ArtifactState } from '@/features/lesson-reader/lessonInteraction'
import { artifactCard } from '@/features/storybook/fixtures'
import { LessonStoryFrame } from '@/features/storybook/LessonStoryFrame'

const meta = {
  title: 'Lesson/ArtifactCard',
  component: ArtifactCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ArtifactCard>

export default meta
type Story = StoryObj

function ArtifactExample({ initialState = createArtifactState(artifactCard) }: { initialState?: ArtifactState }) {
  const [state, setState] = useState(initialState)

  return (
    <LessonStoryFrame card={artifactCard} current={8}>
      <ArtifactCard card={artifactCard} onChange={setState} state={state} />
    </LessonStoryFrame>
  )
}

export const Default: Story = {
  render: () => <ArtifactExample />,
}

export const SelectedVariant: Story = {
  render: () => <ArtifactExample initialState={{ ...createArtifactState(artifactCard), selectedVariant: 'Резерв' }} />,
}

export const FilledTemplate: Story = {
  render: () => (
    <ArtifactExample
      initialState={{
        selectedVariant: 'Резерв',
        isCustomVariantSelected: false,
        customVariantValue: '',
        checkedRows: ['0', '1'],
        templateValues: ['2 000 ₽', 'В день зарплаты', 'Забыть перевести вручную'],
        fallbackValue: '',
      }}
    />
  ),
}

export const ReadOnly: Story = {
  render: () => (
    <LessonStoryFrame card={{ ...artifactCard, readOnly: true }} current={8}>
      <ArtifactCard card={{ ...artifactCard, readOnly: true }} onChange={() => undefined} state={createArtifactState(artifactCard)} />
    </LessonStoryFrame>
  ),
}
