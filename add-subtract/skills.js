/* Addition & subtraction: section 2 of the curriculum. */
(function(){
"use strict";
const { rnd, pick, shuffle } = Y4;
const PLACE = ["ones", "tens", "hundreds", "thousands", "ten thousands"];
const digitsOf = n => String(n).split("").reverse().map(Number);        // ones first

/* ---------- working for column sums, one line per column ---------- */
function addSteps(a, b){
  const A = digitsOf(a), B = digitsOf(b), out = [];
  let carry = 0;
  for (let i = 0; i < Math.max(A.length, B.length); i++){
    const x = A[i] || 0, y = B[i] || 0, t = x + y + carry;
    const sum = `${x} + ${y}${carry ? " + 1" : ""} = ${t}`;
    out.push(`${cap(PLACE[i])}: ${sum}${t >= 10 ? `, write ${t % 10} and carry 1` : ""}`);
    carry = t >= 10 ? 1 : 0;
  }
  if (carry) out.push(`${cap(PLACE[A.length > B.length ? A.length : B.length])}: write the carried 1`);
  return out.join("<br>");
}
function subSteps(a, b){
  // the school method: exchange from the next column; if that column is 0, go further left first
  const A = digitsOf(a), top = A.slice(), B = digitsOf(b), out = [];
  for (let i = 0; i < A.length; i++){
    const y = B[i] || 0;
    if (i >= B.length && top[i] === 0) break;          // nothing left to write
    const was = top[i] !== A[i] ? `the ${A[i]} is now ${top[i]}. ` : "";
    if (top[i] < y){
      let j = i + 1; while (top[j] === 0) j++;
      const from = top[j]; top[j]--;
      for (let k = j - 1; k > i; k--) top[k] = 9;
      const x = top[i]; top[i] += 10;
      const how = j === i + 1
        ? `exchange 1 from the ${PLACE[j]} (${from} becomes ${top[j]})`
        : `the ${PLACE.slice(i + 1, j).join(" and ")} ${j - i > 2 ? "are" : "is"} 0, so exchange from the ${PLACE[j]} (${from} becomes ${top[j]}) and the 0${j - i > 2 ? "s become" : " becomes"} 9`;
      out.push(`${cap(PLACE[i])}: ${was}${x} − ${y} won't go${j === i + 1 ? ", so " : ". " + how[0].toUpperCase()}${j === i + 1 ? how : how.slice(1)}: ${top[i]} − ${y} = ${top[i] - y}`);
    } else out.push(`${cap(PLACE[i])}: ${was}${top[i]} − ${y} = ${top[i] - y}`);
  }
  return out.join("<br>");
}
const cap = s => s[0].toUpperCase() + s.slice(1);
function countCarries(a, b){ const A = digitsOf(a), B = digitsOf(b); let c = 0, n = 0; for (let i = 0; i < Math.max(A.length, B.length); i++){ c = (A[i] || 0) + (B[i] || 0) + c >= 10 ? 1 : 0; n += c; } return n; }
function countExchanges(a, b){ const A = digitsOf(a), B = digitsOf(b); let br = 0, n = 0; for (let i = 0; i < A.length; i++){ br = A[i] - br < (B[i] || 0) ? 1 : 0; n += br; } return n; }
const columnQ = (a, op, b, r, why) => ({
  text:"", picture:Y4.draw.column(a, op, b, String(r).length), input:"column", answer:r, maxLen:5, key:`${a}${op}${b}`,
  explain:`${a} ${op} ${b} = <b>${r}</b><span class="why">${why}</span>`, solution:`${a} ${op} ${b} = ${r}` });

/* ---------- Column addition ---------- */
const colAdd = {
  id:"as-add", name:"Column addition", emoji:"➕",
  desc:"Line up the digits, then add the ones first. If a column makes 10 or more, write the ones digit and carry 1 to the next column. Type the answer under the line, ones first.",
  levels:[
    { name:"3 digits", desc:"352 + 427, with up to one carry" },
    { name:"4 digits", desc:"2486 + 1357" },
    { name:"Lots of carrying", desc:"3678 + 4859" }
  ],
  make(lv){
    let a, b;
    for (;;){
      if (lv === 1){ a = rnd(100, 899); b = rnd(100, 999 - a); if (countCarries(a, b) <= 1) break; }
      else if (lv === 2){ a = rnd(1000, 7999); b = Math.random() < .5 ? rnd(100, 999) : rnd(1000, 9999 - a); const c = countCarries(a, b); if (c >= 1 && c <= 2) break; }
      else { a = rnd(1000, 8999); b = rnd(1000, 9999 - a); if (b >= 100 && countCarries(a, b) >= 3) break; }
    }
    return columnQ(a, "+", b, a + b, addSteps(a, b));
  }
};

/* ---------- Column subtraction ---------- */
const colSub = {
  id:"as-sub", name:"Column subtraction", emoji:"➖",
  desc:"Line up the digits, then start with the ones. If the top digit is smaller, exchange 1 from the next column (1 ten = 10 ones). Type the answer under the line, ones first.",
  levels:[
    { name:"3 digits", desc:"684 − 352, no exchanging" },
    { name:"4 digits", desc:"5263 − 1847, with exchanging" },
    { name:"Zeros in the way", desc:"4003 − 1567" }
  ],
  make(lv){
    let a, b;
    for (;;){
      if (lv === 1){ a = rnd(200, 999); b = rnd(100, a - 1); if (countExchanges(a, b) === 0 && a - b >= 10) break; }
      else if (lv === 2){ a = rnd(2000, 9999); b = Math.random() < .4 ? rnd(100, 999) : rnd(1000, a - 100); const c = countExchanges(a, b); if (c >= 1 && c <= 2) break; }
      else {
        const th = rnd(2, 9), mid = pick(["00", "0" + rnd(1, 9), rnd(1, 9) + "0"]);
        a = +(th + mid + rnd(0, 5)); b = rnd(1000, a - 100);
        if (countExchanges(a, b) >= 2) break;
      }
    }
    return columnQ(a, "−", b, a - b, subSteps(a, b));
  }
};

/* ---------- Estimate and check ---------- */
const round = (n, to) => Math.round(n / to) * to;
const estimate = {
  id:"as-estimate", name:"Estimate and check", emoji:"🔍",
  desc:"Round the numbers to estimate the answer, so you can spot a mistake. Check an answer with the inverse: + and − undo each other.",
  levels:[
    { name:"Estimate", desc:"Round to the nearest 100, then add or subtract" },
    { name:"Is it right?", desc:"Use an estimate to spot a wrong answer" },
    { name:"Inverse", desc:"Which calculation checks it?   ·   □ − 365 = 1240" }
  ],
  make(lv){
    if (lv === 1){
      const big = Math.random() < .5, to = big ? 1000 : 100, plus = Math.random() < .5;
      let a, b;                                       // keep answers below 10000 and above 0
      if (big){ if (plus){ a = rnd(1100, 5400); b = rnd(1100, 8900 - a); } else { a = rnd(2100, 9400); b = rnd(1100, a - 600); } }
      else    { if (plus){ a = rnd(110, 820);   b = rnd(110, 940 - a);   } else { a = rnd(210, 940);   b = rnd(110, a - 60);   } }
      const ra = round(a, to), rb = round(b, to), e = plus ? ra + rb : ra - rb;
      const op = plus ? "+" : "−";
      return { text:`Estimate ${a} ${op} ${b} by rounding each number to the nearest ${to}.`, answer:e, maxLen:5, key:`${a}${op}${b}`,
        explain:`About <b>${e}</b><span class="why">${a} rounds to ${ra} and ${b} rounds to ${rb}: ${ra} ${op} ${rb} = ${e}</span>`,
        solution:`${a} ${op} ${b} ≈ ${ra} ${op} ${rb} = ${e}` };
    }
    if (lv === 2){
      const plus = Math.random() < .5;
      let a = rnd(1200, 7800), b = rnd(1100, 4800);
      if (plus && a + b > 9999) a = 9999 - b - rnd(0, 500);
      if (!plus && a < b) [a, b] = [b, a];
      const real = plus ? a + b : a - b, ok = Math.random() < .45;
      let shown = real;
      if (!ok){ do { shown = real + pick([-2000, -1000, 1000, 2000, -900, 900, 600, -600]); } while (shown <= 0 || shown > 9999); }
      const op = plus ? "+" : "−", ra = round(a, 100), rb = round(b, 100), e = plus ? ra + rb : ra - rb;
      const answer = ok ? "Looks right ✓" : "It's wrong ✗";
      return { text:`Sam says ${a} ${op} ${b} = ${shown}. Use an estimate: is Sam right?`, input:"choice",
        choices:["Looks right ✓", "It's wrong ✗"], answer, key:`${a}${op}${b}=${shown}`,
        explain:`${answer}<span class="why">Estimate: ${ra} ${op} ${rb} = ${e}. ${ok ? `${shown} is close to ${e}.` : `${shown} is too far from ${e}. The real answer is ${real}.`}</span>`,
        solution:`${a} ${op} ${b} = ${real}${ok ? "" : ` (not ${shown})`}` };
    }
    const a = rnd(1200, 8000), b = rnd(150, Math.min(4000, 9999 - a)), c = a + b;
    if (Math.random() < .5){
      // which calculation checks it?
      const sub = Math.random() < .5;
      const fact = sub ? `${c} − ${b} = ${a}` : `${a} + ${b} = ${c}`;
      const right = sub ? `${a} + ${b}` : `${c} − ${b}`;
      const wrong = sub ? [`${c} + ${b}`, `${a} − ${b}`, `${c} + ${a}`] : [`${c} + ${b}`, `${a} − ${b}`, `${a} + ${c}`];
      return { text:`Which calculation checks that ${fact}?`, input:"choice", choices:shuffle([right, ...wrong]), answer:right, key:`chk${fact}`,
        explain:`<b>${right}</b><span class="why">${sub ? `Adding undoes subtracting: ${a} + ${b} should make ${c}.` : `Subtracting undoes adding: ${c} − ${b} should give back ${a}.`}</span>`,
        solution:`${fact} is checked by ${right}` };
    }
    // missing number, solved with the inverse
    const form = rnd(1, 3);
    if (form === 1) return { text:`□ − ${b} = ${a}`, answer:c, maxLen:5, key:`?-${b}=${a}`,
      explain:`□ = <b>${c}</b><span class="why">Use the inverse: ${a} + ${b} = ${c}</span>`, solution:`${c} − ${b} = ${a}` };
    if (form === 2) return { text:`□ + ${b} = ${c}`, answer:a, maxLen:5, key:`?+${b}=${c}`,
      explain:`□ = <b>${a}</b><span class="why">Use the inverse: ${c} − ${b} = ${a}</span>`, solution:`${a} + ${b} = ${c}` };
    return { text:`${c} − □ = ${a}`, answer:b, maxLen:5, key:`${c}-?=${a}`,
      explain:`□ = <b>${b}</b><span class="why">The missing number is the difference: ${c} − ${a} = ${b}</span>`, solution:`${c} − ${b} = ${a}` };
  }
};

/* ---------- Word problems ---------- */
const NAMES = ["Amir", "Bella", "Chen", "Dev", "Ella", "Femi", "Grace", "Hugo", "Isla", "Jack", "Kemi", "Leo", "Maya", "Noah", "Priya", "Zara"];
const THINGS = ["stickers", "marbles", "football cards", "beads", "stamps", "shells"];
const steps = list => list.map((s, i) => list.length > 1 ? `Step ${i + 1}: ${s}` : s).join("<br>");
// one-step problems: [text, answer, working]
const ONE = [
  (a, b) => { const t = pick(THINGS); return [`One box has ${a} ${t} and another has ${b}. How many ${t} are there altogether?`, a + b, [`${a} + ${b} = ${a + b}`]]; },
  (a, b) => { const n = pick(NAMES), t = pick(THINGS); [a, b] = [Math.max(a, b), Math.min(a, b)];
    return [`${n} had ${a} ${t} and gave ${b} away. How many ${t} does ${n} have left?`, a - b, [`${a} − ${b} = ${a - b}`]]; },
  (a, b) => { [a, b] = [Math.max(a, b), Math.min(a, b)];
    return [`A red train carries ${a} people and a blue train carries ${b}. How many more people are on the red train?`, a - b, [`Find the difference: ${a} − ${b} = ${a - b}`]]; },
  (a, b) => { const n = pick(NAMES); [a, b] = [Math.max(a, b), Math.min(a, b)];
    return [`${n} needs ${a} points to win a prize and has ${b} points so far. How many more points does ${n} need?`, a - b, [`${a} − ${b} = ${a - b}`]]; },
  (a, b) => [`On Saturday ${a} people went to the museum. On Sunday ${b} people went. How many people went over the weekend?`, a + b, [`${a} + ${b} = ${a + b}`]]
];
// two-step problems: (size) → [text, answer, working] or null if the numbers don't work
const TWO = [
  R => { const a = R(3), b = R(1), c = R(1); if (b + c >= a) return null; const t = pick(["apples", "pencils", "comics", "tins of beans"]);
    return [`A shop had ${a} ${t}. It sold ${b} on Monday and ${c} on Tuesday. How many ${t} are left?`, a - b - c, [`${a} − ${b} = ${a - b}`, `${a - b} − ${c} = ${a - b - c}`]]; },
  R => { const n = pick(NAMES), t = pick(THINGS), a = R(2), b = R(1), c = R(1); if (c >= a + b) return null;
    return [`${n} has ${a} ${t}, buys ${b} more, then gives ${c} to a friend. How many ${t} does ${n} have now?`, a + b - c, [`${a} + ${b} = ${a + b}`, `${a + b} − ${c} = ${a + b - c}`]]; },
  R => { const a = R(2), b = R(1), c = R(1); if (b >= a) return null;
    return [`There are ${a} people on a train. At the first stop ${b} people get off and ${c} get on. How many people are on the train now?`, a - b + c, [`${a} − ${b} = ${a - b}`, `${a - b} + ${c} = ${a - b + c}`]]; },
  R => { const a = R(3), b = R(1); if (a - b <= b) return null;
    return [`A library has ${a} books. ${b} are story books and the rest are information books. How many more information books than story books are there?`, a - 2 * b, [`Information books: ${a} − ${b} = ${a - b}`, `${a - b} − ${b} = ${a - 2 * b}`]]; },
  R => { const c = R(3), a = R(1), b = R(1); if (a + b >= c) return null;
    return [`A theatre has ${c} seats. ${a} adult tickets and ${b} child tickets were sold. How many seats are empty?`, c - a - b, [`Tickets sold: ${a} + ${b} = ${a + b}`, `${c} − ${a + b} = ${c - a - b}`]]; },
  R => { const a = R(1), b = R(1), c = R(3); if (a + b >= c) return null;
    return [`Class 4A collected ${a} cans and Class 4B collected ${b} cans. Their target is ${c} cans. How many more cans do they need?`, c - a - b, [`Together: ${a} + ${b} = ${a + b}`, `${c} − ${a + b} = ${c - a - b}`]]; },
  R => { const a = R(2), b = R(2), c = R(1); if (c >= a + b) return null;
    return [`A school raised £${a} at the summer fair and £${b} at the winter fair. It spent £${c} on new books. How much money is left?`, a + b - c, [`Raised: ${a} + ${b} = ${a + b}`, `${a + b} − ${c} = ${a + b - c}`]]; }
];
const word = {
  id:"as-word", name:"Word problems", emoji:"📖",
  desc:"Read carefully and decide: add or subtract? Two-step problems need two calculations. Work them out on paper, then type the answer.",
  levels:[
    { name:"One step", desc:"Add or subtract? 3-digit numbers" },
    { name:"Two steps", desc:"Two calculations, 3-digit numbers" },
    { name:"Two steps, bigger numbers", desc:"Two calculations, up to 4-digit numbers" }
  ],
  make(lv){
    let r = null;
    if (lv === 1){ let a, b; do { a = rnd(120, 899); b = rnd(110, 899); } while (Math.abs(a - b) < 20); r = pick(ONE)(a, b); }
    else {
      // size 1 = smaller part, 2 = medium, 3 = the big total
      const R = lv === 2 ? (s => s === 3 ? rnd(500, 999) : s === 2 ? rnd(200, 600) : rnd(40, 300))
                         : (s => s === 3 ? rnd(4000, 9500) : s === 2 ? rnd(1500, 4500) : rnd(300, 2500));
      while (!r) r = pick(TWO)(R);
    }
    const [text, answer, work] = r;
    return { text, answer, maxLen:5, long:true, key:text,
      explain:`The answer is <b>${answer}</b><span class="why">${steps(work)}</span>`, solution:`${work.join(", then ")} → ${answer}` };
  }
};

Y4.TOPICS.push({ id:"add-subtract", title:"Addition & Subtraction", emoji:"➕",
  skills:[colAdd, colSub, estimate, word] });
})();
