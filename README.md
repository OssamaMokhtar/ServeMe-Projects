# ServeMe — Split-by-Item Restaurant Checkout

> Scan a QR code, tap the items you ordered, pay your share. No maths, no passing one card around a table of eight.

`TypeScript` · `React` · `Vite`

<img src="docs/screenshot.png" alt="ServeMe split check" width="380">

*Three items selected, $34.00 owed - each diner settles only what they ordered.*

---

## The problem

Splitting a restaurant bill is a solved problem socially and an unsolved one operationally. Evenly-split payment apps get it wrong when one person had a starter and tap water; asking a server to split a bill eight ways by item takes longer than the meal's last course.

ServeMe puts the split on the diner's phone: the table's bill loads from a QR code, each person selects their own items, and everyone pays their own total.

## What it does

- QR-linked table bill
- Per-item selection per diner
- Independent settlement — no single payer fronting the total

## Run locally

**Prerequisites:** Node.js 18+

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Status

**Earliest-stage prototype in this portfolio** — ~440 lines. The interaction model is built; payment provider integration is not.

## License

MIT

---

## Status

**Earliest-stage prototype.** The interaction model is built: QR → see items → select yours → pay. The following are not yet built:

- **Payment provider integration** — the critical path. Without it, the product doesn't function.
- **Restaurant-side bill creation flow** — how does the QR code get generated? How does the table bill get loaded? Who creates the bill?
- **QR code infrastructure** — QR generation, display, scanning.

### Decision Required: Archive or Commit?

See the improvement plan for two paths:

**Path A (recommended): Archive** — The interaction model is built; the lesson is learned. The portfolio is stronger without a 440-line non-AI outlier. The time and attention is better spent on PolySync, RiskLens, or CareerOracle.

**Path B: Commit to completion** — Build payment integration (Stripe), restaurant-side flow, PCI compliance, and find a defensible niche (GCC restaurants, Arabic support, specific POS integration). 6–8 weeks of significant integration work to reach a functioning product, then competing in a crowded market.

### Current Status

- Interaction prototype: ~440 lines
- No AI component (pure CRUD + payments — misaligned with AI-native portfolio thesis)
- No payment integration (critical path not built)
- No restaurant-side flow
- No real users
- No revenue

---

*Built by [Ossama Mokhtar](https://github.com/OssamaMokhtar) — AI Product Manager, Dubai.*
