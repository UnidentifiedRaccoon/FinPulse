export type RouteKind = 'program' | 'profile' | 'level' | 'section' | 'lesson' | 'other'

export type RouteTransitionKind =
  | 'none'
  | 'learning-forward'
  | 'learning-back'
  | 'lesson-forward'
  | 'lesson-back'
  | 'profile-fade'

export type RouteNavigationType = 'POP' | 'PUSH' | 'REPLACE'

export type LessonReturnState = {
  focusLessonSlug: string
}

const pathScrollStoragePrefix = 'finpulse:path-scroll:'

export function getRouteKind(pathname: string): RouteKind {
  if (pathname === '/program') return 'program'
  if (pathname === '/profile') return 'profile'
  if (/^\/levels\/[^/]+\/sections\/[^/]+$/.test(pathname)) return 'section'
  if (/^\/levels\/[^/]+$/.test(pathname)) return 'level'
  if (/^\/lessons\/[^/]+$/.test(pathname)) return 'lesson'
  return 'other'
}

export function getRouteTransitionKind(
  previousPathname: string | null,
  nextPathname: string,
  navigationType: RouteNavigationType,
): RouteTransitionKind {
  if (!previousPathname || navigationType === 'REPLACE') return 'none'

  const previousKind = getRouteKind(previousPathname)
  const nextKind = getRouteKind(nextPathname)

  if (previousKind === 'other' || nextKind === 'other') return 'none'
  if (previousKind === nextKind && previousPathname === nextPathname) return 'none'
  if (previousKind === 'profile' || nextKind === 'profile') return 'profile-fade'

  if (previousKind === 'lesson' && nextKind === 'lesson') {
    return navigationType === 'POP' ? 'lesson-back' : 'lesson-forward'
  }

  const previousDepth = getLearningRouteDepth(previousKind)
  const nextDepth = getLearningRouteDepth(nextKind)

  if (previousDepth === null || nextDepth === null || previousDepth === nextDepth) return 'none'
  return nextDepth > previousDepth ? 'learning-forward' : 'learning-back'
}

export function createLessonReturnState(lessonSlug: string): LessonReturnState {
  return { focusLessonSlug: lessonSlug }
}

export function isLessonReturnState(state: unknown): state is LessonReturnState {
  return (
    typeof state === 'object' &&
    state !== null &&
    'focusLessonSlug' in state &&
    typeof state.focusLessonSlug === 'string' &&
    state.focusLessonSlug.length > 0
  )
}

export function getLessonNodeElementId(lessonSlug: string) {
  return `lesson-node-${lessonSlug}`
}

export function rememberPathScrollPosition(pathname = getWindowPathname(), scrollY = getWindowScrollY()) {
  const key = getPathScrollStorageKey(pathname)
  if (!key) return

  window.sessionStorage.setItem(key, String(Math.max(0, Math.round(scrollY))))
}

export function readPathScrollPosition(pathname: string) {
  const key = getPathScrollStorageKey(pathname)
  if (!key) return null

  const storedValue = window.sessionStorage.getItem(key)
  if (!storedValue) return null

  const parsedValue = Number.parseInt(storedValue, 10)
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : null
}

function getLearningRouteDepth(kind: RouteKind) {
  switch (kind) {
    case 'program':
      return 0
    case 'level':
      return 1
    case 'section':
      return 2
    case 'lesson':
      return 3
    case 'profile':
    case 'other':
      return null
  }
}

function getPathScrollStorageKey(pathname: string) {
  const routeKind = getRouteKind(pathname)
  if (routeKind !== 'level' && routeKind !== 'section') return null
  return `${pathScrollStoragePrefix}${pathname}`
}

function getWindowPathname() {
  return typeof window === 'undefined' ? '' : window.location.pathname
}

function getWindowScrollY() {
  return typeof window === 'undefined' ? 0 : window.scrollY
}
