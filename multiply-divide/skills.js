/* Multiplication & division: the parts of section 3 of the curriculum beyond the times tables. */
(function(){
"use strict";
const { rnd, pick, shuffle, frac } = Y4;

/* ---------- Division facts ---------- */
function divFact(t, m){
  return { text:`${t * m} ÷ ${t} =`, answer:m, key:`${t * m}/${t}`,
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
    if (form === 1) return { text:`□ ÷ ${t} = ${m}`, answer:p, key:`?/${t}=${m}`,
      explain:`<b>${p}</b> ÷ ${t} = ${m}<span class="why">The missing number is ${m} × ${t} = ${p}</span>`, solution:`${p} ÷ ${t} = ${m}` };
    if (form === 2) return { text:`${p} ÷ □ = ${m}`, answer:t, key:`${p}/?=${m}`,
      explain:`${p} ÷ <b>${t}</b> = ${m}<span class="why">because ${m} × ${t} = ${p}</span>`, solution:`${p} ÷ ${t} = ${m}` };
    return { text:`${t} × □ = ${p}`, answer:m, key:`${t}x?=${p}`,
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

Y4.TOPICS.push({ id:"multiply-divide", title:"Multiplication & Division", emoji:"➗",
  skills:[divFacts, special, factors, written, sharing] });
})();
