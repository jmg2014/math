# ✖️ Times Tables Trainer

A times tables game for practising for the **Year 4 Multiplication Tables Check (MTC)**.
The game runs on this computer and is played on a tablet (or any phone or computer) over the home Wi-Fi.

---

## How to start it

### 1. Start the game on this computer
Open a terminal and run:

```bash
cd ~/math/times-tables
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

1. Create a free account at **github.com** if you don't have one.
2. Create a **new public repository** called `times-tables`.
3. Click **Add file → Upload files** and drag in these 5 files. They must sit at the top level, not inside a folder:
   - `index.html`
   - `sw.js`
   - `manifest.webmanifest`
   - `icon-192.png`
   - `icon-512.png`

   Then click **Commit changes**.
4. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, then branch **main** and folder **/ (root)**, and click **Save**.
5. Wait 1–2 minutes. The game is then at:
   **`https://YOUR-USERNAME.github.io/times-tables/`**
6. On the Samsung tablet, open that link in **Chrome** and tap **⋮ → Add to Home screen** (or **Install app**).

After the first visit, the tablet keeps its own copy of the game, so it works **with no Wi-Fi and without this computer**.

**Updating the game later:** upload the changed files to the repository again. The tablet picks up the new version the next time it's opened while online, and shows it the time after that.

---

## Backing up progress

Progress is saved separately for each web address. Opening the game from a new address, such as GitHub instead of `192.168.1.206`, starts from zero.

**To move progress across**, use the **💾 Backup** box at the bottom of the home screen:
1. In the **old** version, tap **⬇️ Save backup**. A file called `times-tables-backup-DATE.json` goes into the tablet's **Downloads**.
2. In the **new** version, tap **⬆️ Restore from backup** and choose that file.

Saving a backup now and then is also a good idea in case the browser's data gets cleared.

---

## The modes

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

## The home screen
- **Stars:** one ⭐ for each table mastered in *Learn a Table*.
- **Progress grid:** every fact from 2×2 to 12×12, coloured by how well it's known:
  - grey: not tried yet
  - red: needs practice
  - yellow: learning
  - green: **mastered** (right 3 times in a row, each within 6 seconds)
- **My records:** the best mock check score, the Beat the Clock record and the longest streak.
- **Mock check scores:** a chart of recent mock checks.
- **🔊 button:** turns sound on or off.
- **💾 Backup:** saves progress to a file, or restores it from one.
- **Reset all progress:** clears everything and starts again.

---

## Suggested routine (about 10 minutes a day)
1. **5 minutes:** *Tricky Facts* or the next level in *Learn a Table*.
2. **1–2 rounds:** *Beat the Clock* or *Streak* for fun.
3. **Once or twice a week:** a full *Mock Check* to track progress.

There is no official pass mark for the real check. The aim is a steady **25 / 25** in the mock check before June.

---

## Good to know
- **Progress is saved on the tablet**, in its browser. Using a different device or address, or clearing the browser's data, starts from zero unless you restore a backup.
- **The game is `index.html`.** `sw.js`, `manifest.webmanifest` and the icons only add offline and app support. `icon.svg` is the icon's source and doesn't need uploading.
- **On the home network, nothing goes on the internet.** If you use GitHub Pages, the game is public, but it contains nothing personal. Progress stays on the tablet.
