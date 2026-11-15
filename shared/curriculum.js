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
    ["Identify, show and estimate numbers in different ways (for example on a number line)", ["nu-line"]],
    ["Round any number to the nearest 10, 100 or 1000", ["nu-round"]],
    ["Solve number and practical problems using all of the above", ["nu-problems"]],
    ["Read Roman numerals up to 100 (I to C), and know that number systems changed to include zero and place value", ["nu-roman"]]
  ]},
  { title:"Addition and subtraction", topic:"add-subtract", lines:[
    ["Add and subtract numbers with up to 4 digits using the column method", ["as-add", "as-sub"]],
    ["Estimate answers, and use the inverse operation to check them", ["as-estimate"]],
    ["Solve two-step word problems, deciding which operations and methods to use", ["as-word"]]
  ]},
  { title:"Multiplication and division", topic:"multiply-divide", lines:[
    ["⭐ Know all times tables up to 12 × 12, plus the matching division facts", ["TT", "md-div"]],
    ["Multiply and divide mentally using known and derived facts, including × 0, × 1, ÷ 1 and three numbers", ["md-mental", "md-special"]],
    ["Use factor pairs, and know that order doesn't matter in multiplication", ["md-factors", "md-mental"]],
    ["Multiply 2-digit and 3-digit numbers by a 1-digit number using the written method", ["md-written"]],
    ["Solve multiplying-and-adding problems: splitting numbers, scaling and correspondence (outfits, 3 cakes between 10 children)", ["md-problems", "md-sharing"]]
  ]},
  { title:"Fractions and decimals", topic:"fractions", lines:[
    ["Recognise and show families of equivalent fractions with diagrams", ["fr-equiv"]],
    ["Count in hundredths; hundredths come from dividing by 100, or tenths by 10", ["fr-tenths", "fr-divide"]],
    ["Find fractions of amounts, including non-unit fractions (e.g. ¾ of 20)", ["fr-of"]],
    ["Add and subtract fractions with the same denominator", ["fr-addsub"]],
    ["Write any number of tenths or hundredths as a decimal", ["fr-tenths"]],
    ["Know that ¼ = 0.25, ½ = 0.5 and ¾ = 0.75", ["fr-tenths"]],
    ["Divide 1- and 2-digit numbers by 10 and 100, and say what each digit is worth", ["fr-divide"]],
    ["Round decimals with one decimal place to the nearest whole number", ["fr-compare"]],
    ["Compare decimals with up to 2 decimal places", ["fr-compare"]],
    ["Solve simple money and measure problems with fractions and decimals", ["fr-money", "fr-of"]]
  ]},
  { title:"Measurement", topic:"measurement", lines:[
    ["Convert between units (km ↔ m, hours ↔ minutes, and so on)", ["me-convert"]],
    ["Measure and work out perimeters, in centimetres and metres", ["me-perimeter", "me-estimate"]],
    ["Find area by counting squares", ["me-area"]],
    ["Estimate, compare and calculate measures, including money in pounds and pence", ["me-estimate", "me-money"]],
    ["Read, write and convert time between analogue and digital, 12-hour and 24-hour clocks", ["me-time"]],
    ["Solve problems converting hours, minutes, seconds, years, months, weeks and days", ["me-convert"]]
  ]},
  { title:"Geometry: shapes", topic:"shapes", lines:[
    ["Compare and sort triangles and quadrilaterals by their properties", ["ge-shapes"]],
    ["Identify acute and obtuse angles, and order angles by size", ["ge-angles"]],
    ["Find lines of symmetry in shapes that are turned different ways", ["ge-symmetry"]],
    ["Complete a symmetric shape on a given line of symmetry", ["ge-symmetry"]]
  ]},
  { title:"Geometry: position and direction", topic:"shapes", lines:[
    ["Describe positions on a grid as coordinates, such as (2, 5)", ["ge-coords"]],
    ["Describe moves on a grid (left/right, up/down)", ["ge-coords"]],
    ["Plot points and draw sides to complete a shape", ["ge-coords"]]
  ]},
  { title:"Statistics", topic:"statistics", lines:[
    ["Read and draw bar charts and time graphs, and read pictograms and tables", ["st-bar", "st-make", "st-time", "st-picto", "st-tables"]],
    ["Answer “how many more?”, sum and difference questions from charts and tables", ["st-bar", "st-tables", "st-time"]]
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
