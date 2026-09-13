(() => {
'use strict';
// ═══════════════════════ constants & data ═══════════════════════
const WORLD = 2400, MW = 2048, MAPS = MW / WORLD, ROADW = 72, LAPS = 3, GP_POINTS = [10, 8, 6, 5, 4, 3], GRAV = 420;
const CHARS = [
  { name: 'Pip',   kind: 'Fox',    body: '#FF7A1F', helmet: '#FFD23F', accent: '#FFFFFF', suit: '#B8321F', speed: 1.00, accel: 1.00, handling: 1.05, st: 'Balanced' },
  { name: 'Ziggy', kind: 'Robot',  body: '#8FD3FF', helmet: '#DDE9FF', accent: '#2A2F5C', suit: '#3F6FD8', speed: 1.06, accel: 0.92, handling: 0.95, st: 'Top speed' },
  { name: 'Mango', kind: 'Monkey', body: '#FFD23F', helmet: '#8B4A1E', accent: '#FF5A5F', suit: '#2EAA6A', speed: 0.96, accel: 1.10, handling: 1.00, st: 'Quick start' },
  { name: 'Bruno', kind: 'Bear',   body: '#6B3F26', helmet: '#2A2F5C', accent: '#FFD23F', suit: '#8B4A1E', speed: 1.08, accel: 0.86, handling: 0.90, st: 'Heavy' },
  { name: 'Luna',  kind: 'Cat',    body: '#B48CFF', helmet: '#FFFFFF', accent: '#2EE6A6', suit: '#6A3FB8', speed: 0.97, accel: 1.04, handling: 1.12, st: 'Drifter' },
  { name: 'Rex',   kind: 'Dino',   body: '#2EE6A6', helmet: '#1B1F3B', accent: '#FF7A1F', suit: '#157A57', speed: 1.03, accel: 0.98, handling: 0.97, st: 'All-round' },
];
const ITEMS = { nitro: { name: 'Nitro' }, banana: { name: 'Banana Peel' }, rocket: { name: 'Homing Rocket' }, ball: { name: 'Bowling Ball' }, storm: { name: 'Thunderstorm' }, surge: { name: 'Shield Surge' }, comet: { name: 'Leader Comet' } };
const ORD = n => n + (['th','st','nd','rd'][((n % 100) > 10 && (n % 100) < 14) ? 0 : (n % 10 < 4 ? n % 10 : 0)]);

// circuits: control points are [x, y, height]. Heights give hills, crests and jumps.
const TRACKS = [
  { name: 'Sunny Isle', shortcut: [7, 9], sub: 'Beach · easy', ctrl: [[300,1300,0],[400,700,12],[800,350,28],[1400,300,34],[1900,500,16],[2050,900,0],[1750,1150,22],[1350,1050,40],[1100,1300,46],[1300,1650,22],[1750,1750,0],[2000,2050,12],[1600,2200,32],[1000,2100,22],[500,1900,6],[300,1600,0]],
    ground: '#4CAF50', mottle: ['#43A047', '#58BC5C'], dots: ['#FFD23F', '#FF5A5F', '#FFFFFF'], road: '#5A5F6A', road2: '#62676F', curb: ['#E8E4D8', '#E0392B'], dash: '#D7D2C4',
    skyTop: [0x4F, 0x9F, 0xE0], skyBot: [0xC8, 0xF0, 0xFF], hills: ['#7FC38D', '#5FA874'], fog: '200,232,250', sun: '#FFF3A8', sunI: 1.5, hemi: ['#BFE3FF', '#3E8A3E'], hillAmp: 90,
    scenery: ['palm', 'palm', 'palm', 'rock', 'bush', 'flag'], arch: '#E0392B', music: { bpm: 100, root: 0, mode: 'major' },
    patches: c => { c.fillStyle = '#F2D386'; c.beginPath(); c.moveTo(WORLD, 0); c.lineTo(WORLD, 700); c.quadraticCurveTo(2150, 300, 1700, 0); c.fill(); c.fillStyle = '#3FB8E8'; c.beginPath(); c.moveTo(WORLD, 0); c.lineTo(WORLD, 420); c.quadraticCurveTo(2250, 200, 1950, 0); c.fill();
      c.fillStyle = '#F2D386'; c.beginPath(); c.ellipse(1450, 1420, 150, 100, 0.3, 0, 7); c.fill(); c.fillStyle = '#3FB8E8'; c.beginPath(); c.ellipse(1450, 1420, 120, 75, 0.3, 0, 7); c.fill(); } },
  { name: 'Ember Ridge', shortcut: [6, 8], sub: 'Volcano · medium', ctrl: [[300,500,0],[700,250,30],[1300,300,70],[1800,250,95],[2100,600,60],[1900,1000,20],[1400,900,0],[1100,1150,45],[1400,1500,90],[1900,1500,110],[2100,1900,60],[1700,2150,30],[1100,2100,0],[700,1800,25],[800,1400,55],[500,1100,30],[250,800,10]],
    ground: '#4A3A38', mottle: ['#3E302E', '#574543'], dots: ['#FF7A1F', '#FFD23F'], road: '#3A3438', road2: '#423B40', curb: ['#F2D386', '#1B1F3B'], dash: '#8C8078',
    skyTop: [0x3A, 0x12, 0x2A], skyBot: [0xFF, 0x8A, 0x4A], hills: ['#5A2A2A', '#3A1A1A'], fog: '230,120,70', sun: '#FF5A3A', sunI: 1.2, hemi: ['#FF9A6A', '#3A2A2A'], hillAmp: 160,
    scenery: ['deadtree', 'rock', 'rock', 'geyser', 'flag', 'deadtree'], arch: '#F2D386', music: { bpm: 110, root: 2, mode: 'minor' },
    patches: c => { for (const [x, y, r] of [[1600, 1200, 170], [600, 2050, 140], [2000, 300, 110], [300, 1500, 120]]) { c.fillStyle = '#FF6A1F'; c.beginPath(); c.ellipse(x, y, r, r * 0.65, 0.4, 0, 7); c.fill(); c.fillStyle = '#FFD23F'; c.beginPath(); c.ellipse(x, y, r * 0.6, r * 0.35, 0.4, 0, 7); c.fill(); } } },
  { name: 'Frostbite Pass', shortcut: [5, 7], sub: 'Snow · medium', ctrl: [[400,300,0],[1200,250,20],[2000,350,55],[2150,800,75],[1800,1100,40],[1300,1000,10],[900,1250,30],[1200,1550,65],[1700,1450,50],[2100,1700,20],[1900,2150,0],[1300,2200,15],[700,2100,45],[350,1800,60],[500,1400,35],[300,900,10]],
    ground: '#E9F1F8', mottle: ['#DCE8F2', '#F6FAFD'], dots: ['#FFFFFF', '#BFE3F5'], road: '#6E7480', road2: '#767C88', curb: ['#FFFFFF', '#2E6FD8'], dash: '#C9D2DC',
    skyTop: [0x4A, 0x7C, 0xC0], skyBot: [0xD8, 0xEC, 0xFF], hills: ['#C8D8E8', '#A8BCD0'], fog: '210,228,245', sun: '#FFFFFF', sunI: 1.3, hemi: ['#DDEEFF', '#8898A8'], hillAmp: 140,
    scenery: ['pine', 'pine', 'pine', 'rock', 'snowman', 'flag'], arch: '#2E6FD8', music: { bpm: 94, root: 7, mode: 'major' },
    patches: c => { for (const [x, y, r] of [[1500, 1250, 190], [700, 700, 150], [1900, 1950, 120]]) { c.fillStyle = '#9CCCE8'; c.beginPath(); c.ellipse(x, y, r, r * 0.6, -0.3, 0, 7); c.fill(); c.fillStyle = '#BFE3F5'; c.beginPath(); c.ellipse(x, y, r * 0.85, r * 0.5, -0.3, 0, 7); c.fill(); } } },
  { name: 'Neon Harbor', shortcut: [7, 9], sub: 'Night city · hard', ctrl: [[300,600,0],[600,300,0],[1200,350,30],[1500,650,45],[1200,900,20],[800,850,0],[500,1100,0],[700,1500,25],[1200,1400,42],[1600,1150,18],[2050,1300,0],[2100,1800,20],[1800,2150,38],[1200,2100,12],[800,2200,0],[400,1900,0],[250,1300,0]],
    ground: '#1E2030', mottle: ['#1A1C2A', '#24263A'], dots: ['#2EE6A6', '#FF3FA4', '#FFD23F'], road: '#2C2E40', road2: '#33354A', curb: ['#2EE6A6', '#FF3FA4'], dash: '#FFD23F',
    skyTop: [0x06, 0x08, 0x1C], skyBot: [0x3A, 0x1E, 0x5C], hills: ['#14162A', '#1E2040'], fog: '40,24,70', sun: '#F4F0FF', sunI: 0.35, hemi: ['#4A3A80', '#101020'], hillAmp: 40, night: true,
    scenery: ['tower', 'tower', 'tower', 'lamp', 'billboard', 'lamp'], arch: '#FF3FA4', music: { bpm: 104, root: 9, mode: 'minor' },
    patches: c => { c.fillStyle = '#123A5C'; c.fillRect(0, 0, 2400, 160); c.fillRect(2240, 0, 160, 2400); c.fillStyle = '#1B4E78'; for (let i = 0; i < 60; i++) c.fillRect(Math.random() * 2400, Math.random() * 150, 40, 3); } },
  { name: 'Canyon Run', shortcut: [6, 8], sub: 'Desert · medium', ctrl: [[350,400,0],[900,250,20],[1500,300,60],[2050,450,90],[2100,1000,125],[1750,1250,80],[1350,1150,40],[1000,1400,20],[1150,1800,60],[1650,1750,105],[2000,2000,70],[1750,2250,30],[1150,2200,0],[600,2050,10],[350,1600,30],[250,1000,10]],
    ground: '#D9A860', mottle: ['#C9945A', '#E6B872'], dots: ['#8B4A1E', '#F2D386'], road: '#6E6A62', road2: '#78746B', curb: ['#F2E6C8', '#B8321F'], dash: '#E8E0C8',
    skyTop: [0x3A, 0x8C, 0xE0], skyBot: [0xFF, 0xE0, 0xB0], hills: ['#B8643A', '#8A4A2A'], fog: '250,220,170', sun: '#FFF8D0', sunI: 1.7, hemi: ['#FFE8C0', '#8A5A30'], hillAmp: 180,
    scenery: ['cactus', 'cactus', 'rock', 'mesa', 'deadtree', 'flag'], arch: '#B8321F', music: { bpm: 104, root: 4, mode: 'major' },
    patches: c => { c.fillStyle = '#B86A3A'; for (const [x, y, r] of [[500, 2100, 220], [2100, 300, 260], [1400, 1500, 140]]) { c.beginPath(); c.ellipse(x, y, r, r * 0.7, 0.5, 0, 7); c.fill(); } } },
  { name: 'Mossy Hollow', shortcut: [5, 7], sub: 'Forest · medium', ctrl: [[300,700,0],[700,300,10],[1300,250,25],[1700,500,45],[1500,850,60],[1100,800,40],[800,1050,20],[1000,1400,30],[1500,1300,55],[2000,1400,70],[2150,1900,40],[1700,2200,20],[1100,2100,0],[600,1900,15],[400,1400,30],[250,1050,10]],
    ground: '#2F6B3A', mottle: ['#27592F', '#3B7D45'], dots: ['#8FD37F', '#FFD23F', '#FF7A1F'], road: '#5A4A3A', road2: '#645342', curb: ['#C8B890', '#3A2A1A'], dash: '#A89878',
    skyTop: [0x5A, 0x9A, 0xC8], skyBot: [0xC8, 0xE8, 0xC0], hills: ['#3E7A48', '#2A5A34'], fog: '170,210,170', sun: '#FFF4C8', sunI: 1.1, hemi: ['#BFE8B0', '#1E3A22'], hillAmp: 110,
    scenery: ['bigtree', 'bigtree', 'bush', 'mushroom', 'rock', 'bigtree'], arch: '#8FD37F', music: { bpm: 96, root: 5, mode: 'minor' },
    patches: c => { c.fillStyle = '#4A7A9A'; for (const [x, y, r] of [[1750, 800, 150], [700, 1700, 120]]) { c.beginPath(); c.ellipse(x, y, r, r * 0.6, 0.2, 0, 7); c.fill(); } } },
  { name: 'Sky Garden', shortcut: [6, 8], sub: 'Clouds · hard', ctrl: [[400,400,0],[1000,300,30],[1600,350,70],[2100,600,110],[2000,1100,150],[1500,1200,120],[1100,1000,90],[700,1150,60],[600,1600,40],[1000,1900,20],[1500,1700,60],[2000,1900,100],[2100,2250,60],[1500,2300,20],[800,2250,0],[350,1900,0],[300,1000,0]],
    ground: '#7ED66F', mottle: ['#6CC45F', '#8FE07F'], dots: ['#FF8FC8', '#FFFFFF', '#FFD23F'], road: '#D8D2C8', road2: '#E2DCD2', curb: ['#FFFFFF', '#FF8FC8'], dash: '#B8B0A8',
    skyTop: [0x7A, 0xB8, 0xFF], skyBot: [0xFF, 0xF0, 0xF8], hills: ['#E8F0FF', '#C8D8F0'], fog: '240,240,255', sun: '#FFFFFF', sunI: 1.6, hemi: ['#FFF0F8', '#5A9A50'], hillAmp: 220,
    scenery: ['cherry', 'cherry', 'lantern', 'bush', 'flag', 'cherry'], arch: '#FF8FC8', music: { bpm: 100, root: 9, mode: 'major' },
    patches: c => { c.fillStyle = '#F0F4FF'; for (const [x, y, r] of [[300, 300, 260], [2150, 2150, 300], [2200, 350, 200], [200, 2200, 220]]) { c.beginPath(); c.ellipse(x, y, r, r * 0.8, 0, 0, 7); c.fill(); } } },
  { name: 'Crystal Caves', shortcut: [4, 6], sub: 'Cavern · hard', ctrl: [[500,300,0],[1100,250,15],[1500,500,35],[1200,750,50],[700,700,35],[500,1050,20],[900,1300,10],[1400,1100,30],[1900,1000,55],[2150,1450,70],[1900,1900,50],[1400,2100,30],[900,1950,15],[500,2150,0],[250,1750,0],[300,1200,10]],
    ground: '#2A2040', mottle: ['#221A36', '#34284E'], dots: ['#8FD3FF', '#FF7AF0', '#2EE6A6'], road: '#3A3450', road2: '#443E5C', curb: ['#8FD3FF', '#1A1428'], dash: '#8FD3FF',
    skyTop: [0x08, 0x06, 0x18], skyBot: [0x28, 0x1E, 0x50], hills: ['#1A1430', '#241C40'], fog: '30,22,60', sun: '#B0E0FF', sunI: 0.45, hemi: ['#6A50C0', '#100C20'], hillAmp: 120, night: true,
    scenery: ['crystal', 'crystal', 'rock', 'crystal', 'lantern', 'rock'], arch: '#8FD3FF', music: { bpm: 100, root: 11, mode: 'minor' },
    patches: c => { c.fillStyle = '#1E4A6A'; for (const [x, y, r] of [[1600, 1500, 170], [400, 1900, 120]]) { c.beginPath(); c.ellipse(x, y, r, r * 0.6, 0.4, 0, 7); c.fill(); } } },
];
// kart models (multiplied with the driver's stats) and paint options
const KART_MODELS = [
  { name: 'Sprint',  sub: 'Balanced',      w: 1,    h: 1,    k: 0.5,  nose: 0,  wF: 3.6, wR: 4,   speed: 1.00, accel: 1.00, handling: 1.00 },
  { name: 'Bruiser', sub: 'Heavy · fast',  w: 1.28, h: 1.2,  k: 0.32, nose: -2, wF: 4.2, wR: 5,   speed: 1.06, accel: 0.9,  handling: 0.92 },
  { name: 'Sonic',   sub: 'Light · nimble', w: 0.86, h: 0.9, k: 0.72, nose: 4,  wF: 3.2, wR: 3.5, speed: 0.97, accel: 1.08, handling: 1.1 },
];
const PAINTS = ['#FF7A1F', '#FF3B3B', '#FFD23F', '#2EE6A6', '#3F8CFF', '#B48CFF', '#FF4FA3', '#F4F4F4', '#23262E', '#8FD3FF'];

// ═══════════════════════ noise & track geometry ═══════════════════════
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const hash2 = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, y) { const ix = Math.floor(x), iy = Math.floor(y); let fx = x - ix, fy = y - iy; fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); const a = hash2(ix, iy), b = hash2(ix + 1, iy), c = hash2(ix, iy + 1), d = hash2(ix + 1, iy + 1); return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy; }
function fbm(x, y) { let v = 0, a = 0.5; for (let i = 0; i < 4; i++) { v += a * vnoise(x, y); x = x * 2.03 + 17; y = y * 2.03 + 17; a *= 0.5; } return v; }

let T = null, TX = [], TY = [], TZ = [], N = 0, SCENERY = [], BOXES = [], ARCH = null, OBST = [], BK = [], RL = [], SC = null, PADS = [];
const tdir = i => { const a = TX[(i + 1) % N] - TX[i], b = TY[(i + 1) % N] - TY[i], l = Math.hypot(a, b) || 1; return [a / l, b / l]; };
function nearestIdx(x, y, hint) {
  let best = -1, bd = 1e18;
  if (hint == null) { for (let i = 0; i < N; i += 3) { const d = (TX[i] - x) ** 2 + (TY[i] - y) ** 2; if (d < bd) { bd = d; best = i; } } hint = best; bd = 1e18; }
  for (let k = -8; k <= 14; k++) { const i = (hint + k + N) % N; const d = (TX[i] - x) ** 2 + (TY[i] - y) ** 2; if (d < bd) { bd = d; best = i; } }
  return best;
}
const distToTrack = (x, y, i) => Math.hypot(TX[i] - x, TY[i] - y);
function splineFor(ctrl, total) {
  const xs = [], ys = [], zs = [], n = ctrl.length, per = total / n;
  const cr = (p0, p1, p2, p3, t) => 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
  for (let i = 0; i < n; i++) { const p0 = ctrl[(i - 1 + n) % n], p1 = ctrl[i], p2 = ctrl[(i + 1) % n], p3 = ctrl[(i + 2) % n];
    for (let k = 0; k < per; k++) { const t = k / per; xs.push(cr(p0[0], p1[0], p2[0], p3[0], t)); ys.push(cr(p0[1], p1[1], p2[1], p3[1], t)); zs.push(cr(p0[2] || 0, p1[2] || 0, p2[2] || 0, p3[2] || 0, t)); } }
  return [xs, ys, zs];
}
// banking (BK: height slope across the road, outer edge up) and the AI racing line (RL: lateral offset that cuts apexes)
function buildTrackAux() {
  BK = []; RL = [];
  const curv = i => { const d0 = tdir((i - 10 + N) % N), d1 = tdir((i + 10) % N); return d0[0] * d1[1] - d0[1] * d1[0]; };
  for (let i = 0; i < N; i++) BK.push(Math.max(-0.26, Math.min(0.26, curv(i) * 0.75)));
  for (let i = 0; i < N; i++) { const c = curv((i + 26) % N); RL.push(Math.sign(c) * Math.min(36, Math.abs(c) * 110)); }
  for (let pass = 0; pass < 3; pass++) { const a = RL.slice(), b = BK.slice(); for (let i = 0; i < N; i++) { RL[i] = (a[(i - 1 + N) % N] + a[i] + a[(i + 1) % N]) / 3; BK[i] = (b[(i - 1 + N) % N] + b[i] + b[(i + 1) % N]) / 3; } }
}
// signed lateral offset of (x,y) from track point i: positive = left of the driving direction
const lateral = (x, y, i) => { const d = tdir(i); return d[0] * (y - TY[i]) - d[1] * (x - TX[i]); };
// shortcut: a straight dirt chord between two points of the circuit; returns 0..1 progress along it or -1
function onShortcut(x, y) {
  if (!SC) return -1; const dx = SC.bx - SC.ax, dy = SC.by - SC.ay, L2 = dx * dx + dy * dy, t = ((x - SC.ax) * dx + (y - SC.ay) * dy) / L2;
  if (t < 0 || t > 1) return -1; const px = SC.ax + dx * t, py = SC.ay + dy * t; return Math.hypot(x - px, y - py) < SC.w ? t : -1;
}
// ground height anywhere: the banked road near the track, the shortcut chord, rolling hills further out
function groundH(x, y, hint) {
  const i = nearestIdx(x, y, hint), d = distToTrack(x, y, i), th = TZ[i];
  const st = onShortcut(x, y); if (st >= 0 && d > ROADW + 10) return SC.az + (SC.bz - SC.az) * st;
  if (d < ROADW + 30) return th - BK[i] * Math.max(-ROADW, Math.min(ROADW, lateral(x, y, i)));
  const t = Math.min(1, (d - ROADW - 30) / 260), s = t * t * (3 - 2 * t), edge = th - BK[i] * Math.sign(lateral(x, y, i)) * ROADW;
  return edge + s * ((fbm(x * 0.0035, y * 0.0035) - 0.45) * T.hillAmp + 6);
}

