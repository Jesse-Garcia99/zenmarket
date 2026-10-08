import { Heart, ShoppingCart } from '@phosphor-icons/react'
import { ALL_PRODUCTS } from '../engine/data'
import { useZen } from '../state'
import { ProductCard } from './ProductCard'

// Mirrors ZenMarket's お気に入り (watchlist) page: a grid of saved listings that
// still carry live shipping chips against your warehouse.
export function WatchlistPage() {
  const { watchlist, toggleWatch, t } = useZen()
  const products = ALL_PRODUCTS.filter((p) => watchlist.includes(p.id))

  return (
    <div className="mx-auto max-w-6xl px-4 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-bold text-zm-ink">
          <Heart size={20} weight="fill" className="text-zm-red" />
          {t['wl.title']}
          <span className="text-sm font-normal text-neutral-400">
            {t.items(products.length)}
          </span>
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-10 text-center">
          <Heart size={40} className="mx-auto text-neutral-300" />
          <p className="mt-3 text-sm font-semibold text-zm-ink">{t['wl.emptyTitle']}</p>
          <p className="mt-1 text-[13px] text-neutral-500">
            {t['wl.emptyBody']}
          </p>
          <a
            href="#/shop"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-zm-red px-4 py-2 text-sm font-semibold text-white hover:bg-zm-red-dark"
          >
            <ShoppingCart size={16} weight="bold" />
            {t['wl.browse']}
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
              <button
                onClick={() => toggleWatch(p.id)}
                aria-label={t['wl.remove']}
                title={t['wl.remove']}
                className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-zm-red shadow-sm ring-1 ring-neutral-200 hover:bg-white"
              >
                <Heart size={15} weight="fill" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
