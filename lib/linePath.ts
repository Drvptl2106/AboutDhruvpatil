// Geometry for the scroll lines: smooth curves through a route of points.

export type Point = { x: number; y: number };

export const TAU = Math.PI * 2;

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
export const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * A clean, smooth loop: an ellipse traced `turns` times whose centre glides
 * a little as it goes, so repeated turns sit beside each other (like the
 * loops in Skiper 19) instead of on top of each other. Starts at angle `start`.
 */
export function loop(c: Point, r: number, turns: number, dir: 1 | -1, start: number, glide = 0.35): Point[] {
  const n = Math.ceil(turns * 28);
  const pts: Point[] = [];
  for (let k = 1; k <= n; k++) {
    const t = k / n;
    const a = start + dir * t * turns * TAU;
    pts.push({ x: c.x + r * 1.08 * Math.cos(a) - t * r * glide, y: c.y + r * Math.sin(a) });
  }
  return pts;
}

export type Flat = { xs: Float32Array; ys: Float32Array; lens: Float32Array; total: number };

const FLAT_STEPS = 12;

/**
 * Smooth curve through every point (centripetal Catmull-Rom → cubic Béziers).
 * Also returns the curve flattened into a polyline so scroll lookups don't
 * need the (slow) SVG getPointAtLength.
 */
export function toPath(pts: Point[]): { d: string; flat: Flat } {
  const n = Math.max(pts.length - 1, 0) * FLAT_STEPS + 1;
  const flat: Flat = {
    xs: new Float32Array(n),
    ys: new Float32Array(n),
    lens: new Float32Array(n),
    total: 0,
  };
  if (pts.length < 2) return { d: "", flat };
  flat.xs[0] = pts[0].x;
  flat.ys[0] = pts[0].y;
  let k = 1;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const d1 = Math.sqrt(dist(p0, p1));
    const d2 = Math.sqrt(dist(p1, p2)) || 1e-3;
    const d3 = Math.sqrt(dist(p2, p3));
    const c1 =
      d1 < 1e-3
        ? p1
        : {
            x: (d1 * d1 * p2.x - d2 * d2 * p0.x + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.x) / (3 * d1 * (d1 + d2)),
            y: (d1 * d1 * p2.y - d2 * d2 * p0.y + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.y) / (3 * d1 * (d1 + d2)),
          };
    const c2 =
      d3 < 1e-3
        ? p2
        : {
            x: (d3 * d3 * p1.x - d2 * d2 * p3.x + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.x) / (3 * d3 * (d3 + d2)),
            y: (d3 * d3 * p1.y - d2 * d2 * p3.y + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.y) / (3 * d3 * (d3 + d2)),
          };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    for (let j = 1; j <= FLAT_STEPS; j++, k++) {
      const t = j / FLAT_STEPS;
      const u = 1 - t;
      const a = u * u * u;
      const b = 3 * u * u * t;
      const c = 3 * u * t * t;
      const e = t * t * t;
      flat.xs[k] = a * p1.x + b * c1.x + c * c2.x + e * p2.x;
      flat.ys[k] = a * p1.y + b * c1.y + c * c2.y + e * p2.y;
      flat.lens[k] = flat.lens[k - 1] + Math.hypot(flat.xs[k] - flat.xs[k - 1], flat.ys[k] - flat.ys[k - 1]);
    }
  }
  flat.total = flat.lens[n - 1];
  return { d, flat };
}

/** Fraction of the way along `flat` at which it passes closest to `p`. */
export function fractionAt(flat: Flat, p: Point) {
  let best = Infinity;
  let len = 0;
  for (let i = 0; i < flat.xs.length; i++) {
    const d = Math.hypot(flat.xs[i] - p.x, flat.ys[i] - p.y);
    if (d < best) {
      best = d;
      len = flat.lens[i];
    }
  }
  return flat.total ? len / flat.total : 0;
}

/** Apply `f` to every coordinate pair of an absolute M/C-only path string. */
export function mapPath(d: string, f: (p: Point) => Point) {
  return d.replace(/(-?\d*\.?\d+)[\s,]+(-?\d*\.?\d+)/g, (_, x, y) => {
    const p = f({ x: parseFloat(x), y: parseFloat(y) });
    return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  });
}
