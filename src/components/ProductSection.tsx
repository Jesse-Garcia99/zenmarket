import { CaretRight, Heart, ShoppingCart, Star } from '@phosphor-icons/react'
import { useState } from 'react'
import { HERO_PRODUCT } from '../engine/data'
import { fmtUsd, fmtYen, ProductThumb } from '../ui'
import { EstimatePanel } from './EstimatePanel'

function Gallery() {
  const [active, setActive] = useState(0)
  return (
    <div>
      <ProductThumb icon={HERO_PRODUCT.icon} className="aspect-square w-full rounded-lg" />
      <div className="mt-2 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`overflow-hidden rounded border-2 ${
              active === i ? 'border-zm-red' : 'border-transparent'
            }`}
          >
            <ProductThumb icon={HERO_PRODUCT.icon} className="aspect-square w-full" />
          </button>
        ))}
      </div>
    </div>
  )
}

function Tabs() {
  const [tab, setTab] = useState<'desc' | 'shipping'>('desc')
  return (
    <div className="mt-8">
      <div className="flex border-b border-neutral-200">
        {(
          [
            ['desc', 'Item description'],
            ['shipping', 'Shipping & payment'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === key ? 'border-zm-red text-zm-ink' : 'border-transparent text-neutral-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="py-4 text-[13px] leading-relaxed text-neutral-600">
        {tab === 'desc' ? (
          <p>{HERO_PRODUCT.blurb} PVC & ABS articulated action figure, approx. 70mm. Includes
          interchangeable hand parts and Nyoibo staff. Listing auto-translated from Japanese.</p>
        ) : (
          <ul className="list-disc space-y-1 pl-5">
            <li>Domestic shipping to the ZenMarket warehouse: free.</li>
            <li>International shipping is quoted after the item arrives and is weighed — unless
              ZenMatch predicts it first, as shown above.</li>
            <li>Free 60-day storage; consolidate any number of items into one parcel.</li>
          </ul>
        )}
      </div>
    </div>
  )
}

export function ProductSection() {
  return (
    <section className="mx-auto mt-4 max-w-6xl px-4">
      <nav className="mb-3 flex items-center gap-1 text-xs text-neutral-500">
        <span>Home</span>
        <CaretRight size={10} />
        <span>Amazon Japan</span>
        <CaretRight size={10} />
        <span>Toys &amp; Games</span>
        <CaretRight size={10} />
        <span className="truncate text-neutral-700">{HERO_PRODUCT.titleEn}</span>
      </nav>

      <div className="grid gap-8 rounded-lg border border-neutral-200 bg-white p-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Gallery />
        <div>
          <h1 className="text-lg font-bold leading-snug">{HERO_PRODUCT.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{HERO_PRODUCT.titleEn}</p>

          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
            <span className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} weight={i < 4 ? 'fill' : 'regular'} />
              ))}
            </span>
            <span>
              Seller: {HERO_PRODUCT.seller} · 4.8 (1,026 reviews)
            </span>
          </div>

          <dl className="mt-4 space-y-1.5 border-t border-neutral-100 pt-4 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Item code</dt>
              <dd className="font-mono text-xs">{HERO_PRODUCT.asin}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Availability</dt>
              <dd className="font-medium text-teal-700">In stock</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">Domestic shipping</dt>
              <dd>Free</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-xs text-neutral-500">Price</span>
              <p className="price-num text-3xl font-bold text-zm-red">
                {fmtYen(HERO_PRODUCT.price)}
                <span className="ml-2 text-sm font-normal text-neutral-400">{fmtUsd(HERO_PRODUCT.price)}</span>
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-zm-red px-4 py-3 text-sm font-bold text-white transition-transform hover:bg-zm-red-dark active:scale-[0.98]">
              <ShoppingCart size={18} weight="bold" />
              Add to cart
            </button>
            <button className="flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
              <Heart size={18} />
              Watchlist
            </button>
          </div>

          <div className="mt-4">
            <EstimatePanel />
          </div>
        </div>
      </div>

      <div className="rounded-b-lg border border-t-0 border-neutral-200 bg-white px-5">
        <Tabs />
      </div>
    </section>
  )
}
