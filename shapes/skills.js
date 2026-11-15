/* Geometry: shapes, angles, symmetry (section 6) and position and direction (section 7). */
(function(){
"use strict";
const { rnd, pick, shuffle } = Y4;
const rf = (lo, hi) => lo + Math.random() * (hi - lo);            // a random decimal
const rotate = (pts, deg) => {
  const a = deg * Math.PI / 180, cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)]);
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/* ---------- shape makers: points (y down), equal-side ticks, right angles ---------- */
const SHAPES = {
  equilateral(){ const p = [0, 1, 2].map(i => [Math.cos(-Math.PI / 2 + i * 2 * Math.PI / 3), Math.sin(-Math.PI / 2 + i * 2 * Math.PI / 3)]); return { pts:p, ticks:{ 0:1, 1:1, 2:1 } }; },
  isosceles(){ const h = Math.random() < .5 ? rf(.7, 1.3) : rf(2.3, 3.2); return { pts:[[0, 0], [2, 0], [1, -h]], ticks:{ 1:1, 2:1 } }; },
  scalene(){
    for (;;){
      const a = rf(2, 3), b = rf(.2, a - .2), c = rf(1, 2.2), p = [[0, 0], [a, 0], [b, -c]];
      const L = [dist(p[0], p[1]), dist(p[1], p[2]), dist(p[2], p[0])].sort((x, y) => x - y);
      const angs = [0, 1, 2].map(i => { const A = p[i], B = p[(i + 1) % 3], C = p[(i + 2) % 3];
        const v1 = [B[0] - A[0], B[1] - A[1]], v2 = [C[0] - A[0], C[1] - A[1]];
        return Math.acos((v1[0] * v2[0] + v1[1] * v2[1]) / Math.hypot(...v1) / Math.hypot(...v2)) * 180 / Math.PI; });
      if (L[1] / L[0] > 1.18 && L[2] / L[1] > 1.18 && Math.min(...angs) > 25 && angs.every(x => Math.abs(x - 90) > 8)) return { pts:p, ticks:{} };
    }
  },
  square(){ return { pts:[[0, 0], [1, 0], [1, 1], [0, 1]], ticks:{ 0:1, 1:1, 2:1, 3:1 }, right:[0, 1, 2, 3] }; },
  rectangle(){ const w = rf(1.6, 2.4); return { pts:[[0, 0], [w, 0], [w, 1], [0, 1]], ticks:{ 0:1, 2:1, 1:2, 3:2 }, right:[0, 1, 2, 3] }; },
  rhombus(){ const t = rf(55, 70) * Math.PI / 180; return { pts:[[0, 0], [1, 0], [1 + Math.cos(t), Math.sin(t)], [Math.cos(t), Math.sin(t)]], ticks:{ 0:1, 1:1, 2:1, 3:1 } }; },
  parallelogram(){ const a = rf(1.6, 2.1), t = rf(55, 70) * Math.PI / 180; return { pts:[[0, 0], [a, 0], [a + Math.cos(t), Math.sin(t)], [Math.cos(t), Math.sin(t)]], ticks:{ 0:1, 2:1, 1:2, 3:2 } }; },
  trapezium(){                                     // lopsided on purpose: a symmetrical one would have a line of symmetry
    let t1, t2; do { t1 = rf(.2, 1); t2 = rf(1.9, 2.8); } while (Math.abs(t1 - (3 - t2)) < .4);
    return { pts:[[t1, 0], [t2, 0], [3, 1.3], [0, 1.3]], ticks:{} }; },
  kite(){ const a = rf(.6, .9), c = rf(1.6, 2.2), b = rf(.8, 1.1); return { pts:[[0, -a], [b, 0], [0, c], [-b, 0]], ticks:{ 0:1, 3:1, 1:2, 2:2 } }; }
};
const TRIS = ["equilateral", "isosceles", "scalene"], QUADS = ["square", "rectangle", "rhombus", "parallelogram", "trapezium", "kite"];
const cap = s => s[0].toUpperCase() + s.slice(1);
const ABOUT = {
  equilateral:"An equilateral triangle has 3 equal sides (and 3 equal angles).",
  isosceles:"An isosceles triangle has exactly 2 equal sides.",
  scalene:"A scalene triangle has no equal sides.",
  square:"A square has 4 equal sides and 4 right angles.",
  rectangle:"A rectangle has 4 right angles, and its opposite sides are equal.",
  rhombus:"A rhombus has 4 equal sides, but no right angles.",
  parallelogram:"A parallelogram has 2 pairs of parallel sides; opposite sides are equal.",
  trapezium:"A trapezium has exactly 1 pair of parallel sides.",
  kite:"A kite has 2 pairs of equal sides next to each other."
};
const draw = (name, extra) => { const s = SHAPES[name](); return Y4.draw.polygon(rotate(s.pts, rnd(-25, 25)), Object.assign({ ticks:s.ticks, right:s.right }, extra)); };

