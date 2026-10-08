/* ================= 3D RIBBON =================
   A green band on a descending spiral around the neck and chest.
   Geometry is computed once in comp px (2576-wide design). The band body is baked once
   into offscreen canvases (one for the part behind him, one for the part in front);
   the entrance only animates a reveal mask over those bakes, then the body stops for good.
   After that, the only per-frame work is the lettering: cached glyph sprites placed on
   the precomputed path. Every frame is a pure function of the rAF timestamp, so motion
   is steady regardless of frame rate.

   Framework-free on purpose: <Portrait> mounts it on the figure and calls destroy() on unmount. */

import { clamp, smoothstep as smooth } from '@/lib/motion';

const LAYERS = ['halo', 'back', 'backText', 'shadow', 'front', 'frontText'] as const;
type Layer = (typeof LAYERS)[number];

export interface RibbonOptions {
  /** CSS font-family for the lettering (pass the next/font family so it matches the page) */
  fontFamily: string;
  text?: string;
  reducedMotion?: boolean;
}

export interface RibbonHandle {
  replay: () => void;
  destroy: () => void;
}

type V3 = [number, number, number];
interface Sprite { c?: HTMLCanvasElement; w: number; ox?: number; oy?: number; sw?: number; sh?: number }

const BOX = { x: 775.2, y: 35.8, w: 1347.6 }; // photo box in comp px
// One wrap on a slant of 30° around the top turn easing to 25° around the bottom turn. Three parallel
// legs joined by two rounded turns; it only switches between behind and in front inside the right
// wrap, which sits outside the body outline, so it never passes through him.
const G = { F: 2300, camx: 1330, camy: 650 };
const PATH = { angTop: 30, angBot: 25, ox: 1330, oy: 843, gap: 150, tS: 660, tL: -130, tR: 480, tEnd: -600, r: 78,
  z1: -430, z2: -230, z3a: 240, z3b: 330, bow1: -28, bow2: -28, bow3: 34 };
const HW = 33, TH = 6, DS = 4;                      // half width, thickness, sample step
const DEFAULT_TEXT = 'PRODUCT ENGINEERING · SYSTEMS ARCHITECTURE · AI ENGINEERING · FULL-STACK EXECUTION · INFRASTRUCTURE · TECHNICAL LEADERSHIP · ';
const FS = 22.5, TRACK = 0.3;
const TAIL = 120, END = 260, HEAD = 150;            // fade lengths along the band
const ENTER_AT = 1.7, ENTER_DUR = 3.6, SPEED = 46;  // s, s, comp px per second
const ZF = 25;                                      // front/back cross-fade half-depth

