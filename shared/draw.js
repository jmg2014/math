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
  /* a sum laid out in columns, e.g. column(347, "×", 6) */
  column(top, op, bottom){
    const A = String(top), B = String(bottom), w = Math.max(A.length, B.length) + 1;
    const row = (s, lead) => {
      const cells = [];
      for (let i = 0; i < w - s.length; i++) cells.push(i === 0 && lead ? lead : "");
      return `<div>${cells.concat(s.split("")).map(c => `<span>${c}</span>`).join("")}</div>`;
    };
    return `<div class="colsum">${row(A)}${row(B, op)}</div>`;
  }
};
})();
