/* Measurement: section 5 of the curriculum. */
(function(){
"use strict";
const { rnd, pick, shuffle, timeText } = Y4;
const dec = v => String(+v.toFixed(2));
const money = p => "£" + (p / 100).toFixed(2);
const NAMES = ["Amir", "Bella", "Chen", "Dev", "Ella", "Femi", "Grace", "Hugo", "Isla", "Jack", "Kemi", "Leo", "Maya", "Noah", "Priya", "Zara"];

/* ---------- Converting units ---------- */
// [big unit, small unit, how many small in one big, metric?]
const UNITS = [["km", "m", 1000, true], ["m", "cm", 100, true], ["cm", "mm", 10, true], ["kg", "g", 1000, true], ["l", "ml", 1000, true],
               ["hours", "minutes", 60], ["minutes", "seconds", 60], ["days", "hours", 24], ["weeks", "days", 7], ["years", "months", 12]];
const unit = (u, n) => n === 1 && u.endsWith("s") ? u.slice(0, -1) : u;      // "1 hour", "2 hours"
const fact = ([B, s, f]) => `1 ${unit(B, 1)} = ${f} ${s}`;
const convert = {
  id:"me-convert", name:"Converting units", emoji:"📏",
  desc:"1 cm = 10 mm · 1 m = 100 cm · 1 km = 1000 m · 1 kg = 1000 g · 1 l = 1000 ml · 1 hour = 60 minutes · 1 minute = 60 seconds · 1 day = 24 hours · 1 week = 7 days · 1 year = 12 months",
  levels:[
    { name:"Whole units", desc:"3 m = □ cm   ·   4000 g = □ kg" },
    { name:"Mixed units", desc:"2 m 35 cm = □ cm   ·   2 hours 15 minutes = □ minutes" },
    { name:"Decimals and comparing", desc:"1.5 km = □ m   ·   350 cm = □ m   ·   Which is longer?" }
  ],
  make(lv){
    if (lv === 1){
      const U = pick(UNITS), [B, s, f] = U, n = rnd(2, f <= 24 ? 6 : 9);
      if (Math.random() < .5) return { text:`${n} ${unit(B, n)} = □ ${s}`, answer:n * f, suffix:` ${s}`, maxLen:5, key:`${n}${B}>${s}`,
        explain:`<b>${n * f} ${s}</b><span class="why">${fact(U)}, so ${n} × ${f} = ${n * f}</span>`, solution:`${n} ${unit(B, n)} = ${n * f} ${s}` };
      return { text:`${n * f} ${s} = □ ${B}`, answer:n, suffix:` ${unit(B, n)}`, key:`${n * f}${s}>${B}`,
        explain:`<b>${n} ${unit(B, n)}</b><span class="why">${fact(U)}, so ${n * f} ÷ ${f} = ${n}</span>`, solution:`${n * f} ${s} = ${n} ${unit(B, n)}` };
    }
    if (lv === 2){
      const U = pick(UNITS), [B, s, f] = U, n = rnd(1, f <= 24 ? 5 : 9), b = rnd(1, f - 1), tot = n * f + b;
      if (Math.random() < .5) return { text:`${n} ${unit(B, n)} ${b} ${unit(s, b)} = □ ${s}`, answer:tot, suffix:` ${s}`, maxLen:5, key:`${n}${B}${b}>${s}`,
        explain:`<b>${tot} ${s}</b><span class="why">${fact(U)}: ${n} × ${f} = ${n * f}, then ${n * f} + ${b} = ${tot}</span>`, solution:`${n} ${unit(B, n)} ${b} ${unit(s, b)} = ${tot} ${s}` };
      return { text:`${tot} ${s} = ${n} ${unit(B, n)} □ ${s}`, answer:b, suffix:` ${s}`, maxLen:4, key:`${tot}${s}>${B}`,
        explain:`<b>${b} ${unit(s, b)}</b><span class="why">${fact(U)}: ${n} ${unit(B, n)} = ${n * f} ${s}, and ${tot} − ${n * f} = ${b}</span>`, solution:`${tot} ${s} = ${n} ${unit(B, n)} ${b} ${unit(s, b)}` };
    }
    const metric = UNITS.filter(u => u[3] && u[2] >= 100), U = pick(metric), [B, s, f] = U, form = rnd(1, 3);
    const big = rnd(1, 9) + pick([.5, .25, .75, .1, .2, .4, .6]);                 // e.g. 2.5 km
    const small = Math.round(big * f);
    if (form === 1) return { text:`${dec(big)} ${B} = □ ${s}`, answer:small, suffix:` ${s}`, maxLen:5, key:`${big}${B}>${s}`,
      explain:`<b>${small} ${s}</b><span class="why">${fact(U)}, so ${dec(big)} × ${f} = ${small}</span>`, solution:`${dec(big)} ${B} = ${small} ${s}` };
    if (form === 2) return { text:`${small} ${s} = □ ${B}`, input:"decimal", answer:+big.toFixed(2), suffix:` ${B}`, key:`${small}${s}>${B}`,
      explain:`<b>${dec(big)} ${B}</b><span class="why">${fact(U)}, so ${small} ÷ ${f} = ${dec(big)}</span>`, solution:`${small} ${s} = ${dec(big)} ${B}` };
    // which is more? one amount in each unit, close together
    let other; do { other = small + pick([-1, 1]) * rnd(1, 4) * f / 20; } while (other <= 0 || other === small);
    const A = `${dec(big)} ${B}`, Bt = `${other} ${s}`;
    const word = { km:"longer", m:"longer", kg:"heavier", l:"more" }[B];
    const answer = small > other ? A : Bt;
    return { text:`Which is ${word}?`, input:"choice", choices:shuffle([A, Bt]), answer, key:`${A}|${Bt}`,
      explain:`<b>${answer}</b><span class="why">Change them to the same unit: ${A} = ${small} ${s}, and ${small} ${small > other ? ">" : "<"} ${other}</span>`,
      solution:`${A} = ${small} ${s}, so ${answer} is ${word}` };
  }
};

/* ---------- shapes for perimeter and area ---------- */
// a rectangle w × h with 0–2 rectangular corners cut out: an L, T, U or step shape with no holes
function rectilinear(){
  for (;;){
    const w = rnd(3, 7), h = rnd(3, 6);
    const corners = shuffle(["tl", "tr", "bl", "br"]).slice(0, rnd(1, 2));
    const cuts = corners.map(c => ({ c, cw:rnd(1, w - 2), ch:rnd(1, h - 2) }));
    if (cuts.reduce((a, x) => a + x.cw, 0) > w - 1 || cuts.reduce((a, x) => a + x.ch, 0) > h - 1) continue;
    const cells = [];
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++){
      const cut = cuts.some(({ c:k, cw, ch }) =>
        (k[0] === "t" ? r < ch : r >= h - ch) && (k[1] === "l" ? c < cw : c >= w - cw));
      if (!cut) cells.push([r, c]);
    }
    return { cells, w, h };
  }
}
function perimeterOf(cells){
  const on = new Set(cells.map(([r, c]) => r + "," + c));
  let p = 0;
  for (const [r, c] of cells) for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) if (!on.has((r + dr) + "," + (c + dc))) p++;
  return p;
}
const onGrid = (cells, w, h) => Y4.draw.gridShape(cells.map(([r, c]) => [r + 1, c + 1]), h + 2, w + 2);
const rectCells = (w, h) => { const out = []; for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) out.push([r, c]); return out; };
// an L-shape: W wide, H tall, with a cw × ch notch cut from the top right
function lShape(){
  const W = rnd(6, 15), H = rnd(5, 12), cw = rnd(2, W - 3), ch = rnd(2, H - 3);
  return { W, H, cw, ch, points:[[0, 0], [W - cw, 0], [W - cw, ch], [W, ch], [W, H], [0, H]] };
}

