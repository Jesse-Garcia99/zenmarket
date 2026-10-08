# ZenMatch — predictive shipping & shopping intelligence

A working prototype of a predictive shipping feature for a ZenMarket-style
proxy-shopping product page. It answers two questions without asking the
customer for a parcel weight:

1. **What will this item cost to ship internationally?** — predicted from
   historical shipments before the item is even bought.
2. **What would it cost to add it to a parcel I already have in storage?** —
   consolidation math, live, as warehouse contents change.

**Live demo:** https://jesse-garcia99.github.io/zenmarket/ (simulated data)

**Feature proposal:** [docs/Zen_Market_New_Feature_Proposal.ipynb](docs/Zen_Market_New_Feature_Proposal.ipynb) —
the full proposal this prototype implements (problem, data requirements,
prediction + pricing methodology, recommendation scoring, evaluation plan,
risks). Also on [Google Colab](https://colab.research.google.com/drive/1K9vTPsouMmDl92HV76xDcVfS5aQ7iXEf)
(link requires the document to be shared publicly).

## What you're looking at

A browseable catalog + product pages — a deliberate facsimile of ZenMarket's
listing and `product.aspx?shop=amazon` layouts, with real product photography
vendored under `public/products/` — and the ZenMatch layer integrated:

- **Sticky ZenMatch banner** with three states: standalone estimate when the
  warehouse is empty, incremental cost + savings when items are in storage,
  and an honest warning when consolidation isn't cheaper.
- **Shipping estimate panel** on the product itself: predicted weight range,
  packed size, shipping-method picker (EMS / Air / Surface), and the
  separate-vs-consolidated comparison.
- **"How this is predicted"** — the exact historical shipments (neighbors)
  behind the estimate, with similarity scores. Every number is traceable.
- **Warehouse drawer** — stored items carry *measured* arrival weights
  (matching how ZenMarket actually works: items are weighed on arrival, final
  parcel measured after packing), plus an items total kept visually separate
  from the shipping quote. Remove items to see the banner respond.
- **Related items** with live incremental-shipping chips — light items
  genuinely "ride free" when they don't push the parcel into the next rate
  band.

Product photos are the real listings' images (Amazon associate endpoint and
manufacturer pages), vendored so the demo works offline; prices, weights, and
history remain simulated.

## How the engine works

Two layers, kept deliberately separate — prediction is probabilistic, pricing
is deterministic business logic:

```
listing (title, category, price)
        │
  predict.ts                    ← k-NN over historical shipments
        │                          (production: LightGBM / ML.NET)
        ▼
weight range p10/p50/p90 + as-sold dims + neighbors + confidence
        │
  pricing.ts                    ← packing model + carrier rate bands
        │                          (production: live carrier APIs)
        ▼
quotes per method → Incremental = C(A+B) − C(A)
                    Savings     = C(A) + C(B) − C(A+B)
```

| File | Role |
|---|---|
| `src/engine/types.ts` | Domain model (would map to EF Core entities) |
| `src/engine/data.ts` | Product catalog, warehouse seed, 25-record synthetic shipment history |
| `src/engine/predict.ts` | k-NN predictor: token + category similarity → weighted p10/p50/p90 weight, median dims, confidence from neighbor dispersion |
| `src/engine/pricing.ts` | Packing model (carton selection, dunnage, combine factor), carrier rate bands + eligibility rules, `compare()` evaluated at p10/p50/p90 for honest ranges |

Why k-NN in the demo: it's the same interface a trained model would serve —
features in, weight/dimension distribution + confidence out — but fully
inspectable. Nothing here needs a server; the whole thing runs client-side
from static files.

## Production mapping

The interview-facing architecture this prototype compresses:

| Demo | Production |
|---|---|
| `predict.ts` k-NN in TypeScript | Python + LightGBM (or ML.NET) training service, FastAPI inference |
| `HISTORY` array | SQL Server: parcels, measured item weights, packed dimensions, actual charges |
| `pricing.ts` rate bands | Carrier rate APIs + restriction rules |
| React state | ASP.NET Core REST API, Redis cache, Hangfire re-estimation jobs |

Historical shipping *charges* validate the model but never set prices —
the pricing layer applies current carrier rates to predicted measurements.

## Run it

```bash
npm install
npm run dev      # local dev
npm run build    # type-check + production build to dist/
```

## Deploy

GitHub Actions (`.github/workflows/pages.yml`) builds and deploys `dist/` to
GitHub Pages on every push to `main`. The site is served from the `/zenmarket/`
path, set via `base` in `vite.config.ts`.
