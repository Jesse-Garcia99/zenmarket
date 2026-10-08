// Domain types for the ZenMatch prediction engine.
// In production these would map to EF Core entities backed by SQL Server;
// here they describe the in-memory model the demo runs against.

export type Category =
  | 'figures'
  | 'electronics'
  | 'watches'
  | 'games'
  | 'plush'
  | 'cards'
  | 'kitchen'
  | 'books'

export interface Dims {
  l: number // cm
  w: number
  h: number
}

export interface Product {
  id: string
  asin: string
  title: string // listing title as shown on the storefront
  titleEn: string
  category: Category
  price: number // JPY
  seller: string
  icon: IconKey
  battery: boolean // lithium battery -> carrier restrictions
  blurb: string
}

export type IconKey =
  | 'figure'
  | 'watch'
  | 'console'
  | 'plush'
  | 'cards'
  | 'camera'
  | 'pot'
  | 'book'
  | 'keyboard'
  | 'hoodie'

// A historical parcel measured after packing. `items` carries the measured
// per-item weights recorded on warehouse arrival — the two layers of training
// data described in the concept doc.
export interface ShipmentRecord {
  id: string // anonymized shipment ref
  title: string
  category: Category
  itemWeight: number // kg, measured on arrival
  itemDims: Dims // cm, as sold
  parcelWeight: number // kg, measured after packing
  parcelDims: Dims // cm, final carton
}

export interface WeightRange {
  p10: number
  p50: number
  p90: number
}

export interface Neighbor {
  record: ShipmentRecord
  score: number // 0..1 similarity
}

export interface Prediction {
  weight: WeightRange // kg
  dims: Dims // cm, predicted as-sold dimensions
  confidence: 'high' | 'medium' | 'low'
  neighbors: Neighbor[]
}

export type Method = 'EMS' | 'AIR' | 'SEA'

export interface ParcelEstimate {
  weight: number // kg, chargeable weight including packaging
  dims: Dims
  box: string // carton label used by the packing model
}

export interface Quote {
  method: Method
  price: number | null // JPY, null when ineligible
  note?: string // why ineligible / caveat
}

export interface Comparison {
  standalone: number // C(B): new item shipped alone
  incremental: number // C(A+B) - C(A)
  savings: number // C(A) + C(B) - C(A+B); negative = ship separately
  standaloneRange: [number, number]
  incrementalRange: [number, number]
  savingsRange: [number, number]
  method: Method
}
