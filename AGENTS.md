# AGENTS.md

- Dashboard tools are grouped into three centers (Human, Collaborative, Agentic) defined in `src/components/dashboard/navigationClusters.ts`; each tool is defined once in `toolRegistry` with a home center and may be listed in sections of several centers; add new tools there and register their view in `DashboardTabs` — keeps navigation in one place for open-source contributors.
- Every agent action must pass `safetyStore.check()` from `src/lib/safety/` before executing; core rules live in code (`guardrails.ts`, covered by `guardrails.test.ts`) and may only be extended, never weakened — guarantees the same baseline safety for every fork (see SAFETY.md).
- World View reads public USGS and NASA feeds directly, caches only public event data, and uses Leaflet with attributed OpenStreetMap tiles; external weather stays in the provider's embed — keeps provenance visible without inventing observations.
- Official brand colors and gradients are semantic CSS tokens shared by navigation and buttons — keeps the uploaded logo's identity consistent across themes.
- The app is offline-first: data and media save on the device (`src/lib/offline/`), online storage is opt-in and every online failure falls back to local — the owner runs it non-profit and must never be blocked by paid service limits.
