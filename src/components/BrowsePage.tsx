import { useZen } from '../state'
import { ALL_PRODUCTS, DESTINATIONS } from '../engine/data'
import { quote } from '../engine/pricing'
import { fmtKg, fmtYen } from '../ui'
import { ProductCard } from './ProductCard'

// ZenMarket-style listing page. The point of the demo: every card carries a
// live shipping chip, so browsing *is* the recommendation surface.
export function BrowsePage() {
  const { warehouseParcel, method, dest } = useZen()
  const parcelPrice = warehouseParcel ? quote(warehouseParcel, method, dest).price : null

  return (
    <section className="mx-auto mt-4 max-w-6xl px-4">
      <nav className="mb-3 text-xs text-neutral-500">
        Home › Amazon Japan › <span className="text-neutral-700">Hobby &amp; collectibles</span>
      </nav>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold">Hobby &amp; collectibles — Japan exclusives</h1>
          <p className="text-[13px] text-neutral-500">
            {ALL_PRODUCTS.length} results · shipping to{' '}
            {DESTINATIONS.find((d) => d.code === dest)?.label} via {method}
            {warehouseParcel &&
              ` · your stored parcel is ${fmtKg(warehouseParcel.weight)}${
                parcelPrice ? ` (${fmtYen(parcelPrice)} ${method})` : ''
              }`}
          </p>
        </div>
        <span className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-500">
          Sort: Relevance
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {ALL_PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
