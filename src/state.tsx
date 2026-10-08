import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { HERO_PRODUCT, WAREHOUSE_SEED, type DestinationCode, type WarehouseItem } from './engine/data'
import { predictItem } from './engine/predict'
import { compare, packParcel, quote } from './engine/pricing'
import type { Comparison, Method, ParcelEstimate, Prediction, Quote } from './engine/types'

interface ZenState {
  warehouse: WarehouseItem[]
  removeItem: (id: string) => void
  resetWarehouse: () => void
  dest: DestinationCode
  setDest: (d: DestinationCode) => void
  method: Method
  setMethod: (m: Method) => void
  drawerOpen: boolean
  setDrawerOpen: (v: boolean) => void

  heroPrediction: Prediction
  standaloneQuote: Quote // cost of the hero item shipped alone, at p50
  warehouseParcel: ParcelEstimate | null // current stored items packed
  comparison: Comparison | null // null when warehouse empty or method ineligible
}

const Ctx = createContext<ZenState | null>(null)

export function ZenProvider({ children }: { children: ReactNode }) {
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>(WAREHOUSE_SEED)
  const [dest, setDest] = useState<DestinationCode>('US')
  const [method, setMethod] = useState<Method>('EMS')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const heroPrediction = useMemo(() => predictItem(HERO_PRODUCT), [])

  const value = useMemo<ZenState>(() => {
    const parcelItems = warehouse.map((w) => ({ weight: w.measuredWeight, dims: w.measuredDims }))
    const warehouseParcel = parcelItems.length ? packParcel(parcelItems) : null

    const standaloneQuote = quote(
      packParcel([{ weight: heroPrediction.weight.p50, dims: heroPrediction.dims }]),
      method,
      dest,
    )

    const comparison = warehouseParcel
      ? compare(parcelItems, { dims: heroPrediction.dims, weightRange: heroPrediction.weight }, method, dest)
      : null

    return {
      warehouse,
      removeItem: (id) => setWarehouse((w) => w.filter((i) => i.product.id !== id)),
      resetWarehouse: () => setWarehouse(WAREHOUSE_SEED),
      dest,
      setDest,
      method,
      setMethod,
      drawerOpen,
      setDrawerOpen,
      heroPrediction,
      standaloneQuote,
      warehouseParcel,
      comparison,
    }
  }, [warehouse, dest, method, drawerOpen, heroPrediction])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useZen(): ZenState {
  const s = useContext(Ctx)
  if (!s) throw new Error('useZen outside provider')
  return s
}
