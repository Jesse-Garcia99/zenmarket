import { ArrowRight, Brain, Cube, Package, Sparkle, Tag } from '@phosphor-icons/react'
import { useMemo } from 'react'
import { useZen } from '../state'
import { ALL_PRODUCTS, HERO_PRODUCT } from '../engine/data'
import { predictItem } from '../engine/predict'
import { compare, packParcel, quote } from '../engine/pricing'
import { addedShipping } from '../engine/recommend'
import { fmtKg, fmtYen } from '../ui'
import { ProductCard } from './ProductCard'
import { itemHref } from '../route'

// The hero explainer: a self-running 9s loop driven by the zmx-* keyframes in
// index.css. All numbers shown are live engine output for the hero product,
// not hardcoded — change the warehouse and the animation's math changes too.
function PipelineCard() {
  const { warehouse, method, dest } = useZen()
  const pred = predictItem(HERO_PRODUCT)
  const items = warehouse.map((w) => ({ weight: w.measuredWeight, dims: w.measuredDims }))
  const standalone =
    quote(packParcel([{ weight: pred.weight.p50, dims: pred.dims }]), method, dest).price ?? 0
  const before = items.length ? quote(packParcel(items), method, dest).price : null
  const cmp = items.length
    ? compare(items, { dims: pred.dims, weightRange: pred.weight }, method, dest)
    : null
  const wBefore = items.reduce((s, i) => s + i.weight, 0)
  const wAfter = wBefore + pred.weight.p50

  return (
    <div className="relative">
      <div className="zmx-scene relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          <span>ZenMatch estimate</span>
          <span className="flex items-center gap-1 text-teal-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            </span>
            live
          </span>
        </div>

        <div className="flex h-44 items-start justify-between">
          {/* the listing under analysis */}
          <div className="zmx-item relative w-36 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <div className="relative overflow-hidden">
              <img
                src={`${import.meta.env.BASE_URL}products/${HERO_PRODUCT.images?.[0]}`}
                alt={HERO_PRODUCT.titleEn}
                className="aspect-square w-full object-cover"
              />
              <div className="zmx-scan absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-transparent via-teal-300/50 to-transparent" />
            </div>
            <p className="line-clamp-1 p-2 text-[11px] font-medium">{HERO_PRODUCT.titleEn}</p>
            <p className="px-2 pb-2 text-[11px] font-bold">{fmtYen(HERO_PRODUCT.price)}</p>
          </div>

          {/* the stored parcel it could join */}
          <div className="zmx-parcel mt-6 text-center">
            <div className="zmx-pop grid h-24 w-24 place-items-center rounded-lg border-2 border-dashed border-teal-600/50 bg-teal-50">
              <Package size={30} weight="duotone" className="text-teal-700" />
            </div>
            <p className="relative mt-1 h-4 text-[10px] font-semibold text-neutral-500">
              <span className="zmx-wa absolute inset-0">
                your parcel · {fmtKg(wBefore)}
              </span>
              <span className="zmx-wb absolute inset-0 text-teal-700">
                your parcel · {fmtKg(wAfter)}
              </span>
            </p>
          </div>
        </div>

        <div className="zmx-pred -mt-1 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800">
          <Brain size={12} weight="fill" />
          predicted {fmtKg(pred.weight.p10)}–{fmtKg(pred.weight.p90)} ·{' '}
          {pred.dims.l}×{pred.dims.w}×{pred.dims.h} cm · {pred.neighbors.length} similar shipments
        </div>

        <div className="zmx-math mt-3 space-y-1 border-t border-neutral-100 pt-3 text-[13px]">
          <div className="flex justify-between text-neutral-500">
            <span>Ship this item separately</span>
            <span className="zmx-strike relative">{fmtYen(standalone)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-zm-ink">
            <span>
              Add to your parcel{' '}
              {before !== null && <span className="font-normal text-neutral-400">({fmtYen(before)} now)</span>}
            </span>
            <span className="text-teal-800">
              {cmp ? `+${fmtYen(cmp.incremental)}` : `+${fmtYen(standalone)}`}
            </span>
          </div>
        </div>

        {cmp && cmp.savings > 0 && (
          <div className="zmx-save absolute bottom-3 right-4 rounded-full bg-zm-red px-3 py-1 text-xs font-bold text-white shadow-md">
            save ≈ {fmtYen(cmp.savings)}
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-[11px] text-neutral-400">
        animated walkthrough — every number computed live from the engine
      </p>
    </div>
  )
}

const STEPS = [
  {
    icon: <Brain size={20} weight="duotone" />,
    title: 'Predict the item',
    body: 'A weighted k-NN over past shipments estimates weight (p10/p50/p90) and packed size from the title, category and seller — no manual entry.',
    foot: 'src/engine/predict.ts',
  },
  {
    icon: <Cube size={20} weight="duotone" />,
    title: 'Pack the parcel',
    body: 'Predicted items are merged with your warehouse contents into the smallest carton that fits weight and size — measured values win over predictions.',
    foot: 'src/engine/pricing.ts',
  },
  {
    icon: <Tag size={20} weight="duotone" />,
    title: 'Price the shipment',
    body: 'Carrier rate bands price the parcel alone vs. combined. The delta is the incremental cost; the gap vs. shipping twice is your saving.',
    foot: 'C(A+B) − C(A)',
  },
]

export function HomePage() {
  const { warehouse, method, dest, isStored, inCart } = useZen()

  // The rail shows the cheapest additions to your parcel — computed, not curated.
  const featured = useMemo(() => {
    const items = warehouse.map((w) => ({ weight: w.measuredWeight, dims: w.measuredDims }))
    return ALL_PRODUCTS.filter((p) => !isStored(p.id) && !inCart(p.id))
      .map((p) => ({ p, cost: addedShipping(p, items, method, dest) }))
      .filter((x): x is { p: (typeof ALL_PRODUCTS)[number]; cost: number } => x.cost !== null)
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 4)
      .map((x) => x.p)
  }, [warehouse, method, dest, isStored, inCart])

  return (
    <div className="overflow-x-hidden">
      {/* Attention — hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pt-14">
        <div>
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-teal-800">
            <Sparkle size={12} weight="fill" />
            ZenMatch · predictive shipping
          </p>
          <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-zm-ink sm:text-[44px]">
            Know what it costs to ship before you buy it.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-600">
            ZenMarket shoppers guess at international shipping until the parcel is packed. ZenMatch
            predicts each item&apos;s packed weight and size from shipment history — then prices
            it against the parcel already sitting in your warehouse.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#/shop"
              className="inline-flex items-center gap-2 rounded-md bg-zm-red px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-zm-red-dark"
            >
              Browse Amazon Japan
              <ArrowRight size={16} weight="bold" />
            </a>
            <button
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-zm-ink hover:bg-neutral-50"
            >
              How it works
            </button>
          </div>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[13px]">
            {[
              ['40', 'synthetic shipments train the model'],
              ['p10–p90', 'honest ranges, not fake precision'],
              ['measured', 'warehouse items use real weights'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-lg font-bold text-zm-ink">{v}</dt>
                <dd className="text-neutral-500">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <PipelineCard />
      </section>

      {/* Interest — the pipeline, in three cards */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold tracking-tight text-zm-ink">
          Listing in, shipping cost out
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-neutral-500">
          Three deterministic stages — the same pipeline a LightGBM + ASP.NET backend would run in
          production.
        </p>
        <div className="mt-8 grid grid-flow-dense gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <article
              key={s.title}
              className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-700 transition-transform duration-300 group-hover:scale-110">
                  {s.icon}
                </span>
                <span className="text-3xl font-bold text-neutral-100 transition-colors group-hover:text-teal-100">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-bold text-zm-ink">{s.title}</h3>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-neutral-600">{s.body}</p>
              <code className="mt-4 rounded bg-neutral-50 px-2 py-1 text-[11px] text-neutral-500">
                {s.foot}
              </code>
            </article>
          ))}
        </div>
      </section>

      {/* Desire — cheapest additions to your parcel, right now */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zm-ink">
              Cheapest to add to your parcel
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Ranked live by incremental shipping — buying state changes the order.
            </p>
          </div>
          <a
            href="#/shop"
            className="hidden items-center gap-1 text-sm font-semibold text-zm-red hover:underline sm:inline-flex"
          >
            All products <ArrowRight size={14} weight="bold" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Action — the formula, then the CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-4">
        <div className="rounded-xl bg-zm-ink px-6 py-10 text-center text-white sm:px-10">
          <p className="font-mono text-sm text-teal-300 sm:text-base">
            savings = C(parcel) + C(item) − C(parcel + item)
          </p>
          <h2 className="mx-auto mt-3 max-w-xl text-2xl font-bold leading-snug sm:text-3xl">
            The math is simple. Predicting C accurately is the product.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-400">
            Open any listing and watch the banner, the estimate panel, and the neighbor table
            explain the same number three different ways.
          </p>
          <a
            href={itemHref(HERO_PRODUCT.id)}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-zm-ink transition-transform hover:scale-[1.02]"
          >
            Try it on the hero listing
            <ArrowRight size={16} weight="bold" />
          </a>
        </div>
      </section>
    </div>
  )
}
