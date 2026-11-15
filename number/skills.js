/* Number & place value: section 1 of the curriculum. */
(function(){
"use strict";
const { rnd, pick, shuffle, num } = Y4;
const BOX = "□";
const PLACES = ["thousands", "hundreds", "tens", "ones"];
const PLACE1 = ["thousand", "hundred", "ten", "one"];

/* ---------- Counting in steps ---------- */
function sequence(start, step, len, gapAt){
  const terms = [];
  for (let i = 0; i < len; i++) terms.push(start + i * step);
  const answer = terms[gapAt];
  const text = terms.map((t, i) => i === gapAt ? BOX : num(t)).join(", ");
  const dir = step > 0 ? `+${step}` : `−${-step}`;
  const before = gapAt > 0 ? `${num(terms[gapAt - 1])} ${step > 0 ? "+" : "−"} ${Math.abs(step)} = ${num(answer)}`
                           : `${num(terms[1])} ${step > 0 ? "−" : "+"} ${Math.abs(step)} = ${num(answer)}`;
  return { text, answer, key:text,
    explain:`The missing number is <b>${num(answer)}</b><span class="why">The rule is ${dir} each time: ${before}</span>`,
    solution:terms.map(num).join(", ") };
}
const counting = {
  id:"nu-count", name:"Counting in steps", emoji:"🦘",
  desc:"Count in 6s, 7s, 9s, 25s and 1000s, forwards and backwards. Find the missing number.",
  levels:[
    { name:"6s, 7s and 9s", desc:"6, 12, □, 24, 30" },
    { name:"25s and 1000s", desc:"75, 100, □, 150   ·   2350, 3350, □" },
    { name:"Forwards and backwards", desc:"Any step, from any number, either way" }
  ],
  make(lv){
    let step, start;
    if (lv === 1){ step = pick([6,7,9]); start = step * rnd(0, 7); }
    else if (lv === 2){
      if (Math.random() < .5){ step = 25; start = 25 * rnd(0, 30); }
      else { step = 1000; start = Math.random() < .5 ? 1000 * rnd(0, 4) : rnd(100, 4999); }
      if (Math.random() < .4){ start += step * 4; step = -step; }
    } else {
      step = pick([6,7,9,25,50,100,1000]);
      start = step === 1000 ? rnd(100, 4999) : rnd(1, step * 10);
      if (Math.random() < .5){ start += step * 4; step = -step; }
    }
    return { ...sequence(start, step, 5, rnd(lv === 1 ? 1 : 0, 4)), maxLen:5 };
  }
};

/* ---------- 10, 100, 1000 more or less ---------- */
function moreLess(n, by, more){
  const r = more ? n + by : n - by;
  return { text:`What is ${by} ${more ? "more" : "less"} than ${n}?`, answer:r, maxLen:5, key:`${n}${more ? "+" : "-"}${by}`,
    explain:`${n} ${more ? "+" : "−"} ${by} = <b>${r}</b>`, solution:`${by} ${more ? "more" : "less"} than ${n} is ${r}` };
}
const moreLessSkill = {
  id:"nu-moreless", name:"1000 more or less", emoji:"⬆️",
  desc:"Find 10, 100 or 1000 more or less than a number. Usually only one digit changes.",
  levels:[
    { name:"10 and 100 more or less", desc:"What is 100 more than 452?" },
    { name:"1000 more or less", desc:"What is 1000 less than 6371?" },
    { name:"Tricky ones", desc:"When more than one digit changes: 100 more than 3950" }
  ],
  make(lv){
    const more = Math.random() < .5;
    if (lv === 1){
      const by = pick([10, 100]);
      const n = rnd(more ? 100 : by + 1, 989);
      const q = moreLess(n, by, more);
      q.explain += `<span class="why">Only the ${by === 10 ? "tens" : "hundreds"} digit changes.</span>`;
      return q;
    }
    if (lv === 2){
      const n = more ? rnd(1000, 8999) : rnd(1000, 9999);
      const q = moreLess(n, 1000, more);
      q.explain += `<span class="why">Only the thousands digit changes.</span>`;
      return q;
    }
    // level 3: crossing a boundary, or working backwards
    const by = pick([10, 100, 1000]);
    if (Math.random() < .3){
      const target = rnd(1000 + by, 9000);
      return { text:`${by} ${more ? "more" : "less"} than ${BOX} is ${target}. What is the missing number?`,
        answer: more ? target - by : target + by, maxLen:5, key:`?${by}${more}${target}`,
        explain:`The missing number is <b>${more ? target - by : target + by}</b><span class="why">Work backwards: ${target} ${more ? "−" : "+"} ${by} = ${more ? target - by : target + by}</span>`,
        solution:`${by} ${more ? "more" : "less"} than ${more ? target - by : target + by} is ${target}` };
    }
    let n;
    if (by === 10)  n = more ? rnd(10, 99) * 100 + 90 + rnd(0, 9) : rnd(10, 99) * 100 + rnd(0, 9);          // tens digit 9 or 0
    if (by === 100) n = more ? rnd(1, 8) * 1000 + 900 + rnd(0, 99) : rnd(1, 9) * 1000 + rnd(0, 99);        // hundreds digit 9 or 0
    if (by === 1000) n = more ? rnd(9000, 9999) : rnd(1000, 1999);
    const q = moreLess(n, by, more);
    q.explain += `<span class="why">Careful! ${more ? "Going up" : "Going down"} past a ${by === 1000 ? "ten thousand" : by === 100 ? "thousand" : "hundred"} changes more than one digit.</span>`;
    return q;
  }
};

/* ---------- Negative numbers ---------- */
const negative = {
  id:"nu-negative", name:"Negative numbers", emoji:"🌡️",
  desc:"Count backwards through zero into negative numbers. Tap “Make it negative −” to type a minus sign.",
  levels:[
    { name:"Count past zero", desc:"Start at 3 and count back 5" },
    { name:"Number patterns", desc:"6, 3, 0, −3, □" },
    { name:"Temperature", desc:"It is 4°C. It gets 9 degrees colder." }
  ],
  make(lv){
    if (lv === 1){
      let start, move, back = Math.random() < .65;
      if (back){ start = rnd(0, 6); move = rnd(start + 1, start + 6); }
      else { start = -rnd(1, 8); move = rnd(1, 8); }
      const end = back ? start - move : start + move;
      return { text:`Start at ${num(start)} and count ${back ? "back" : "on"} ${move}. Where do you land?`, neg:true, answer:end,
        key:`${start}${back ? "-" : "+"}${move}`,
        picture:Y4.draw.numberLine(-10, 10, 1, [{ v:start, cls:"start", label:"start" }]),
        explain:`You land on <b>${num(end)}</b>${Y4.draw.numberLine(-10, 10, 1, [{ v:start, cls:"start", label:"start" }, { v:end, cls:"end", label:num(end) }])}`,
        solution:`${num(start)} ${back ? "−" : "+"} ${move} = ${num(end)}` };
    }
    if (lv === 2){
      const step = pick([1, 2, 3, 4, 5, 10]);
      const offset = step > 1 && Math.random() < .3 ? rnd(1, step - 1) : 0;   // sometimes the pattern skips 0
      const start = step * rnd(1, 3) + offset;
      const q = sequence(start, -step, 6, rnd(2, 5));
      return { ...q, neg:true, maxLen:3 };
    }
    const form = rnd(1, 3);
    if (form === 1){
      const t = rnd(0, 8), d = rnd(t + 1, t + 8), r = t - d;
      return { text:`The temperature is ${t}°C. It gets ${d} degrees colder. What is the temperature now?`, neg:true, answer:r,
        key:`c${t}-${d}`, explain:`It is now <b>${num(r)}°C</b><span class="why">${t} − ${d} = ${num(r)}. Count back ${t} to reach 0, then ${d - t} more.</span>`,
        solution:`${t}°C − ${d} degrees = ${num(r)}°C` };
    }
    if (form === 2){
      const t = -rnd(1, 9), w = rnd(1, 12), r = t + w;
      return { text:`In the morning it is ${num(t)}°C. By lunchtime it is ${w} degrees warmer. What is the temperature at lunchtime?`, neg:true, answer:r,
        key:`w${t}+${w}`, explain:`It is <b>${num(r)}°C</b><span class="why">Count on ${w} from ${num(t)}: ${num(t)} + ${w} = ${num(r)}</span>`,
        solution:`${num(t)}°C + ${w} degrees = ${num(r)}°C` };
    }
    const lo = -rnd(1, 8), hi = rnd(1, 9), d = hi - lo;
    return { text:`At night it was ${num(lo)}°C. In the day it was ${hi}°C. How many degrees warmer was the day?`, neg:true, answer:d,
      key:`d${lo}${hi}`,
      explain:`<b>${d}</b> degrees warmer<span class="why">From ${num(lo)} up to 0 is ${-lo}, and from 0 up to ${hi} is ${hi}: ${-lo} + ${hi} = ${d}</span>${Y4.draw.numberLine(-10, 10, 1, [{ v:lo, cls:"start" }, { v:hi, cls:"end" }])}`,
      solution:`From ${num(lo)}°C to ${hi}°C is ${d} degrees` };
  }
};

/* ---------- Place value ---------- */
function distinctDigits(){
  const d = shuffle([0,1,2,3,4,5,6,7,8,9]).slice(0, 4);
  if (d[0] === 0) [d[0], d[1]] = [d[1], d[0]];
  return d;
}
const partsOf = n => String(n).split("").map((c, i) => +c * Math.pow(10, 3 - i));
const place = {
  id:"nu-place", name:"Place value", emoji:"🏠",
  desc:"Each digit in a 4-digit number has a value: in 3742, the 3 is worth 3000, the 7 is worth 700, the 4 is worth 40 and the 2 is worth 2.",
  levels:[
    { name:"Value of a digit", desc:"What is the value of the 7 in 3742?" },
    { name:"Partitioning", desc:"3742 = 3000 + □ + 40 + 2" },
    { name:"Tricky partitions", desc:"4 thousands and 7 tens   ·   500 + 6 + 2000" }
  ],
  make(lv){
    if (lv === 1){
      let d, pos;
      do { d = distinctDigits(); pos = rnd(0, 3); } while (d[pos] === 0);
      const n = +d.join(""), v = d[pos] * Math.pow(10, 3 - pos);
      return { text:`What is the value of the ${d[pos]} in ${n}?`, answer:v, maxLen:4, key:`${n}@${pos}`,
        explain:`It is worth <b>${v}</b><span class="why">The ${d[pos]} is in the ${PLACES[pos]} place.</span>${Y4.draw.placeValue(n, pos)}`,
        solution:`The ${d[pos]} in ${n} is worth ${v}` };
    }
    if (lv === 2){
      let n; do { n = rnd(1111, 9999); } while (String(n).includes("0"));
      const parts = partsOf(n);
      if (Math.random() < .35){
        return { text:`${parts.join(" + ")} =`, answer:n, maxLen:4, key:`p${n}`,
          explain:`<b>${n}</b>${Y4.draw.placeValue(n)}`, solution:`${parts.join(" + ")} = ${n}` };
      }
      const gap = rnd(0, 3);
      return { text:`${n} = ${parts.map((p, i) => i === gap ? BOX : p).join(" + ")}`, answer:parts[gap], maxLen:4, key:`${n}g${gap}`,
        explain:`The missing number is <b>${parts[gap]}</b><span class="why">The ${String(n)[gap]} is in the ${PLACES[gap]} place.</span>${Y4.draw.placeValue(n, gap)}`,
        solution:`${n} = ${parts.join(" + ")}` };
    }
    // level 3: zeros and jumbled order
    let n;
    do { n = rnd(1001, 9999); } while (!String(n).slice(1).includes("0") || String(n).slice(1) === "000");
    const ds = String(n).split("").map(Number);
    if (Math.random() < .5){
      const words = ds.map((d, i) => d ? `${d} ${d === 1 ? PLACE1[i] : PLACES[i]}` : null).filter(Boolean);
      const text = (words.length > 1 ? words.slice(0, -1).join(", ") + " and " + words[words.length - 1] : words[0]) + " =";
      return { text, answer:n, maxLen:4, key:`w${n}`,
        explain:`<b>${n}</b><span class="why">Put a 0 in any empty place.</span>${Y4.draw.placeValue(n)}`, solution:`${text} ${n}` };
    }
    const parts = shuffle(partsOf(n).filter(x => x > 0));
    return { text:`${parts.join(" + ")} =`, answer:n, maxLen:4, key:`j${n}`,
      explain:`<b>${n}</b><span class="why">Sort them into thousands, hundreds, tens and ones. Put a 0 in any empty place.</span>${Y4.draw.placeValue(n)}`,
      solution:`${parts.join(" + ")} = ${n}` };
  }
};

/* ---------- Compare and order ---------- */
function firstDiff(a, b){
  const A = String(a).padStart(4, "0"), B = String(b).padStart(4, "0");
  for (let i = 0; i < 4; i++) if (A[i] !== B[i]) return i;
  return -1;
}
function compareWhy(a, b){
  const i = firstDiff(a, b);
  if (i < 0) return "They are the same number.";
  const A = String(a).padStart(4, "0"), B = String(b).padStart(4, "0");
  const same = i === 0 ? "" : `They have the same ${PLACES.slice(0, i).join(" and ")}. `;
  return `${same}Look at the ${PLACES[i]}: ${A[i]} ${+A[i] > +B[i] ? "is more than" : "is less than"} ${B[i]}.`;
}
function closeNumber(base){                      // a different number sharing some leading digits with base
  const keep = rnd(0, 2), s = String(base).split("");
  let out;
  do {
    const t = s.slice();
    for (let i = keep; i < 4; i++) t[i] = String(i === 0 ? rnd(1, 9) : rnd(0, 9));
    out = +t.join("");
  } while (out === base);
  return out;
}
const compare = {
  id:"nu-compare", name:"Compare and order", emoji:"⚖️",
  desc:"To compare numbers, look at the thousands first. If they are the same, look at the hundreds, then the tens, then the ones.",
  levels:[
    { name:"Which is bigger?", desc:"Pick the bigger (or smaller) number" },
    { name:"<, > or =", desc:"4352 ◯ 4325" },
    { name:"Order four numbers", desc:"Which is the smallest of four?" }
  ],
  make(lv){
    if (lv === 1){
      const a = rnd(1000, 9999), b = closeNumber(a), big = Math.random() < .6;
      const ans = String(big ? Math.max(a, b) : Math.min(a, b));
      return { text:`Which number is ${big ? "bigger" : "smaller"}?`, input:"choice", choices:[String(a), String(b)], answer:ans, key:`${a}|${b}|${big}`,
        explain:`<b>${ans}</b> is ${big ? "bigger" : "smaller"}<span class="why">${compareWhy(+ans, +ans === a ? b : a)}</span>`,
        solution:`${big ? "Bigger" : "Smaller"} of ${a} and ${b}: ${ans}` };
    }
    if (lv === 2){
      const a = rnd(1000, 9999), b = Math.random() < .12 ? a : closeNumber(a);
      const sign = a > b ? ">" : a < b ? "<" : "=";
      const word = { ">":"is greater than", "<":"is less than", "=":"is equal to" }[sign];
      return { text:`${a} ◯ ${b}`, input:"choice", choices:["<", ">", "="], answer:sign, key:`${a}?${b}`,
        explain:`${a} <b>${sign}</b> ${b}<span class="why">${a} ${word} ${b}. ${compareWhy(a, b)}${sign === "=" ? "" : " The open side of the sign faces the bigger number."}</span>`,
        solution:`${a} ${sign} ${b}` };
    }
    const base = rnd(1000, 9999), set = new Set([base]);
    while (set.size < 4) set.add(closeNumber(base));
    const nums = shuffle([...set]), small = Math.random() < .5;
    const sorted = nums.slice().sort((x, y) => x - y), ans = String(small ? sorted[0] : sorted[3]);
    return { text:`Which is the ${small ? "smallest" : "largest"}?`, input:"choice", choices:nums.map(String), answer:ans, key:nums.join("|") + small,
      explain:`<b>${ans}</b><span class="why">In order, smallest first: ${sorted.join(", ")}</span>`,
      solution:`${small ? "Smallest" : "Largest"}: ${ans} (${sorted.join(" < ")})` };
  }
};

/* ---------- Rounding ---------- */
const rounding = {
  id:"nu-round", name:"Rounding", emoji:"🎯",
  desc:"Round to the nearest 10, 100 or 1000. Look at the digit to the right: 5 or more rounds up, 4 or less rounds down.",
  levels:[
    { name:"Nearest 10", desc:"Round 347 to the nearest 10" },
    { name:"Nearest 100", desc:"Round 2650 to the nearest 100" },
    { name:"Nearest 1000", desc:"Round 6499 to the nearest 1000" }
  ],
  make(lv){
    const to = [10, 100, 1000][lv - 1], hiN = lv === 1 ? 999 : 9999;
    let n;
    do {
      n = rnd(to + 1, hiN);
      if (Math.random() < .2) n = Math.floor(n / to) * to + to / 2;    // exactly half way: rounds up
    } while (n % to === 0);
    const lo = Math.floor(n / to) * to, hi = lo + to, r = n - lo >= to / 2 ? hi : lo;
    const digitName = ["ones", "tens", "hundreds"][lv - 1], digit = Math.floor(n / (to / 10)) % 10;
    return { text:`Round ${n} to the nearest ${to}.`, answer:r, maxLen:5, key:`${n}~${to}`,
      explain:`${n} rounds to <b>${r}</b><span class="why">${n} is between ${lo} and ${hi}. The ${digitName} digit is ${digit}, so round ${r === hi ? "up" : "down"}.</span>` +
              Y4.draw.numberLine(lo, hi, to / 10, [{ v:n, cls:"start", label:String(n) }, { v:r, cls:"end" }], 5),
      solution:`${n} → ${r} (nearest ${to})` };
  }
};

/* ---------- Roman numerals ---------- */
function roman(n){
  const T = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC", "C"], O = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
  return T[Math.floor(n / 10)] + O[n % 10];
}
function romanWhy(n){
  const t = Math.floor(n / 10) * 10, o = n % 10;
  if (!t || !o) return `${roman(n)} = ${n}`;
  return `${roman(n)} = ${roman(t)} + ${roman(o)} = ${t} + ${o} = ${n}`;
}
const KEY_ROMAN = "I = 1, V = 5, X = 10, L = 50, C = 100. A smaller letter before a bigger one is taken away: IV = 4, IX = 9, XL = 40, XC = 90.";
function wrongRomans(n){
  const w = new Set();
  const add = s => { if (s && s !== roman(n)) w.add(s); };
  // common mistakes: adding instead of taking away, letters the wrong way round, nearby numbers
  const t = Math.floor(n / 10), o = n % 10;
  add("X".repeat(t > 3 && t < 9 ? t : 0) + roman(o));
  add(roman(t * 10) + "I".repeat(o === 4 || o === 9 ? o : 0));
  if (o === 4) add(roman(t * 10) + "VI"); if (o === 9) add(roman(t * 10) + "XI");
  if (o === 6) add(roman(t * 10) + "IV"); if (t === 4) add("LX" + roman(o)); if (t === 6) add("XL" + roman(o));
  [n + 1, n - 1, n + 10, n - 10, n + 5, n - 5].forEach(m => { if (m >= 1 && m <= 100) add(roman(m)); });
  return shuffle([...w]).slice(0, 3);
}
const romanSkill = {
  id:"nu-roman", name:"Roman numerals", emoji:"🏛️",
  desc:KEY_ROMAN,
  levels:[
    { name:"Read I to XX", desc:"XIV = 14" },
    { name:"Read up to C", desc:"LXXVIII = 78" },
    { name:"Write them", desc:"Which is 49 in Roman numerals?" }
  ],
  make(lv){
    if (lv < 3){
      const n = lv === 1 ? rnd(1, 20) : rnd(21, 100);
      return { text:`${roman(n)} =`, answer:n, key:roman(n),
        explain:`<b>${n}</b><span class="why">${romanWhy(n)}</span>`, solution:`${roman(n)} = ${n}` };
    }
    const n = Math.random() < .5 ? pick([4, 9, 14, 19, 24, 29, 34, 39, 40, 44, 49, 59, 69, 90, 94, 99]) : rnd(11, 100);
    const r = roman(n);
    return { text:`Which is ${n} in Roman numerals?`, input:"choice", choices:shuffle([r, ...wrongRomans(n)]), answer:r, key:`w${n}`,
      explain:`<b>${r}</b><span class="why">${romanWhy(n)}</span>`, solution:`${n} = ${r}` };
  }
};

Y4.TOPICS.push({ id:"number", title:"Number & Place Value", emoji:"🔢",
  skills:[counting, moreLessSkill, negative, place, compare, rounding, romanSkill] });
})();
