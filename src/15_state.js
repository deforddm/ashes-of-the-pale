/* ============ state ============ */
const KEY = 'ashes-of-the-pale-v1';
let S = null;          // saved game state
let B = null;          // live battle
let view = 'title';
let G = {ctx:null, T:32, cv:null, cols:16, rows:12};
let notes = [];
let walking = false;

function newState(name){
  return migrate({v:1, name:name||'Hask', scene:'intro', node:null, bg:null, silver:15, xp:0, lvl:1, card:null,
    inv:{sharper:2, burner:1, cusser:1, salve:2},
    loy:{brisk:0,kettle:0,tuft:0,ohl:0}, f:{}, pos:{x:5,y:8},
    trail:[{x:4,y:8},{x:6,y:8},{x:4,y:9},{x:5,y:9}], log:[], ending:null, battle:null, bopt:null});
}
/* fill in fields added after v1 saves, so old saves keep working */
function migrate(s){
  s.chapter ??= 0; s.area ??= 'pale'; s.squad ??= [...PORDER]; s.kit ??= []; s.picksDue ??= []; s.chapters ??= {};
  s.gear ??= {}; s.picks ??= {}; Object.keys(TPL).forEach(id => { s.gear[id] ??= {}; s.picks[id] ??= []; }); s.squad.forEach(id => { s.loy[id] ??= 0; });
  if (s.ending && !(0 in s.chapters)) s.chapters[0] = s.ending;
  return s;
}
const SQUAD = () => S.squad;
/* a new squadmate. If the squad has already earned its level-3 habits, the recruit picks hers before the next conversation. */
function recruit(id){ if (!TPL[id] || S.squad.includes(id)) return; S.squad.push(id); S.loy[id] ??= 0; S.gear[id] ??= {}; S.picks[id] ??= [];
  if (S.lvl >= 3 && PICKS[3][id] && !S.picks[id].some(k => PICKS[3][id].some(o => o[0] === k)) && !S.picksDue.includes(3)) S.picksDue.push(3);
  note(`${NAME(id)} joins the Fourth.`, 'good'); AUDIO.play('up'); save(); }
const has = (id, k) => (S.picks[id] || []).includes(k);
/* stat with gear and veteran picks folded in */
function statOf(id, stat){ let v = TPL[id].st[stat]; Object.values(S.gear[id] || {}).forEach(g => { const it = ITEMS[g]; if (it && it.stat && it.stat[stat]) v += it.stat[stat]; }); if (has(id,'nerve')) v += 1; return v; }
function gain(id){ const it = ITEMS[id]; if (!it || S.kit.includes(id)) return; S.kit.push(id); note(`Found: ${it.name}.`, 'good'); AUDIO.play('coin');
  // auto-equip into an empty slot on the first squadmate who can wear it
  const who = (it.who || SQUAD()).find(w => SQUAD().includes(w) && !S.gear[w][it.slot]); if (who) S.gear[who][it.slot] = id; }
function equip(who, id){ const it = ITEMS[id]; if (!it) return; SQUAD().forEach(w => { if (S.gear[w][it.slot] === id) delete S.gear[w][it.slot]; }); S.gear[who][it.slot] = id; save(); }
function unequip(who, slot){ delete S.gear[who][slot]; save(); }
const NAME = id => id === 'sgt' ? S.name : TPL[id].name;
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} }
function loadSave(){ try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; } catch(e) { return null; } }
function elog(m){ S.log.unshift(m); S.log = S.log.slice(0, 6); if (view === 'explore') updExplore(); }
function loy(id, n){ S.loy[id] = Math.max(-3, Math.min(3, S.loy[id] + n)); notes.push({t:`${NAME(id)} ${n > 0 ? 'approves' : 'disapproves'}.`, c:n > 0 ? 'good' : 'bad'}); }
function note(t, c=''){ notes.push({t, c}); }
function gainXP(n){
  S.xp += n; const before = S.lvl; let l = 1; while (l < LEVELS.length && S.xp >= LEVELS[l]) l++; S.lvl = l;
  if (S.lvl > before) { AUDIO.play('up'); for (let k = before + 1; k <= S.lvl; k++) if ([3,5,7].includes(k)) S.picksDue.push(k); }
  return S.lvl > before;
}

