import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

type DialogPortalBoundaryRect = {
  height: number
  left: number
  top: number
  width: number
}

const DialogPortalBoundaryContext = React.createContext<HTMLElement | null>(null)

function DialogPortalBoundaryProvider({
  boundary,
  children,
}: {
  boundary: HTMLElement | null
  children: React.ReactNode
}) {
  return (
    <DialogPortalBoundaryContext.Provider value={boundary}>
      {children}
    </DialogPortalBoundaryContext.Provider>
  )
}

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  const boundaryRect = useDialogPortalBoundaryRect()
  const isBounded = Boolean(boundaryRect)

  return (
    <DialogPrimitive.Overlay
      data-dialog-bounded={isBounded ? 'true' : undefined}
      data-slot="dialog-overlay"
      className={cn(
        isBounded ? "fixed" : "fixed inset-0",
        "isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      style={{
        ...(boundaryRect ? getOverlayBoundaryStyle(boundaryRect) : {}),
        ...style,
      }}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  style,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  const boundaryRect = useDialogPortalBoundaryRect()
  const isBounded = Boolean(boundaryRect)

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-dialog-bounded={isBounded ? 'true' : undefined}
        data-slot="dialog-content"
        className={cn(
          isBounded ? "fixed" : "fixed top-1/2 left-1/2",
          "z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        style={{
          ...(boundaryRect ? getContentBoundaryStyle(boundaryRect) : {}),
          ...style,
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              aria-label="Закрыть"
              variant="ghost"
              className="absolute top-2 right-2"
              size="icon-sm"
            >
              <XIcon aria-hidden="true" />
              <span className="sr-only">Закрыть</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Закрыть</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-semibold",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortalBoundaryProvider,
  DialogTitle,
  DialogTrigger,
}

function useDialogPortalBoundaryRect() {
  const boundary = React.useContext(DialogPortalBoundaryContext)
  const [rect, setRect] = React.useState<DialogPortalBoundaryRect | null>(() =>
    boundary ? getElementBoundaryRect(boundary) : null,
  )

  React.useLayoutEffect(() => {
    if (!boundary) {
      const resetTimer = window.setTimeout(() => {
        setRect(null)
      }, 0)
      return () => window.clearTimeout(resetTimer)
    }

    let animationFrame = 0

    const updateRect = () => {
      animationFrame = 0
      setRect(getElementBoundaryRect(boundary))
    }

    const scheduleUpdate = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updateRect)
    }

    updateRect()
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, true)

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            scheduleUpdate()
          })
    resizeObserver?.observe(boundary)

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame)
      }
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate, true)
      resizeObserver?.disconnect()
    }
  }, [boundary])

  return rect
}

function getElementBoundaryRect(element: HTMLElement): DialogPortalBoundaryRect {
  const rect = element.getBoundingClientRect()

  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  }
}

function getOverlayBoundaryStyle(rect: DialogPortalBoundaryRect): React.CSSProperties {
  return {
    height: `${rect.height}px`,
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
  }
}

function getContentBoundaryStyle(rect: DialogPortalBoundaryRect): React.CSSProperties {
  const boundedWidth = Math.max(rect.width - 32, 0)

  return {
    left: `${rect.left + rect.width / 2}px`,
    maxWidth: `${boundedWidth}px`,
    top: `${rect.top + rect.height / 2}px`,
    width: `${boundedWidth}px`,
  }
}
