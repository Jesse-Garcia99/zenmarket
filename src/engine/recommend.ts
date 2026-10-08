import type { Method, Product } from './types'
import type { DestinationCode } from './data'
import type { PackableItem } from './pricing'
import { predictItem } from './predict'
import { compare, packParcel, quote } from './pricing'

// What buying this product adds to the customer's shipping bill, in JPY.
// Empty warehouse -> standalone quote; otherwise the incremental parcel cost.
// null -> the chosen method can't carry the result.
export function addedShipping(
  p: Product,
  items: PackableItem[],
  method: Method,
  dest: DestinationCode,
): number | null {
  const pred = predictItem(p)
  if (items.length === 0)
    return quote(packParcel([{ weight: pred.weight.p50, dims: pred.dims }]), method, dest).price
  const cmp = compare(items, { dims: pred.dims, weightRange: pred.weight }, method, dest)
  return cmp ? cmp.incremental : null
}
