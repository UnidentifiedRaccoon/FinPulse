import type { Meta, StoryObj } from '@storybook/react-vite'

import { LessonCardFrame } from '@/features/lesson-reader/LessonCardFrame'
import { choiceCard, reflectionCard, theoryCard } from '@/features/storybook/fixtures'

const meta = {
  title: 'Lesson/CardFrame',
  component: LessonCardFrame,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LessonCardFrame>

export default meta
type Story = StoryObj

export const Theory: Story = {
  render: () => (
    <div className="w-[420px] max-w-full">
      <LessonCardFrame card={theoryCard} current={1} total={9}>
        <p className="text-base leading-7 text-[var(--fr-text-secondary)]">
          Каркас показывает тип карточки, позицию в уроке и сохраняет мягкую поверхность для одного учебного смысла.
        </p>
      </LessonCardFrame>
    </div>
  ),
}

export const Choice: Story = {
  render: () => (
    <div className="w-[420px] max-w-full">
      <LessonCardFrame card={choiceCard} current={2} total={9}>
        <p className="text-base leading-7 text-[var(--fr-text-secondary)]">
          Интерактивные карточки используют тот же контейнер, но содержат собственные состояния выбора и обратной связи.
        </p>
      </LessonCardFrame>
    </div>
  ),
}

export const Reflection: Story = {
  render: () => (
    <div className="w-[420px] max-w-full">
      <LessonCardFrame card={reflectionCard} current={5} total={9}>
        <p className="text-base leading-7 text-[var(--fr-text-secondary)]">
          Рефлексия остается локальной и не превращается в диагностику или скоринг.
        </p>
      </LessonCardFrame>
    </div>
  ),
}
