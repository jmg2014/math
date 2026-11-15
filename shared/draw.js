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
  numberLine(lo, hi, step, points, labelEvery){
    const W = 640, pad = 28, y = 52, n = Math.round((hi - lo) / step), le = labelEvery || 1;
    const x = v => pad + (v - lo) / (hi - lo) * (W - 2 * pad);
    let h = `<line x1="${pad - 14}" y1="${y}" x2="${W - pad + 14}" y2="${y}" class="nl-axis"/>`;
    for (let i = 0; i <= n; i++){
      const v = lo + i * step, big = i % le === 0;
      h += `<line x1="${x(v)}" y1="${y - (big ? 9 : 5)}" x2="${x(v)}" y2="${y + (big ? 9 : 5)}" class="nl-axis"/>`;
      if (big) h += `<text x="${x(v)}" y="${y + 30}" class="nl-num ${v === 0 ? "zero" : ""}">${Y4.num(v)}</text>`;
    }
    (points || []).forEach(p => {
      h += `<circle cx="${x(p.v)}" cy="${y}" r="9" class="nl-pt ${p.cls || ""}"/>`;
      if (p.label) h += `<text x="${x(p.v)}" y="${y - 18}" class="nl-lab">${p.label}</text>`;
    });
    return `<div class="nl"><svg viewBox="0 0 ${W} 96" aria-hidden="true">${h}</svg></div>`;
  },
  /* a place value chart: Th H T O */
  placeValue(n, highlight){
    const d = String(n).padStart(4, " ").split(""), heads = ["Th", "H", "T", "O"];
    return `<table class="pv"><tr>${heads.map(t => `<th>${t}</th>`).join("")}</tr>
      <tr>${d.map((c, i) => `<td class="${i === highlight ? "on" : ""}">${c.trim()}</td>`).join("")}</tr></table>`;
  }
};
/* numbers written the way children read them: a real minus sign */
Y4.num = v => v < 0 ? "−" + (-v) : String(v);
})();
