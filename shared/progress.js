/* Saved progress for the whole app (kept in this browser, on this device).
   - "ttt-v1": the Times Tables page (same format as before, so old progress still works)
   - "y4-v1":  every other topic: one record per skill */
(function(){
"use strict";
const Y4 = window.Y4 = window.Y4 || {};
Y4.TOPICS = Y4.TOPICS || [];          // each topic's skills.js adds itself here
const KEY = "y4-v1", TT = "ttt-v1";

function read(k){ try { return JSON.parse(localStorage.getItem(k) || "null"); } catch(e){ return null; } }
function write(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
function blank(){ return { skills:{}, sound:null, days:{}, daily:{ last:null, streak:0, best:0 } }; }
let data = Object.assign(blank(), read(KEY) || {});
if (!data.days) data.days = {};
if (!data.daily) data.daily = blank().daily;
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;   // local date
const today = () => dayKey(new Date());

const P = Y4.prog = {
  save(){ write(KEY, data); },
  get sound(){
    if (typeof data.sound === "boolean") return data.sound;
    const t = read(TT); return !(t && t.sound === false);   // follow the old Times Tables setting
  },
  set sound(v){ data.sound = !!v; P.save(); },

  /* one record per skill: level unlocked (1–3), star when level 3 is passed, and answer history */
  skill(id){
    return data.skills[id] || (data.skills[id] = { level:1, star:false, seen:0, correct:0, streak:0, last:null, lastDate:null });
  },
  peek(id){ return data.skills[id] || null; },
  record(id, ok, ms){
    const s = P.skill(id);
    s.seen++; s.last = ok ? 1 : 0; s.lastDate = today();
    if (ok){ s.correct++; s.streak++; } else s.streak = 0;
    P.logDay(ok, ms);                                  // saves too
  },
  /* answers per day, for the grown-ups' view: { "2026-11-15": { n, ok, ms } } */
  logDay(ok, ms){
    const d = data.days[today()] || (data.days[today()] = { n:0, ok:0, ms:0 });
    d.n++; if (ok) d.ok++; d.ms += Math.min(ms || 0, 60000);     // cap: a question left open doesn't count as an hour
    const keys = Object.keys(data.days).sort();
    while (keys.length > 120) delete data.days[keys.shift()];
    P.save();
  },
  get days(){ return data.days; },
  /* a times tables fact answered outside the Times Tables page (same rules as that page) */
  recordFact(a, b, ok, ms){
    const t = read(TT) || { facts:{}, tables:{}, mock:{ best:null, history:[] }, clock:{ best:0, history:[] }, streak:{ best:0 } };
    const k = a <= b ? a + "x" + b : b + "x" + a;
    const f = t.facts[k] || (t.facts[k] = { seen:0, correct:0, streak:0, last:null, times:[] });
    f.seen++; f.last = ok ? 1 : 0;
    if (ok){ f.correct++; if (ms <= 6000) f.streak++; } else f.streak = 0;
    f.times.push(Math.round(ms)); if (f.times.length > 5) f.times.shift();
    write(TT, t);
    P.logDay(ok, ms);
  },
  /* a division fact, e.g. 56 ÷ 7, for the ÷ grid on the Times Tables page: { "56/7": {seen, correct, streak, last} }.
     Not timed like the check, so up to 10 seconds still counts towards "mastered". (The answer is logged by record().) */
  recordDivFact(dividend, divisor, ok, ms){
    const t = read(TT) || { facts:{}, tables:{}, mock:{ best:null, history:[] }, clock:{ best:0, history:[] }, streak:{ best:0 } };
    const d = t.dfacts || (t.dfacts = {}), k = dividend + "/" + divisor;
    const f = d[k] || (d[k] = { seen:0, correct:0, streak:0, last:null });
    f.seen++; f.last = ok ? 1 : 0;
    if (ok){ f.correct++; if (ms <= 10000) f.streak++; } else f.streak = 0;
    write(TT, t);
  },
  /* the daily mix streak: days in a row with a finished daily mix */
  get daily(){ return data.daily; },
  dailyDone(){
    const d = data.daily, t = today(), y = dayKey(new Date(Date.now() - 864e5));
    if (d.last === t) return false;                   // already done today
    d.streak = d.last === y ? d.streak + 1 : 1;
    d.best = Math.max(d.best || 0, d.streak); d.last = t;
    P.save();
    return true;
  },
  today,
  dayKey,
  topicStars(topic){ return topic.skills.filter(s => { const r = P.peek(s.id); return r && r.star; }).length; },

  /* Times Tables data (read by the main page) */
  timesTables(){ return read(TT); },

  /* one backup file for everything */
  backup(){ return { app:"year4-maths", version:2, savedAt:new Date().toISOString(), timesTables:read(TT), year4:data }; },
  restore(obj){
    if (obj && obj.app === "year4-maths"){
      if (obj.timesTables) write(TT, obj.timesTables);
      if (obj.year4){ data = Object.assign(blank(), obj.year4); if (!data.days) data.days = {}; if (!data.daily) data.daily = blank().daily; P.save(); }
      return;
    }
    const d = obj && obj.data ? obj.data : obj;             // an older Times Tables backup file
    if (!d || typeof d.facts !== "object" || typeof d.tables !== "object") throw new Error("not a backup");
    write(TT, d);
  },
  resetAll(){ data = blank(); P.save(); try { localStorage.removeItem(TT); } catch(e){} }
};
})();
