/* Multiplication & division: the parts of section 3 of the curriculum beyond the times tables. */
(function(){
"use strict";
const { rnd, pick, shuffle, frac } = Y4;

/* ---------- Division facts ---------- */
function divFact(t, m){
  return { text:`${t * m} ÷ ${t} =`, answer:m, key:`${t * m}/${t}`, div:[t * m, t],   // div: recorded on the ÷ grid
    explain:`${t * m} ÷ ${t} = <b>${m}</b><span class="why">because ${m} × ${t} = ${t * m}</span>`,
    solution:`${t * m} ÷ ${t} = ${m}` };
}
const divFacts = {
  id:"md-div", name:"Division facts", emoji:"➗",
  desc:"Use your times tables backwards: 56 ÷ 7 = 8, because 8 × 7 = 56.",
  levels:[
    { name:"Easy tables", desc:"Dividing by 2, 3, 4, 5 and 10" },
    { name:"All tables", desc:"Dividing by any number up to 12" },
    { name:"Missing numbers", desc:"□ ÷ 6 = 8   ·   42 ÷ □ = 7   ·   9 × □ = 72" }
  ],
  make(lv){
    if (lv === 1) return divFact(pick([2,3,4,5,10]), rnd(1,12));
    const t = rnd(2,12), m = rnd(2,12), p = t * m;
    if (lv === 2) return divFact(t, m);
    const form = rnd(1,3);
    if (form === 1) return { text:`□ ÷ ${t} = ${m}`, answer:p, key:`?/${t}=${m}`, div:[p, t],
      explain:`<b>${p}</b> ÷ ${t} = ${m}<span class="why">The missing number is ${m} × ${t} = ${p}</span>`, solution:`${p} ÷ ${t} = ${m}` };
    if (form === 2) return { text:`${p} ÷ □ = ${m}`, answer:t, key:`${p}/?=${m}`, div:[p, t],
      explain:`${p} ÷ <b>${t}</b> = ${m}<span class="why">because ${m} × ${t} = ${p}</span>`, solution:`${p} ÷ ${t} = ${m}` };
    return { text:`${t} × □ = ${p}`, answer:m, key:`${t}x?=${p}`, div:[p, t],
      explain:`${t} × <b>${m}</b> = ${p}<span class="why">Work out ${p} ÷ ${t} = ${m}</span>`, solution:`${t} × ${m} = ${p}` };
  }
};

/* ---------- × 0, × 1 and three numbers ---------- */
const special = {
  id:"md-special", name:"× 0, × 1 and 3 numbers", emoji:"🎲",
  desc:"Multiplying by 0 and 1, dividing by 1, and multiplying three numbers together.",
  levels:[
    { name:"0 and 1", desc:"23 × 0   ·   1 × 45   ·   37 ÷ 1   ·   12 ÷ 12" },
    { name:"Three numbers", desc:"2 × 3 × 4 (do two of them first)" },
    { name:"Clever order", desc:"7 × 5 × 2: pick the easiest pair first" }
  ],
  make(lv){
    if (lv === 1){
      const n = rnd(2, 99);
      const forms = [
        [`${n} × 0 =`, 0, "Anything × 0 = 0"],
        [`0 × ${n} =`, 0, "0 × anything = 0"],
        [`${n} × 1 =`, n, "Anything × 1 stays the same"],
        [`1 × ${n} =`, n, "1 × anything stays the same"],
        [`${n} ÷ 1 =`, n, "Anything ÷ 1 stays the same"],
        [`${n} ÷ ${n} =`, 1, "A number ÷ itself = 1"],
        [`0 ÷ ${n} =`, 0, "0 shared out is still 0"]
      ];
      const [text, answer, why] = pick(forms);
      return { text, answer, explain:`${text} <b>${answer}</b><span class="why">${why}</span>`, solution:`${text} ${answer}` };
    }
    let a, b, c;
    if (lv === 2){
      do { a = rnd(2,5); b = rnd(2,5); c = rnd(2,6); } while (a * b * c > 72);
    } else {
      const pair = pick([[2,5],[5,2],[4,5],[5,4],[5,6],[2,10],[5,8],[3,10]]);
      c = rnd(3,9);
      [a, b, c] = shuffle([pair[0], pair[1], c]);
    }
    const p = a * b * c, text = `${a} × ${b} × ${c} =`;
    let why = `${a} × ${b} = ${a * b}, then ${a * b} × ${c} = ${p}`;
    if (lv === 3){
      const nums = [a, b, c];
      for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++){
        if ((nums[i] * nums[j]) % 10 === 0){
          const k = 3 - i - j, x = nums[i] * nums[j];
          why = `Do ${nums[i]} × ${nums[j]} = ${x} first, then ${x} × ${nums[k]} = ${p}. Order doesn't matter!`;
        }
      }
    }
    return { text, answer:p, explain:`${text} <b>${p}</b><span class="why">${why}</span>`, solution:`${text} ${p}` };
  }
};

/* ---------- Factor pairs ---------- */
function factorPairs(n){ const out = []; for (let a = 1; a * a <= n; a++) if (n % a === 0) out.push([a, n / a]); return out; }
const listPairs = n => factorPairs(n).map(([a,b]) => `${a} × ${b}`).join(", ");
const factors = {
  id:"md-factors", name:"Factor pairs", emoji:"🧩",
  desc:"Factor pairs are two numbers that multiply to make a number. The factor pairs of 12 are 1 × 12, 2 × 6 and 3 × 4.",
  levels:[
    { name:"Missing factor", desc:"6 × □ = 24" },
    { name:"Is it a factor?", desc:"Is 7 a factor of 42? Yes or no" },
    { name:"Count the pairs", desc:"How many factor pairs does 36 have?" }
  ],
  make(lv){
    if (lv === 1){
      let n, pairs;
      do { n = rnd(12, 72); pairs = factorPairs(n).filter(([a]) => a > 1); } while (!pairs.length);
      let [a, b] = pick(pairs);
      if (Math.random() < .5) [a, b] = [b, a];
      return { text:`${a} × □ = ${n}`, answer:b, key:`${a}x?=${n}`,
        explain:`${a} × <b>${b}</b> = ${n}<span class="why">All the factor pairs of ${n}: ${listPairs(n)}</span>`, solution:`${a} × ${b} = ${n}` };
    }
    if (lv === 2){
      const n = rnd(12, 72), cands = [];
      for (let f = 2; f <= 12; f++) if (f < n) cands.push(f);
      const yesList = cands.filter(f => n % f === 0), noList = cands.filter(f => n % f !== 0);
      const yes = yesList.length && (Math.random() < .5 || !noList.length);
      const f = yes ? pick(yesList) : pick(noList);
      const answer = yes ? "Yes" : "No";
      const why = yes ? `${f} × ${n / f} = ${n}` : `${n} ÷ ${f} = ${Math.floor(n / f)} remainder ${n % f}`;
      return { text:`Is ${f} a factor of ${n}?`, input:"choice", choices:["Yes", "No"], answer, key:`${f}|${n}`,
        explain:`It's <b>${answer}</b><span class="why">${why}</span>`, solution:`${f} is ${yes ? "" : "not "}a factor of ${n}` };
    }
    const n = pick([12,16,18,20,24,28,30,32,36,40,42,44,45,48,50,54,56,60,63,64,72,80,84,90,96,100]);
    const k = factorPairs(n).length;
    return { text:`How many factor pairs does ${n} have?`, answer:k, key:`#${n}`,
      explain:`<b>${k}</b> pairs<span class="why">${listPairs(n)}. Don't forget 1 × ${n}!</span>`, solution:`${n} has ${k} factor pairs` };
  }
};

/* ---------- Written method ---------- */
function partials(a, m){
  const parts = String(a).split("").reverse().map((d, i) => +d * Math.pow(10, i)).filter(x => x > 0).reverse();
  if (parts.length === 1) return `${a} × ${m} = ${a * m}`;
  return parts.map(x => `${x} × ${m} = ${x * m}`).join(", ") + `<br>${parts.map(x => x * m).join(" + ")} = ${a * m}`;
}
const written = {
  id:"md-written", name:"Written multiplication", emoji:"📝",
  desc:"Multiply 2- and 3-digit numbers by a 1-digit number. Type the answer under the line, starting with the ones, just like on paper.",
  levels:[
    { name:"2-digit, no carrying", desc:"Like 32 × 3" },
    { name:"2-digit", desc:"Like 47 × 6" },
    { name:"3-digit", desc:"Like 347 × 6" }
  ],
  make(lv){
    let a, m;
    if (lv === 1){ m = rnd(2,4); const t = rnd(1, Math.floor(9 / m)), o = rnd(0, Math.floor(9 / m)); a = t * 10 + o; if (a < 11) a = 11; }
    else if (lv === 2){ m = rnd(3,9); a = rnd(13, 99); }
    else { m = rnd(3,9); a = rnd(102, 999); }
    const p = a * m;
    return { text:"", picture:Y4.draw.column(a, "×", m, 4), input:"column", answer:p, maxLen:4, key:`${a}x${m}`,
      explain:`${a} × ${m} = <b>${p}</b><span class="why">${partials(a, m)}</span>`, solution:`${a} × ${m} = ${p}` };
  }
};

/* ---------- Sharing problems ("3 cakes shared between 10 children") ---------- */
const THINGS = [
  { one:"cake", many:"cakes", shape:"round" }, { one:"pizza", many:"pizzas", shape:"round" },
  { one:"pie", many:"pies", shape:"round" }, { one:"chocolate bar", many:"chocolate bars", shape:"bar" },
  { one:"ribbon", many:"ribbons", shape:"bar" }, { one:"sandwich", many:"sandwiches", shape:"bar" }
];
const PEOPLE = [["children","child"], ["friends","friend"], ["players","player"], ["cousins","cousin"], ["pupils","pupil"]];
function sameAs(a, n){
  let x = a, y = n; while (y){ [x, y] = [y, x % y]; }
  return x > 1 ? ` (the same as ${frac(a / x, n / x)})` : "";
}
const sharing = {
  id:"md-sharing", name:"Sharing problems", emoji:"🍰",
  desc:`When things are shared equally, each person gets a fraction. 3 cakes shared between 10 children: each child gets ${frac(3,10)} of a cake.`,
  levels:[
    { name:"Share one thing", desc:"1 pizza shared between 4 friends" },
    { name:"Share more things", desc:"3 cakes shared between 10 children" },
    { name:"Word problems", desc:"Work backwards: how many cakes? how many children?" }
  ],
  make(lv){
    const th = pick(THINGS), [pp, p1] = pick(PEOPLE);
    let a, n;
    if (lv === 1){ a = 1; n = rnd(2,10); }
    else { n = rnd(3,10); a = rnd(2, Math.min(6, n - 1)); }
    const things = a === 1 ? `1 ${th.one} is` : `${a} ${th.many} are`;
    const ans = { n:a, d:n };
    const working = a === 1
      ? `Cut the ${th.one} into ${n} equal parts. Each ${p1} gets 1 part.`
      : `Cut each ${th.one} into ${n} equal parts. Each ${p1} gets 1 part from each ${th.one}, so ${a} parts of ${n}.`;
    const solution = `${a} ${a === 1 ? th.one : th.many} ÷ ${n} = ${a}/${n} each`;
    if (lv < 3 || Math.random() < .34){
      return { text:`${things} shared equally between ${n} ${pp}. What fraction of a ${th.one} does each ${p1} get?`,
        picture: lv < 3 ? Y4.draw.shares(a, n, false, th.shape) : "",
        input:"fraction", answer:ans, key:`${th.one}${a}/${n}`,
        explain:`Each ${p1} gets <b>${frac(a, n)}</b>${sameAs(a, n)}<span class="why">${working}</span>${Y4.draw.shares(a, n, true, th.shape)}`,
        solution };
    }
    if (Math.random() < .5){
      return { text:`Some ${th.many} were shared equally between ${n} ${pp}. Each ${p1} got ${frac(a, n)} of a ${th.one}. How many ${th.many} were there?`,
        answer:a, key:`c${a}/${n}`,
        explain:`There were <b>${a}</b><span class="why">${frac(a, n)} each means ${a} ${a === 1 ? th.one : th.many} cut into ${n} parts: ${a} ÷ ${n} = ${a}/${n}</span>`,
        solution };
    }
    return { text:`${things} shared equally. Each ${p1} gets ${frac(a, n)} of a ${th.one}. How many ${pp} are there?`,
      answer:n, key:`p${a}/${n}`,
      explain:`There are <b>${n}</b> ${pp}<span class="why">The bottom number shows how many parts each ${th.one} is cut into, one for each ${p1}: ${a} ÷ ${n} = ${a}/${n}</span>`,
      solution };
  }
};

/* ---------- Mental maths: derived facts and swapping the order ---------- */
const mental = {
  id:"md-mental", name:"Mental maths", emoji:"💡",
  desc:"Use facts you know to work out bigger ones: 6 × 4 = 24, so 60 × 4 = 240 and 240 ÷ 6 = 40. And the order doesn't matter in multiplication: 7 × 8 = 8 × 7.",
  levels:[
    { name:"Swap and × 10, × 100", desc:"7 × 8 = 8 × □ · 6 × 10 · 45 × 100" },
    { name:"Tens", desc:"60 × 4 · 7 × 80 · 240 ÷ 6" },
    { name:"Hundreds, and using a fact", desc:"300 × 7 · 2400 ÷ 6 · 13 × 4 = 52, so 4 × 13 = □" }
  ],
  make(lv){
    const a = rnd(2, 12), b = rnd(2, 12), p = a * b;
    if (lv === 1){
      const form = rnd(1, 3);
      if (form === 1) return { text:`${a} × ${b} = ${b} × □`, answer:a, key:`sw${a}x${b}`,
        explain:`□ = <b>${a}</b><span class="why">Order doesn't matter when you multiply: ${a} × ${b} and ${b} × ${a} are both ${p}.</span>`, solution:`${a} × ${b} = ${b} × ${a}` };
      const n = form === 2 ? rnd(2, 99) : rnd(2, 99), by = form === 2 ? 10 : 100;
      return { text:`${n} × ${by} =`, answer:n * by, maxLen:5, key:`${n}x${by}`,
        explain:`<b>${n * by}</b><span class="why">× ${by}: every digit moves ${by === 10 ? "one place" : "two places"} to the left.</span>`, solution:`${n} × ${by} = ${n * by}` };
    }
    if (lv === 2){
      const form = rnd(1, 3), t = a * 10;
      if (form === 1) return { text:`${t} × ${b} =`, answer:t * b, maxLen:4, key:`${t}x${b}`,
        explain:`<b>${t * b}</b><span class="why">${a} × ${b} = ${p}, so ${t} × ${b} is ten times bigger: ${t * b}</span>`, solution:`${t} × ${b} = ${t * b}` };
      if (form === 2) return { text:`${b} × ${t} =`, answer:t * b, maxLen:4, key:`${b}x${t}`,
        explain:`<b>${t * b}</b><span class="why">${b} × ${a} = ${p}, so ${b} × ${t} = ${t * b}</span>`, solution:`${b} × ${t} = ${t * b}` };
      return { text:`${p * 10} ÷ ${b} =`, answer:a * 10, key:`${p * 10}/${b}`,
        explain:`<b>${a * 10}</b><span class="why">${p} ÷ ${b} = ${a}, so ${p * 10} ÷ ${b} is ten times bigger: ${a * 10}</span>`, solution:`${p * 10} ÷ ${b} = ${a * 10}` };
    }
    const form = rnd(1, 4);
    if (form === 1){ const h = rnd(2, 9) * 100, m = rnd(2, 9);
      return { text:`${h} × ${m} =`, answer:h * m, maxLen:4, key:`${h}x${m}`,
        explain:`<b>${h * m}</b><span class="why">${h / 100} × ${m} = ${h / 100 * m}, so ${h} × ${m} is a hundred times bigger: ${h * m}</span>`, solution:`${h} × ${m} = ${h * m}` }; }
    if (form === 2) return { text:`${p * 100} ÷ ${b} =`, answer:a * 100, maxLen:4, key:`${p * 100}/${b}`,
      explain:`<b>${a * 100}</b><span class="why">${p} ÷ ${b} = ${a}, so ${p * 100} ÷ ${b} = ${a * 100}</span>`, solution:`${p * 100} ÷ ${b} = ${a * 100}` };
    const x = rnd(13, 25), y = rnd(3, 9), q = x * y;
    if (form === 3) return { text:`${x} × ${y} = ${q}. So what is ${y} × ${x}?`, answer:q, key:`use${x}x${y}`,
      explain:`<b>${q}</b><span class="why">Swapping the order doesn't change the answer.</span>`, solution:`${y} × ${x} = ${x} × ${y} = ${q}` };
    return { text:`${x} × ${y} = ${q}. So what is ${q} ÷ ${y}?`, answer:x, key:`inv${x}x${y}`,
      explain:`<b>${x}</b><span class="why">Division undoes multiplication: ${x} × ${y} = ${q}, so ${q} ÷ ${y} = ${x}.</span>`, solution:`${q} ÷ ${y} = ${x}` };
  }
};

/* ---------- Multiply and add: grouping, splitting (distributive law), scaling, how many combinations ---------- */
const PACKS = [["eggs", "boxes", 6], ["pencils", "packs", 10], ["cakes", "trays", 12], ["stickers", "sheets", 8], ["crayons", "tubs", 9], ["biscuits", "packets", 7]];
const problemsMD = {
  id:"md-problems", name:"Multiply and add problems", emoji:"🧩",
  desc:"Some problems need multiplying and adding. You can split a number to multiply it: 39 × 7 = 30 × 7 + 9 × 7. “4 times as many” means multiply by 4. To count combinations, multiply the choices.",
  levels:[
    { name:"Groups and extras", desc:"4 boxes of 6 eggs and 3 loose eggs" },
    { name:"Splitting and scaling", desc:"39 × 7 = 30 × 7 + 9 × 7 · 4 times as tall" },
    { name:"Combinations", desc:"3 tops and 4 skirts: how many outfits?" }
  ],
  make(lv){
    const NAMES = ["Amir", "Bella", "Chen", "Dev", "Ella", "Femi", "Grace", "Hugo", "Isla", "Jack", "Kemi", "Leo", "Maya", "Noah", "Priya", "Zara"];
    if (lv === 1){
      const [thing, group, size] = pick(PACKS), g = rnd(2, 9), extra = rnd(1, size - 1), who = pick(NAMES), tot = g * size + extra;
      return { text:`${thing[0].toUpperCase() + thing.slice(1)} come in ${group} of ${size}. ${who} has ${g} full ${group} and ${extra} more ${thing}. How many ${thing} altogether?`,
        answer:tot, key:`gr${thing}${g}${extra}`,
        explain:`<b>${tot}</b><span class="why">Step 1: ${g} × ${size} = ${g * size}<br>Step 2: ${g * size} + ${extra} = ${tot}</span>`, solution:`${g} × ${size} + ${extra} = ${tot}` };
    }
    if (lv === 2){
      if (Math.random() < .5){
        const t = rnd(2, 9), o = rnd(1, 9), m = rnd(3, 9), n = t * 10 + o, r = n * m;
        return { text:`Split ${n} into ${t * 10} and ${o} to work out ${n} × ${m}.`, answer:r, maxLen:4, key:`sp${n}x${m}`,
          explain:`<b>${r}</b><span class="why">${t * 10} × ${m} = ${t * 10 * m}, and ${o} × ${m} = ${o * m}.<br>${t * 10 * m} + ${o * m} = ${r}</span>`, solution:`${n} × ${m} = ${t * 10 * m} + ${o * m} = ${r}` };
      }
      const k = rnd(2, 6);
      const [unit, make] = pick([
        ["kg", (b, k) => `A puppy weighs ${b} kg. Its mum is ${k} times as heavy. How heavy is its mum?`],
        ["cm", (b, k) => `A toy car is ${b} cm long. A toy bus is ${k} times as long. How long is the toy bus?`],
        ["cm", (b, k) => `A seedling is ${b} cm tall. A month later it is ${k} times as tall. How tall is it now?`],
        ["ml", (b, k) => `A small jug holds ${b} ml. A big jug holds ${k} times as much. How much does the big jug hold?`]]);
      const base = unit === "ml" ? rnd(2, 9) * 50 : rnd(3, 25), r = base * k;
      return { text:make(base, k), answer:r, suffix:` ${unit}`, maxLen:4, key:`sc${unit}${base}x${k}`,
        explain:`<b>${r} ${unit}</b><span class="why">${k} times as much means × ${k}: ${base} × ${k} = ${r}</span>`, solution:`${base} × ${k} = ${r} ${unit}` };
    }
    const [x, y, xs, ys, what] = pick([
      [rnd(2, 6), rnd(2, 6), "tops", "skirts", "outfits"], [rnd(2, 6), rnd(2, 6), "starters", "main courses", "different meals"],
      [rnd(2, 8), rnd(2, 5), "ice cream flavours", "toppings", "different ice creams (one flavour and one topping)"],
      [rnd(2, 6), rnd(2, 6), "hats", "scarves", "different hat-and-scarf pairs"]]);
    if (Math.random() < .3){                         // work backwards
      return { text:`There are ${x * y} ${what}, made from ${x} ${xs} and some ${ys}. How many ${ys} are there?`, answer:y, key:`cb${x}${y}${xs}`,
        explain:`<b>${y}</b><span class="why">${x} × □ = ${x * y}, so □ = ${x * y} ÷ ${x} = ${y}</span>`, solution:`${x} × ${y} = ${x * y} ${what}` };
    }
    return { text:`You can choose one of ${x} ${xs} and one of ${y} ${ys}. How many ${what} are there?`, answer:x * y, key:`cm${x}${y}${xs}`,
      explain:`<b>${x * y}</b><span class="why">Each of the ${x} ${xs} goes with each of the ${y} ${ys}: ${x} × ${y} = ${x * y}</span>`, solution:`${x} × ${y} = ${x * y} ${what}` };
  }
};

Y4.TOPICS.push({ id:"multiply-divide", title:"Multiplication & Division", emoji:"➗",
  skills:[divFacts, special, mental, factors, written, problemsMD, sharing] });
})();
