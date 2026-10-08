import { CheckCircle, Package, Sparkle, Warning } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useZen } from '../state'
import { DESTINATIONS } from '../engine/data'
import { quote } from '../engine/pricing'
import { fmtKg, fmtYen } from '../ui'

// The persistent, contextual banner from the concept doc. Sticky under the
// store tabs so it stays visible while browsing. States:
//   non-item pages    -> parcel summary / browse pitch
//   item already stored -> confirmation instead of a pitch
//   savings > 0       -> consolidation opportunity
//   ineligible        -> method can't carry the combined parcel
//   empty warehouse   -> standalone estimate for the item being viewed
export function ZenMatchBar() {
  const { route, product, warehouse, warehouseParcel, comparison, standaloneQuote, dest, setDest, setDrawerOpen, isStored, t } =
    useZen()

  let icon = <Package size={18} weight="bold" />
  let tone = 'bg-teal-50 border-teal-200 text-teal-950'
  let message: ReactNode

  if (route.page !== 'item') {
    const price = warehouseParcel ? quote(warehouseParcel, 'EMS', dest).price : null
    message = warehouseParcel ? (
      <>
        {t['bar.storedParcel'](
          t.items(warehouse.length),
          fmtKg(warehouseParcel.weight),
          price ? fmtYen(price) : '—',
        )}
        <span className="text-teal-800/70"> — {t['bar.storedHint']}</span>
      </>
    ) : (
      <>
        {t['bar.browseEmpty']} {t[`dest.${dest}`]}
        <span className="text-teal-800/70"> — {t['bar.predHint']}</span>
      </>
    )
  } else if (isStored(product.id)) {
    icon = <CheckCircle size={18} weight="bold" />
    message = <>{t['bar.storedItem']}</>
  } else if (warehouse.length === 0) {
    message = (
      <>
        {t['bar.itemShip']} {t[`dest.${dest}`]} {t['bar.forItem']}{' '}
        <strong>
          {standaloneQuote.price === null ? t['bar.notAvail'] : fmtYen(standaloneQuote.price)}
        </strong>
        <span className="text-teal-800/70"> — {t['bar.predHint']}</span>
      </>
    )
  } else if (comparison && comparison.savings > 0) {
    const [lo, hi] = comparison.incrementalRange
    message = (
      <>
        {t['bar.addAbout']}{' '}
        <strong>+{lo === hi ? fmtYen(lo) : `${fmtYen(lo)}–${fmtYen(hi)}`}</strong> —{' '}
        {t['bar.saveVs']}
        <strong>{fmtYen(comparison.savings)}</strong> {t['bar.vsSeparate']}
      </>
    )
  } else if (comparison) {
    icon = <Warning size={18} weight="bold" />
    tone = 'bg-amber-50 border-amber-200 text-amber-950'
    message = (
      <>
        {t['bar.notCheaper']}{' '}
        <strong>{t['bar.shipSeparate'](fmtYen(-comparison.savings))}</strong>
      </>
    )
  } else {
    icon = <Warning size={18} weight="bold" />
    tone = 'bg-amber-50 border-amber-200 text-amber-950'
    message = <>{t['bar.noMethod']}</>
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
                {t[`dest.${d.code}`]}
              </option>
            ))}
          </select>
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded border border-current/25 px-2.5 py-1 text-xs font-semibold hover:bg-white/70"
          >
            {t['bar.myWarehouse']} · {t.items(warehouse.length)}
          </button>
        </span>
      </div>
    </div>
  )
}