/* ---------- Perimeter ---------- */
const perimeter = {
  id:"me-perimeter", name:"Perimeter", emoji:"📐",
  desc:"The perimeter is the distance all the way round the edge of a shape. Add up the lengths of all the sides.",
  levels:[
    { name:"Rectangles on squares", desc:"Count the sides of the squares round the edge (in cm or m)" },
    { name:"Other shapes on squares", desc:"L shapes, T shapes and steps" },
    { name:"Using lengths", desc:"A garden 12 m by 7 m · L shapes · find a missing side" }
  ],
  make(lv){
    const u = Math.random() < .4 ? "m" : "cm";      // centimetres and metres (a garden, a playground…)
    const each = `Each square is 1 ${u} long.`;
    if (lv === 1){
      const w = rnd(2, 7), h = rnd(2, 5), p = 2 * (w + h);
      return { text:`${each} What is the perimeter of the rectangle?`, picture:onGrid(rectCells(w, h), w, h), answer:p, suffix:` ${u}`, key:`r${w}x${h}`,
        explain:`<b>${p} ${u}</b><span class="why">${w} + ${h} + ${w} + ${h} = ${p}</span>`, solution:`${w} ${u} by ${h} ${u} rectangle: perimeter ${p} ${u}` };
    }
    if (lv === 2){
      const { cells, w, h } = rectilinear(), p = perimeterOf(cells);
      return { text:`${each} What is the perimeter of the shape?`, picture:onGrid(cells, w, h), answer:p, suffix:` ${u}`, key:JSON.stringify(cells),
        explain:`<b>${p} ${u}</b><span class="why">Count every square side on the thick edge. Mark where you start so you don't count any twice.</span>`,
        solution:`Perimeter ${p} ${u}` };
    }
    const form = rnd(1, 4);
    if (form === 1){
      const l = rnd(5, 25), w = rnd(2, l - 1), p = 2 * (l + w);
      return { text:"What is the perimeter of the rectangle?", picture:Y4.draw.labelledShape([[0, 0], [l, 0], [l, w], [0, w]], [`${l} ${u}`, `${w} ${u}`, null, null]),
        answer:p, suffix:` ${u}`, key:`R${l}x${w}`,
        explain:`<b>${p} ${u}</b><span class="why">Opposite sides of a rectangle are the same: ${l} + ${w} + ${l} + ${w} = ${p}</span>`, solution:`${l} ${u} by ${w} ${u}: perimeter ${p} ${u}` };
    }
    if (form === 2){
      const s = rnd(3, 15);
      return { text:`A square has sides of ${s} ${u}. What is its perimeter?`, answer:4 * s, suffix:` ${u}`, key:`sq${s}`,
        explain:`<b>${4 * s} ${u}</b><span class="why">A square has 4 equal sides: 4 × ${s} = ${4 * s}</span>`, solution:`4 × ${s} = ${4 * s} ${u}` };
    }
    if (form === 3){
      const L = lShape(), { W, H, cw, ch } = L, p = 2 * (W + H);
      return { text:"What is the perimeter of the shape? (Not drawn to scale.)", long:true,
        picture:Y4.draw.labelledShape(L.points, [null, `${ch} ${u}`, [`${cw} ${u}`, "in"], null, `${W} ${u}`, `${H} ${u}`]), answer:p, suffix:` ${u}`, key:`L${W}/${H}/${cw}/${ch}`,
        explain:`<b>${p} ${u}</b><span class="why">First find the missing sides: top = ${W} − ${cw} = ${W - cw} ${u}, right = ${H} − ${ch} = ${H - ch} ${u}.<br>` +
                `Then add all six: ${W - cw} + ${ch} + ${cw} + ${H - ch} + ${W} + ${H} = ${p}</span>`, solution:`L shape: perimeter ${p} ${u}` };
    }
    const l = rnd(4, 20), w = rnd(2, l), p = 2 * (l + w);
    return { text:`A rectangle has a perimeter of ${p} ${u}. One side is ${l} ${u} long. How long is the shorter side?`.replace("the shorter side", l === w ? "the other side" : w < l ? "the shorter side" : "the longer side"),
      answer:w, suffix:` ${u}`, key:`P${p}/${l}`,
      explain:`<b>${w} ${u}</b><span class="why">Two sides of ${l} ${u} make ${2 * l} ${u}. ${p} − ${2 * l} = ${2 * w} ${u} for the other two sides, so each is ${2 * w} ÷ 2 = ${w} ${u}</span>`,
      solution:`${l} + ${w} + ${l} + ${w} = ${p} ${u}` };
  }
};

