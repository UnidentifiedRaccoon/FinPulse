'use client'

import { useCallback, useEffect, useState } from 'react'

export const DETAIL_PANEL_STORAGE_KEY = 'finpulse.admin.detailPanelWidth'
export const DETAIL_PANEL_DEFAULT_WIDTH = 520
export const DETAIL_PANEL_MIN_WIDTH = 480
export const DETAIL_PANEL_MAX_WIDTH = 760
export const DETAIL_PANEL_KEYBOARD_STEP = 24

type WidthUpdate = number | ((currentWidth: number) => number)

export function getDetailPanelMaxWidth(viewportWidth: number | null = null) {
  if (!viewportWidth || viewportWidth <= 0) {
    return DETAIL_PANEL_MAX_WIDTH
  }

  return Math.max(DETAIL_PANEL_MIN_WIDTH, Math.min(DETAIL_PANEL_MAX_WIDTH, Math.floor(viewportWidth * 0.6)))
}

export function clampDetailPanelWidth(width: number, viewportWidth: number | null = null) {
  const maxWidth = getDetailPanelMaxWidth(viewportWidth)
  return Math.min(Math.max(Math.round(width), DETAIL_PANEL_MIN_WIDTH), maxWidth)
}

export function readStoredDetailPanelWidth(storage: Storage | null, viewportWidth: number | null = null) {
  if (!storage) {
    return clampDetailPanelWidth(DETAIL_PANEL_DEFAULT_WIDTH, viewportWidth)
  }

  const storedValue = storage.getItem(DETAIL_PANEL_STORAGE_KEY)
  if (!storedValue) {
    return clampDetailPanelWidth(DETAIL_PANEL_DEFAULT_WIDTH, viewportWidth)
  }

  const storedWidth = Number(storedValue)

  if (!Number.isFinite(storedWidth)) {
    return clampDetailPanelWidth(DETAIL_PANEL_DEFAULT_WIDTH, viewportWidth)
  }

  return clampDetailPanelWidth(storedWidth, viewportWidth)
}

export function usePersistedDetailPanelWidth() {
  const [detailPanelWidth, setDetailPanelWidthState] = useState(DETAIL_PANEL_DEFAULT_WIDTH)
  const [maxWidth, setMaxWidth] = useState(DETAIL_PANEL_MAX_WIDTH)
  const [isReady, setIsReady] = useState(false)

  const setDetailPanelWidth = useCallback((nextWidth: WidthUpdate) => {
    setDetailPanelWidthState((currentWidth) => {
      const rawWidth = typeof nextWidth === 'function' ? nextWidth(currentWidth) : nextWidth
      const viewportWidth = typeof window === 'undefined' ? null : window.innerWidth

      return clampDetailPanelWidth(rawWidth, viewportWidth)
    })
  }, [])

  useEffect(() => {
    const restoreFrame = window.requestAnimationFrame(() => {
      const initialViewportWidth = window.innerWidth
      setMaxWidth(getDetailPanelMaxWidth(initialViewportWidth))
      setDetailPanelWidthState(readStoredDetailPanelWidth(window.localStorage, initialViewportWidth))
      setIsReady(true)
    })

    function syncWidthFromViewport() {
      const viewportWidth = window.innerWidth
      setMaxWidth(getDetailPanelMaxWidth(viewportWidth))
      setDetailPanelWidthState((currentWidth) => clampDetailPanelWidth(currentWidth, viewportWidth))
    }

    window.addEventListener('resize', syncWidthFromViewport)

    return () => {
      window.cancelAnimationFrame(restoreFrame)
      window.removeEventListener('resize', syncWidthFromViewport)
    }
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }

    window.localStorage.setItem(DETAIL_PANEL_STORAGE_KEY, String(detailPanelWidth))
  }, [detailPanelWidth, isReady])

  return {
    detailPanelWidth,
    maxWidth,
    setDetailPanelWidth,
  }
}
