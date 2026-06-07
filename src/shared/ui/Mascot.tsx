import type { ImgHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export const FINPULSE_MASCOT_SRC = '/assets/mascot/finpulse-mascot.png'
export const FINPULSE_MASCOT_ALT = 'Дружелюбный кремово-голубой маскот ФинПульс в виде фенека с компасом.'

type MascotSize = 'xs' | 'sm' | 'md' | 'lg'
type MascotVariant = 'avatar' | 'inline' | 'empty' | 'welcome' | 'completion'

const sizeClasses = {
  xs: 'size-12',
  sm: 'size-20',
  md: 'size-[120px]',
  lg: 'size-[160px]',
} satisfies Record<MascotSize, string>

const variantClasses = {
  avatar: 'rounded-2xl drop-shadow-[0_8px_18px_rgba(30,155,215,0.12)]',
  inline: 'rounded-[22px] drop-shadow-[0_10px_24px_rgba(30,155,215,0.14)]',
  empty: 'rounded-[22px] drop-shadow-[0_14px_32px_rgba(30,155,215,0.16)]',
  welcome: 'rounded-[24px] drop-shadow-[0_16px_36px_rgba(30,155,215,0.18)]',
  completion: 'rounded-[28px] drop-shadow-[0_18px_42px_rgba(20,133,95,0.16)]',
} satisfies Record<MascotVariant, string>

type MascotProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'height' | 'src' | 'width'> & {
  alt?: string
  decorative?: boolean
  size?: MascotSize
  variant?: MascotVariant
}

export function Mascot({
  alt,
  className,
  decorative = true,
  loading = 'lazy',
  size = 'md',
  variant = 'inline',
  ...props
}: MascotProps) {
  return (
    <img
      alt={decorative ? '' : (alt ?? FINPULSE_MASCOT_ALT)}
      aria-hidden={decorative ? 'true' : undefined}
      className={cn('shrink-0 select-none object-contain', sizeClasses[size], variantClasses[variant], className)}
      decoding="async"
      draggable={false}
      loading={loading}
      src={FINPULSE_MASCOT_SRC}
      {...props}
    />
  )
}
