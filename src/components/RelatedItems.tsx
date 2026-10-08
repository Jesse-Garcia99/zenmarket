import { useMemo } from 'react'
import { useZen } from '../state'
import { RELATED_PRODUCTS } from '../engine/data'
import { predictItem } from '../engine/predict'
import { compare, packParcel, quote } from '../engine/pricing'
import type { Product } from '../engine/types'
import { fmtUsd, fmtYen, ProductThumb } from '../ui'

function RelatedCard({ product }: { product: Product }) {
  const { warehouse, method, dest } = useZen()

  const chip = useMemo(() => {
    const p = predictItem(product)
    const items = warehouse.map((w) => ({ weight: w.measuredWeight, dims: w.measuredDims }))
    if (items.length === 0) {
      const q = quote(packParcel([{ weight: p.weight.p50, dims: p.dims }]), method, dest)
      return q.price === null ? null : { label: `ships ~${fmtYen(q.price)} alone`, good: true }
    }
    const cmp = compare(items, { dims: p.dims, weightRange: p.weight }, method, dest)
    if (!cmp) return { label: `needs a different method`, good: false }
    return cmp.savings >= 0
      ? {
          label: cmp.incremental === 0 ? 'rides free in your parcel' : `+${fmtYen(cmp.incremental)} in your parcel`,
          good: true,
        }
      : { label: 'cheaper shipped separately', good: false }
  }, [product, warehouse, method, dest])

  return (
    <article className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <ProductThumb icon={product.icon} className="aspect-square w-full" />
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-9 text-[13px] font-medium leading-snug">{product.titleEn}</h3>
        <p className="price-num mt-1 font-bold">
          {fmtYen(product.price)} <span className="text-xs font-normal text-neutral-400">{fmtUsd(product.price)}</span>
        </p>
        {chip && (
          <p
            className={`mt-1.5 inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${
              chip.good ? 'bg-teal-50 text-teal-800' : 'bg-amber-50 text-amber-800'
            }`}
          >
            {chip.label}
          </p>
        )}
      </div>
    </article>
  )
}

export function RelatedItems() {
  const { warehouse } = useZen()
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <h2 className="mb-1 text-lg font-bold">
        {warehouse.length ? 'Pairs well with your stored parcel' : 'Related items'}
      </h2>
      <p className="mb-4 text-[13px] text-neutral-500">
        {warehouse.length
          ? 'Incremental shipping cost if each item joined your parcel — updated live as storage changes.'
          : 'Estimated standalone shipping for each item.'}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {RELATED_PRODUCTS.map((p) => (
          <RelatedCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
