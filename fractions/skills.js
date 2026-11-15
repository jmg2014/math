/* Fractions & decimals: section 4 of the curriculum. */
(function(){
"use strict";
const { rnd, pick, shuffle, frac } = Y4;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const dec = v => String(+v.toFixed(2));              // 0.30000000004 → "0.3"
const money = p => "£" + (p / 100).toFixed(2);      // pence → "£3.45"
const NAMES = ["Amir", "Bella", "Chen", "Dev", "Ella", "Femi", "Grace", "Hugo", "Isla", "Jack", "Kemi", "Leo", "Maya", "Noah", "Priya", "Zara"];

/* ---------- Equivalent fractions ---------- */
function simpleFraction(maxD){
  let a, b; do { b = rnd(2, maxD); a = rnd(1, b - 1); } while (gcd(a, b) !== 1);
  return [a, b];
}
const equivalent = {
  id:"fr-equiv", name:"Equivalent fractions", emoji:"🍕",
  desc:`Equivalent fractions are the same amount: ${frac(1,2)} = ${frac(2,4)} = ${frac(4,8)}. Multiply (or divide) the top and bottom by the same number.`,
  levels:[
    { name:"With pictures", desc:"½ = □/8, with fraction bars" },
    { name:"Missing numbers", desc:"2/3 = □/12   ·   6/9 = 2/□" },
    { name:"Spot and simplify", desc:"Which is equal to ¾?   ·   Simplify 8/12" }
  ],
  make(lv){
    if (lv === 1){
      const [a, b] = simpleFraction(5), k = rnd(2, Math.floor(12 / b));
      return { text:`${frac(a, b)} = ${frac("□", b * k)}`, answer:a * k, key:`${a}/${b}=?/${b * k}`,
        picture:Y4.draw.fracBar(b, a, `${a}/${b}`) + Y4.draw.fracBar(b * k, 0, `?/${b * k}`),
        explain:`${frac(a, b)} = ${frac(`<b>${a * k}</b>`, b * k)}<span class="why">Each part is split into ${k}, so ${a} × ${k} = ${a * k}</span>` +
                Y4.draw.fracBar(b, a, `${a}/${b}`) + Y4.draw.fracBar(b * k, a * k, `${a * k}/${b * k}`),
        solution:`${a}/${b} = ${a * k}/${b * k}` };
    }
    if (lv === 2){
      const [a, b] = simpleFraction(10), k = rnd(2, Math.max(2, Math.floor(60 / b / 2)));
      const form = rnd(1, 3), A = a * k, B = b * k;
      const why = `${a}/${b} = ${A}/${B}: the top and bottom are both × ${k}`;
      if (form === 1) return { text:`${frac(a, b)} = ${frac("□", B)}`, answer:A, key:`${a}/${b}=?/${B}`,
        explain:`□ = <b>${A}</b><span class="why">${b} × ${k} = ${B}, so ${a} × ${k} = ${A}</span>`, solution:why };
      if (form === 2) return { text:`${frac(A, B)} = ${frac(a, "□")}`, answer:b, key:`${A}/${B}=${a}/?`,
        explain:`□ = <b>${b}</b><span class="why">${A} ÷ ${k} = ${a}, so ${B} ÷ ${k} = ${b}</span>`, solution:why };
      return { text:`${frac(A, B)} = ${frac("□", b)}`, answer:a, key:`${A}/${B}=?/${b}`,
        explain:`□ = <b>${a}</b><span class="why">${B} ÷ ${k} = ${b}, so ${A} ÷ ${k} = ${a}</span>`, solution:why };
    }
    const [a, b] = simpleFraction(8), k = rnd(2, 4);
    if (Math.random() < .5){
      const right = frac(a * k, b * k);
      const wrongs = new Set();
      const tryAdd = (n, d) => { if (n > 0 && d > 0 && n * b !== d * a) wrongs.add(frac(n, d)); };
      tryAdd(a + k, b + k); tryAdd(a, b * k); tryAdd(a * k, b); tryAdd(b, a); tryAdd(a * k + 1, b * k); tryAdd(a + 1, b + 1); tryAdd(a * k, b * k + k);
      return { text:`Which fraction is equal to ${frac(a, b)}?`, input:"choice", choices:shuffle([right, ...shuffle([...wrongs]).slice(0, 3)]), answer:right, key:`w${a}/${b}x${k}`,
        explain:`${right}<span class="why">${a} × ${k} = ${a * k} and ${b} × ${k} = ${b * k}. Adding the same number to the top and bottom does not work!</span>`,
        solution:`${a}/${b} = ${a * k}/${b * k}` };
    }
    return { text:`Write ${frac(a * k, b * k)} in its simplest form.`, input:"fraction", answer:{ n:a, d:b }, key:`s${a * k}/${b * k}`,
      check:g => g.n === a && g.d === b,
      explain:`${frac(a * k, b * k)} = <b>${frac(a, b)}</b><span class="why">Divide the top and bottom by ${k}. ${a} and ${b} can't both be divided again.</span>`,
      solution:`${a * k}/${b * k} = ${a}/${b}` };
  }
};

/* ---------- Adding and subtracting fractions ---------- */
const addSub = {
  id:"fr-addsub", name:"Add and subtract fractions", emoji:"➕",
  desc:`When the bottom numbers are the same, add or subtract the top numbers and keep the bottom number: ${frac(2,7)} + ${frac(3,7)} = ${frac(5,7)}.`,
  levels:[
    { name:"Adding, with pictures", desc:"1/5 + 2/5" },
    { name:"Adding and subtracting", desc:"7/9 − 4/9   ·   3/11 + 5/11" },
    { name:"Trickier", desc:"1 − 3/8   ·   2/9 + 4/9 − 1/9   ·   3/7 + □/7 = 6/7" }
  ],
  make(lv){
    if (lv === 1){
      const d = rnd(3, 10), a = rnd(1, d - 2), b = rnd(1, d - 1 - a);
      return { text:`${frac(a, d)} + ${frac(b, d)} =`, input:"fraction", answer:{ n:a + b, d }, key:`${a}+${b}/${d}`,
        picture:Y4.draw.fracBar(d, a, `${a}/${d}`) + Y4.draw.fracBar(d, b, `${b}/${d}`),
        explain:`<b>${frac(a + b, d)}</b><span class="why">Add the tops: ${a} + ${b} = ${a + b}. Keep the bottom: ${d}.</span>${Y4.draw.fracBar(d, a + b, `${a + b}/${d}`)}`,
        solution:`${a}/${d} + ${b}/${d} = ${a + b}/${d}` };
    }
    if (lv === 2){
      const d = rnd(4, 12);
      if (Math.random() < .5){
        const a = rnd(1, d - 2), b = rnd(1, d - 1 - a);
        return { text:`${frac(a, d)} + ${frac(b, d)} =`, input:"fraction", answer:{ n:a + b, d }, key:`${a}+${b}/${d}`,
          explain:`<b>${frac(a + b, d)}</b><span class="why">${a} + ${b} = ${a + b}, and the bottom stays ${d}.</span>`, solution:`${a}/${d} + ${b}/${d} = ${a + b}/${d}` };
      }
      const a = rnd(2, d - 1), b = rnd(1, a - 1);
      return { text:`${frac(a, d)} − ${frac(b, d)} =`, input:"fraction", answer:{ n:a - b, d }, key:`${a}-${b}/${d}`,
        explain:`<b>${frac(a - b, d)}</b><span class="why">${a} − ${b} = ${a - b}, and the bottom stays ${d}.</span>`, solution:`${a}/${d} − ${b}/${d} = ${a - b}/${d}` };
    }
    const d = rnd(4, 12), form = rnd(1, 3);
    if (form === 1){
      const a = rnd(1, d - 1);
      return { text:`1 − ${frac(a, d)} =`, input:"fraction", answer:{ n:d - a, d }, key:`1-${a}/${d}`,
        explain:`<b>${frac(d - a, d)}</b><span class="why">1 whole = ${d}/${d}. ${d} − ${a} = ${d - a}</span>`, solution:`1 − ${a}/${d} = ${d - a}/${d}` };
    }
    if (form === 2){
      let a, b, c; do { a = rnd(1, d - 2); b = rnd(1, d - 1 - a); c = rnd(1, a + b - 1); } while (a + b - c < 1);
      return { text:`${frac(a, d)} + ${frac(b, d)} − ${frac(c, d)} =`, input:"fraction", answer:{ n:a + b - c, d }, key:`${a}+${b}-${c}/${d}`,
        explain:`<b>${frac(a + b - c, d)}</b><span class="why">${a} + ${b} = ${a + b}, then ${a + b} − ${c} = ${a + b - c}</span>`, solution:`${a}/${d} + ${b}/${d} − ${c}/${d} = ${a + b - c}/${d}` };
    }
    const a = rnd(1, d - 2), c = rnd(a + 1, d - 1);
    return { text:`${frac(a, d)} + ${frac("□", d)} = ${frac(c, d)}`, answer:c - a, key:`${a}+?=${c}/${d}`,
      explain:`□ = <b>${c - a}</b><span class="why">${c} − ${a} = ${c - a}</span>`, solution:`${a}/${d} + ${c - a}/${d} = ${c}/${d}` };
  }
};

/* ---------- Fraction of an amount ---------- */
const ofAmount = {
  id:"fr-of", name:"Fraction of an amount", emoji:"🍬",
  desc:`To find ${frac(3,4)} of 20: divide by the bottom number (20 ÷ 4 = 5), then multiply by the top number (5 × 3 = 15).`,
  levels:[
    { name:"Unit fractions", desc:"⅓ of 24   ·   ⅕ of 35" },
    { name:"Any fraction", desc:"¾ of 20   ·   ⅖ of 35" },
    { name:"Word problems", desc:"3/8 of 32 children walk to school…" }
  ],
  make(lv){
    if (lv === 1){
      const b = rnd(2, 10), m = rnd(2, 12), n = b * m;
      return { text:`${frac(1, b)} of ${n} =`, answer:m, key:`1/${b}of${n}`,
        explain:`<b>${m}</b><span class="why">${n} ÷ ${b} = ${m}</span>`, solution:`1/${b} of ${n} = ${m}` };
    }
    let a, b; do { b = rnd(3, 10); a = rnd(2, b - 1); } while (gcd(a, b) !== 1);
    const m = rnd(2, lv === 2 ? 10 : 12), n = b * m, r = a * m;
    const why = `${n} ÷ ${b} = ${m}, then ${m} × ${a} = ${r}`;
    if (lv === 2) return { text:`${frac(a, b)} of ${n} =`, answer:r, key:`${a}/${b}of${n}`,
      explain:`<b>${r}</b><span class="why">${why}</span>`, solution:`${a}/${b} of ${n} = ${r}` };
    const who = pick(NAMES), form = rnd(1, 4);
    if (form === 1) return { text:`There are ${n} children in a school club. ${frac(a, b)} of them walk to school. How many children walk?`, answer:r, key:`w${a}/${b}of${n}`,
      explain:`<b>${r}</b> children<span class="why">${why}</span>`, solution:`${a}/${b} of ${n} = ${r}` };
    if (form === 2) return { text:`${who} had £${n} and spent ${frac(a, b)} of it. How much money is left?`, answer:n - r, prefix:"£", key:`m${a}/${b}of${n}`,
      explain:`<b>£${n - r}</b> is left<span class="why">Spent: ${why}. Left: £${n} − £${r} = £${n - r}</span>`, solution:`£${n} − ${a}/${b} of £${n} = £${n - r}` };
    if (form === 3) return { text:`A farmer has ${n} sheep. ${frac(a, b)} of them are white. How many sheep are not white?`, answer:n - r, key:`s${a}/${b}of${n}`,
      explain:`<b>${n - r}</b> sheep<span class="why">White: ${why}. Not white: ${n} − ${r} = ${n - r}</span>`, solution:`${n} − ${a}/${b} of ${n} = ${n - r}` };
    return { text:`${frac(1, b)} of a number is ${m}. What is the number?`, answer:n, key:`inv1/${b}=${m}`,
      explain:`<b>${n}</b><span class="why">There are ${b} equal parts of ${m}: ${m} × ${b} = ${n}</span>`, solution:`1/${b} of ${n} = ${m}` };
  }
};

/* ---------- Tenths and hundredths ---------- */
const tenths = {
  id:"fr-tenths", name:"Tenths and hundredths", emoji:"🔟",
  desc:`A tenth is 1 of 10 equal parts: ${frac(1,10)} = 0.1. A hundredth is 1 of 100 equal parts: ${frac(1,100)} = 0.01. Learn these too: ${frac(1,4)} = 0.25, ${frac(1,2)} = 0.5, ${frac(3,4)} = 0.75. Tap “Decimal point .” to type the point.`,
  levels:[
    { name:"Tenths", desc:"3/10 = 0.3" },
    { name:"Hundredths, ¼, ½, ¾", desc:"47/100 = 0.47   ·   ¾ = 0.75" },
    { name:"Counting and how many", desc:"Count up and down: 0.98, 0.99, □ · 1.01, 1.00, □ · hundredths in 0.6?" }
  ],
  make(lv){
    if (lv === 1){
      const n = rnd(1, 9);
      if (Math.random() < .5) return { text:`${frac(n, 10)} as a decimal =`, input:"decimal", answer:n / 10, key:`t${n}`,
        picture:Y4.draw.fracBar(10, n), explain:`<b>0.${n}</b><span class="why">${n} tenths = 0.${n}</span>`, solution:`${n}/10 = 0.${n}` };
      if (Math.random() < .5) return { text:`0.${n} = ${frac("□", 10)}`, answer:n, key:`d${n}`,
        explain:`<b>${n}</b>/10<span class="why">The first digit after the point is tenths: 0.${n} = ${n} tenths</span>`, solution:`0.${n} = ${n}/10` };
      return { text:"What decimal is coloured?", input:"decimal", answer:n / 10, picture:Y4.draw.fracBar(10, n), key:`p${n}`,
        explain:`<b>0.${n}</b><span class="why">${n} of the 10 parts are coloured: ${n}/10 = 0.${n}</span>`, solution:`${n}/10 = 0.${n}` };
    }
    if (lv === 2){
      const r = Math.random();
      if (r < .3){
        const f = pick([[1, 4, 0.25], [1, 2, 0.5], [3, 4, 0.75]]);
        if (Math.random() < .5) return { text:`${frac(f[0], f[1])} as a decimal =`, input:"decimal", answer:f[2], key:`k${f[0]}/${f[1]}`,
          explain:`<b>${f[2]}</b><span class="why">${f[0]}/${f[1]} = ${f[2] * 100}/100 = ${f[2]}</span>`, solution:`${f[0]}/${f[1]} = ${f[2]}` };
        const right = frac(f[0], f[1]);
        return { text:`${f[2]} as a fraction is…`, input:"choice", choices:shuffle([frac(1, 4), frac(1, 2), frac(3, 4), frac(Math.round(f[2] * 100), 10)].filter((c, i, A) => A.indexOf(c) === i)),
          answer:right, key:`kf${f[2]}`, explain:`${right}<span class="why">${f[2]} = ${f[2] * 100} hundredths = ${f[0]}/${f[1]}</span>`, solution:`${f[2]} = ${f[0]}/${f[1]}` };
      }
      const n = Math.random() < .3 ? rnd(1, 9) : rnd(11, 99);
      const d = dec(n / 100);
      if (r < .65) return { text:`${frac(n, 100)} as a decimal =`, input:"decimal", answer:n / 100, key:`h${n}`,
        picture:Y4.draw.hundredSquare(n), explain:`<b>${d}</b><span class="why">${n} hundredths = ${d}${n < 10 ? ". Don't forget the 0 in the tenths place!" : ""}</span>`, solution:`${n}/100 = ${d}` };
      return { text:`${d} = ${frac("□", 100)}`, answer:n, key:`hd${n}`,
        explain:`<b>${n}</b>/100<span class="why">${d} = ${n} hundredths</span>`, solution:`${d} = ${n}/100` };
    }
    const form = rnd(1, 3);
    if (form === 1){                                  // count in tenths or hundredths, across a whole number
      const step = Math.random() < .5 ? 1 : 10, whole = rnd(0, 4), down = Math.random() < .5;   // counting up or down
      const cross = whole * 100 + 100;                                            // the whole number it passes, in hundredths
      const start = down ? cross + rnd(1, 2) * step : cross + rnd(0, 1) * step;   // picked once for the whole sequence
      const terms = down ? [0, 1, 2, 3].map(i => start - i * step)                  // e.g. 1.02, 1.01, 1.00, 0.99
                         : [3, 2, 1, 0].map(i => start - i * step);                 // e.g. 0.98, 0.99, 1.00, 1.01
      const gap = rnd(1, 3);
      const show = terms.map((t, i) => i === gap ? "□" : (t / 100).toFixed(step === 10 ? 1 : 2)).join(", ");
      const how = step === 1 ? `hundredths: ${down ? "− 0.01" : "+ 0.01"}` : `tenths: ${down ? "− 0.1" : "+ 0.1"}`;
      return { text:show, input:"decimal", answer:terms[gap] / 100, key:show,
        explain:`<b>${dec(terms[gap] / 100)}</b><span class="why">Counting ${down ? "down" : "up"} in ${how} each time. ${step === 1 ? (down ? "Before 1.00 comes 0.99: one hundredth less than a whole." : "After 0.99 comes the next whole number.") : ""}</span>`,
        solution:terms.map(t => dec(t / 100)).join(", ") };
    }
    if (form === 2){
      const t = rnd(1, 9);
      return { text:`How many hundredths are there in 0.${t}?`, answer:t * 10, key:`hin${t}`,
        explain:`<b>${t * 10}</b><span class="why">1 tenth = 10 hundredths, so ${t} tenths = ${t * 10} hundredths (0.${t} = 0.${t}0)</span>`, solution:`0.${t} = ${t * 10} hundredths` };
    }
    const n = rnd(11, 59);
    return { text:`How many tenths are there in ${dec(n / 10)}?`, answer:n, key:`tin${n}`,
      explain:`<b>${n}</b><span class="why">Each whole one is 10 tenths: ${Math.floor(n / 10)} × 10 + ${n % 10} = ${n}</span>`, solution:`${dec(n / 10)} = ${n} tenths` };
  }
};

/* ---------- Dividing by 10 and 100 ---------- */
const divide = {
  id:"fr-divide", name:"÷ 10 and ÷ 100", emoji:"➗",
  desc:"When you divide by 10, every digit moves one place to the right: ones become tenths, and tenths become hundredths. When you divide by 100, every digit moves two places to the right.",
  levels:[
    { name:"÷ 10", desc:"35 ÷ 10 = 3.5 · what is the 5 worth in the answer?" },
    { name:"÷ 100, and tenths ÷ 10", desc:"35 ÷ 100 = 0.35   ·   0.3 ÷ 10 = 0.03" },
    { name:"Missing numbers", desc:"□ ÷ 10 = 4.6   ·   63 ÷ □ = 0.63" }
  ],
  make(lv){
    if (Math.random() < .3){                          // the value of each digit in the answer: ones, tenths, hundredths
      const by = lv === 1 ? 10 : pick([10, 100]);
      let n; do { n = rnd(11, 99); } while (n % 10 === 0 || Math.floor(n / 10) === n % 10);
      const tens = Math.floor(n / 10), ones = n % 10, which = pick(["tens", "ones"]), d = which === "tens" ? tens : ones;
      const PLACE = by === 10 ? { tens:"ones", ones:"tenths" } : { tens:"tenths", ones:"hundredths" };
      const say = (k, place) => `${k} ${k === 1 ? place.replace(/s$/, "") : place}`;
      const right = say(d, PLACE[which]), r = dec(n / by);
      return { text:`${n} ÷ ${by} = ${r}. What is the ${d} worth in the answer?`, input:"choice",
        choices:["tens", "ones", "tenths", "hundredths"].map(pl => say(d, pl)), answer:right, key:`dv${n}/${by}${which}`,
        explain:`<b>${right}</b><span class="why">The ${d} was ${say(d, which)}; dividing by ${by} moved it ${by === 10 ? "one place" : "two places"} to the right.</span>${Y4.draw.decimalChart([[n, ""], [r, `÷ ${by}`]])}`,
        solution:`In ${r}, the ${d} is ${right}` };
    }
    if (lv > 1 && Math.random() < .35){              // tenths ÷ 10 make hundredths: 0.3 ÷ 10 = 0.03, 4.7 ÷ 10 = 0.47
      const t = Math.random() < .5 ? rnd(1, 9) : rnd(11, 99), v = dec(t / 10), r = dec(t / 100);
      return { text:`${v} ÷ 10 =`, input:"decimal", answer:t / 100, key:`t${t}/10`,
        explain:`<b>${r}</b><span class="why">Dividing by 10 moves every digit one place to the right, so tenths become hundredths.${t < 10 ? ` ${t} tenth${t === 1 ? "" : "s"} ÷ 10 = ${t} hundredth${t === 1 ? "" : "s"}.` : ""}</span>${Y4.draw.decimalChart([[v, ""], [r, "÷ 10"]])}`,
        solution:`${v} ÷ 10 = ${r}` };
    }
    const n = Math.random() < .35 ? rnd(1, 9) : rnd(11, 99);
    if (lv < 3 || Math.random() < .3){
      const by = lv === 1 ? 10 : lv === 2 ? 100 : pick([10, 100]), r = dec(n / by);
      return { text:`${n} ÷ ${by} =`, input:"decimal", answer:n / by, key:`${n}/${by}`,
        explain:`<b>${r}</b><span class="why">The digits move ${by === 10 ? "one place" : "two places"} to the right.</span>${Y4.draw.decimalChart([[n, ""], [r, `÷ ${by}`]])}`,
        solution:`${n} ÷ ${by} = ${r}` };
    }
    const by = pick([10, 100]), r = dec(n / by);
    if (Math.random() < .5) return { text:`□ ÷ ${by} = ${r}`, answer:n, key:`?/${by}=${r}`,
      explain:`□ = <b>${n}</b><span class="why">Multiply back: ${r} × ${by} = ${n}</span>${Y4.draw.decimalChart([[n, ""], [r, `÷ ${by}`]])}`, solution:`${n} ÷ ${by} = ${r}` };
    return { text:`${n} ÷ □ = ${r}`, answer:by, key:`${n}/?=${r}`,
      explain:`□ = <b>${by}</b><span class="why">The digits moved ${by === 10 ? "one place" : "two places"} to the right.</span>${Y4.draw.decimalChart([[n, ""], [r, `÷ ${by}`]])}`, solution:`${n} ÷ ${by} = ${r}` };
  }
};

/* ---------- Rounding and comparing decimals ---------- */
const compare = {
  id:"fr-compare", name:"Round and compare decimals", emoji:"⚖️",
  desc:"To round to the nearest whole number, look at the tenths: 5 or more rounds up. To compare decimals, look at the whole numbers first, then the tenths, then the hundredths. 0.4 is bigger than 0.38!",
  levels:[
    { name:"Round to a whole number", desc:"Round 3.7 to the nearest whole number" },
    { name:"<, > or =", desc:"0.4 ◯ 0.38" },
    { name:"Order four decimals", desc:"Which is the largest: 0.5, 0.45, 0.54, 0.05?" }
  ],
  make(lv){
    if (lv === 1){
      const w = rnd(0, 19), t = rnd(1, 9), v = w + t / 10, r = t >= 5 ? w + 1 : w;
      return { text:`Round ${dec(v)} to the nearest whole number.`, answer:r, key:`r${v}`,
        explain:`<b>${r}</b><span class="why">The tenths digit is ${t}, so round ${t >= 5 ? "up" : "down"}.</span>${Y4.draw.numberLine(w, w + 1, .1, [{ v, cls:"start", label:dec(v) }, { v:r, cls:"end" }], 5)}`,
        solution:`${dec(v)} → ${r}` };
    }
    if (lv === 2){
      const w = rnd(0, 9), a1 = rnd(1, 9);
      let A = w + a1 / 10, B;
      const kind = rnd(1, 4);
      if (kind === 1) B = w + rnd(1, 9) / 10 + rnd(1, 9) / 100;                    // 0.4 vs 0.38
      else if (kind === 2) B = w + rnd(1, 99) / 100;
      else if (kind === 3) B = A;                                                    // 0.5 vs 0.50
      else B = rnd(0, 9) + rnd(1, 99) / 100;
      if (Math.random() < .5) [A, B] = [B, A];
      const ta = kind === 3 && Math.random() < .5 ? A.toFixed(2) : dec(A), tb = dec(B);
      const sign = A > B + 1e-9 ? ">" : A < B - 1e-9 ? "<" : "=";
      const pa = A.toFixed(2), pb = B.toFixed(2);
      return { text:`${ta} ◯ ${tb}`, input:"choice", choices:["<", ">", "="], answer:sign, key:`${ta}?${tb}`,
        explain:`${ta} <b>${sign}</b> ${tb}<span class="why">Write them with the same number of digits: ${pa} and ${pb}. ${sign === "=" ? "They are the same." : `${sign === ">" ? pa : pb} is bigger.`}</span>`,
        solution:`${ta} ${sign} ${tb}` };
    }
    const w = rnd(0, 5), d1 = rnd(1, 9);
    let d2; do { d2 = rnd(1, 9); } while (d2 === d1);
    const set = [w + d1 / 10, w + d1 / 10 + d2 / 100, w + d2 / 10 + d1 / 100, w + d2 / 100].map(v => +v.toFixed(2));
    const nums = shuffle([...new Set(set)]), big = Math.random() < .5;
    const sorted = nums.slice().sort((x, y) => x - y), ans = dec(big ? sorted[sorted.length - 1] : sorted[0]);
    return { text:`Which is the ${big ? "largest" : "smallest"}?`, input:"choice", choices:nums.map(dec), answer:ans, key:nums.join("|") + big,
      explain:`<b>${ans}</b><span class="why">With two decimal places: ${sorted.map(v => v.toFixed(2)).join(" < ")}</span>`,
      solution:`${big ? "Largest" : "Smallest"}: ${ans}` };
  }
};

/* ---------- Money and measures ---------- */
const ITEMS = [["a comic", 120, 480], ["a pen", 45, 199], ["a sandwich", 150, 395], ["a toy car", 199, 650], ["a drink", 65, 175], ["a book", 299, 799], ["a ball", 250, 899]];
const priceOf = it => Math.round(rnd(it[1], it[2]) / 5) * 5;
const moneyMeasures = {
  id:"fr-money", name:"Money and measures", emoji:"💷",
  desc:"£1 = 100p, so £3.45 = 345p. Line up the decimal points when you add or subtract. Tap “Decimal point .” to type the point.",
  levels:[
    { name:"Pounds and pence", desc:"£3.45 = □p   ·   275p = £□   ·   £2.35 + £1.40" },
    { name:"Change", desc:"Pay with £5 for something costing £2.65" },
    { name:"Two steps", desc:"Buy two things and work out the change   ·   ribbons and weights" }
  ],
  make(lv){
    if (lv === 1){
      const p = rnd(105, 995), form = rnd(1, 3);
      if (form === 1) return { text:`How many pence is ${money(p)}?`, answer:p, suffix:"p", maxLen:4, key:`p${p}`,
        explain:`<b>${p}p</b><span class="why">£1 = 100p, so ${money(p)} = ${p}p</span>`, solution:`${money(p)} = ${p}p` };
      if (form === 2) return { text:`Write ${p}p in pounds.`, input:"decimal", prefix:"£", answer:p / 100, key:`l${p}`,
        explain:`<b>${money(p)}</b><span class="why">100p = £1, so ${p}p = ${money(p)}</span>`, solution:`${p}p = ${money(p)}` };
      const a = rnd(110, 550), b = rnd(105, 440);
      return { text:`${money(a)} + ${money(b)} =`, input:"decimal", prefix:"£", answer:(a + b) / 100, key:`${a}+${b}`,
        explain:`<b>${money(a + b)}</b><span class="why">In pence: ${a}p + ${b}p = ${a + b}p = ${money(a + b)}</span>`, solution:`${money(a)} + ${money(b)} = ${money(a + b)}` };
    }
    if (lv === 2){
      const it = pick(ITEMS), cost = priceOf(it), paid = [500, 1000, 2000].find(x => x > cost);
      return { text:`${pick(NAMES)} buys ${it[0]} for ${money(cost)} and pays with ${money(paid).replace(".00", "")}. How much change?`, input:"decimal", prefix:"£", answer:(paid - cost) / 100,
        key:`c${cost}/${paid}`,
        explain:`<b>${money(paid - cost)}</b><span class="why">${money(paid)} − ${money(cost)} = ${money(paid - cost)} (in pence: ${paid} − ${cost} = ${paid - cost})</span>`,
        solution:`${money(paid)} − ${money(cost)} = ${money(paid - cost)}` };
    }
    const form = rnd(1, 3);
    if (form === 1){
      let i1, i2; do { i1 = pick(ITEMS); i2 = pick(ITEMS); } while (i1 === i2);
      const c1 = priceOf(i1), c2 = priceOf(i2), paid = [500, 1000, 2000].find(x => x > c1 + c2);
      return { text:`${pick(NAMES)} buys ${i1[0]} for ${money(c1)} and ${i2[0]} for ${money(c2)}, and pays with ${money(paid).replace(".00", "")}. How much change?`,
        input:"decimal", prefix:"£", answer:(paid - c1 - c2) / 100, key:`cc${c1}/${c2}/${paid}`,
        explain:`<b>${money(paid - c1 - c2)}</b><span class="why">Step 1: ${money(c1)} + ${money(c2)} = ${money(c1 + c2)}<br>Step 2: ${money(paid)} − ${money(c1 + c2)} = ${money(paid - c1 - c2)}</span>`,
        solution:`${money(paid)} − (${money(c1)} + ${money(c2)}) = ${money(paid - c1 - c2)}` };
    }
    if (form === 2){                                  // lengths in tenths of a metre
      const L = rnd(30, 60), a = rnd(5, 15), b = rnd(5, 15);
      return { text:`A ribbon is ${dec(L / 10)} m long. ${dec(a / 10)} m is cut off for a present and ${dec(b / 10)} m for a card. How much ribbon is left?`,
        input:"decimal", suffix:" m", answer:(L - a - b) / 10, key:`rb${L}/${a}/${b}`,
        explain:`<b>${dec((L - a - b) / 10)} m</b><span class="why">Step 1: ${dec(a / 10)} + ${dec(b / 10)} = ${dec((a + b) / 10)}<br>Step 2: ${dec(L / 10)} − ${dec((a + b) / 10)} = ${dec((L - a - b) / 10)}</span>`,
        solution:`${dec(L / 10)} − ${dec(a / 10)} − ${dec(b / 10)} = ${dec((L - a - b) / 10)} m` };
    }
    const a = rnd(105, 295), b = rnd(40, a - 20);   // weights in hundredths of a kg
    return { text:`A bag of apples weighs ${dec(a / 100)} kg and a bag of pears weighs ${dec(b / 100)} kg. How much heavier are the apples?`,
      input:"decimal", suffix:" kg", answer:(a - b) / 100, key:`kg${a}/${b}`,
      explain:`<b>${dec((a - b) / 100)} kg</b><span class="why">${(a / 100).toFixed(2)} − ${(b / 100).toFixed(2)} = ${((a - b) / 100).toFixed(2)}. Line up the decimal points!</span>`,
      solution:`${dec(a / 100)} − ${dec(b / 100)} = ${dec((a - b) / 100)} kg` };
  }
};

Y4.TOPICS.push({ id:"fractions", title:"Fractions & Decimals", emoji:"🍕",
  skills:[equivalent, addSub, ofAmount, tenths, divide, compare, moneyMeasures] });
})();