/* ---------- Triangles and quadrilaterals ---------- */
const FACTS = [
  ["Which quadrilateral has 4 equal sides and 4 right angles?", "Square", QUADS],
  ["Which quadrilateral has 4 right angles, but its sides are not all equal?", "Rectangle", QUADS],
  ["Which quadrilateral has 4 equal sides, but no right angles?", "Rhombus", QUADS],
  ["Which quadrilateral has exactly 1 pair of parallel sides?", "Trapezium", QUADS],
  ["Which quadrilateral has 2 pairs of parallel sides, no right angles, and sides that are not all equal?", "Parallelogram", QUADS],
  ["Which quadrilateral has 2 pairs of equal sides next to each other?", "Kite", QUADS],
  ["Which triangle has 3 equal sides?", "Equilateral", TRIS],
  ["Which triangle has exactly 2 equal sides?", "Isosceles", TRIS],
  ["Which triangle has no equal sides?", "Scalene", TRIS],
  ["Is every square also a rectangle?", "Yes", null, "Yes: a square has 4 right angles, and that's what makes a rectangle."],
  ["Is every rectangle also a square?", "No", null, "No: a rectangle's sides don't have to be all equal."],
  ["Is every square also a rhombus?", "Yes", null, "Yes: a square has 4 equal sides, and that's what makes a rhombus."],
  ["Can a triangle have 2 right angles?", "No", null, "No: two right angles would make two sides parallel, so they could never meet."]
];
const shapesSkill = {
  id:"ge-shapes", name:"Triangles and quadrilaterals", emoji:"🔷",
  desc:"Little marks on sides show which sides are equal. A small square in a corner shows a right angle.",
  levels:[
    { name:"Triangles", desc:"Equilateral, isosceles or scalene?" },
    { name:"Quadrilaterals", desc:"Square, rectangle, rhombus, parallelogram, trapezium or kite?" },
    { name:"Properties", desc:"Which shape has exactly one pair of parallel sides?" }
  ],
  make(lv){
    if (lv < 3){
      const name = lv === 1 ? pick(TRIS) : pick(QUADS);
      const choices = lv === 1 ? TRIS.map(cap) : shuffle([cap(name), ...shuffle(QUADS.filter(q => q !== name)).slice(0, 3).map(cap)]);
      return { text:`What is the name of this ${lv === 1 ? "triangle" : "quadrilateral"}?`, picture:draw(name), input:"choice", choices, answer:cap(name),
        key:name + Math.random(), explain:`It's a <b>${name}</b><span class="why">${ABOUT[name]}</span>`, solution:`${cap(name)}: ${ABOUT[name]}` };
    }
    const [text, answer, set, why] = pick(FACTS);
    const choices = set ? (set.length === 3 ? set.map(cap) : shuffle([answer, ...shuffle(set.map(cap).filter(c => c !== answer)).slice(0, 3)])) : ["Yes", "No"];
    return { text, input:"choice", choices, answer, key:text,
      explain:`<b>${answer}</b><span class="why">${why || ABOUT[answer.toLowerCase()]}</span>`, solution:`${text} ${answer}` };
  }
};

/* ---------- Angles ---------- */
const angleType = d => d < 90 ? "Acute" : d === 90 ? "Right angle" : d < 180 ? "Obtuse" : "Straight line";
const ANGLE_WHY = { "Acute":"An acute angle is smaller than a right angle.", "Right angle":"A right angle is a square corner, a quarter turn.",
  "Obtuse":"An obtuse angle is bigger than a right angle but smaller than a straight line.", "Straight line":"A straight line is two right angles, a half turn." };
