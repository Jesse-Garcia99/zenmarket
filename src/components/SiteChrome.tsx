import { ChatCircle, Heart, MagnifyingGlass, ShoppingCart, UserCircle } from '@phosphor-icons/react'
import { useZen } from '../state'

const STORES = ['All shops', 'Yahoo! Auctions', 'Rakuten', 'Amazon Japan', 'Mercari', 'Surugaya', 'Other stores']

export function DemoStrip() {
  return (
    <div className="bg-zm-ink text-[11px] text-neutral-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5">
        <span>
          <strong className="font-semibold text-white">ZenMatch</strong> prototype — product page and shipping
          figures are simulated
        </span>
        <span className="hidden gap-4 sm:flex">
          <span>Help</span>
          <span>demo@zenmatch.jp</span>
          <span>English · JPY ¥</span>
        </span>
      </div>
    </div>
  )
}

export function Header() {
  const { warehouse, setDrawerOpen } = useZen()
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-zm-red text-xl font-black text-white">
            Z
          </span>
          <span className="text-xl font-bold tracking-tight">ZenMarket</span>
        </a>
        <div className="flex flex-1 items-center overflow-hidden rounded-md border border-neutral-300">
          <input
            className="w-full px-3 py-2 text-sm outline-none"
            placeholder="Search on Amazon Japan — paste a link or type a product name"
          />
          <button className="flex items-center gap-1.5 bg-zm-red px-4 py-2 text-sm font-semibold text-white hover:bg-zm-red-dark">
            <MagnifyingGlass size={16} weight="bold" />
            Search
          </button>
        </div>
        <nav className="hidden items-center gap-5 text-neutral-600 md:flex">
          <ChatCircle size={22} />
          <Heart size={22} />
          <button onClick={() => setDrawerOpen(true)} className="relative" aria-label="Warehouse">
            <ShoppingCart size={22} />
            {warehouse.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-zm-red text-[10px] font-bold text-white">
                {warehouse.length}
              </span>
            )}
          </button>
          <UserCircle size={22} />
        </nav>
      </div>
    </header>
  )
}

export function StoreTabs() {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
        {STORES.map((s) => (
          <span
            key={s}
            className={`whitespace-nowrap rounded px-3 py-1.5 text-[13px] ${
              s === 'Amazon Japan'
                ? 'bg-zm-ink font-semibold text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mt-14 border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-neutral-600 sm:grid-cols-3">
        <div>
          <p className="mb-2 font-semibold text-zm-ink">ZenMatch</p>
          <p className="max-w-xs text-[13px] leading-relaxed">
            Concept prototype for predictive shipping and consolidation recommendations. Rates,
            products, and history are simulated — the prediction logic in <code>src/engine</code> is
            real.
          </p>
        </div>
        <div>
          <p className="mb-2 font-semibold text-zm-ink">Prototype scope</p>
          <ul className="space-y-1 text-[13px]">
            <li>k-NN item weight &amp; size prediction</li>
            <li>Parcel packing model + carrier rate bands</li>
            <li>Separate vs consolidated comparison</li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-zm-ink">Production shape</p>
          <ul className="space-y-1 text-[13px]">
            <li>ASP.NET Core + EF Core + SQL Server</li>
            <li>LightGBM / ML.NET for weight prediction</li>
            <li>Live carrier rate APIs</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-100 py-4 text-center text-xs text-neutral-400">
        Not affiliated with ZenMarket or ZenGroup. Built as an interview demo.
      </div>
    </footer>
  )
}
