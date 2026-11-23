# Offline-first, free by default

## Goal
The app works fully on your own device without any paid online service. Online features stay available as an optional extra, so hitting a limit never blocks you.

## What changes
1. **Your data lives on your device first.** Notes, decks, checklists, safety log, settings and uploaded media are saved in the browser's own storage, which has no limits or costs.
2. **No login needed for offline use.** A "Local mode" is the default; signing in becomes optional.
3. **Online is optional.** If the online service is reachable and you're signed in, the app can sync. If it's unreachable or at its limit, the app keeps working and shows a small "offline" badge instead of errors.
4. **Backup without a server.** One button exports everything to a file on your computer; another imports it back. This also lets you move to a new device for free.
5. **Install as an app.** The published app can be added to your home screen and opened without internet.

## What you won't need
- No paid plan and no new account. Building with me still uses Lovable credits as usual; the app itself costs nothing to run offline.

## Later, if you want
- Switching the optional online part to Lovable Cloud (20 free credits per month) or a fresh free external account. Not needed for offline use.

## Technical details
- Add a storage layer (IndexedDB via `idb-keyval`/`localforage`) with a `dataStore` interface; online sync becomes an adapter used only when available.
- Wrap backend calls so failures (quota, network, 402/429) fall back to local data.
- Make auth optional; local mode as default.
- JSON export/import of all local stores.
- Offline install via `vite-plugin-pwa` (guarded registration, never in preview).
- Record the offline-first rule in AGENTS.md and add tests for the fallback.