/* ---------- Area ---------- */
const area = {
  id:"me-area", name:"Area", emoji:"⬛",
  desc:"Area is how much flat space a shape covers. Count the squares inside it. Each square is 1 square centimetre (1 cm²).",
  levels:[
    { name:"Rectangles on squares", desc:"Count the squares (or rows × columns)" },
    { name:"Other shapes on squares", desc:"L shapes, T shapes and steps" },
    { name:"Using lengths", desc:"A rectangle 8 cm by 5 cm · L shapes" }
  ],
  make(lv){
    const each = "Each square is 1 cm².";
    if (lv === 1){
      const w = rnd(2, 7), h = rnd(2, 5);
      return { text:`${each} What is the area of the rectangle?`, picture:onGrid(rectCells(w, h), w, h), answer:w * h, suffix:" cm²", key:`r${w}x${h}`,
        explain:`<b>${w * h} cm²</b><span class="why">${h} rows of ${w} squares: ${h} × ${w} = ${w * h}</span>`, solution:`${w} × ${h} rectangle: area ${w * h} cm²` };
    }
    if (lv === 2){
      const { cells, w, h } = rectilinear();
      return { text:`${each} What is the area of the shape?`, picture:onGrid(cells, w, h), answer:cells.length, suffix:" cm²", key:JSON.stringify(cells),
        explain:`<b>${cells.length} cm²</b><span class="why">Count the squares row by row and add them up. Or: the whole rectangle is ${w} × ${h} = ${w * h}, minus the ${w * h - cells.length} missing squares.</span>`,
        solution:`Area ${cells.length} cm²` };
    }
    if (Math.random() < .5){
      const l = rnd(3, 12), w = rnd(2, 9);
      return { text:"What is the area of the rectangle?", picture:Y4.draw.labelledShape([[0, 0], [l, 0], [l, w], [0, w]], [`${l} cm`, `${w} cm`, null, null]),
        answer:l * w, suffix:" cm²", maxLen:4, key:`R${l}x${w}`,
        explain:`<b>${l * w} cm²</b><span class="why">It would hold ${w} rows of ${l} squares: ${l} × ${w} = ${l * w}</span>`, solution:`${l} × ${w} = ${l * w} cm²` };
    }
    const L = lShape(), { W, H, cw, ch } = L, a = W * H - cw * ch;
    return { text:"What is the area of the shape? (Not drawn to scale.)", long:true,
      picture:Y4.draw.labelledShape(L.points, [null, `${ch} cm`, [`${cw} cm`, "in"], null, `${W} cm`, `${H} cm`]), answer:a, suffix:" cm²", maxLen:4, key:`L${W}/${H}/${cw}/${ch}`,
      explain:`<b>${a} cm²</b><span class="why">The whole rectangle is ${W} × ${H} = ${W * H}. The missing corner is ${cw} × ${ch} = ${cw * ch}. ${W * H} − ${cw * ch} = ${a}</span>`,
      solution:`L shape: area ${a} cm²` };
  }
};

