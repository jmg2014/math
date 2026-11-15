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
function blank(){ return { skills:{}, sound:null }; }
let data = Object.assign(blank(), read(KEY) || {});
const today = () => new Date().toISOString().slice(0, 10);

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
  record(id, ok){
    const s = P.skill(id);
    s.seen++; s.last = ok ? 1 : 0; s.lastDate = today();
    if (ok){ s.correct++; s.streak++; } else s.streak = 0;
    P.save();
  },
  topicStars(topic){ return topic.skills.filter(s => { const r = P.peek(s.id); return r && r.star; }).length; },

  /* Times Tables data (read by the main page) */
  timesTables(){ return read(TT); },

  /* one backup file for everything */
  backup(){ return { app:"year4-maths", version:2, savedAt:new Date().toISOString(), timesTables:read(TT), year4:data }; },
  restore(obj){
    if (obj && obj.app === "year4-maths"){
      if (obj.timesTables) write(TT, obj.timesTables);
      if (obj.year4){ data = Object.assign(blank(), obj.year4); P.save(); }
      return;
    }
    const d = obj && obj.data ? obj.data : obj;             // an older Times Tables backup file
    if (!d || typeof d.facts !== "object" || typeof d.tables !== "object") throw new Error("not a backup");
    write(TT, d);
  },
  resetAll(){ data = blank(); P.save(); try { localStorage.removeItem(TT); } catch(e){} }
};
})();
