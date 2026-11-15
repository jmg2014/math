/* Question engine shared by every page: play screen, keypads, timer, sound, results.
   Load after progress.js.

   A question is an object:
     text      what is asked (HTML allowed)
     picture   optional HTML/SVG shown above it
     input     "number" (default) | "fraction" | "choice"
     answer    number, {n, d} for fractions, or the right choice text
     choices   list of texts, for input "choice"
     check     optional function(given) → true/false, to accept more than one answer
     maxLen    longest number that can be typed (default 3)
     explain   HTML shown when the answer is wrong
     solution  short text for the "to practise" list on the results screen
*/
(function(){
"use strict";
const Y4 = window.Y4 = window.Y4 || {};
const $ = Y4.$ = s => document.querySelector(s);

/* ---------- helpers ---------- */
Y4.shuffle = arr => { for (let i = arr.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
Y4.pick = arr => arr[Math.floor(Math.random() * arr.length)];
Y4.rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
Y4.weightedPick = function(items, weights, n){
  const it = items.slice(), w = weights.slice(), out = [];
  while (out.length < n && it.length){
    const tot = w.reduce((s,x) => s + x, 0);
    let r = Math.random() * tot, i = 0;
    while (i < w.length - 1 && r >= w[i]){ r -= w[i]; i++; }
    out.push(it[i]); it.splice(i,1); w.splice(i,1);
  }
  return out;
};
Y4.frac = (n, d) => `<span class="frac"><span>${n}</span><span>${d}</span></span>`;
Y4.show = function(id){
  if (id !== "play") document.body.classList.remove("exam", "practice", "loading");
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo(0,0);
};

/* ---------- sound & confetti ---------- */
let actx = null;
function tone(freqs){
  if (!Y4.prog.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime;
    freqs.forEach((f,i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = t0 + i * .1;
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(.25, t + .015);
      g.gain.exponentialRampToValueAtTime(.0001, t + .2);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .22);
    });
  } catch(e){}
}
const goodSound = () => tone([660, 880]);
const badSound  = () => tone([300, 220]);
const winSound  = () => tone([523, 659, 784, 1047]);
function confetti(){
  const box = document.createElement("div"); box.className = "confetti";
  const em = ["⭐","🎉","✨","🌟","🎊"];
  for (let i = 0; i < 40; i++){
    const s = document.createElement("span");
    s.textContent = em[i % em.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDelay = Math.random() * .8 + "s";
    s.style.fontSize = (18 + Math.random() * 22) + "px";
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3600);
}
Y4.sound = { good:goodSound, bad:badSound, win:winSound };
Y4.confetti = confetti;

/* ---------- play & results screens (added to every page) ---------- */
document.body.insertAdjacentHTML("beforeend", `
<section id="play" class="screen">
  <div class="playtop">
    <button id="quitBtn" class="ghost">✕ Stop</button>
    <span id="practiceBadge">practice</span>
    <span id="playTitle"></span>
    <span id="timeLeft">Time left: <b id="timeLeftN"></b></span>
    <span id="progress"></span>
  </div>
  <div class="timer" id="timerWrap"><div id="timerBar"></div></div>
  <p id="loadingMsg"></p>
  <div class="playbody">
    <div class="qside">
      <div id="qpic" class="qpic"></div>
      <div id="qtext" class="q"></div>
      <div id="answer" class="answer"></div>
      <div id="feedback" class="feedback"></div>
      <div id="cont"></div>
    </div>
    <div class="pad" id="pad">
      <button data-k="1">1</button><button data-k="2">2</button><button data-k="3">3</button>
      <button data-k="4">4</button><button data-k="5">5</button><button data-k="6">6</button>
      <button data-k="7">7</button><button data-k="8">8</button><button data-k="9">9</button>
      <button data-k="del" class="del" aria-label="Delete">⌫</button><button data-k="0">0</button><button data-k="ok" class="ok" aria-label="Enter">Enter</button>
      <button data-k="next" id="nextKey" class="wide"></button>
    </div>
    <div class="choices" id="choices"></div>
  </div>
</section>
<section id="results" class="screen">
  <div class="res">
    <h1 id="resTitle"></h1>
    <div id="resScore" class="bigscore"></div>
    <p id="resMsg" style="font-size:1.2rem"></p>
    <div id="resList"></div>
    <div id="resButtons" class="btnrow"></div>
  </div>
</section>`);

Y4.showResults = function(o){
  $("#resTitle").textContent = o.title;
  $("#resScore").textContent = o.score;
  $("#resMsg").textContent = o.msg;
  const seen = new Set();
  const missed = o.missed.filter(r => { const k = r.q.key || r.q.text; if (seen.has(k)) return false; seen.add(k); return true; });
  $("#resList").innerHTML = missed.length
    ? `<h3>${o.missedTitle || "To practise"}</h3><div class="chips">${missed.map(r =>
        `<span class="chip"><b>${r.q.solution}</b><small>${r.givenText === null ? "no answer" : "you said " + r.givenText}</small></span>`).join("")}</div>`
    : "";
  const box = $("#resButtons"); box.innerHTML = "";
  o.buttons.forEach(([label, fn, cls]) => {
    const b = document.createElement("button");
    b.textContent = label; b.className = "btn " + (cls || ""); b.onclick = fn;
    box.appendChild(b);
  });
  Y4.show("results");
  if (o.celebrate){ confetti(); winSound(); }
};

/* ---------- question engine ----------
   startSession(cfg) options:
     title, questions[], gen(prev, i) to make questions without end,
     limit (ms per question), total (ms for the whole round), feedback (show right/wrong),
     exam/practice (Mock Check look), noRecord, requeue + maxQ (wrong ones come back),
     waitOnWrong (wait for "Next" after a wrong answer), stopOnWrong, okDelay, badDelay,
     countdown + intro, onAnswer(q, ok, ms, given), onFinish(results) */
let S = null, sid = 0;
const inputOf = q => (q && q.input) || "number";
function later(fn, ms){ const id = S && S.id; setTimeout(() => { if (S && S.id === id) fn(); }, ms); }
function stopSession(){ if (S){ if (S.raf) cancelAnimationFrame(S.raf); if (S.raf2) cancelAnimationFrame(S.raf2); } S = null; }
function finishSession(){ const s = S; stopSession(); s.onFinish(s.results); }
function updateProgress(){
  let t;
  if (S.total) t = `⏱ ${Math.max(0, Math.ceil((S.end - performance.now()) / 1000))}s · ✓ ${S.right}`;
  else if (S.stopOnWrong) t = `🔥 ${S.right}`;
  else t = `${S.i + 1} / ${S.questions.length}`;
  $("#progress").textContent = t;
}
function begin(){
  if (S.total){                // one clock for the whole round (Beat the Clock)
    S.end = performance.now() + S.total;
    const id = S.id;
    const loop = () => {
      if (!S || S.id !== id) return;
      const rem = S.end - performance.now();
      setBar(Math.max(0, rem / S.total)); updateProgress();
      if (rem > 0) S.raf2 = requestAnimationFrame(loop);
    };
    S.raf2 = requestAnimationFrame(loop);
    later(finishSession, S.total);
  }
  nextQuestion();
}
function setBar(frac){
  const bar = $("#timerBar");
  bar.style.width = (frac * 100) + "%";
  bar.className = frac < .25 ? "low" : frac < .5 ? "mid" : "";
}
function renderAnswer(){
  const el = $("#answer"), q = S.questions[S.i];
  el.classList.remove("wrong");
  if (inputOf(q) === "fraction"){
    el.classList.add("fracbox");
    el.innerHTML = `<span class="frac"><span data-part="n" class="${S.part === "n" ? "on" : ""}">${S.fn || "&nbsp;"}</span><i></i>` +
                   `<span data-part="d" class="${S.part === "d" ? "on" : ""}">${S.fd || "&nbsp;"}</span></span>`;
    $("#nextKey").textContent = S.part === "n" ? "Bottom number ⬇" : "⬆ Top number";
  } else {
    el.classList.remove("fracbox");
    el.textContent = S.answer || " ";
  }
}
function startSession(cfg){
  stopSession();
  S = Object.assign({ i:0, right:0, results:[], answer:"", fn:"", fd:"", part:"n", busy:true, id:++sid }, cfg);
  Y4.show("play");
  document.body.classList.toggle("exam", !!cfg.exam);
  document.body.classList.toggle("practice", !!cfg.practice);
  document.body.classList.remove("loading");
  $("#timeLeftN").textContent = cfg.limit ? cfg.limit / 1000 : "";
  $("#playTitle").textContent = cfg.title;
  $("#timerWrap").style.visibility = (cfg.limit || cfg.total) ? "visible" : "hidden";
  setBar(1);
  $("#feedback").textContent = ""; $("#feedback").className = "feedback";
  $("#cont").innerHTML = ""; $("#qpic").innerHTML = "";
  $("#qtext").classList.remove("long");
  $("#pad").style.display = ""; $("#nextKey").style.display = "none"; $("#choices").style.display = "none";
  if (cfg.countdown){
    $("#progress").textContent = "";
    $("#answer").style.visibility = "hidden";
    let n = 3;
    const tick = () => {
      if (n === 0){ begin(); return; }
      $("#qtext").textContent = n;
      $("#feedback").textContent = cfg.intro || `${cfg.questions.length} questions · ${cfg.limit / 1000} seconds each`;
      n--; later(tick, 1000);
    };
    tick();
  } else begin();
}
function nextQuestion(){
  if (S.gen && S.i >= S.questions.length) S.questions.push(S.gen(S.questions[S.i - 1], S.i));
  if (S.i >= S.questions.length){ finishSession(); return; }
  const q = S.questions[S.i];
  if (S.exam && !S.loaded){    // "Question 5…" screen for 3 seconds, like the official check
    S.busy = true; S.loaded = true;
    document.body.classList.add("loading");
    $("#loadingMsg").textContent = `${S.practice ? "Practice question" : "Question"} ${S.i + 1}…`;
    later(nextQuestion, 3000);
    return;
  }
  S.loaded = false;
  document.body.classList.remove("loading");
  updateProgress();
  const mode = inputOf(q), qt = $("#qtext");
  qt.innerHTML = q.text || "";
  qt.classList.toggle("long", !!(q.long || qt.textContent.length > 16));
  $("#qpic").innerHTML = q.picture || "";
  S.answer = ""; S.fn = ""; S.fd = ""; S.part = "n"; S.choice = undefined;
  const ans = $("#answer");
  ans.style.visibility = "visible";
  ans.style.display = mode === "choice" ? "none" : "";
  $("#pad").style.display = mode === "choice" ? "none" : "";
  $("#nextKey").style.display = mode === "fraction" ? "" : "none";
  const ch = $("#choices");
  ch.style.display = mode === "choice" ? "" : "none";
  ch.innerHTML = mode === "choice" ? q.choices.map((c,i) => `<button class="choice" data-c="${i}">${c}</button>`).join("") : "";
  renderAnswer();
  $("#feedback").textContent = ""; $("#feedback").className = "feedback";
  $("#cont").innerHTML = "";
  S.busy = false;
  S.start = performance.now();
  if (S.limit){
    setBar(1);
    const id = S.id, qi = S.i;
    const live = () => S && S.id === id && S.i === qi && !S.busy;
    const loop = () => {
      if (!live()) return;
      const left = S.limit - (performance.now() - S.start);
      setBar(Math.max(0, left / S.limit));
      $("#timeLeftN").textContent = Math.max(0, Math.ceil(left / 1000));
      S.raf = requestAnimationFrame(loop);
    };
    S.raf = requestAnimationFrame(loop);
    // time's up: whatever is typed counts, like the real check
    setTimeout(() => { if (live()) submit(); }, S.limit);
  }
}
function readGiven(q){
  const m = inputOf(q);
  if (m === "fraction"){
    if (S.fn === "" && S.fd === "") return null;
    return { n: S.fn === "" ? null : +S.fn, d: S.fd === "" ? null : +S.fd };
  }
  if (m === "choice") return S.choice === undefined ? null : S.choice;
  return S.answer === "" ? null : parseInt(S.answer, 10);
}
function givenText(q, g){
  if (g === null) return null;
  if (inputOf(q) === "fraction") return `${g.n === null ? "?" : g.n}/${g.d === null ? "?" : g.d}`;
  return String(g);
}
function isRight(q, g){
  if (g === null) return false;
  if (q.check) return !!q.check(g);
  if (inputOf(q) === "fraction")   // any equal fraction counts (2/4 = 1/2)
    return g.n !== null && !!g.d && g.n * q.answer.d === g.d * q.answer.n;
  return g === q.answer;
}
function submit(){
  if (!S || S.busy) return;
  S.busy = true;
  if (S.raf) cancelAnimationFrame(S.raf);
  const q = S.questions[S.i];
  const ms = performance.now() - S.start;
  const given = readGiven(q);
  const ok = isRight(q, given);
  const timedOut = !!S.limit && ms >= S.limit;
  if (S.onAnswer && !S.noRecord) S.onAnswer(q, ok, ms, given);
  if (ok) S.right++;
  S.results.push({ q, given, givenText:givenText(q, given), ok, ms });

  if (!S.feedback){            // Mock Check: no feedback, 3-second pause like the real thing
    $("#qtext").textContent = "";
    $("#answer").style.visibility = "hidden";
    setBar(1); $("#timeLeftN").textContent = S.limit / 1000;
    S.i++;
    if (S.exam) nextQuestion(); else later(nextQuestion, S.pause || 3000);
    return;
  }
  if (inputOf(q) === "choice"){
    document.querySelectorAll("#choices .choice").forEach(b => {
      const c = q.choices[+b.dataset.c];
      if (c === q.answer) b.classList.add("right");
      else if (c === given) b.classList.add("wrongpick");
    });
  }
  const fb = $("#feedback");
  if (ok){
    fb.textContent = Y4.pick(["✓ Correct!", "✓ Yes!", "✓ Great!", "✓ Spot on!", "✓ Super!"]);
    fb.className = "feedback good"; goodSound();
  } else {
    fb.innerHTML = `${timedOut && given === null ? "⏰ Time's up! " : "✗ "}${q.explain}`;
    fb.className = "feedback bad"; badSound();
    $("#answer").classList.add("wrong");
    if (S.requeue && S.questions.length < S.maxQ){
      S.questions.splice(Math.min(S.questions.length, S.i + 4), 0, Object.assign({}, q, { retry:true }));
    }
  }
  updateProgress();
  if (S.stopOnWrong && !ok){ later(finishSession, 2200); return; }
  if (S.waitOnWrong && !ok){   // give time to read the working, then tap Next
    S.waiting = true;
    $("#cont").innerHTML = `<button class="btn primary" id="contBtn">Next ▶</button>`;
    return;
  }
  S.i++;
  later(nextQuestion, ok ? (S.okDelay || 700) : (S.badDelay || 2200));
}
function proceed(){ S.waiting = false; $("#cont").innerHTML = ""; S.i++; nextQuestion(); }
function press(k){
  if (!S) return;
  if (S.waiting){ if (k === "ok") proceed(); return; }
  if (S.busy) return;
  const q = S.questions[S.i], m = inputOf(q);
  if (m === "choice") return;
  if (m === "fraction"){
    const key = S.part === "n" ? "fn" : "fd";
    if (k === "ok"){
      if (S.fn !== "" && S.fd !== ""){ submit(); return; }
      if (S.fn !== "") S.part = "d";
    }
    else if (k === "del"){ if (S[key] === "" && S.part === "d") S.part = "n"; else S[key] = S[key].slice(0, -1); }
    else if (k === "next") S.part = S.part === "n" ? "d" : "n";
    else if (S[key].length < 2) S[key] += k;
    renderAnswer();
    return;
  }
  if (k === "del") S.answer = S.answer.slice(0, -1);
  else if (k === "ok"){ if (S.answer !== "") submit(); return; }
  else if (k === "next") return;
  else if (S.answer.length < (q.maxLen || 3)) S.answer += k;
  renderAnswer();
}
function choose(i){
  if (!S || S.busy) return;
  const q = S.questions[S.i];
  if (inputOf(q) !== "choice" || i < 0 || i >= q.choices.length) return;
  S.choice = q.choices[i];
  submit();
}
Y4.startSession = startSession;
Y4.stopSession = stopSession;

/* ---------- wiring ---------- */
$("#pad").addEventListener("pointerdown", e => {
  const b = e.target.closest("button[data-k]"); if (!b) return;
  e.preventDefault();
  b.classList.add("down"); setTimeout(() => b.classList.remove("down"), 120);
  press(b.dataset.k);
});
$("#choices").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b) choose(+b.dataset.c); });
$("#answer").addEventListener("pointerdown", e => {
  const p = e.target.closest("[data-part]");
  if (p && S && !S.busy){ S.part = p.dataset.part; renderAnswer(); }
});
$("#cont").addEventListener("click", e => { if (e.target.closest("#contBtn") && S && S.waiting) proceed(); });
document.addEventListener("keydown", e => {
  if (!$("#play").classList.contains("active") || !S) return;
  const q = S.questions[S.i];
  if (!S.busy && inputOf(q) === "choice" && /^[1-9]$/.test(e.key)){ choose(+e.key - 1); return; }
  if (/^[0-9]$/.test(e.key)) press(e.key);
  else if (e.key === "Backspace"){ e.preventDefault(); press("del"); }
  else if (e.key === "Enter"){ e.preventDefault(); press("ok"); }
  else if (e.key === "/" || e.key === "ArrowDown" || e.key === "ArrowUp"){ e.preventDefault(); press("next"); }
});
$("#quitBtn").addEventListener("click", () => { stopSession(); if (Y4.onQuit) Y4.onQuit(); });

/* ---------- offline support (works on https sites such as GitHub Pages) ---------- */
Y4.registerOffline = function(path){
  if ("serviceWorker" in navigator && window.isSecureContext){
    window.addEventListener("load", () => { navigator.serviceWorker.register(path).catch(() => {}); });
  }
};
})();