// ═══════════════════════ ground texture (painted once per circuit) ═══════════════════════
const map = document.createElement('canvas'); map.width = MW; map.height = MW; const mctx = map.getContext('2d');
function paintMap(def) {
  const c = mctx, rnd = mulberry(7);
  c.setTransform(1, 0, 0, 1, 0, 0); c.scale(MAPS, MAPS);
  c.fillStyle = def.ground; c.fillRect(0, 0, WORLD, WORLD);
  for (let i = 0; i < 3000; i++) { c.fillStyle = def.mottle[(rnd() * 2) | 0]; const s = 6 + rnd() * 30; c.fillRect(rnd() * WORLD, rnd() * WORLD, s, s); }
  c.lineWidth = 2; for (let i = 0; i < 9000; i++) { const x = rnd() * WORLD, y = rnd() * WORLD, l = 4 + rnd() * 8, a = def.night ? 0 : -1.2 + rnd() * 0.6; c.strokeStyle = rnd() < 0.5 ? def.mottle[0] : def.mottle[1]; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
  def.patches(c);
  for (let i = 0; i < 2500; i++) { const k = (rnd() * N) | 0, d = tdir(k), side = rnd() < 0.5 ? -1 : 1, off = side * (ROADW + 12 + rnd() * 14); c.fillStyle = rnd() < 0.5 ? def.curb[0] : def.mottle[1]; c.globalAlpha = 0.5; c.fillRect(TX[k] - d[1] * off, TY[k] + d[0] * off, 3, 3); } c.globalAlpha = 1;
  const path = () => { c.beginPath(); c.moveTo(TX[0], TY[0]); for (let i = 1; i < N; i++) c.lineTo(TX[i], TY[i]); c.closePath(); };
  c.lineJoin = 'round'; c.lineCap = 'round';
  if (SC) { c.lineWidth = SC.w * 2 + 10; c.strokeStyle = def.mottle[0]; c.beginPath(); c.moveTo(SC.ax, SC.ay); c.lineTo(SC.bx, SC.by); c.stroke(); c.lineWidth = SC.w * 2 - 6; c.strokeStyle = def.night ? '#4A4460' : '#A8895A'; c.stroke(); c.strokeStyle = 'rgba(0,0,0,0.18)'; c.lineWidth = 6; for (const o of [-SC.w * 0.5, SC.w * 0.5]) { const nx = -(SC.by - SC.ay), ny = SC.bx - SC.ax, l = Math.hypot(nx, ny); c.beginPath(); c.moveTo(SC.ax + nx / l * o, SC.ay + ny / l * o); c.lineTo(SC.bx + nx / l * o, SC.by + ny / l * o); c.stroke(); } }
  path(); c.lineWidth = ROADW * 2 + 44; c.strokeStyle = def.mottle[0]; c.stroke();
  path(); c.lineWidth = ROADW * 2 + 18; c.strokeStyle = def.curb[0]; c.stroke();
  path(); c.lineWidth = ROADW * 2 + 18; c.strokeStyle = def.curb[1]; c.setLineDash([36, 36]); c.stroke(); c.setLineDash([]);
  path(); c.lineWidth = ROADW * 2; c.strokeStyle = def.road; c.stroke();
  path(); c.lineWidth = ROADW * 2 - 12; c.strokeStyle = def.road2; c.stroke();
  path(); c.lineWidth = ROADW * 2; c.strokeStyle = 'rgba(0,0,0,0.16)'; c.stroke();
  path(); c.lineWidth = ROADW * 2 - 30; c.strokeStyle = def.road2; c.stroke();
  for (let i = 0; i < 6000; i++) { const k = (rnd() * N) | 0, d = tdir(k); const off = (rnd() - 0.5) * ROADW * 1.75; c.fillStyle = rnd() < 0.5 ? def.road : def.road2; c.fillRect(TX[k] - d[1] * off, TY[k] + d[0] * off, 5 + rnd() * 6, 5); }
  c.strokeStyle = 'rgba(0,0,0,0.25)'; c.lineWidth = 2; for (let i = 0; i < 260; i++) { const k = (rnd() * N) | 0, d = tdir(k), off = (rnd() - 0.5) * ROADW * 1.5, x = TX[k] - d[1] * off, y = TY[k] + d[0] * off; c.beginPath(); c.moveTo(x, y); let px = x, py = y; for (let j = 0; j < 4; j++) { px += (rnd() - 0.5) * 24; py += (rnd() - 0.5) * 24; c.lineTo(px, py); } c.stroke(); }
  c.strokeStyle = 'rgba(0,0,0,0.2)'; c.lineWidth = 5; for (const off of [-16, 16]) { c.beginPath(); for (let i = 0; i < N; i += 2) { const d = tdir(i); const x = TX[i] - d[1] * off, y = TY[i] + d[0] * off; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); c.stroke(); }
  for (const off of [-ROADW + 5, ROADW - 5]) { c.strokeStyle = def.dash; c.globalAlpha = 0.55; c.lineWidth = 3; c.beginPath(); for (let i = 0; i < N; i += 2) { const d = tdir(i); const x = TX[i] - d[1] * off, y = TY[i] + d[0] * off; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); c.stroke(); c.globalAlpha = 1; }
  path(); c.lineWidth = 4; c.strokeStyle = def.dash; c.setLineDash([40, 60]); c.stroke(); c.setLineDash([]);
  for (let i = 0; i < 900; i++) { c.fillStyle = def.dots[(rnd() * def.dots.length) | 0]; c.fillRect(rnd() * WORLD, rnd() * WORLD, 5, 5); }
  const d0 = tdir(0), nx = -d0[1], ny = d0[0];
  for (let i = -8; i < 8; i++) for (let j = 0; j < 3; j++) { c.fillStyle = ((i + j) & 1) ? '#111' : '#FFF'; c.save(); c.translate(TX[0] + nx * i * 9 + d0[0] * j * 9, TY[0] + ny * i * 9 + d0[1] * j * 9); c.rotate(Math.atan2(d0[1], d0[0])); c.fillRect(0, 0, 9, 9); c.restore(); }
  c.setTransform(1, 0, 0, 1, 0, 0);
}

// ═══════════════════════ three.js scene ═══════════════════════
const canvas = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, 16 / 9, 1, 9000); camera.up.set(0, 0, 1);
const sun = new THREE.DirectionalLight(0xffffff, 1.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -320; sun.shadow.camera.right = 320; sun.shadow.camera.top = 320; sun.shadow.camera.bottom = -320; sun.shadow.camera.near = 50; sun.shadow.camera.far = 1600; sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.6;
scene.add(sun); scene.add(sun.target);
const hemi = new THREE.HemisphereLight(0xbfe3ff, 0x3e8a3e, 0.7); scene.add(hemi);
const world = new THREE.Group(); scene.add(world);            // everything that belongs to the current circuit
const mapTex = new THREE.CanvasTexture(map); mapTex.flipY = false; mapTex.anisotropy = renderer.capabilities.getMaxAnisotropy(); mapTex.encoding = THREE.sRGBEncoding;
const groundMat = new THREE.MeshStandardMaterial({ map: mapTex, roughness: 0.95, metalness: 0 });
const hex3 = h => { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };

// sky dome with procedural clouds, mountain ridges, sun and stars
const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { skyTop: { value: new THREE.Vector3() }, skyBot: { value: new THREE.Vector3() }, hillA: { value: new THREE.Vector3() }, hillB: { value: new THREE.Vector3() }, sunDir: { value: new THREE.Vector3(0.4, 0.3, 0.5) }, sunCol: { value: new THREE.Vector3(1, 0.95, 0.7) }, night: { value: 0 }, time: { value: 0 } },
  vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `precision highp float; varying vec3 vDir; uniform vec3 skyTop, skyBot, hillA, hillB, sunDir, sunCol; uniform float night, time;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
    float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; } return v; }
    void main() {
      vec3 d = normalize(vDir); float el = d.z, u = atan(d.y, d.x) / 6.2832;
      vec3 c = mix(skyBot, skyTop, pow(clamp(el * 1.6, 0.0, 1.0), 0.6));
      float sd = max(0.0, dot(d, sunDir));
      c += sunCol * (pow(sd, 900.0) * 1.6 + pow(sd, 40.0) * 0.35 + pow(sd, 6.0) * 0.08) * (night > 0.5 ? 0.5 : 1.0);
      if (night > 0.5) { float st = hash(floor(vec2(u * 900.0, el * 700.0))); c += vec3(0.9) * step(0.985, st) * (0.5 + 0.5 * sin(time * 3.0 + st * 40.0)) * smoothstep(0.0, 0.05, el); }
      if (el > 0.0) {
        vec2 cp = vec2(u * 16.0 + time * 0.004, 1.6 / (el + 0.12) + time * 0.012);
        float cd = fbm(cp * 1.4), cover = fbm(vec2(u * 3.0, 2.7)) * 0.5 + 0.35;
        float cl = smoothstep(0.62 - cover * 0.25, 0.85 - cover * 0.25, cd) * smoothstep(0.0, 0.08, el);
        vec3 cloudCol = night > 0.5 ? mix(skyBot, vec3(0.35, 0.3, 0.5), 0.5) : mix(vec3(1.0), skyBot, 0.1);
        float shade = smoothstep(0.55, 0.95, cd + 0.1 * noise(cp * 6.0));
        c = mix(c, mix(cloudCol * (night > 0.5 ? 0.55 : 0.78), cloudCol, shade), cl * (night > 0.5 ? 0.5 : 0.95));
      }
      for (int i = 2; i >= 0; i--) {
        float fi = float(i), freq = 9.0 + fi * 5.0, r = fbm(vec2(u * freq + fi * 9.1, fi * 3.3 + 0.37));
        float h = -0.01 + (0.11 + fi * 0.05) * pow(r, 1.7) * 1.6 + fi * 0.01;
        if (el < h) { vec3 mc = mix(hillA, hillB, fi * 0.5); float slope = fbm(vec2(u * freq * 3.0 + fi * 4.0, el * 40.0)) - 0.5; mc *= 0.85 + slope * 0.5 + smoothstep(h - 0.05, h, el) * 0.35; c = mix(mc, skyBot, 0.12 + fi * 0.3); }
      }
      gl_FragColor = vec4(c, 1.0);
    }` });
const sky = new THREE.Mesh(new THREE.SphereGeometry(6000, 48, 24), skyMat); scene.add(sky);

// skid marks: one dynamic buffer of quads, reused in a ring
const SKID_MAX = 1200; let skidHead = 0;
const skidGeo = new THREE.BufferGeometry(); const skidPos = new Float32Array(SKID_MAX * 6 * 3); skidGeo.setAttribute('position', new THREE.BufferAttribute(skidPos, 3)); skidGeo.setDrawRange(0, 0);
const skidMesh = new THREE.Mesh(skidGeo, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })); skidMesh.frustumCulled = false; scene.add(skidMesh);
function addSkid(x, y, z, a, w = 2.2, l = 5) {
  const c = Math.cos(a) * l / 2, s = Math.sin(a) * l / 2, wx = -Math.sin(a) * w / 2, wy = Math.cos(a) * w / 2, o = skidHead * 18, zz = z + 0.35;
  const q = [[x - c - wx, y - s - wy], [x + c - wx, y + s - wy], [x + c + wx, y + s + wy], [x - c + wx, y - s + wy]], tri = [0, 1, 2, 0, 2, 3];
  for (let i = 0; i < 6; i++) { skidPos[o + i * 3] = q[tri[i]][0]; skidPos[o + i * 3 + 1] = q[tri[i]][1]; skidPos[o + i * 3 + 2] = zz; }
  skidHead = (skidHead + 1) % SKID_MAX; skidGeo.attributes.position.needsUpdate = true; skidGeo.setDrawRange(0, SKID_MAX * 6);
}

// particles (sparks, dust, smoke) as additive points
const P_MAX = 600; const parts = []; const pGeo = new THREE.BufferGeometry(); const pPos = new Float32Array(P_MAX * 3), pCol = new Float32Array(P_MAX * 3), pSize = new Float32Array(P_MAX);
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3)); pGeo.setAttribute('size', new THREE.BufferAttribute(pSize, 1));
const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
const pMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { tex: { value: dotTex } },
  vertexShader: 'attribute float size; varying vec3 vC; void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = size * 900.0 / -mv.z; gl_Position = projectionMatrix * mv; }',
  fragmentShader: 'uniform sampler2D tex; varying vec3 vC; void main(){ gl_FragColor = vec4(vC, 1.0) * texture2D(tex, gl_PointCoord); }', vertexColors: true });
const points = new THREE.Points(pGeo, pMat); points.frustumCulled = false; scene.add(points);
function spawn(x, y, z, r, g, b, size, life, vz = 0, vx = 0, vy = 0, add = true) { if (parts.length >= P_MAX) parts.shift(); parts.push({ x, y, z, r, g, b, size, life, life0: life, vz, vx, vy }); }
function updateParticles(dt) {
  let n = 0; for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.life -= dt; if (p.life <= 0) { parts.splice(i, 1); continue; } p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; }
  for (const p of parts) { const f = p.life / p.life0; pPos[n * 3] = p.x; pPos[n * 3 + 1] = p.y; pPos[n * 3 + 2] = p.z; pCol[n * 3] = p.r * f; pCol[n * 3 + 1] = p.g * f; pCol[n * 3 + 2] = p.b * f; pSize[n] = p.size * (p.vz > 0 ? (1.6 - f) : 1); n++; }
  pGeo.attributes.position.needsUpdate = true; pGeo.attributes.color.needsUpdate = true; pGeo.attributes.size.needsUpdate = true; pGeo.setDrawRange(0, n);
}
const glowTex = dotTex;
function makeGlow(rgbHex, size, opacity = 0.7) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: rgbHex, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })); s.scale.set(size, size, 1); return s; }

