# 🎒 Year 4 Maths

Maths games for a Year 4 child (age 8–9), covering the [Year 4 curriculum](year4_maths_curriculum.md),
including practice for the **Multiplication Tables Check (MTC)**.
Every exercise is generated, so it never runs out, and the app remembers what the child finds hard.
See [ROADMAP.md](ROADMAP.md) for what is built and what comes next.

| Topic | Address | Status |
|---|---|---|
| ✖️ Times Tables | `times-tables/` | ✅ Built |
| ➗ Multiplication & Division | `multiply-divide/` | ✅ Built |
| 🔢 Number & Place Value | `number/` | ✅ Built |
| ➕ Addition & Subtraction | `add-subtract/` | ✅ Built |
| 🍕 Fractions & Decimals | `fractions/` | ✅ Built |
| 📏 Measurement | `measurement/` | ✅ Built |
| 🔷 Shapes & Position | `shapes/` | ✅ Built |
| 📊 Statistics | `statistics/` | ✅ Built |

---

## How to start it on the home network

### 1. Start it on this computer
Open a terminal and run:

```bash
cd ~/math
python3 -m http.server 8000
```

Leave this terminal window open while the child is playing. Closing it, or pressing `Ctrl + C`, stops the game.

> You need to do this again every time the computer is restarted.

### 2. Open it on the tablet
1. Make sure the tablet is on the **same Wi-Fi** as this computer.
2. Open the browser and go to:

   **http://192.168.1.206:8000**

3. Optional: use the browser menu and choose **"Add to Home screen"** so it opens like an app.

### If the tablet says "site can't be reached"
- **Check the game is running:** the terminal from step 1 must still be open.
- **Check the address:** it must start with `http://`, not `https://`.
- **Check the Wi-Fi:** the tablet and the computer must be on the same network.
- **Check the firewall:** port 8000 must be allowed. This only needs doing once:
  ```bash
  sudo ufw allow from 192.168.1.0/24 to any port 8000 proto tcp
  ```
- **Check the computer's address:** it may have changed. To see it, run:
  ```bash
  hostname -I
  ```
  Use the first number shown, for example `http://192.168.1.XXX:8000`.

---

## Put it online with GitHub Pages (works offline, no computer needed)

The whole `math` folder is the website. Publish everything in it, keeping the folders
(`shared/`, `times-tables/`, `multiply-divide/` …) exactly as they are.

1. Create a free account at **github.com** if you don't have one.
2. Create a **new public repository** (for example `math`).
3. Upload the contents of the `math` folder, either with `git push`, or with **Add file → Upload files**,
   dragging in the files **and folders**. Then click **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, then the main branch
   and folder **/ (root)**, and click **Save**.
5. Wait 1–2 minutes. The app is then at:
   **`https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`**
6. On the Samsung tablet, open that link in **Chrome** and tap **⋮ → Add to Home screen** (or **Install app**).

After the first visit, the tablet keeps its own copy of the app, so it works **with no Wi-Fi and without this computer**.

**Updating the app later:** push or upload the changed files again. Whenever the tablet is online it loads the
newest version straight away; offline, it uses its saved copy.

**Is it private?** On a free account, the website is public, but nobody finds it unless you share the link.
It contains nothing personal: the child's progress stays on the tablet and is never uploaded.
If you want it locked so only you can open it, Cloudflare Pages with Cloudflare Access does that for free.

---

## Backing up progress

Progress is saved on the tablet, separately for each website address. Opening the app from a new address,
such as GitHub instead of `192.168.1.206`, starts from zero. All topics on the same address share their progress.

**To move progress across**, use the **💾 Backup** box at the bottom of the main page:
1. In the **old** version, tap **⬇️ Save backup**. A file called `year4-maths-backup-DATE.json` goes into the tablet's **Downloads**.
2. In the **new** version, tap **⬆️ Restore from backup** and choose that file.

Older `times-tables-backup-DATE.json` files can be restored in the same way.
Saving a backup now and then is also a good idea in case the browser's data gets cleared.

---

## The main page
- **Topic tiles:** one for each part of the curriculum, showing the stars earned so far.
- **🔊 button:** turns sound on or off for every topic.
- **💾 Backup:** saves all progress to a file, or restores it from one.
- **Reset ALL progress:** clears every topic and starts again.

---

## ➗ Multiplication & Division

