import { ChatCircle, Heart, MagnifyingGlass, Package, ShoppingCart, UserCircle } from '@phosphor-icons/react'
import { useZen } from '../state'

const STORES = ['All shops', 'Yahoo! Auctions', 'Rakuten', 'Amazon Japan', 'Mercari', 'Surugaya', 'Other stores']

export function DemoStrip() {
  const { t, lang, setLang } = useZen()
  return (
    <div className="bg-zm-ink text-[11px] text-neutral-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5">
        <span>{t['strip.tag']}</span>
        <span className="hidden items-center gap-4 sm:flex">
          <a href="#/messages" className="hover:underline">
            {t['strip.help']}
          </a>
          <a href="#/account" className="hover:underline">
            demo@zenmatch.jp
          </a>
          <span className="flex items-center gap-1 font-semibold">
            {(['en', 'ja'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={lang === l ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}
              >
                {l === 'en' ? 'EN' : '日本語'}
              </button>
            ))}
          </span>
        </span>
      </div>
    </div>
  )
}

export function Header() {
  const { warehouse, cart, openDrawer, watchlist, query, setQuery, t } = useZen()
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <a href="#/" className="flex items-center gap-2.5">
          <img
            src={`${import.meta.env.BASE_URL}zenmarket-mark.png`}
            alt="ZenMarket"
            className="h-9 w-9 rounded-full"
          />
          <span className="text-xl font-bold tracking-tight">ZenMarket</span>
        </a>
        <form
          className="flex flex-1 items-center overflow-hidden rounded-md border border-neutral-300"
          onSubmit={(e) => {
            e.preventDefault()
            location.hash = '#/shop'
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm outline-none"
            placeholder={t['nav.searchPlaceholder']}
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-zm-red px-4 py-2 text-sm font-semibold text-white hover:bg-zm-red-dark"
          >
            <MagnifyingGlass size={16} weight="bold" />
            {t['nav.search']}
          </button>
        </form>
        <nav className="hidden items-center gap-5 text-neutral-600 md:flex">
          <a href="#/messages" aria-label={t['nav.support']} title={t['nav.support']} className="hover:text-zm-ink">
            <ChatCircle size={22} />
          </a>
          <a href="#/watchlist" aria-label={t['nav.watchlist']} title={t['nav.watchlist']} className="relative hover:text-zm-ink">
            <Heart size={22} />
            {watchlist.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-zm-red text-[10px] font-bold text-white">
                {watchlist.length}
              </span>
            )}
          </a>
          <button onClick={() => openDrawer('warehouse')} className="relative" aria-label={t['nav.warehouse']} title={t['nav.warehouse']}>
            <Package size={22} />
            {warehouse.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-teal-700 text-[10px] font-bold text-white">
                {warehouse.length}
              </span>
            )}
          </button>
          <button onClick={() => openDrawer('cart')} className="relative" aria-label={t['nav.cart']} title={t['nav.cart']}>
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-zm-red text-[10px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </button>
          <a href="#/account" aria-label={t['nav.account']} title={t['nav.account']} className="hover:text-zm-ink">
            <UserCircle size={22} />
          </a>
        </nav>
      </div>
    </header>
  )
}

export function StoreTabs() {
  const { t } = useZen()
  const label = (s: string) =>
    s === 'All shops' ? t['stores.all'] : s === 'Other stores' ? t['stores.other'] : s
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
        {STORES.map((s) =>
          s === 'Amazon Japan' ? (
            <a
              key={s}
              href="#/shop"
              className="whitespace-nowrap rounded bg-zm-ink px-3 py-1.5 text-[13px] font-semibold text-white"
            >
              {s}
            </a>
          ) : (
            <button
              key={s}
              onClick={() => window.alert(t['stores.demoAlert'](label(s)))}
              className="whitespace-nowrap rounded px-3 py-1.5 text-[13px] text-neutral-600 hover:bg-neutral-100"
            >
              {label(s)}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

export function Footer() {
  const { t } = useZen()
  return (
    <footer className="mt-14 border-t border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-neutral-600 sm:grid-cols-3">
        <div>
          <p className="mb-2 font-semibold text-zm-ink">ZenMatch</p>
          <p className="max-w-xs text-[13px] leading-relaxed">
            {t['ft.tagline']}
          </p>
        </div>
        <div>
          <p className="mb-2 font-semibold text-zm-ink">{t['ft.scope']}</p>
          <ul className="space-y-1 text-[13px]">
            <li>{t['ft.s1']}</li>
            <li>{t['ft.s2']}</li>
            <li>{t['ft.s3']}</li>
          </ul>
        </div>
        <div>
          <p className="mb-2 font-semibold text-zm-ink">{t['ft.prod']}</p>
          <ul className="space-y-1 text-[13px]">
            <li>{t['ft.p1']}</li>
            <li>{t['ft.p2']}</li>
            <li>{t['ft.p3']}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-100 py-4 text-center text-xs text-neutral-400">
        {t['ft.disclaimer']}
      </div>
    </footer>
  )
}
