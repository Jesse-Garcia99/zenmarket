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
  seller: 'Amazon.co.jp',
  icon: 'figure',
  battery: false,
  blurb:
    'Japan-exclusive Dragon Ball DAIMA release. Approx. 70mm, articulated, with interchangeable hands and Nyoibo staff.',
  images: ['goku.jpg'],
}

export const RELATED_PRODUCTS: Product[] = [
  {
    id: 'watch',
    asin: 'B000J34HN4',
    title: 'CASIO カシオ F-91W-1JH デジタル腕時計 日本国内モデル',
    titleEn: 'Casio F-91W digital watch (Japan domestic model)',
    category: 'watches',
    price: 3980,
    seller: 'Amazon.co.jp',
    icon: 'watch',
    battery: true,
    blurb: 'Classic digital Casio with Japanese-market packaging.',
    images: ['casio.jpg'],
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
    images: ['bandai.jpg'],
  },
  {
    id: 'plush',
    asin: 'B0H6NVXGYB',
    title: 'ちいかわ リフレッスー ハチワレ お鼻スーっと爽快MAX',
    titleEn: 'Chiikawa Refuressu menthol inhaler (Hachiware)',
    category: 'goods',
    price: 638,
    seller: 'Amazon.co.jp',
    icon: 'goods',
    battery: false,
    blurb: 'Pocket-size menthol inhaler — a tiny impulse add-on that rides free in almost any parcel.',
    images: ['chiikawa.jpg'],
  },
  {
    id: 'cards',
    asin: 'B0D2WX4CYJ',
    title: 'ポケモンカードゲーム スカーレット＆バイオレット 拡張パック 超電ブレイカー BOX',
    titleEn: 'Pokemon TCG Scarlet & Violet "Super Electric Breaker" booster box',
    category: 'cards',
    price: 5480,
    seller: 'Amazon.co.jp',
    icon: 'cards',
    battery: false,
    blurb: 'Sealed 30-pack booster box, Japanese edition.',
    images: ['pokemon.jpg'],
  },
  {
    id: 'camera',
    asin: 'B084MKHDK5',
    title: 'コダック Mini Shot 2 Retro C210R インスタントカメラ＆フォトプリンター',
    titleEn: 'Kodak Mini Shot 2 Retro instant camera + photo printer',
    category: 'electronics',
    price: 14800,
    seller: 'カメラのキタムラ',
    icon: 'camera',
    battery: true,
    blurb: '2-in-1 instant camera and photo printer.',
    images: ['kodak.jpg'],
  },
  {
    id: 'pot',
    asin: 'B0BZT4HKMW',
    title: '岩鋳 南部鉄器 鉄瓶兼用急須 5型新アラレ 0.65L 伝統工芸品',
    titleEn: 'Iwachu Nanbu tekki cast iron teapot/kettle, 0.65L',
    category: 'kitchen',
    price: 16500,
    seller: '岩鋳直営',
    icon: 'pot',
    battery: false,
    blurb: 'Handmade cast-iron teapot from Morioka. Dense and heavy.',
    images: ['teapot.jpg', 'teapot2.jpg', 'teapot3.jpg'],
  },
  {
    id: 'hoodie',
    asin: 'B0GJ8KTQPN',
    title: 'STUDIO GHIBLI トトロ パーカー 日本限定カラー Mサイズ',
    titleEn: 'Studio Ghibli Totoro hoodie, Japan-only colorway',
    category: 'apparel',
    price: 6800,
    seller: 'ジブリがいっぱい',
    icon: 'hoodie',
    battery: false,
    blurb: 'Japan-exclusive Ghibli parka. Soft, folds flat, ships light.',
  },
  {
    id: 'keyboard',
    asin: 'B0BNQK4YXR',
    title: 'HHKB Professional JP Type-S 日本語配列 白',
    titleEn: 'HHKB Professional JP Type-S keyboard, white',
    category: 'electronics',
    price: 36000,
    seller: 'PFUダイレクト',
    icon: 'keyboard',
    battery: false,
    blurb: 'The Japan-layout Topre keyboard. Boxed, dense for its size.',
    images: ['hhkb.jpg', 'hhkb2.jpg'],
  },
  {
    id: 'bookset',
    asin: '4088824482',
    title: 'ONE PIECE 第一部EP1 BOX・東の海 (ジャンプコミックス)',
    titleEn: 'One Piece Episode 1 box set "East Blue" (12 volumes)',
    category: 'books',
    price: 5280,
    seller: 'Amazon.co.jp',
    icon: 'book',
    battery: false,
    blurb: 'Twelve-volume Japanese manga box set. Heavy for its size.',
    images: ['onepiece.jpg'],
  },
  {
    id: 'nendo',
    asin: 'B0H2LDPRQV',
    title: 'ねんどろいどどーる 桜ミク ひろはこ 2025Ver.（函館）',
    titleEn: 'Nendoroid Doll Sakura Miku — Hirohako 2025 ver. (Hakodate)',
    category: 'figures',
    price: 7600,
    seller: 'グッスマ公式',
    icon: 'figure',
    battery: false,
    blurb: 'Nendoroid Doll with cloth outfit — compact box, regional exclusive.',
    images: ['miku.jpg'],
  },
  {
    id: 'amiibo',
    asin: 'B0C8YBYPJV',
    title: 'amiibo ゼルダ【ティアーズ オブ ザ キングダム】（ゼルダの伝説シリーズ）',
    titleEn: 'amiibo Zelda — Tears of the Kingdom',
    category: 'figures',
    price: 1980,
    seller: 'Nintendo公式',
    icon: 'figure',
    battery: false,
    blurb: 'Blister-packed amiibo figure — light, small parcel.',
    images: ['amiibo.jpg'],
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
      title: 'S.H.Figuarts ウルトラマンゼット オリジナル 約150mm',
      titleEn: 'S.H.Figuarts Ultraman Z Original',
      category: 'figures',
      price: 7700,
      seller: 'ほびくるオンライン',
      icon: 'figure',
      battery: false,
      blurb: '',
      images: ['metalbuild.jpg'],
    },
    measuredWeight: 0.48,
    measuredDims: { l: 19, w: 15, h: 7 },
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
  // character goods — tiny blister-packed impulse items
  r('ZX-1330', 'ちいかわ リフレッスー ブリスターパック 小物', 'goods', 0.05, { l: 15, w: 10, h: 3 }, 0.38, { l: 23, w: 17, h: 10 }),
  r('ZX-1390', 'キャラクター グッズ キーホルダー 小袋入り', 'goods', 0.08, { l: 12, w: 9, h: 4 }, 0.4, { l: 23, w: 17, h: 10 }),
  // apparel — folded garments ship flat and light
  r('ZX-3105', 'パーカー パーカ スウェット Mサイズ', 'apparel', 0.58, { l: 30, w: 25, h: 5 }, 0.92, { l: 35, w: 26, h: 15 }),
  r('ZX-3162', 'Tシャツ 2枚セット 限定カラー', 'apparel', 0.36, { l: 28, w: 23, h: 4 }, 0.68, { l: 30, w: 22, h: 12 }),
  r('ZX-3211', 'ジブリ パーカー フーディ 日本限定', 'apparel', 0.62, { l: 31, w: 26, h: 6 }, 0.97, { l: 35, w: 26, h: 15 }),
  // more figures for denser neighbor coverage
  r('ZX-4601', 'ねんどろいど 初音ミク フィギュア 箱入り', 'figures', 0.36, { l: 18, w: 13, h: 9 }, 0.7, { l: 23, w: 17, h: 10 }),
  r('ZX-4655', 'amiibo フィギュア ブリスターパック 2個', 'figures', 0.22, { l: 16, w: 12, h: 8 }, 0.55, { l: 23, w: 17, h: 10 }),
  r('ZX-9302', 'キーボード HHKB 箱付き 日本語配列', 'electronics', 1.55, { l: 33, w: 15, h: 6 }, 1.98, { l: 40, w: 30, h: 20 }),
]

export const ALL_PRODUCTS = [HERO_PRODUCT, ...RELATED_PRODUCTS]

export const DESTINATIONS = [
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' },
] as const

export type DestinationCode = (typeof DESTINATIONS)[number]['code']
