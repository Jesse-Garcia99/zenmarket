import { useMemo, useState } from 'react'
import { useZen } from '../state'
import { ALL_PRODUCTS, DESTINATIONS } from '../engine/data'
import type { Product } from '../engine/types'
import { quote } from '../engine/pricing'
import { addedShipping } from '../engine/recommend'
import { fmtKg, fmtYen } from '../ui'
import { ProductCard } from './ProductCard'

type Sort = 'relevance' | 'price-asc' | 'price-desc' | 'ship-asc'

// ZenMarket-style listing page. The point of the demo: every card carries a
// live shipping chip, so browsing *is* the recommendation surface.
export function BrowsePage() {
  const { warehouse, warehouseParcel, method, dest, query, setQuery, isStored, inCart } = useZen()
  const [sort, setSort] = useState<Sort>('relevance')
  const parcelPrice = warehouseParcel ? quote(warehouseParcel, method, dest).price : null

  // What this product adds to the parcel's shipping — same math as each card's chip.
  const shipCost = useMemo(() => {
    const items = warehouse.map((w) => ({ weight: w.measuredWeight, dims: w.measuredDims }))
    const map = new Map<string, number>()
    for (const p of ALL_PRODUCTS)
      map.set(
        p.id,
        isStored(p.id) || inCart(p.id)
          ? Infinity
          : (addedShipping(p, items, method, dest) ?? Infinity),
      )
    return map
  }, [warehouse, method, dest, isStored, inCart])

  const products = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    let list = ALL_PRODUCTS
    if (terms.length)
      list = list.filter((p) =>
        terms.every((t) =>
          `${p.title} ${p.titleEn} ${p.category} ${p.seller}`.toLowerCase().includes(t),
        ),
      )
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'ship-asc')
      list = [...list].sort(
        (a, b) => (shipCost.get(a.id) ?? Infinity) - (shipCost.get(b.id) ?? Infinity),
      )
    return list
  }, [query, sort, shipCost])

  const searching = query.trim().length > 0

  return (
    <section className="mx-auto mt-4 max-w-6xl px-4">
      <nav className="mb-3 text-xs text-neutral-500">
        <a href="#/" className="hover:underline">Home</a> ›{' '}
        <a href="#/shop" className="hover:underline">Amazon Japan</a> ›{' '}
        <span className="text-neutral-700">Hobby &amp; collectibles</span>
      </nav>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold">
            {searching ? `Search results for “${query.trim()}”` : 'Hobby & collectibles — Japan exclusives'}
          </h1>
          <p className="text-[13px] text-neutral-500">
            {products.length} result{products.length === 1 ? '' : 's'} · shipping to{' '}
            {DESTINATIONS.find((d) => d.code === dest)?.label} via {method}
            {warehouseParcel &&
              ` · your stored parcel is ${fmtKg(warehouseParcel.weight)}${
                parcelPrice ? ` (${fmtYen(parcelPrice)} ${method})` : ''
              }`}
            {searching && (
              <button
                onClick={() => setQuery('')}
                className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200"
              >
                clear search ✕
              </button>
            )}
          </p>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-600"
          aria-label="Sort results"
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="price-asc">Price: low → high</option>
          <option value="price-desc">Price: high → low</option>
          <option value="ship-asc">Adds least shipping first</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500">
          No products match “{query.trim()}” — try figure, watch, teapot or plush.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p: Product) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  )
}
