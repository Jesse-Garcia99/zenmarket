import { useState } from 'react'
import {
  BookBookmark,
  Camera,
  Cards,
  CookingPot,
  GameController,
  Gift,
  Hoodie,
  Keyboard,
  Rabbit,
  Robot,
  Watch,
} from '@phosphor-icons/react'
import type { IconKey } from './engine/types'

export const fmtYen = (n: number) => `¥${Math.round(n).toLocaleString('en-US')}`
export const fmtUsd = (n: number) => `≈ $${(n / 152).toFixed(0)}`
export const fmtKg = (n: number) => `${n.toFixed(2)} kg`
export const fmtDims = (d: { l: number; w: number; h: number }) =>
  `${Math.round(d.l)}×${Math.round(d.w)}×${Math.round(d.h)} cm`

export const METHOD_LABEL = { EMS: 'EMS (3–6 days)', AIR: 'Air small packet', SEA: 'Surface mail' } as const

const ICONS: Record<IconKey, typeof Watch> = {
  figure: Robot,
  watch: Watch,
  console: GameController,
  plush: Rabbit,
  cards: Cards,
  camera: Camera,
  pot: CookingPot,
  book: BookBookmark,
  keyboard: Keyboard,
  hoodie: Hoodie,
  goods: Gift,
}

// Product art: a real listing photo when we have one, otherwise a neutral
// studio tile with a category glyph (used for unphotographed warehouse items).
export function ProductThumb({
  icon,
  image,
  className = '',
}: {
  icon: IconKey
  image?: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const Icon = ICONS[icon]
  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-200 text-neutral-400 ${className}`}
    >
      {image && !failed ? (
        <img
          src={`${import.meta.env.BASE_URL}products/${image}`}
          alt=""
          loading="lazy"
          className="h-full w-full bg-white object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon size="38%" weight="thin" />
      )}
    </div>
  )
}

export function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-teal-50 text-teal-800 border-teal-200',
    medium: 'bg-amber-50 text-amber-800 border-amber-200',
    low: 'bg-neutral-100 text-neutral-600 border-neutral-300',
  }[level]
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[11px] font-medium ${styles}`}>
      {level} confidence
    </span>
  )
}
