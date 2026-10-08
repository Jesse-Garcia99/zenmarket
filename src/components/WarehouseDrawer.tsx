import { X } from '@phosphor-icons/react'
import { useZen } from '../state'
import { quote } from '../engine/pricing'
import { fmtDims, fmtKg, fmtYen, ProductThumb } from '../ui'

// Simulated ZenMarket warehouse: items that already arrived and were weighed.
// Removing items is what flips the banner between its states.
export function WarehouseDrawer() {
  const { warehouse, removeItem, resetWarehouse, drawerOpen, setDrawerOpen, warehouseParcel, method, dest } =
    useZen()

  if (!drawerOpen) return null
  const parcelQuote = warehouseParcel ? quote(warehouseParcel, method, dest) : null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 className="text-sm font-bold">My warehouse</h2>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close">
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {warehouse.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              No items in storage. The banner now shows standalone shipping estimates.
            </p>
          ) : (
            <ul className="space-y-3">
              {warehouse.map((w) => (
                <li key={w.product.id} className="flex gap-3 rounded-lg border border-neutral-200 p-3">
                  <ProductThumb icon={w.product.icon} className="h-14 w-14 shrink-0 rounded" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{w.product.titleEn}</p>
                    <p className="price-num mt-0.5 text-xs text-neutral-500">
                      measured {fmtKg(w.measuredWeight)} · {fmtDims(w.measuredDims)}
                    </p>
                    <p className="price-num text-xs text-neutral-400">{fmtYen(w.product.price)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(w.product.id)}
                    className="self-start text-xs font-medium text-zm-red hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {warehouseParcel && parcelQuote && (
          <footer className="border-t border-neutral-200 px-4 py-3 text-[13px]">
            <div className="flex justify-between text-neutral-600">
              <span>Packed as one parcel ({warehouseParcel.box})</span>
              <span className="price-num">{fmtKg(warehouseParcel.weight)}</span>
            </div>
            <div className="mt-1 flex justify-between font-semibold">
              <span>Ships via {method}</span>
              <span className="price-num">
                {parcelQuote.price === null ? parcelQuote.note : fmtYen(parcelQuote.price)}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Stored items use weights measured on arrival — no prediction needed.
            </p>
          </footer>
        )}

        <button
          onClick={resetWarehouse}
          className="border-t border-neutral-200 py-2.5 text-xs font-medium text-neutral-500 hover:bg-neutral-50"
        >
          Reset demo inventory
        </button>
      </aside>
    </div>
  )
}
