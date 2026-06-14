import { useLayoutEffect, useRef } from 'react'

import {
  getLessonNodeElementId,
  isLessonReturnState,
  readPathScrollPosition,
  type RouteNavigationType,
} from './routeTransitions'

export function usePathReturnScroll({
  isReady,
  navigationType,
  pathname,
  state,
}: {
  isReady: boolean
  navigationType: RouteNavigationType
  pathname: string
  state: unknown
}) {
  const restoredKeyRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    if (!isReady) return

    const focusLessonSlug = isLessonReturnState(state) ? state.focusLessonSlug : ''
    const restoreKey = `${pathname}:${navigationType}:${focusLessonSlug}`
    if (restoredKeyRef.current === restoreKey) return

    const animationFrame = window.requestAnimationFrame(() => {
      restoredKeyRef.current = restoreKey

      if (focusLessonSlug) {
        const lessonNode = document.getElementById(getLessonNodeElementId(focusLessonSlug))
        if (lessonNode) {
          lessonNode.scrollIntoView({ block: 'center', behavior: 'auto' })
          return
        }
      }

      if (navigationType !== 'POP') return

      const storedScrollPosition = readPathScrollPosition(pathname)
      if (storedScrollPosition !== null) {
        window.scrollTo({ top: storedScrollPosition, behavior: 'auto' })
      }
    })

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [isReady, navigationType, pathname, state])
}
