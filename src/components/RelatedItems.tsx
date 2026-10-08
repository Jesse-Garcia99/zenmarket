import { useZen } from '../state'
import { RELATED_PRODUCTS } from '../engine/data'
import { ProductCard } from './ProductCard'

export function RelatedItems() {
  const { warehouse, product } = useZen()
  const items = RELATED_PRODUCTS.filter((p) => p.id !== product.id)
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
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
