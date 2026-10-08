import { useMemo } from 'react'
import { CheckCircle } from '@phosphor-icons/react'
import { useZen } from '../state'
import { predictItem } from '../engine/predict'
import { compare, packParcel, quote } from '../engine/pricing'
import { itemHref } from '../route'
import type { Product } from '../engine/types'
import { fmtUsd, fmtYen, ProductThumb } from '../ui'

// Per-card shipping chip: the same incremental/standalone math as the banner,
// resolved for one product. Stored items show a "stored" state instead.
export function ProductCard({ product }: { product: Product }) {
  const { warehouse, method, dest, isStored, inCart } = useZen()

  const chip = useMemo(() => {
    if (isStored(product.id)) return { label: 'in your warehouse', stored: true }
    if (inCart(product.id)) return { label: 'in your cart — not yet ordered', stored: true }
    const p = predictItem(product)
    const items = warehouse.map((w) => ({ weight: w.measuredWeight, dims: w.measuredDims }))
    if (items.length === 0) {
      const q = quote(packParcel([{ weight: p.weight.p50, dims: p.dims }]), method, dest)
      return q.price === null
        ? { label: `no ${method} quote`, stored: false }
        : { label: `ships ~${fmtYen(q.price)} alone`, stored: false }
    }
    const cmp = compare(items, { dims: p.dims, weightRange: p.weight }, method, dest)
    if (!cmp) return { label: `needs a different method`, stored: false }
    if (cmp.incremental === 0) return { label: 'rides free in your parcel', stored: false }
    return cmp.savings >= 0
      ? { label: `+${fmtYen(cmp.incremental)} in your parcel`, stored: false }
      : { label: 'cheaper shipped separately', stored: false }
  }, [product, warehouse, method, dest, isStored, inCart])

  return (
    <a
      href={itemHref(product.id)}
      className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white transition-shadow hover:shadow-md"
    >
      <ProductThumb
        icon={product.icon}
        image={product.images?.[0]}
        className="aspect-square w-full bg-white"
      />
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-9 text-[13px] font-medium leading-snug group-hover:text-zm-red">
          {product.titleEn}
        </h3>
        <p className="price-num mt-1 font-bold">
          {fmtYen(product.price)}{' '}
          <span className="text-xs font-normal text-neutral-400">{fmtUsd(product.price)}</span>
        </p>
        {chip && (
          <p
            className={`mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${
              chip.stored
                ? 'bg-neutral-100 text-neutral-600'
                : chip.label.includes('different') || chip.label.includes('separately')
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-teal-50 text-teal-800'
            }`}
          >
            {chip.stored && <CheckCircle size={11} weight="fill" />}
            {chip.label}
          </p>
        )}
      </div>
    </a>
  )
}
