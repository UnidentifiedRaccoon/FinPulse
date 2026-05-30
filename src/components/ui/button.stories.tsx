import { ArrowRight, Check, LoaderCircle } from 'lucide-react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/ui/button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const LearningActions: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-3">
      <Button className="min-h-12 rounded-xl bg-[var(--fr-color-sky-500)] px-4 text-[15px] font-semibold text-white hover:bg-[var(--fr-color-sky-600)]">
        Продолжить
        <ArrowRight data-icon="inline-end" />
      </Button>
      <Button className="min-h-12 rounded-xl bg-[var(--fr-color-brand-500)] px-4 text-[15px] font-semibold text-white hover:bg-[var(--fr-color-brand-600)]">
        Проверить
        <Check data-icon="inline-end" />
      </Button>
      <Button disabled className="min-h-12 rounded-xl px-4 text-[15px] font-semibold">
        Недоступно
      </Button>
      <Button disabled className="min-h-12 rounded-xl px-4 text-[15px] font-semibold">
        Сохраняем
        <LoaderCircle className="animate-spin" data-icon="inline-end" />
      </Button>
    </div>
  ),
}
