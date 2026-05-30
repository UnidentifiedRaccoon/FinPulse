import { ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { Card } from '@/content/program'
import { cn } from '@/lib/utils'

type VideoCardContent = Extract<Card, { type: 'video' }>

const rutubeSkinColor = '1E9BD7'

export function VideoCard({ card }: { card: VideoCardContent }) {
  const [selectedStartSeconds, setSelectedStartSeconds] = useState<number | null>(null)

  const embedSrc = useMemo(() => getRutubeEmbedSrc(card.src, selectedStartSeconds), [card.src, selectedStartSeconds])
  const timecodes = useMemo(
    () =>
      card.timecodes?.map((timecode) => ({
        ...timecode,
        seconds: parseTimecodeToSeconds(timecode.time),
      })) ?? [],
    [card.timecodes],
  )

  if (!embedSrc) {
    return <VideoFallback card={card} />
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-[var(--fr-border-default)] bg-black shadow-[var(--fr-shadow-sm)]">
        <iframe
          allow="clipboard-write; autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={embedSrc}
          title={card.title}
        />
      </div>

      {timecodes.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase leading-5 tracking-normal text-[var(--fr-text-tertiary)]">
            Фрагменты
          </p>
          <div className="flex flex-col gap-2">
            {timecodes.map((timecode) => (
              <button
                aria-label={`Перейти к фрагменту ${timecode.time}: ${timecode.label}`}
                aria-pressed={selectedStartSeconds === timecode.seconds}
                className={cn(
                  'flex min-h-12 w-full items-start gap-3 rounded-2xl border px-3 py-2 text-left text-sm leading-6 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/20',
                  selectedStartSeconds === timecode.seconds
                    ? 'border-[var(--fr-color-sky-500)] bg-[var(--fr-surface-soft)] text-[var(--fr-text-primary)]'
                    : 'border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] text-[var(--fr-text-secondary)] hover:bg-[var(--fr-surface-soft)]',
                  timecode.seconds === null ? 'cursor-not-allowed opacity-60' : null,
                )}
                disabled={timecode.seconds === null}
                key={`${timecode.time}-${timecode.label}`}
                onClick={() => {
                  if (timecode.seconds !== null) {
                    setSelectedStartSeconds(timecode.seconds)
                  }
                }}
                type="button"
              >
                <span className="shrink-0 font-semibold tabular-nums text-[var(--fr-text-primary)]">
                  {timecode.time}
                </span>
                <span>{timecode.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <VideoSourceLink href={card.src} label="Открыть в RUTUBE" />
    </div>
  )
}

function VideoFallback({ card }: { card: VideoCardContent }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-soft)] p-4 text-sm leading-6 text-[var(--fr-text-secondary)]">
        Видео откроется на платформе-источнике.
      </p>
      <VideoSourceLink href={card.src} label="Открыть видео" />
    </div>
  )
}

function VideoSourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[var(--fr-border-default)] bg-[var(--fr-surface-card)] px-3 py-2 text-sm font-semibold text-[var(--fr-color-brand-700)] transition-colors hover:bg-[var(--fr-surface-soft)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--fr-color-brand-500)]/20"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {label}
      <ExternalLink aria-hidden="true" />
    </a>
  )
}

function getRutubeEmbedSrc(src: string, startSeconds: number | null) {
  try {
    const url = new URL(src)

    if (!isRutubeEmbedUrl(url)) {
      return null
    }

    url.searchParams.set('skinColor', rutubeSkinColor)

    if (startSeconds !== null) {
      url.searchParams.set('t', String(startSeconds))
    } else {
      url.searchParams.delete('t')
    }

    return url.toString()
  } catch {
    return null
  }
}

function isRutubeEmbedUrl(url: URL) {
  return url.protocol === 'https:' && isRutubeHost(url.hostname) && url.pathname.startsWith('/play/embed/')
}

function isRutubeHost(hostname: string) {
  return hostname === 'rutube.ru' || hostname.endsWith('.rutube.ru')
}

function parseTimecodeToSeconds(timecode: string) {
  const parts = timecode.split(':').map((part) => Number(part))

  if (parts.length < 2 || parts.length > 3 || parts.some((part) => !Number.isInteger(part) || part < 0)) {
    return null
  }

  const [maybeHours, maybeMinutes, seconds] =
    parts.length === 3 ? parts : [0, parts[0], parts[1]]

  if (maybeMinutes > 59 || seconds > 59) {
    return null
  }

  return maybeHours * 60 * 60 + maybeMinutes * 60 + seconds
}