// ═══════════════════════ smooth geometry builders ═══════════════════════
const superPt = (t, hw, hh, k) => { const c = Math.cos(t), s = Math.sin(t); return [Math.sign(c) * Math.pow(Math.abs(c), k) * hw, Math.sign(s) * Math.pow(Math.abs(s), k) * hh]; };
// lofted body along x with shared ring vertices -> smooth normals; caps are flat fans
function loftGeom(secs, seg, k = 0.55) {
  const pos = [], idx = []; const nSec = secs.length;
  for (let i = 0; i < nSec; i++) { const sc = secs[i]; for (let j = 0; j <= seg; j++) { const [y, z] = superPt(j / seg * Math.PI * 2, sc.hw, sc.hh, sc.k || k); pos.push(sc.x, (sc.y || 0) + y, sc.zc + z); } }
  for (let i = 0; i < nSec - 1; i++) for (let j = 0; j < seg; j++) { const a = i * (seg + 1) + j, b = a + seg + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
  const capC = (i, flip) => { const base = pos.length / 3, sc = secs[i]; pos.push(sc.x, sc.y || 0, sc.zc); const ring = i * (seg + 1); for (let j = 0; j < seg; j++) { flip ? idx.push(base, ring + j, ring + j + 1) : idx.push(base, ring + j + 1, ring + j); } };
  capC(0, false); capC(nSec - 1, true);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
// rings stacked along z (cones, trunks) with smooth normals
function loftZGeom(levels, seg, jitter = 0) {
  const pos = [], idx = []; const nL = levels.length;
  for (let i = 0; i < nL; i++) { const l = levels[i]; for (let j = 0; j <= seg; j++) { const t = (j % seg) / seg * Math.PI * 2, jt = 1 + (hash2(j % seg, i) - 0.5) * jitter; pos.push((l.ox || 0) + Math.cos(t) * l.r * jt, (l.oy || 0) + Math.sin(t) * (l.ry || l.r) * jt, l.z); } }
  for (let i = 0; i < nL - 1; i++) for (let j = 0; j < seg; j++) { const a = i * (seg + 1) + j, b = a + seg + 1; idx.push(a, a + 1, b, a + 1, b + 1, b); }
  const base = pos.length / 3, top = levels[nL - 1]; pos.push(top.ox || 0, top.oy || 0, top.z); const ring = (nL - 1) * (seg + 1); for (let j = 0; j < seg; j++) idx.push(base, ring + j, ring + j + 1);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
const sphereLv = (cx, cy, cz, r, n = 7) => Array.from({ length: n }, (_, i) => { const t = -1 + 2 * i / (n - 1); return { z: cz + t * r, r: Math.max(0.05, Math.sqrt(1 - t * t) * r), ox: cx, oy: cy }; });
const matCache = {};
function mat(color, opts = {}) { const key = color + JSON.stringify(opts); return matCache[key] || (matCache[key] = new THREE.MeshStandardMaterial({ color, roughness: opts.rough ?? 0.6, metalness: opts.metal ?? 0.05, emissive: opts.emissive || 0x000000, emissiveIntensity: opts.ei ?? 1, flatShading: !!opts.flat, transparent: !!opts.opacity, opacity: opts.opacity ?? 1 })); }
function mesh(geo, m, cast = true, recv = true) { const o = new THREE.Mesh(geo, m); o.castShadow = cast; o.receiveShadow = recv; return o; }
function boxM(cx, cy, cz, lx, ly, lz, m) { const o = mesh(new THREE.BoxGeometry(lx, ly, lz), m); o.position.set(cx, cy, cz); return o; }

// ═══════════════════════ kart model ═══════════════════════
const KGEO_COMMON = {
  fwing: loftGeom([{ x: 11.5, hw: 8.5, zc: 4.6, hh: 0.55 }, { x: 13.5, hw: 9, zc: 4.6, hh: 0.6 }, { x: 15.5, hw: 7.5, zc: 4.7, hh: 0.45 }], 12, 0.4),
  torso: loftGeom([{ x: -5, hw: 3.4, zc: 14.6, hh: 2.6 }, { x: -1.5, hw: 3.6, zc: 14.8, hh: 2.9 }, { x: 0.5, hw: 2.6, zc: 14.4, hh: 2.2 }], 12, 0.6),
  arm: loftGeom([{ x: -1, hw: 1, zc: 14.2, hh: 1 }, { x: 3, hw: 0.9, zc: 13.6, hh: 0.9 }], 8, 0.9),
  intake: loftGeom([{ x: -11, hw: 1.6, zc: 12.9, hh: 1 }, { x: -8, hw: 1.9, zc: 13.1, hh: 1.2 }], 10, 0.8),
  exhaust: loftGeom([{ x: -15.5, hw: 1, zc: 6.6, hh: 1 }, { x: -12.5, hw: 1.1, zc: 6.6, hh: 1.1 }], 10, 0.9),
  helmet: new THREE.SphereGeometry(5, 24, 16), visor: new THREE.SphereGeometry(5.15, 20, 10, -0.9, 1.8, 1.0, 1.2),
  ear: new THREE.ConeGeometry(1.5, 4, 8), ball: new THREE.SphereGeometry(1.6, 10, 8), spike: new THREE.ConeGeometry(1.2, 3.5, 6), antenna: new THREE.CylinderGeometry(0.3, 0.3, 4, 6),
  wheelRing: new THREE.TorusGeometry(4.2, 0.5, 8, 20), glove: new THREE.SphereGeometry(1.1, 10, 8), light: new THREE.SphereGeometry(1, 10, 8),
};
const KGEO_MODEL = {};
function modelGeo(m) {
  if (KGEO_MODEL[m.name]) return KGEO_MODEL[m.name];
  const W = m.w, H = m.h, n = m.nose;
  const g = {
    body: loftGeom([{ x: -13.5, hw: 4.5 * W, zc: 8.4, hh: 2.2 * H }, { x: -10, hw: 6.4 * W, zc: 8.8, hh: 3.4 * H }, { x: -5, hw: 7 * W, zc: 8.6, hh: 3.8 * H }, { x: 1, hw: 7 * W, zc: 8.3, hh: 3.6 * H }, { x: 6 + n * 0.4, hw: 6.4 * W, zc: 8, hh: 3.1 * H }, { x: 10.5 + n * 0.8, hw: 4.8 * W, zc: 7.7, hh: 2.5 * H }, { x: 14.5 + n, hw: 2.2 * W, zc: 7.5, hh: 1.4 * H }], 20, m.k),
    pod: loftGeom([{ x: -9, hw: 2.4 * W, zc: 5.6, hh: 1.8 * H }, { x: -4, hw: 3.2 * W, zc: 5.8, hh: 2.3 * H }, { x: 2, hw: 3 * W, zc: 5.7, hh: 2.1 * H }, { x: 5, hw: 1.6 * W, zc: 5.5, hh: 1.3 * H }], 14, Math.min(0.7, m.k + 0.1)),
    rwing: loftGeom([{ x: -14.8, hw: 8 * W, zc: 16.6 * H, hh: 0.6 }, { x: -13, hw: 8.4 * W, zc: 16.5 * H, hh: 0.75 }, { x: -11, hw: 7.6 * W, zc: 16.4 * H, hh: 0.55 }], 12, 0.4),
    tyreF: new THREE.CylinderGeometry(m.wF, m.wF, 3.4, 20), tyreR: new THREE.CylinderGeometry(m.wR, m.wR, 4.2, 20),
    rimF: new THREE.CylinderGeometry(m.wF * 0.64, m.wF * 0.64, 3.7, 16), rimR: new THREE.CylinderGeometry(m.wR * 0.65, m.wR * 0.65, 4.5, 16),
  };
  return KGEO_MODEL[m.name] = g;
}
function buildKart(ch, model = KART_MODELS[0], paint = ch.body) {
  const g = new THREE.Group(), KGEO = Object.assign({}, KGEO_COMMON, modelGeo(model)), W = model.w;
  const body = mat(paint, { rough: 0.35, metal: 0.25 }), acc = mat(ch.accent, { rough: 0.4, metal: 0.2 }), dark = mat('#1E2030', { rough: 0.7 }), metal = mat('#8A8E9A', { rough: 0.35, metal: 0.8 });
  const parts = [[KGEO.body, body], [KGEO.fwing, acc], [KGEO.rwing, acc], [KGEO.intake, metal], [KGEO.torso, mat(ch.suit, { rough: 0.8 })]];
  for (const [geo, m] of parts) g.add(mesh(geo, m));
  for (const s of [-1, 1]) {
    const pod = mesh(KGEO.pod, acc); pod.position.y = s * 8.8 * W; g.add(pod);
    const ex = mesh(KGEO.exhaust, metal); ex.position.y = s * 3; g.add(ex);
    const post = boxM(-12.6, s * 4.2 * W, 14.2 * model.h, 1.2, 1.2, 4, metal); g.add(post);
    const arm = mesh(KGEO.arm, mat(ch.suit, { rough: 0.8 })); arm.position.y = s * 3.4; arm.rotation.z = s * 0.25; g.add(arm);
    const glove = mesh(KGEO.glove, mat(ch.helmet, { rough: 0.6 })); glove.position.set(3.4, s * 4.6, 13.6); g.add(glove);
    const hl = mesh(KGEO.light, mat('#FFF3A8', { emissive: '#FFF3A8', ei: 1.5 }), false); hl.position.set(14.4 + model.nose, s * 2.6 * W, 9.4); hl.scale.set(0.5, 0.9, 0.7); g.add(hl);
    const bl = boxM(-14.2, s * 5.4 * W, 8.6, 0.6, 2.2, 1.3, mat('#7A1A1A', { emissive: '#FF2A2A', ei: 0.2 })); g.add(bl); if (s === 1) g.brakeL = bl; else g.brakeR = bl;
  }
  const cockpit = mesh(new THREE.CircleGeometry(4.6, 20), dark, false); cockpit.position.set(-1, 0, 12.4); cockpit.scale.set(1.15, 0.9, 1); g.add(cockpit);
  g.add(boxM(-5.5, 0, 13.6, 1.6, 6, 3.2, dark));
  const sw = mesh(KGEO.wheelRing, dark); sw.scale.set(0.9, 0.9, 0.9); sw.position.set(4.2, 0, 12.9); sw.rotation.y = Math.PI / 2; g.add(sw);
  g.wheels = [];
  for (const [wx, wy, front] of [[8.2, 8.4 * W, 1], [8.2, -8.4 * W, 1], [-8, 8.8 * W, 0], [-8, -8.8 * W, 0]]) {
    const pivot = new THREE.Group(); pivot.position.set(wx, wy, front ? model.wF : model.wR); const spin = new THREE.Group(); pivot.add(spin);
    spin.add(mesh(front ? KGEO.tyreF : KGEO.tyreR, mat('#23252C', { rough: 0.9 }))); spin.add(mesh(front ? KGEO.rimF : KGEO.rimR, mat('#D5D8E0', { rough: 0.3, metal: 0.9 })));
    const hub = mesh(new THREE.CylinderGeometry(0.9, 0.9, (front ? 3.9 : 4.7), 8), acc); spin.add(hub);
    g.add(pivot); g.wheels.push({ pivot, spin, front });
  }
  const helmetM = mat(ch.helmet, { rough: 0.25, metal: 0.1 });
  const head = new THREE.Group(); head.position.set(-2, 0, 19.5); g.add(head); g.head = head;
  head.add(mesh(KGEO.helmet, helmetM)); const visor = mesh(KGEO.visor, mat('#141830', { rough: 0.15, metal: 0.6 }), false); visor.rotation.order = 'ZYX'; visor.rotation.set(Math.PI / 2, 0, Math.PI); head.add(visor);
  const stripe = boxM(0, 0, 4.4, 5, 1.4, 1.2, acc); head.add(stripe);
  if (ch.kind === 'Fox' || ch.kind === 'Cat') for (const s of [-1, 1]) { const e = mesh(KGEO.ear, helmetM); e.position.set(0, s * 3.4, 5.2); e.rotation.x = Math.PI / 2 - s * 0.4; head.add(e); }
  if (ch.kind === 'Bear' || ch.kind === 'Monkey') for (const s of [-1, 1]) { const e = mesh(KGEO.ball, helmetM); e.position.set(0, s * 4.2, 3.6); head.add(e); }
  if (ch.kind === 'Dino') for (let i = -1; i <= 1; i++) { const e = mesh(KGEO.spike, mat(ch.body)); e.position.set(i * 2.4 - 0.5, 0, 5.2 - Math.abs(i) * 0.6); e.rotation.x = Math.PI / 2; head.add(e); }
  if (ch.kind === 'Robot') { const a = mesh(KGEO.antenna, metal); a.rotation.x = Math.PI / 2; a.position.set(0, 0, 7); head.add(a); const tip = mesh(KGEO.ball, mat('#FF5A5F', { emissive: '#FF5A5F', ei: 1.2 })); tip.scale.setScalar(0.7); tip.position.set(0, 0, 9.2); head.add(tip); }
  // boost flame + glow, shield bubble
  const flame = mesh(new THREE.ConeGeometry(3, 12, 10), mat('#FF7A1F', { emissive: '#FF9A2F', ei: 2 }), false, false); flame.rotation.z = Math.PI / 2; flame.position.set(-19, 0, 6.6); g.paint = paint; flame.visible = false; g.add(flame); g.flame = flame;
  const fglow = makeGlow('#FF9A3F', 40, 0.8); fglow.position.set(-17, 0, 7); fglow.visible = false; g.add(fglow); g.fglow = fglow;
  const bubble = mesh(new THREE.SphereGeometry(20, 24, 16), new THREE.MeshStandardMaterial({ color: 0x2EE6A6, transparent: true, opacity: 0.25, roughness: 0.2, metalness: 0.4, emissive: 0x2EE6A6, emissiveIntensity: 0.5 }), false, false); bubble.position.set(0, 0, 10); bubble.visible = false; g.add(bubble); g.bubble = bubble;
  g.matrixAutoUpdate = false;
  return g;
}

function ghostKart(ch, model, paint) {
  const g = buildKart(ch, model, paint); g.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.32; o.material.depthWrite = false; o.castShadow = false; o.receiveShadow = false; } if (o.isSprite) o.visible = false; });
  g.flame.visible = false; g.fglow.visible = false; g.bubble.visible = false; return g;
}
// ═══════════════════════ scenery models ═══════════════════════
const SCN_CACHE = {};
function sceneryModel(type, sc) {
  const g = new THREE.Group(); const s = sc.s;
  const add = (o) => { g.add(o); return o; };
  if (type === 'pine') { add(mesh(loftZGeom([{ z: 0, r: 2.6 }, { z: 18, r: 1.8 }], 8), mat('#5A3B1A', { rough: 0.9 })));
    for (let i = 0; i < 3; i++) { add(mesh(loftZGeom([{ z: 12 + i * 15, r: 17 - i * 4.5 }, { z: 34 + i * 15, r: 0.2 }], 12, 0.1), mat(i % 2 ? '#1F6B44' : '#27804F', { rough: 0.9 }))); add(mesh(loftZGeom([{ z: 22 + i * 15, r: 9.5 - i * 2.6 }, { z: 34.5 + i * 15, r: 0.2 }], 12, 0.1), mat('#F4F8FC', { rough: 0.9 }))); } }
  else if (type === 'palm') { add(mesh(loftZGeom([{ z: 0, r: 3.2 }, { z: 20, r: 2.6, ox: 2 }, { z: 40, r: 2.2, ox: 5 }, { z: 58, r: 1.8, ox: 9 }, { z: 66, r: 1.6, ox: 11 }], 8), mat('#8B5A2B', { rough: 0.9 })));
    for (let i = 0; i < 7; i++) { const f = mesh(loftGeom([{ x: 0, hw: 1.2, zc: 0, hh: 0.4 }, { x: 10, hw: 4.5, zc: 2, hh: 0.5 }, { x: 20, hw: 4.2, zc: -1, hh: 0.4 }, { x: 30, hw: 1.5, zc: -9, hh: 0.3 }], 8, 0.6), mat(i % 2 ? '#2E8B57' : '#3DA86A', { rough: 0.8 })); f.position.set(11, 0, 66); f.rotation.z = i / 7 * Math.PI * 2; add(f); }
    const nut = mesh(new THREE.SphereGeometry(3, 10, 8), mat('#5A3B1A')); nut.position.set(11, 0, 65); add(nut); }
  else if (type === 'rock') { add(mesh(loftZGeom([{ z: -2, r: 14, ry: 10 }, { z: 3, r: 19, ry: 13 }, { z: 9, r: 15, ry: 10.5 }, { z: 14, r: 7, ry: 5 }, { z: 16, r: 0.5, ry: 0.5 }], 10, 0.3), mat('#8E8E82', { rough: 0.95, flat: true }))); }
  else if (type === 'bush') { add(mesh(loftZGeom([{ z: 0, r: 10 }, { z: 6, r: 15 }, { z: 12, r: 13 }, { z: 18, r: 5 }, { z: 20, r: 0.4 }], 12, 0.25), mat('#2E8B57', { rough: 0.9 }))); for (const [x, y, z] of [[7, 6, 13], [-8, 3, 15], [2, -9, 12]]) { const b = mesh(new THREE.SphereGeometry(2.2, 8, 6), mat('#FF5A5F', { rough: 0.5 })); b.position.set(x, y, z); add(b); } }
  else if (type === 'tyres') { const t = mat('#26282F', { rough: 0.95 }); for (let i = 0; i < 3; i++) { const r = mesh(new THREE.TorusGeometry(5.2, 2.4, 10, 20), i === 2 && sc.ph ? mat('#C8332A', { rough: 0.8 }) : t); r.position.z = 2.5 + i * 4.8; add(r); } }
  else if (type === 'deadtree') { const m = mat('#2A1A16', { rough: 0.95 }); add(mesh(loftZGeom([{ z: 0, r: 3 }, { z: 28, r: 2, ox: 1 }, { z: 48, r: 1, ox: 3 }, { z: 52, r: 0.2, ox: 3 }], 7), m)); add(mesh(loftZGeom([{ z: 26, r: 1.6, ox: 1 }, { z: 46, r: 0.6, ox: -12, oy: 3 }, { z: 48, r: 0.1, ox: -13, oy: 3 }], 6), m)); add(mesh(loftZGeom([{ z: 34, r: 1.3, ox: 2 }, { z: 56, r: 0.5, ox: 12, oy: -4 }, { z: 58, r: 0.1, ox: 12, oy: -4 }], 6), m)); }
  else if (type === 'snowman') { const w = mat('#FFFFFF', { rough: 0.9 }); for (const [z, r] of [[10, 11], [27, 8.5], [41, 6.5]]) { const b = mesh(new THREE.SphereGeometry(r, 16, 12), w); b.position.z = z; add(b); } add(boxM(0, 0, 49, 9, 9, 2, mat('#1B1F3B'))); add(boxM(0, 0, 54, 6, 6, 8, mat('#1B1F3B'))); const nose = mesh(new THREE.ConeGeometry(1.2, 8, 8), mat('#FF7A1F')); nose.rotation.z = -Math.PI / 2; nose.position.set(9, 0, 42); add(nose); }
  else if (type === 'lamp') { add(mesh(loftZGeom([{ z: 0, r: 1.8 }, { z: 58, r: 1.2 }, { z: 59, r: 0.2 }], 8), mat('#9A9AA8', { metal: 0.6, rough: 0.4 }))); add(boxM(6, 0, 57.5, 12, 1.6, 1.6, mat('#9A9AA8', { metal: 0.6 }))); const bulb = mesh(new THREE.SphereGeometry(2.2, 10, 8), mat('#FFF3A8', { emissive: '#FFF3A8', ei: 2 }), false); bulb.position.set(12, 0, 55); add(bulb); const gl = makeGlow('#FFE9A0', 70, 0.7); gl.position.set(12, 0, 55); add(gl); }
  else if (type === 'geyser') { add(mesh(loftZGeom([{ z: -2, r: 16, ry: 12 }, { z: 6, r: 12, ry: 9 }, { z: 9, r: 5, ry: 4 }, { z: 10, r: 0.3 }], 10, 0.2), mat('#5A4643', { rough: 0.95, flat: true }))); const jet = mesh(new THREE.ConeGeometry(4, 50, 10), mat('#FF7A1F', { emissive: '#FF8A2F', ei: 1.5 }), false, false); jet.rotation.x = Math.PI / 2; jet.position.z = 30; add(jet); g.jet = jet; const gl = makeGlow('#FF9A3F', 60, 0.6); gl.position.z = 20; add(gl); }
  else if (type === 'cactus') { const gm = mat('#4E9A4A', { rough: 0.8 }); add(mesh(loftZGeom([{ z: 0, r: 4 }, { z: 30, r: 3.6 }, { z: 46, r: 2.2 }, { z: 48, r: 0.3 }], 10), gm)); for (const [side, h] of [[1, 20], [-1, 28]]) { const arm = mesh(loftZGeom([{ z: h, r: 2.2, ox: side * 3 }, { z: h + 2, r: 2.2, ox: side * 9 }, { z: h + 16, r: 1.8, ox: side * 9.5 }, { z: h + 17, r: 0.2, ox: side * 9.5 }], 8), gm); add(arm); } const fl = mesh(new THREE.SphereGeometry(2.2, 8, 6), mat('#FF4FA3', { rough: 0.5 })); fl.position.z = 49; add(fl); }
  else if (type === 'mesa') { const layers = ['#B8643A', '#C97A4A', '#A85A32', '#D08A55']; let z = 0; layers.forEach((c, i) => { const w = 52 - i * 8, d = 40 - i * 6, h = 9; const b = boxM(0, 0, z + h / 2, w, d, h, mat(c, { rough: 0.95, flat: true })); add(b); z += h; }); }
  else if (type === 'bigtree') { add(mesh(loftZGeom([{ z: 0, r: 5 }, { z: 20, r: 3.6 }, { z: 36, r: 2.6 }, { z: 37, r: 0.3 }], 9), mat('#4A3320', { rough: 0.95 }))); for (const [x, y, z, r, c] of [[0, 0, 44, 20, '#2E7D3A'], [12, 6, 38, 14, '#3A9A48'], [-11, -5, 40, 15, '#276B32'], [3, -12, 36, 12, '#3A9A48'], [-4, 10, 34, 11, '#2E7D3A']]) { const b = mesh(new THREE.SphereGeometry(r, 12, 9), mat(c, { rough: 0.9 })); b.position.set(x, y, z); add(b); } }
  else if (type === 'mushroom') { add(mesh(loftZGeom([{ z: 0, r: 4.5 }, { z: 14, r: 3.5 }, { z: 15, r: 0.2 }], 9), mat('#F2E6C8', { rough: 0.8 }))); const cap = mesh(new THREE.SphereGeometry(11, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(sc.ph > 3 ? '#E0392B' : '#FF7A1F', { rough: 0.5 })); cap.rotation.x = Math.PI / 2; cap.position.z = 13; add(cap); for (let i = 0; i < 5; i++) { const d = mesh(new THREE.SphereGeometry(1.6, 6, 5), mat('#FFFFFF')); const a = i / 5 * 6.28 + sc.ph; d.position.set(Math.cos(a) * 6, Math.sin(a) * 6, 20); add(d); } }
  else if (type === 'cherry') { add(mesh(loftZGeom([{ z: 0, r: 3.4 }, { z: 18, r: 2.6, ox: 1 }, { z: 32, r: 1.8, ox: 3 }, { z: 33, r: 0.2, ox: 3 }], 8), mat('#5A3B2A', { rough: 0.95 }))); for (const [x, y, z, r, c] of [[3, 0, 40, 16, '#FF9AD0'], [12, 5, 36, 11, '#FFB8E0'], [-8, -4, 37, 12, '#FF8AC8'], [1, 10, 33, 9, '#FFC0E8'], [0, -11, 34, 9, '#FF9AD0']]) { const b = mesh(new THREE.SphereGeometry(r, 12, 9), mat(c, { rough: 0.85 })); b.position.set(x, y, z); add(b); } }
  else if (type === 'lantern') { add(mesh(loftZGeom([{ z: 0, r: 1.6 }, { z: 40, r: 1.2 }, { z: 41, r: 0.2 }], 8), mat('#3A3D4A', { metal: 0.5, rough: 0.5 }))); const lamp = mesh(new THREE.BoxGeometry(7, 7, 9), mat('#FFE0A0', { emissive: '#FFC860', ei: 1.6, opacity: 0.9 }), false); lamp.position.z = 44; add(lamp); add(boxM(0, 0, 49.5, 9, 9, 1.5, mat('#3A3D4A'))); const gl = makeGlow('#FFD080', 60, 0.7); gl.position.z = 44; add(gl); }
  else if (type === 'crystal') { const cols = ['#8FD3FF', '#FF7AF0', '#2EE6A6', '#B48CFF']; for (let i = 0; i < 4; i++) { const h = 18 + hash2(i, sc.ph) * 26, c = cols[(i + (sc.ph * 3 | 0)) % 4]; const cr = mesh(new THREE.ConeGeometry(4 + hash2(i + 9, sc.ph) * 3, h, 6), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.9, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.9, flatShading: true }), false); const a = i / 4 * 6.28 + sc.ph; cr.position.set(Math.cos(a) * 6, Math.sin(a) * 6, h * 0.45); cr.rotation.order = 'ZYX'; cr.rotation.set(Math.PI / 2 + 0.35, 0, a); add(cr); } const gl = makeGlow(cols[(sc.ph * 3 | 0) % 4], 80, 0.55); gl.position.z = 18; add(gl); }
  else if (type === 'stand') { const dark = mat('#3A3D4A', { rough: 0.8 }); add(boxM(0, 0, 14, 22, 110, 28, dark)); add(boxM(-8, 0, 30, 6, 110, 4, mat('#4C5062'))); for (const y of [-52, 52]) add(boxM(-9, y, 40, 3, 3, 26, mat('#4C5062'))); const roof = boxM(-2, 0, 54, 34, 124, 2, mat(T.arch, { rough: 0.5 })); roof.rotation.y = -0.12; add(roof);
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 64; const c = cv.getContext('2d'); c.fillStyle = '#2A2D3A'; c.fillRect(0, 0, 256, 64); const cols = ['#FF5A5F', '#FFD23F', '#2EE6A6', '#8FD3FF', '#B48CFF', '#FFF6DC']; for (let r = 0; r < 3; r++) for (let i = 0; i < 14; i++) { c.fillStyle = cols[(i * 5 + r * 3) % 6]; c.beginPath(); c.arc(12 + i * 17.5, 14 + r * 18, 6, 0, 7); c.fill(); }
    const tex = new THREE.CanvasTexture(cv); const front = mesh(new THREE.PlaneGeometry(108, 26), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }), false); front.position.set(11.2, 0, 14); front.rotation.order = 'ZYX'; front.rotation.set(Math.PI / 2, 0, Math.PI / 2); add(front); }
  else if (type === 'tower') { const h = 90 + sc.ph * 25, w = 34; const cv = document.createElement('canvas'); cv.width = 64; cv.height = 256; const c = cv.getContext('2d'); c.fillStyle = '#20233A'; c.fillRect(0, 0, 64, 256); c.fillStyle = sc.ph > 3 ? '#FFD23F' : '#2EE6A6'; for (let y = 8; y < 250; y += 12) for (let x = 6; x < 60; x += 12) if (hash2(x, y + sc.ph) > 0.35) c.fillRect(x, y, 6, 7); const tex = new THREE.CanvasTexture(cv);
    const m = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.9, roughness: 0.6 }); const b = mesh(new THREE.BoxGeometry(w, w, h), m); b.position.z = h / 2; add(b); const cap = boxM(0, 0, h + 1.5, w, w, 3, mat('#FF3FA4', { emissive: '#FF3FA4', ei: 1.5 })); add(cap); }
  else if (type === 'billboard') { add(boxM(0, 0, 25, 4, 4, 50, mat('#3A3D4A'))); const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const c = cv.getContext('2d'); c.fillStyle = sc.ph > 3 ? '#FF3FA4' : '#2EE6A6'; c.fillRect(0, 0, 256, 128); c.fillStyle = '#0E1030'; c.fillRect(12, 12, 232, 104); c.fillStyle = '#FFD23F'; c.font = "italic 800 64px 'Barlow Condensed', Impact, sans-serif"; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(sc.ph > 3 ? 'PEEKEE' : 'KART!', 128, 66);
    const tex = new THREE.CanvasTexture(cv); const p = mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.8 })); p.position.set(0, 0, 66); p.rotation.order = 'ZYX'; p.rotation.set(Math.PI / 2, 0, Math.PI / 2); add(p); }
  else if (type === 'flag') { add(mesh(new THREE.CylinderGeometry(1, 1, 60, 8).rotateX(Math.PI / 2), mat('#DDDDDD', { metal: 0.5 })).translateZ(30)); const fg = new THREE.PlaneGeometry(26, 14, 8, 2); const f = mesh(fg, mat(sc.ph > 3 ? '#FFD23F' : '#FF5A5F', { rough: 0.8 }), true, false); f.material.side = THREE.DoubleSide; f.position.set(13, 0, 52); f.rotation.x = Math.PI / 2; add(f); g.flag = f; g.flagBase = fg.attributes.position.array.slice(); }
  g.rotation.z = sc.type === 'stand' ? sc.ph + (sc.side > 0 ? Math.PI : 0) : sc.ph;
  g.scale.setScalar(s); return g;
}

