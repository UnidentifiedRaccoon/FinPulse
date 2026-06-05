import type { ReactNode } from 'react'

import type { Card } from '@/content/program'
import { LessonCardFrame } from '@/features/lesson-reader/LessonCardFrame'

export function LessonStoryFrame({
  card,
  children,
  current = 1,
  total = 9,
}: {
  card: Card
  children: ReactNode
  current?: number
  total?: number
}) {
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <LessonCardFrame card={card} current={current} total={total}>
        {children}
      </LessonCardFrame>
    </div>
  )
}
