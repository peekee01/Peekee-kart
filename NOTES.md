# Peekee Kart — handover notes

An original 3D kart racer built with three.js r128. No Nintendo assets, code or names:
every character, circuit, item and sound is our own. Keep it that way.

Live at **https://peekee01.github.io/Peekee-kart/** — GitHub Pages serves the `main`
branch, root folder. Pushing to `main` deploys; there is no build step.

## File layout

| File | What's in it |
| --- | --- |
| `index.html` | Page markup only — the HUD, the menu screens, the script/style tags. No game logic. |
| `style.css` | Every style: HUD, menus, touch controls, the phone/short-screen layout rules. |
| `game.js` | The whole game: track generation, kart physics, AI, items, audio, rendering. |
| `NOTES.md` | This file. |

`index.html` loads three.js from cdnjs with a jsdelivr fallback, then `game.js` last.
Both `<link>`/`<script>` tags carry a `?v=` query string so browsers don't serve a
stale copy after a release.

## The version-bump rule (do this on every release)

Three places must agree, or players get a stale mix of old and new files:

1. `game.js`, near the end: `const VERSION = 'v9.3'; // PEEKEE_VERSION=v9.3` — both halves.
2. `index.html`, in `<head>`: `<!-- PEEKEE_VERSION=v9.3 -->`
3. `index.html`, the two `?v=9.3` query strings on the `style.css` and `game.js` links.

Why the HTML comment matters: a few seconds after loading, the game re-fetches
`index.html` with `cache: 'no-store'` and looks for the `PEEKEE_VERSION=` marker. If it
finds a version different from the one baked into `game.js`, it force-reloads once —
that's the automatic stale-cache rescue. The marker has to live in the HTML, because
that's the only file the check can see.

Current version: **v9.3**.

## Testing recipe

The CDN is often blocked in a sandbox, so vendor three.js and stub the fonts:

```bash
node --check game.js                 # syntax check, catches typos instantly
npm install three@0.128.0 playwright # in a scratch folder, not the repo
```

Then serve the repo folder over plain HTTP and load it in headless Chromium with
`--use-gl=swiftshader --enable-unsafe-swiftshader`, routing:

- any request for `three.min.js` → `node_modules/three/build/three.min.js`
- `fonts.googleapis.com` / `fonts.gstatic.com` → an empty stubbed response

A release is good when all of this holds:

- the title screen's footer reads `Peekee Kart v9.3` (or whatever the new version is)
- the browser console has **no errors** (SwiftShader "GPU stall due to ReadPixels"
  warnings are just software rendering — ignore them)
- pressing Enter four times starts a race on Sunny Isle
- then `window.__auto = true; window.__advance(75)` and `window.__state()` reports
  `finished: true`

Take a screenshot too. The version check alone will still pass if `style.css` failed to
load, so look at the picture: HUD panels, minimap and speed box should be styled.

### Test hooks

Built into `game.js`, harmless during normal play:

- `window.__auto = true` — hands the player's kart to the AI, so a race can run unattended
- `window.__advance(sec)` — simulates `sec` seconds of racing instantly, no rendering
- `window.__state()` — returns `{ mode, lap, v, z, air, rank, idx, finished, jumps, hazards, gp }`

## What this game is trying to be

- **Modern look — "Xbox, not SNES."** Smooth lofted geometry, soft shadows, real
  lighting. Never let it drift toward pixel art or flat retro styling.
- **Smooth karts.** Rounded, cleanly shaded bodies; no blocky low-poly look.
- **Calm music, quiet engine.** The soundtrack stays relaxed and the engine sits low in
  the mix. If a change makes it louder or busier, that's a regression.
- **Drift is a controlled slide with a turbo on release.** Hold the drift button while
  steering, the kart slides in a controlled way, let go for a boost. It should feel
  deliberate, not like losing grip.
- **Mobile means iPhone Safari in landscape.** Analog stick bottom-left, DRIFT and ITEM
  buttons on the right. On menu screens the buttons stay pinned top-right so they're
  reachable and never scroll away.
- **Out of scope:** no two-player mode, no time-trial mode.

## Roadmap (in priority order)

1. **Progression and unlocks** — Summit Cup unlocked by a podium finish in the Island
   Cup; extra paint colours unlocked by playing.
2. **Gamepad support** — standard controller mapping.
3. **Weather** — rain, and how it affects grip and look.
4. **More circuits** — beyond the current eight.
5. **Better character portraits** — the roster art on the character-select screen.
6. **Per-track leaderboard on the title screen** — best times per circuit.

## Working style

The owner is not a programmer. Explain changes in plain language, and never push
something that hasn't been loaded in a browser and driven to the finish first.
