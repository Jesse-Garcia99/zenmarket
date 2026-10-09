import { ArrowRight, Brain, Cube, Package, Sparkle, Tag } from '@phosphor-icons/react'
import { useMemo } from 'react'
import { useZen } from '../state'
import { ALL_PRODUCTS, HERO_PRODUCT } from '../engine/data'
import { predictItem } from '../engine/predict'
import { compare, packParcel, quote } from '../engine/pricing'
import { addedShipping } from '../engine/recommend'
import { fmtDims, fmtKg, fmtYen } from '../ui'
import { ProductCard } from './ProductCard'
import { itemHref } from '../route'

// Staggered columns of real product photos — the hero's visual. White-photo
// backgrounds dissolve into the page, so tiles read as objects, not boxes.
function Collage() {
  const shots = [
    ['goku.jpg', 'casio.jpg'],
    ['teapot.jpg', 'hhkb.jpg'],
    ['miku.jpg', 'pokemon.jpg'],
  ]
  const offsets = ['pt-10', 'pt-0', 'pt-16']
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4" aria-hidden="true">
      {shots.map((col, i) => (
        <div key={i} className={`space-y-3 sm:space-y-4 ${offsets[i]}`}>
          {col.map((img, j) => (
            <img
              key={img}
              src={`${import.meta.env.BASE_URL}products/${img}`}
              alt=""
              className={`w-full rounded-xl border border-neutral-200/70 object-cover shadow-sm transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] ${
                j === 0 ? 'aspect-[4/5]' : 'aspect-square'
              } ${i % 2 === 0 ? 'rotate-[1.5deg]' : '-rotate-[1.5deg]'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// The live pipeline demo: a self-running 9s loop driven by the zmx-* keyframes
// in index.css. Every number is real engine output for the hero product —
// change the warehouse and the animation's math changes too.
function PipelineCard() {
  const { warehouse, method, dest, t } = useZen()
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
          <span>{t['ep.title']}</span>
          <span className="flex items-center gap-1 text-teal-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-teal-500 opacity-75" />
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
            </span>
            {t['home.live']}
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
                {t['home.yourParcel'](fmtKg(wBefore))}
              </span>
              <span className="zmx-wb absolute inset-0 text-teal-700">
                {t['home.yourParcel'](fmtKg(wAfter))}
              </span>
            </p>
          </div>
        </div>

        <div className="zmx-pred -mt-1 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800">
          <Brain size={12} weight="fill" />
          {t['home.predChip'](
            `${fmtKg(pred.weight.p10)}–${fmtKg(pred.weight.p90)}`,
            fmtDims(pred.dims),
            pred.neighbors.length,
          )}
        </div>

        <div className="zmx-math mt-3 space-y-1 border-t border-neutral-100 pt-3 text-[13px]">
          <div className="flex justify-between text-neutral-500">
            <span>{t['home.sep']}</span>
            <span className="zmx-strike relative">{fmtYen(standalone)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-zm-ink">
            <span>
              {t['home.addTo']}{' '}
              {before !== null && <span className="font-normal text-neutral-400">{t['home.now'](fmtYen(before))}</span>}
            </span>
            <span className="text-teal-800">
              {cmp ? `+${fmtYen(cmp.incremental)}` : `+${fmtYen(standalone)}`}
            </span>
          </div>
        </div>

        {cmp && cmp.savings > 0 && (
          <div className="zmx-save absolute bottom-3 right-4 rounded-full bg-zm-red px-3 py-1 text-xs font-bold text-white shadow-md">
            {t['home.save'](fmtYen(cmp.savings))}
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-[11px] text-neutral-500">
        {t['home.animNote']}
      </p>
    </div>
  )
}

const STEPS = [
  {
    icon: <Brain size={20} weight="duotone" />,
    title: 'step1.t',
    body: 'step1.b',
    foot: 'src/engine/predict.ts',
  },
  {
    icon: <Cube size={20} weight="duotone" />,
    title: 'step2.t',
    body: 'step2.b',
    foot: 'src/engine/pricing.ts',
  },
  {
    icon: <Tag size={20} weight="duotone" />,
    title: 'step3.t',
    body: 'step3.b',
    foot: 'C(A+B) − C(A)',
  },
] as const

export function HomePage() {
  const { warehouse, method, dest, isStored, inCart, t } = useZen()

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
      {/* Hero banner — white band, pitch left, product collage right */}
      <section className="border-b border-neutral-200 bg-white bg-[radial-gradient(ellipse_at_top_right,rgba(14,122,109,0.07),transparent_55%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-teal-800">
              <Sparkle size={12} weight="fill" />
              {t['home.eyebrow']}
            </p>
            <h1 className="mt-4 max-w-xl text-5xl font-bold leading-[1.05] tracking-tighter text-zm-ink sm:text-6xl">
              {t['home.h1']}
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-600">
              {t['home.sub']}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#/shop"
                className="inline-flex items-center gap-2 rounded-md bg-zm-red px-5 py-3 text-sm font-bold text-white transition-all hover:bg-zm-red-dark active:scale-[0.98]"
              >
                {t['home.ctaShop']}
                <ArrowRight size={16} weight="bold" />
              </a>
              <button
                onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-zm-ink hover:text-zm-red"
              >
                {t['home.ctaHow']}
                <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
          <Collage />
        </div>
      </section>

      {/* Stat strip — belongs under the hero, not inside it */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-neutral-100 px-4">
          {[
            [t['home.stat1v'], t['home.stat1']],
            [t['home.stat2v'], t['home.stat2']],
            [t['home.stat3v'], t['home.stat3']],
          ].map(([v, l]) => (
            <div key={l} className="px-3 py-4 text-center sm:px-6">
              <p className="text-base font-bold text-zm-ink sm:text-lg">{v}</p>
              <p className="text-xs text-neutral-500 sm:text-[13px]">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — steps left, the live pipeline demo right */}
      <section id="how" className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zm-ink">
            {t['home.howTitle']}
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-500">
            {t['home.howSub']}
          </p>
          <ol className="mt-8 space-y-6">
            {STEPS.map((s) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700">
                  {s.icon}
                </span>
                <div>
                  <h3 className="font-bold text-zm-ink">{t[s.title]}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-neutral-600">{t[s.body]}</p>
                  <code className="mt-2 inline-block rounded bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
                    {s.foot}
                  </code>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <PipelineCard />
      </section>

      {/* Cheapest additions to your parcel, right now */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-zm-ink">
          {t['home.railTitle']}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          {t['home.railSub']}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Closing CTA — the page's single dark band */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-2">
        <div className="rounded-xl bg-zm-ink px-6 py-12 text-center text-white sm:px-10">
          <p className="font-mono text-sm text-teal-300 sm:text-base">
            savings = C(parcel) + C(item) − C(parcel + item)
          </p>
          <h2 className="mx-auto mt-3 max-w-xl text-2xl font-bold leading-snug sm:text-3xl">
            {t['home.ctaTitle']}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-400">
            {t['home.ctaSub']}
          </p>
          <a
            href={itemHref(HERO_PRODUCT.id)}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-bold text-zm-ink transition-transform hover:scale-[1.02]"
          >
            {t['home.ctaHero']}
            <ArrowRight size={16} weight="bold" />
          </a>
        </div>
      </section>
    </div>
  )
}
