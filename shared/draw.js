/* Pictures drawn in code (SVG), so every generated question can have one. */
(function(){
"use strict";
const Y4 = window.Y4 = window.Y4 || {};

/* A round cake/pizza cut into `slices` equal parts; parts in `on` are coloured. */
function pie(slices, on){
  const cx = 50, cy = 50, r = 44;
  if (slices === 1) return `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="pie ${on.has(0) ? "on" : ""}" cx="${cx}" cy="${cy}" r="${r}"/></svg>`;
  let p = "";
  for (let i = 0; i < slices; i++){
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / slices, a1 = a0 + 2 * Math.PI / slices;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    p += `<path class="pie ${on.has(i) ? "on" : ""}" d="M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${slices === 1 ? 1 : 0} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z"/>`;
  }
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${p}</svg>`;
}
/* A chocolate bar / ribbon split into `slices` equal parts. */
function bar(slices, on){
  const w = 96 / slices;
  let p = "";
  for (let i = 0; i < slices; i++) p += `<rect class="pie ${on.has(i) ? "on" : ""}" x="${(2 + i * w).toFixed(2)}" y="30" width="${w.toFixed(2)}" height="40" rx="3"/>`;
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${p}</svg>`;
}

Y4.draw = {
  /* `count` things, each cut into `slices`; if `share` is true, one slice of each thing is coloured
     (that is one person's share). shape: "round" or "bar" */
  shares(count, slices, share, shape){
    const one = shape === "bar" ? bar : pie;
    let h = "";
    for (let i = 0; i < count; i++) h += one(slices, share ? new Set([i % slices]) : new Set());
    return `<div class="pies">${h}</div>`;
  },
  /* a sum laid out in columns, e.g. column(347, "×", 6, 4), with an empty answer row
     `answerDigits` wide that the "column" input fills in */
  column(top, op, bottom, answerDigits){
    const A = String(top), B = String(bottom), w = Math.max(A.length, B.length, answerDigits || 0) + 1;
    const row = (s, lead, cls) => {
      const cells = [];
      for (let i = 0; i < w - s.length; i++) cells.push(i === 0 && lead ? lead : "");
      return `<div class="${cls || ""}">${cells.concat(s.split("")).map((c, i) => `<span class="${i === 0 && lead ? "op" : ""}">${c}</span>`).join("")}</div>`;
    };
    return `<div class="colsum">${row(A)}${row(B, op, "u")}${row("".padStart(w - 1, " ").replace(/ /g, "\u200b"), "", "colans")}</div>`;
  },
  /* a number line from lo to hi with a tick every `step` (labelled every `labelEvery` ticks).
     points: [{ v, cls:"start"|"end"|"", label }] are drawn as dots, with an optional label above */
  numberLine(lo, hi, step, points, labelEvery, tapStep){
    const W = 640, pad = 28, y = 52, n = Math.round((hi - lo) / step), le = labelEvery || 1;
    const x = v => pad + (v - lo) / (hi - lo) * (W - 2 * pad);
    let h = `<line x1="${pad - 14}" y1="${y}" x2="${W - pad + 14}" y2="${y}" class="nl-axis"/>`;
    for (let i = 0; i <= n; i++){
      const v = +(lo + i * step).toFixed(6), big = i % le === 0;    // toFixed: 0.1 steps don't drift
      h += `<line x1="${x(v)}" y1="${y - (big ? 9 : 5)}" x2="${x(v)}" y2="${y + (big ? 9 : 5)}" class="nl-axis"/>`;
      if (big) h += `<text x="${x(v)}" y="${y + 30}" class="nl-num ${v === 0 ? "zero" : ""}">${Y4.num(v)}</text>`;
    }
    if (tapStep){                                    // every tapStep along the line can be tapped (answer: its value)
      const k = Math.round((hi - lo) / tapStep), w = (W - 2 * pad) / k;
      for (let i = 0; i <= k; i++){
        const v = +(lo + i * tapStep).toFixed(6);
        h += `<rect x="${x(v) - w / 2}" y="${y - 30}" width="${w}" height="60" class="nl-tap" data-tap="${v}"/>`;
      }
    }
    (points || []).forEach(p => {
      if (p.arrow){                                  // an arrow pointing down at the line
        h += `<path d="M${x(p.v)},${y - 6} l-9,-16 h6 v-16 h6 v16 h6 Z" class="nl-arrow ${p.cls || ""}"/>`;
        if (p.label) h += `<text x="${x(p.v)}" y="${y - 44}" class="nl-lab">${p.label}</text>`;
        return;
      }
      h += `<circle cx="${x(p.v)}" cy="${y}" r="9" class="nl-pt ${p.cls || ""}"/>`;
      if (p.label) h += `<text x="${x(p.v)}" y="${y - 18}" class="nl-lab">${p.label}</text>`;
    });
    const top = (points || []).some(p => p.arrow && p.label) ? 64 : 0;
    return `<div class="nl"><svg viewBox="0 ${-top} ${W} ${96 + top}" aria-hidden="true">${h}</svg></div>`;
  },
  /* a place value chart: Th H T O */
  placeValue(n, highlight){
    const d = String(n).padStart(4, " ").split(""), heads = ["Th", "H", "T", "O"];
    return `<table class="pv"><tr>${heads.map(t => `<th>${t}</th>`).join("")}</tr>
      <tr>${d.map((c, i) => `<td class="${i === highlight ? "on" : ""}">${c.trim()}</td>`).join("")}</tr></table>`;
  },
  /* a fraction bar: `parts` equal parts, the first `shaded` coloured, with an optional label on the left */
  fracBar(parts, shaded, label){
    const W = 420, x0 = label ? 82 : 2, w = (W - x0 - 2) / parts;
    let h = label ? `<text x="${x0 - 12}" y="36" class="fb-lab">${label}</text>` : "";
    for (let i = 0; i < parts; i++) h += `<rect class="pie ${i < shaded ? "on" : ""}" x="${(x0 + i * w).toFixed(2)}" y="8" width="${w.toFixed(2)}" height="40" rx="3"/>`;
    return `<div class="fbar"><svg viewBox="0 0 ${W} 56" aria-hidden="true">${h}</svg></div>`;
  },
  /* a hundred square with `n` small squares coloured (n can be 0–100) */
  hundredSquare(n){
    let h = "";
    for (let i = 0; i < 100; i++){
      const r = Math.floor(i / 10), c = i % 10;
      h += `<rect class="pie ${i < n ? "on" : ""}" x="${2 + c * 19.6}" y="${2 + r * 19.6}" width="19.6" height="19.6"/>`;
    }
    return `<div class="hsq"><svg viewBox="0 0 200 200" aria-hidden="true">${h}</svg></div>`;
  },
  /* an analogue clock showing h:m */
  clock(h, m){
    const c = 100, r = 92;
    let s = `<circle cx="${c}" cy="${c}" r="${r}" class="ck-face"/>`;
    for (let i = 0; i < 60; i++){
      const a = i * Math.PI / 30, big = i % 5 === 0, r1 = big ? r - 12 : r - 6;
      s += `<line x1="${c + r1 * Math.sin(a)}" y1="${c - r1 * Math.cos(a)}" x2="${c + (r - 2) * Math.sin(a)}" y2="${c - (r - 2) * Math.cos(a)}" class="ck-tick ${big ? "big" : ""}"/>`;
    }
    for (let n = 1; n <= 12; n++){
      const a = n * Math.PI / 6;
      s += `<text x="${c + (r - 27) * Math.sin(a)}" y="${c - (r - 27) * Math.cos(a) + 7}" class="ck-num">${n}</text>`;
    }
    const hand = (deg, len, cls) => { const a = deg * Math.PI / 180;
      return `<line x1="${c}" y1="${c}" x2="${(c + len * Math.sin(a)).toFixed(2)}" y2="${(c - len * Math.cos(a)).toFixed(2)}" class="${cls}"/>`; };
    s += hand(((h % 12) + m / 60) * 30, 48, "ck-hour") + hand(m * 6, 74, "ck-min") + `<circle cx="${c}" cy="${c}" r="5" class="ck-pin"/>`;
    return `<div class="clock"><svg viewBox="0 0 200 200" aria-hidden="true">${s}</svg></div>`;
  },
  /* a shape on squared paper: cells is a list of [row, col]; the grid is rows × cols */
  gridShape(cells, rows, cols){
    const S = 28, W = cols * S + 4, H = rows * S + 4, on = new Set(cells.map(([r, c]) => r + "," + c));
    let s = "";
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
      s += `<rect x="${2 + c * S}" y="${2 + r * S}" width="${S}" height="${S}" class="${on.has(r + "," + c) ? "gs-on" : "gs-off"}"/>`;
    // thick outline round the shape: every cell edge with an empty cell (or the edge) on the other side
    for (const k of on){
      const [r, c] = k.split(",").map(Number), x = 2 + c * S, y = 2 + r * S;
      if (!on.has((r - 1) + "," + c)) s += `<line x1="${x}" y1="${y}" x2="${x + S}" y2="${y}" class="gs-edge"/>`;
      if (!on.has((r + 1) + "," + c)) s += `<line x1="${x}" y1="${y + S}" x2="${x + S}" y2="${y + S}" class="gs-edge"/>`;
      if (!on.has(r + "," + (c - 1))) s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + S}" class="gs-edge"/>`;
      if (!on.has(r + "," + (c + 1))) s += `<line x1="${x + S}" y1="${y}" x2="${x + S}" y2="${y + S}" class="gs-edge"/>`;
    }
    return `<div class="gshape" style="max-width:${Math.min(W * 1.4, 420)}px"><svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg></div>`;
  },
  /* a shape drawn from corner points (in units), with a label on some sides: labels[i] is for the side from
     point i to i+1. A label goes outside the shape, or inside if given as [text, "in"]. */
  labelledShape(points, labels){
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
    const k = Math.min(280 / w, 170 / h), pad = 95, W = w * k + 2 * pad, H = h * k + 2 * pad;
    const P = points.map(([x, y]) => [pad + (x - Math.min(...xs)) * k, pad + (y - Math.min(...ys)) * k]);
    const inside = (x, y) => {                         // ray casting
      let c = false;
      for (let i = 0, j = P.length - 1; i < P.length; j = i++){
        const [xi, yi] = P[i], [xj, yj] = P[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
    let s = `<polygon points="${P.map(p => p.join(",")).join(" ")}" class="ls-shape"/>`;
    P.forEach((p, i) => {
      const lab = labels[i]; if (!lab) return;
      const [text, where] = Array.isArray(lab) ? lab : [lab, "out"];
      const q = P[(i + 1) % P.length], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      const horiz = Math.abs(p[1] - q[1]) < 1e-6;
      let nx = horiz ? 0 : 1, ny = horiz ? 1 : 0;      // a normal to the side
      if (inside(mx + nx * 3, my + ny * 3) === (where === "out")){ nx = -nx; ny = -ny; }
      if (horiz && where === "in")                     // inside: line up with the right end, where there's room
        s += `<text x="${Math.max(p[0], q[0]) - 8}" y="${my + (ny > 0 ? 26 : -10)}" class="ls-lab" style="text-anchor:end">${text}</text>`;
      else if (horiz) s += `<text x="${mx}" y="${my + (ny > 0 ? 26 : -10)}" class="ls-lab">${text}</text>`;
      else s += `<text x="${mx + nx * 10}" y="${my + 7}" class="ls-lab" style="text-anchor:${nx > 0 ? "start" : "end"}">${text}</text>`;
    });
    return `<div class="lshape"><svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg></div>`;
  },
  /* coins and notes, values in pence */
  coins(list){
    const label = v => v >= 100 ? `£${v / 100}` : `${v}p`;
    const kind = v => v >= 500 ? "note" : v >= 100 ? "gold" : v >= 5 ? "silver" : "copper";
    return `<div class="coins">${list.map(v => `<span class="coin ${kind(v)}">${label(v)}</span>`).join("")}</div>`;
  },
  /* a polygon from points (any units, y down). opts: ticks {sideIndex: 1|2} marks equal sides,
     right [cornerIndex…] marks right angles, line {x1,y1,x2,y2} draws a dashed line (in the same units) */
  polygon(points, opts){
    opts = opts || {};
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    const w = Math.max(...xs) - Math.min(...xs) || 1, h = Math.max(...ys) - Math.min(...ys) || 1;
    const k = Math.min(220 / w, 170 / h), pad = 24;
    const T = ([x, y]) => [pad + (x - Math.min(...xs)) * k, pad + (y - Math.min(...ys)) * k];
    const P = points.map(T), W = w * k + 2 * pad, H = h * k + 2 * pad;
    let s = `<polygon points="${P.map(p => p.map(v => v.toFixed(1)).join(",")).join(" ")}" class="ls-shape"/>`;
    Object.entries(opts.ticks || {}).forEach(([i, n]) => {               // little marks across equal sides
      const a = P[+i], b = P[(+i + 1) % P.length], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / len, uy = (b[1] - a[1]) / len;
      for (let j = 0; j < n; j++){
        const off = (j - (n - 1) / 2) * 7, cx = mx + ux * off, cy = my + uy * off;
        s += `<line x1="${(cx - uy * 8).toFixed(1)}" y1="${(cy + ux * 8).toFixed(1)}" x2="${(cx + uy * 8).toFixed(1)}" y2="${(cy - ux * 8).toFixed(1)}" class="pg-tick"/>`;
      }
    });
    (opts.right || []).forEach(i => {                                      // right angle squares
      const v = P[i], a = P[(i + P.length - 1) % P.length], b = P[(i + 1) % P.length], m = 14;
      const u1 = [(a[0] - v[0]) / Math.hypot(a[0] - v[0], a[1] - v[1]), (a[1] - v[1]) / Math.hypot(a[0] - v[0], a[1] - v[1])];
      const u2 = [(b[0] - v[0]) / Math.hypot(b[0] - v[0], b[1] - v[1]), (b[1] - v[1]) / Math.hypot(b[0] - v[0], b[1] - v[1])];
      const p1 = [v[0] + u1[0] * m, v[1] + u1[1] * m], p2 = [p1[0] + u2[0] * m, p1[1] + u2[1] * m], p3 = [v[0] + u2[0] * m, v[1] + u2[1] * m];
      s += `<polyline points="${[p1, p2, p3].map(p => p.map(n => n.toFixed(1)).join(",")).join(" ")}" class="pg-right"/>`;
    });
    if (opts.line){
      const [a, b] = [T([opts.line.x1, opts.line.y1]), T([opts.line.x2, opts.line.y2])];
      s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="sym-line"/>`;
    }
    return `<div class="poly"><svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" aria-hidden="true">${s}</svg></div>`;
  },
  /* an angle of `deg` degrees, the first arm pointing at `rot` degrees; label is written underneath */
  angle(deg, rot, label, len){
    const R = len || 110, rad = d => d * Math.PI / 180;
    const p1 = [R * Math.cos(rad(rot)), -R * Math.sin(rad(rot))], p2 = [R * Math.cos(rad(rot + deg)), -R * Math.sin(rad(rot + deg))];
    const ox = 120, oy = 120, W = 240, H = 240;          // the same scale for every angle, so arms can be compared
    let s = `<line x1="${ox}" y1="${oy}" x2="${ox + p1[0]}" y2="${oy + p1[1]}" class="an-arm"/><line x1="${ox}" y1="${oy}" x2="${ox + p2[0]}" y2="${oy + p2[1]}" class="an-arm"/>`;
    if (deg === 90){
      const m = 18, a = [Math.cos(rad(rot)), -Math.sin(rad(rot))], b = [Math.cos(rad(rot + 90)), -Math.sin(rad(rot + 90))];
      s += `<polyline points="${ox + a[0] * m},${oy + a[1] * m} ${ox + (a[0] + b[0]) * m},${oy + (a[1] + b[1]) * m} ${ox + b[0] * m},${oy + b[1] * m}" class="pg-right"/>`;
    } else {
      const r = 30, a = [ox + r * Math.cos(rad(rot)), oy - r * Math.sin(rad(rot))], b = [ox + r * Math.cos(rad(rot + deg)), oy - r * Math.sin(rad(rot + deg))];
      s += `<path d="M${a[0].toFixed(1)},${a[1].toFixed(1)} A${r},${r} 0 ${deg > 180 ? 1 : 0} 0 ${b[0].toFixed(1)},${b[1].toFixed(1)}" class="an-arc"/>`;
    }
    return `<div class="ang"><svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" aria-hidden="true">${s}</svg>${label ? `<div class="an-cap">${label}</div>` : ""}</div>`;
  },
  /* squared paper for symmetry: shaded cells, optional tappable cells, and a dashed mirror line.
     line: {v: x} for a vertical line at x squares from the left, or {h: y} for a horizontal one */
  symGrid(shaded, rows, cols, line, tappable){
    const S = 34, on = new Set(shaded.map(([r, c]) => r + "," + c)), tap = new Set((tappable || []).map(([r, c]) => r + "," + c));
    let s = "";
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++){
      const k = r + "," + c;
      s += `<rect x="${2 + c * S}" y="${2 + r * S}" width="${S}" height="${S}" class="${on.has(k) ? "gs-on" : "gs-off"} ${tap.has(k) ? "tapcell" : ""}" ${tap.has(k) ? `data-cell="${k}"` : ""}/>`;
    }
    if (line && line.v !== undefined) s += `<line x1="${2 + line.v * S}" y1="0" x2="${2 + line.v * S}" y2="${rows * S + 4}" class="sym-line"/>`;
    if (line && line.h !== undefined) s += `<line x1="0" y1="${2 + line.h * S}" x2="${cols * S + 4}" y2="${2 + line.h * S}" class="sym-line"/>`;
    if (line && line.d) s += `<line x1="0" y1="0" x2="${cols * S + 4}" y2="${rows * S + 4}" class="sym-line"/>`;   // corner to corner
    return `<div class="gshape" style="max-width:${Math.min(cols * S * 1.3, 440)}px"><svg viewBox="0 0 ${cols * S + 4} ${rows * S + 4}">${s}</svg></div>`;
  },
  /* a coordinate grid from 0 to n. points: [{x, y, label}]; lines: [[x1,y1,x2,y2]]; tap: every crossing can be tapped */
  coordGrid(n, points, lines, tap){
    const S = 40, o = 34, W = o + n * S + 20, H = n * S + 20 + o;
    const X = x => o + x * S, Y = y => 14 + (n - y) * S;
    let s = "";
    for (let i = 0; i <= n; i++){
      s += `<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(n)}" class="cg-line"/><line x1="${X(0)}" y1="${Y(i)}" x2="${X(n)}" y2="${Y(i)}" class="cg-line"/>`;
      s += `<text x="${X(i)}" y="${Y(0) + 24}" class="cg-num">${i}</text>`;
      if (i) s += `<text x="${X(0) - 14}" y="${Y(i) + 6}" class="cg-num">${i}</text>`;
    }
    s += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(n)}" y2="${Y(0)}" class="cg-axis"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(n)}" class="cg-axis"/>`;
    (lines || []).forEach(([a, b, c, d]) => { s += `<line x1="${X(a)}" y1="${Y(b)}" x2="${X(c)}" y2="${Y(d)}" class="cg-shape"/>`; });
    if (tap) for (let x = 0; x <= n; x++) for (let y = 0; y <= n; y++)
      s += `<circle cx="${X(x)}" cy="${Y(y)}" r="${S * .42}" class="cg-tap" data-tap="${x},${y}"/>`;
    (points || []).forEach(p => {
      s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="7" class="cg-pt ${p.cls || ""}"/>`;
      if (p.label) s += `<text x="${X(p.x) + 13}" y="${Y(p.y) - 10}" class="cg-lab">${p.label}</text>`;
    });
    return `<div class="cgrid"><svg viewBox="0 0 ${W} ${H}">${s}</svg></div>`;
  },
  /* a bar chart. labels, values; o: {step (gridline gap), max, title, yLabel, tap (bars can be tapped)} */
  barChart(labels, values, o){
    const n = labels.length, H = 260, top = 34, left = 54, bw = 64, gap = 26, W = left + n * (bw + gap) + 10, base = top + H;
    const y = v => base - v / o.max * H;
    let s = o.title ? `<text x="${W / 2}" y="20" class="ch-title">${o.title}</text>` : "";
    for (let v = 0; v <= o.max; v += o.step)
      s += `<line x1="${left}" y1="${y(v)}" x2="${W - 6}" y2="${y(v)}" class="ch-grid"/><text x="${left - 8}" y="${y(v) + 5}" class="ch-num" style="text-anchor:end">${v}</text>`;
    labels.forEach((l, i) => {
      const x = left + gap / 2 + i * (bw + gap);
      s += `<rect x="${x}" y="${y(values[i])}" width="${bw}" height="${base - y(values[i])}" class="ch-bar ${o.tap ? "ch-tap" : ""}" ${o.tap ? `data-tap="${l}"` : ""}/>`;
      s += `<text x="${x + bw / 2}" y="${base + 22}" class="ch-lab">${l}</text>`;
    });
    s += `<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${base}" class="ch-axis"/><line x1="${left}" y1="${base}" x2="${W - 6}" y2="${base}" class="ch-axis"/>`;
    if (o.yLabel) s += `<text x="14" y="${top + H / 2}" class="ch-ylab" transform="rotate(-90 14 ${top + H / 2})">${o.yLabel}</text>`;
    return `<div class="chart"><svg viewBox="0 0 ${W} ${base + 34}">${s}</svg></div>`;
  },
  /* a line graph over time. xs (labels), ys; o: {step, max, min, title, yLabel} */
  lineGraph(xs, ys, o){
    const n = xs.length, H = 250, top = 34, left = 54, dx = 70, W = left + (n - 1) * dx + 62, base = top + H, min = o.min || 0;
    const X = i => left + 24 + i * dx, Y = v => base - (v - min) / (o.max - min) * H;
    let s = o.title ? `<text x="${W / 2}" y="20" class="ch-title">${o.title}</text>` : "";
    for (let v = min; v <= o.max; v += o.step)
      s += `<line x1="${left}" y1="${Y(v)}" x2="${W - 6}" y2="${Y(v)}" class="ch-grid"/><text x="${left - 8}" y="${Y(v) + 5}" class="ch-num" style="text-anchor:end">${v}</text>`;
    xs.forEach((l, i) => { s += `<line x1="${X(i)}" y1="${top}" x2="${X(i)}" y2="${base}" class="ch-grid"/><text x="${X(i)}" y="${base + 22}" class="ch-lab">${l}</text>`; });
    s += `<polyline points="${ys.map((v, i) => `${X(i)},${Y(v)}`).join(" ")}" class="ch-line"/>`;
    ys.forEach((v, i) => { s += `<circle cx="${X(i)}" cy="${Y(v)}" r="6" class="ch-pt"/>`; });
    s += `<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${base}" class="ch-axis"/><line x1="${left}" y1="${base}" x2="${W - 6}" y2="${base}" class="ch-axis"/>`;
    if (o.yLabel) s += `<text x="14" y="${top + H / 2}" class="ch-ylab" transform="rotate(-90 14 ${top + H / 2})">${o.yLabel}</text>`;
    return `<div class="chart"><svg viewBox="0 0 ${W} ${base + 34}">${s}</svg></div>`;
  },
  /* a pictogram: rows [[label, value]], each icon is worth `per`; a half icon shows half of that */
  pictogram(rows, icon, per, title){
    const icons = v => { let h = ""; for (let i = 0; i < Math.floor(v / per); i++) h += `<span class="pi">${icon}</span>`;
      if (v % per) h += `<span class="pi half"><span>${icon}</span></span>`; return h; };
    return `<div class="picto">${title ? `<div class="ch-title">${title}</div>` : ""}<table>${rows.map(([l, v]) => `<tr><th>${l}</th><td>${icons(v)}</td></tr>`).join("")}</table>
      <div class="pkey">Key: <span class="pi">${icon}</span> = ${per}</div></div>`;
  },
  /* tally marks for n: bundles of five (four lines crossed by a fifth) */
  tally(n){
    let h = "";
    for (let g = 0; g < Math.ceil(n / 5); g++){
      const k = Math.min(5, n - g * 5);
      let s = "";
      for (let i = 0; i < Math.min(k, 4); i++) s += `<line x1="${6 + i * 9}" y1="4" x2="${6 + i * 9}" y2="32" class="ta"/>`;
      if (k === 5) s += `<line x1="1" y1="28" x2="38" y2="8" class="ta"/>`;
      h += `<svg viewBox="0 0 ${k === 5 ? 40 : 8 + Math.min(k, 4) * 9} 36" class="tally" style="width:${(k === 5 ? 40 : 8 + Math.min(k, 4) * 9) * .9}px">${s}</svg>`;
    }
    return h;
  },
  /* a simple table: head is the first row, rows below; cells can be HTML */
  table(head, rows){
    return `<table class="dtable"><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map((c, i) => i ? `<td>${c}</td>` : `<th>${c}</th>`).join("")}</tr>`).join("")}</table>`;
  },
  /* a chart the child draws on: values[i] is a number (already drawn) or null (to be drawn by tapping).
     o: {step, max, kind:"bar"|"line", title, yLabel}. Heights are counted in steps (data-h = 1 … max/step). */
  makeChart(labels, values, o){
    const n = labels.length, H = 260, top = o.title ? 58 : 34, left = 54, cw = 90, W = left + n * cw + 10, base = top + H, k = o.max / o.step, sh = H / k;   // room for the ✏️ marks under the title
    const y = v => base - v / o.max * H, line = o.kind === "line";
    let s = o.title ? `<text x="${W / 2}" y="20" class="ch-title">${o.title}</text>` : "";
    for (let v = 0; v <= o.max; v += o.step)
      s += `<line x1="${left}" y1="${y(v)}" x2="${W - 6}" y2="${y(v)}" class="ch-grid"/><text x="${left - 8}" y="${y(v) + 5}" class="ch-num" style="text-anchor:end">${v}</text>`;
    labels.forEach((l, i) => {
      const cx = left + i * cw + cw / 2, bw = 56;
      if (line) s += `<line x1="${cx}" y1="${top}" x2="${cx}" y2="${base}" class="ch-grid"/>`;
      if (values[i] !== null){
        s += line ? `<circle cx="${cx}" cy="${y(values[i])}" r="7" class="ch-pt"/>`
                  : `<rect x="${cx - bw / 2}" y="${y(values[i])}" width="${bw}" height="${base - y(values[i])}" class="ch-bar"/>`;
      } else {
        for (let h = 1; h <= k; h++){
          const y0 = base - h * sh;
          s += `<g class="seg ${line ? "pt" : ""}" data-col="${l}" data-h="${h}">
            <rect x="${cx - cw / 2 + 2}" y="${y0}" width="${cw - 4}" height="${sh}" class="seg-hit"/>
            <rect x="${cx - bw / 2}" y="${y0}" width="${bw}" height="${sh}" class="seg-bar"/>
            <circle cx="${cx}" cy="${y0}" r="8" class="seg-pt"/></g>`;
        }
        s += `<text x="${cx}" y="${top - 8}" class="ch-num" style="text-anchor:middle">✏️</text>`;
      }
      s += `<text x="${cx}" y="${base + 22}" class="ch-lab">${l}</text>`;
    });
    s += `<line x1="${left}" y1="${top - 6}" x2="${left}" y2="${base}" class="ch-axis"/><line x1="${left}" y1="${base}" x2="${W - 6}" y2="${base}" class="ch-axis"/>`;
    if (o.yLabel) s += `<text x="14" y="${top + H / 2}" class="ch-ylab" transform="rotate(-90 14 ${top + H / 2})">${o.yLabel}</text>`;
    return `<div class="chart make"><svg viewBox="0 0 ${W} ${base + 34}">${s}</svg></div>`;
  },
  /* a ruler from 0 to `cm` with an object lying from `from` to `to` (in cm, to 0.1) */
  ruler(cm, from, to, thing){
    const k = 40, pad = 20, W = cm * k + 2 * pad, x = v => pad + v * k;
    let s = `<rect x="${pad - 10}" y="60" width="${cm * k + 20}" height="60" rx="6" class="ru-body"/>`;
    for (let i = 0; i <= cm * 10; i++){
      const big = i % 10 === 0, mid = i % 5 === 0;
      s += `<line x1="${x(i / 10)}" y1="60" x2="${x(i / 10)}" y2="${60 + (big ? 24 : mid ? 16 : 10)}" class="ru-tick"/>`;
      if (big) s += `<text x="${x(i / 10)}" y="104" class="ru-num">${i / 10}</text>`;
    }
    const icon = thing === "pencil"
      ? `<rect x="${x(from)}" y="28" width="${(to - from) * k - 18}" height="22" rx="3" class="ru-obj"/><path d="M${x(to) - 18},28 L${x(to)},39 L${x(to) - 18},50 Z" class="ru-tip"/>`
      : `<rect x="${x(from)}" y="28" width="${(to - from) * k}" height="22" rx="6" class="ru-obj"/>`;
    s += icon + `<line x1="${x(from)}" y1="24" x2="${x(from)}" y2="60" class="ru-guide"/><line x1="${x(to)}" y1="24" x2="${x(to)}" y2="60" class="ru-guide"/>`;
    return `<div class="ruler"><svg viewBox="0 0 ${W} 124" aria-hidden="true">${s}</svg></div>`;
  },
  /* a place value chart with decimals (T O . t h), one row per number, e.g. to show ÷ 10 */
  decimalChart(rows){
    const cols = ["T", "O", "t", "h"];
    const cells = v => {
      const [w, f = ""] = String(v).split(".");
      const ws = w.padStart(2, " "), fs = f.padEnd(2, " ");
      return [ws[0], ws[1], fs[0], fs[1]].map(c => c.trim());
    };
    return `<table class="pv dec"><tr>${cols.map((c, i) => `<th>${c}</th>${i === 1 ? "<th></th>" : ""}`).join("")}<th></th></tr>` +
      rows.map(([v, label]) => `<tr>${cells(v).map((c, i) => `<td>${c}</td>${i === 1 ? `<td class="dot">.</td>` : ""}`).join("")}<th class="rl">${label || ""}</th></tr>`).join("") +
      `</table>`;
  }
};
/* numbers written the way children read them: a real minus sign */
Y4.num = v => v < 0 ? "−" + String(+(-v).toFixed(6)) : String(+v.toFixed(6));
})();
