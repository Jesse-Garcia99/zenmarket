import type { Comparison, Dims, Method, ParcelEstimate, Quote } from './types'
import type { DestinationCode } from './data'

// ---------------------------------------------------------------------------
// Pricing layer: deterministic business logic applied on top of predictions.
// Carrier rate tables and packing rules change with prices, not with the
// model — keeping them separate means historical shipping charges only ever
// validate estimates, never set prices.
// ---------------------------------------------------------------------------

export interface PackableItem {
  weight: number // kg (measured for warehouse items, predicted for new ones)
  dims: Dims
}

// Standard outbound cartons, smallest first. A real packing model would run
// true 3D bin-packing; for the demo we sort axes and use a volume heuristic
// with a packing inefficiency factor — good enough to reproduce the real
// effect that matters here: one bulky item can force a bigger carton.
const BOXES: { name: string; dims: Dims; tare: number }[] = [
  { name: 'Small 23×17×10', dims: { l: 23, w: 17, h: 10 }, tare: 0.14 },
  { name: 'Medium 30×22×12', dims: { l: 30, w: 22, h: 12 }, tare: 0.22 },
  { name: 'Large 35×26×15', dims: { l: 35, w: 26, h: 15 }, tare: 0.3 },
  { name: 'XL 45×35×25', dims: { l: 45, w: 35, h: 25 }, tare: 0.52 },
  { name: 'Oversize 55×40×30', dims: { l: 55, w: 40, h: 30 }, tare: 0.7 },
]

const sortedAxes = (d: Dims): number[] => [d.l, d.w, d.h].sort((a, b) => a - b)
const volume = (d: Dims) => d.l * d.w * d.h
const fits = (item: Dims, box: Dims) => {
  const a = sortedAxes(item)
  const b = sortedAxes(box)
  return a.every((v, i) => v <= b[i] + 0.001)
}

const PAD = 2 // cm of protective padding added per axis for a single item
const COMBINE_FACTOR = 1.4 // void fill + inefficiency when co-packing items

export function packParcel(items: PackableItem[]): ParcelEstimate {
  const itemWeight = items.reduce((s, i) => s + i.weight, 0)

  let box
  if (items.length === 1) {
    const padded: Dims = {
      l: items[0].dims.l + PAD,
      w: items[0].dims.w + PAD,
      h: items[0].dims.h + PAD,
    }
    box = BOXES.find((b) => fits(padded, b.dims)) ?? BOXES[BOXES.length - 1]
  } else {
    const needed = items.reduce((s, i) => s + volume(i.dims), 0) * COMBINE_FACTOR
    const longest = Math.max(...items.map((i) => Math.max(i.dims.l, i.dims.w, i.dims.h))) + PAD
    box =
      BOXES.find((b) => volume(b.dims) >= needed && sortedAxes(b.dims)[2] >= longest) ??
      BOXES[BOXES.length - 1]
  }

  return {
    weight: itemWeight * 1.08 + box.tare, // dunnage ~8% + carton tare
    dims: box.dims,
    box: box.name,
  }
}

// Approximate Japan Post retail bands (JPY) for Zone US. Other destinations
// apply a zone multiplier. Not live pricing — the point is the mechanics.
const EMS_BANDS: [number, number][] = [
  [0.5, 3150], [1, 3900], [1.5, 4650], [2, 5400], [2.5, 6150],
  [3, 6900], [4, 7950], [5, 9000], [7, 11100], [10, 14100],
]
const AIR_BANDS: [number, number][] = [
  [0.5, 1150], [1, 1650], [1.5, 2050], [2, 2350],
]
const SEA_BANDS: [number, number][] = [
  [1, 1800], [2, 2200], [3, 2550], [5, 3100], [10, 4200], [20, 6800],
]

const ZONE_MULT: Record<DestinationCode, number> = { US: 1, GB: 1.08, DE: 1.1, AU: 1.12 }
const AIR_MAX_GIRTH = 90 // l+w+h limit for small-packet air mail

const bandPrice = (bands: [number, number][], kg: number): number | null => {
  const hit = bands.find(([max]) => kg <= max)
  return hit ? hit[1] : null
}

export function quote(parcel: ParcelEstimate, method: Method, dest: DestinationCode): Quote {
  const kg = parcel.weight
  const girth = parcel.dims.l + parcel.dims.w + parcel.dims.h
  let price: number | null
  let note: string | undefined

  switch (method) {
    case 'EMS':
      price = bandPrice(EMS_BANDS, kg)
      if (price === null) note = 'Exceeds 10 kg EMS band shown here'
      break
    case 'AIR':
      price = bandPrice(AIR_BANDS, kg)
      if (price === null) note = 'Over 2 kg — not eligible for small-packet air mail'
      else if (girth > AIR_MAX_GIRTH) {
        price = null
        note = `Parcel is ${girth} cm girth — exceeds the 90 cm air-packet limit`
      }
      break
    case 'SEA':
      price = bandPrice(SEA_BANDS, kg)
      note = 'Surface mail — typically 1–3 months'
      break
  }

  return { method, price: price === null ? null : Math.round(price * ZONE_MULT[dest]), note }
}

// The formulas from the concept doc, evaluated at three points of the new
// item's weight distribution so the UI can show a range instead of a fake
// point estimate:
//   Incremental = C(A+B) - C(A)
//   Savings     = C(A) + C(B) - C(A+B)
export function compare(
  existing: PackableItem[],
  newItem: { dims: Dims; weightRange: { p10: number; p50: number; p90: number } },
  method: Method,
  dest: DestinationCode,
): Comparison | null {
  const cost = (items: PackableItem[]) => quote(packParcel(items), method, dest).price
  const at = (w: number) => {
    const cA = cost(existing)
    const cB = cost([{ weight: w, dims: newItem.dims }])
    const cAB = cost([...existing, { weight: w, dims: newItem.dims }])
    if (cA === null || cB === null || cAB === null) return null
    return { standalone: cB, incremental: cAB - cA, savings: cA + cB - cAB }
  }

  const lo = at(newItem.weightRange.p10)
  const mid = at(newItem.weightRange.p50)
  const hi = at(newItem.weightRange.p90)
  if (!lo || !mid || !hi) return null

  const pick = (f: (x: NonNullable<typeof mid>) => number): [number, number] => [
    Math.min(f(lo), f(mid), f(hi)),
    Math.max(f(lo), f(mid), f(hi)),
  ]

  return {
    standalone: mid.standalone,
    incremental: mid.incremental,
    savings: mid.savings,
    standaloneRange: pick((x) => x.standalone),
    incrementalRange: pick((x) => x.incremental),
    savingsRange: pick((x) => x.savings),
    method,
  }
}