export function createRibbon(fig: HTMLElement, img: HTMLImageElement, opts: RibbonOptions): RibbonHandle {
  const TEXT = opts.text ?? DEFAULT_TEXT;
  const FONT = opts.fontFamily;
  const reduce = !!opts.reducedMotion;

  const C = {} as Record<Layer, HTMLCanvasElement>;
  const X = {} as Record<Layer, CanvasRenderingContext2D>;
  for (const n of LAYERS) {
    C[n] = fig.querySelector<HTMLCanvasElement>('.rb-' + n)!;
    X[n] = C[n].getContext('2d')!;
  }

  /* ---------- geometry (once) ---------- */
  const proj = (x: number, y: number, z: number): [number, number] => {
    const s = G.F / (G.F - z);
    return [G.camx + (x - G.camx) * s, G.camy + (y - G.camy) * s];
  };

  // the path in screen space (comp px) plus depth, built from straight-ish legs and half-turns
  // that meet with matching direction, then lifted into 3D
  const dense: [number, number, number, number][] = [];
  const angAt = (t: number) => {
    const u = smooth(PATH.tL, PATH.tR, t);
    return ((PATH.angBot + (PATH.angTop - PATH.angBot) * u) * Math.PI) / 180;
  };
  {
    const c1 = -2 * PATH.gap, c2 = -PATH.gap, c3 = 0, STEP = 2;
    // base curve: direction eases from the bottom-turn angle to the top-turn angle; legs are offsets of it
    const T0 = -1200, BX = new Float64Array(2401), BY = new Float64Array(2401);
    for (let q = 1; q <= 2400; q++) {
      const A = angAt(T0 + q - 0.5);
      BX[q] = BX[q - 1] + Math.cos(A);
      BY[q] = BY[q - 1] - Math.sin(A);
    }
    const ox0 = BX[1200], oy0 = BY[1200];
    const base = (t: number) => {
      const f = t - T0, q = Math.max(0, Math.min(2399, Math.floor(f))), w = f - q;
      return [BX[q] + (BX[q + 1] - BX[q]) * w - ox0, BY[q] + (BY[q + 1] - BY[q]) * w - oy0];
    };
    const sin2 = (t: number, t0: number, t1: number) => {
      const u = clamp((t - t0) / (t1 - t0));
      const v = Math.sin(Math.PI * u);
      return v * v;
    };
    const put = (t: number, c: number, z: number) => {
      const b = base(t), A = angAt(t);
      const Xp = PATH.ox + b[0] + c * Math.sin(A), Yp = PATH.oy + b[1] + c * Math.cos(A), s = G.F / (G.F - z);
      dense.push([G.camx + (Xp - G.camx) / s, G.camy + (Yp - G.camy) / s, z, A]);
    };
    const half = (t0: number, dir: number, ca: number, cb: number, za: number, zb: number) => {
      const m = Math.ceil((Math.PI * PATH.r) / STEP);
      for (let k = 0; k < m; k++) {
        const ps = (Math.PI * k) / m, e = (1 - Math.cos(ps)) / 2;
        put(t0 + dir * PATH.r * Math.sin(ps), ca + (cb - ca) * e, za + (zb - za) * e);
      }
    };
    for (let t = PATH.tS; t > PATH.tL; t -= STEP) put(t, c1 + PATH.bow1 * sin2(t, PATH.tL, PATH.tS), PATH.z1);
    half(PATH.tL, -1, c1, c2, PATH.z1, PATH.z2);
    for (let t = PATH.tL; t < PATH.tR; t += STEP) put(t, c2 + PATH.bow2 * sin2(t, PATH.tL, PATH.tR), PATH.z2);
    half(PATH.tR, 1, c2, c3, PATH.z2, PATH.z3a);
    for (let t = PATH.tR; t >= PATH.tEnd; t -= STEP) {
      const u = (PATH.tR - t) / (PATH.tR - PATH.tEnd);
      put(t, c3 + PATH.bow3 * sin2(t, PATH.tEnd, PATH.tR), PATH.z3a + (PATH.z3b - PATH.z3a) * u);
    }
  }
  const cum = [0];
  for (let i = 1; i < dense.length; i++) {
    const a = dense[i - 1], b = dense[i];
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  }
  const M = dense.length - 1, L = cum[M], N = Math.floor(L / DS) + 1;
  const PX = new Float32Array(N), PY = new Float32Array(N), PZ = new Float32Array(N);
  const NX = new Float32Array(N), NY = new Float32Array(N), NZ = new Float32Array(N);
  const WX = new Float32Array(N), WY = new Float32Array(N), WZ = new Float32Array(N);
  const SX = new Float32Array(N), SY = new Float32Array(N), FACE = new Float32Array(N);
  const RX = new Float32Array(N), RY = new Float32Array(N), DX = new Float32Array(N), DY = new Float32Array(N);
  const AN = new Float32Array(N);
  for (let i = 0, j = 0; i < N; i++) {
    const s = i * DS;
    while (j < M - 1 && cum[j + 1] < s) j++;
    const f = (s - cum[j]) / (cum[j + 1] - cum[j] || 1), a = dense[j], b = dense[j + 1];
    PX[i] = a[0] + (b[0] - a[0]) * f; PY[i] = a[1] + (b[1] - a[1]) * f; PZ[i] = a[2] + (b[2] - a[2]) * f;
    AN[i] = a[3] + (b[3] - a[3]) * f;
  }
  // band frame: tilted, rolled to sit square to the slanted legs and turns
  const TILT = (31 * Math.PI) / 180, LEAN = 0.45;
  for (let i = 0; i < N; i++) {
    const ROLL = -AN[i];
    const UP = [Math.cos(TILT) * Math.sin(ROLL), -Math.cos(TILT) * Math.cos(ROLL), Math.sin(TILT)];
    const a = Math.max(0, i - 2), b = Math.min(N - 1, i + 2);
    let tx = PX[b] - PX[a], ty = PY[b] - PY[a], tz = PZ[b] - PZ[a];
    const tl = Math.hypot(tx, ty, tz) || 1;
    tx /= tl; ty /= tl; tz /= tl;
    const du = UP[0] * tx + UP[1] * ty + UP[2] * tz, lean = LEAN * smooth(0.93, 0.99, Math.abs(du));
    let wx = UP[0] - du * tx + lean * (0 - tz * tx), wy = UP[1] - du * ty + lean * (0 - tz * ty), wz = UP[2] - du * tz + lean * (1 - tz * tz);
    const wl = Math.hypot(wx, wy, wz) || 1;
    wx /= wl; wy /= wl; wz /= wl;
    WX[i] = wx; WY[i] = wy; WZ[i] = wz;
    NX[i] = ty * wz - tz * wy; NY[i] = tz * wx - tx * wz; NZ[i] = tx * wy - ty * wx;
  }
  for (let i = 0; i < N; i++) {
    const a = Math.max(0, i - 1), b = Math.min(N - 1, i + 1);
    let tx = PX[b] - PX[a], ty = PY[b] - PY[a], tz = PZ[b] - PZ[a];
    const tl = Math.hypot(tx, ty, tz) || 1;
    tx /= tl; ty /= tl; tz /= tl;
    const p = proj(PX[i], PY[i], PZ[i]);
    SX[i] = p[0]; SY[i] = p[1];
    const pr = proj(PX[i] + tx, PY[i] + ty, PZ[i] + tz), pd = proj(PX[i] - WX[i], PY[i] - WY[i], PZ[i] - WZ[i]);
    RX[i] = pr[0] - p[0]; RY[i] = pr[1] - p[1]; DX[i] = pd[0] - p[0]; DY[i] = pd[1] - p[1];
    const vx = G.camx - PX[i], vy = G.camy - PY[i], vz = G.F - PZ[i];
    const vl = Math.hypot(vx, vy, vz);
    FACE[i] = (NX[i] * vx + NY[i] * vy + NZ[i] * vz) / vl;
  }
  // bounding box of everything drawn (band + thickness + soft shadow), comp px
  let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
  for (let i = 0; i < N; i++)
    for (const k of [-1, 1]) {
      const p = proj(PX[i] + WX[i] * HW * k, PY[i] + WY[i] * HW * k, PZ[i] + WZ[i] * HW * k);
      bx0 = Math.min(bx0, p[0]); bx1 = Math.max(bx1, p[0]); by0 = Math.min(by0, p[1]); by1 = Math.max(by1, p[1]);
    }
  const PADB = 70;
  bx0 -= PADB; by0 -= PADB; bx1 += PADB; by1 += PADB + 30;
  const BW = bx1 - bx0, BH = by1 - by0;

  const P = (i: number, u: number, v: number) =>
    proj(PX[i] + WX[i] * u + NX[i] * v, PY[i] + WY[i] * u + NY[i] * v, PZ[i] + WZ[i] * u + NZ[i] * v);

  // reveal mask = the band's own footprint, one quad pair per segment, all wound the same way
  const MQ = new Float32Array((N - 1) * 16);
  {
    const hw = HW + 1.5;
    for (let i = 0; i < N - 1; i++) {
      let o = i * 16;
      for (const v of [TH / 2 + 0.5, -TH / 2 - 0.5]) {
        const q = [P(i, hw, v), P(i + 1, hw, v), P(i + 1, -hw, v), P(i, -hw, v)];
        let area = 0;
        for (let a = 0; a < 4; a++) {
          const p = q[a], n = q[(a + 1) % 4];
          area += p[0] * n[1] - n[0] * p[1];
        }
        if (area < 0) q.reverse();
        for (const p of q) { MQ[o++] = p[0]; MQ[o++] = p[1]; }
      }
    }
  }
  // per-segment bounds (comp px) so a redraw only touches segments inside the dirty area
  const SB = new Float32Array((N - 1) * 4);
  for (let i = 0; i < N - 1; i++) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let o = i * 16, e = o + 16; o < e; o += 2) {
      const x = MQ[o], y = MQ[o + 1];
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    SB[i * 4] = x0; SB[i * 4 + 1] = y0; SB[i * 4 + 2] = x1; SB[i * 4 + 3] = y1;
  }
  // which way the outer print must run along the path to read left-to-right (not mirrored)
  let best = 0;
  for (let i = 1; i < N; i++) if (FACE[i] > FACE[best]) best = i;
  const OUT = RX[best] * DY[best] - RY[best] * DX[best] > 0 ? 1 : -1;

  /* ---------- lighting ---------- */
  const nrm = (x: number, y: number, z: number): V3 => {
    const l = Math.hypot(x, y, z) || 1;
    return [x / l, y / l, z / l];
  };
  const LIGHT = nrm(-0.5, -0.78, 0.62), HALF = nrm(LIGHT[0], LIGHT[1], LIGHT[2] + 1);
  // ribbon colours: lit #11B79B, shade #075144
  function shade(n: V3, k: number) {
    const dif = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
    const spec = Math.pow(Math.max(0, n[0] * HALF[0] + n[1] * HALF[1] + n[2] * HALF[2]), 34);
    const t = (0.3 + 0.7 * dif) * k;
    const u = Math.min(1.1, Math.max(0, (t - 0.2) / 0.8));
    return `rgb(${(7 + 10 * u + 110 * spec) | 0},${(81 + 102 * u + 118 * spec) | 0},${(68 + 87 * u + 112 * spec) | 0})`;
  }

  /* ---------- device-dependent state ---------- */
  let k = 1, unit = 1; // device px per comp px
  const fullBack = document.createElement('canvas'), fullFront = document.createElement('canvas'), mask = document.createElement('canvas');
  const FB = fullBack.getContext('2d')!, FF = fullFront.getContext('2d')!, MK = mask.getContext('2d')!;
  let sprites: Record<string, Sprite> = {};
  let layout: { ch: string; sp: Sprite; q: number }[] = [];
  let LT = 1;

  function setup() {
    const w = fig.clientWidth;
    if (!w) return false;
    unit = w / BOX.w;
    k = unit * Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.ceil(BW * k), H = Math.ceil(BH * k);
    for (const n of LAYERS) {
      const c = C[n];
      c.style.left = (bx0 - BOX.x) * unit + 'px'; c.style.top = (by0 - BOX.y) * unit + 'px';
      c.style.width = BW * unit + 'px'; c.style.height = BH * unit + 'px';
      if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    }
    for (const c of [fullBack, fullFront, mask]) { c.width = W; c.height = H; }
    buildSprites(); bake(); drawExtras();
    return true;
  }

  // comp px -> device px on our canvases
  const toDev = (ctx: CanvasRenderingContext2D) => ctx.setTransform(k, 0, 0, k, -bx0 * k, -by0 * k);

  /* ---------- glyph sprites (sharp, cached) ---------- */
  function buildSprites() {
    const meas = document.createElement('canvas').getContext('2d')!;
    meas.font = `500 ${FS}px ${FONT}`;
    const px = Math.max(10, Math.round(FS * k * 1.5)), sc = FS / px, pad = Math.ceil(px * 0.25);
    sprites = {};
    for (const ch of new Set(TEXT)) {
      if (ch === ' ') { sprites[ch] = { w: meas.measureText(ch).width }; continue; }
      const c = document.createElement('canvas'), g = c.getContext('2d')!;
      g.font = `500 ${px}px ${FONT}`;
      const gw = Math.ceil(g.measureText(ch).width) + pad * 2, gh = Math.ceil(px * 1.3) + pad * 2;
      c.width = gw; c.height = gh;
      g.font = `500 ${px}px ${FONT}`; g.fillStyle = '#f2fff5'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(ch, gw / 2, gh / 2 + px * 0.04);
      sprites[ch] = { c, w: meas.measureText(ch).width, ox: (-gw / 2) * sc, oy: (-gh / 2) * sc, sw: gw * sc, sh: gh * sc };
    }
    layout = [];
    let x = 0;
    for (const ch of TEXT) {
      const w = sprites[ch].w;
      layout.push({ ch, sp: sprites[ch], q: x + w / 2 });
      x += w + FS * TRACK;
    }
    LT = x;
  }

  /* ---------- bake the band body (only on setup/resize) ---------- */
  function bake() {
    for (const g of [FB, FF]) { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, fullBack.width, fullBack.height); toDev(g); }
    const order = Array.from({ length: N - 1 }, (_, i) => i).sort((a, b) => PZ[a] + PZ[a + 1] - (PZ[b] + PZ[b + 1]));
    for (const i of order) {
      const j = i + 1, zm = (PZ[i] + PZ[j]) / 2, fm = (FACE[i] + FACE[j]) / 2;
      const side = fm >= 0 ? 1 : -1, off = (side * TH) / 2; // visible face sits on that side of the band
      const nx = NX[i] * side, ny = NY[i] * side, nz = NZ[i] * side, kk = side > 0 ? 1 : 0.8;
      // face quad, nudged a hair along the screen tangent so neighbours overlap (no seams)
      const a0 = P(i, HW, off), a1 = P(j, HW, off), b1 = P(j, -HW, off), b0 = P(i, -HW, off);
      let ex = SX[j] - SX[i], ey = SY[j] - SY[i];
      const el = Math.hypot(ex, ey) || 1;
      ex = (ex / el) * 0.35; ey = (ey / el) * 0.35;
      const mid = Math.max(0, Math.min(N - 1, i));
      const top = P(mid, HW, off), bot = P(mid, -HW, off);
      const targets: [CanvasRenderingContext2D, number][] = [];
      if (zm < ZF) targets.push([FB, 1]);
      if (zm > -ZF) targets.push([FF, smooth(-ZF, ZF, zm)]);
      for (const [g, al] of targets) {
        if (al <= 0.002) continue;
        g.globalAlpha = al;
        const grad = g.createLinearGradient(top[0], top[1], bot[0], bot[1]);
        for (const w of [1, 0.55, 0, -0.55, -1]) {
          const n = nrm(nx + WX[i] * w * 0.42, ny + WY[i] * w * 0.42, nz + WZ[i] * w * 0.42);
          grad.addColorStop((1 - w) / 2, shade(n, kk * (w < -0.6 ? 0.86 : 1)));
        }
        g.fillStyle = grad;
        g.beginPath(); g.moveTo(a0[0] - ex, a0[1] - ey); g.lineTo(a1[0] + ex, a1[1] + ey); g.lineTo(b1[0] + ex, b1[1] + ey); g.lineTo(b0[0] - ex, b0[1] - ey); g.closePath(); g.fill();
        // top edge: the band's thickness, catching the light from above
        const t0 = P(i, HW, TH / 2), t1 = P(j, HW, TH / 2), t2 = P(j, HW, -TH / 2), t3 = P(i, HW, -TH / 2);
        g.fillStyle = shade(nrm(WX[i] + nx * 0.25, WY[i] + ny * 0.25, WZ[i] + nz * 0.25), 1.12);
        g.beginPath(); g.moveTo(t0[0] - ex, t0[1] - ey); g.lineTo(t1[0] + ex, t1[1] + ey); g.lineTo(t2[0] + ex, t2[1] + ey); g.lineTo(t3[0] - ex, t3[1] - ey); g.closePath(); g.fill();
        // fine rim highlight on the top lip
        g.strokeStyle = 'rgba(160,255,232,.35)'; g.lineWidth = 0.9;
        const r0 = P(i, HW, (-side * TH) / 2), r1 = P(j, HW, (-side * TH) / 2);
        g.beginPath(); g.moveTo(r0[0], r0[1]); g.lineTo(r1[0], r1[1]); g.stroke();
      }
    }
    FB.globalAlpha = FF.globalAlpha = 1;
  }

  /* ---------- reveal / fade mask ---------- */
  const alphaAt = (s: number, head: number) => Math.min(clamp(s / TAIL), clamp((L - s) / END), clamp((head - s) / HEAD));
  // footprint bounds of segments [a, b] in device px, or null
  function segRect(a: number, b: number): [number, number, number, number] | null {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = Math.max(0, a); i <= Math.min(N - 2, b); i++) {
      for (let o = i * 16, e = o + 16; o < e; o += 2) {
        const x = MQ[o], y = MQ[o + 1];
        if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
    if (x1 < x0) return null;
    const W = mask.width, H = mask.height;
    const rx = Math.max(0, Math.floor((x0 - bx0) * k) - 3), ry = Math.max(0, Math.floor((y0 - by0) * k) - 3);
    const rw = Math.min(W, Math.ceil((x1 - bx0) * k) + 3) - rx, rh = Math.min(H, Math.ceil((y1 - by0) * k) + 3) - ry;
    return rw > 0 && rh > 0 ? [rx, ry, rw, rh] : null;
  }
  const RAMP = new Int32Array(N);
  function quadPath(g: CanvasRenderingContext2D, i: number) {
    for (let o = i * 16, e = o + 16; o < e; o += 8) {
      g.moveTo(MQ[o], MQ[o + 1]); g.lineTo(MQ[o + 2], MQ[o + 3]); g.lineTo(MQ[o + 4], MQ[o + 5]); g.lineTo(MQ[o + 6], MQ[o + 7]); g.closePath();
    }
  }
  function drawMask(head: number, r: [number, number, number, number]) {
    MK.setTransform(1, 0, 0, 1, 0, 0); MK.save();
    MK.beginPath(); MK.rect(r[0], r[1], r[2], r[3]); MK.clip(); MK.clearRect(r[0], r[1], r[2], r[3]);
    toDev(MK);
    const last = Math.min(N - 1, Math.ceil(head / DS));
    // dirty area back in comp px; segments outside it are skipped entirely
    const cx0 = r[0] / k + bx0 - 2, cy0 = r[1] / k + by0 - 2, cx1 = (r[0] + r[2]) / k + bx0 + 2, cy1 = (r[1] + r[3]) / k + by0 + 2;
    // fully revealed stretch: one path, nonzero union, so no seams between segments
    MK.fillStyle = '#fff'; MK.beginPath();
    let nRamp = 0;
    for (let i = 0; i < last; i++) {
      const b = i * 4;
      if (SB[b] > cx1 || SB[b + 2] < cx0 || SB[b + 1] > cy1 || SB[b + 3] < cy0) continue;
      const a = Math.min(alphaAt(i * DS, head), alphaAt((i + 1) * DS, head));
      if (a >= 1) quadPath(MK, i); else if (a > 0.002) RAMP[nRamp++] = i;
    }
    MK.fill();
    // fading stretches: per-segment alpha, added so shared edges stay exact
    MK.globalCompositeOperation = 'lighter';
    for (let q = 0; q < nRamp; q++) {
      const i = RAMP[q], a = (alphaAt(i * DS, head) + alphaAt((i + 1) * DS, head)) / 2;
      MK.globalAlpha = a; MK.beginPath(); quadPath(MK, i); MK.fill();
    }
    MK.restore();
  }
  // composite (bake ∩ mask) into the visible layers, only inside rectangle r
  function composeRect(head: number, r: [number, number, number, number]) {
    drawMask(head, r);
    for (let q = 0; q < 2; q++) {
      const g = q ? X.front : X.back, src = q ? fullFront : fullBack;
      g.setTransform(1, 0, 0, 1, 0, 0); g.save();
      g.beginPath(); g.rect(r[0], r[1], r[2], r[3]); g.clip();
      g.clearRect(r[0], r[1], r[2], r[3]);
      g.drawImage(src, r[0], r[1], r[2], r[3], r[0], r[1], r[2], r[3]);
      g.globalCompositeOperation = 'destination-in';
      g.drawImage(mask, r[0], r[1], r[2], r[3], r[0], r[1], r[2], r[3]);
      g.restore();
    }
  }
  let prevHead = -1;
  function composeBody(head: number) {
    if (prevHead < 0) { // fresh start: blank layers
      for (const n of ['back', 'front'] as const) { X[n].setTransform(1, 0, 0, 1, 0, 0); X[n].clearRect(0, 0, C[n].width, C[n].height); }
      prevHead = 0;
    }
    if (head <= 0) return;
    // only the stretch from the previous frame's fade start to the new tip can change
    const r = segRect(Math.floor((prevHead - HEAD) / DS) - 2, Math.ceil(head / DS) + 1);
    if (r) composeRect(head, r);
    prevHead = head;
  }
  function composeFinal() {
    prevHead = -1; composeBody(0);
    composeRect(1e9, [0, 0, mask.width, mask.height]); prevHead = 1e9;
  }

  /* ---------- static extras: computed up front from the final state, faded in on settle ---------- */
  const hasFilter = 'filter' in X.halo;
  function drawExtras() {
    const W = C.halo.width, H = C.halo.height;
    const tmp = document.createElement('canvas');
    tmp.width = W; tmp.height = H;
    const T = tmp.getContext('2d')!;
    drawMask(1e9, [0, 0, W, H]);
    const finalOf = (src: HTMLCanvasElement) => {
      T.globalCompositeOperation = 'source-over'; T.clearRect(0, 0, W, H); T.drawImage(src, 0, 0);
      T.globalCompositeOperation = 'destination-in'; T.drawImage(mask, 0, 0); T.globalCompositeOperation = 'source-over';
    };
    // soft green halo around the band, behind everything
    const h = X.halo;
    h.setTransform(1, 0, 0, 1, 0, 0); h.clearRect(0, 0, W, H);
    h.filter = hasFilter ? `blur(${(14 * k).toFixed(1)}px)` : 'none'; h.globalAlpha = 0.45;
    finalOf(fullBack); h.drawImage(tmp, 0, 0);
    finalOf(fullFront); h.drawImage(tmp, 0, 0);
    h.filter = 'none'; h.globalAlpha = 1;
    // contact shadow of the front band, only on the person
    const s = X.shadow;
    s.setTransform(1, 0, 0, 1, 0, 0); s.clearRect(0, 0, W, H);
    s.filter = hasFilter ? `blur(${(9 * k).toFixed(1)}px)` : 'none';
    s.drawImage(tmp, 0, 16 * k); s.filter = 'none';
    s.globalCompositeOperation = 'source-in'; s.fillStyle = 'rgba(0,0,0,.62)'; s.fillRect(0, 0, W, H);
    s.globalCompositeOperation = 'destination-in';
    if (img.complete && img.naturalWidth) {
      toDev(s);
      s.drawImage(img, BOX.x, BOX.y, BOX.w, (BOX.w * img.naturalHeight) / img.naturalWidth);
    } else s.clearRect(0, 0, W, H);
    s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-over';
    tmp.width = tmp.height = 0;
  }

  /* ---------- lettering (every frame) ---------- */
  function drawText(t: number, head: number) {
    const back = X.backText, front = X.frontText;
    back.setTransform(1, 0, 0, 1, 0, 0); back.clearRect(0, 0, C.backText.width, C.backText.height);
    front.setTransform(1, 0, 0, 1, 0, 0); front.clearRect(0, 0, C.frontText.width, C.frontText.height);
    const off = (((SPEED * t) % LT) + LT) % LT;
    const sMax = Math.min(L, head);
    for (let side = 1; side >= -1; side -= 2) {
      // outer print reads along the path; the inner print reads the other way, so both read correctly
      for (let m = -2; m * LT < L + 2 * LT; m++) {
        for (let gi = 0; gi < layout.length; gi++) {
          const gl = layout[gi], sp = gl.sp;
          if (!sp.c) continue;
          const s = off + m * LT + side * OUT * gl.q;
          if (s < 0 || s > sMax) continue;
          const fi = s / DS, i0 = fi | 0, i1 = Math.min(N - 1, i0 + 1), f = fi - i0;
          const face = FACE[i0] + (FACE[i1] - FACE[i0]) * f;
          const fw = smooth(0.05, 0.3, face * side);
          if (fw <= 0) continue;
          const a = fw * alphaAt(s, head) * (side > 0 ? 0.96 : 0.78);
          if (a < 0.01) continue;
          const z = PZ[i0] + (PZ[i1] - PZ[i0]) * f;
          const px = SX[i0] + (SX[i1] - SX[i0]) * f, py = SY[i0] + (SY[i1] - SY[i0]) * f;
          const dir = side * OUT;
          const rx = (RX[i0] + (RX[i1] - RX[i0]) * f) * dir, ry = (RY[i0] + (RY[i1] - RY[i0]) * f) * dir;
          const dx = DX[i0] + (DX[i1] - DX[i0]) * f, dy = DY[i0] + (DY[i1] - DY[i0]) * f;
          const wf = smooth(-ZF, ZF, z), af = a * wf;
          const ab = z < ZF ? (af >= 1 ? 0 : (a - af) / (1 - af)) : 0;
          const e = k * (px - bx0), f2 = k * (py - by0);
          if (ab >= 0.01) { back.globalAlpha = ab; back.setTransform(k * rx, k * ry, k * dx, k * dy, e, f2); back.drawImage(sp.c, sp.ox!, sp.oy!, sp.sw!, sp.sh!); }
          if (af >= 0.01) { front.globalAlpha = af; front.setTransform(k * rx, k * ry, k * dx, k * dy, e, f2); front.drawImage(sp.c, sp.ox!, sp.oy!, sp.sw!, sp.sh!); }
        }
      }
    }
    back.globalAlpha = front.globalAlpha = 1;
  }

  /* ---------- timeline ---------- */
  let t0 = performance.now(), settled = false, running = false, visible = true, raf = 0, ready = false;
  const headAt = (t: number) => {
    const e = clamp((t - ENTER_AT) / ENTER_DUR);
    return (0.5 - 0.5 * Math.cos(Math.PI * e)) * (L + HEAD);
  };
  function settle() {
    if (prevHead < 0) composeFinal(); else composeBody(L + HEAD + 3 * DS);
    prevHead = 1e9; settled = true; fig.classList.add('rb-settled');
  }
  function render(now: number) {
    const t = reduce ? 0 : (now - t0) / 1000;
    if (!settled) {
      if (reduce || t >= ENTER_AT + ENTER_DUR) settle();
      else composeBody(headAt(t));
    }
    drawText(t, settled ? 1e9 : headAt(t));
  }
  function tick(now: number) { raf = 0; if (!running) return; render(now); if (!reduce) raf = requestAnimationFrame(tick); }
  function start() { if (running || !ready) return; running = true; raf = requestAnimationFrame(tick); }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  ready = setup();
  if (ready) { if (reduce) render(performance.now()); else start(); }

  // resize: keep the current bitmaps scaled via CSS right away, re-render sharp once resizing pauses
  let lastW = fig.clientWidth, rto = 0;
  function place() {
    const w = fig.clientWidth;
    if (!w) return;
    const u = w / BOX.w;
    for (const n of LAYERS) {
      const c = C[n];
      c.style.left = (bx0 - BOX.x) * u + 'px'; c.style.top = (by0 - BOX.y) * u + 'px';
      c.style.width = BW * u + 'px'; c.style.height = BH * u + 'px';
    }
  }
  const ro = new ResizeObserver(() => {
    const w = fig.clientWidth;
    if (!w || (w === lastW && ready)) return;
    lastW = w;
    if (ready) place();
    window.clearTimeout(rto);
    rto = window.setTimeout(() => {
      ready = setup();
      if (!ready) return;
      if (settled) composeFinal(); else prevHead = -1;
      if (reduce) render(performance.now()); else if (visible) start();
    }, ready ? 160 : 0);
  });
  ro.observe(fig);
  // pause the lettering while the hero is off screen
  const io = new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
    if (visible && !reduce) start(); else stop();
  });
  io.observe(fig);
  const onImg = () => { if (ready) drawExtras(); };
  if (!(img.complete && img.naturalWidth)) img.addEventListener('load', onImg, { once: true });
  let alive = true;
  if (document.fonts) document.fonts.ready.then(() => {
    if (!alive || !ready) return;
    buildSprites();
    if (reduce) render(performance.now());
  });

  return {
    replay() {
      t0 = performance.now(); settled = false; prevHead = -1; fig.classList.remove('rb-settled');
      if (reduce) render(t0); else start();
    },
    destroy() {
      alive = false;
      stop(); ro.disconnect(); io.disconnect(); window.clearTimeout(rto);
      img.removeEventListener('load', onImg);
    },
  };
}
