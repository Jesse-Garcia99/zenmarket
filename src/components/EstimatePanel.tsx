import { CaretDown, Info, Package } from '@phosphor-icons/react'
import { useState } from 'react'
import { useZen } from '../state'
import { ConfidenceBadge, fmtDims, fmtKg, fmtYen } from '../ui'
import type { Method } from '../engine/types'

const METHODS: Method[] = ['EMS', 'AIR', 'SEA']

// The ZenMatch module that would live on the product page: predicted physical
// properties up front, carrier pricing applied to them, and the separate-vs-
// consolidated comparison when the customer has items in storage.
export function EstimatePanel() {
  const { prediction, standaloneQuote, warehouseParcel, comparison, method, setMethod, product, isStored } =
    useZen()
  const [open, setOpen] = useState(false)
  const p = prediction
  const stored = isStored(product.id)

  return (
    <section className="rounded-lg border border-teal-700/25 bg-white">
      <header className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Package size={18} className="text-zm-teal" weight="bold" />
          ZenMatch shipping estimate
        </h2>
        <ConfidenceBadge level={p.confidence} />
      </header>

      <div className="space-y-3 px-4 py-3 text-[13px]">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-neutral-600">
          <span>
            Predicted item weight{' '}
            <strong className="price-num text-zm-ink">
              {fmtKg(p.weight.p10)}–{fmtKg(p.weight.p90)}
            </strong>
          </span>
          <span>
            Packed size{' '}
            <strong className="price-num text-zm-ink">{fmtDims(p.dims)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">Method</label>
          <div className="flex overflow-hidden rounded-md border border-neutral-300">
            {METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`px-3 py-1.5 text-xs font-semibold ${
                  method === m ? 'bg-zm-ink text-white' : 'bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <dl className="space-y-1.5">
          <div className="flex justify-between">
            <dt className="text-neutral-600">Shipped alone via {method}</dt>
            <dd className="price-num font-semibold">
              {standaloneQuote.price === null
                ? standaloneQuote.note ?? 'Not eligible'
                : comparison
                  ? `${fmtYen(comparison.standaloneRange[0])}–${fmtYen(comparison.standaloneRange[1])}`
                  : fmtYen(standaloneQuote.price)}
            </dd>
          </div>
          {stored && (
            <p className="text-[12px] font-medium text-teal-700">
              This item is in your warehouse — its measured weight feeds the parcel estimate
              directly.
            </p>
          )}
          {!stored && warehouseParcel && comparison && (
            <>
              <div className="flex justify-between">
                <dt className="text-neutral-600">Added to your stored parcel</dt>
                <dd className="price-num font-semibold text-zm-teal">
                  +{fmtYen(comparison.incrementalRange[0])}–{fmtYen(comparison.incrementalRange[1])}
                </dd>
              </div>
              <div className="flex justify-between border-t border-dashed border-neutral-200 pt-1.5">
                <dt className="font-medium text-zm-ink">
                  {comparison.savings > 0 ? 'Estimated saving vs separate shipments' : 'Cost of consolidating'}
                </dt>
                <dd
                  className={`price-num text-base font-bold ${
                    comparison.savings > 0 ? 'text-zm-teal' : 'text-amber-700'
                  }`}
                >
                  {comparison.savings > 0
                    ? `≈ ${fmtYen(comparison.savingsRange[0])}–${fmtYen(comparison.savingsRange[1])}`
                    : `${fmtYen(-comparison.savings)} more`}
                </dd>
              </div>
              <p className="text-[11px] leading-snug text-neutral-500">
                <Info size={11} className="mr-0.5 inline -translate-y-px" />
                Consolidating always increases the parcel&apos;s total shipping price; the saving is
                relative to paying for a second shipment.
              </p>
            </>
          )}
        </dl>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between border-t border-neutral-100 px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
      >
        How this is predicted
        <CaretDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-neutral-100 px-4 py-3 text-xs text-neutral-600">
          <p className="mb-2 leading-relaxed">
            A k-NN match over historical shipments — stand-in for a LightGBM/ML.NET model. The four
            closest parcels by title &amp; category, weighted by similarity:
          </p>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wide text-neutral-400">
                <th className="pb-1 font-medium">Shipment</th>
                <th className="pb-1 font-medium">Similarity</th>
                <th className="pb-1 font-medium">Item weight</th>
                <th className="pb-1 font-medium">Packed</th>
              </tr>
            </thead>
            <tbody className="price-num">
              {p.neighbors.map((n) => (
                <tr key={n.record.id} className="border-t border-neutral-100">
                  <td className="max-w-0 truncate py-1.5 pr-2" title={n.record.title}>
                    <span className="mr-1.5 font-mono text-[10px] text-neutral-400">{n.record.id}</span>
                    {n.record.title}
                  </td>
                  <td>{Math.round(n.score * 100)}%</td>
                  <td>{fmtKg(n.record.itemWeight)}</td>
                  <td className="text-neutral-500">
                    {fmtKg(n.record.parcelWeight)} · {fmtDims(n.record.parcelDims)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 leading-relaxed text-neutral-500">
            Weight percentiles come from these neighbors. Stored items use measured arrival weights,
            so consolidated quotes are exact where it matters. Production swap: gradient-boosted
            model over the same features, retrained on new parcels.
          </p>
        </div>
      )}
    </section>
  )
}

