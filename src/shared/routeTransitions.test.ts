import { describe, expect, it } from 'vitest'

import {
  createLessonReturnState,
  getLessonNodeElementId,
  getRouteKind,
  getRouteTransitionKind,
  isLessonReturnState,
  readPathScrollPosition,
  rememberPathScrollPosition,
} from './routeTransitions'

describe('routeTransitions', () => {
  it('classifies supported authenticated routes', () => {
    expect(getRouteKind('/program')).toBe('program')
    expect(getRouteKind('/profile')).toBe('profile')
    expect(getRouteKind('/levels/level-1-start')).toBe('level')
    expect(getRouteKind('/levels/level-1-start/sections/money-and-operations')).toBe('section')
    expect(getRouteKind('/lessons/where-money-goes')).toBe('lesson')
    expect(getRouteKind('/')).toBe('other')
  })

  it('maps learning route depth changes to forward and back transitions', () => {
    expect(getRouteTransitionKind('/program', '/levels/level-1-start', 'PUSH')).toBe('learning-forward')
    expect(getRouteTransitionKind('/levels/level-1-start', '/program', 'PUSH')).toBe('learning-back')
    expect(getRouteTransitionKind('/levels/level-1-start', '/levels/level-1-start/sections/money-and-operations', 'PUSH')).toBe(
      'learning-forward',
    )
    expect(getRouteTransitionKind('/levels/level-1-start/sections/money-and-operations', '/levels/level-1-start', 'PUSH')).toBe(
      'learning-back',
    )
    expect(getRouteTransitionKind('/levels/level-1-start', '/lessons/where-money-goes', 'PUSH')).toBe('learning-forward')
    expect(getRouteTransitionKind('/lessons/where-money-goes', '/levels/level-1-start', 'PUSH')).toBe('learning-back')
  })

  it('uses direction-aware transitions between lesson routes', () => {
    expect(getRouteTransitionKind('/lessons/where-money-goes', '/lessons/mandatory-and-desired', 'PUSH')).toBe('lesson-forward')
    expect(getRouteTransitionKind('/lessons/mandatory-and-desired', '/lessons/where-money-goes', 'POP')).toBe('lesson-back')
  })

  it('uses a fade for profile and no transition for initial, replace, or unsupported routes', () => {
    expect(getRouteTransitionKind('/program', '/profile', 'PUSH')).toBe('profile-fade')
    expect(getRouteTransitionKind('/profile', '/levels/level-1-start', 'PUSH')).toBe('profile-fade')
    expect(getRouteTransitionKind(null, '/program', 'POP')).toBe('none')
    expect(getRouteTransitionKind('/', '/program', 'REPLACE')).toBe('none')
    expect(getRouteTransitionKind('/unknown', '/program', 'PUSH')).toBe('none')
  })

  it('stores path scroll positions only for level and section routes', () => {
    window.sessionStorage.clear()

    rememberPathScrollPosition('/levels/level-1-start', 128.4)
    rememberPathScrollPosition('/levels/level-1-start/sections/money-and-operations', 240)
    rememberPathScrollPosition('/program', 999)

    expect(readPathScrollPosition('/levels/level-1-start')).toBe(128)
    expect(readPathScrollPosition('/levels/level-1-start/sections/money-and-operations')).toBe(240)
    expect(readPathScrollPosition('/program')).toBeNull()
  })

  it('creates and identifies lesson return state and stable lesson node ids', () => {
    const state = createLessonReturnState('where-money-goes')

    expect(isLessonReturnState(state)).toBe(true)
    expect(isLessonReturnState({ focusLessonSlug: '' })).toBe(false)
    expect(isLessonReturnState({})).toBe(false)
    expect(getLessonNodeElementId('where-money-goes')).toBe('lesson-node-where-money-goes')
  })
})
