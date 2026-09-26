/* ============ state ============ */
const KEY = 'ashes-of-the-pale-v1';
let S = null;          // saved game state
let B = null;          // live battle
let view = 'title';
let G = {ctx:null, T:32, cv:null, cols:16, rows:12};
let notes = [];
let walking = false;

function newState(name){
  name = name || 'Hask'; return migrate({v:1, sid:sidFor(name), name, scene:'intro', node:null, bg:null, silver:15, xp:0, lvl:1, card:null,
    inv:{sharper:2, burner:1, cusser:1, salve:2, smoker:0},
    loy:{brisk:0,kettle:0,tuft:0,ohl:0}, f:{}, pos:{x:5,y:8},
    trail:[{x:4,y:8},{x:6,y:8},{x:4,y:9},{x:5,y:9}], log:[], ending:null, battle:null, bopt:null});
}
/* fill in fields added after v1 saves, so old saves keep working */
function migrate(s){
  s.chapter ??= 0; s.area ??= 'pale'; s.squad ??= [...PORDER]; s.kit ??= []; s.picksDue ??= []; s.chapters ??= {};
  s.gear ??= {}; s.picks ??= {}; Object.keys(TPL).forEach(id => { s.gear[id] ??= {}; s.picks[id] ??= []; }); s.squad.forEach(id => { s.loy[id] ??= 0; });
  if (s.ending && !(0 in s.chapters)) s.chapters[0] = s.ending;
  s.dead ??= {};
  s.inv ??= {}; s.inv.smoker ??= 0; // v3.7.1: smokers. Saves already past Hedge's cellar in Chapter 3 get the two he handed over there.
  if (!s.f.gotSmokers && (s.chapter > 3 || (s.fxd && s.fxd.c3_work_hedge))) { s.inv.smoker += 2; s.f.gotSmokers = 1; }
  // v3.7.3: the Phoenix's door moved off the crossing, up the alley into the Daru District; a save standing in its old doorway steps back into the street
  // v3.7.4: Kettle never fires Chub's cusser (Maud) in an ordinary fight. A save that spent her before the barrow gets her back, so the barrow and Ch'kess still have her.
  if (!s.f.maudBack && (s.chapter || 0) <= 5 && !s.f.c5_cusserUsed && !(s.inv.cusser > 0)) { s.inv.cusser = 1; s.f.maudBack = 1; }
  // v3.7.4: the Worry Gate map was mirrored so the gate is west, the way you walk in from the hills; a save standing there is mirrored with it
  if (s.area === 'worry_gate' && s.pos && !s.f.gateMirrored) { s.pos = {x:15 - s.pos.x, y:s.pos.y}; s.trail = (s.trail || []).map(p => ({x:15 - p.x, y:p.y})); }
  s.f.gateMirrored = 1;
  if (s.area === 'gadrobi_cross' && s.pos && s.pos.x === 5 && s.pos.y === 1) s.pos = {x:5, y:2};
  return s;
}
/* difficulty, per sergeant: Story (gentler foes, easier checks), Soldier (as written), Bridgeburner (harder). Changeable any time. */
const DIFFS = {story:{name:'Story', hp:.75, dmg:.7, atk:-1, dc:-2, blurb:'Softer fights and easier checks. For the story.'},
  soldier:{name:'Soldier', hp:1, dmg:1, atk:0, dc:0, blurb:'The book as written.'},
  bridgeburner:{name:'Bridgeburner', hp:1.25, dmg:1.2, atk:1, dc:1, blurb:'Tougher foes that hit harder, and less forgiving checks.'}};
const DIFF = () => DIFFS[(S && S.diff) || 'soldier'] || DIFFS.soldier;
/* the count, kept on the save: the finale and the Deeds page read it */
function tally(k, n = 1){ if (!S) return; S.stats ??= {}; S.stats[k] = (S.stats[k] || 0) + n; }
const SQUAD = () => S.squad;
/* a squadmate's abilities: the template's, plus Kettle's smokers once she has ever had any */
const kitAb = id => { const ab = [...TPL[id].ab]; if (id === 'kettle' && S && ((S.inv && S.inv.smoker > 0) || (S.f && S.f.gotSmokers))) ab.splice(ab.indexOf('cusser') + 1, 0, 'smoker'); return ab; };
/* a new squadmate. If the squad has already earned its level-3 habits, the recruit picks hers before the next conversation. */
function recruit(id){ if (!TPL[id] || S.squad.includes(id)) return; S.squad.push(id); S.loy[id] ??= 0; S.gear[id] ??= {}; S.picks[id] ??= [];
  if (S.lvl >= 3 && PICKS[3][id] && !S.picks[id].some(k => PICKS[3][id].some(o => o[0] === k)) && !S.picksDue.includes(3)) S.picksDue.push(3);
  note(`${NAME(id)} joins the Fourth.`, 'good'); AUDIO.play('up'); save(); }