/* ---------- Time ---------- */
const T = (h, m) => timeText(h, m);
const pastWords = (h, m) => {
  const hh = h % 12 || 12, next = hh % 12 + 1;
  if (m === 0) return `${hh} o'clock`;
  if (m === 15) return `quarter past ${hh}`;
  if (m === 30) return `half past ${hh}`;
  if (m === 45) return `quarter to ${next}`;
  return m < 30 ? `${m} minutes past ${hh}` : `${60 - m} minutes to ${next}`;
};
const ampm = (h, m) => `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
const time = {
  id:"me-time", name:"Telling the time", emoji:"🕒",
  desc:"The short hand shows the hour, the long hand shows the minutes. In 24-hour time, afternoon hours go on from 12: 1 pm = 13:00, 6 pm = 18:00. Tap “Colon :” to type the :",
  levels:[
    { name:"Read the clock", desc:"To 5 minutes, written like 7:45" },
    { name:"To the minute, and 24-hour time", desc:"3:45 pm = 15:45   ·   18:20 = 6:20 pm" },
    { name:"How long?", desc:"Start and end times, minutes between, 25 minutes later" }
  ],
  make(lv){
    if (lv === 1 || (lv === 2 && Math.random() < .35)){
      const h = rnd(1, 12), m = lv === 1 ? 5 * rnd(0, 11) : rnd(1, 59);
      return { text:"What time does the clock show?", picture:Y4.draw.clock(h, m), input:"time", any12:true, answer:{ h, m }, key:`c${h}:${m}`,
        explain:`<b>${T(h, m)}</b><span class="why">${pastWords(h, m)}. The short hand is just past ${h}, and the long hand shows ${m} minutes.</span>`,
        solution:`The clock shows ${T(h, m)}` };
    }
    if (lv === 2){
      const h = rnd(1, 23), m = rnd(0, 59);
      if (Math.random() < .5){
        const hh = h === 12 ? 11 : h;
        return { text:`Write ${ampm(hh, m)} in 24-hour time.`, input:"time", answer:{ h:hh, m }, key:`24${hh}:${m}`,
          explain:`<b>${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}</b><span class="why">${hh < 12 ? "Morning times stay the same." : `Afternoon: add 12 to the hour: ${hh - 12} + 12 = ${hh}`}</span>`,
          solution:`${ampm(hh, m)} = ${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")}` };
      }
      const H = rnd(13, 23), right = ampm(H, m);
      const wrongs = [ampm(H - 12, m), ampm(H - 10 > 12 ? H - 10 : H - 10 + 12, m), `${H}:${String(m).padStart(2, "0")} pm`];
      return { text:`Write ${H}:${String(m).padStart(2, "0")} as a 12-hour time.`, input:"choice", choices:shuffle([right, ...new Set(wrongs.filter(w => w !== right))].slice(0, 4)),
        answer:right, key:`12${H}:${m}`,
        explain:`<b>${right}</b><span class="why">Take 12 from the hour: ${H} − 12 = ${H - 12}. It's after midday, so it's pm.</span>`, solution:`${H}:${String(m).padStart(2, "0")} = ${right}` };
    }
    const form = rnd(1, 3);
    if (form === 1){
      const sh = rnd(8, 18), sm = 5 * rnd(0, 11), dh = rnd(0, 2), dm = 5 * rnd(1, 11);
      const end = sh * 60 + sm + dh * 60 + dm, eh = Math.floor(end / 60), em = end % 60;
      const what = pick(["A film", "A football match", "A school trip", "A party", "A swimming lesson"]);
      const dur = `${dh ? `${dh} hour${dh > 1 ? "s" : ""} ` : ""}${dm} minutes`;
      return { text:`${what} starts at ${T(sh, sm).padStart(5, "0")} and lasts ${dur}. What time does it end?`, input:"time", answer:{ h:eh, m:em }, key:`e${sh}:${sm}+${dh}:${dm}`,
        explain:`<b>${T(eh, em).padStart(5, "0")}</b><span class="why">${dh ? `${T(sh, sm)} + ${dh} hour${dh > 1 ? "s" : ""} = ${T(sh + dh, sm)}, then ` : ""}add ${dm} minutes: ${T(eh, em)}</span>`,
        solution:`${T(sh, sm)} + ${dur} = ${T(eh, em)}` };
    }
    if (form === 2){
      const sh = rnd(7, 17), sm = 5 * rnd(1, 11), d = 5 * rnd(3, 14), end = sh * 60 + sm + d, eh = Math.floor(end / 60), em = end % 60;
      const toHour = 60 - sm;
      return { text:`How many minutes is it from ${T(sh, sm)} to ${T(eh, em)}?`, answer:d, suffix:" minutes", key:`d${sh}:${sm}+${d}`,
        explain:`<b>${d} minutes</b><span class="why">${eh > sh ? `${T(sh, sm)} to ${T(sh + 1, 0)} is ${toHour} minutes, then ${T(sh + 1, 0)} to ${T(eh, em)} is ${d - toHour} minutes: ${toHour} + ${d - toHour} = ${d}` : `${em} − ${sm} = ${d}`}</span>`,
        solution:`${T(sh, sm)} to ${T(eh, em)} = ${d} minutes` };
    }
    const h = rnd(1, 12), m = 5 * rnd(0, 11), add = 5 * rnd(2, 9), end = h * 60 + m + add, eh = Math.floor(end / 60), em = end % 60;
    return { text:`What time will it be in ${add} minutes?`, picture:Y4.draw.clock(h, m), input:"time", any12:true, answer:{ h:eh % 12 || 12, m:em }, key:`l${h}:${m}+${add}`,
      explain:`<b>${T(eh % 12 || 12, em)}</b><span class="why">The clock shows ${T(h, m)}. ${T(h, m)} + ${add} minutes = ${T(eh % 12 || 12, em)}</span>`,
      solution:`${T(h, m)} + ${add} minutes = ${T(eh % 12 || 12, em)}` };
  }
};

