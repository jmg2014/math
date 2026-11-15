/* A topic page: one tab per skill, 3 levels per skill, a ⭐ for passing level 3.
   Each topic folder has a skills.js that adds a topic to Y4.TOPICS:
     { id, title, emoji, skills:[ { id, name, emoji, desc, levels:[{name, desc} ×3], make(level) → question } ] }
   and an index.html that calls Y4.openTopic(id). */
(function(){
"use strict";
const Y4 = window.Y4, $ = Y4.$, P = Y4.prog;
const ROUND = 10, PASS = 8;
let T = null, cur = null;

function tabKey(){ return "y4-tab-" + T.id; }
function remember(){ try { localStorage.setItem(tabKey(), cur.id); } catch(e){} }
function recall(){ try { return localStorage.getItem(tabKey()); } catch(e){ return null; } }

Y4.openTopic = function(id){
  T = Y4.TOPICS.find(t => t.id === id);
  document.title = T.title + " · Year 4 Maths";
  document.body.insertAdjacentHTML("afterbegin", `
<section id="topic" class="screen active">
  <div class="top"><h1>${T.emoji} ${T.title}</h1>
    <div class="topbtns"><button id="soundBtn" class="ghost" aria-label="Sound on or off"></button><a class="ghost" href="../">🏠 Home</a></div></div>
  <div class="tabs" id="tabs"></div>
  <div id="skillPanel" class="panel"></div>
</section>`);
  cur = T.skills.find(s => s.id === recall()) || T.skills[0];
  Y4.onQuit = renderTopic;
  $("#tabs").addEventListener("click", e => {
    const b = e.target.closest("[data-s]"); if (!b) return;
    cur = T.skills.find(s => s.id === b.dataset.s); remember(); renderTopic();
  });
  $("#skillPanel").addEventListener("click", e => {
    const b = e.target.closest("[data-l]"); if (b && !b.disabled) start(cur, +b.dataset.l);
  });
  $("#soundBtn").addEventListener("click", () => { P.sound = !P.sound; renderTopic(); });
  renderTopic();
  Y4.registerOffline("../sw.js");
};

function renderTopic(){
  Y4.stopSession();
  $("#soundBtn").textContent = P.sound ? "🔊" : "🔇";
  $("#tabs").innerHTML = T.skills.map(s => {
    const r = P.peek(s.id);
    return `<button class="tab ${s === cur ? "on" : ""}" data-s="${s.id}">${s.emoji} ${s.name}${r && r.star ? " ⭐" : ""}</button>`;
  }).join("");
  const st = P.skill(cur.id);
  const acc = st.seen ? Math.round(st.correct / st.seen * 100) : 0;
  $("#skillPanel").innerHTML = `<h2>${cur.emoji} ${cur.name} ${st.star ? "⭐" : ""}</h2>
    <p class="muted">${cur.desc}</p>
    <div class="llist">${cur.levels.map((L, i) => {
      const n = i + 1, locked = n > st.level, done = n < st.level || (n === 3 && st.star);
      return `<button class="lbtn" data-l="${n}" ${locked ? "disabled" : ""}><b>${locked ? "🔒" : done ? "✅" : n + "."} ${L.name}</b><small>${L.desc}</small></button>`;
    }).join("")}</div>
    <p class="muted">${st.star ? "⭐ Skill mastered! Play level 3 now and then to keep it fresh."
                               : `Get ${PASS} out of ${ROUND} right to unlock the next level. Pass level 3 to earn a ⭐.`}
       ${st.seen ? `<br>${st.seen} answered so far · ${acc}% right` : ""}</p>`;
  Y4.show("topic");
}

function makeRound(skill, lv){
  const qs = [], seen = new Set();
  for (let g = 0; qs.length < ROUND && g < 300; g++){
    const q = skill.make(lv), k = q.key || q.text;
    if (seen.has(k) && g < 200) continue;          // avoid repeats when possible
    seen.add(k); qs.push(q);
  }
  return qs;
}

function start(skill, lv){
  let questions;
  try { questions = makeRound(skill, lv); }
  catch(e){    // usually old and new files mixed up after an update: say so instead of doing nothing
    $("#skillPanel").insertAdjacentHTML("afterbegin",
      `<p class="feedback bad" style="margin-top:0">Sorry, this page needs updating. Close the app completely and open it again while on Wi-Fi.</p>`);
    return;
  }
  Y4.startSession({ title:`${skill.name} · Level ${lv}`, questions, feedback:true,
    requeue:true, maxQ:ROUND + 4, waitOnWrong:true, okDelay:900,
    onAnswer:(q, ok) => P.record(skill.id, ok),
    onFinish:res => finish(skill, lv, res) });
}

function finish(skill, lv, res){
  const score = res.filter(r => !r.q.retry && r.ok).length;   // second tries don't count towards the score
  const pass = score >= PASS;
  const st = P.skill(skill.id);
  let title, msg, celebrate = false;
  if (pass){
    if (lv < 3){
      const fresh = st.level < lv + 1;
      if (fresh) st.level = lv + 1;
      title = "Level passed! 🎉"; msg = fresh ? `Level ${lv + 1} is unlocked.` : "Well done!";
    } else {
      const first = !st.star; st.star = true; celebrate = true;
      title = `${skill.name} mastered! ⭐`; msg = first ? "You earned a star!" : "Still a star. Brilliant!";
    }
  } else {
    title = "Nearly there!";
    msg = `Get ${PASS} or more right to pass. Look at the ones below, then try again.`;
  }
  P.save();
  const btns = [];
  if (pass && lv < 3) btns.push(["Next level ▶", () => start(skill, lv + 1), "primary"]);
  btns.push([pass ? "Play again" : "Try again", () => start(skill, lv), (pass && lv < 3) ? "" : "primary"]);
  btns.push([`Back to ${T.title}`, renderTopic, ""]);
  btns.push(["Home", () => { location.href = "../"; }, ""]);
  Y4.showResults({ title, score:`${score} / ${ROUND}`, msg, missed:res.filter(r => !r.ok), buttons:btns, celebrate });
}
})();
