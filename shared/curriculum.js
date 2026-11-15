/* Every line of year4_maths_curriculum.md, and the skills that practise it.
   "TT" means the Times Tables page. Used by the curriculum map on the main page. */
(function(){
"use strict";
const Y4 = window.Y4 = window.Y4 || {};
Y4.CURRICULUM = [
  { title:"Number and place value", topic:"number", lines:[
    ["Count in multiples of 6, 7, 9, 25 and 1000", ["nu-count"]],
    ["Find 1000 more or less than a number", ["nu-moreless"]],
    ["Count backwards through zero into negative numbers", ["nu-negative"]],
    ["Know the value of each digit in a 4-digit number", ["nu-place"]],
    ["Order and compare numbers beyond 1000", ["nu-compare"]],
    ["Round any number to the nearest 10, 100 or 1000", ["nu-round"]],
    ["Read Roman numerals up to 100 (I to C)", ["nu-roman"]]
  ]},
  { title:"Addition and subtraction", topic:"add-subtract", lines:[
    ["Add and subtract numbers with up to 4 digits using the column method", ["as-add", "as-sub"]],
    ["Estimate answers, and use the inverse operation to check them", ["as-estimate"]],
    ["Solve two-step word problems and choose which operation to use", ["as-word"]]
  ]},
  { title:"Multiplication and division", topic:"multiply-divide", lines:[
    ["⭐ Know all times tables up to 12 × 12, plus the matching division facts", ["TT", "md-div"]],
    ["Multiply and divide mentally, including by 0 and 1, and multiply three numbers together", ["md-special"]],
    ["Use factor pairs, and know that order doesn't matter in multiplication", ["md-factors"]],
    ["Multiply 2-digit and 3-digit numbers by a 1-digit number using the written method", ["md-written"]],
    ["Solve problems such as “3 cakes shared between 10 children”", ["md-sharing"]]
  ]},
  { title:"Fractions and decimals", topic:"fractions", lines:[
    ["Recognise equivalent fractions (e.g. 6/9 = 2/3)", ["fr-equiv"]],
    ["Count up and down in hundredths", ["fr-tenths"]],
    ["Add and subtract fractions with the same denominator", ["fr-addsub"]],
    ["Find fractions of amounts (e.g. ¾ of 20)", ["fr-of"]],
    ["Write tenths and hundredths as decimals; know ¼ = 0.25, ½ = 0.5, ¾ = 0.75", ["fr-tenths"]],
    ["Divide 1- and 2-digit numbers by 10 and 100", ["fr-divide"]],
    ["Round decimals with one decimal place to the nearest whole number", ["fr-compare"]],
    ["Compare decimals with up to 2 decimal places", ["fr-compare"]],
    ["Solve money and measure problems with decimals", ["fr-money"]]
  ]},
  { title:"Measurement", topic:"measurement", lines:[
    ["Convert between units (km ↔ m, hours ↔ minutes, and so on)", ["me-convert"]],
    ["Work out the perimeter of rectangles and similar shapes", ["me-perimeter"]],
    ["Find area by counting squares", ["me-area"]],
    ["Calculate with money (£ and p)", ["me-money"]],
    ["Read and convert time between analogue, digital, 12-hour and 24-hour clocks", ["me-time"]]
  ]},
  { title:"Geometry: shapes", topic:"shapes", lines:[
    ["Sort triangles and quadrilaterals", ["ge-shapes"]],
    ["Identify acute and obtuse angles, and order angles by size", ["ge-angles"]],
    ["Find lines of symmetry and complete symmetric shapes", ["ge-symmetry"]]
  ]},
  { title:"Geometry: position and direction", topic:"shapes", lines:[
    ["Plot coordinates such as (2, 5) on a grid", ["ge-coords"]],
    ["Describe moves on a grid (left/right, up/down)", ["ge-coords"]]
  ]},
  { title:"Statistics", topic:"statistics", lines:[
    ["Read and draw bar charts, pictograms, tables and time graphs", ["st-bar", "st-picto", "st-tables", "st-time"]],
    ["Answer questions such as “how many more?” from a chart", ["st-bar", "st-tables"]]
  ]}
];

/* status of one skill: "new", "learning" or "mastered" */
Y4.skillStatus = function(id){
  if (id === "TT"){
    const t = Y4.prog.timesTables();
    if (!t) return "new";
    let stars = 0; for (let n = 2; n <= 12; n++) if (t.tables && t.tables[n] && t.tables[n].star) stars++;
    if (stars === 11) return "mastered";
    return Object.values(t.facts || {}).some(f => f.seen) ? "learning" : "new";
  }
  const r = Y4.prog.peek(id);
  if (!r || !r.seen) return r && r.star ? "mastered" : "new";
  return r.star ? "mastered" : "learning";
};
/* status of a curriculum line: mastered when all its skills are, learning when any has been tried */
Y4.lineStatus = function(ids){
  const st = ids.map(Y4.skillStatus);
  if (st.every(s => s === "mastered")) return "mastered";
  return st.some(s => s !== "new") ? "learning" : "new";
};
})();
