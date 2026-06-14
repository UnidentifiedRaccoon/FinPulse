'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react'

import { DETAIL_PANEL_KEYBOARD_STEP, DETAIL_PANEL_MIN_WIDTH } from './usePersistedDetailPanelWidth'

type ResizableSplitHandleProps = {
  maxWidth: number
  width: number
  onWidthChange: (width: number | ((currentWidth: number) => number)) => void
}

export function ResizableSplitHandle({ maxWidth, width, onWidthChange }: ResizableSplitHandleProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef<{ pointerX: number; width: number } | null>(null)

  useEffect(() => {
    if (!isDragging) {
      return
    }

    function handlePointerMove(event: PointerEvent) {
      if (!dragStart.current) {
        return
      }

      const delta = dragStart.current.pointerX - event.clientX
      onWidthChange(dragStart.current.width + delta)
    }

    function handlePointerUp() {
      setIsDragging(false)
      dragStart.current = null
    }

    document.body.classList.add('is-resizing-admin-split')
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      document.body.classList.remove('is-resizing-admin-split')
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, onWidthChange])

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.preventDefault()
    dragStart.current = {
      pointerX: event.clientX,
      width,
    }
    setIsDragging(true)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      onWidthChange((currentWidth) => currentWidth + DETAIL_PANEL_KEYBOARD_STEP)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      onWidthChange((currentWidth) => currentWidth - DETAIL_PANEL_KEYBOARD_STEP)
    } else if (event.key === 'Home') {
      event.preventDefault()
      onWidthChange(DETAIL_PANEL_MIN_WIDTH)
    } else if (event.key === 'End') {
      event.preventDefault()
      onWidthChange(maxWidth)
    }
  }

  return (
    <div className="split-resizer" aria-label="Управление шириной деталей пользователя">
      <div
        className={`split-resize-handle ${isDragging ? 'dragging' : ''}`}
        role="separator"
        aria-label="Изменить ширину деталей пользователя"
        aria-orientation="vertical"
        aria-valuemin={DETAIL_PANEL_MIN_WIDTH}
        aria-valuemax={maxWidth}
        aria-valuenow={width}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
      >
        <span aria-hidden="true" />
      </div>
    </div>
  )
}