function unrecruit(id){ if (!S.squad.includes(id) || id === 'sgt') return; S.squad = S.squad.filter(x => x !== id); S.f[id + 'Gone'] = 1; S.trail = S.trail.slice(0, Math.max(1, S.squad.length - 1)); note(`${NAME(id)} is gone.`, 'bad'); save(); }
/* a squadmate who fell in a mortal fight: gone from the squad for good, remembered in S.dead. The battle writes the note. */
function kill(id){ if (id === 'sgt' || !S.squad.includes(id)) return; S.squad = S.squad.filter(x => x !== id); S.dead ??= {}; S.dead[id] = {ch:S.chapter, where:(B && B.def && B.def.title) || ''}; S.gear[id] = {}; S.trail = S.trail.slice(0, Math.max(1, S.squad.length - 1)); save(); }
/* Ohl's list: the two hundred and eleven, and everyone added since */
const listCount = () => 211 + (S.f.c2_key === 'light' ? 1 : 0) + (S.f.c4_key === 'aside' ? 1 : 0) + Object.keys(S.dead || {}).length + (S.f.listAdds || 0);
const has = (id, k) => (S.picks[id] || []).includes(k);
/* stat with gear and veteran picks folded in */
function statOf(id, stat){ let v = TPL[id].st[stat]; Object.values(S.gear[id] || {}).forEach(g => { const it = ITEMS[g]; if (it && it.stat && it.stat[stat]) v += it.stat[stat]; }); if (has(id,'nerve')) v += 1; return v; }
function gain(id){ const it = ITEMS[id]; if (!it || S.kit.includes(id)) return; S.kit.push(id); note(`Found: ${it.name}.`, 'good'); AUDIO.play('coin');
  // auto-equip into an empty slot on the first squadmate who can wear it
  const who = (it.who || SQUAD()).find(w => SQUAD().includes(w) && !S.gear[w][it.slot]); if (who) S.gear[who][it.slot] = id; }
function equip(who, id){ const it = ITEMS[id]; if (!it) return; SQUAD().forEach(w => { if (S.gear[w][it.slot] === id) delete S.gear[w][it.slot]; }); S.gear[who][it.slot] = id; save(); }
function unequip(who, slot){ delete S.gear[who][slot]; save(); }
const NAME = id => id === 'sgt' ? S.name : TPL[id].name;
/* saves: one slot per sergeant, so more than one person can play on the same device. The roster lists them, last played first.
   Each game carries its slot id (S.sid); a sergeant's slot lives at KEY + ':' + sid. */
const RKEY = 'ashes-of-the-pale-roster', slotKey = id => KEY + ':' + id;
const sameName = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
const newSid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
/* what the title shows for a sergeant without opening their save: chapter, where they stand, level, when last played */
function rosterMeta(s){ const a = typeof AREAS !== 'undefined' && AREAS[s.area], t = a && a.title ? splitTitle(a.title)[1] : '';
  return {id:s.sid, name:s.name || 'Hask', ch:s.chapter || 0, lvl:s.lvl || 1, where:t, done:!!(s.chapters && s.chapters[7] != null), diff:s.diff && s.diff !== 'soldier' ? s.diff : undefined, upd:Date.now()}; }
function roster(){
  let r = null; try { r = JSON.parse(localStorage.getItem(RKEY)); } catch(e) { return {list:[]}; }
  if (r && Array.isArray(r.list)) return r;
  r = {list:[]}; // the first run of v3.7.7: the one save this device had becomes the first sergeant on the roster
  try { const old = JSON.parse(localStorage.getItem(KEY));
    if (old && old.v === 1) { old.sid ??= newSid(); const js = JSON.stringify(old); localStorage.setItem(slotKey(old.sid), js); if (localStorage.getItem(slotKey(old.sid)) === js) { r.list.push(rosterMeta(old)); localStorage.setItem(RKEY, JSON.stringify(r)); localStorage.removeItem(KEY); } return r; }
    localStorage.setItem(RKEY, JSON.stringify(r)); } catch(e) {}
  return r;
}
const sidFor = name => { const e = roster().list.find(e => sameName(e.name, name)); return e ? e.id : newSid(); };
function save(){ if (!S) return; S.stats ??= {}; if (S.stats.silverSeen == null) S.stats.silverSeen = S.silver; else if (S.silver !== S.stats.silverSeen) { const d = S.silver - S.stats.silverSeen; S.stats[d > 0 ? 'silverIn' : 'silverOut'] = (S.stats[d > 0 ? 'silverIn' : 'silverOut'] || 0) + Math.abs(d); S.stats.silverSeen = S.silver; }
  try { S.sid ??= sidFor(S.name); localStorage.setItem(slotKey(S.sid), JSON.stringify(S));
  const r = roster(); r.list = [rosterMeta(S), ...r.list.filter(e => e.id !== S.sid)]; localStorage.setItem(RKEY, JSON.stringify(r)); } catch(e) {} }
function loadSlot(id){ try { const s = localStorage.getItem(slotKey(id)); if (!s) return null; const o = JSON.parse(s); o.sid = id; return o; } catch(e) { return null; } }
function loadSave(){ const e = roster().list[0]; return e ? loadSlot(e.id) : null; }
function dropSlot(id){ try { localStorage.removeItem(slotKey(id)); const r = roster(); r.list = r.list.filter(e => e.id !== id); localStorage.setItem(RKEY, JSON.stringify(r)); } catch(e) {} }
function elog(m){ S.log.unshift(m); S.log = S.log.slice(0, 6); if (view === 'explore') updExplore(); }
function loy(id, n){ S.loy[id] = Math.max(-3, Math.min(3, S.loy[id] + n)); notes.push({t:`${NAME(id)} ${n > 0 ? 'approves' : 'disapproves'}.`, c:n > 0 ? 'good' : 'bad'}); }
function note(t, c=''){ notes.push({t, c}); }
function gainXP(n){
  S.xp += n; const before = S.lvl; let l = 1; while (l < LEVELS.length && S.xp >= LEVELS[l]) l++; S.lvl = l;
  if (S.lvl > before) { AUDIO.play('up'); for (let k = before + 1; k <= S.lvl; k++) if ([3,5,7].includes(k)) S.picksDue.push(k); }
  return S.lvl > before;
}

