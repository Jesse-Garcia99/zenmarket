import type { Category, Dims, Product, ShipmentRecord } from './types'

// ---------------------------------------------------------------------------
// Catalog. `B0H69HCC8T` is the hero product matching the referenced ZenMarket
// listing URL (a Japan-exclusive item from a hobby seller). Prices and weights
// are illustrative, not live data.
// ---------------------------------------------------------------------------

export const HERO_PRODUCT: Product = {
  id: 'hero',
  asin: 'B0H69HCC8T',
  title:
    'BANDAI SPIRITS S.H.Figuarts 孫悟空(ミニ)-DAIMA- 約70mm PVC&ABS製 塗装済み可動フィギュア',
  titleEn: 'BANDAI SPIRITS S.H.Figuarts Son Goku (mini) -DAIMA- action figure',
  category: 'figures',
  price: 7800,
  seller: 'ほびくるオンライン',
  icon: 'figure',
  battery: false,
  blurb:
    'Japan-exclusive Dragon Ball DAIMA release. Approx. 70mm, articulated, with interchangeable hands and Nyoibo staff.',
}

export const RELATED_PRODUCTS: Product[] = [
  {
    id: 'watch',
    asin: 'B0DQ7XK2PL',
    title: 'CASIO カシオ A168WA-1 メンズ 腕時計 クロノグラフ 海外モデル',
    titleEn: 'Casio A168WA-1 digital watch (Japan domestic model)',
    category: 'watches',
    price: 3980,
    seller: 'Amazon.co.jp',
    icon: 'watch',
    battery: true,
    blurb: 'Classic digital Casio with Japanese-market packaging.',
  },
  {
    id: 'console',
    asin: 'B0DYXR4VNM',
    title: '【箱説付き】バンダイ ソラーパワー LCDゲーム 昭和レトロ 1982',
    titleEn: 'Bandai LCD Solarpower handheld game (1982, boxed)',
    category: 'games',
    price: 12400,
    seller: 'レトロゲーム屋さん',
    icon: 'console',
    battery: false,
    blurb: 'Vintage solar-powered LCD handheld with original box.',
  },
  {
    id: 'plush',
    asin: 'B0F2LM9QXC',
    title: 'ちいかわ 超BIGぬいぐるみ ハチワレ 約45cm プライズ限定',
    titleEn: 'Chiikawa super-big plush Hachiware, ~45cm, prize exclusive',
    category: 'plush',
    price: 2900,
    seller: 'プライズ専門店',
    icon: 'plush',
    battery: false,
    blurb: 'Oversized crane-game prize plush. Light but bulky.',
  },
  {
    id: 'cards',
    asin: 'B0DKP3VR8T',
    title: 'ポケモンカードゲーム スカーレット&バイオレット 拡張パック BOX',
    titleEn: 'Pokemon TCG Scarlet & Violet booster box (Japanese)',
    category: 'cards',
    price: 5400,
    seller: 'トレカの郷',
    icon: 'cards',
    battery: false,
    blurb: 'Sealed 30-pack booster box, Japanese edition.',
  },
  {
    id: 'camera',
    asin: 'B0CR8WZNJD',
    title: 'コダック インスタントカメラプリンター Mini Shot 2 日本限定カラー',
    titleEn: 'Kodak Mini Shot 2 instant camera, Japan-only color',
    category: 'electronics',
    price: 14800,
    seller: 'カメラのキタムラ',
    icon: 'camera',
    battery: true,
    blurb: '2-in-1 instant camera and photo printer.',
  },
  {
    id: 'pot',
    asin: 'B0BZT4HKMW',
    title: '南部鉄器 急須 平丸アラレ 0.3L 岩鋳 伝統工芸品',
    titleEn: 'Nanbu tekki cast iron teapot, 0.3L, Iwachu',
    category: 'kitchen',
    price: 16500,
    seller: '岩鋳直営',
    icon: 'pot',
    battery: false,
    blurb: 'Handmade cast-iron teapot from Morioka. Dense and heavy.',
  },
]

