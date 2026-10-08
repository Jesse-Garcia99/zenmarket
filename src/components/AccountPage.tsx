import {
  ChatCircle,
  Clock,
  CreditCard,
  Heart,
  MapPin,
  Package,
  ShoppingCart,
  UserCircle,
  Wallet,
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useZen } from '../state'
import { fmtKg, fmtYen } from '../ui'
import { itemHref } from '../route'

// ZenMarket's mypage.aspx, scaled to the demo: account card + menu on the left,
// "items you've ordered" (the warehouse contents) on the right. Menu entries
// that have no demo counterpart raise the same demo alert as the shop tabs.
const demoAlert = (what: string, msg: (w: string) => string) => window.alert(msg(what))

function MenuItem({
  icon,
  label,
  note,
  onClick,
  href,
}: {
  icon: ReactNode
  label: string
  note?: string
  onClick?: () => void
  href?: string
}) {
  const cls =
    'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-zm-ink hover:bg-neutral-100'
  const inner = (
    <>
      <span className="text-neutral-500">{icon}</span>
      {label}
      {note && <span className="ml-auto text-xs font-normal text-neutral-400">{note}</span>}
    </>
  )
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

export function AccountPage() {
  const { warehouse, cart, watchlist, setDrawerOpen, t } = useZen()
  const itemTotal = warehouse.reduce((s, i) => s + i.product.price, 0)
  const demo = (label: string) => demoAlert(label, t['acc.demoAlert'])

  return (
    <div className="mx-auto max-w-6xl px-4 pt-5">
      <h1 className="mb-4 text-lg font-bold text-zm-ink">{t['acc.title']}</h1>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3">
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <UserCircle size={44} weight="duotone" className="text-teal-700" />
              <div>
                <p className="font-semibold text-zm-ink">{t['acc.name']}</p>
                <p className="text-xs text-neutral-500">demo@zenmatch.jp</p>
              </div>
            </div>
            <div className="mt-4 rounded-md bg-neutral-50 px-3 py-2.5">
              <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Wallet size={14} />
                {t['acc.balance']}
              </p>
              <p className="mt-0.5 text-lg font-bold text-zm-ink">{fmtYen(12450)}</p>
              <button
                onClick={() => demo(t['acc.addFunds'])}
                className="mt-1.5 w-full rounded bg-teal-700 py-1.5 text-xs font-semibold text-white hover:bg-teal-800"
              >
                {t['acc.addFunds']}
              </button>
            </div>
          </div>

          <nav className="rounded-lg border border-neutral-200 bg-white p-2">
            <MenuItem
              icon={<Package size={18} />}
              label={t['acc.mWarehouse']}
              note={t.items(warehouse.length)}
              onClick={() => setDrawerOpen(true)}
            />
            <MenuItem
              icon={<ShoppingCart size={18} />}
              label={t['acc.mCart']}
              note={t.items(cart.length)}
              onClick={() => setDrawerOpen(true)}
            />
            <MenuItem
              icon={<Heart size={18} />}
              label={t['acc.mWatch']}
              note={t.items(watchlist.length)}
              href="#/watchlist"
            />
            <MenuItem icon={<ChatCircle size={18} />} label={t['acc.mMsg']} href="#/messages" />
            <MenuItem
              icon={<MapPin size={18} />}
              label={t['acc.mAddr']}
              onClick={() => demo(t['acc.mAddr'])}
            />
            <MenuItem
              icon={<CreditCard size={18} />}
              label={t['acc.mPay']}
              onClick={() => demo(t['acc.mPay'])}
            />
          </nav>
        </aside>

        <section className="rounded-lg border border-neutral-200 bg-white">
          <header className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
            <h2 className="text-sm font-bold text-zm-ink">{t['acc.orders']}</h2>
            <span className="text-xs text-neutral-400">
              {t['acc.freeStorage']}
            </span>
          </header>
          {warehouse.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-neutral-500">
              {t['acc.noOrders']}
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {warehouse.map((i) => (
                <li key={i.product.id} className="flex items-center gap-3 px-4 py-3">
                  {i.product.images?.[0] && (
                    <img
                      src={`${import.meta.env.BASE_URL}products/${i.product.images[0]}`}
                      alt=""
                      className="h-14 w-14 rounded border border-neutral-100 object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <a href={itemHref(i.product.id)} className="line-clamp-1 text-[13px] font-medium text-zm-ink hover:underline">
                      {i.product.title}
                    </a>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
                      <Clock size={12} />
                      {t['acc.arrived'](fmtKg(i.measuredWeight))}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-zm-ink">{fmtYen(i.product.price)}</span>
                  <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-semibold text-teal-800">
                    {t['acc.inStorage']}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {warehouse.length > 0 && (
            <footer className="flex items-center justify-between border-t border-neutral-100 px-4 py-3 text-sm">
              <span className="text-neutral-500">{t['acc.itemsTotal']}</span>
              <strong className="text-zm-ink">{fmtYen(itemTotal)}</strong>
            </footer>
          )}
        </section>
      </div>
    </div>
  )
}