// ═══════════════════════ circuit construction ═══════════════════════
const ITEMBOX_GEO = new THREE.BoxGeometry(14, 14, 14);
let terrainMesh = null, roadMesh = null, boxMeshes = [], flagMeshes = [], geysers = [], padMeshes = [], JUMPS = [];
function buildTrack(def) {
  T = def; T.fogRGB = def.fog.split(',').map(Number);
  [TX, TY, TZ] = splineFor(def.ctrl, 720); N = TX.length;
  // ramps: a rising lip at the circuit's two highest points that ends in a sharp drop-off (a real jump)
  { const order = def.ctrl.map((c, i) => [c[2] || 0, i]).sort((a, b) => b[0] - a[0]); const picks = []; for (const [, i] of order) { if (picks.every(p => Math.min(Math.abs(p - i), def.ctrl.length - Math.abs(p - i)) >= 3)) picks.push(i); if (picks.length === 2) break; }
    JUMPS = picks.map(ci => Math.round(ci * N / def.ctrl.length) % N);
    for (const j0 of JUMPS) for (let k = 0; k <= 46; k++) { const t = k / 46; TZ[(j0 - 46 + k + N) % N] += 16 * t * t; } }
  buildTrackAux();
  { const ia = Math.round(def.shortcut[0] * N / def.ctrl.length) % N, ib = Math.round(def.shortcut[1] * N / def.ctrl.length) % N; SC = { ax: TX[ia], ay: TY[ia], az: TZ[ia], bx: TX[ib], by: TY[ib], bz: TZ[ib], w: 22, ia, ib }; }
  paintMap(def); mapTex.needsUpdate = true;
  while (world.children.length) world.remove(world.children[0]);
  // scenery placement (needs the track), then shadows baked into the map are replaced by real shadows now
  SCENERY = []; const r2 = mulberry(99); let tries = 0;
  while (SCENERY.length < 150 && tries++ < 9000) { const x = 60 + r2() * (WORLD - 120), y = 60 + r2() * (WORLD - 120); const i = nearestIdx(x, y, null), d = distToTrack(x, y, i); if (d > ROADW + 48 && d < ROADW + 520) SCENERY.push({ x, y, type: def.scenery[(r2() * def.scenery.length) | 0], s: 0.8 + r2() * 0.6, ph: r2() * 6.28 }); }
  for (let i = 0; i < N; i += 3) { const d0 = tdir((i - 12 + N) % N), d1 = tdir((i + 12) % N), curv = d0[0] * d1[1] - d0[1] * d1[0]; if (Math.abs(curv) > 0.42) { const d = tdir(i), side = curv > 0 ? 1 : -1, off = side * (ROADW + 22); SCENERY.push({ x: TX[i] + d[1] * off, y: TY[i] - d[0] * off, type: 'tyres', s: 1, ph: (i / 3) % 2 }); } }
  for (const side of [-1, 1]) for (let j = 0; j < 2; j++) { const i = (10 + j * 16) % N, d = tdir(i), off = side * (ROADW + 150); SCENERY.push({ x: TX[i] - d[1] * off, y: TY[i] + d[0] * off, type: 'stand', s: 1, ph: Math.atan2(d[1], d[0]), side }); }
  OBST = SCENERY.filter(s => s.type === 'tyres');
  // terrain
  const SEG = 120, geo = new THREE.PlaneGeometry(WORLD, WORLD, SEG, SEG); geo.translate(WORLD / 2, WORLD / 2, 0);
  const pa = geo.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i); const idx = nearestIdx(x, y, null), d = distToTrack(x, y, idx); pa.setZ(i, d < ROADW + 30 ? TZ[idx] - 0.6 : groundH(x, y, idx)); }
  geo.computeVertexNormals(); terrainMesh = new THREE.Mesh(geo, groundMat); terrainMesh.receiveShadow = true; world.add(terrainMesh);
  // road strip (follows the exact height of the centreline)
  // 4 vertices per cross-section (shoulder, road edge, road edge, shoulder) so the banked surface matches groundH exactly
  const rp = [], ruv = [], ri = [], RW = ROADW + 34, OFFS = [-RW, -ROADW, ROADW, RW];
  for (let i = 0; i <= N; i++) { const k = i % N, d = tdir(k); for (const s of OFFS) { const x = TX[k] + d[1] * s, y = TY[k] - d[0] * s, lat = -s; rp.push(x, y, TZ[k] + 0.4 - BK[k] * Math.max(-ROADW, Math.min(ROADW, lat))); ruv.push(x / WORLD, y / WORLD); } if (i < N) { const a = i * 4; for (let j = 0; j < 3; j++) ri.push(a + j, a + j + 1, a + j + 4, a + j + 1, a + j + 5, a + j + 4); } }
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3)); rg.setAttribute('uv', new THREE.Float32BufferAttribute(ruv, 2)); rg.setIndex(ri); rg.computeVertexNormals();
  roadMesh = new THREE.Mesh(rg, groundMat); roadMesh.receiveShadow = true; world.add(roadMesh);
  // scenery
  flagMeshes = []; geysers = [];
  for (const sc of SCENERY) { const m = sceneryModel(sc.type, sc); m.position.set(sc.x, sc.y, groundH(sc.x, sc.y, null) - 0.5); world.add(m); if (m.flag) flagMeshes.push(m); if (m.jet) geysers.push({ m, ph: sc.ph }); }
  // start arch
  const ai = 4, da = tdir(ai); ARCH = { x: TX[ai], y: TY[ai], a: Math.atan2(da[1], da[0]), z: TZ[ai] };
  const archG = new THREE.Group(); archG.position.set(ARCH.x, ARCH.y, ARCH.z); archG.rotation.z = ARCH.a; const span = ROADW + 16;
  for (const s of [-1, 1]) archG.add(mesh(new THREE.CylinderGeometry(3, 3.5, 46, 12).rotateX(Math.PI / 2), mat('#E8E4D8', { rough: 0.5 })).translateY(s * span).translateZ(23));
  const bc = document.createElement('canvas'); bc.width = 512; bc.height = 64; const bx = bc.getContext('2d'); bx.fillStyle = def.arch; bx.fillRect(0, 0, 512, 64); bx.fillStyle = '#FFF6DC'; bx.font = "italic 800 44px 'Barlow Condensed', Impact, sans-serif"; bx.textAlign = 'center'; bx.textBaseline = 'middle'; bx.fillText('PEEKEE KART  ·  ' + def.name.toUpperCase(), 256, 34);
  const banner = mesh(new THREE.BoxGeometry(5, span * 2 + 6, 10), [mat(def.arch), mat(def.arch), mat(def.arch), mat(def.arch), mat(def.arch), mat(def.arch)]); banner.position.z = 42; archG.add(banner);
  const face = mesh(new THREE.PlaneGeometry(span * 2, 9), new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(bc), roughness: 0.6 }), false); face.rotation.order = 'ZYX'; face.rotation.set(Math.PI / 2, 0, -Math.PI / 2); face.position.set(-2.6, 0, 42); archG.add(face);
  world.add(archG);
  // item boxes
  BOXES = []; boxMeshes = [];
  for (let k = 60; k < N; k += 90) { const d = tdir(k); for (const off of [-40, 0, 40]) { const x = TX[k] - d[1] * off, y = TY[k] + d[0] * off; const b = { x, y, z: TZ[k], t: 0 }; BOXES.push(b);
    const m = new THREE.Mesh(ITEMBOX_GEO, new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.3, emissive: 0xffffff, emissiveIntensity: 0.5 })); m.castShadow = true; const gl = makeGlow('#FFFFFF', 34, 0.5); m.add(gl); m.glow = gl; world.add(m); boxMeshes.push(m); } }
  // boost pads on the straightest stretches
  PADS = []; for (const m of padMeshes) world.remove(m); padMeshes = [];
  { const cv = document.createElement('canvas'); cv.width = 128; cv.height = 64; const c = cv.getContext('2d'); c.fillStyle = '#1B1F3B'; c.fillRect(0, 0, 128, 64); c.fillStyle = '#2EE6A6'; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(14 + i * 34, 10); c.lineTo(38 + i * 34, 32); c.lineTo(14 + i * 34, 54); c.lineTo(26 + i * 34, 32); c.closePath(); c.fill(); } const tex = new THREE.CanvasTexture(cv);
    const cand = []; for (let i = 0; i < N; i += 6) { if (Math.abs(BK[i]) < 0.03 && i > 60) cand.push(i); }
    const picks = []; for (const i of cand) if (!picks.some(p => Math.abs(p - i) < 150)) picks.push(i);
    for (const i of picks.slice(0, 4)) { PADS.push({ x: TX[i], y: TY[i], z: TZ[i], a: Math.atan2(tdir(i)[1], tdir(i)[0]) }); const pm = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.9, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -3 })); pm.position.set(TX[i], TY[i], TZ[i] + 0.7); pm.rotation.z = PADS[PADS.length - 1].a; pm.receiveShadow = true; world.add(pm); padMeshes.push(pm); } }
  // sky / lights / fog per circuit
  const st = def.skyTop.map(v => v / 255), sb = def.skyBot.map(v => v / 255);
  skyMat.uniforms.skyTop.value.set(st[0], st[1], st[2]); skyMat.uniforms.skyBot.value.set(sb[0], sb[1], sb[2]);
  const hA = hex3(def.hills[1]), hB = hex3(def.hills[0]); skyMat.uniforms.hillA.value.set(hA[0], hA[1], hA[2]); skyMat.uniforms.hillB.value.set(hB[0], hB[1], hB[2]);
  skyMat.uniforms.night.value = def.night ? 1 : 0; const sc3 = hex3(def.sun); skyMat.uniforms.sunCol.value.set(sc3[0], sc3[1], sc3[2]);
  const sd = new THREE.Vector3(-0.45, -0.35, 0.62).normalize(); skyMat.uniforms.sunDir.value.copy(sd); sun.userData.dir = sd;
  sun.color.set(def.night ? '#8090C0' : def.sun === '#FF5A3A' ? '#FFB080' : '#FFF4E0'); sun.intensity = def.sunI;
  hemi.color.set(def.hemi[0]); hemi.groundColor.set(def.hemi[1]); hemi.intensity = def.night ? 0.5 : 0.75;
  scene.fog = new THREE.Fog(new THREE.Color(T.fogRGB[0] / 255, T.fogRGB[1] / 255, T.fogRGB[2] / 255), 900, 4200);
  skidGeo.setDrawRange(0, 0); skidHead = 0; parts.length = 0;
  drawMiniBase();
}

// ═══════════════════════ audio: engine, effects and a synthesized soundtrack ═══════════════════════
const OPT = { music: 0.7, sfx: 0.8, engine: 0.6, mirror: true, perf: false, stick: true }; try { Object.assign(OPT, JSON.parse(localStorage.getItem('pk_opt') || '{}')); } catch (e) {}
function saveOpt() { try { localStorage.setItem('pk_opt', JSON.stringify(OPT)); } catch (e) {} }

// ── progression ──────────────────────────────────────────────────────────────
// Everything unlockable lives here. Paints open up as you finish races; the
// Summit Cup opens when you finish an Island Cup on the podium.
const PAINTS_FREE = 4;
const SAVE = { races: 0, islandPodium: false };
function saveProg() { try { localStorage.setItem('pk_progress', JSON.stringify(SAVE)); } catch (e) {} }
const paintsUnlocked = () => Math.min(PAINTS.length, PAINTS_FREE + SAVE.races);
const summitUnlocked = () => SAVE.islandPodium;
try {
  const raw = localStorage.getItem('pk_progress');
  if (raw) Object.assign(SAVE, JSON.parse(raw));
  else {
    // Anyone who played before unlocks existed keeps what they already had:
    // a saved lap on any circuit means the whole game was open to them.
    let played = false; for (let i = 0; i < TRACKS.length; i++) if (localStorage.getItem('pk_best_' + i)) played = true;
    if (played) { SAVE.races = PAINTS.length; SAVE.islandPodium = true; }
    saveProg();
  }
} catch (e) {}
function resetProgress() {
  try { localStorage.removeItem('pk_progress'); for (let i = 0; i < TRACKS.length; i++) localStorage.removeItem('pk_best_' + i); } catch (e) {}
  SAVE.races = 0; SAVE.islandPodium = false; saveProg();
  if (PAINTS.indexOf(S.paint) >= paintsUnlocked()) S.paint = PAINTS[0];
  refreshUnlocks(); renderBoard();
}
let AC = null, master = null, sfxBus = null, engA = null, engB = null, engGain = null, engFilter = null, skidNoise = null, skidGain = null, skidFilter = null, squeal = null, squealGain = null, musicOn = true, musicState = null;
function audioInit() {
  if (AC) return; try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  master = AC.createGain(); master.gain.value = 0.8; const comp = AC.createDynamicsCompressor(); master.connect(comp); comp.connect(AC.destination);
  sfxBus = AC.createGain(); sfxBus.gain.value = OPT.sfx; sfxBus.connect(master);
  engA = AC.createOscillator(); engA.type = 'triangle'; engB = AC.createOscillator(); engB.type = 'sawtooth'; engB.detune.value = 6;
  const sub = AC.createOscillator(); sub.type = 'sine';
  engFilter = AC.createBiquadFilter(); engFilter.type = 'lowpass'; engFilter.frequency.value = 380; engFilter.Q.value = 0.8;
  engGain = AC.createGain(); engGain.gain.value = 0; const bGain = AC.createGain(); bGain.gain.value = 0.18; const sGain = AC.createGain(); sGain.gain.value = 0.7;
  engA.connect(engFilter); engB.connect(bGain); bGain.connect(engFilter); sub.connect(sGain); sGain.connect(engGain); engFilter.connect(engGain); engGain.connect(master);
  engA.start(); engB.start(); sub.start(); engA.userData = sub;
  const nb = AC.createBuffer(1, AC.sampleRate * 2, AC.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  // tyre squeal: filtered noise (the rubber scrub) plus a wavering tone (the screech), both driven by slip
  skidNoise = AC.createBufferSource(); skidNoise.buffer = nb; skidNoise.loop = true; skidFilter = AC.createBiquadFilter(); skidFilter.type = 'bandpass'; skidFilter.frequency.value = 1400; skidFilter.Q.value = 1.6;
  skidGain = AC.createGain(); skidGain.gain.value = 0; skidNoise.connect(skidFilter); skidFilter.connect(skidGain); skidGain.connect(sfxBus); skidNoise.start();
  squeal = AC.createOscillator(); squeal.type = 'sawtooth'; squeal.frequency.value = 900; const sqF = AC.createBiquadFilter(); sqF.type = 'bandpass'; sqF.frequency.value = 1800; sqF.Q.value = 4;
  const vib = AC.createOscillator(); vib.frequency.value = 9; const vibG = AC.createGain(); vibG.gain.value = 40; vib.connect(vibG); vibG.connect(squeal.frequency); vib.start();
  squealGain = AC.createGain(); squealGain.gain.value = 0; squeal.connect(sqF); sqF.connect(squealGain); squealGain.connect(sfxBus); squeal.start();
  noiseBuf = nb;
}
let noiseBuf = null;
function tone(f, dur = 0.1, type = 'square', vol = 0.12, slide = 0, t0 = 0) {
  if (!AC) return; const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f + slide), t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + dur + 0.02);
}
function noiseHit(dur = 0.2, vol = 0.2, freq = 800, t0 = 0) {
  if (!AC) return; const s = AC.createBufferSource(); s.buffer = noiseBuf; const f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8; const g = AC.createGain(); const t = AC.currentTime + t0;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t); s.stop(t + dur + 0.02);
}
const SFX = {
  pickup: () => { tone(880, 0.06, 'square', 0.08); tone(1320, 0.08, 'square', 0.08, 0, 0.06); },
  itemReady: () => { tone(660, 0.08, 'triangle', 0.1); tone(990, 0.12, 'triangle', 0.1, 0, 0.08); },
  hit: () => { noiseHit(0.35, 0.3, 500); tone(140, 0.35, 'sawtooth', 0.15, -80); },
  bump: () => { noiseHit(0.08, 0.12, 300); },
  wall: () => { noiseHit(0.15, 0.2, 200); tone(90, 0.15, 'square', 0.1); },
  boost: big => { tone(big ? 520 : 440, 0.35, 'sawtooth', 0.12, big ? 700 : 400); noiseHit(0.4, 0.15, 2500); },
  hop: () => tone(320, 0.06, 'triangle', 0.06),
  nitro: () => { tone(300, 0.5, 'sawtooth', 0.12, 900); noiseHit(0.5, 0.18, 3000); },
  rocket: () => { noiseHit(0.6, 0.25, 900); tone(200, 0.6, 'sawtooth', 0.1, 500); },
  storm: () => { noiseHit(0.9, 0.35, 250); tone(60, 0.9, 'sawtooth', 0.18, -30); },
  surge: () => { for (let i = 0; i < 4; i++) tone(500 + i * 180, 0.15, 'triangle', 0.08, 0, i * 0.07); },
  lap: () => { tone(720, 0.12, 'square', 0.08); tone(960, 0.2, 'square', 0.08, 0, 0.1); },
  count: () => tone(440, 0.15, 'square', 0.1), go: () => tone(880, 0.4, 'square', 0.12),
  finish: () => { [660, 880, 1180, 1320].forEach((f, i) => tone(f, i === 3 ? 0.6 : 0.15, 'square', 0.1, 0, i * 0.15)); },
  land: () => noiseHit(0.12, 0.15, 400),
  charge: big => { tone(big ? 1040 : 780, 0.09, 'triangle', 0.09); tone(big ? 1560 : 1170, 0.14, 'triangle', 0.08, 0, 0.08); },
  pad: () => { tone(520, 0.25, 'triangle', 0.1, 500); noiseHit(0.25, 0.1, 3000); },
  rocketStart: () => { tone(400, 0.3, 'sawtooth', 0.12, 800); noiseHit(0.4, 0.2, 2500); },
  stall: () => { for (let i = 0; i < 5; i++) noiseHit(0.08, 0.15, 900, i * 0.12); },
  respawn: () => { tone(300, 0.2, 'triangle', 0.08, 300); },
  comet: () => { tone(200, 0.8, 'sawtooth', 0.12, 1200); noiseHit(0.8, 0.25, 1200); },
  pause: () => tone(500, 0.08, 'triangle', 0.08),
  slip: () => tone(700, 0.12, 'triangle', 0.06, 300),
};
// ── soundtrack: a small step sequencer with bass, chords, lead and drums, keyed per circuit ──
const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10] };
const PROG = { major: [[0, 'M'], [5, 'm'], [3, 'M'], [4, 'M']], minor: [[0, 'm'], [5, 'M'], [3, 'M'], [4, 'm']] };
const midi = n => 440 * Math.pow(2, (n - 69) / 12);
function musicStart(cfg) {
  if (!AC) return; musicStop();
  const st = { cfg, step: 0, next: AC.currentTime + 0.1, timer: null, gain: AC.createGain(), rnd: mulberry(cfg.root * 7 + 3) };
  st.gain.gain.value = 0; st.gain.connect(master); st.gain.gain.setTargetAtTime(musicOn ? 0.42 * OPT.music : 0, AC.currentTime, 0.5); musicState = st;
  const stepDur = 60 / cfg.bpm / 4, scale = SCALES[cfg.mode], base = 48 + cfg.root;
  const inst = (type, f, t, dur, vol, cutoff = 2000, q = 1) => { const o = AC.createOscillator(), g = AC.createGain(), fl = AC.createBiquadFilter(); o.type = type; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.setValueAtTime(cutoff, t); fl.frequency.exponentialRampToValueAtTime(cutoff * 0.3, t + dur); fl.Q.value = q; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + dur); o.connect(fl); fl.connect(g); g.connect(st.gain); o.start(t); o.stop(t + dur + 0.05); };
  const kick = t => { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12); g.gain.setValueAtTime(0.6, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.25); o.connect(g); g.connect(st.gain); o.start(t); o.stop(t + 0.3); };
  const hat = (t, open) => { const s = AC.createBufferSource(); s.buffer = noiseBuf; const f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000; const g = AC.createGain(); g.gain.setValueAtTime(open ? 0.12 : 0.07, t); g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.18 : 0.05)); s.connect(f); f.connect(g); g.connect(st.gain); s.start(t); s.stop(t + 0.2); };
  const snare = t => { const s = AC.createBufferSource(); s.buffer = noiseBuf; const f = AC.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; const g = AC.createGain(); g.gain.setValueAtTime(0.28, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16); s.connect(f); f.connect(g); g.connect(st.gain); s.start(t); s.stop(t + 0.2); tone(190, 0.1, 'triangle', 0.15, -60, t - AC.currentTime); };
  const melody = []; let cur = 5; for (let i = 0; i < 64; i++) { const r = st.rnd(); if (r < 0.5 || i % 2 === 1) melody.push(null); else { cur += r < 0.7 ? 1 : r < 0.85 ? -1 : r < 0.93 ? 2 : -2; cur = Math.max(2, Math.min(10, cur)); melody.push(cur); } }
  st.timer = setInterval(() => {
    while (st.next < AC.currentTime + 0.25) {
      const t = st.next, s = st.step, bar = (s >> 4) % 4, [deg, kind] = PROG[cfg.mode][bar], rootN = base + scale[deg];
      const chord = kind === 'M' ? [0, 4, 7] : [0, 3, 7];
      if (s % 8 === 0 || s % 16 === 10) kick(t); if (s % 8 === 4) snare(t); if (s % 2 === 0) hat(t, s % 8 === 6);
      if (s % 4 === 0) inst('triangle', midi(rootN - 12 + (s % 8 === 4 ? 7 : 0)), t, stepDur * 3.6, 0.3, 500, 1);
      if (s % 16 === 0) for (const c of chord) inst('triangle', midi(rootN + c), t, stepDur * 15.5, 0.1, 1400);
      if (s % 16 === 8) for (const c of chord) inst('sawtooth', midi(rootN + c + 12), t, stepDur * 7.5, 0.025, 1500, 1);
      const m = melody[s % 64]; if (m !== null) { const oct = Math.floor(m / 7), n = base + 12 + oct * 12 + scale[m % 7]; inst('triangle', midi(n), t, stepDur * (st.rnd() < 0.4 ? 3.8 : 1.9), 0.11, 2200, 1); }
      st.next += stepDur; st.step++;
    }
  }, 60);
}
function musicStop() { if (musicState) { clearInterval(musicState.timer); const g = musicState.gain; g.gain.setTargetAtTime(0, AC.currentTime, 0.4); setTimeout(() => g.disconnect(), 1500); musicState = null; } }