// ---------------------------------------------------------------------------
// Warehouse seed: items the customer already has in ZenMarket storage.
// `measured` fields exist because ZenMarket weighs items on arrival — stored
// items carry exact weights, which is why consolidated quotes are tighter than
// pre-arrival predictions.
// ---------------------------------------------------------------------------

export interface WarehouseItem {
  product: Product
  measuredWeight: number // kg, measured on arrival
  measuredDims: Dims // cm, as arrived
}

export const WAREHOUSE_SEED: WarehouseItem[] = [
  {
    product: {
      id: 'wh-figure',
      asin: 'B0CJ4TMVKR',
      title: 'METAL BUILD ストライクガンダム -METAL BUILD 10th Ver.-',
      titleEn: 'Metal Build Strike Gundam 10th Ver.',
      category: 'figures',
      price: 24200,
      seller: 'ほびくるオンライン',
      icon: 'figure',
      battery: false,
      blurb: '',
    },
    measuredWeight: 1.15,
    measuredDims: { l: 31, w: 22, h: 9 },
  },
  {
    product: {
      id: 'wh-book',
      asin: 'B0DFHK92QW',
      title: '画集「平成エヴァンゲリオン大画集」 大型本',
      titleEn: 'Evangelion Heisei art book (large format)',
      category: 'books',
      price: 4400,
      seller: 'Amazon.co.jp',
      icon: 'book',
      battery: false,
      blurb: '',
    },
    measuredWeight: 0.92,
    measuredDims: { l: 30, w: 23, h: 2 },
  },
]

// ---------------------------------------------------------------------------
// Synthetic training set: anonymized historical shipments. Each record keeps
// the measured item weight (recorded at arrival) and the final packed parcel
// measurements — the two supervision signals from the concept doc.
// ---------------------------------------------------------------------------

const r = (
  id: string,
  title: string,
  category: Category,
  itemWeight: number,
  itemDims: Dims,
  parcelWeight: number,
  parcelDims: Dims,
): ShipmentRecord => ({ id, title, category, itemWeight, itemDims, parcelWeight, parcelDims })

