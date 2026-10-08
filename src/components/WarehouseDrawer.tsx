import { ShoppingCart, Warehouse, X } from '@phosphor-icons/react'
import { useZen } from '../state'
import { predictItem } from '../engine/predict'
import { quote } from '../engine/pricing'
import { itemHref } from '../route'
import { fmtDims, fmtKg, fmtYen, ProductThumb } from '../ui'

// Two distinct stages of the ZenMarket flow:
//   cart      = added but not yet ordered -> only a predicted weight exists
//   warehouse = ordered, arrived, weighed on arrival -> measured values
export function WarehouseDrawer() {
  const {
    cart,
    removeCartItem,
    checkoutCart,
    warehouse,
    removeItem,
    resetWarehouse,
    drawerOpen,
    setDrawerOpen,
    warehouseParcel,
    method,
    dest,
    t,
  } = useZen()

  if (!drawerOpen) return null
  const parcelQuote = warehouseParcel ? quote(warehouseParcel, method, dest) : null
  const cartTotal = cart.reduce((sum, p) => sum + p.price, 0)
  const itemTotal = warehouse.reduce((sum, w) => sum + w.product.price, 0)

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 className="text-sm font-bold">{t['wd.title']}</h2>
          <button onClick={() => setDrawerOpen(false)} aria-label={t['wd.close']}>
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {cart.length > 0 && (
            <section className="mb-4">
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500">
                <ShoppingCart size={14} weight="bold" />
                {t['wd.cartHead']}
              </h3>
              <ul className="space-y-3">
                {cart.map((p) => (
                  <li
                    key={p.id}
                    className="flex gap-3 rounded-lg border border-dashed border-neutral-300 p-3"
                  >
                    <a href={itemHref(p.id)} className="shrink-0">
                      <ProductThumb
                        icon={p.icon}
                        image={p.images?.[0]}
                        className="h-14 w-14 rounded"
                      />
                    </a>
                    <div className="min-w-0 flex-1">
                      <a
                        href={itemHref(p.id)}
                        className="block truncate text-[13px] font-medium hover:text-zm-red"
                      >
                        {p.titleEn}
                      </a>
                      <p className="price-num mt-0.5 text-xs text-neutral-500">
                        {t['wd.estArrival'](fmtKg(predictItem(p).weight.p50))}
                      </p>
                      <p className="price-num text-xs text-neutral-400">{fmtYen(p.price)}</p>
                    </div>
                    <button
                      onClick={() => removeCartItem(p.id)}
                      className="self-start text-xs font-medium text-zm-red hover:underline"
                    >
                      {t['wd.remove']}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between text-[13px]">
                <span className="text-neutral-600">
                  {t['wd.cartTotal'](cart.length)}
                </span>
                <span className="price-num font-semibold">{fmtYen(cartTotal)}</span>
              </div>
              <button
                onClick={checkoutCart}
                className="mt-2 w-full rounded-md bg-zm-red py-2.5 text-sm font-bold text-white hover:bg-zm-red-dark"
              >
                {t['wd.checkout']}
              </button>
              <p className="mt-1 text-[11px] text-neutral-400">
                {t['wd.checkoutNote']}
              </p>
            </section>
          )}

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-neutral-500">
              <Warehouse size={14} weight="bold" />
              {t['wd.whHead']}
            </h3>
            {warehouse.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-500">
                {t['wd.whEmpty']}
              </p>
            ) : (
              <ul className="space-y-3">
                {warehouse.map((w) => (
                  <li key={w.product.id} className="flex gap-3 rounded-lg border border-neutral-200 p-3">
                    <a href={itemHref(w.product.id)} className="shrink-0">
                      <ProductThumb
                        icon={w.product.icon}
                        image={w.product.images?.[0]}
                        className="h-14 w-14 rounded"
                      />
                    </a>
                    <div className="min-w-0 flex-1">
                      <a
                        href={itemHref(w.product.id)}
                        className="block truncate text-[13px] font-medium hover:text-zm-red"
                      >
                        {w.product.titleEn}
                      </a>
                      <p className="price-num mt-0.5 text-xs text-neutral-500">
                        {t['wd.measured'](fmtKg(w.measuredWeight), fmtDims(w.measuredDims))}
                      </p>
                      <p className="price-num text-xs text-neutral-400">{fmtYen(w.product.price)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(w.product.id)}
                      className="self-start text-xs font-medium text-zm-red hover:underline"
                    >
                      {t['wd.remove']}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {warehouseParcel && parcelQuote && (
          <footer className="border-t border-neutral-200 px-4 py-3 text-[13px]">
            <div className="flex justify-between text-neutral-600">
              <span>{t['wd.itemsTotal'](warehouse.length)}</span>
              <span className="price-num">{fmtYen(itemTotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-neutral-600">
              <span>{t['wd.packedAs'](warehouseParcel.box)}</span>
              <span className="price-num">{fmtKg(warehouseParcel.weight)}</span>
            </div>
            <div className="mt-1 flex justify-between font-semibold">
              <span>{t['wd.shipVia'](method)}</span>
              <span className="price-num">
                {parcelQuote.price === null ? parcelQuote.note : fmtYen(parcelQuote.price)}
              </span>
            </div>
            {parcelQuote.price !== null && (
              <div className="mt-2 flex justify-between border-t border-neutral-100 pt-2 font-bold">
                <span>{t['wd.totalShip']}</span>
                <span className="price-num">{fmtYen(itemTotal + parcelQuote.price)}</span>
              </div>
            )}
            <p className="mt-1 text-[11px] text-neutral-400">
              {t['wd.whNote']}
            </p>
          </footer>
        )}

        <button
          onClick={resetWarehouse}
          className="border-t border-neutral-200 py-2.5 text-xs font-medium text-neutral-500 hover:bg-neutral-50"
        >
          {t['wd.reset']}
        </button>
      </aside>
    </div>
  )
}
