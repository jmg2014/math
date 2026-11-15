/* Statistics: section 8 of the curriculum. All the data is made up at random each time. */
(function(){
"use strict";
const { rnd, pick, shuffle } = Y4;
const D = () => Y4.draw;
// say(item): how a question talks about the children in that group, e.g. "have a dog"
const THEMES = [
  { title:"Favourite fruit", items:["Apple", "Banana", "Grapes", "Orange", "Pear", "Mango"], icon:"🍎", days:"Apples eaten each day", say:i => `chose ${i.toLowerCase()}` },
  { title:"Favourite sport", items:["Football", "Swimming", "Tennis", "Netball", "Cricket", "Gym"], icon:"⚽", days:"Footballs sold each day", say:i => `chose ${i.toLowerCase()}` },
  { title:"Pets at home", items:["Dog", "Cat", "Fish", "Rabbit", "Hamster", "Bird"], icon:"🐶", days:"Dogs in the park each day", say:i => `have a ${i.toLowerCase()}` },
  { title:"How we get to school", items:["Walk", "Car", "Bus", "Bike", "Scooter", "Train"], icon:"🚌", days:"Buses past the school each day", say:i => i === "Walk" ? "walk to school" : `come by ${i.toLowerCase()}` },
  { title:"Favourite colour", items:["Red", "Blue", "Green", "Yellow", "Purple", "Pink"], icon:"⭐", days:"Stars won each day", say:i => `chose ${i.toLowerCase()}` }
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
// distinct values, so "the most" and "the least" always have one answer
function distinct(n, gen){ for (;;){ const v = Array.from({ length:n }, gen); if (new Set(v).size === n) return v; } }
const sum = a => a.reduce((x, y) => x + y, 0);
const tapName = g => g;

/* ---------- Bar charts ---------- */
function barQuestion(lv){
  const th = pick(THEMES), n = rnd(4, 5), items = shuffle(th.items.slice()).slice(0, n);
  let step, vals;
  if (lv === 1){ step = pick([1, 2]); vals = distinct(n, () => step * rnd(1, 10)); }
  else { step = pick([2, 5, 10]); const unit = step === 5 ? 5 : step / 2; vals = distinct(n, () => unit * rnd(1, Math.floor(step * 10 / unit))); }
  const max = step * 10, people = "children";
  const pic = tap => D().barChart(items, vals, { step, max, title:th.title, yLabel:`Number of ${people}`, tap });
  const read = (i, why) => ({ text:`How many children ${th.say(items[i])}?`,
    picture:pic(false), answer:vals[i], key:items.join() + vals.join() + "r" + i,
    explain:`<b>${vals[i]}</b><span class="why">${why || `Go to the top of the ${items[i]} bar, then across to the scale.`} Each line on the scale is ${step}.</span>`,
    solution:`${items[i]}: ${vals[i]}` });
  const form = rnd(1, lv === 1 ? 2 : 3);              // level 1: read or tap · level 2: read, tap or how many more
  if (lv < 3 && form === 1) return read(rnd(0, n - 1), lv === 2 ? "If a bar stops between two lines, it's halfway between them." : "");
  if (lv < 3 && form === 2){
    const most = Math.random() < .5, v = most ? Math.max(...vals) : Math.min(...vals), name = items[vals.indexOf(v)];
    return { text:`Tap the ${most ? "most" : "least"} popular choice.`, picture:pic(true), input:"tap", answer:name, tapText:tapName,
      key:items.join() + vals.join() + (most ? "M" : "L"), explain:`<b>${name}</b><span class="why">It has the ${most ? "tallest" : "shortest"} bar: ${v}.</span>`,
      solution:`${most ? "Most" : "Least"} popular: ${name} (${v})` };
  }
  if (lv === 2){
    let a, b; do { a = rnd(0, n - 1); b = rnd(0, n - 1); } while (vals[a] <= vals[b]);
    return { text:`How many more children ${th.say(items[a])} than ${th.say(items[b])}?`, picture:pic(false), answer:vals[a] - vals[b], key:items.join() + vals.join() + a + b,
      explain:`<b>${vals[a] - vals[b]}</b><span class="why">${items[a]} is ${vals[a]} and ${items[b]} is ${vals[b]}: ${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}</span>`,
      solution:`${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}` };
  }
  // level 3: totals and two steps
  const kind = rnd(1, 3);
  if (kind === 1) return { text:`How many ${people} were asked altogether?`, picture:pic(false), answer:sum(vals), key:items.join() + vals.join() + "T",
    explain:`<b>${sum(vals)}</b><span class="why">Add up all the bars: ${vals.join(" + ")} = ${sum(vals)}</span>`, solution:`${vals.join(" + ")} = ${sum(vals)}` };
  let a, b, c; do { [a, b, c] = shuffle([...Array(n).keys()]).slice(0, 3); } while (vals[a] + vals[b] <= vals[c]);
  if (kind === 2) return { text:`How many children ${th.say(items[a])} or ${th.say(items[b])}?`, picture:pic(false), answer:vals[a] + vals[b], key:items.join() + vals.join() + "O" + a + b,
    explain:`<b>${vals[a] + vals[b]}</b><span class="why">${vals[a]} + ${vals[b]} = ${vals[a] + vals[b]}</span>`, solution:`${vals[a]} + ${vals[b]} = ${vals[a] + vals[b]}` };
  const t = vals[a] + vals[b];
  return { text:`How many more children ${th.say(items[a])} or ${th.say(items[b])} than ${th.say(items[c])}?`, picture:pic(false), answer:t - vals[c], key:items.join() + vals.join() + "D" + a + b + c,
    explain:`<b>${t - vals[c]}</b><span class="why">Step 1: ${vals[a]} + ${vals[b]} = ${t}<br>Step 2: ${t} − ${vals[c]} = ${t - vals[c]}</span>`,
    solution:`(${vals[a]} + ${vals[b]}) − ${vals[c]} = ${t - vals[c]}` };
}
const bars = {
  id:"st-bar", name:"Bar charts", emoji:"📊",
  desc:"Read a bar by going from its top straight across to the scale. Check what each line on the scale is worth first!",
  levels:[
    { name:"Read the bars", desc:"Scales in 1s and 2s" },
    { name:"Bigger scales", desc:"Scales in 2s, 5s and 10s · how many more?" },
    { name:"Totals", desc:"How many altogether? · two-step questions" }
  ],
  make:barQuestion
};

/* ---------- Pictograms ---------- */
const pictograms = {
  id:"st-picto", name:"Pictograms", emoji:"🍎",
  desc:"In a pictogram, each picture stands for more than one. Look at the key! Half a picture stands for half as many.",
  levels:[
    { name:"Each picture = 2", desc:"Count the pictures, then double" },
    { name:"Each picture = 4 or 10", desc:"Halves too · how many more?" },
    { name:"Totals and drawing", desc:"How many altogether? · how many pictures would show 14?" }
  ],
  make(lv){
    const th = pick(THEMES), per = lv === 1 ? 2 : pick([4, 10]), half = per / 2;
    const days = Math.random() < .5, labels = days ? DAYS.slice() : shuffle(th.items.slice()).slice(0, 5);
    const vals = distinct(labels.length, () => half * rnd(1, Math.floor(16 * per / half / 2)));
    const title = days ? th.days : th.title;
    const pic = D().pictogram(labels.map((l, i) => [l, vals[i]]), th.icon, per, title);
    const name = l => days ? `on ${({ Mon:"Monday", Tue:"Tuesday", Wed:"Wednesday", Thu:"Thursday", Fri:"Friday" })[l]}` : `for ${l}`;
    const count = v => `${Math.floor(v / per)} whole picture${Math.floor(v / per) === 1 ? "" : "s"}${v % per ? " and a half" : ""}`;
    const read = i => ({ text:`How many does the pictogram show ${name(labels[i])}?`, picture:pic, answer:vals[i], key:labels.join() + vals.join() + i,
      explain:`<b>${vals[i]}</b><span class="why">${count(vals[i])}. Each picture is ${per}${vals[i] % per ? ` and half a picture is ${half}` : ""}: ${Math.floor(vals[i] / per)} × ${per}${vals[i] % per ? ` + ${half}` : ""} = ${vals[i]}</span>`,
      solution:`${labels[i]}: ${vals[i]}` });
    if (lv === 1) return read(rnd(0, labels.length - 1));
    if (lv === 2){
      if (Math.random() < .5) return read(rnd(0, labels.length - 1));
      let a, b; do { a = rnd(0, 4); b = rnd(0, 4); } while (vals[a] <= vals[b]);
      return { text:`How many more ${name(labels[a])} than ${name(labels[b])}?`, picture:pic, answer:vals[a] - vals[b], key:labels.join() + vals.join() + a + b,
        explain:`<b>${vals[a] - vals[b]}</b><span class="why">${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}</span>`, solution:`${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}` };
    }
    const form = rnd(1, 2);
    if (form === 1) return { text:"What is the total for all of them?", picture:pic, answer:sum(vals), key:labels.join() + vals.join() + "T",
      explain:`<b>${sum(vals)}</b><span class="why">${vals.join(" + ")} = ${sum(vals)}</span>`, solution:`Total: ${sum(vals)}` };
    const k = rnd(2, 9), target = k * per;
    return { text:`Each ${th.icon} stands for ${per}. How many ${th.icon} would you draw to show ${target}?`, answer:k, key:`draw${per}x${k}`,
      explain:`<b>${k}</b><span class="why">${target} ÷ ${per} = ${k}</span>`, solution:`${target} ÷ ${per} = ${k} pictures` };
  }
};

/* ---------- Tally charts and tables ---------- */
const tables = {
  id:"st-tables", name:"Tally charts and tables", emoji:"📋",
  desc:"In a tally chart each bundle of 5 is four lines with one across. A table can have more than one column: read along the row and down the column.",
  levels:[
    { name:"Tally charts", desc:"Count the tally marks" },
    { name:"Tables", desc:"How many more? · altogether?" },
    { name:"Two-way tables", desc:"Boys and girls · rows and columns" }
  ],
  make(lv){
    const th = pick(THEMES), items = shuffle(th.items.slice()).slice(0, 4);
    if (lv === 1){
      const vals = distinct(4, () => rnd(3, 19)), i = rnd(0, 3);
      const pic = `<div><div class="ch-title">${th.title}</div>${D().table(["", "Tally"], items.map((it, j) => [it, D().tally(vals[j])]))}</div>`;
      if (Math.random() < .7) return { text:`How many tally marks are there for ${items[i]}?`, picture:pic, answer:vals[i], key:items.join() + vals.join() + i,
        explain:`<b>${vals[i]}</b><span class="why">Count the bundles in 5s, then add the single lines: ${Math.floor(vals[i] / 5)} × 5 + ${vals[i] % 5} = ${vals[i]}</span>`, solution:`${items[i]}: ${vals[i]}` };
      return { text:`Which one has ${vals[i]} tally marks?`, picture:pic, input:"choice", choices:items, answer:items[i], key:items.join() + vals.join() + "w" + i,
        explain:`<b>${items[i]}</b><span class="why">${Math.floor(vals[i] / 5)} bundles of 5 and ${vals[i] % 5} more = ${vals[i]}</span>`, solution:`${items[i]}: ${vals[i]}` };
    }
    if (lv === 2){
      const vals = distinct(4, () => rnd(12, 95)), pic = `<div><div class="ch-title">${th.title}</div>${D().table(["", "Number"], items.map((it, j) => [it, vals[j]]))}</div>`;
      const form = rnd(1, 3);
      if (form === 1){ let a, b; do { a = rnd(0, 3); b = rnd(0, 3); } while (vals[a] <= vals[b]);
        return { text:`How many more for ${items[a]} than for ${items[b]}?`, picture:pic, answer:vals[a] - vals[b], key:items.join() + vals.join() + a + b,
          explain:`<b>${vals[a] - vals[b]}</b><span class="why">${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}</span>`, solution:`${vals[a]} − ${vals[b]} = ${vals[a] - vals[b]}` }; }
      if (form === 2){ const [a, b] = shuffle([0, 1, 2, 3]).slice(0, 2);
        return { text:`How many for ${items[a]} and ${items[b]} altogether?`, picture:pic, answer:vals[a] + vals[b], key:items.join() + vals.join() + "+" + a + b,
          explain:`<b>${vals[a] + vals[b]}</b><span class="why">${vals[a]} + ${vals[b]} = ${vals[a] + vals[b]}</span>`, solution:`${vals[a]} + ${vals[b]} = ${vals[a] + vals[b]}` }; }
      const most = Math.random() < .5, v = most ? Math.max(...vals) : Math.min(...vals), name = items[vals.indexOf(v)];
      return { text:`Which was the ${most ? "most" : "least"} popular?`, picture:pic, input:"choice", choices:items, answer:name, key:items.join() + vals.join() + most,
        explain:`<b>${name}</b><span class="why">It has the ${most ? "biggest" : "smallest"} number: ${v}.</span>`, solution:`${most ? "Most" : "Least"}: ${name} (${v})` };
    }
    const boys = Array.from({ length:4 }, () => rnd(2, 15)), girls = Array.from({ length:4 }, () => rnd(2, 15));
    const pic = `<div><div class="ch-title">${th.title}</div>${D().table(["", "Boys", "Girls"], items.map((it, j) => [it, boys[j], girls[j]]))}</div>`;
    const i = rnd(0, 3), form = rnd(1, 4);
    if (form === 1){ const g = Math.random() < .5, v = g ? girls[i] : boys[i];
      return { text:`How many ${g ? "girls" : "boys"} ${th.say(items[i])}?`, picture:pic, answer:v, key:items.join() + boys.join() + girls.join() + "r" + i + g,
        explain:`<b>${v}</b><span class="why">Find the ${items[i]} row, then go across to the ${g ? "Girls" : "Boys"} column.</span>`, solution:`${g ? "Girls" : "Boys"}, ${items[i]}: ${v}` }; }
    if (form === 2) return { text:`How many children ${th.say(items[i])} altogether?`, picture:pic, answer:boys[i] + girls[i], key:items.join() + boys.join() + girls.join() + "a" + i,
      explain:`<b>${boys[i] + girls[i]}</b><span class="why">Boys + girls in the ${items[i]} row: ${boys[i]} + ${girls[i]} = ${boys[i] + girls[i]}</span>`, solution:`${boys[i]} + ${girls[i]} = ${boys[i] + girls[i]}` };
    if (form === 3 && boys[i] !== girls[i]){ const more = boys[i] > girls[i] ? "boys" : "girls", less = more === "boys" ? "girls" : "boys", d = Math.abs(boys[i] - girls[i]);
      return { text:`How many more ${more} than ${less} ${th.say(items[i])}?`, picture:pic, answer:d, key:items.join() + boys.join() + girls.join() + "m" + i,
        explain:`<b>${d}</b><span class="why">${Math.max(boys[i], girls[i])} − ${Math.min(boys[i], girls[i])} = ${d}</span>`, solution:`${Math.max(boys[i], girls[i])} − ${Math.min(boys[i], girls[i])} = ${d}` }; }
    const g = Math.random() < .5, col = g ? girls : boys;
    return { text:`How many ${g ? "girls" : "boys"} were asked altogether?`, picture:pic, answer:sum(col), key:items.join() + boys.join() + girls.join() + "c" + g,
      explain:`<b>${sum(col)}</b><span class="why">Add up the ${g ? "Girls" : "Boys"} column: ${col.join(" + ")} = ${sum(col)}</span>`, solution:`${col.join(" + ")} = ${sum(col)}` };
  }
};

/* ---------- Time graphs ---------- */
const GRAPHS = [
  { title:"Temperature in the playground", yLabel:"°C", unit:"°C", xs:["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00"], step:2, max:24, halves:true,
    ask:a => `What was the temperature ${a}?`, change:(a, b) => `How much did the temperature rise between ${a} and ${b}?`,
    high:"When was the temperature highest?", most:"Between which two times did the temperature rise the most?",
    when:v => `When was the temperature ${v}°C?`, cmp:(a, b) => `How much warmer was it ${a} than ${b}?` },
  { title:"Height of a sunflower", yLabel:"cm", unit:" cm", xs:["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"], step:10, max:100, grow:true, halves:true,
    ask:a => `How tall was the sunflower ${a}?`, change:(a, b) => `How much did the sunflower grow between ${a} and ${b}?`,
    most:"Between which two weeks did the sunflower grow the most?",
    when:v => `When was the sunflower ${v} cm tall?`, cmp:(a, b) => `How much taller was the sunflower ${a} than ${b}?` },
  { title:"Children in the park", yLabel:"Children", unit:" children", xs:["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"], step:5, max:50,
    ask:a => `How many children were in the park ${a}?`, change:(a, b) => `How many more children were in the park at ${b} than at ${a}?`,
    high:"When were there the most children in the park?", most:"Between which two times did the number of children go up the most?",
    when:v => `When were there ${v} children in the park?`, cmp:(a, b) => `How many more children were in the park ${a} than ${b}?` }
];
function graphData(G, halves){
  const unit = halves && G.halves ? G.step / 2 : G.step, top = G.max / unit;   // the park counts whole children only
  for (;;){
    let ys;
    if (G.grow){ ys = []; let v = unit * rnd(1, 2); for (let i = 0; i < G.xs.length; i++){ ys.push(v); v += unit * rnd(1, 3); } }
    else {                                          // changes gradually, like real temperatures
      ys = []; let v = unit * rnd(2, Math.floor(top / 2));
      for (let i = 0; i < G.xs.length; i++){ ys.push(v); v += unit * rnd(i < G.xs.length / 2 ? -1 : -3, i < G.xs.length / 2 ? 3 : 1); }
    }
    const rises = ys.some((v, i) => i && v > ys[i - 1]);   // "how much did it rise?" needs at least one rise
    if (rises && ys.every(v => v >= unit && v <= G.max) && new Set(ys).size >= ys.length - 1) return ys;
  }
}
const timeGraphs = {
  id:"st-time", name:"Time graphs", emoji:"📈",
  desc:"A time graph shows how something changes over time. Find the time along the bottom, go up to the line, then across to the scale.",
  levels:[
    { name:"Read the graph", desc:"What was the temperature at 11:00?" },
    { name:"Changes", desc:"How much did it rise? · when was it highest?" },
    { name:"Compare times", desc:"When did it rise the most? · when was it 15°C?" }
  ],
  make(lv){
    const G = pick(GRAPHS), ys = graphData(G, lv > 1), xs = G.xs, pic = D().lineGraph(xs, ys, { step:G.step, max:G.max, title:G.title, yLabel:G.yLabel });
    const at = i => G.grow ? `in ${xs[i].replace("Wk", "week")}` : `at ${xs[i]}`;
    if (lv === 1){ const i = rnd(0, xs.length - 1);
      return { text:G.ask(at(i)), picture:pic, answer:ys[i], suffix:G.unit, key:G.title + ys.join() + i,
        explain:`<b>${ys[i]}${G.unit}</b><span class="why">Find ${xs[i]} at the bottom, go up to the point, then across to the scale. Each line is ${G.step}.</span>`, solution:`${xs[i]}: ${ys[i]}${G.unit}` }; }
    if (lv === 2){
      if (Math.random() < .5 && !G.grow){
        const v = Math.max(...ys);
        if (ys.filter(y => y === v).length === 1){ const i = ys.indexOf(v);
          return { text:G.high, picture:pic, input:"choice", choices:shuffle([xs[i], ...shuffle(xs.filter((_, j) => j !== i)).slice(0, 3)]), answer:xs[i], key:G.title + ys.join() + "H",
            explain:`<b>${xs[i]}</b><span class="why">That's the highest point on the line: ${v}${G.unit}.</span>`, solution:`Highest at ${xs[i]} (${v}${G.unit})` }; }
      }
      let a, b; do { a = rnd(0, xs.length - 2); b = rnd(a + 1, xs.length - 1); } while (ys[b] <= ys[a]);
      return { text:G.change(xs[a].replace("Wk", "week"), xs[b].replace("Wk", "week")), picture:pic, answer:ys[b] - ys[a], suffix:G.unit, key:G.title + ys.join() + a + b,
        explain:`<b>${ys[b] - ys[a]}${G.unit}</b><span class="why">${ys[b]} − ${ys[a]} = ${ys[b] - ys[a]}</span>`, solution:`${ys[b]} − ${ys[a]} = ${ys[b] - ys[a]}${G.unit}` };
    }
    const form = rnd(1, 2);
    if (form === 1){
      const ups = ys.slice(1).map((y, i) => y - ys[i]), best = Math.max(...ups);
      if (best > 0 && ups.filter(u => u === best).length === 1){
        const i = ups.indexOf(best), pairs = ys.slice(1).map((_, j) => `${xs[j]} and ${xs[j + 1]}`), right = pairs[i];
        return { text:G.most, picture:pic, input:"choice",
          choices:shuffle([right, ...shuffle(pairs.filter(p => p !== right)).slice(0, 3)]), answer:right, key:G.title + ys.join() + "R",
          explain:`<b>${right}</b><span class="why">That's where the line goes up most steeply: ${ys[i]} to ${ys[i + 1]}, up ${best}.</span>`, solution:`Biggest rise: ${right} (+${best})` };
      }
    }
    const v = ys.filter(y => ys.filter(z => z === y).length === 1);
    if (v.length){
      const val = pick(v), i = ys.indexOf(val);
      return { text:G.when(val), picture:pic, input:"choice",
        choices:shuffle([xs[i], ...shuffle(xs.filter((_, j) => j !== i)).slice(0, 3)]), answer:xs[i], key:G.title + ys.join() + "W" + i,
        explain:`<b>${xs[i]}</b><span class="why">Find ${val} on the scale, go across to the line, then down to the time.</span>`, solution:`${val}${G.unit} at ${xs[i]}` };
    }
    let a, b; do { a = rnd(0, xs.length - 1); b = rnd(0, xs.length - 1); } while (ys[a] <= ys[b]);
    return { text:G.cmp(at(a), at(b)), picture:pic, answer:ys[a] - ys[b], suffix:G.unit, key:G.title + ys.join() + "C" + a + b,
      explain:`<b>${ys[a] - ys[b]}${G.unit}</b><span class="why">${ys[a]} − ${ys[b]} = ${ys[a] - ys[b]}</span>`, solution:`${ys[a]} − ${ys[b]} = ${ys[a] - ys[b]}` };
  }
};

/* ---------- Make a chart: present data by drawing bars and plotting points ---------- */
const makeChart = {
  id:"st-make", name:"Make a chart", emoji:"✏️",
  desc:"Present the data yourself! Tap a column to make its bar reach the right number (tap the top again to make it one smaller). For a time graph, tap to put each point at the right height. Then press Check.",
  levels:[
    { name:"Draw the bars", desc:"Scale in 1s: draw the missing bars from the table" },
    { name:"Bigger scales", desc:"Scales in 2s, 5s and 10s" },
    { name:"Plot a time graph", desc:"Put the missing points on the graph" }
  ],
  make(lv){
    if (lv < 3){
      const th = pick(THEMES), items = shuffle(th.items.slice()).slice(0, 4);
      const step = lv === 1 ? 1 : pick([2, 5, 10]), vals = distinct(4, () => step * rnd(1, 10));
      const todo = shuffle([0, 1, 2, 3]).slice(0, lv === 1 ? 2 : 3);
      const answer = {}; todo.forEach(i => { answer[items[i]] = vals[i] / step; });
      const table = `<div><div class="ch-title">${th.title}</div>${D().table(["", "Number"], items.map((it, j) => [it, vals[j]]))}</div>`;
      const chart = D().makeChart(items, vals.map((v, i) => todo.includes(i) ? null : v), { step, max:step * 10, kind:"bar", yLabel:"Number of children" });
      return { text:`Use the table to draw the missing bars${step > 1 ? ` (each line on the scale is ${step})` : ""}. Then press Check.`, picture:table + chart, input:"bars", answer, unit:step,
        key:items.join() + vals.join() + todo.join(),
        explain:`Like this<span class="why">${todo.map(i => `${items[i]}: ${vals[i]}`).join(" · ")}. Find the number on the scale, then make the bar reach that line.</span>${D().barChart(items, vals, { step, max:step * 10, title:th.title })}`,
        solution:todo.map(i => `${items[i]} = ${vals[i]}`).join(", ") };
    }
    const G = pick(GRAPHS.filter(g => !g.grow)), ys = graphData(G, false), xs = G.xs.slice(0, 6), y6 = ys.slice(0, 6);
    const todo = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3).sort((a, b) => a - b);
    const answer = {}; todo.forEach(i => { answer[xs[i]] = y6[i] / G.step; });
    const table = D().table(["Time", G.yLabel === "°C" ? "°C" : "Children"], xs.map((x, i) => [x, y6[i]]));
    const chart = D().makeChart(xs, y6.map((v, i) => todo.includes(i) ? null : v), { step:G.step, max:G.max, kind:"line", title:G.title, yLabel:G.yLabel });
    return { text:"Use the table to plot the missing points on the time graph. Then press Check.", picture:table + chart, input:"bars", answer, unit:G.step,
      key:G.title + y6.join() + todo.join(),
      explain:`Like this<span class="why">${todo.map(i => `${xs[i]}: ${y6[i]}`).join(" · ")}. Find the time along the bottom, then go up to the right number.</span>${D().lineGraph(xs, y6, { step:G.step, max:G.max, title:G.title, yLabel:G.yLabel })}`,
      solution:todo.map(i => `${xs[i]} = ${y6[i]}`).join(", ") };
  }
};

Y4.TOPICS.push({ id:"statistics", title:"Statistics", emoji:"📊",
  skills:[bars, makeChart, pictograms, tables, timeGraphs] });
})();
