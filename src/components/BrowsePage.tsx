import { useMemo, useState } from 'react'
import { useZen } from '../state'
import { ALL_PRODUCTS } from '../engine/data'
import type { Product } from '../engine/types'
import { quote } from '../engine/pricing'
import { addedShipping } from '../engine/recommend'
import { fmtKg, fmtYen } from '../ui'
import { ProductCard } from './ProductCard'

type Sort = 'relevance' | 'price-asc' | 'price-desc' | 'ship-asc'

// ZenMarket-style listing page. The point of the demo: every card carries a
// live shipping chip, so browsing *is* the recommendation surface.
export function BrowsePage() {
  const { warehouse, warehouseParcel, method, dest, query, setQuery, isStored, inCart, t } = useZen()
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
        <a href="#/" className="hover:underline">{t['browse.home']}</a> ›{' '}
        <a href="#/shop" className="hover:underline">Amazon Japan</a> ›{' '}
        <span className="text-neutral-700">{t['browse.crumbCat']}</span>
      </nav>

      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold">
            {searching ? t['browse.searchResults'](query.trim()) : t['browse.category']}
          </h1>
          <p className="text-[13px] text-neutral-500">
            {t['browse.meta'](products.length, t[`dest.${dest}`], method)}
            {warehouseParcel &&
              (parcelPrice
                ? t['browse.parcelIs'](fmtKg(warehouseParcel.weight), fmtYen(parcelPrice), method)
                : t['browse.parcelIsNoPrice'](fmtKg(warehouseParcel.weight)))}
            {searching && (
              <button
                onClick={() => setQuery('')}
                className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 hover:bg-neutral-200"
              >
                {t['browse.clear']}
              </button>
            )}
          </p>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-600"
          aria-label={t['browse.sortAria']}
        >
          <option value="relevance">{t['browse.sortRel']}</option>
          <option value="price-asc">{t['browse.sortPriceAsc']}</option>
          <option value="price-desc">{t['browse.sortPriceDesc']}</option>
          <option value="ship-asc">{t['browse.sortShip']}</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-500">
          {t['browse.empty'](query.trim())}
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
