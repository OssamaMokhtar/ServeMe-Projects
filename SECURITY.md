# Security

**Status:** Earliest-stage prototype — not production hardened.

## Architecture Security Model

This is an interaction prototype (QR → see items → select yours → pay). The payment provider integration is not built.

When payment integration is added:
- Use Stripe Elements or similar hosted payment fields — no card data touches your servers.
- PCI DSS compliance is required for any payment integration.
- The restaurant-side bill creation flow needs authentication and access control.

## Data Classification

| Data Type | Classification | Notes |
|-----------|---------------|-------|
| Bill data (table, items, prices) | Internal (business) | Restaurant bill content |
| Diner selections | Internal | Per-diner item selection |
| Payment data | Highly sensitive (PCI DSS) | Not yet integrated — critical path |

## Known Security Gaps

| Gap | Severity | Roadmap |
|-----|----------|---------|
| No payment integration — critical path not built | Critical | Build Stripe integration with PCI-compliant hosted fields |
| No authentication for restaurant-side flow | High | Add auth before restaurant flow |
| No dependency vulnerability scanning | Medium | CI (this PR) |
| QR code infrastructure unspecified | Medium | Document QR generation and scanning |

## Reporting a Vulnerability

Contact the maintainer directly. Do not open a public issue for security vulnerabilities.

---

*See [Improvement Plan — ServeMe](../../Obsidian/Portfolio-Due-Diligence/09-Improvement-Plan-ServeMe.md) for the full security hardening roadmap.*
