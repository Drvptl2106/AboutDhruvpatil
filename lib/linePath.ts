// Geometry for the scroll line: routes built from smooth, kink-free pieces.

export type Point = { x: number; y: number };

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** Just past a screen edge. */
export const OFF = 90;

/** The one corner radius used across the page, for a stage of this size. */
export const cornerRadius = (w: number, h: number) => clamp(Math.min(w, h) * 0.06, 36, 64);

/** How far the line keeps from any text it turns around. */
export const clearance = (w: number, h: number) => clamp(Math.min(w * 0.06, h * 0.1), 64, 104);
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export type Flat = { xs: Float32Array; ys: Float32Array; lens: Float32Array; total: number };

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

const add = (a: Point, b: Point) => ({ x: a.x + b.x, y: a.y + b.y });
const sub = (a: Point, b: Point) => ({ x: a.x - b.x, y: a.y - b.y });
const mul = (a: Point, k: number) => ({ x: a.x * k, y: a.y * k });
const unit = (a: Point) => {
  const l = Math.hypot(a.x, a.y) || 1;
  return { x: a.x / l, y: a.y / l };
};
const fmt = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
// Handle length that makes a cubic Bézier match a quarter circle.
const KAPPA = 0.5523;

/**
 * Builds a line from geometric pieces — sweeping curves with a set heading
 * at each end, true circles, straight runs — always leaving one piece in the
 * direction the next one starts, so the line never kinks.
 */
export class LineBuilder {
  private segs: [Point, Point, Point, Point][] = [];
  private marks: number[] = [];
  private p: Point;
  private dir: Point;

  constructor(start: Point, heading: Point) {
    this.p = start;
    this.dir = unit(heading);
  }

  private cubic(c1: Point, c2: Point, to: Point) {
    this.segs.push([this.p, c1, c2, to]);
    const end = sub(to, c2);
    this.dir = unit(Math.hypot(end.x, end.y) > 1e-6 ? end : sub(to, c1));
    this.p = to;
    return this;
  }

  /** Sweep to `to`, arriving with `heading`. Higher `tension` = rounder. */
  to(to: Point, heading: Point, tension = 0.4) {
    const h = dist(this.p, to) * tension;
    return this.cubic(add(this.p, mul(this.dir, h)), sub(to, mul(unit(heading), h)), to);
  }

  /** Straight run (call when already heading towards `to`). */
  line(to: Point) {
    const v = sub(to, this.p);
    return this.cubic(add(this.p, mul(v, 1 / 3)), add(this.p, mul(v, 2 / 3)), to);
  }

  /**
   * Straight runs through `pts`, every corner rounded to a true circular arc
   * of radius `r` (or the corner's own `r`). The radius shrinks by itself
   * where a run is too short for it. This is the line's whole vocabulary:
   * nothing but straights and arcs, so it can't wobble.
   */
  round(pts: (Point & { r?: number })[], r: number) {
    for (let i = 0; i < pts.length; i++) {
      const b = pts[i];
      const next = pts[i + 1];
      const a = this.p;
      const run = dist(a, b);
      if (!next) {
        if (run > 0.01) this.line(b);
        break;
      }
      const u = unit(sub(b, a));
      const v = unit(sub(next, b));
      const theta = Math.acos(clamp(u.x * v.x + u.y * v.y, -1, 1));
      if (run < 0.01) continue;
      if (theta < 1e-3) {
        this.line(b);
        continue;
      }
      const tan = Math.tan(theta / 2);
      // Leave half of the next run for the corner after this one.
      const room = pts[i + 2] ? dist(b, next) / 2 : dist(b, next);
      const d = Math.min((b.r ?? r) * tan, run, room);
      const k = (4 / 3) * Math.tan(theta / 4) * (d / tan);
      const from = sub(b, mul(u, d));
      const to = add(b, mul(v, d));
      if (dist(a, from) > 0.01) this.line(from);
      this.cubic(add(from, mul(u, k)), sub(to, mul(v, k)), to);
    }
    return this;
  }