// ═══════════════════════ state ═══════════════════════
const DIFF = [{ name: 'Easy', skill: 0.76, band: [1.03, 0.86], items: 2.4 }, { name: 'Normal', skill: 0.87, band: [1.12, 0.94], items: 1 }, { name: 'Hard', skill: 0.97, band: [1.16, 0.99], items: 0.6 }];
const S = { mode: 'title', sel: 0, model: 0, paint: PAINTS[0], trk: 0, gp: null, diff: 1, prevMode: null, goT: 0, throttleAt: null, ghost: null, ghostMesh: null, best: null, finishT: 0, karts: [], hazards: [], t: 0, countdown: 0, raceTime: 0, msg: '', msgT: 0, shake: 0 };
const keys = {}, touch = { steer: 0, drift: false, active: false };
let player = null;
function makeKart(ch, idx, lane, model, paint) {
  const startIdx = N - 22 - idx * 9, dd = tdir(startIdx);
  const k = { ch, model, paint, ai: true, x: TX[startIdx] - dd[1] * lane, y: TY[startIdx] + dd[0] * lane, z: TZ[startIdx], vz: 0, air: false, a: Math.atan2(dd[1], dd[0]), v: 0, vlat: 0, steer: 0, lap: 0, idx: startIdx, progress: 0,
    drift: 0, driftDir: 0, charge: 0, boost: 0, spin: 0, shrink: 0, surge: 0, hop: 0, item: null, roulette: 0, cooldown: 2 + Math.random() * 3, lane: (Math.random() - 0.5) * 60,
    finished: false, finishTime: 0, rank: idx + 1, tilt: 0, wheel: 0, aiSkill: DIFF[S.diff].skill + Math.random() * 0.08, aiSpeedT: 0, touchT: 0, braking: false, pitch: 0, roll: 0,
    laps: [], lapStart: 0, rec: [], recT: 0, wrongT: 0, stuckT: 0, slipT: 0, slipOn: false, stall: 0, padT: 0, laneVar: (Math.random() - 0.5) * 24, ovT: 0, ovDir: 0, chargeLvl: 0 };
  k.mesh = buildKart(ch, model, paint); scene.add(k.mesh); return k;
}
function startRace() {
  for (const k of S.karts) scene.remove(k.mesh); for (const h of S.hazards) if (h.mesh) scene.remove(h.mesh);
  buildTrack(TRACKS[S.trk]);
  S.karts = []; S.hazards = []; S.raceTime = 0; S.countdown = 4.2; S.msg = ''; S.mode = 'countdown'; introT = 0;
  const order = [S.sel, ...CHARS.map((_, i) => i).filter(i => i !== S.sel)];
  const usedPaint = [S.paint];
  order.forEach((ci, i) => { let mdl = KART_MODELS[S.model], pt = S.paint; if (i) { mdl = KART_MODELS[(Math.random() * KART_MODELS.length) | 0]; const free = PAINTS.filter(p => !usedPaint.includes(p)); pt = free.length ? free[(Math.random() * free.length) | 0] : CHARS[ci].body; usedPaint.push(pt); } const k = makeKart(CHARS[ci], i, (i % 2 ? 30 : -30), mdl, pt); k.ai = i !== 0; S.karts.push(k); });
  player = S.karts[0]; camState.a = player.a; camState.fov = 62;
  showScreen(null); ui.hud.style.display = 'block'; ui.trackName.textContent = T.name + (S.gp ? ' · ' + S.gp.name + ' race ' + (S.gp.race + 1) + ' of ' + S.gp.list.length : '');
  setItemIcon(null); ui.center.textContent = ''; lastCount = 5; lastRank = 0; S.throttleAt = null;
  if (S.ghostMesh) { scene.remove(S.ghostMesh); S.ghostMesh = null; } S.best = null;
  try { const b = JSON.parse(localStorage.getItem('pk_best_' + S.trk) || 'null'); if (b && b.rec && b.rec.length > 20) { S.best = b; S.ghostMesh = ghostKart(CHARS[b.ch] || CHARS[0], KART_MODELS[b.model] || KART_MODELS[0], b.paint || '#FFFFFF'); S.ghostMesh.matrixAutoUpdate = true; S.ghostMesh.visible = false; scene.add(S.ghostMesh); } } catch (e) {}
  if (AC) musicStart(T.music);
}

