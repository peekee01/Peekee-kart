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

1. `game.js`, near the end: `const VERSION = 'v9.12'; // PEEKEE_VERSION=v9.12` — both halves.
2. `index.html`, in `<head>`: `<!-- PEEKEE_VERSION=v9.12 -->`
3. `index.html`, the two `?v=9.12` query strings on the `style.css` and `game.js` links.

Why the HTML comment matters: a few seconds after loading, the game re-fetches
`index.html` with `cache: 'no-store'` and looks for the `PEEKEE_VERSION=` marker. If it
finds a version different from the one baked into `game.js`, it force-reloads once —
that's the automatic stale-cache rescue. The marker has to live in the HTML, because
that's the only file the check can see.

Current version: **v9.12**.

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

- the title screen's footer reads `Peekee Kart v9.12` (or whatever the new version is)
- the browser console has **no errors** (SwiftShader "GPU stall due to ReadPixels"
  warnings are just software rendering — ignore them)
- pressing Enter four times starts a race on Sunny Isle
- every circuit can still be driven to the finish (the scratch folder's `drive-all.mjs`)
- then `window.__auto = true; window.__advance(120)` and `window.__state()` reports
  `finished: true` (75 was enough before the v9.11 circuits; they are more technical, so
  an auto-driven lap takes longer and 75 became marginal)

**Test the phone layout, every time.** Twice now a change has looked fine on a desktop
viewport and been broken on a phone. Emulate it: Playwright context with
`viewport: {width: 844, height: 390}, isMobile: true, hasTouch: true` (iPhone landscape -
`hasTouch` is what makes the `pointer: coarse` CSS rules apply), then screenshot the
title, racer, garage and circuit screens and LOOK at them. The two failure modes so far:
the pinned top-right button row wrapping onto a second line and covering the screen
below it, and content sized for a desktop swamping a 390px-tall screen.

Take a screenshot too. The version check alone will still pass if `style.css` failed to
load, so look at the picture: HUD panels, minimap and speed box should be styled.

### Test hooks

Built into `game.js`, harmless during normal play:

- `window.__auto = true` — hands the player's kart to the AI, so a race can run unattended
- `window.__advance(sec)` — simulates `sec` seconds of racing instantly, no rendering
- `window.__state()` — returns `{ mode, rain, lap, v, z, air, rank, idx, finished, jumps, hazards, gp }`

## The three layers on top of the 3D view

Order matters, and getting it wrong produces a black screen:

- `#glow` — **additive** (`mix-blend-mode: screen`). Bloom and sun glare go here. The
  first attempt drew bloom on `#fx`, which is alpha-composited over the 3D view, so a
  strong bloom painted a dark copy of the scene *over* the scene and nearly everything
  vanished. Anything meant to *add light* belongs on this layer.
- `#fx` — normal alpha. Colour grade, boost tint, damage flash.
- `#vignette` — a static CSS gradient, so it applies on menus too. `postFX` used to draw
  its own vignette as well; that was doubling the corner falloff and has been removed.

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

## Roadmap — agreed plan, in build order

Work these in order. Each one is its own commit, its own version bump, and its own
push, so any single one can be reverted without losing the others.

1. ~~**Per-track leaderboard on the title screen**~~ — **shipped in v9.4.**
   The data already existed. `pk_best_<track>` in localStorage holds
   `{ time, rec, ch, model, paint }` per circuit and already drives the ghost kart.
   Today that best time is only visible in the small `#lapTimes` HUD corner during a
   race. This is mostly a layout job — no new game logic.
2. ~~**Progression and unlocks**~~ — **shipped in v9.5.** Summit Cup unlocked by an
   Island Cup podium; extra paints unlocked by playing. Cup standings and points already work (`startGP`,
   `GP_POINTS`, `S.gp.points`); follow the existing save pattern with a `pk_progress`
   key. Unlock generously for players who already have progress — never take away
   access someone already had. Add a **reset progress** button to Settings at the same
   time, so a clean slate is testable.
3. ~~**Weather**~~ — **shipped in v9.6.** Rain falls on some circuits (chance per
   circuit via `rainChance`; none on the snow, volcano or cavern tracks). It greys
   the sky, pulls the fog in, dims the sun, darkens and glosses the road, and cuts
   grip by 13%. A Weather checkbox in Settings turns it off. `window.__state()`
   now reports `rain` so tests can see it.
   **Still needs a human verdict on how the wet handling feels** — 13% was chosen
   to be noticeable but not slippery, and only driving it can confirm that.
4. ~~**More circuits, and more variety**~~ — **four added in v9.7**, and the original
   eight redesigned in v9.11. Twelve circuits, three cups, all measurably different.
5. ~~**Better character portraits**~~ — **shipped in v9.8.** Drawn in a 120-unit space and scaled to a 320px canvas, with a racer-tinted backing plate (without it the near-navy helmets vanished into the card).
6. ~~**Visual and graphics polish pass**~~ — **shipped in v9.9.** Sharper, softer
   shadows (3072 map, radius 2.2), noticeably smoother kart geometry, a corner
   vignette, and a dithered sky to kill gradient banding.
   **Tried and reverted: environment reflections.** Baking the procedural sky into
   `scene.environment` is the textbook way to modernise this look, and it did give
   the karts real reflections - but it floods every standard material with ambient
   light and washed the colours out badly. Three attempts at rebalancing (cutting the
   sky light, then `envMapIntensity` down to 0.32) still looked flatter than what we
   already had, and it cost about 25% of the frame time. Backed out completely. If
   it is worth retrying, do it per-material - reflections on the karts and glossy
   props only, never on grass and road.

**Deferred:** gamepad support. It was considered and consciously left out of this
round; revisit later.

## Circuit design

Twelve circuits in three cups of four (`Math.floor(i / 4)` is the cup). A circuit is one
entry in `TRACKS`: control points `[x, y, height]` in a 2400x2400 world, plus colours,
sky, scenery and music.

**Do not hand-place control points.** Three separate attempts produced circuits that
crossed themselves or had corners nothing could drive. Use the tools in the scratch
folder instead:

- `ring.mjs` — `buildRing(polygon, radiiPerCorner)` builds the control points. Design a
  circuit as a polygon with a radius at each corner: small radius = a corner you brake
  for, large = one you carry speed through. Heights are per corner and ramp smoothly
  between them.
- `validate.mjs` — self-intersection, closest approach between two parts of the lap,
  tightest radius, world bounds, gradient.
- `profile.mjs` — longest straight, % of lap in corners, % in tight corners, direction
  changes. This is how you check a new circuit is actually *different*.
- `redesign2.mjs` — the current designs, and the pattern to copy.

Three traps, all of which cost real time:

1. **Every circuit must be a simple ring.** A serpentine (three or more legs folded back
   and forth) cannot close without crossing itself — the closing leg always cuts through
   an earlier fold. Put features on the ring's edges instead of folding it.
2. **Control points must be evenly spaced.** The game's spline is uniform Catmull-Rom,
   which overshoots wherever spacing changes sharply. Arc points 40 apart next to
   straight points 260 apart produced radius-3 spikes that read as invisible walls.
   `buildRing` resamples the whole lap at a constant ~55 units to avoid this.
3. **Two fillets sharing a short edge must not overlap**, or the "straight" between them
   runs backwards and the spline folds. `buildRing` shrinks both radii until they fit.

Thresholds calibrated against shipped circuits: tightest radius >= 58, two parts of the
lap no closer than ~170, gradient <= 0.42.

Measured character of the current roster — aim a new circuit somewhere not already taken:

| circuit | longest straight | % corner | % tight | direction changes |
| --- | --- | --- | --- | --- |
| Sunny Isle | 1082 | 23 | 3 | 28 |
| Ember Ridge | 681 | 23 | 3 | 24 |
| Frostbite Pass | 1247 | 15 | 1 | 17 |
| Neon Harbor | 1328 | 17 | 2 | 24 |
| Canyon Run | 1353 | 24 | 3 | 13 |
| Mossy Hollow | 265 | 41 | 1 | 11 |
| Sky Garden | 815 | 24 | 3 | 18 |
| Crystal Caves | 972 | 23 | 5 | 17 |
| Salt Flats | 3129 | 10 | 0 | 4 |
| Old Town | 1660 | 20 | 4 | 6 |
| Thunder Bay | 1420 | 33 | 5 | 14 |
| Emerald Terraces | 2129 | 22 | 3 | 4 |

For reference, before the v9.11 redesign the original eight all sat between 11-18%
corner, 1-2% tight and 4-6 direction changes — which is exactly why they felt the same.

**Lap records and layout changes.** Best laps are stored per circuit under
`pk_best2_<i>`. If a circuit's layout ever changes again, bump that key prefix, or the
board will show times nobody can match on a track that no longer exists.

## Working style

The owner is not a programmer. Explain changes in plain language, and never push
something that hasn't been loaded in a browser and driven to the finish first.
