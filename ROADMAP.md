# Year 4 Maths Trainer – Roadmap

Goal: grow the Times Tables Trainer into one app that covers everything in
[year4_maths_curriculum.md](year4_maths_curriculum.md). Every exercise is **generated**, so it never runs out,
and the app **remembers how the child is doing** and gives them more of what they find hard.

---

## 1. How the app is organised

**One main page with a separate page (URL) for each topic.**

```
math/
├── index.html              ← Main page: topic tiles, overall progress, "Daily mix", backup
├── sw.js                   ← One offline file for the whole app
├── manifest.webmanifest
├── shared/
│   ├── engine.js           ← question loop, timer, keypads, sound, confetti, results screen
│   ├── progress.js         ← saving, mastery tracking, picking the next question, backup
│   ├── draw.js             ← pictures drawn in code: cakes, number lines, clocks, grids, charts
│   ├── topic.js            ← a topic page: skill tabs, levels, stars
│   └── style.css           ← the look, shared by every page
├── times-tables/           ← the times tables game, on the shared files
├── number/                 ← place value, rounding, negatives, Roman numerals
├── add-subtract/
├── multiply-divide/        ← index.html + skills.js (the rest of section 3, including sharing problems)
├── fractions-decimals/
├── measurement/
├── shapes/                 ← shapes, angles, symmetry, coordinates
└── statistics/
```

Each topic page has **tabs** at the top, one for each skill. For example, *Fractions* has Equivalent,
Add & subtract, Fraction of an amount and Decimals.

**Why separate pages instead of one big page?**
- `index.html` is already 830 lines. Putting everything in one file would make it hard to change.
- A topic can be added or fixed without any risk of breaking the times tables.
- Each topic gets its own address, so a link can open it directly (e.g. `.../fractions-decimals/`).
- Progress is still shared. Every page is on the same address, so they all read the same saved data,
  and the main page can show everything together. The current times tables progress carries over.

---

## 2. How every exercise works (the shared engine)

Each skill is one small **generator** that returns a new question each time:

```js
{
  id: "frac-of-amount",
  levels: 3,
  make(level) {                     // returns a new random question
    return {
      text: "¾ of 20 =",
      picture: draw.bar(20, 4, 3),  // optional
      input: "number",              // number | fraction | decimal | money | time | choice | tap
      answer: 15,
      explain: "20 ÷ 4 = 5, then 5 × 3 = 15"   // shown when the answer is wrong
    };
  }
}
```

**Ways to answer:**

| Input | Used for |
|---|---|
| Number keypad, with a "Make it negative −" key when needed (`neg:true`) | most questions, including negative numbers |
| Column sum (`input:"column"` with `Y4.draw.column`): digits typed ones first | written methods |
| Fraction keypad (top / bottom) | sharing problems, equivalent fractions |
| Decimal keypad (`input:"decimal"`, with a decimal point key; `prefix:"£"` or `suffix:" m"` shown around the answer) | decimals, money, measures |
| Time (`input:"time"`): type 7:45 with a colon key; `any12:true` also accepts 19:45 | time |
| Multiple choice (2–4 big buttons) | shape names, angle types, comparing |
| Tap the picture (`input:"tap"` for one place, `input:"cells"` to colour squares then Check) | coordinates, symmetry, chart questions |
| Draw a chart (`input:"bars"` with `Y4.draw.makeChart`): tap a column to set its height, then Check | making bar charts and time graphs |

**How the child improves over time.** This is the same idea that already works in *Tricky Facts*:
- Every skill has **3 levels**, e.g. rounding to 10 → 100 → 1000.
  Get **8 out of 10** to unlock the next level. Passing level 3 earns a ⭐ for that skill (the skill is mastered).
- The app saves the result of every answer for every skill.
- A wrong answer shows the working (`explain`), and a similar question comes back a few questions later.
- **Daily mix** on the main page: 10–15 questions taken from all topics, chosen by
  - skills that are not mastered or were got wrong recently, and
  - mastered skills that haven't been practised for a while, so they aren't forgotten.

---

## 3. Build order

Topics are in order of how much they help and how much the child needs them first. The times tables come
first because most other topics depend on them.

### Phase 0 – Foundation (no new maths yet) ✅
- [x] Move the engine, keypad, sound and styles out of `times-tables/index.html` into `shared/`
- [x] Rebuild Times Tables on the shared files. It must look and work exactly as it does now.
- [x] New main page with topic tiles. Topics that aren't built yet show "Coming soon".
- [x] Keep the existing progress. Back up and restore everything in one file, and accept old backup files.
- [x] One service worker for the whole app, so everything still works offline.

### Phase 1 – Multiplication & division (the rest of section 3) ✅
- [x] Division facts (56 ÷ 7), and missing-number facts (□ ÷ 6 = 8)
- [x] × 0, × 1, and multiplying three numbers (2 × 3 × 5)
- [x] Factor pairs (missing factor, "is it a factor?", counting the pairs)
- [x] Written method: 2- and 3-digit × 1-digit, shown laid out in columns
- [x] **Sharing problems:** "3 cakes shared between 10 children" → 3/10, with the cakes drawn and sliced