// ═══════════════════════ physics ═══════════════════════
function updateKart(k, dt) {
  const ch = k.ch, onSC = onShortcut(k.x, k.y) >= 0, onRoad = distToTrack(k.x, k.y, k.idx) < ROADW + 8 || onSC;
  const md = k.model; let maxV = 300 * ch.speed * md.speed, accel = 170 * ch.accel * md.accel, turn = 2.3 * ch.handling * md.handling;
  if (!onRoad && !k.surge) { maxV *= 0.45; accel *= 0.5; }
  if (onSC) maxV *= 0.88;
  if (k.slipOn) maxV *= 1.08;
  if (k.boost > 0) { maxV *= 1.35; accel *= 2.2; }
  if (k.surge > 0) maxV *= 1.25; if (k.shrink > 0) maxV *= 0.7;
  let throttle = 0, steer = 0, driftKey = false, useItem = false;
  if (!k.ai && !window.__auto) {
    if (keys.ArrowUp || keys.KeyW || touch.active) throttle = 1; if (keys.ArrowDown || keys.KeyS) throttle = -1;
    if (keys.ArrowLeft || keys.KeyA) steer += 1; if (keys.ArrowRight || keys.KeyD) steer -= 1; steer = Math.max(-1, Math.min(1, steer + touch.steer));   // +angle = left in this z-up world
    driftKey = !!(keys.Space || keys.ShiftLeft || keys.ShiftRight || touch.drift); useItem = !!keys._useItem; keys._useItem = false;
    if (S.mode === 'countdown') { if (throttle > 0) { if (S.throttleAt === null) S.throttleAt = S.countdown; } else S.throttleAt = null; }
    // slipstream: tuck in behind another kart for half a second to gain speed
    let ahead = false; const cx = Math.cos(k.a), cy = Math.sin(k.a);
    for (const o of S.karts) { if (o === k) continue; const dx = o.x - k.x, dy = o.y - k.y, f = dx * cx + dy * cy, l = -dx * cy + dy * cx; if (f > 12 && f < 60 && Math.abs(l) < 13 && Math.abs(o.z - k.z) < 10) ahead = true; }
    k.slipT = ahead && k.v > 150 ? k.slipT + dt : Math.max(0, k.slipT - dt * 2);
    const slipNow = k.slipT > 0.5; if (slipNow && !k.slipOn) { SFX.slip(); flash('SLIPSTREAM', 0.8); } k.slipOn = slipNow;
    if (driftKey && !k.drift && Math.abs(steer) < 0.2) throttle = k.v > 5 ? -1 : 0;
  } else {
    k.aiSpeedT -= dt; if (k.aiSpeedT < 0) { k.aiSpeedT = 1.5 + Math.random() * 2; k.lane = (Math.random() - 0.5) * 70; }
    // racing line with apex cutting, plus a temporary sidestep to overtake a kart directly ahead
    k.ovT -= dt; if (k.ovT <= 0) { const cx = Math.cos(k.a), cy = Math.sin(k.a); for (const o of S.karts) { if (o === k) continue; const dx = o.x - k.x, dy = o.y - k.y, f = dx * cx + dy * cy, l = -dx * cy + dy * cx; if (f > 8 && f < 40 && Math.abs(l) < 14 && k.v > o.v - 20) { k.ovDir = l > 0 ? -1 : 1; k.ovT = 1.4; break; } } }
    const la = (k.idx + 22) % N, d = tdir(la), lane = RL[la] + k.laneVar + (k.ovT > 0 ? k.ovDir * 30 : 0), tx = TX[la] - d[1] * lane, ty = TY[la] + d[0] * lane;   // positive lane = left (inside of a left turn)
    let da = Math.atan2(ty - k.y, tx - k.x) - k.a; da = Math.atan2(Math.sin(da), Math.cos(da));
    steer = Math.max(-1, Math.min(1, da * 3)); const sharp = Math.abs(da); throttle = sharp > 1.1 ? 0.2 : 1;
    const gap = player.progress - k.progress, band = DIFF[S.diff].band; maxV *= k.aiSkill * (gap > 40 ? band[0] : gap < -40 ? band[1] : 1.0);
    driftKey = sharp > 0.5 && k.v > maxV * 0.6;
    if (k.item && k.roulette <= 0) { k.cooldown -= dt; if (k.cooldown < 0) { useItem = true; k.cooldown = (2 + Math.random() * 4) * DIFF[S.diff].items; } }
  }
  if (S.mode !== 'race' || k.finished) { throttle = k.finished ? 0.35 : 0; if (!k.finished) steer = 0; driftKey = false; useItem = false; }
  if (k.stall > 0) { k.stall -= dt; throttle = 0; if (Math.random() < 0.6) spawn(k.x - Math.cos(k.a) * 9, k.y - Math.sin(k.a) * 9, k.z + 2, 0.5, 0.5, 0.5, 6, 0.6, 12); }
  if (k.spin > 0) { throttle = 0; steer = 0; driftKey = false; }
  if (k.air) { steer *= 0.25; driftKey = k.drift ? driftKey : false; }
  // drift start / end
  if (driftKey && !k.drift && Math.abs(steer) >= 0.2 && k.v > maxV * 0.4 && !k.air) { k.drift = 1; k.driftDir = Math.sign(steer); k.charge = 0; k.hop = 0.28; if (!k.ai) SFX.hop(); }
  if (k.drift && (!driftKey || k.v < 60)) {
    if (k.charge >= 1.5) { k.boost = 1.3; k.v = Math.max(k.v, 300 * ch.speed * 1.3); if (!k.ai) { SFX.boost(true); flash('SUPER TURBO!'); } }
    else if (k.charge >= 0.6) { k.boost = 0.7; k.v = Math.max(k.v, 300 * ch.speed * 1.18); if (!k.ai) SFX.boost(false); }
    k.drift = 0; k.charge = 0; k.chargeLvl = 0;
  }
  if (k.hop > 0) k.hop -= dt;
  const speedFrac = Math.min(1, Math.abs(k.v) / 300); let dA;
  if (k.drift) {
    k.charge += dt; const lvl = k.charge >= 1.5 ? 2 : k.charge >= 0.6 ? 1 : 0; if (lvl !== k.chargeLvl) { k.chargeLvl = lvl; if (!k.ai && lvl) SFX.charge(lvl === 2); }
    dA = k.driftDir * turn * (0.72 + 0.34 * steer * k.driftDir) * Math.sqrt(speedFrac) * dt;
    const cs = Math.cos(k.a), sn = Math.sin(k.a), col = k.charge >= 1.5 ? [1, 0.5, 0.1] : k.charge >= 0.6 ? [0.3, 0.7, 1] : [1, 0.95, 0.85];
    for (const side of [-1, 1]) if (Math.random() < 0.9) spawn(k.x - cs * 8 - sn * side * 8, k.y - sn * 8 + cs * side * 8, k.z + 1.5, col[0], col[1], col[2], k.charge >= 0.6 ? 5 : 3, 0.3, 12 + Math.random() * 20, (Math.random() - 0.5) * 30 - cs * 40, (Math.random() - 0.5) * 30 - sn * 40);
  } else dA = steer * turn * Math.sqrt(speedFrac) * (k.v < 0 ? -1 : 1) * dt;
  k.a += dA;
  const nv = k.v * Math.cos(dA) + k.vlat * Math.sin(dA), nl = -k.v * Math.sin(dA) + k.vlat * Math.cos(dA); k.v = nv; k.vlat = nl;
  k.steer += (steer - k.steer) * Math.min(1, dt * 12);
  const grip = k.air ? 0.5 : k.drift ? 10 : 14, mag0 = Math.hypot(k.v, k.vlat);
  k.vlat -= k.vlat * Math.min(1, grip * dt);
  if (k.drift && mag0 > 1) { const mag1 = Math.hypot(k.v, k.vlat), want = mag1 + (mag0 - mag1) * 0.85; if (mag1 > 1) { k.v *= want / mag1; k.vlat *= want / mag1; } }
  if (!onRoad) k.vlat *= Math.pow(0.05, dt);
  if (throttle > 0 && !k.air) k.v += accel * throttle * dt; else if (throttle < 0) k.v -= (k.v > 0 ? 260 : 80) * dt; else k.v -= Math.sign(k.v) * Math.min(Math.abs(k.v), (k.air ? 20 : 90) * dt);
  if (k.v > maxV) k.v -= Math.min(k.v - maxV, (onRoad ? (k.boost > 0 ? 60 : 140) : 380) * dt);
  if (k.v < -90) k.v = -90;
  if (k.spin > 0) { k.v *= Math.pow(0.2, dt); k.vlat *= Math.pow(0.2, dt); k.spin -= dt; }
  if (k.boost > 0) k.boost -= dt; if (k.surge > 0) k.surge -= dt; if (k.shrink > 0) k.shrink -= dt; if (k.touchT > 0) k.touchT -= dt;
  const cA = Math.cos(k.a), sA = Math.sin(k.a);
  k.x += (cA * k.v - sA * k.vlat) * dt; k.y += (sA * k.v + cA * k.vlat) * dt;
  k.x = Math.max(20, Math.min(WORLD - 20, k.x)); k.y = Math.max(20, Math.min(WORLD - 20, k.y));
  k.wheel += k.v * dt * 0.28; k.braking = throttle < 0 && k.v > 5;
  // elevation: follow the ground, or fly ballistically off crests and land again
  const prev = k.idx; k.idx = nearestIdx(k.x, k.y, k.idx);
  const g = groundH(k.x, k.y, k.idx);
  if (!k.air) {
    const rate = (g - k.z) / dt;
    const ballistic = k.z + k.vz * dt - 0.5 * GRAV * dt * dt;
    if (g < ballistic - 1.5 && k.v > 80) { k.air = true; k.vz = Math.min(k.vz, 140); if (!k.ai) window.__jumps = (window.__jumps || 0) + 1; } else { k.vz = rate; k.z = g; }
    const gA = groundH(k.x + cA * 12, k.y + sA * 12, k.idx), gB = groundH(k.x - cA * 12, k.y - sA * 12, k.idx); k.pitch = Math.atan2(gA - gB, 24);
    const gL = groundH(k.x - sA * 8, k.y + cA * 8, k.idx), gR = groundH(k.x + sA * 8, k.y - cA * 8, k.idx); k.roll = Math.atan2(gL - gR, 16);
    k.v -= Math.sin(k.pitch) * 160 * dt;                 // uphill slows, downhill speeds up
  }
  if (k.air) { k.vz -= GRAV * dt; k.z += k.vz * dt; k.pitch += (Math.atan2(k.vz, Math.max(60, k.v)) * 0.6 - k.pitch) * dt * 4; if (k.z <= g) { k.z = g; k.air = false; k.vz = 0; if (!k.ai) { SFX.land(); S.shake = Math.max(S.shake, 0.15); } for (let i = 0; i < 10; i++) spawn(k.x + (Math.random() - 0.5) * 16, k.y + (Math.random() - 0.5) * 16, g + 1, 0.6, 0.55, 0.45, 5, 0.5, 15 + Math.random() * 20); } }
  if (prev > N - 40 && k.idx < 40) { k.lap++; if (k.lap >= 2 && !k.finished) { const lt = S.raceTime - k.lapStart; k.laps.push(lt); if (!k.ai) onPlayerLap(lt); } k.lapStart = S.raceTime; if (!k.ai) { k.rec = []; k.recT = 0; } if (!k.ai && k.lap >= 2 && k.lap <= LAPS) { flash(k.lap === LAPS ? 'FINAL LAP!' : 'LAP ' + k.lap); SFX.lap(); } }
  else if (prev < 40 && k.idx > N - 40) k.lap--;
  const d = tdir(k.idx), frac = Math.max(0, Math.min(1, ((k.x - TX[k.idx]) * d[0] + (k.y - TY[k.idx]) * d[1]) / 3.3));
  k.progress = (k.lap - 1) * N + k.idx + frac;
  if (k.lap > LAPS && !k.finished) { k.finished = true; k.finishTime = S.raceTime; if (!k.ai) onPlayerFinish(); }
  // boost pads
  k.padT -= dt; if (k.padT <= 0) for (const p of PADS) { const dx = k.x - p.x, dy = k.y - p.y; if (Math.abs(dx) < 20 && Math.abs(dy) < 20 && Math.hypot(dx, dy) < 15 && Math.abs(k.z - p.z) < 8) { k.boost = Math.max(k.boost, 0.9); k.v = Math.max(k.v, 300 * ch.speed * 1.22); k.padT = 1; if (!k.ai) SFX.pad(); break; } }
  if (!k.ai && S.mode === 'race') {
    // wrong-way warning and auto-respawn when stuck or far off the circuit
    const back = (k.v * Math.cos(k.a) * tdir(k.idx)[0] + k.v * Math.sin(k.a) * tdir(k.idx)[1]) < -40;
    k.wrongT = back ? k.wrongT + dt : 0; if (k.wrongT > 1.2) flash('WRONG WAY', 0.3);
    const far = distToTrack(k.x, k.y, k.idx) > ROADW + 240 && !onSC, stuck = throttle > 0 && Math.abs(k.v) < 12 && !k.air && k.spin <= 0 && k.stall <= 0;
    k.stuckT = (far || stuck) ? k.stuckT + dt : 0;
    if (k.stuckT > (far ? 1.5 : 3)) { const i = k.idx, d = tdir(i); k.x = TX[i]; k.y = TY[i]; k.z = TZ[i]; k.a = Math.atan2(d[1], d[0]); k.v = 0; k.vlat = 0; k.vz = 0; k.air = false; k.drift = 0; k.stuckT = 0; k.wrongT = 0; S.shake = 0.3; SFX.respawn(); flash('BACK ON TRACK', 1); }
    // lap recording for the ghost (10 samples / s)
    k.recT += dt; if (k.recT >= 0.1) { k.recT -= 0.1; k.rec.push([Math.round(k.x), Math.round(k.y), Math.round(k.z), +k.a.toFixed(3)]); }
  }
  if (k.roulette > 0) { k.roulette -= dt; if (k.roulette <= 0 && !k.ai) { setItemIcon(k.item); SFX.itemReady(); } }
  if (useItem && k.item && k.roulette <= 0) fireItem(k);
  k.tilt += ((k.drift ? k.driftDir * 0.5 : k.steer * 0.25) - k.tilt) * Math.min(1, dt * 8);
  // skid marks, dust and exhaust
  if ((k.drift || k.spin > 0) && Math.abs(k.v) > 40 && !k.air) for (const side of [-1, 1]) addSkid(k.x - cA * 8 - sA * side * 8.5, k.y - sA * 8 + cA * side * 8.5, k.z, k.a);
  if (!onRoad && Math.abs(k.v) > 60 && Math.random() < 0.6 && !k.air) { const m = hex3(T.mottle[1]); spawn(k.x - cA * 10 + (Math.random() - 0.5) * 10, k.y - sA * 10 + (Math.random() - 0.5) * 10, k.z + 2, m[0], m[1], m[2], 7, 0.6, 14, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20); }
  if (throttle > 0 && onRoad && Math.random() < 0.15) spawn(k.x - cA * 15, k.y - sA * 15, k.z + 6, 0.35, 0.35, 0.38, 3, 0.5, 10, -cA * 20, -sA * 20);
}
function onPlayerFinish() { flash('FINISH!'); SFX.finish(); musicStop(); S.finishT = S.t; setTimeout(showResults, 3200); }
function onPlayerLap(lt) {
  const best = S.best; const isBest = !best || lt < best.time;
  if (isBest) { S.best = { time: lt, rec: player.rec.slice(), ch: CHARS.indexOf(player.ch), model: S.model, paint: S.paint }; try { localStorage.setItem('pk_best_' + S.trk, JSON.stringify(S.best)); } catch (e) {} flash('BEST LAP ' + fmtTime(lt), 1.4); }
  else flash('LAP ' + fmtTime(lt), 1);
}
function fireItem(k) {
  const it = k.item; k.item = null; if (!k.ai) setItemIcon(null);
  const dx = Math.cos(k.a), dy = Math.sin(k.a);
  if (it === 'nitro') { k.boost = 1.3; k.v = Math.max(k.v, 240); if (!k.ai) SFX.nitro(); }
  else if (it === 'banana') addHazard({ type: 'banana', x: k.x - dx * 26, y: k.y - dy * 26, life: 40, owner: k, r: 12 });
  else if (it === 'ball') addHazard({ type: 'ball', x: k.x + dx * 24, y: k.y + dy * 24, a: k.a, v: 380, life: 7, owner: k, r: 13, idx: k.idx });
  else if (it === 'rocket') { const ahead = S.karts.filter(o => o !== k && !o.finished && o.progress > k.progress).sort((a, b) => a.progress - b.progress)[0] || null; addHazard({ type: 'rocket', x: k.x + dx * 24, y: k.y + dy * 24, a: k.a, v: 420, life: 8, owner: k, r: 13, target: ahead, idx: k.idx }); if (!k.ai) SFX.rocket(); }
  else if (it === 'storm') { for (const o of S.karts) if (o !== k && !o.surge) { o.shrink = 5; o.spin = Math.max(o.spin, 0.8); } S.shake = 0.5; flash('THUNDERSTORM!'); SFX.storm(); }
  else if (it === 'surge') { k.surge = 6; k.boost = 0.4; if (!k.ai) SFX.surge(); }
  else if (it === 'comet') { const leader = S.karts.slice().sort((a, b) => a.rank - b.rank).find(o => o !== k && !o.finished) || null; addHazard({ type: 'comet', x: k.x + dx * 24, y: k.y + dy * 24, a: k.a, v: 720, life: 14, owner: k, r: 16, target: leader, idx: k.idx }); flash('LEADER COMET!'); SFX.comet(); }
}
function addHazard(h) {
  h.z = groundH(h.x, h.y, null); h.idx = h.idx ?? nearestIdx(h.x, h.y, null);
  if (h.type === 'banana') { h.mesh = new THREE.Group(); const b = mesh(loftGeom([{ x: -9, hw: 1.2, zc: 4, hh: 1.2 }, { x: -3, hw: 2.6, zc: 1.6, hh: 2 }, { x: 4, hw: 2.4, zc: 1.4, hh: 1.8 }, { x: 10, hw: 1, zc: 4.5, hh: 1 }], 10, 0.8), mat('#FFD23F', { rough: 0.5 })); h.mesh.add(b); h.mesh.rotation.z = Math.random() * 6; }
  else if (h.type === 'ball') { h.mesh = mesh(new THREE.SphereGeometry(11, 20, 14), mat('#3B3F6B', { rough: 0.2, metal: 0.3 })); }
  else if (h.type === 'comet') { h.mesh = new THREE.Group(); const core = mesh(new THREE.SphereGeometry(7, 16, 12), new THREE.MeshStandardMaterial({ color: 0x8FD3FF, emissive: 0x4FA8FF, emissiveIntensity: 1.6, roughness: 0.2 }), false); h.mesh.add(core); const gl = makeGlow('#6FB8FF', 70, 0.9); h.mesh.add(gl); }
  else { h.mesh = new THREE.Group(); const body = mesh(loftGeom([{ x: -10, hw: 3, zc: 0, hh: 3 }, { x: 4, hw: 3.4, zc: 0, hh: 3.4 }, { x: 12, hw: 0.4, zc: 0, hh: 0.4 }], 12, 1), mat('#FF7A1F', { rough: 0.3, metal: 0.3 })); h.mesh.add(body); for (const s of [-1, 1]) h.mesh.add(boxM(-8, s * 3.5, 0, 5, 1, 4, mat('#FFD23F'))); const gl = makeGlow('#FF9A3F', 40, 0.8); gl.position.x = -12; h.mesh.add(gl); }
  h.mesh.castShadow = true; scene.add(h.mesh); S.hazards.push(h);
}
function hitKart(k, byWhat) {
  if (k.surge > 0 || k.spin > 0) return;
  k.spin = byWhat === 'banana' ? 0.9 : 1.3; k.v *= 0.3; if (k.item && Math.random() < 0.5) { k.item = null; if (!k.ai) setItemIcon(null); }
  if (k === player) { S.shake = 0.4; SFX.hit(); }
  for (let i = 0; i < 16; i++) spawn(k.x, k.y, k.z + 8, 1, 0.8, 0.3, 6, 0.6, 30 + Math.random() * 40, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 120);
}
function pickItem(k) {
  const r = k.rank, pool = r <= 2 ? ['banana', 'banana', 'ball', 'nitro'] : r <= 4 ? ['nitro', 'ball', 'rocket', 'banana', 'rocket'] : ['nitro', 'rocket', 'storm', 'surge', 'comet', 'rocket', 'comet'];
  k.item = pool[(Math.random() * pool.length) | 0]; k.roulette = 1.4; if (!k.ai) { setItemIcon('?'); SFX.pickup(); }
}
function updateWorld(dt) {
  S.t += dt;
  for (const k of S.karts) updateKart(k, dt);
  const sorted = S.karts.slice().sort((a, b) => (b.finished - a.finished) || (a.finished && b.finished ? a.finishTime - b.finishTime : b.progress - a.progress)); sorted.forEach((k, i) => k.rank = i + 1);
  for (let i = 0; i < S.karts.length; i++) for (let j = i + 1; j < S.karts.length; j++) {
    const a = S.karts[i], b = S.karts[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    if (d < 22 && d > 0.01 && Math.abs(a.z - b.z) < 12) {
      const push = (22 - d) * Math.min(1, dt * 9), nx = dx / d, ny = dy / d, wa = a.surge ? 0 : 0.5, wb = b.surge ? 0 : 0.5;
      a.x -= nx * push * wa; a.y -= ny * push * wa; b.x += nx * push * wb; b.y += ny * push * wb;
      if (a.surge && !b.surge) hitKart(b, 'surge'); if (b.surge && !a.surge) hitKart(a, 'surge');
      a.v -= a.v * 0.5 * dt; b.v -= b.v * 0.5 * dt;
      if ((a === player || b === player) && player.touchT <= 0) { player.touchT = 0.5; SFX.bump(); }
    }
  }
  for (const k of S.karts) for (const o of OBST) { const dx = k.x - o.x, dy = k.y - o.y; if (Math.abs(dx) > 18 || Math.abs(dy) > 18) continue; const d = Math.hypot(dx, dy); if (d < 17 && d > 0.01) { k.x = o.x + dx / d * 17; k.y = o.y + dy / d * 17; if (k.touchT <= 0) { k.v *= 0.55; k.vlat = 0; k.touchT = 0.3; if (k === player) { S.shake = 0.2; SFX.wall(); } } } }
  for (const bx of BOXES) { if (bx.t > 0) { bx.t -= dt; continue; } for (const k of S.karts) if (!k.item && k.roulette <= 0 && Math.hypot(k.x - bx.x, k.y - bx.y) < 20 && Math.abs(k.z - bx.z) < 20) { bx.t = 4; pickItem(k); for (let i = 0; i < 14; i++) spawn(bx.x, bx.y, bx.z + 12, Math.random(), Math.random(), 1, 5, 0.6, 20 + Math.random() * 30, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80); break; } }
  for (const h of S.hazards) {
    h.life -= dt;
    if (h.type === 'comet') {   // rides the racing line at high speed, then dives onto the leader
      h.idx = nearestIdx(h.x, h.y, h.idx); const tgt = h.target; const near = tgt && Math.hypot(tgt.x - h.x, tgt.y - h.y) < 140;
      const la = (h.idx + 14) % N, want = near ? Math.atan2(tgt.y - h.y, tgt.x - h.x) : Math.atan2(TY[la] - h.y, TX[la] - h.x), da = Math.atan2(Math.sin(want - h.a), Math.cos(want - h.a)); h.a += Math.max(-5 * dt, Math.min(5 * dt, da));
      h.x += Math.cos(h.a) * h.v * dt; h.y += Math.sin(h.a) * h.v * dt; h.z = groundH(h.x, h.y, h.idx) + (near ? 6 : 26); if (Math.random() < 0.9) spawn(h.x, h.y, h.z + 2, 0.5, 0.8, 1, 8, 0.5, 4);
      if (tgt && Math.hypot(tgt.x - h.x, tgt.y - h.y) < 18) { if (tgt.surge <= 0) { tgt.spin = 1.8; tgt.v *= 0.1; if (tgt === player) { S.shake = 0.6; SFX.hit(); } } for (let i = 0; i < 30; i++) spawn(h.x, h.y, h.z, 0.6, 0.85, 1, 8, 0.8, 30 + Math.random() * 60, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200); h.life = 0; }
      if (h.life <= 0) scene.remove(h.mesh); continue;
    }
    if (h.type === 'ball' || h.type === 'rocket') {
      if (h.type === 'rocket' && h.target && !h.target.finished) { const want = Math.atan2(h.target.y - h.y, h.target.x - h.x), da = Math.atan2(Math.sin(want - h.a), Math.cos(want - h.a)); h.a += Math.max(-4 * dt, Math.min(4 * dt, da)); }
      else { h.idx = nearestIdx(h.x, h.y, h.idx); const la = (h.idx + 12) % N, want = Math.atan2(TY[la] - h.y, TX[la] - h.x), da = Math.atan2(Math.sin(want - h.a), Math.cos(want - h.a)); h.a += Math.max(-3 * dt, Math.min(3 * dt, da)); }
      h.x += Math.cos(h.a) * h.v * dt; h.y += Math.sin(h.a) * h.v * dt; h.idx = nearestIdx(h.x, h.y, h.idx); h.z = groundH(h.x, h.y, h.idx);
      if (h.type === 'rocket' && Math.random() < 0.8) spawn(h.x - Math.cos(h.a) * 12, h.y - Math.sin(h.a) * 12, h.z + 10, 1, 0.6, 0.2, 5, 0.4, 5);
      if (h.x < 10 || h.y < 10 || h.x > WORLD - 10 || h.y > WORLD - 10) h.life = 0;
    }
    for (const k of S.karts) { if (h.life <= 0) break; if (k === h.owner && h.type !== 'banana' && h.life > (h.type === 'ball' ? 6.6 : 7.6)) continue; if (Math.hypot(k.x - h.x, k.y - h.y) < h.r + 9 && Math.abs(k.z - h.z) < 15) { hitKart(k, h.type); h.life = 0; } }
    if (h.life <= 0) scene.remove(h.mesh);
  }
  S.hazards = S.hazards.filter(h => h.life > 0);
  if (S.shake > 0) S.shake -= dt;
  updateParticles(dt);
}

// ═══════════════════════ scene sync & cinematic camera ═══════════════════════
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _up = new THREE.Vector3(0, 0, 1);
function syncKart(k) {
  const g = k.mesh, ang = k.a + (k.spin > 0 ? k.spin * 9 : 0), lift = k.hop > 0 ? Math.sin(Math.PI * k.hop / 0.28) * 7 : 0, sc = k.shrink > 0 ? 0.6 : 1;
  _e.set(k.roll + k.tilt * 0.12, -k.pitch, ang, 'ZYX'); _q.setFromEuler(_e);
  g.matrix.compose(_v.set(k.x, k.y, k.z + lift + 0.45), _q, new THREE.Vector3(sc, sc, sc));
  for (const w of g.wheels) { w.spin.rotation.y = k.wheel; if (w.front) w.pivot.rotation.z = k.steer * 0.45; }
  g.brakeL.material = g.brakeR.material = k.braking ? mat('#FF2A2A', { emissive: '#FF2A2A', ei: 1.5 }) : mat('#7A1A1A', { emissive: '#FF2A2A', ei: 0.2 });
  const boosting = k.boost > 0 || k.surge > 0; g.flame.visible = boosting; g.fglow.visible = boosting; if (boosting) { g.flame.scale.set(0.8 + Math.random() * 0.5, 0.9 + Math.random() * 0.3, 0.9 + Math.random() * 0.3); g.fglow.material.opacity = 0.5 + Math.random() * 0.4; }
  g.bubble.visible = k.surge > 0; if (k.surge > 0) { g.bubble.material.emissiveIntensity = 0.4 + 0.3 * Math.sin(S.t * 12); g.bubble.rotation.z = S.t * 2; }
  g.head.rotation.z = k.steer * 0.25;
}
const camState = { x: 0, y: 0, z: 40, a: 0, fov: 62, roll: 0 }; let introT = 0;
const mirrorCam = new THREE.PerspectiveCamera(70, 3, 18, 5000); mirrorCam.up.set(0, 0, 1);
function renderMirror() {
  if (!player || document.body.classList.contains('touch') || S.mode === 'countdown') return;
  const r = ui.mirror.getBoundingClientRect(), f = canvas.getBoundingClientRect();   // three.js viewports are in CSS pixels
  const x = r.left - f.left, y = f.bottom - r.bottom, w = r.width, hgt = r.height; if (w < 4) return;
  const c = Math.cos(player.a), sn = Math.sin(player.a);
  mirrorCam.position.set(player.x + c * 6, player.y + sn * 6, player.z + 22); mirrorCam.lookAt(player.x - c * 120, player.y - sn * 120, player.z + 2); mirrorCam.aspect = r.width / r.height; mirrorCam.updateProjectionMatrix();
  renderer.autoClear = false; renderer.setScissorTest(true); renderer.setViewport(x, y, w, hgt); renderer.setScissor(x, y, w, hgt); renderer.clear(true, true, false); renderer.render(scene, mirrorCam);
  renderer.setScissorTest(false); renderer.setViewport(0, 0, f.width, f.height); renderer.autoClear = true;
}
function updateCamera(dt) {
  if (!player) return;
  const slip = Math.abs(player.v) > 40 ? Math.atan2(player.vlat, Math.abs(player.v)) : 0;
  const wantA = player.a + Math.max(-0.5, Math.min(0.5, slip * 0.7));
  const da = Math.atan2(Math.sin(wantA - camState.a), Math.cos(wantA - camState.a)); camState.a += da * Math.min(1, dt * 7);
  let tx, ty, tz, lx, ly, lz, fovT = 62;
  if (player.finished && S.mode === 'race') {
    // finish replay: slow orbit around the winner's kart
    const t = S.t - S.finishT, orbit = player.a + Math.PI * 0.8 + t * 0.45, r = 62, h = 20 + Math.sin(t * 0.7) * 6;
    camState.x += (player.x - Math.cos(orbit) * r - camState.x) * Math.min(1, dt * 3); camState.y += (player.y - Math.sin(orbit) * r - camState.y) * Math.min(1, dt * 3); camState.z += (player.z + h - camState.z) * Math.min(1, dt * 3);
    lx = player.x; ly = player.y; lz = player.z + 8; fovT = 48;
  } else if (S.mode === 'countdown') {
    // intro fly-by: sweep around the player's kart, then settle behind it as the lights go green
    introT += dt; const p = Math.min(1, introT / 3.9), e = p * p * (3 - 2 * p), orbit = player.a + Math.PI * 0.55 + e * Math.PI * 0.45, r = 110 - e * 42, h = 16 + e * 22;
    tx = player.x - Math.cos(orbit) * r; ty = player.y - Math.sin(orbit) * r; tz = player.z + h; lx = player.x + Math.cos(player.a) * 10; ly = player.y + Math.sin(player.a) * 10; lz = player.z + 10 - e * 2; fovT = 50 + e * 12;
    camState.x = tx; camState.y = ty; camState.z = tz; camState.a = player.a;
  } else {
    const back = 68 + Math.min(20, Math.abs(player.v) * 0.05), h = 34 + Math.abs(player.v) * 0.02;
    tx = player.x - Math.cos(camState.a) * back; ty = player.y - Math.sin(camState.a) * back; tz = player.z + h;
    const sm = Math.min(1, dt * 9); camState.x += (tx - camState.x) * sm; camState.y += (ty - camState.y) * sm; camState.z += (tz - camState.z) * Math.min(1, dt * 5);
    lx = player.x + Math.cos(camState.a) * 30; ly = player.y + Math.sin(camState.a) * 30; lz = player.z + 9;
    fovT = 62 + (player.boost > 0 ? 14 : 0) + Math.min(10, Math.max(0, player.v - 250) * 0.08) + (player.air ? 4 : 0);
  }
  const gz = groundH(camState.x, camState.y, player.idx) + 7; if (camState.z < gz) camState.z = gz;
  camState.fov += (fovT - camState.fov) * Math.min(1, dt * 4); camera.fov = camState.fov; camera.updateProjectionMatrix();
  camera.position.set(camState.x, camState.y, camState.z);
  if (S.shake > 0) camera.position.add(_v.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2));
  camera.lookAt(lx, ly, lz);
  const rollT = player.drift ? -player.driftDir * 0.06 : -player.steer * 0.02; camState.roll += (rollT - camState.roll) * Math.min(1, dt * 5); camera.rotateZ(camState.roll);
  // the sun's shadow box follows the player
  const d = sun.userData.dir; sun.position.set(player.x + d.x * 700, player.y + d.y * 700, player.z + d.z * 700); sun.target.position.set(player.x, player.y, player.z); sun.target.updateMatrixWorld();
}
function syncScene() {
  for (const k of S.karts) syncKart(k);
  if (S.ghostMesh) { const rec = S.best && S.best.rec, t = S.raceTime - player.lapStart, i = Math.floor(t / 0.1); const show = rec && S.mode === 'race' && !player.finished && i < rec.length - 1; S.ghostMesh.visible = !!show;
    if (show) { const a = rec[i], b = rec[i + 1], f = (t / 0.1) - i; S.ghostMesh.position.set(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f); let da = b[3] - a[3]; da = Math.atan2(Math.sin(da), Math.cos(da)); S.ghostMesh.rotation.z = a[3] + da * f; } }
  for (const h of S.hazards) { h.mesh.position.set(h.x, h.y, h.z + (h.type === 'ball' ? 11 : h.type === 'rocket' ? 10 : 0)); if (h.type === 'ball') { h.mesh.rotation.y -= 0.2; h.mesh.rotation.z = h.a; } if (h.type === 'rocket') h.mesh.rotation.z = h.a; }
  BOXES.forEach((b, i) => { const m = boxMeshes[i]; m.visible = b.t <= 0; if (m.visible) { m.position.set(b.x, b.y, b.z + 12 + Math.sin(S.t * 4 + b.x) * 2); m.rotation.set(S.t * 1.3, S.t * 0.9, S.t * 1.7); const col = new THREE.Color().setHSL(((S.t * 0.33 + b.x * 0.002) % 1 + 1) % 1, 0.9, 0.6); m.material.color.copy(col); m.material.emissive.copy(col); m.glow.material.color.copy(col); } });
  for (const f of flagMeshes) { const p = f.flag.geometry.attributes.position, base = f.flagBase; for (let i = 0; i < p.count; i++) { const x = base[i * 3]; p.setZ(i, Math.sin(S.t * 6 + x * 0.35) * (x / 26) * 2.5); } p.needsUpdate = true; }
  for (const gy of geysers) { const h = Math.max(0.02, Math.sin(S.t * 2 + gy.ph)); gy.m.jet.scale.set(h, h, h); gy.m.jet.position.z = 10 + 25 * h; }
  skyMat.uniforms.time.value = S.t; sky.position.copy(camera.position);
}