const RIGHT_SHAPES = [
  ["a rectangle", () => SHAPES.rectangle().pts, 4], ["a square", () => SHAPES.square().pts, 4],
  ["a trapezium", () => [[0, 0], [2, 0], [3, 1.5], [0, 1.5]], 2], ["a triangle", () => [[0, 0], [2.6, 1.8], [0, 1.8]], 1],
  ["a parallelogram", () => SHAPES.parallelogram().pts, 0], ["an L shape", () => [[0, 0], [1, 0], [1, 1.2], [2.4, 1.2], [2.4, 2.2], [0, 2.2]], 5]
];
const anglesSkill = {
  id:"ge-angles", name:"Angles", emoji:"📐",
  desc:"An angle is an amount of turn. A right angle is a quarter turn (a square corner). Acute angles are smaller than a right angle; obtuse angles are bigger than a right angle but smaller than a straight line.",
  levels:[
    { name:"Acute, right or obtuse?", desc:"Look at the size of the turn" },
    { name:"Compare angles", desc:"Which angle is the biggest? Put them in order" },
    { name:"Angles around us", desc:"Clock hands, right angles in shapes, turns" }
  ],
  make(lv){
    if (lv === 1){
      const kind = pick(["a", "r", "o"]), d = kind === "a" ? rnd(20, 72) : kind === "r" ? 90 : rnd(108, 165), t = angleType(d);
      return { text:"What kind of angle is this?", picture:Y4.draw.angle(d, rnd(0, 359)), input:"choice", choices:["Acute", "Right angle", "Obtuse"], answer:t, key:`${kind}${d}${Math.random()}`,
        explain:`<b>${t}</b><span class="why">${ANGLE_WHY[t]}</span>`, solution:`${d}° is ${t.toLowerCase()}` };
    }
    if (lv === 2){
      let ds; do { ds = [0, 1, 2].map(() => rnd(20, 170)); } while (Math.min(Math.abs(ds[0] - ds[1]), Math.abs(ds[1] - ds[2]), Math.abs(ds[0] - ds[2])) < 22);
      const L = ["A", "B", "C"], pic = `<div class="angles">${ds.map((d, i) => Y4.draw.angle(d, rnd(0, 359), L[i], rnd(80, 114))).join("")}</div>`;
      const order = [0, 1, 2].sort((a, b) => ds[a] - ds[b]).map(i => L[i]);
      if (Math.random() < .35){
        const right = order.join(", "), perms = ["A, B, C", "A, C, B", "B, A, C", "B, C, A", "C, A, B", "C, B, A"];
        return { text:"Put the angles in order, smallest first.", picture:pic, input:"choice", choices:shuffle([right, ...shuffle(perms.filter(p => p !== right)).slice(0, 3)]), answer:right,
          key:ds.join("/"), explain:`<b>${right}</b><span class="why">Compare how far each angle opens: the smallest turn first.</span>`, solution:`Smallest first: ${right}` };
      }
      const big = Math.random() < .5, ans = big ? order[2] : order[0];
      return { text:`Which angle is the ${big ? "biggest" : "smallest"}?`, picture:pic, input:"choice", choices:L, answer:ans, key:ds.join("/") + big,
        explain:`<b>${ans}</b><span class="why">The size of an angle is how far it opens, not how long its arms are. Smallest to biggest: ${order.join(", ")}.</span>`,
        solution:`${big ? "Biggest" : "Smallest"}: ${ans}` };
    }
    const form = rnd(1, 3);
    if (form === 1){
      const h = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]), d = Math.min(h, 12 - h) * 30, t = angleType(d);
      return { text:`What kind of angle do the hands make at ${h} o'clock?`, picture:Y4.draw.clock(h, 0), input:"choice", choices:["Acute", "Right angle", "Obtuse", "Straight line"], answer:t, key:`clk${h}`,
        explain:`<b>${t}</b><span class="why">${ANGLE_WHY[t]} At 3 o'clock and 9 o'clock the hands make a right angle.</span>`, solution:`${h} o'clock: ${t.toLowerCase()}` };
    }
    if (form === 2){
      const [name, pts, n] = pick(RIGHT_SHAPES);
      return { text:`How many right angles are inside this shape?`, picture:Y4.draw.polygon(rotate(pts(), pick([0, 0, 90, 180]))), answer:n, key:`ra${name}${Math.random()}`,
        explain:`<b>${n}</b><span class="why">Check each corner inside the shape for a square corner.${name === "an L shape" ? " The corner that points inwards is bigger than a right angle, so it doesn't count." : ""}</span>`,
        solution:`${cap(name)} like this has ${n} right angle${n === 1 ? "" : "s"}` };
    }
    const [turn, n] = pick([["a quarter turn", 1], ["a half turn", 2], ["three-quarters of a turn", 3], ["a full turn", 4]]);
    return { text:`How many right angles make ${turn}?`, answer:n, key:turn,
      explain:`<b>${n}</b><span class="why">A right angle is a quarter turn, so ${turn} is ${n} right angle${n === 1 ? "" : "s"}.</span>`, solution:`${cap(turn)} = ${n} right angle${n === 1 ? "" : "s"}` };
  }
};