### Phase 2 – Number & place value ✅
- [x] Count in 6s, 7s, 9s, 25s and 1000s (fill in the missing number in a sequence)
- [x] 1000 more or less
- [x] Negative numbers on a number line (count back through zero)
- [x] Value of a digit in a 4-digit number
- [x] Compare and order numbers beyond 1000
- [x] Round to the nearest 10, 100 or 1000
- [x] Roman numerals up to 100, both ways

### Phase 3 – Addition & subtraction ✅
- [x] Column addition and subtraction up to 4 digits, entered one column at a time
- [x] Estimate first, then check using the inverse
- [x] Two-step word problems (generated from templates: shop, bus, school trip…)

### Phase 4 – Fractions & decimals ✅
- [x] Equivalent fractions, with pictures
- [x] Count in hundredths
- [x] Add and subtract fractions with the same denominator
- [x] Fraction of an amount (¾ of 20)
- [x] Tenths and hundredths as decimals; ¼ = 0.25, ½ = 0.5, ¾ = 0.75
- [x] Divide by 10 and 100
- [x] Round decimals to the nearest whole number; compare decimals
- [x] Money and measure problems with decimals

### Phase 5 – Measurement ✅
- [x] Converting units (km ↔ m, cm ↔ mm, kg ↔ g, l ↔ ml, h ↔ min, years ↔ months)
- [x] Perimeter of rectangles and L-shapes (drawn on a grid)
- [x] Area by counting squares
- [x] Money: adding up prices, working out change
- [x] Time: read analogue clocks, and convert between 12-hour and 24-hour time

### Phase 6 – Geometry ✅
- [x] Name the triangle or quadrilateral (shapes generated at random)
- [x] Acute, obtuse or right angle, and order angles by size
- [x] Lines of symmetry, and completing a symmetric shape on a grid
- [x] Plot and read coordinates, and describe moves ("3 right, 2 up")

### Phase 7 – Statistics ✅
- [x] Bar charts, pictograms, tables and time graphs, drawn from random data
- [x] "How many more?", "Which is the most?" and "What is the total?" questions

### Phase 8 – Main page extras ✅
- [x] Curriculum map: every line of `year4_maths_curriculum.md`, coloured not started / learning / mastered (`shared/curriculum.js`)
- [x] Daily mix and a daily streak 🔥
- [x] Parent view: time spent, weakest skills, and progress over the weeks

### Phase 9 – Fill the gaps found against the official programme of study ✅
Checked every statutory Year 4 statement on GOV.UK; `year4_maths_curriculum.md` now lists all 42 of them.
- [x] Number lines: read, estimate and place numbers (Number lines skill)
- [x] Number and practical problems (Number problems skill)
- [x] Roman numerals and the history of zero and place value
- [x] Mental maths with derived facts (60 × 4, 2400 ÷ 6) and commutativity
- [x] Multiply-and-add problems: distributive law, scaling, correspondence
- [x] Tenths ÷ 10 make hundredths
- [x] Estimating measures, and measuring with a ruler
- [x] Perimeter in metres as well as centimetres
- [x] Lines of symmetry in different orientations (turned shapes, slanting mirror lines)
- [x] Presenting data: drawing bar charts and plotting time graphs (Make a chart skill, `input:"bars"`)

### Phase 10 – Regular use covers everything ✅
- [x] Counting down as well as up in tenths and hundredths
- [x] The value of each digit in the answer to ÷ 10 and ÷ 100 (ones, tenths, hundredths)
- [x] The daily mix unlocks levels (4 right in a row) and stars (6 right in a row at level 3), so the mix alone
      works through every skill; simulated: every skill met in ~2 months, every ⭐ in ~5–6 months at 85% right

### Ideas for later
- [x] Division facts in the Times Tables progress grid (a ÷ grid next to the × grid)
- [ ] A printable progress report for school

---

## 4. Adding a new topic
1. Make a folder, e.g. `number/`. Copy `multiply-divide/index.html` into it and change the id in `Y4.openTopic("…")`.
2. Write `number/skills.js`: the skills, each with 3 levels and a `make(level)` that returns a question
   (see `multiply-divide/skills.js` and the notes at the top of `shared/engine.js`).
3. On the main page (`index.html`), add `<script src="number/skills.js">` and set `path:"number/"` for that topic.
   Add the new skills to the matching lines in `shared/curriculum.js`, so they show on the curriculum map
   and in the daily mix.
4. Add the new files to `FILES` in `sw.js`, and change the number in `CACHE`.

## 5. Rules for every new skill
1. Questions are generated, never typed in by hand. Words and contexts come from short lists so they vary.
2. Levels 1–3 go from easy to curriculum standard.
3. Every wrong answer shows short working.
4. The skill is listed in the main page's curriculum map.
5. Test it on the tablet: big buttons, works in portrait and landscape, light and dark mode.
6. Update `README.md` and the service worker's file list.