export const HISTORY: ShipmentRecord[] = [
  // figures — boxed articulated figures ~80-300mm tall
  r('ZX-4102', 'S.H.Figuarts 仮面ライダー フィギュア 約150mm', 'figures', 0.41, { l: 19, w: 15, h: 6 }, 0.78, { l: 30, w: 22, h: 12 }),
  r('ZX-4187', 'S.H.Figuarts ドラゴンボール 可動フィギュア 70mm ミニ', 'figures', 0.19, { l: 14, w: 9, h: 5 }, 0.52, { l: 23, w: 17, h: 10 }),
  r('ZX-4230', 'figma アクションフィギュア 付属品多数', 'figures', 0.55, { l: 22, w: 17, h: 8 }, 0.94, { l: 30, w: 22, h: 12 }),
  r('ZX-4311', '一番くじ フィギュア 大きめ 箱入り', 'figures', 0.88, { l: 28, w: 20, h: 15 }, 1.31, { l: 35, w: 26, h: 15 }),
  r('ZX-4420', 'METAL BUILD ガンダム フィギュア 大型', 'figures', 1.21, { l: 32, w: 23, h: 10 }, 1.72, { l: 40, w: 30, h: 20 }),
  r('ZX-4478', 'ねんどろいど ちびフィギュア 小型箱', 'figures', 0.33, { l: 17, w: 13, h: 9 }, 0.66, { l: 23, w: 17, h: 10 }),
  r('ZX-4533', 'ロボット魂 可動フィギュア 中箱', 'figures', 0.64, { l: 24, w: 18, h: 9 }, 1.05, { l: 30, w: 22, h: 12 }),
  // watches
  r('ZX-5108', 'カシオ Gショック 腕時計 箱付き', 'watches', 0.24, { l: 12, w: 10, h: 9 }, 0.58, { l: 23, w: 17, h: 10 }),
  r('ZX-5154', 'CASIO A168 デジタル腕時計 海外モデル', 'watches', 0.16, { l: 11, w: 9, h: 8 }, 0.49, { l: 23, w: 17, h: 10 }),
  r('ZX-5212', 'セイコー5 自動巻き 腕時計', 'watches', 0.31, { l: 13, w: 10, h: 9 }, 0.66, { l: 23, w: 17, h: 10 }),
  // games / retro handhelds
  r('ZX-6101', 'ゲームボーイ 本体 レトロ 携帯ゲーム機', 'games', 0.42, { l: 18, w: 12, h: 6 }, 0.79, { l: 23, w: 17, h: 10 }),
  r('ZX-6177', 'バンダイ LCD ゲーム 箱説付き 昭和レトロ', 'games', 0.51, { l: 20, w: 14, h: 7 }, 0.87, { l: 30, w: 22, h: 12 }),
  r('ZX-6240', 'ニンテンドー3DS 本体 箱付き', 'games', 0.62, { l: 21, w: 15, h: 8 }, 0.98, { l: 30, w: 22, h: 12 }),
  // plush — light but bulky; drives the "consolidation is worse" case
  r('ZX-7104', 'ぬいぐるみ 大きい 約40cm', 'plush', 0.38, { l: 40, w: 28, h: 18 }, 0.92, { l: 45, w: 35, h: 25 }),
  r('ZX-7155', 'ちいかわ BIG ぬいぐるみ 45cm プライズ', 'plush', 0.46, { l: 45, w: 30, h: 20 }, 1.05, { l: 55, w: 40, h: 30 }),
  r('ZX-7220', 'ポケモン ぬいぐるみ 中 25cm', 'plush', 0.21, { l: 25, w: 18, h: 12 }, 0.55, { l: 30, w: 22, h: 12 }),
  // trading cards — small and dense
  r('ZX-8102', 'ポケモンカード 拡張パック BOX シュリンク付き', 'cards', 0.42, { l: 14, w: 13, h: 6 }, 0.75, { l: 23, w: 17, h: 10 }),
  r('ZX-8188', '遊戯王 カード BOX 未開封', 'cards', 0.39, { l: 13, w: 12, h: 6 }, 0.71, { l: 23, w: 17, h: 10 }),
  r('ZX-8245', 'ワンピースカード ブースターBOX 2個セット', 'cards', 0.81, { l: 15, w: 14, h: 11 }, 1.18, { l: 30, w: 22, h: 12 }),
  // electronics
  r('ZX-9103', 'インスタントカメラ チェキ 本体', 'electronics', 0.55, { l: 20, w: 15, h: 10 }, 0.92, { l: 30, w: 22, h: 12 }),
  r('ZX-9166', 'カメラ プリンター 一体型 箱付き', 'electronics', 0.68, { l: 22, w: 16, h: 11 }, 1.06, { l: 30, w: 22, h: 12 }),
  r('ZX-9231', '携帯オーディオプレイヤー 箱付き', 'electronics', 0.44, { l: 19, w: 14, h: 8 }, 0.81, { l: 23, w: 17, h: 10 }),
  // kitchen — dense cast iron
  r('ZX-1110', '南部鉄器 急須 鉄瓶 0.3L', 'kitchen', 0.95, { l: 18, w: 16, h: 14 }, 1.41, { l: 30, w: 22, h: 12 }),
  r('ZX-1177', '鉄瓶 大 1.0L 伝統工芸', 'kitchen', 2.1, { l: 22, w: 20, h: 18 }, 2.7, { l: 35, w: 26, h: 15 }),
  // books
  r('ZX-1215', '画集 大型本 A4', 'books', 0.98, { l: 31, w: 24, h: 3 }, 1.35, { l: 35, w: 26, h: 15 }),
  r('ZX-1260', '漫画 全巻セット 10冊', 'books', 1.9, { l: 20, w: 15, h: 18 }, 2.45, { l: 30, w: 22, h: 12 }),
]

export const ALL_PRODUCTS = [HERO_PRODUCT, ...RELATED_PRODUCTS]

export const DESTINATIONS = [
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' },
] as const

export type DestinationCode = (typeof DESTINATIONS)[number]['code']
