// Geometry for the scroll line: routes built from smooth, kink-free pieces.

export type Point = { x: number; y: number };

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
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
