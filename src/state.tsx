import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  ALL_PRODUCTS,
  HERO_PRODUCT,
  WAREHOUSE_SEED,
  type DestinationCode,
  type WarehouseItem,
} from './engine/data'
import { predictItem } from './engine/predict'
import { compare, packParcel, quote } from './engine/pricing'
import { useRoute, type Route } from './route'
import type { Comparison, Method, ParcelEstimate, Prediction, Product, Quote } from './engine/types'

interface ZenState {
  route: Route
  product: Product // current product on item pages, hero on browse
  cart: Product[] // added but not yet ordered — predictions only
  addToCart: (p: Product) => void
  removeCartItem: (id: string) => void
  checkoutCart: () => void // order -> items "arrive" in the warehouse weighed
  inCart: (id: string) => boolean
  warehouse: WarehouseItem[] // ordered, arrived, measured
  removeItem: (id: string) => void
  isStored: (id: string) => boolean
  resetWarehouse: () => void
  dest: DestinationCode
  setDest: (d: DestinationCode) => void
  method: Method
  setMethod: (m: Method) => void
  drawerOpen: boolean
  setDrawerOpen: (v: boolean) => void

  prediction: Prediction
  standaloneQuote: Quote // current product shipped alone, at p50
  warehouseParcel: ParcelEstimate | null
  comparison: Comparison | null // null when warehouse empty, ineligible, or item already stored
}

const Ctx = createContext<ZenState | null>(null)

export function ZenProvider({ children }: { children: ReactNode }) {
  const route = useRoute()
  const [cart, setCart] = useState<Product[]>([])
  const [warehouse, setWarehouse] = useState<WarehouseItem[]>(WAREHOUSE_SEED)
  const [dest, setDest] = useState<DestinationCode>('US')
  const [method, setMethod] = useState<Method>('EMS')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const product =
    route.page === 'item'
      ? (ALL_PRODUCTS.find((p) => p.id === route.id) ?? HERO_PRODUCT)
      : HERO_PRODUCT

  const prediction = useMemo(() => predictItem(product), [product])

  const value = useMemo<ZenState>(() => {
    const parcelItems = warehouse.map((w) => ({ weight: w.measuredWeight, dims: w.measuredDims }))
    const warehouseParcel = parcelItems.length ? packParcel(parcelItems) : null

    const standaloneQuote = quote(
      packParcel([{ weight: prediction.weight.p50, dims: prediction.dims }]),
      method,
      dest,
    )

    const alreadyStored = warehouse.some((w) => w.product.id === product.id)
    const comparison =
      warehouseParcel && !alreadyStored
        ? compare(parcelItems, { dims: prediction.dims, weightRange: prediction.weight }, method, dest)
        : null

    return {
      route,
      product,
      cart,
      addToCart: (p) => {
        setCart((c) =>
          c.some((i) => i.id === p.id) || warehouse.some((i) => i.product.id === p.id)
            ? c
            : [...c, p],
        )
        setDrawerOpen(true)
      },
      removeCartItem: (id) => setCart((c) => c.filter((i) => i.id !== id)),
      // Ordering simulates domestic delivery + arrival weighing: each item
      // joins the warehouse carrying the predictor's p50 as its measured weight.
      checkoutCart: () => {
        const arrivals = cart.map((p) => {
          const est = predictItem(p)
          return {
            product: p,
            measuredWeight: Math.round(est.weight.p50 * 100) / 100,
            measuredDims: est.dims,
          }
        })
        setWarehouse((w) => [...w, ...arrivals.filter((a) => !w.some((i) => i.product.id === a.product.id))])
        setCart([])
      },
      inCart: (id) => cart.some((i) => i.id === id),
      warehouse,
      removeItem: (id) => setWarehouse((w) => w.filter((i) => i.product.id !== id)),
      isStored: (id) => warehouse.some((w) => w.product.id === id),
      resetWarehouse: () => {
        setWarehouse(WAREHOUSE_SEED)
        setCart([])
      },
      dest,
      setDest,
      method,
      setMethod,
      drawerOpen,
      setDrawerOpen,
      prediction,
      standaloneQuote,
      warehouseParcel,
      comparison,
    }
  }, [route, product, cart, warehouse, dest, method, drawerOpen, prediction])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useZen(): ZenState {
  const s = useContext(Ctx)
  if (!s) throw new Error('useZen outside provider')
  return s
}