/* ---------- Symmetry ---------- */
const keyOf = ([r, c]) => r + "," + c;
function halfShape(rows, cols, n){                    // n random cells in a rows × cols block, touching the last column
  const cells = new Map();
  const first = [rnd(0, rows - 1), cols - 1]; cells.set(keyOf(first), first);
  while (cells.size < n){
    const [r, c] = pick([...cells.values()]), [dr, dc] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) cells.set(keyOf([nr, nc]), [nr, nc]);
  }
  return [...cells.values()];
}
const isSymmetric = (cells, mirror) => { const set = new Set(cells.map(keyOf)); return cells.every(c => set.has(keyOf(mirror(c)))); };
const LINES = [["square", 4], ["rectangle", 2], ["equilateral", 3], ["isosceles", 1], ["scalene", 0], ["rhombus", 2], ["parallelogram", 0], ["kite", 1], ["trapezium", 0], ["pentagon", 5], ["hexagon", 6], ["isotrap", 1]];
const regular = n => Array.from({ length:n }, (_, i) => [Math.cos(-Math.PI / 2 + i * 2 * Math.PI / n), Math.sin(-Math.PI / 2 + i * 2 * Math.PI / n)]);
const NICE = { equilateral:"equilateral triangle", isosceles:"isosceles triangle", scalene:"scalene triangle", pentagon:"regular pentagon", hexagon:"regular hexagon", isotrap:"trapezium with two equal slanting sides" };
const symmetry = {
  id:"ge-symmetry", name:"Symmetry", emoji:"🦋",
  desc:"A line of symmetry is a mirror line: if you folded the shape along it, the two halves would match exactly.",
  levels:[
    { name:"Is it a mirror line?", desc:"Yes or no" },
    { name:"Count the lines", desc:"How many lines of symmetry does the shape have?" },
    { name:"Complete the shape", desc:"Tap squares to make the shape symmetrical" }
  ],
  make(lv){
    if (lv === 1){
      const half = halfShape(5, 3, rnd(4, 8)), cells = [...half, ...half.map(([r, c]) => [r, 5 - c])];
      const form = rnd(1, 3);
      let shape = cells, line, mirror;
      if (form === 2){                               // spoil the symmetry by one square
        const set = new Set(cells.map(keyOf)), extra = [rnd(0, 4), rnd(3, 5)];
        shape = set.has(keyOf(extra)) ? cells.filter(c => keyOf(c) !== keyOf(extra)) : [...cells, extra];
      }
      if (form === 3){ line = { h:1 + 2.5 }; mirror = ([r, c]) => [4 - r, c]; }
      else { line = { v:1 + 3 }; mirror = ([r, c]) => [r, 5 - c]; }
      const yes = isSymmetric(shape, mirror), ans = yes ? "Yes" : "No";
      return { text:"Is the dashed line a line of symmetry?", picture:Y4.draw.symGrid(shape.map(([r, c]) => [r + 1, c + 1]), 7, 8, line), input:"choice", choices:["Yes", "No"], answer:ans,
        key:JSON.stringify(shape) + form, explain:`<b>${ans}</b><span class="why">${yes ? "Each square has a matching square the same distance away on the other side of the line." : "Some squares don't have a matching square on the other side of the line."}</span>`,
        solution:`Line of symmetry? ${ans}` };
    }
    if (lv === 2){
      const [name, n] = pick(LINES);
      let pic;
      if (name === "pentagon" || name === "hexagon") pic = Y4.draw.polygon(regular(name === "pentagon" ? 5 : 6), { ticks:Object.fromEntries(Array.from({ length:name === "pentagon" ? 5 : 6 }, (_, i) => [i, 1])) });
      else if (name === "isotrap") pic = Y4.draw.polygon([[.6, 0], [2.4, 0], [3, 1.3], [0, 1.3]], { ticks:{ 1:1, 3:1 } });
      else { const s = SHAPES[name](); pic = Y4.draw.polygon(s.pts, { ticks:s.ticks, right:s.right }); }
      const nice = NICE[name] || name;
      return { text:`How many lines of symmetry does this ${nice} have?`, picture:pic, answer:n, key:name,
        explain:`<b>${n}</b><span class="why">A ${nice} has ${n} line${n === 1 ? "" : "s"} of symmetry.${n === 0 ? " There is no way to fold it so the halves match." : ""}</span>`,
        solution:`A ${nice}: ${n} line${n === 1 ? "" : "s"} of symmetry` };
    }
    // complete the shape: tap the squares on the other side of the mirror line
    if (Math.random() < .6){
      const half = halfShape(6, 4, rnd(4, 7)), answer = half.map(([r, c]) => keyOf([r, 7 - c])).sort();
      const tappable = []; for (let r = 0; r < 6; r++) for (let c = 4; c < 8; c++) tappable.push([r, c]);
      return { text:"Tap the squares to complete the symmetrical shape. Then press Check.", picture:Y4.draw.symGrid(half, 6, 8, { v:4 }, tappable), input:"cells", answer, key:JSON.stringify(half) + "v",
        explain:`Like this<span class="why">Each square is reflected the same distance on the other side of the line.</span>${Y4.draw.symGrid([...half, ...half.map(([r, c]) => [r, 7 - c])], 6, 8, { v:4 })}`,
        solution:"Reflect each square in the mirror line" };
    }
    const uniq = halfShape(6, 4, rnd(4, 7)).map(([r, c]) => [c, r]);   // swap rows and columns: a top half touching row 3
    const answer = uniq.map(([r, c]) => keyOf([7 - r, c])).sort();
    const tappable = []; for (let r = 4; r < 8; r++) for (let c = 0; c < 6; c++) tappable.push([r, c]);
    return { text:"Tap the squares to complete the symmetrical shape. Then press Check.", picture:Y4.draw.symGrid(uniq, 8, 6, { h:4 }, tappable), input:"cells", answer, key:JSON.stringify(uniq) + "h",
      explain:`Like this<span class="why">Each square is reflected the same distance on the other side of the line.</span>${Y4.draw.symGrid([...uniq, ...uniq.map(([r, c]) => [7 - r, c])], 8, 6, { h:4 })}`,
      solution:"Reflect each square in the mirror line" };
  }
};