// ═══════════════════════ post-processing overlay ═══════════════════════
const fxCanvas = document.getElementById('fx'), fx = fxCanvas.getContext('2d'), bloomA = document.createElement('canvas'), bloomB = document.createElement('canvas');
function postFX() {
  const fw = fxCanvas.width, fh = fxCanvas.height; fx.clearRect(0, 0, fw, fh);
  const bw = Math.max(8, fw >> 3), bh = Math.max(8, fh >> 3); if (bloomA.width !== bw) { bloomA.width = bw; bloomA.height = bh; bloomB.width = bw >> 1; bloomB.height = bh >> 1; }
  bloomA.getContext('2d').drawImage(canvas, 0, 0, bw, bh); bloomB.getContext('2d').drawImage(bloomA, 0, 0, bloomB.width, bloomB.height);
  fx.globalCompositeOperation = 'screen'; fx.globalAlpha = T.night ? 0.26 : 0.09; fx.drawImage(bloomB, 0, 0, fw, fh); fx.globalAlpha = 1; fx.globalCompositeOperation = 'source-over';
  const grade = fx.createLinearGradient(0, 0, 0, fh); grade.addColorStop(0, T.night ? 'rgba(60,40,140,0.16)' : 'rgba(255,214,150,0.1)'); grade.addColorStop(1, T.night ? 'rgba(0,20,60,0.18)' : 'rgba(40,80,160,0.08)');
  fx.globalCompositeOperation = 'overlay'; fx.fillStyle = grade; fx.fillRect(0, 0, fw, fh); fx.globalCompositeOperation = 'source-over';
  const vg = fx.createRadialGradient(fw / 2, fh / 2, fh * 0.45, fw / 2, fh / 2, fh * 1.05); vg.addColorStop(0, 'rgba(0,0,10,0)'); vg.addColorStop(1, 'rgba(0,0,10,0.42)'); fx.fillStyle = vg; fx.fillRect(0, 0, fw, fh);
  if (player && player.boost > 0) { const g = fx.createRadialGradient(fw / 2, fh / 2, fh * 0.35, fw / 2, fh / 2, fh * 0.8); g.addColorStop(0, 'rgba(255,122,31,0)'); g.addColorStop(1, 'rgba(255,122,31,0.3)'); fx.fillStyle = g; fx.fillRect(0, 0, fw, fh); fx.strokeStyle = 'rgba(255,246,220,0.45)'; fx.lineWidth = 2; for (let i = 0; i < 14; i++) { const a = Math.random() * 6.28, r0 = fh * (0.4 + Math.random() * 0.2), r1 = r0 + fh * 0.25; fx.beginPath(); fx.moveTo(fw / 2 + Math.cos(a) * r0, fh / 2 + Math.sin(a) * r0); fx.lineTo(fw / 2 + Math.cos(a) * r1, fh / 2 + Math.sin(a) * r1); fx.stroke(); } }
  if (player && player.shrink > 0) { fx.fillStyle = 'rgba(40,60,120,0.25)'; fx.fillRect(0, 0, fw, fh); }
  if (S.shake > 0.3 && Math.random() < 0.5) { fx.fillStyle = 'rgba(255,255,255,0.3)'; fx.fillRect(0, 0, fw, fh); }
}

// ═══════════════════════ HUD & screens ═══════════════════════
const ui = {}; for (const id of ['hud', 'title', 'select', 'garage', 'trackSel', 'finish', 'models', 'paints', 'gstats', 'garageBack', 'garageOk', 'gp2Btn', 'mirror', 'diffSeg', 'pause', 'settings', 'lapTimes', 'pauseBtn', 'resumeBtn', 'restartBtn', 'pauseSettings', 'quitBtn', 'settingsBack', 'titleSettings', 'optMusic', 'optSfx', 'optEngine', 'optMirror', 'optPerf', 'lap', 'pos', 'timeBox', 'speed', 'itemName', 'banner', 'center', 'results', 'roster', 'tracks', 'againBtn', 'mini', 'itemCanvas', 'trackName', 'finishTitle', 'finishTag', 'charOk', 'raceBtn', 'gpBtn', 'board', 'unlockHint', 'progInfo', 'resetProg']) ui[id] = document.getElementById(id);
const miniBase = document.createElement('canvas'); miniBase.width = 180; miniBase.height = 180;
function drawOutline(c, size, xs, ys, lineW, col) { const k = size / WORLD; c.beginPath(); c.moveTo(xs[0] * k, ys[0] * k); for (let i = 1; i < xs.length; i++) c.lineTo(xs[i] * k, ys[i] * k); c.closePath(); c.lineCap = c.lineJoin = 'round'; c.lineWidth = lineW + 4; c.strokeStyle = 'rgba(0,0,0,0.55)'; c.stroke(); c.lineWidth = lineW; c.strokeStyle = col; c.stroke(); }
function drawMiniBase() { const c = miniBase.getContext('2d'); c.clearRect(0, 0, 180, 180); drawOutline(c, 180, TX, TY, 9, '#E8E4D8'); const d = tdir(0), k = 180 / WORLD; c.strokeStyle = '#FF5A5F'; c.lineWidth = 4; c.beginPath(); c.moveTo(TX[0] * k - d[1] * 7, TY[0] * k + d[0] * 7); c.lineTo(TX[0] * k + d[1] * 7, TY[0] * k - d[0] * 7); c.stroke(); }
function drawMini() { const c = ui.mini.getContext('2d'), k = 180 / WORLD; c.clearRect(0, 0, 180, 180); c.drawImage(miniBase, 0, 0); for (const kt of S.karts) { if (kt === player) continue; c.fillStyle = kt.ch.body; c.beginPath(); c.arc(kt.x * k, kt.y * k, 4.5, 0, 7); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 1; c.stroke(); } if (player) { const px = player.x * k, py = player.y * k, pulse = 9 + Math.sin(S.t * 6) * 2;
    c.strokeStyle = 'rgba(255,210,63,0.9)'; c.lineWidth = 2; c.beginPath(); c.arc(px, py, pulse, 0, 7); c.stroke();
    c.fillStyle = '#FFF6DC'; c.beginPath(); c.arc(px, py, 6.5, 0, 7); c.fill(); c.fillStyle = player.ch.body; c.beginPath(); c.arc(px, py, 4.5, 0, 7); c.fill();
    c.fillStyle = '#FFD23F'; c.beginPath(); c.moveTo(px + Math.cos(player.a) * 13, py + Math.sin(player.a) * 13); c.lineTo(px + Math.cos(player.a + 2.5) * 7, py + Math.sin(player.a + 2.5) * 7); c.lineTo(px + Math.cos(player.a - 2.5) * 7, py + Math.sin(player.a - 2.5) * 7); c.closePath(); c.fill();
    c.font = "800 11px 'Rajdhani', Arial, sans-serif"; c.textAlign = 'center'; c.textBaseline = 'bottom'; c.lineWidth = 3; c.strokeStyle = 'rgba(0,0,0,0.7)'; c.strokeText('YOU', px, py - 12); c.fillStyle = '#FFD23F'; c.fillText('YOU', px, py - 12); } }