/* ---------- Money ---------- */
const COINS = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
const SHOP = [["🍎 Apple", 35, 90], ["🥪 Sandwich", 185, 350], ["🧃 Juice", 65, 140], ["📒 Notebook", 120, 299], ["✏️ Pencil", 25, 75], ["🍪 Biscuits", 89, 199], ["⚽ Ball", 350, 799]];
const priceList = items => `<table class="pv menu">${items.map(([n, p]) => `<tr><th>${n}</th><td>${money(p)}</td></tr>`).join("")}</table>`;
const moneySkill = {
  id:"me-money", name:"Money", emoji:"💰",
  desc:"£1 = 100p. Add pounds and pence carefully: it can help to change everything into pence first.",
  levels:[
    { name:"Count the money", desc:"Coins and notes" },
    { name:"Shopping", desc:"Add up the prices on a price list" },
    { name:"How many and how much", desc:"4 tickets at £3.25 · how many pens for £2? · share £12 between 4" }
  ],
  make(lv){
    if (lv === 1){
      const small = Math.random() < .4;
      const pool = small ? COINS.slice(0, 6) : COINS;
      const list = Array.from({ length:rnd(3, 6) }, () => pick(pool)).sort((a, b) => b - a);
      const tot = list.reduce((a, b) => a + b, 0);
      const running = []; let acc = 0; for (const v of list){ acc += v; running.push(acc < 100 ? `${acc}p` : money(acc)); }
      if (tot < 100) return { text:"How much money is there?", picture:Y4.draw.coins(list), answer:tot, suffix:"p", key:list.join(","),
        explain:`<b>${tot}p</b><span class="why">Start with the biggest: ${running.join(", ")}</span>`, solution:`${list.map(v => v + "p").join(" + ")} = ${tot}p` };
      return { text:"How much money is there?", picture:Y4.draw.coins(list), input:"decimal", prefix:"£", answer:tot / 100, key:list.join(","),
        explain:`<b>${money(tot)}</b><span class="why">Start with the biggest: ${running.join(", ")}</span>`, solution:`Total ${money(tot)}` };
    }
    if (lv === 2){
      const items = shuffle(SHOP.slice()).slice(0, 4).map(([n, lo, hi]) => [n, Math.round(rnd(lo, hi) / 5) * 5]);
      const buy = shuffle(items.slice()).slice(0, rnd(2, 3)), tot = buy.reduce((a, [, p]) => a + p, 0);
      const names = buy.map(([n]) => "the " + n.split(" ").slice(1).join(" ").toLowerCase());
      return { text:`How much do ${names.length === 2 ? names.join(" and ") : names.slice(0, -1).join(", ") + " and " + names[names.length - 1]} cost altogether?`,
        picture:priceList(items), input:"decimal", prefix:"£", answer:tot / 100, key:buy.map(b => b.join()).join("|"),
        explain:`<b>${money(tot)}</b><span class="why">${buy.map(([, p]) => money(p)).join(" + ")} = ${money(tot)}</span>`,
        solution:`${buy.map(([, p]) => money(p)).join(" + ")} = ${money(tot)}` };
    }
    const form = rnd(1, 3);
    if (form === 1){
      const n = rnd(2, 6), p = Math.round(rnd(105, 495) / 5) * 5, what = pick(["cinema tickets", "comics", "bus tickets", "packs of cards", "swimming tickets"]);
      return { text:`${n} ${what} cost ${money(p)} each. How much do they cost altogether?`, input:"decimal", prefix:"£", answer:n * p / 100, key:`${n}x${p}`,
        explain:`<b>${money(n * p)}</b><span class="why">In pence: ${p} × ${n} = ${n * p}p = ${money(n * p)}</span>`, solution:`${n} × ${money(p)} = ${money(n * p)}` };
    }
    if (form === 2){
      const p = pick([15, 20, 25, 30, 35, 40, 45, 55, 60, 65, 70, 80]), have = pick([100, 200, 300, 500]), k = Math.floor(have / p), left = have - k * p;
      return { text:`Pens cost ${p}p each. How many pens can you buy with ${money(have).replace(".00", "")}?`, answer:k, key:`${p}in${have}`,
        explain:`<b>${k}</b> pens<span class="why">${money(have).replace(".00", "")} = ${have}p. ${k} × ${p} = ${k * p}p${left ? `, with ${left}p left over (not enough for another)` : ""}.</span>`,
        solution:`${have}p ÷ ${p}p = ${k}${left ? ` (${left}p left)` : ""}` };
    }
    const n = rnd(2, 5), each = Math.round(rnd(105, 450) / 5) * 5, tot = n * each, who = pick(NAMES);
    return { text:`${who} and ${n - 1 === 1 ? "a friend" : `${n - 1} friends`} share ${money(tot)} equally. How much does each person get?`, input:"decimal", prefix:"£", answer:each / 100, key:`${tot}/${n}`,
      explain:`<b>${money(each)}</b><span class="why">That's ${n} people. In pence: ${tot} ÷ ${n} = ${each}p = ${money(each)}</span>`, solution:`${money(tot)} ÷ ${n} = ${money(each)}` };
  }
};

