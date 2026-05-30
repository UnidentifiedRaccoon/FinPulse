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
    <div className="w-[420px] max-w-full">
      <LessonCardFrame card={card} current={current} total={total}>
        {children}
      </LessonCardFrame>
    </div>
  )
}