function setItemIcon(item) { const c = ui.itemCanvas.getContext('2d'); c.clearRect(0, 0, 96, 96); if (!item) { ui.itemName.textContent = ''; return; } if (item === '?') { c.fillStyle = '#FFD23F'; c.font = "italic 800 64px 'Barlow Condensed', Impact, sans-serif"; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 48, 54); ui.itemName.textContent = '...'; return; } ui.itemName.textContent = ITEMS[item].name; drawItemIcon(c, item); }
function drawItemIcon(c, item) {
  c.lineWidth = 4; c.strokeStyle = '#1B1F3B';
  if (item === 'nitro') { c.fillStyle = '#FF5A5F'; rr(c, 30, 22, 36, 60, 8); c.fill(); c.stroke(); c.fillStyle = '#FFF6DC'; c.fillRect(38, 40, 20, 12); c.fillStyle = '#FFD23F'; c.fillRect(42, 12, 12, 12); }
  else if (item === 'banana') { c.fillStyle = '#FFD23F'; c.beginPath(); c.moveTo(20, 40); c.quadraticCurveTo(48, 92, 80, 44); c.quadraticCurveTo(58, 70, 24, 52); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#8B5A2B'; c.fillRect(76, 36, 8, 10); }
  else if (item === 'ball') { c.fillStyle = '#3B3F6B'; c.beginPath(); c.arc(48, 50, 32, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#1B1F3B'; for (const [x, y] of [[38, 40], [56, 38], [48, 56]]) { c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); } }
  else if (item === 'rocket') { c.fillStyle = '#FF7A1F'; c.beginPath(); c.moveTo(48, 10); c.quadraticCurveTo(70, 40, 62, 72); c.lineTo(34, 72); c.quadraticCurveTo(26, 40, 48, 10); c.fill(); c.stroke(); c.fillStyle = '#8FD3FF'; c.beginPath(); c.arc(48, 40, 8, 0, 7); c.fill(); c.fillStyle = '#FFD23F'; c.beginPath(); c.moveTo(38, 74); c.lineTo(48, 92); c.lineTo(58, 74); c.fill(); }
  else if (item === 'storm') { c.fillStyle = '#DDE9FF'; c.beginPath(); c.arc(34, 40, 16, 0, 7); c.arc(52, 32, 20, 0, 7); c.arc(68, 44, 14, 0, 7); c.fill(); c.fillStyle = '#FFD23F'; c.beginPath(); c.moveTo(52, 52); c.lineTo(40, 74); c.lineTo(50, 74); c.lineTo(44, 92); c.lineTo(62, 66); c.lineTo(52, 66); c.lineTo(58, 52); c.closePath(); c.fill(); c.stroke(); }
  else if (item === 'comet') { c.fillStyle = '#8FD3FF'; c.beginPath(); c.moveTo(20, 80); c.quadraticCurveTo(40, 60, 62, 44); c.quadraticCurveTo(50, 70, 20, 80); c.fill(); c.fillStyle = '#4FA8FF'; c.beginPath(); c.arc(66, 38, 18, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(60, 32, 6, 0, 7); c.fill(); }
  else if (item === 'surge') { c.fillStyle = '#2EE6A6'; c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 16 : 38, a = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(48 + Math.cos(a) * r, 52 + Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke(); }
}
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function flash(text, dur = 1.6) { if (S.msgT > 0 && S.msg !== text && dur < S.msgT) return; S.msg = text; S.msgT = dur; }
function fmtTime(t) { const m = Math.floor(t / 60), s = t - m * 60; return m + ':' + s.toFixed(2).padStart(5, '0'); }
let lastRank = 0;
function updateHUD() {
  if (!player) return;
  ui.lap.textContent = Math.max(1, Math.min(LAPS, player.lap)); ui.timeBox.textContent = fmtTime(S.raceTime);
  const r = player.rank; if (r !== lastRank) { ui.pos.innerHTML = r + '<small>' + ORD(r).slice(-2) + '</small>'; ui.pos.style.color = r === 1 ? '#FFD23F' : r <= 3 ? '#FFF6DC' : '#FF5A5F'; if (lastRank) { ui.pos.classList.remove('bump'); void ui.pos.offsetWidth; ui.pos.classList.add('bump'); } lastRank = r; }
  ui.lapTimes.textContent = (player.laps.length ? 'last ' + fmtTime(player.laps[player.laps.length - 1]) : '') + (S.best ? (player.laps.length ? ' · ' : '') + 'best ' + fmtTime(S.best.time) : '');
  ui.speed.textContent = Math.round(Math.abs(player.v) * 0.62);
  ui.banner.textContent = S.msgT > 0 ? S.msg : ''; ui.banner.style.opacity = Math.min(1, S.msgT * 2);
  drawMini();
}
// title-screen leaderboard: the best lap saved for each circuit, and who set it
const bestFor = i => { try { return JSON.parse(localStorage.getItem('pk_best_' + i) || 'null'); } catch (e) { return null; } };
function renderBoard() {
  ui.board.innerHTML = TRACKS.map((t, i) => { const b = bestFor(i), who = b && CHARS[b.ch] ? CHARS[b.ch].name : '';
    return `<div class="bcard${b ? '' : ' empty'}"><div class="bn">${t.name}</div><div class="bt">${b ? fmtTime(b.time) : '—'}</div><div class="bw">${who}</div></div>`; }).join('');
}
// keep every locked/unlocked bit of UI in step with SAVE
function refreshUnlocks() {
  const on = summitUnlocked();
  ui.gp2Btn.classList.toggle('locked', !on);
  ui.gp2Btn.textContent = on ? 'SUMMIT CUP (5–8)' : 'SUMMIT CUP · LOCKED';
  ui.unlockHint.textContent = on ? '' : 'Finish on the podium in the Island Cup to unlock the Summit Cup';
  if (ui.paints.children.length) [...ui.paints.children].forEach((el, i) => el.classList.toggle('locked', i >= paintsUnlocked()));
  ui.progInfo.textContent = `Races finished ${SAVE.races} · Paints ${paintsUnlocked()} of ${PAINTS.length} · Summit Cup ${on ? 'unlocked' : 'locked'}`;
}
function showScreen(name) { for (const s of ['title', 'select', 'garage', 'trackSel', 'finish', 'pause', 'settings']) ui[s].hidden = s !== name; if (name && name !== 'pause' && name !== 'settings') { ui.hud.style.display = 'none'; S.mode = name; } if (name === 'garage') garageRefresh(); if (name === 'title') renderBoard(); if (name === 'trackSel') refreshUnlocks(); }
// ── pause & settings ──
function pauseGame() { if (S.mode !== 'race' && S.mode !== 'countdown') return; S.prevMode = S.mode; S.mode = 'pause'; ui.pause.hidden = false; SFX.pause(); if (musicState) musicState.gain.gain.setTargetAtTime(0.08 * OPT.music, AC.currentTime, 0.2); }
function resumeGame() { if (S.mode !== 'pause') return; S.mode = S.prevMode; ui.pause.hidden = true; ui.settings.hidden = true; last = performance.now(); if (musicState) musicState.gain.gain.setTargetAtTime(musicOn ? 0.42 * OPT.music : 0, AC.currentTime, 0.3); }
function openSettings(from) { refreshUnlocks(); S.settingsFrom = from; ui.optMusic.value = OPT.music; ui.optSfx.value = OPT.sfx; ui.optEngine.value = OPT.engine; ui.optMirror.checked = OPT.mirror; ui.optPerf.checked = OPT.perf; ui.settings.hidden = false; if (from === 'title') { ui.title.hidden = true; S.mode = 'settings'; } else ui.pause.hidden = true; }
function closeSettings() { ui.settings.hidden = true; if (S.settingsFrom === 'title') { S.mode = 'title'; ui.title.hidden = false; } else ui.pause.hidden = false; }
function applyOpt() {
  saveOpt(); if (musicState && AC) musicState.gain.gain.setTargetAtTime(musicOn ? 0.42 * OPT.music : 0, AC.currentTime, 0.2); if (sfxBus) sfxBus.gain.value = OPT.sfx;
  ui.mirror.style.display = OPT.mirror ? '' : 'none';
  renderer.shadowMap.enabled = !OPT.perf; sun.castShadow = !OPT.perf; renderer.setPixelRatio(OPT.perf ? 1 : Math.min(2, window.devicePixelRatio || 1)); resize();
  scene.traverse(o => { if (o.material) o.material.needsUpdate = true; });
}
// ── garage: live 3D preview of the chosen driver + kart + paint ──
const gScene = new THREE.Scene(); gScene.background = new THREE.Color(0x14173A); gScene.fog = new THREE.Fog(0x14173A, 120, 400);
const gCam = new THREE.PerspectiveCamera(38, 16 / 9, 1, 1000); gCam.up.set(0, 0, 1); gCam.position.set(92, -80, 38); gCam.lookAt(12, 0, 8);
const gSun = new THREE.DirectionalLight(0xffffff, 1.6); gSun.position.set(40, -30, 80); gSun.castShadow = true; gSun.shadow.mapSize.set(1024, 1024); gSun.shadow.camera.left = gSun.shadow.camera.bottom = -60; gSun.shadow.camera.right = gSun.shadow.camera.top = 60; gScene.add(gSun);
gScene.add(new THREE.HemisphereLight(0x9FB8FF, 0x202040, 0.9)); const gRim = new THREE.DirectionalLight(0xFFD23F, 0.8); gRim.position.set(-40, 40, 30); gScene.add(gRim);
const plinth = new THREE.Mesh(new THREE.CylinderGeometry(30, 34, 4, 48).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x2A2F5C, roughness: 0.4, metalness: 0.3 })); plinth.position.set(14, 0, -2); plinth.receiveShadow = true; gScene.add(plinth);
const gFloor = new THREE.Mesh(new THREE.CircleGeometry(400, 32), new THREE.MeshStandardMaterial({ color: 0x0E1030, roughness: 1 })); gFloor.position.z = -4; gFloor.receiveShadow = true; gScene.add(gFloor);
let gKart = null, gAngle = 0;
function garageRefresh() {
  if (gKart) gScene.remove(gKart);
  gKart = buildKart(CHARS[S.sel], KART_MODELS[S.model], S.paint); gKart.matrixAutoUpdate = true; gKart.position.set(14, 0, 0); gScene.add(gKart);
  [...ui.models.children].forEach((el, i) => el.classList.toggle('sel', i === S.model)); [...ui.paints.children].forEach((el, i) => { el.classList.toggle('sel', PAINTS[i] === S.paint); el.classList.toggle('locked', i >= paintsUnlocked()); });
  const ch = CHARS[S.sel], md = KART_MODELS[S.model], bar = v => `<div class="bar"><i style="width:${Math.round(Math.max(8, Math.min(100, (v - 0.75) / 0.45 * 100)))}%"></i></div>`;
  ui.gstats.innerHTML = `<div>${ch.name} · ${md.name}</div><div></div><div>Speed</div>${bar(ch.speed * md.speed)}<div>Accel</div>${bar(ch.accel * md.accel)}<div>Handling</div>${bar(ch.handling * md.handling)}`;
}
function buildGarageUI() {
  ui.models.innerHTML = ''; KART_MODELS.forEach((m, i) => { const el = document.createElement('div'); el.className = 'mcard'; el.innerHTML = `<div class="nm">${m.name}</div><div class="st">${m.sub}</div>`; el.addEventListener('click', () => { S.model = i; garageRefresh(); }); ui.models.appendChild(el); });
  ui.paints.innerHTML = ''; PAINTS.forEach((p, i) => { const el = document.createElement('div'); el.className = 'swatch'; el.style.background = p; el.addEventListener('click', () => { if (i >= paintsUnlocked()) return; S.paint = p; garageRefresh(); }); ui.paints.appendChild(el); });
}
function renderGarage(dt) { gAngle += dt * 0.6; if (gKart) gKart.rotation.z = gAngle; renderer.render(gScene, gCam); fx.clearRect(0, 0, fxCanvas.width, fxCanvas.height); }
function buildRoster() {
  ui.roster.innerHTML = '';
  CHARS.forEach((ch, i) => { const el = document.createElement('div'); el.className = 'char'; el.tabIndex = 0; const cv = document.createElement('canvas'); cv.width = 120; cv.height = 120; drawPortrait(cv.getContext('2d'), ch); el.appendChild(cv); const nm = document.createElement('div'); nm.className = 'nm'; nm.textContent = ch.name; el.appendChild(nm); const st = document.createElement('div'); st.className = 'st'; st.textContent = ch.kind + ' · ' + ch.st; el.appendChild(st); el.addEventListener('click', () => { S.sel = i; S.paint = CHARS[i].body; refreshRoster(); }); el.addEventListener('dblclick', () => { S.sel = i; S.paint = CHARS[i].body; showScreen('garage'); }); ui.roster.appendChild(el); });
  refreshRoster(); ui.tracks.innerHTML = '';
  TRACKS.forEach((t, i) => { const el = document.createElement('div'); el.className = 'trk'; el.tabIndex = 0; const cv = document.createElement('canvas'); cv.width = 140; cv.height = 140; const c = cv.getContext('2d'); c.fillStyle = t.ground; c.fillRect(0, 0, 140, 140); c.fillStyle = `rgb(${t.skyBot.join(',')})`; c.globalAlpha = 0.25; c.fillRect(0, 0, 140, 140); c.globalAlpha = 1; const [xs, ys] = splineFor(t.ctrl, 240); c.save(); c.translate(8, 8); drawOutline(c, 124, xs, ys, 7, t.curb[0]); c.restore(); el.appendChild(cv); const nm = document.createElement('div'); nm.className = 'nm'; nm.textContent = t.name; el.appendChild(nm); const st = document.createElement('div'); st.className = 'st'; st.textContent = t.sub; el.appendChild(st); el.addEventListener('click', () => { S.trk = i; refreshTracks(); }); el.addEventListener('dblclick', () => { S.trk = i; S.gp = null; startRace(); }); ui.tracks.appendChild(el); });
  refreshTracks();
}
function refreshRoster() { [...ui.roster.children].forEach((el, i) => el.classList.toggle('sel', i === S.sel)); }
function refreshTracks() { [...ui.tracks.children].forEach((el, i) => el.classList.toggle('sel', i === S.trk)); }
function drawPortrait(c, ch) {
  c.clearRect(0, 0, 120, 120); c.fillStyle = ch.body; rr(c, 20, 60, 80, 34, 10); c.fill(); c.fillStyle = '#22242C'; for (const x of [26, 74]) rr(c, x, 84, 20, 18, 5), c.fill(); c.fillStyle = ch.accent; rr(c, 84, 54, 14, 20, 4); c.fill(); c.fillStyle = ch.suit; rr(c, 44, 52, 24, 16, 4); c.fill();
  const hg = c.createRadialGradient(48, 34, 4, 56, 42, 24); hg.addColorStop(0, '#FFFFFF'); hg.addColorStop(0.25, ch.helmet); hg.addColorStop(1, ch.helmet); c.fillStyle = hg; c.beginPath(); c.arc(56, 42, 22, 0, 7); c.fill();
  c.fillStyle = '#1B1F3B'; c.beginPath(); c.ellipse(64, 44, 12, 8, 0, 0, 7); c.fill(); c.fillStyle = ch.accent; c.fillRect(52, 18, 8, 12); c.fillStyle = ch.helmet;
  if (ch.kind === 'Fox' || ch.kind === 'Cat') { c.beginPath(); c.moveTo(38, 30); c.lineTo(44, 10); c.lineTo(52, 26); c.fill(); c.beginPath(); c.moveTo(74, 30); c.lineTo(68, 10); c.lineTo(60, 26); c.fill(); }
  if (ch.kind === 'Robot') { c.fillRect(54, 8, 4, 14); c.fillStyle = '#FF5A5F'; c.beginPath(); c.arc(56, 6, 5, 0, 7); c.fill(); }
  if (ch.kind === 'Bear' || ch.kind === 'Monkey') { c.beginPath(); c.arc(38, 26, 8, 0, 7); c.arc(74, 26, 8, 0, 7); c.fill(); }
  if (ch.kind === 'Dino') { c.fillStyle = ch.body; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(42 + i * 12, 24); c.lineTo(48 + i * 12, 10); c.lineTo(54 + i * 12, 24); c.fill(); } }
}
function showResults() {
  S.mode = 'finish'; const order = S.karts.slice().sort((a, b) => a.rank - b.rank);
  if (S.gp) order.forEach(k => { S.gp.points[CHARS.indexOf(k.ch)] += GP_POINTS[k.rank - 1]; });
  const last = S.gp && S.gp.race === S.gp.list.length - 1; let rows;
  if (S.gp && last) { const standings = CHARS.map((ch, i) => ({ ch, pts: S.gp.points[i] })).sort((a, b) => b.pts - a.pts); const me = standings.findIndex(s => s.ch === player.ch) + 1; rows = standings.map((s, i) => `<div class="r">${ORD(i + 1)}</div><div class="${s.ch === player.ch ? 'you' : ''}">${s.ch.name} the ${s.ch.kind}${s.ch === player.ch ? ' (you)' : ''}</div><div></div><div class="pt">${s.pts} pts</div>`).join(''); ui.finishTag.textContent = S.gp.name + ' · final standings'; ui.finishTitle.textContent = me === 1 ? 'CHAMPION!' : me <= 3 ? 'PODIUM!' : 'GP OVER'; ui.againBtn.textContent = 'BACK TO MENU'; }
  else { rows = order.map(k => `<div class="r">${ORD(k.rank)}</div><div class="${k === player ? 'you' : ''}">${k.ch.name} the ${k.ch.kind}${k === player ? ' (you)' : ''}</div><div>${k.finished ? fmtTime(k.finishTime) : '—'}</div><div class="pt">${S.gp ? S.gp.points[CHARS.indexOf(k.ch)] + ' pts' : ''}</div>`).join(''); ui.finishTag.textContent = S.gp ? `${S.gp.name} · race ${S.gp.race + 1} of ${S.gp.list.length} · ${T.name}` : T.name; ui.finishTitle.textContent = player.rank === 1 ? 'YOU WIN!' : player.rank <= 3 ? 'PODIUM!' : 'FINISH!'; ui.againBtn.textContent = S.gp ? 'NEXT RACE' : 'RACE AGAIN'; }
  if (player.laps.length) rows += `<div class="r"></div><div class="you" style="grid-column:2/5;opacity:.85">Your laps: ${player.laps.map(fmtTime).join(' · ')} · best ${fmtTime(Math.min(...player.laps))}${S.best ? ' · record ' + fmtTime(S.best.time) : ''}</div>`;
  // progression: every finished race earns a paint, an Island Cup podium opens the Summit Cup
  const paintsBefore = paintsUnlocked(); SAVE.races++;
  const gained = [];
  if (paintsUnlocked() > paintsBefore) gained.push('New paint unlocked in the garage');
  if (S.gp && S.gp.cup === 0 && last && !SAVE.islandPodium) {
    const table = CHARS.map((ch, i) => ({ ch, pts: S.gp.points[i] })).sort((a, b) => b.pts - a.pts);
    if (table.findIndex(s => s.ch === player.ch) + 1 <= 3) { SAVE.islandPodium = true; gained.push('SUMMIT CUP UNLOCKED'); }
  }
  saveProg(); refreshUnlocks();
  if (gained.length) rows += `<div class="r">★</div><div class="you" style="grid-column:2/5">${gained.join(' · ')}</div>`;
  ui.results.innerHTML = rows; ui.finish.hidden = false; ui.againBtn.focus();
}
function afterFinish() { if (S.gp && S.gp.race < S.gp.list.length - 1) { S.gp.race++; S.trk = S.gp.list[S.gp.race]; startRace(); return; } S.gp = null; showScreen('trackSel'); }
function startGP(cup) { const list = TRACKS.map((_, i) => i).filter(i => Math.floor(i / 4) === cup); S.gp = { name: cup ? 'Summit Cup' : 'Island Cup', cup, list, race: 0, points: CHARS.map(() => 0) }; S.trk = list[0]; startRace(); }

// ═══════════════════════ input ═══════════════════════
const unlockAudio = () => { audioInit(); if (AC && AC.state === 'suspended') AC.resume(); };
addEventListener('keydown', e => {
  unlockAudio();
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight'].includes(e.code)) e.preventDefault();
  if (e.repeat) return; keys[e.code] = true;
  if (e.code === 'KeyM') { musicOn = !musicOn; if (musicState) musicState.gain.gain.setTargetAtTime(musicOn ? 0.42 : 0, AC.currentTime, 0.3); flash(musicOn ? 'MUSIC ON' : 'MUSIC OFF'); }
  if (S.mode === 'title' && (e.code === 'Enter' || e.code === 'Space')) { e.preventDefault(); showScreen('select'); return; }
  if (S.mode === 'title' && e.code === 'KeyS') { openSettings('title'); return; }
  if (S.mode === 'select') { if (e.code === 'ArrowLeft' || e.code === 'KeyA') { S.sel = (S.sel + 5) % 6; S.paint = CHARS[S.sel].body; } if (e.code === 'ArrowRight' || e.code === 'KeyD') { S.sel = (S.sel + 1) % 6; S.paint = CHARS[S.sel].body; } refreshRoster(); if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); showScreen('garage'); } return; }
  if (S.mode === 'garage') { const n = KART_MODELS.length, pi = Math.max(0, PAINTS.indexOf(S.paint)); if (e.code === 'ArrowLeft' || e.code === 'KeyA') S.model = (S.model + n - 1) % n; if (e.code === 'ArrowRight' || e.code === 'KeyD') S.model = (S.model + 1) % n; if (e.code === 'ArrowUp' || e.code === 'KeyW') S.paint = PAINTS[(pi + PAINTS.length - 1) % PAINTS.length]; if (e.code === 'ArrowDown' || e.code === 'KeyS') S.paint = PAINTS[(pi + 1) % PAINTS.length]; garageRefresh(); if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); showScreen('trackSel'); } if (e.code === 'Escape') showScreen('select'); return; }
  if (S.mode === 'trackSel') { const n = TRACKS.length; if (e.code === 'ArrowLeft' || e.code === 'KeyA') S.trk = (S.trk + n - 1) % n; if (e.code === 'ArrowRight' || e.code === 'KeyD') S.trk = (S.trk + 1) % n; if (e.code === 'ArrowUp' || e.code === 'ArrowDown') S.trk = (S.trk + 4) % n; refreshTracks(); if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); S.gp = null; startRace(); } if (e.code === 'KeyG') { const cup = Math.floor(S.trk / 4); if (cup === 0 || summitUnlocked()) startGP(cup); } if (e.code === 'KeyD') { S.diff = (S.diff + 1) % 3; try { localStorage.setItem('pk_diff', S.diff); } catch (e2) {} refreshDiff(); } if (e.code === 'Escape') showScreen('garage'); return; }
  if (S.mode === 'finish') { if (e.code === 'Enter') { e.preventDefault(); afterFinish(); } return; }
  if (e.code === 'Enter' || e.code === 'KeyE' || e.code === 'ControlLeft' || e.code === 'ControlRight') keys._useItem = true;
  if (S.mode === 'pause') { if (e.code === 'Escape' || e.code === 'KeyP') resumeGame(); return; }
  if (S.mode === 'settings') { if (e.code === 'Escape' || e.code === 'Enter') closeSettings(); return; }
  if (e.code === 'KeyR' && (S.mode === 'race' || S.mode === 'countdown')) startRace();
  if ((e.code === 'Escape' || e.code === 'KeyP') && (S.mode === 'race' || S.mode === 'countdown')) pauseGame();
});
addEventListener('keyup', e => { keys[e.code] = false; });
ui.title.addEventListener('click', () => { unlockAudio(); if (S.mode === 'title') showScreen('select'); });
ui.charOk.addEventListener('click', () => showScreen('garage')); ui.garageOk.addEventListener('click', () => showScreen('trackSel')); ui.garageBack.addEventListener('click', () => showScreen('select')); ui.raceBtn.addEventListener('click', () => { S.gp = null; startRace(); }); ui.gpBtn.addEventListener('click', () => startGP(0)); ui.gp2Btn.addEventListener('click', () => { if (summitUnlocked()) startGP(1); }); ui.againBtn.addEventListener('click', afterFinish);
ui.pauseBtn.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); if (S.mode === 'pause') resumeGame(); else pauseGame(); });
ui.resumeBtn.addEventListener('click', resumeGame); ui.restartBtn.addEventListener('click', () => { ui.pause.hidden = true; S.mode = S.prevMode; startRace(); }); ui.quitBtn.addEventListener('click', () => { ui.pause.hidden = true; S.gp = null; musicStop(); showScreen('trackSel'); });
ui.pauseSettings.addEventListener('click', () => openSettings('pause')); ui.titleSettings.addEventListener('click', e => { e.stopPropagation(); openSettings('title'); }); ui.settingsBack.addEventListener('click', closeSettings);
for (const [id, key] of [['optMusic', 'music'], ['optSfx', 'sfx'], ['optEngine', 'engine']]) ui[id].addEventListener('input', () => { OPT[key] = +ui[id].value; applyOpt(); });
// wiping records and unlocks is destructive, so it takes two taps
let resetArmed = 0;
ui.resetProg.addEventListener('click', () => {
  if (resetArmed && Date.now() < resetArmed) { resetArmed = 0; resetProgress(); ui.resetProg.textContent = 'PROGRESS RESET'; setTimeout(() => { ui.resetProg.textContent = 'RESET PROGRESS'; }, 1800); return; }
  resetArmed = Date.now() + 5000; ui.resetProg.textContent = 'TAP AGAIN TO CONFIRM';
  setTimeout(() => { if (resetArmed) { resetArmed = 0; ui.resetProg.textContent = 'RESET PROGRESS'; } }, 5000);
});
ui.optMirror.addEventListener('change', () => { OPT.mirror = ui.optMirror.checked; applyOpt(); }); ui.optPerf.addEventListener('change', () => { OPT.perf = ui.optPerf.checked; applyOpt(); });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; touch.steer = 0; touch.drift = false; });
const isTouchDevice = matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window && navigator.maxTouchPoints > 0);
if (isTouchDevice) { document.body.classList.add('touch'); touch.active = true; }
for (const el of document.querySelectorAll('.tbtn')) {
  const set = on => { el.classList.toggle('on', on); const k = el.dataset.k; if (k === 'tDrift') touch.drift = on; if (k === 'tItem' && on) keys._useItem = true; };
  el.addEventListener('pointerdown', e => { e.preventDefault(); el.setPointerCapture(e.pointerId); touch.active = true; document.body.classList.add('touch'); unlockAudio(); set(true); });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(ev, () => set(false));
}
// analog steering pad: a virtual stick appears where the left thumb lands; drag sideways to steer
{
  const pad = document.getElementById('pad'), base = document.getElementById('stickBase'), knob = document.getElementById('stickKnob'); let pid = null, ox = 0, oy = 0;
  const RANGE = () => Math.max(30, base.getBoundingClientRect().width * 0.38);
  const steerFrom = e => { const b = base.getBoundingClientRect(), rg = RANGE(); const dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2); touch.steer = Math.max(-1, Math.min(1, -dx / rg)); const kx = Math.max(-rg, Math.min(rg, dx)), ky = Math.max(-rg * 0.3, Math.min(rg * 0.3, dy)); knob.style.transform = `translate(${kx}px, ${ky}px)`; };
  pad.addEventListener('pointerdown', e => { e.preventDefault(); if (pid !== null) return; pid = e.pointerId; pad.setPointerCapture(pid); touch.active = true; document.body.classList.add('touch'); unlockAudio(); pad.classList.add('on'); steerFrom(e); });
  pad.addEventListener('pointermove', e => { if (e.pointerId !== pid) return; steerFrom(e); });
  const end = e => { if (e.pointerId !== pid) return; pid = null; touch.steer = 0; pad.classList.remove('on'); knob.style.transform = ''; };
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) pad.addEventListener(ev, end);
}
function resize() { const r = fxCanvas.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1); const w = Math.max(1, (r.width * dpr) | 0), h = Math.max(1, (r.height * dpr) | 0); fxCanvas.width = w; fxCanvas.height = h; renderer.setPixelRatio(dpr); renderer.setSize(r.width, r.height, false); camera.aspect = r.width / r.height; camera.updateProjectionMatrix(); gCam.aspect = camera.aspect; if (r.width < 900) gCam.setViewOffset(r.width, r.height, -r.width * 0.2, 0, r.width, r.height); else gCam.clearViewOffset(); gCam.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

// ═══════════════════════ main loop ═══════════════════════
let last = performance.now(), lastCount = 5;
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (S.mode === 'countdown') {
    S.countdown -= dt; const c = Math.ceil(S.countdown - 0.3);
    if (c !== lastCount) { lastCount = c; if (c > 0 && c <= 3) SFX.count(); }
    ui.center.textContent = S.countdown > 0.3 ? (c <= 3 && c > 0 ? c : '') : 'GO!';
    if (S.countdown <= 0.3) { S.mode = 'race'; SFX.go(); setTimeout(() => { if (S.mode === 'race') ui.center.textContent = ''; }, 700);
      if (S.throttleAt !== null) { const held = S.throttleAt - 0.3; if (held < 0.5) { player.boost = 1.1; player.v = Math.max(player.v, 220); flash('ROCKET START!'); SFX.rocketStart(); } else { player.stall = 1.1; flash('TOO EARLY!'); SFX.stall(); } } }
    updateWorld(dt);
  } else if (S.mode === 'race') { S.raceTime += dt; updateWorld(dt); if (S.msgT > 0) S.msgT -= dt; }
  else if (S.mode === 'finish') { updateWorld(dt); if (S.msgT > 0) S.msgT -= dt; }
  if (S.mode === 'countdown' || S.mode === 'race' || S.mode === 'finish') { updateCamera(dt); syncScene(); renderer.render(scene, camera); if (OPT.mirror) renderMirror(); postFX(); updateHUD(); }
  else if (S.mode === 'garage') renderGarage(dt);
  if (engA && player) {
    const on = S.mode === 'race' || S.mode === 'finish' || S.mode === 'countdown', sp = Math.abs(player.v), rpm = 55 + sp * 0.5 + (player.boost > 0 ? 40 : 0) + (player.air ? 30 : 0);
    engGain.gain.setTargetAtTime(on && S.mode !== 'pause' ? (0.028 + sp * 0.00006) * OPT.engine * 1.6 : 0, AC.currentTime, 0.05); engA.frequency.setTargetAtTime(rpm, AC.currentTime, 0.04); engB.frequency.setTargetAtTime(rpm * 0.5, AC.currentTime, 0.04); engA.userData.frequency.setTargetAtTime(rpm * 0.25, AC.currentTime, 0.04);
    engFilter.frequency.setTargetAtTime(260 + sp * 1.6 + (player.boost > 0 ? 350 : 0), AC.currentTime, 0.05);
    const slip = Math.min(1, Math.abs(player.vlat) / 140), sq = (player.drift || slip > 0.35) && !player.air && S.mode === 'race' ? 1 : 0;
    skidGain.gain.setTargetAtTime(sq * (0.05 + slip * 0.08), AC.currentTime, 0.06); skidFilter.frequency.setTargetAtTime(1100 + slip * 900 + player.charge * 200, AC.currentTime, 0.1);
    squealGain.gain.setTargetAtTime(sq * (0.012 + slip * 0.03), AC.currentTime, 0.08); squeal.frequency.setTargetAtTime(700 + slip * 500 + player.charge * 160, AC.currentTime, 0.1);
  }
  requestAnimationFrame(loop);
}
buildRoster(); buildGarageUI();
applyOpt();
try { const d = +localStorage.getItem('pk_diff'); if (d >= 0 && d <= 2) S.diff = d; } catch (e) {}
const refreshDiff = () => [...ui.diffSeg.querySelectorAll('button')].forEach(b => b.classList.toggle('sel', +b.dataset.d === S.diff));
ui.diffSeg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; S.diff = +b.dataset.d; try { localStorage.setItem('pk_diff', S.diff); } catch (e2) {} refreshDiff(); }); refreshDiff();
// ── version stamp + stale-cache guard: if the server has a newer build than the one the browser cached, force a fresh load ──
const VERSION = 'v9.5'; // PEEKEE_VERSION=v9.5
renderBoard(); refreshUnlocks();
document.getElementById('note').textContent = 'Peekee Kart ' + VERSION + ' · an original kart racer made with Claude · WASD works too · phones: drag the left side to steer, DRIFT on the right';
setTimeout(() => { try { fetch(location.href, { cache: 'no-store' }).then(r => r.text()).then(t => { const m = t.match(/PEEKEE_VERSION=([\w.]+)/); if (m && m[1] !== VERSION && !sessionStorage.getItem('pk_reloaded')) { sessionStorage.setItem('pk_reloaded', '1'); fetch(location.href, { cache: 'reload' }).then(() => location.reload()); } }).catch(() => {}); } catch (e) {} }, 1500);
// hidden test hooks (used by automated checks; harmless in play)
window.__advance = sec => { for (let i = 0; i < sec * 60; i++) { const dt = 1 / 60; if (S.mode === 'countdown') { S.countdown -= dt; if (S.countdown <= 0.3) S.mode = 'race'; updateWorld(dt); } else if (S.mode === 'race' || S.mode === 'finish') { if (S.mode === 'race') S.raceTime += dt; updateWorld(dt); } } };
window.__state = () => player ? { mode: S.mode, lap: player.lap, v: Math.round(player.v), z: Math.round(player.z), air: player.air, rank: player.rank, idx: player.idx, finished: player.finished, jumps: window.__jumps || 0, hazards: S.hazards.length, gp: S.gp && S.gp.race } : { mode: S.mode };
requestAnimationFrame(loop);
})();