/* ---------- Estimate and measure ---------- */
// [thing, sensible estimate, silly ones]
const LENGTHS = [
  ["a pencil", "15 cm", ["15 m", "15 mm", "1 km"]], ["the height of a door", "2 m", ["2 cm", "20 m", "2 km"]],
  ["a football pitch", "100 m", ["100 cm", "10 km", "1 m"]], ["a bus", "10 m", ["10 cm", "100 m", "1 km"]],
  ["a ladybird", "8 mm", ["8 cm", "8 m", "80 cm"]], ["a classroom", "8 m", ["8 cm", "80 m", "8 km"]],
  ["a walk of one hour", "5 km", ["5 m", "50 km", "5 cm"]], ["a child's shoe", "20 cm", ["20 m", "2 mm", "2 m"]],
  ["a bed", "2 m", ["20 cm", "20 m", "2 km"]], ["a grain of rice", "5 mm", ["5 cm", "5 m", "50 cm"]]
];
const OTHERS = [
  ["the mass of an apple", "100 g", ["100 kg", "1 g", "10 kg"]], ["the mass of a bag of sugar", "1 kg", ["1 g", "100 kg", "10 g"]],
  ["the mass of a Year 4 child", "30 kg", ["30 g", "300 kg", "3 kg"]], ["the mass of a car", "1000 kg", ["10 kg", "100 g", "1 kg"]],
  ["the mass of a paperclip", "1 g", ["1 kg", "100 g", "10 kg"]], ["what a teaspoon holds", "5 ml", ["5 l", "500 ml", "50 l"]],
  ["what a cup holds", "250 ml", ["250 l", "2 ml", "25 l"]], ["what a bath holds", "100 l", ["100 ml", "1 l", "10 ml"]],
  ["what a bucket holds", "10 l", ["10 ml", "100 l", "1 ml"]], ["how long it takes to brush your teeth", "2 minutes", ["2 seconds", "2 hours", "2 days"]],
  ["how long a school day lasts", "6 hours", ["6 minutes", "6 days", "60 hours"]], ["how long a blink takes", "less than 1 second", ["1 minute", "1 hour", "10 minutes"]],
  ["how long the summer holiday lasts", "6 weeks", ["6 days", "6 months", "6 hours"]]
];
const estimate = {
  id:"me-estimate", name:"Estimate and measure", emoji:"📐",
  desc:"Get to know some benchmarks: a door is about 2 m tall, a bag of sugar is 1 kg, a cup holds about 250 ml. To measure with a ruler, line the end up with 0, or count the cm between the two ends.",
  levels:[
    { name:"Estimate lengths", desc:"Is a pencil about 15 cm, 15 m or 15 mm?" },
    { name:"Estimate mass, capacity and time", desc:"An apple · a bath · brushing your teeth" },
    { name:"Measure with a ruler", desc:"How long is the pencil, in cm or mm?" }
  ],
  make(lv){
    if (lv < 3){
      const [thing, right, wrong] = pick(lv === 1 ? LENGTHS : OTHERS);
      const ask = lv === 1 ? `What is the best estimate for the length of ${thing}?` : `What is the best estimate for ${thing}?`;
      return { text:ask, input:"choice", choices:shuffle([right, ...wrong]), answer:right, key:thing,
        explain:`<b>${right}</b><span class="why">Benchmarks: 1 cm is about the width of your finger, 1 m is a big step, 1 kg is a bag of sugar, 1 litre is a big bottle of water.</span>`,
        solution:`${thing}: about ${right}` };
    }
    const thing = pick(["pencil", "bar"]), cm = 15, mm = Math.random() < .5;
    let from, to;
    do { from = Math.random() < .5 ? 0 : rnd(1, 4); to = from + (mm ? rnd(25, 110) / 10 : rnd(3, 11)); } while (to > cm - .5);
    to = +to.toFixed(1);
    const len = +(to - from).toFixed(1), ans = mm ? Math.round(len * 10) : len;
    return { text:`How long is the ${thing === "pencil" ? "pencil" : "ribbon"}, in ${mm ? "millimetres" : "centimetres"}?`, picture:Y4.draw.ruler(cm, from, to, thing), answer:ans, suffix:mm ? " mm" : " cm", key:`ru${from}-${to}${mm}`,
      explain:`<b>${ans} ${mm ? "mm" : "cm"}</b><span class="why">${from ? `It starts at ${from} cm, not 0, so count from there: ${to} − ${from} = ${len} cm.` : `It starts at 0 and ends at ${to} cm.`}${mm ? ` 1 cm = 10 mm, so ${len} cm = ${ans} mm.` : ""}</span>`,
      solution:`${from} cm to ${to} cm = ${mm ? ans + " mm" : len + " cm"}` };
  }
};

Y4.TOPICS.push({ id:"measurement", title:"Measurement", emoji:"📏",
  skills:[convert, estimate, perimeter, area, time, moneySkill] });
})();