One tab for each skill. Every skill has **3 levels** of 10 questions, with no timer.
Get **8 out of 10** right to unlock the next level, and pass level 3 to earn a ⭐ for the skill.
A wrong answer shows the working and waits for **Next ▶**. A similar question comes back later in the round
(second tries don't count towards the score).

| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| ➗ Division facts | ÷ 2, 3, 4, 5, 10 | ÷ any number to 12 | Missing numbers: □ ÷ 6 = 8 |
| 🎲 × 0, × 1 and 3 numbers | 23 × 0, 37 ÷ 1, 12 ÷ 12 | 2 × 3 × 4 | 7 × 5 × 2 (pick the easy pair first) |
| 🧩 Factor pairs | 6 × □ = 24 | Is 7 a factor of 42? | How many factor pairs does 36 have? |
| 📝 Written multiplication | 32 × 3 (no carrying) | 47 × 6 | 347 × 6 (answer typed into the sum, ones first) |
| 🍰 Sharing problems | 1 pizza between 4 → ¼ | 3 cakes between 10 → 3/10, with pictures | Word problems, working backwards |

**Column sums** (written multiplication, column addition and subtraction): the answer is typed under the line,
**ones first**, just like on paper. Each digit fills the next column to the left.

**Fraction answers:** type the top number, then tap **Bottom number ⬇** (or Enter) and type the bottom number.
Equal fractions count as right, so 2/4 is accepted for 1/2.

## 🔢 Number & Place Value

Works the same way as Multiplication & Division: one tab for each skill, 3 levels, a ⭐ for each skill.

| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| 🦘 Counting in steps | 6, 12, □, 24 (6s, 7s, 9s) | 25s and 1000s, forwards and back | Any step, either way |
| ⬆️ 1000 more or less | 100 more than 452 | 1000 less than 6371 | 100 more than 3950; working backwards |
| 🌡️ Negative numbers | Count back past 0 on a number line | 6, 3, 0, −3, □ | Temperatures: colder, warmer, difference |
| 🏠 Place value | Value of the 7 in 3742 | 3742 = 3000 + □ + 40 + 2 | 4 thousands and 7 tens; jumbled parts |
| ⚖️ Compare and order | Which is bigger? | 4352 ◯ 4325 (<, > or =) | Smallest or largest of four |
| 🎯 Rounding | Nearest 10 | Nearest 100 | Nearest 1000 |
| 🏛️ Roman numerals | Read I to XX | Read up to C | Pick the right one for a number |

**Negative answers:** type the number, then tap **Make it negative −**.
Wrong answers show the working with a number line or a place value chart.

## ➕ Addition & Subtraction

| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| ➕ Column addition | 352 + 427 (up to one carry) | 2486 + 1357 | 3678 + 4859 (lots of carrying) |
| ➖ Column subtraction | 684 − 352 (no exchanging) | 5263 − 1847 | 4003 − 1567 (zeros in the way) |
| 🔍 Estimate and check | Round to the nearest 100 or 1000, then add or subtract | "Sam says 6008 + 3603 = 8611. Is Sam right?" | Which calculation checks it? · □ − 365 = 1240 |
| 📖 Word problems | One step: add or subtract? | Two steps, 3-digit numbers | Two steps, 4-digit numbers |

A wrong column sum shows the working column by column, with every carry and exchange.

## 🍕 Fractions & Decimals

| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| 🍕 Equivalent fractions | ½ = □/8, with fraction bars | 2/3 = □/12 · 6/9 = 2/□ | Which is equal to ¾? · Simplify 8/12 |
| ➕ Add and subtract fractions | 1/5 + 2/5, with bars | 7/9 − 4/9 | 1 − 3/8 · three fractions · missing number |
| 🍬 Fraction of an amount | ⅓ of 24 | ¾ of 20 | Word problems, and "¼ of a number is 6" |
| 🔟 Tenths and hundredths | 3/10 = 0.3 | 47/100 = 0.47 (hundred square) · ¼ ½ ¾ | Counting in tenths and hundredths · how many hundredths in 0.6? |
| ➗ ÷ 10 and ÷ 100 | 35 ÷ 10 = 3.5 | 35 ÷ 100 = 0.35 | □ ÷ 10 = 4.6 · 63 ÷ □ = 0.63 |
| ⚖️ Round and compare decimals | Round 3.7 to a whole number | 0.4 ◯ 0.38 | Largest or smallest of four |
| 💷 Money and measures | £3.45 = □p · £2.35 + £1.40 | Change from £5, £10 or £20 | Two-step change, ribbon lengths, weights |

**Decimal answers:** tap **Decimal point .** to type the point. 3.2 and 3.20 both count.
Money answers show **£** in the answer box, so only the number is typed.

## 📏 Measurement

| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| 📏 Converting units | 3 m = □ cm · 4000 g = □ kg | 2 m 35 cm = □ cm · 2 hours 15 minutes = □ minutes | 1.5 km = □ m · 350 cm = □ m · which is longer? |
| 📐 Perimeter | Rectangles on squared paper | L, T and step shapes on squared paper | Labelled rectangles and L shapes · find a missing side |
| ⬛ Area | Rectangles on squared paper | L, T and step shapes on squared paper | Labelled rectangles and L shapes |
| 🕒 Telling the time | Read a clock (to 5 minutes) | To the minute · 3:45 pm = 15:45 · 18:20 = 6:20 pm | When does it end? · minutes between · 25 minutes later |
| 💰 Money | Count coins and notes | Add up prices from a price list | 4 tickets at £3.25 · how many pens for £2? · share equally |

**Time answers:** type the hours, tap **Colon :**, then type the minutes (or just type 745 for 7:45).
When reading a clock, both 7:45 and 19:45 count.

## 🔷 Shapes & Position

| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| 🔷 Triangles and quadrilaterals | Equilateral, isosceles or scalene? | Square, rectangle, rhombus, parallelogram, trapezium or kite? | Properties: "exactly one pair of parallel sides?" · "is every square a rectangle?" |
| 📐 Angles | Acute, right or obtuse? | Biggest or smallest of three · put in order | Clock hands · right angles inside a shape · turns |
| 🦋 Symmetry | Is the dashed line a mirror line? | How many lines of symmetry? | Tap squares to complete a symmetrical shape |
| 📍 Coordinates | Read a point (across first, then up) | Tap a point on the grid | Move a point · describe a move · the 4th corner of a rectangle |

**Tapping answers:** some questions are answered by tapping the picture: a point on the grid, or squares to colour
(tap again to clear a square, then press **Check ✓**). Afterwards, green shows the right answer and red shows a mistake.

## 📊 Statistics

All the charts and tables are made up at random, so there's always new data to read.

| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| 📊 Bar charts | Read bars (scales in 1s and 2s) · tap the most popular | Scales in 2s, 5s and 10s (halfway readings) · how many more? | How many altogether? · "X or Y" · two-step questions |
| 🍎 Pictograms | Each picture = 2, with half pictures | Each picture = 4 or 10 · how many more? | Totals · how many pictures would show 40? |
| 📋 Tally charts and tables | Count tally marks | Tables: how many more? altogether? most popular? | Two-way tables: boys and girls |
| 📈 Time graphs | Read a value at a time | How much did it rise? · when was it highest? | When did it rise the most? · when was it 15°C? |

---

## ✖️ Times Tables

The Times Tables page works as before. Its modes:

### 📚 Learn a Table
Pick one times table (2 to 12) and work through 4 levels. Each level is 12 questions:

| Level | What happens | To pass |
|---|---|---|
| 1. Learn | In order (1 × 7, 2 × 7 …), no timer | 11 or more right |
| 2. Mix it up | Mixed order, 12 seconds each | 11 or more right |
| 3. Faster | Mixed order, 9 seconds each | 11 or more right |
| 4. Test speed | Mixed order, **6 seconds** (real check speed) | **12 out of 12** → earns a ⭐ |

A wrong answer shows the correct one. Passing a level unlocks the next.
**Tip:** learn the tables in this order: 2, 5, 10 → 3, 4, 8 → 6, 9, 11 → 7, 12.

### 🎯 Tricky Facts
20 questions with 6 seconds each. The game remembers every answer and mostly asks the facts the child:
- got wrong,
- answered slowly, or
- hasn't tried yet.

It gives extra focus to the 6, 7, 8, 9 and 12 tables, which most children find hardest.
A missed fact comes back a few questions later so it can be fixed.

### ⏱️ Mock Check
A practice version of the real test, with the same screens in the same order as the official check:
1. **What to expect** page
2. **3 practice questions** (1 × 12, 2 × 2, 10 × 10, the same as the real check; not scored)
3. **Practice completed**, then the **check questions** page
4. **25 questions**: a "Question 1…" screen for 3 seconds, then the question for 6 seconds
5. **Thank you**, then the score

The question screen matches the official one: the keypad has 1 2 3 on the top row, grey buttons, and "Time left" counting down.
There is no feedback until the end.

When time runs out, whatever has been typed counts, as in the real check.
At the end it shows the score out of 25, the facts that were missed and the best score.

### ⚡ Beat the Clock (game)
Get as many right as possible in **60 seconds** and try to beat your record.
A wrong answer shows the correct one for a moment, then play carries on.

### 🔥 Streak (game)
Keep answering until you get one wrong or take longer than 6 seconds.
How long can your streak be?

---

### The Times Tables home screen
- **Stars:** one ⭐ for each table mastered in *Learn a Table*.
- **Progress grid:** every fact from 2×2 to 12×12, coloured by how well it's known:
  - grey: not tried yet
  - red: needs practice
  - yellow: learning
  - green: **mastered** (right 3 times in a row, each within 6 seconds)
- **My records:** the best mock check score, the Beat the Clock record and the longest streak.
- **Mock check scores:** a chart of recent mock checks.
- **Reset times tables progress:** clears the times tables only.

---

## Suggested routine (about 10 minutes a day)
1. **5 minutes:** *Tricky Facts* or the next level in *Learn a Table*.
2. **1–2 rounds:** *Beat the Clock* or *Streak* for fun.
3. **Once or twice a week:** a full *Mock Check* to track progress.

There is no official pass mark for the real check. The aim is a steady **25 / 25** in the mock check before June.

---

## Good to know
- **Progress is saved on the tablet**, in its browser. Using a different device or address, or clearing the browser's data, starts from zero unless you restore a backup.
- **Files:** `index.html` is the main page. Each topic is a folder with its own `index.html`; the topics share the files in `shared/`.
  `sw.js`, `manifest.webmanifest` and the icons add offline and app support. `icon.svg` is the icon's source.
- **On the home network, nothing goes on the internet.** On GitHub Pages, the app is public, but it contains nothing personal.