  /** A true circle tangent to the current heading, `turns` × 360° (in quarters). */
  circle(r: number, turns: number, side: "left" | "right") {
    const n = side === "left" ? { x: this.dir.y, y: -this.dir.x } : { x: -this.dir.y, y: this.dir.x };
    const c = add(this.p, mul(n, r));
    const sgn = side === "left" ? -1 : 1;
    const at = (a: number) => ({ x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a) });
    const tangent = (a: number) => ({ x: -sgn * Math.sin(a), y: sgn * Math.cos(a) });
    let a = Math.atan2(this.p.y - c.y, this.p.x - c.x);
    for (let q = 0; q < Math.round(turns * 4); q++) {
      const b = a + (sgn * Math.PI) / 2;
      this.cubic(add(at(a), mul(tangent(a), KAPPA * r)), sub(at(b), mul(tangent(b), KAPPA * r)), at(b));
      a = b;
    }
    return this;
  }

  /**
   * An ellipse traced counter-clockwise on screen (top → left → bottom →
   * right…) starting from vertex `from` — arrive there heading the way the
   * curve runs (left at the top, down at the left side). `quarters`
   * quarter-turns, opening out a touch each turn like a pen circling a word.
   */
  ellipse(from: "top" | "left" | "bottom" | "right", rx: number, ry: number, quarters: number, grow = 0.05) {
    const verts = [
      { x: 0, y: -1 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ];
    const tans = [
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
    ];
    const first = ["top", "left", "bottom", "right"].indexOf(from);
    const c = { x: this.p.x - verts[first].x * rx, y: this.p.y - verts[first].y * ry };
    for (let q = 0; q < quarters; q++) {
      const i = (first + q) % 4;
      const j = (first + q + 1) % 4;
      const s0 = 1 + (grow * q) / 4;
      const s1 = 1 + (grow * (q + 1)) / 4;
      const to = { x: c.x + verts[j].x * rx * s1, y: c.y + verts[j].y * ry * s1 };
      const hA = KAPPA * (tans[i].x ? rx * s0 : ry * s0);
      const hB = KAPPA * (tans[j].x ? rx * s1 : ry * s1);
      this.cubic(add(this.p, mul(tans[i], hA)), sub(to, mul(tans[j], hB)), to);
    }
    return this;
  }

  /** The same, starting from the top (arrive heading left). */
  ellipseFromTop(rx: number, ry: number, quarters: number, grow = 0.05) {
    return this.ellipse("top", rx, ry, quarters, grow);
  }

  /**
   * A pen circling a word: `turns` rounds of a loose ellipse about `c`,
   * starting from its bottom heading right. Each round is a little off the
   * last — radius, centre and tilt drift — the way a hand goes round twice
   * and never lands on the same track. Drawn as one smooth stroke.
   */
  scribble(c: Point, rx: number, ry: number, turns = 2.35) {
    const per = 18;
    const pts: Point[] = [this.p];
    const n = Math.round(turns * per);
    for (let i = 1; i <= n; i++) {
      const t = i / per; // rounds so far
      const k = i / n;
      const a = Math.PI / 2 - t * Math.PI * 2;
      const sx = rx * (1 + 0.07 * Math.sin(t * 2.3) + 0.06 * k);
      const sy = ry * (1 + 0.12 * Math.sin(t * 1.7) + 0.08 * k);
      const tilt = -0.08 * Math.sin(t * 1.4);
      const ox = rx * 0.06 * Math.sin(t * 2.9);
      const oy = ry * 0.1 * Math.sin(t * 2.1);
      const x = sx * Math.cos(a);
      const y = sy * Math.sin(a);
      pts.push({
        x: c.x + ox + x * Math.cos(tilt) - y * Math.sin(tilt),
        y: c.y + oy + x * Math.sin(tilt) + y * Math.cos(tilt),
      });
    }
    // Catmull-Rom through the points, leaving in the current heading.
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? add(p2, sub(p2, p1));
      const c1 = p0 ? add(p1, mul(sub(p2, p0), 1 / 6)) : add(p1, mul(this.dir, dist(p1, p2) / 3));
      const c2 = sub(p2, mul(sub(p3, p1), 1 / 6));
      this.cubic(c1, c2, p2);
    }
    return this;
  }

  /** Remember this spot; `build()` reports how far along the line it is. */
  mark() {
    this.marks.push(this.segs.length);
    return this;
  }

  get point() {
    return this.p;
  }

  build() {
    const steps = 16;
    const n = this.segs.length * steps + 1;
    const flat: Flat = { xs: new Float32Array(n), ys: new Float32Array(n), lens: new Float32Array(n), total: 0 };
    const segEnd: number[] = [0];
    let d = this.segs.length ? `M ${fmt(this.segs[0][0])}` : "";
    flat.xs[0] = this.segs[0]?.[0].x ?? 0;
    flat.ys[0] = this.segs[0]?.[0].y ?? 0;
    let k = 1;
    for (const [p0, c1, c2, p1] of this.segs) {
      d += ` C ${fmt(c1)}, ${fmt(c2)}, ${fmt(p1)}`;
      for (let j = 1; j <= steps; j++, k++) {
        const t = j / steps;
        const u = 1 - t;
        flat.xs[k] = u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x;
        flat.ys[k] = u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y;
        flat.lens[k] = flat.lens[k - 1] + Math.hypot(flat.xs[k] - flat.xs[k - 1], flat.ys[k] - flat.ys[k - 1]);
      }
      segEnd.push(flat.lens[k - 1]);
    }
    flat.total = flat.lens[n - 1];
    const marks = this.marks.map((i) => (flat.total ? segEnd[i] / flat.total : 0));
    return { d, flat, marks };
  }
}
