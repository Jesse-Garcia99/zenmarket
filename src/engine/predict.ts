import { HISTORY } from './data'
import type { Category, Dims, Neighbor, Prediction, Product, ShipmentRecord, WeightRange } from './types'

// ---------------------------------------------------------------------------
// Prediction layer: estimate an item's physical properties from its listing
// before it reaches the warehouse.
//
// Production shape (per the concept doc): a gradient-boosted model (LightGBM /
// ML.NET) trained on arrival weights, later upgraded to multimodal embeddings.
// For a transparent demo we ship the same interface with k-NN over listing
// tokens + category — every estimate can be traced back to the exact
// historical shipments that produced it.
// ---------------------------------------------------------------------------

const STOP = new Set([
  'の', 'に', 'を', 'は', 'と', 'が', 'で', 'て', 'も', 'な', 'や',
  'the', 'a', 'an', 'and', 'of', 'with', 'for', 'set', 'ver', 'ver.',
])

const tokenize = (s: string): Set<string> =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .split(' ')
      .filter((t) => t.length > 1 && !STOP.has(t)),
  )

const jaccard = (a: Set<string>, b: Set<string>): number => {
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  return inter / (a.size + b.size - inter || 1)
}

const similarity = (p: Product, h: ShipmentRecord): number => {
  const lex = jaccard(tokenize(`${p.title} ${p.titleEn}`), tokenize(h.title))
  const cat: number = p.category === h.category ? 1 : 0
  return 0.55 * lex + 0.45 * cat
}

// Category priors used when no neighbor is similar enough — the cold-start
// path a real system also needs.
const PRIOR: Record<Category, { w: WeightRange; dims: Dims }> = {
  figures: { w: { p10: 0.3, p50: 0.6, p90: 1.0 }, dims: { l: 22, w: 17, h: 9 } },
  electronics: { w: { p10: 0.4, p50: 0.6, p90: 0.9 }, dims: { l: 21, w: 15, h: 10 } },
  watches: { w: { p10: 0.15, p50: 0.25, p90: 0.4 }, dims: { l: 12, w: 10, h: 9 } },
  games: { w: { p10: 0.35, p50: 0.55, p90: 0.8 }, dims: { l: 20, w: 14, h: 7 } },
  plush: { w: { p10: 0.2, p50: 0.4, p90: 0.6 }, dims: { l: 40, w: 28, h: 18 } },
  cards: { w: { p10: 0.35, p50: 0.45, p90: 0.7 }, dims: { l: 14, w: 13, h: 6 } },
  kitchen: { w: { p10: 0.9, p50: 1.4, p90: 2.0 }, dims: { l: 20, w: 18, h: 15 } },
  books: { w: { p10: 0.5, p50: 0.9, p90: 1.6 }, dims: { l: 30, w: 23, h: 4 } },
  apparel: { w: { p10: 0.4, p50: 0.6, p90: 0.9 }, dims: { l: 30, w: 25, h: 6 } },
  goods: { w: { p10: 0.05, p50: 0.15, p90: 0.3 }, dims: { l: 15, w: 11, h: 4 } },
}

// Weighted quantile over neighbor weights (weights are similarity scores).
const wquantile = (pairs: { v: number; w: number }[], q: number): number => {
  const sorted = [...pairs].sort((a, b) => a.v - b.v)
  const total = sorted.reduce((s, p) => s + p.w, 0)
  let acc = 0
  for (const p of sorted) {
    acc += p.w
    if (acc / total >= q) return p.v
  }
  return sorted[sorted.length - 1].v
}

const K = 4

export function predictItem(product: Product): Prediction {
  const scored = HISTORY.map((record) => ({ record, score: similarity(product, record) }))
    .sort((a, b) => b.score - a.score)
  const neighbors = scored.slice(0, K).filter((n) => n.score > 0.1)

  if (neighbors.length === 0) {
    const prior = PRIOR[product.category]
    return { weight: prior.w, dims: prior.dims, confidence: 'low', neighbors }
  }

  const wp = (v: (n: Neighbor) => number, q: number) =>
    wquantile(neighbors.map((n) => ({ v: v(n), w: n.score })), q)
  const dAxis = (axis: keyof Dims) =>
    wquantile(neighbors.map((n) => ({ v: n.record.itemDims[axis], w: n.score })), 0.5)

  const weight: WeightRange = {
    p10: wp((n) => n.record.itemWeight, 0.1),
    p50: wp((n) => n.record.itemWeight, 0.5),
    p90: wp((n) => n.record.itemWeight, 0.9),
  }
  const dims: Dims = { l: dAxis('l'), w: dAxis('w'), h: dAxis('h') }

  const top = neighbors[0].score
  const spread = weight.p90 / Math.max(weight.p50, 0.01)
  const confidence: Prediction['confidence'] =
    top > 0.6 && spread < 1.4 ? 'high' : top > 0.35 ? 'medium' : 'low'

  return { weight, dims, confidence, neighbors }
}