/* ---------- Coordinates ---------- */
const P = (x, y) => `(${x}, ${y})`;
const inGrid = (x, y) => x >= 0 && x <= 8 && y >= 0 && y <= 8;
function nearPoints(x, y, right){                     // wrong answers close to the right one
  const out = new Set();
  if (x !== y) out.add(P(y, x));                     // the classic mix-up: up before across
  for (const [dx, dy] of shuffle([[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]])) if (inGrid(x + dx, y + dy)) out.add(P(x + dx, y + dy));
  out.delete(right);
  return [...out].slice(0, 3);
}
const ACROSS = "Go across first, then up (along the corridor, then up the stairs).";
const coordinates = {
  id:"ge-coords", name:"Coordinates", emoji:"📍",
  desc:"Coordinates like (3, 5) give a position: go 3 across first, then 5 up. Across comes first!",
  levels:[
    { name:"Read coordinates", desc:"What are the coordinates of A?" },
    { name:"Plot a point", desc:"Tap where (4, 2) is" },
    { name:"Moves and shapes", desc:"Move 3 right and 2 up · describe a move · the fourth corner of a rectangle" }
  ],
  make(lv){
    if (lv === 1){
      const x = rnd(0, 8), y = rnd(0, 8), right = P(x, y);
      return { text:"What are the coordinates of point A?", picture:Y4.draw.coordGrid(8, [{ x, y, label:"A" }]), input:"choice", choices:shuffle([right, ...nearPoints(x, y, right)]), answer:right, key:right,
        explain:`<b>${right}</b><span class="why">${ACROSS} A is ${x} across and ${y} up.</span>`, solution:`A is at ${right}` };
    }
    if (lv === 2){
      const x = rnd(0, 8), y = rnd(0, 8);
      return { text:`Tap the point ${P(x, y)}.`, picture:Y4.draw.coordGrid(8, [], [], true), input:"tap", answer:`${x},${y}`, key:P(x, y),
        tapText:g => P(...g.split(",")), explain:`${P(x, y)} is shown in green<span class="why">${ACROSS} ${x} across, then ${y} up.</span>`, solution:`${P(x, y)}: ${x} across, ${y} up` };
    }
    const form = rnd(1, 3);
    if (form === 1 || form === 2){
      let x, y, dx, dy;
      do { x = rnd(0, 8); y = rnd(0, 8); dx = rnd(-4, 4); dy = rnd(-4, 4); } while (!inGrid(x + dx, y + dy) || (!dx && !dy) || !dx || !dy);
      const words = `${Math.abs(dx)} ${dx > 0 ? "right" : "left"} and ${Math.abs(dy)} ${dy > 0 ? "up" : "down"}`;
      if (form === 1){
        const right = P(x + dx, y + dy);
        return { text:`Point A is at ${P(x, y)}. It moves ${words}. Where is it now?`, picture:Y4.draw.coordGrid(8, [{ x, y, label:"A" }]), input:"choice",
          choices:shuffle([right, ...nearPoints(x + dx, y + dy, right)]), answer:right, key:`m${x}${y}${dx}${dy}`,
          explain:`<b>${right}</b><span class="why">Moving right adds to the first number, up adds to the second: ${x} ${dx > 0 ? "+" : "−"} ${Math.abs(dx)} = ${x + dx}, ${y} ${dy > 0 ? "+" : "−"} ${Math.abs(dy)} = ${y + dy}</span>${Y4.draw.coordGrid(8, [{ x, y, label:"A" }, { x:x + dx, y:y + dy, cls:"end" }])}`,
          solution:`${P(x, y)} moved ${words} = ${right}` };
      }
      const say = (a, b) => `${Math.abs(a)} ${a > 0 ? "right" : "left"}, ${Math.abs(b)} ${b > 0 ? "up" : "down"}`;
      const right = say(dx, dy), wrongs = [say(dy, dx), say(-dx, dy), say(dx, -dy), say(-dx, -dy)].filter((w, i, A) => w !== right && A.indexOf(w) === i);
      return { text:"How does the point move from A to B?", picture:Y4.draw.coordGrid(8, [{ x, y, label:"A" }, { x:x + dx, y:y + dy, label:"B", cls:"end" }]), input:"choice",
        choices:shuffle([right, ...wrongs.slice(0, 3)]), answer:right, key:`d${x}${y}${dx}${dy}`,
        explain:`<b>${right}</b><span class="why">Count the squares across first, then up or down: A ${P(x, y)} to B ${P(x + dx, y + dy)}.</span>`, solution:`A to B: ${right}` };
    }
    let x1, y1, x2, y2;
    do { x1 = rnd(0, 7); y1 = rnd(0, 7); x2 = rnd(1, 8); y2 = rnd(1, 8); } while (x2 - x1 < 2 || y2 - y1 < 2);
    const pts = [[x1, y1, "A"], [x2, y1, "B"], [x2, y2, "C"]], right = P(x1, y2);
    return { text:"A, B and C are three corners of a rectangle. What are the coordinates of the fourth corner?",
      picture:Y4.draw.coordGrid(8, pts.map(([x, y, label]) => ({ x, y, label })), [[x1, y1, x2, y1], [x2, y1, x2, y2]]), input:"choice",
      choices:shuffle([right, ...nearPoints(x1, y2, right)]), answer:right, key:`r${x1}${y1}${x2}${y2}`,
      explain:`<b>${right}</b><span class="why">It is straight above A (${x1} across, like A) and level with C (${y2} up, like C).</span>${Y4.draw.coordGrid(8, [...pts.map(([x, y, label]) => ({ x, y, label })), { x:x1, y:y2, label:"D", cls:"end" }], [[x1, y1, x2, y1], [x2, y1, x2, y2], [x2, y2, x1, y2], [x1, y2, x1, y1]])}`,
      solution:`The fourth corner is ${right}` };
  }
};

Y4.TOPICS.push({ id:"shapes", title:"Shapes & Position", emoji:"🔷",
  skills:[shapesSkill, anglesSkill, symmetry, coordinates] });
})();
