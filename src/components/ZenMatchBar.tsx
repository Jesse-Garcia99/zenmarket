import { CheckCircle, Package, Sparkle, Warning } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useZen } from '../state'
import { DESTINATIONS } from '../engine/data'
import { quote } from '../engine/pricing'
import { fmtKg, fmtYen } from '../ui'

// The persistent, contextual banner from the concept doc. Sticky under the
// store tabs so it stays visible while browsing. States:
//   browse page       -> parcel summary + "chips on each item show the delta"
//   item already stored -> confirmation instead of a pitch
//   savings > 0       -> consolidation opportunity
//   ineligible        -> method can't carry the combined parcel
//   empty warehouse   -> standalone estimate for the item being viewed
export function ZenMatchBar() {
  const { route, product, warehouse, warehouseParcel, comparison, standaloneQuote, dest, setDest, setDrawerOpen, isStored } =
    useZen()

  let icon = <Package size={18} weight="bold" />
  let tone = 'bg-teal-50 border-teal-200 text-teal-950'
  let message: ReactNode

  if (route.page !== 'item') {
    const price = warehouseParcel ? quote(warehouseParcel, 'EMS', dest).price : null
    message = warehouseParcel ? (
      <>
        Your stored parcel: {warehouse.length} item{warehouse.length === 1 ? '' : 's'} ·{' '}
        {fmtKg(warehouseParcel.weight)} · ships EMS for <strong>{price ? fmtYen(price) : '—'}</strong>
        <span className="text-teal-800/70"> — each listing shows what it adds to your parcel</span>
      </>
    ) : (
      <>
        Every listing shows its estimated shipping to{' '}
        {DESTINATIONS.find((d) => d.code === dest)?.label}
        <span className="text-teal-800/70"> — predicted from similar shipments, no weight entry needed</span>
      </>
    )
  } else if (isStored(product.id)) {
    icon = <CheckCircle size={18} weight="bold" />
    message = (
      <>
        This item is <strong>in your warehouse</strong> — its measured weight is already part of
        your parcel estimate.
      </>
    )
  } else if (warehouse.length === 0) {
    message = (
      <>
        Estimated shipping to {DESTINATIONS.find((d) => d.code === dest)?.label} for this item:{' '}
        <strong>
          {standaloneQuote.price === null
            ? 'not available via this method'
            : fmtYen(standaloneQuote.price)}
        </strong>
        <span className="text-teal-800/70">
          {' '}
          — predicted from similar shipments, no weight entry needed
        </span>
      </>
    )
  } else if (comparison && comparison.savings > 0) {
    const [lo, hi] = comparison.incrementalRange
    message = (
      <>
        Add this item to your stored parcel for about{' '}
        <strong>+{lo === hi ? fmtYen(lo) : `${fmtYen(lo)}–${fmtYen(hi)}`}</strong> — save ≈
        <strong>{fmtYen(comparison.savings)}</strong> vs shipping separately
      </>
    )
  } else if (comparison) {
    icon = <Warning size={18} weight="bold" />
    tone = 'bg-amber-50 border-amber-200 text-amber-950'
    message = (
      <>
        Consolidating this item isn&apos;t cheaper — its size forces a larger carton.{' '}
        <strong>Ship separately to save {fmtYen(-comparison.savings)}.</strong>
      </>
    )
  } else {
    icon = <Warning size={18} weight="bold" />
    tone = 'bg-amber-50 border-amber-200 text-amber-950'
    message = <>This method can&apos;t carry the combined parcel — try another shipping method.</>
  }

  return (
    <div className={`sticky top-0 z-40 border-b ${tone}`}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 text-[13px]">
        <a href="#/" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide opacity-70">
          <Sparkle size={14} weight="fill" />
          ZenMatch
        </a>
        <span className="flex items-center gap-2">
          {icon}
          {message}
        </span>
        <span className="ml-auto flex items-center gap-3">
          <select
            value={dest}
            onChange={(e) => setDest(e.target.value as typeof dest)}
            className="rounded border border-current/20 bg-white/60 px-2 py-1 text-xs"
            aria-label="Destination"
          >
            {DESTINATIONS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded border border-current/25 px-2.5 py-1 text-xs font-semibold hover:bg-white/70"
          >
            My warehouse · {warehouse.length} item{warehouse.length === 1 ? '' : 's'}
          </button>
        </span>
      </div>
    </div>
  )
}
