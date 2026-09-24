/* ============ battle ============ */
const party = () => B.units.filter(u => u.side === 'p' && u.hp > 0);
const squadUnits = () => B.units.filter(u => u.side === 'p' && !u.ally && u.hp > 0);
const foesOf = u => B.units.filter(x => x.hp > 0 && x.side !== u.side);
const friendsOf = u => B.units.filter(x => x.hp > 0 && x.side === u.side && x !== u);
const abRange = (u, a) => (a.range || 0) + (a.item && has(u.id, 'longfuse') ? 1 : 0);
const foes = () => B.units.filter(u => u.side === 'e' && u.hp > 0);
const unitAt = (x,y) => B.units.find(u => u.hp > 0 && u.x === x && u.y === y);
const inB = (x,y) => x>=0 && y>=0 && x<8 && y<10;
const wall = (x,y) => !inB(x,y) || B.def.map[y][x] === '#';
const free = (x,y,self) => !wall(x,y) && !B.units.some(u => u !== self && u.hp > 0 && u.x === x && u.y === y);
const veilPen = () => Math.round(5 * B.warren.meanas);
const phantomDC = () => 13 + (B.warren.meanas > 1 ? 3 : 0);
const pace = ms => ms * SET.speed; // combat pace setting (Slow / Normal / Fast)
/* a timer that belongs to this battle: it does nothing if the battle was won, left, restarted or replaced meanwhile */
function later(fn, ms){ const b0 = B; return setTimeout(() => { if (B && B === b0) fn(); }, ms); }
function blog(m){ B.log.unshift(m); B.log = B.log.slice(0,5); const el = $('#blog'); if (el) el.innerHTML = B.log.map(l => `<div>${l}</div>`).join(''); }
/* floating text over a unit; several at once on one unit stack instead of overprinting */
function float(u, txt, col, big){ const now = performance.now(), n = B.fx.filter(f => f.kind === 'txt' && f.x === u.x && f.y === u.y && now - f.t < 350).length;
  B.fx.push({kind:'txt', x:u.x, y:u.y, txt, col, big, t:now + n*140}); }
function hurt(u, n, crit){ if (u.hp <= 0) return; // already down: a second blast or a late blow does nothing
  if (u.side === 'p' && !u.ally && S.card === 'herald' && u.hp - n <= 0 && !B.used.herald) { B.used.herald = true; n = u.hp - 1; blog(`<em>The Herald turns its head.</em> ${u.name} stays standing at 1 health.`); float(u, 'spared', '#8fa38a'); }
  if (u.immortal && u.hp - n < 1) { n = Math.max(0, u.hp - 1); float(u, 'holds', '#bfe8ff'); if (!n) { u.flash = performance.now(); AUDIO.play('hurt'); return; } } // it does not fall
  u.hp = Math.max(0, u.hp - n); if (!(u.immortal && u.hp === 1)) float(u, '−' + n + (crit ? '!' : ''), crit ? '#ffcf7a' : '#f08a7c', crit); u.flash = performance.now(); bloodDecal(u.x, u.y, n >= 8);
  if (u.side === 'p' && !u.ally) redFlash(); if (n >= 8 || crit) shakeMap();
  if (u.hp === 0) { u.deadAt = performance.now(); AUDIO.play('death'); sparks(u.x, u.y, 14, u.side === 'p' ? '#d6a24a' : '#9a3a30', .6); blog(u.side === 'p' ? `<em>${u.name} goes down!</em>` : `${u.name} falls.`); } else AUDIO.play('hurt'); }
function heal(u, n){ const before = u.hp; u.hp = Math.min(u.maxhp, u.hp + n); if (u.hp > before) float(u, '+'+(u.hp-before), '#9fe0b8'); u.healed = performance.now(); }
function sparks(x, y, n, col, spd = 1){ if (REDUCE()) return; for (let i=0;i<n;i++){ const a = Math.random()*7, s = (Math.random()*.6 + .3)*spd; B.parts.push({x:x + .5, y:y + .5, vx:Math.cos(a)*s, vy:Math.sin(a)*s - .3, life:1, decay:.02 + Math.random()*.03, col, size:1 + Math.random()*2}); } }

function mkParty(id, x, y){
  const t = TPL[id], L = S.lvl - 1;
  const u = {id, side:'p', name:NAME(id), sig:t.sig, col:t.col, maxhp:t.hp + L*4 + (S.card === 'obelisk' ? 4 : 0), ac:t.ac, atk:t.atk + L, dmg:t.dmg, rng:t.rng, mv:t.mv + (S.card === 'hounds' ? 1 : 0), init:t.init, ab:[...t.ab], magic:t.magic, strain:0, verb:VERB[id], x, y, kind:id};
  // gear
  Object.values(S.gear[id] || {}).forEach(g => { const it = ITEMS[g]; if (!it) return; u.ac += it.ac || 0; u.atk += it.atk || 0; u.maxhp += it.hp || 0; u.mv += it.mv || 0; u.rng += it.rng || 0; if (it.dmg) u.dmg = it.dmg; });
  // veteran picks and talents
  if (has(id,'iron')) u.maxhp += 6; if (has(id,'keen')) u.atk += 1; if (has(id,'fleet')) u.mv += 1; if (has(id,'nerve')) u.init += 1;
  ['quorl','shadowstep','mockra','argument','quickshot'].forEach(k => { if (has(id,k)) u.ab.splice(u.ab.length - 1, 0, k); }); // before Salve
  if (B && B.def.nomagic && u.magic) { u.rng = 1; if (id === 'tuft') { u.dmg = [1,4,1]; u.verb = 'jabs a knife at'; } } // otataral: a knife, or the cudgel
  u.hp = u.maxhp; return u;
}
function mkFoe(k, x, y, extra=0){ const f = FOES[k]; return {id:k, kind:k, side:'e', ...f, maxhp:f.hp+extra, hp:f.hp+extra, col:'#d9695a', x, y}; }
function mkAlly(k, x, y){ const f = FOES[k]; return {id:'ally_' + k, kind:k, side:'p', ally:true, ...f, name:f.name + ' (ally)', maxhp:f.hp, hp:f.hp, col:'#9fb3d9', x, y, ab:[]}; }
/* the nearest free tile to x,y (itself if free), ring by ring out to 4, the straight neighbours first */
function freeNear(x, y, self){ if (free(x,y,self)) return {x,y};
  for (let r=1;r<=4;r++) { let best = null, bd = 9;
    for (let dy=-r;dy<=r;dy++) for (let dx=-r;dx<=r;dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== r || !free(x+dx, y+dy, self)) continue; const d = Math.abs(dx) + Math.abs(dy); if (d < bd) { bd = d; best = {x:x+dx, y:y+dy}; } }
    if (best) return best; }
  return null; }

function startBattle(id, opt={}){
  const def = BATTLES[id];
  if (!def) { S.scene = 'explore'; S.battle = null; save(); return startExplore(); } // a save pointing at a fight that no longer exists
  // the satchel as it was when the fight began: a fight resumed after a reload starts over with it, whatever was saved mid-fight
  if (S.scene === 'battle' && S.battle === id && S.binv) S.inv = Object.assign({}, S.binv); else S.binv = Object.assign({}, S.inv);
  S.scene = 'battle'; S.battle = id; S.bopt = opt; S.node = null; S.bg = 'tunnel'; if (def.mortal) S.f.lastFallen = []; save();
  const snap = JSON.stringify(S);
  view = 'battle'; AUDIO.setScene(def.music || 'battle');
  B = {def, id, opt, snap, warren:def.warren, units:[], order:[], idx:-1, round:0, fires:[], fx:[], parts:[], log:[], used:{}, cur:null, moved:false, acted:false, mode:null, aim:null, busy:true, over:false, turn:0, anim:null};
  SQUAD().forEach((pid,i) => { const p = def.party[i] || def.party[def.party.length - 1]; const at = freeNear(p[0], p[1]) || {x:p[0], y:p[1]}; B.units.push(mkParty(pid, at.x, at.y)); });
  (def.allies || []).forEach(a => { const at = freeNear(a[1], a[2]); if (at) B.units.push(mkAlly(a[0], at.x, at.y)); });
  def.foes.forEach((f,i) => { if (opt.drop && opt.drop.includes(i)) return; B.units.push(mkFoe(f[0], f[1], f[2], f[0]==='stone' && S.f.noisy ? 10 : 0)); });
  const squadInit = (SQUAD().some(id => has(id,'sappers_eye')) ? 2 : 0) + (S.card === 'raven' ? 2 : 0);
  const initRoll = u => d20() + u.init + (u.side === 'p' ? squadInit : 0);
  B.units.forEach(u => u.ini = initRoll(u));
  B.initOrder = [...B.units].sort((a,b) => b.ini - a.ini);
  B.surprise = opt.surprise || null;
  battleStyle();
  $('#app').innerHTML = `<header class="hud bhud"><div class="bhead"><div class="loc">${def.title}</div><div class="sub warren" id="bWarren" title="${esc(def.warrenText)}">${def.warrenText}</div></div><div class="hudr"><span id="bRound"></span>${hudButtons()}</div></header>
    ${def.objective ? `<div class="objective" id="objective"></div>` : ''}
    <div class="order" id="order" aria-label="Turn order"></div>
    <div class="cvwrap"><canvas id="cv" aria-label="Battle map"></canvas></div>
    <div class="ubar" id="ubar"></div>
    <div class="log" id="blog" aria-live="polite"></div>`;
  bindHud();
  $('#bWarren').onclick = e => e.currentTarget.classList.toggle('open'); // the warren line is cut to one row on a phone; tap to read it all
  $('#order').onclick = e => { const c = e.target.closest('[data-u]'); if (!c || !B) return; const u = B.units[+c.dataset.u]; if (!u) return; B.ping = {u, t:performance.now()}; if (u.hp > 0) blog(`${esc(u.name)}: ${u.hp}/${u.maxhp} health, armour ${u.ac}${u.rng > 1 ? `, range ${u.rng}` : ''}.`); };
  G.disp = {};
  fitBattle();
  if (opt.pre) { AUDIO.play('boom', .8); B.fx.push({kind:'boom', x:3.5, y:1, r:1, col:'#f2c46b', t:performance.now()}); sparks(3.5, 1, 30, '#f2c46b'); shakeMap(); foes().forEach(f => hurt(f, roll(1,10))); blog(typeof opt.pre === 'string' ? opt.pre : `Kettle's sharper skips across the ground and goes off in the middle of them. The whole ${({city:'street',roof:'roof',terrace:'terrace',garden:'garden',storm:'garden',cellar:'vault',dock:'quay',plain:'plain',hills:'hillside'})[def.style] || (def.open ? 'plain' : 'tunnel')} hears it.`); }
  if (def.nomagic) blog(`<em>Otataral. The warrens are dead here.</em>`);
  if (def.nothrow) blog(`<em>Gas in the pipes. Nobody throws anything in here.</em>`);
  if (def.mortal) blog(`<em>Whoever falls here stays down.</em>`);
  if (def.objective) blog(`<em>${def.objective.text}</em>`);
  if (def.allies && def.allies.length) blog(`Others fight beside you tonight. They are not yours.`);
  if (B.surprise === 'p') blog(`Surprise: your squad moves first.`);
  if (B.surprise === 'e') { blog(`<em>Something moves before you do.</em>`); if (id === 'stone' || def.foes.some(f => f[0] === 'hound')) AUDIO.play('growl'); }
  later(nextTurn, 500);
}
function newRound(){
  B.round++; B.idx = 0;
  const ob = B.def.objective;
  if (ob && ob.type === 'survive' && B.round > ob.rounds && !B.over) { B.over = true; blog(`<em>Held.</em>`); endBeat(true); return; }
  // reinforcements: each lands on its tile, or the nearest free one if someone is standing there
  (B.def.waves || []).filter(w => w.round === B.round).forEach(w => {
    w.foes.forEach(f => { const at = freeNear(f[1], f[2]); if (!at) return; const u = mkFoe(f[0], at.x, at.y); u.ini = d20() + u.init; u.arrived = performance.now(); B.units.push(u); B.initOrder.push(u); sparks(at.x, at.y, 24, '#9a86e0', .8); B.fx.push({kind:'ring', x:at.x, y:at.y, col:'#9a86e0', t:performance.now(), dur:900}); });
    if (w.text) blog(`<em>${w.text}</em>`); AUDIO.play('growl'); shakeMap(); });
  if (B.surprise) { B.order = B.initOrder.filter(u => u.side === B.surprise); B.surprise = null; B.surpriseRound = true; }
  else { B.order = B.initOrder; B.surpriseRound = false; }
  B.fires = B.fires.filter(f => f.until >= B.round);
}
function nextTurn(){
  if (checkEnd()) return;
  B.idx++;
  if (B.idx >= B.order.length) { newRound(); if (B.over) return; } // the objective was just met
  const u = B.order[B.idx];
  if (!u || u.hp <= 0) return nextTurn();
  B.cur = u; B.moved = false; B.mvLeft = u.mv; B.acted = false; B.mode = null; B.aim = null; B.turn++; B.turnAt = performance.now();
  if (u.strain) u.strain = Math.max(0, u.strain - 1);
  if (B.fires.some(f => f.x === u.x && f.y === u.y)) { blog(`${u.name} is caught in burner fire.`); hurt(u, roll(1,6)); }
  if (u.hp <= 0) { B.busy = true; updBattleUI(); if (checkEnd()) return; return later(nextTurn, pace(600)); }
  if (u.stun) { u.stun = false; B.busy = true; blog(`${u.name} is dazed and loses the turn.`); float(u, 'dazed', '#c9bbff'); updBattleUI(); return later(nextTurn, pace(800)); }
  if (u.side === 'p' && !u.ally) { B.busy = false; B.mode = 'act'; updBattleUI(); barInView(); }
  else { B.busy = true; updBattleUI(); const turn = B.turn; later(() => ai(u, turn), pace(550)); } // not if the battle was left or restarted meanwhile
}
function endTurn(){ if (!B || B.over) return; B.busy = true; B.mode = null; B.aim = null; later(nextTurn, pace(250)); }
function checkEnd(){
  if (!B || B.over) return true;
  const ob = B.def.objective;
  if (!foes().length && !(ob && ob.type === 'survive' && (B.def.waves || []).some(w => w.round > B.round))) { B.over = true; endBeat(true); return true; }
  if (!squadUnits().length) { B.over = true; endBeat(false); return true; }
  return false;
}
/* the end of a fight gets a beat on the map (Victory / Held / Down) before the sheet comes up */
function endBeat(won){
  const ob = B.def.objective;
  B.banner = {txt:won ? (ob ? 'Held' : 'Victory') : 'The Fourth is down', col:won ? '#e8c073' : '#e0574a', t:performance.now()};
  B.mode = null; B.aim = null; B.reach = null; updBattleUI();
  later(won ? win : lose, pace(won ? 1300 : 1500));
}
function win(){
  if (!B) return;
  const up = gainXP(B.def.xp), head = `${B.def.objective ? 'Held' : 'Victory'}. +${B.def.xp} experience.`;
  if (B.def.mortal) { // the fallen stay down: the sergeant gets up with a scar, everyone else is dead
    const fallen = B.units.filter(u => u.side === 'p' && !u.ally && u.hp <= 0).map(u => u.id);
    if (fallen.includes('sgt')) S.f.sgtScar = 1;
    const dead = fallen.filter(id => id !== 'sgt'); S.f.lastFallen = dead; dead.forEach(id => kill(id));
    const names = dead.map(NAME), list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
    note(dead.length ? `${head} ${list} did not get up.` : `${head} Everyone is still breathing.`, dead.length ? 'bad' : 'good');
  } else note(`${head} ${SQUAD().includes('ohl') ? 'Ohl patches up the squad' : 'The squad patches itself up'}; everyone is back on their feet.`, 'good');
  S.scene = 'talk'; save(); AUDIO.play('win');
  if (up) note(`The squad reaches level ${S.lvl}: +4 health and +1 to hit for everyone.`, 'good');
  updBattleUI();
  talk(B.def.after);
}
function lose(){
  AUDIO.play('lose');
  const sh = $('#sheet'); sh.hidden = false;
  sh.innerHTML = `<div class="sp">The squad goes down in the dark</div><div class="txt"><p>Hood's gate is a long walk, and no one in the Fourth is in a hurry to make it. Try it again.</p></div>
    <div class="choices"><button class="choice" id="bRetry">Retry the fight</button></div>`;
  const snap = B.snap; // the save as it stood when the fight began: items, health, the lot
  $('#bRetry').onclick = () => { AUDIO.play('click'); sh.hidden = true; S = migrate(JSON.parse(snap)); startBattle(S.battle, S.bopt || {}); };
}

/* abilities */
const AB = {
  rally:{name:'Rally', self:true, desc:()=>'Squadmates within 3 heal 4 and get +2 to hit through next round. Once per fight.', ok:()=>!B.used.rally,
    run(u){ B.used.rally = 1; AUDIO.play('heal'); party().forEach(p => { if (cheb(u,p) <= 3) { heal(p,4); p.rallyUntil = B.round + 1; } }); blog(`${u.name}: "On me, you sorry lot!" The squad steadies.`); }},
  bash:{name:'Shield bash', desc:()=>'Adjacent enemy: 1d6+3 damage, and it loses its next turn on a hit. Recharges after 2 rounds.', ok:u=>!(u.cdBash >= B.round),
    tiles:u=>foes().filter(f => cheb(u,f) === 1),
    run(u,x,y){ const t = unitAt(x,y); u.cdBash = B.round + 2; const r = attack(u, t, {dmg:[1,6,3], verb:'shield-bashes'}); if (r.hit && (t.hp - r.dmg > 0 || t.immortal)) { t.stun = true; blog(`${t.name} reels, dazed.`); } }},
  sharper:{name:'Sharper', item:'sharper', boom:true, aoe:1, range:4, desc:()=>'Throw, range 4. 1d10+2 where it lands and 1d6 to everything next to it, squad included. A natural 1 scatters it.',
    run(u,x,y){ const pt = scatter(u,x,y,1,1); throwArc(u, pt, () => { blast(pt, [[1,10,2],[1,6,0]], '#f2c46b'); AUDIO.play('boom', .8); sparks(pt.x, pt.y, 26, '#f2c46b'); }); blog(`${u.name} lobs a sharper.`); }},
  burner:{name:'Burner', item:'burner', boom:true, aoe:1, range:4, desc:()=>'Throw, range 4. 1d6 to everything in a 3×3 and leaves it burning for 2 rounds. A natural 1 scatters it.',
    run(u,x,y){ const pt = scatter(u,x,y,1,1); throwArc(u, pt, () => { blast(pt, [[1,6,0],[1,6,0]], '#ff7a3a'); AUDIO.play('burner'); sparks(pt.x, pt.y, 30, '#ff9a3a', .6);
      for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) if (!wall(pt.x+dx, pt.y+dy)) B.fires.push({x:pt.x+dx, y:pt.y+dy, until:B.round+2}); });
      blog(`${u.name} throws a burner. The tunnel fills with orange light.`); }},
  cusser:{name:'Cusser', item:'cusser', boom:true, aoe:2, range:3, desc:()=>'Throw, range 3. 3d8 to the centre and everything next to it, 1d8 one step further. Scatters on a 1–2. It\'s a cusser.',
    run(u,x,y){ const pt = scatter(u,x,y,2,R(2)+1); throwArc(u, pt, () => { blast(pt, [[3,8,0],[3,8,0],[1,8,0]], '#fff1c2'); AUDIO.play('boom', 1.6); sparks(pt.x, pt.y, 60, '#fff1c2', 1.6); shakeMap(); const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }); blog(`${u.name} throws a cusser. The ceiling thinks about it.`); }},
  veil:{name:'Veil', strain:2, desc:()=>`Meanas illusion on a squadmate within 4: enemies take −${veilPen()} to hit them for 2 rounds. Strain 2.`,
    tiles:u=>party().filter(p => cheb(u,p) <= 4),
    run(u,x,y){ const t = unitAt(x,y); t.veilUntil = B.round + 2; AUDIO.play('magic'); sparks(t.x, t.y, 14, '#c9bbff', .4); blog(`${u.name} folds shadow around ${t.name}. They blur at the edges.`); float(t,'veiled','#c9bbff'); }},
  phantom:{name:'Phantom', strain:3, desc:()=>`An enemy within 5 chases a Meanas phantom and loses its next turn unless it resists (DC ${phantomDC()}). Strain 3.`,
    tiles:u=>foes().filter(f => cheb(u,f) <= 5),
    run(u,x,y){ const t = unitAt(x,y); const r = d20() + (t.boss ? 4 : 2); AUDIO.play('shadow'); B.fx.push({kind:'bolt', from:{x:u.x,y:u.y}, to:{x:t.x,y:t.y}, col:'#9a86e0', t:performance.now(), dur:400, wob:true});
      if (r >= phantomDC()) { blog(`${t.name} sees through the phantom${SET.dice ? ` (${r} vs ${phantomDC()})` : ''}.`); float(t,'resists','#a99a88'); }
      else { t.stun = true; blog(`${t.name} lunges after a phantom that isn't there${SET.dice ? ` (${r} vs ${phantomDC()})` : ''}.`); float(t,'fooled','#c9bbff'); sparks(t.x, t.y, 12, '#c9bbff', .4); } }},
  mend:{name:'Mend', strain:3, desc:()=>`Denul healing on a squadmate within ${has('ohl','triage') ? 4 : 3}: 2d6+${has('ohl','triage') ? 6 : 3}${B.warren.denul < 1 ? ', weakened here' : ''}. Strain 3.`,
    tiles:u=>party().filter(p => cheb(u,p) <= (has(u.id,'triage') ? 4 : 3)),
    run(u,x,y){ const t = unitAt(x,y); const n = Math.max(1, Math.round(roll(2,6,has(u.id,'triage') ? 6 : 3) * B.warren.denul)); AUDIO.play('heal'); heal(t, n); sparks(t.x, t.y, 12, '#9fe0b8', .4); blog(`${u.name} lays hands on ${t.name}${B.warren.denul < 1 ? '. Denul comes thin and grudging' : ''}.`); }},
  salve:{name:'Salve', item:'salve', desc:()=>'Heal 8, yourself or an adjacent squadmate.', tiles:u=>party().filter(p => cheb(u,p) <= 1),
    run(u,x,y){ const t = unitAt(x,y); AUDIO.play('heal'); heal(t, 8); blog(`${u.name} slaps salve on ${t === u ? 'their own wounds' : t.name}.`); }},
  mark:{name:'Tracker\'s Mark', desc:()=>'An enemy within 5 is marked: every hit on it does +2 damage for two rounds.', tiles:u=>foes().filter(f => cheb(u,f) <= 5 && !(f.markedUntil >= B.round)),
    run(u,x,y){ const t = unitAt(x,y); t.markedUntil = B.round + 2; AUDIO.play('click'); float(t,'marked','#f2c46b'); blog(`${u.name} marks ${t.name}: a nick of chalk on the ground, a word to the squad, and it is a target.`); }},
  quickshot:{name:'Quick Shot', desc:()=>'Once a fight: two arrows at one target within reach.', ok:()=>!B.used.quickshot, tiles:u=>foes().filter(f => cheb(u,f) <= u.rng),
    run(u,x,y){ const t = unitAt(x,y); B.used.quickshot = 1; attack(u, t); later(() => { if (t.hp > 0) attack(u, t, {verb:'puts a second arrow into'}); }, pace(320)); }},
  /* talents (level 3 picks) */
  quorl:{name:'Quorl Signal', boom:true, aoe:1, range:5, desc:()=>'Once a fight: a Moranth drop. A sharper from the sky, range 5, not from the satchel.', ok:()=>!B.used.quorl,
    run(u,x,y){ B.used.quorl = 1; const pt = {x,y}; AUDIO.play('bow'); B.fx.push({kind:'arc', from:{x:pt.x + 1.5, y:-3}, to:pt, t:performance.now(), dur:REDUCE() ? 1 : pace(480), drop:true}); later(() => { blast(pt, [[1,10,2],[1,6,0]], '#f2c46b'); AUDIO.play('boom', .8); sparks(pt.x, pt.y, 26, '#f2c46b'); }, REDUCE() ? 1 : pace(500)); blog(`${u.name} shows a lamp to the sky. Something with wings answers.`); }},
  shadowstep:{name:'Shadow Step', strain:1, desc:()=>'Step through Meanas to any free tile within 4. No free swings. Strain 1.', tiles:u=>{ const out = []; for (let y=0;y<10;y++) for (let x=0;x<8;x++) if (cheb(u,{x,y}) <= 4 && free(x,y,u) && !(x === u.x && y === u.y)) out.push({x,y,step:true}); return out; },
    run(u,x,y){ AUDIO.play('shadow'); sparks(u.x, u.y, 12, '#c9bbff', .4); u.x = x; u.y = y; sparks(x, y, 12, '#c9bbff', .4); blog(`${u.name} is somewhere else.`); }},
  mockra:{name:'Mockra Whisper', strain:2, desc:()=>'An enemy within 4 hears something it believes and loses its next turn. Bosses resist on 12+. Strain 2.', tiles:u=>foes().filter(f => cheb(u,f) <= 4),
    run(u,x,y){ const t = unitAt(x,y); AUDIO.play('shadow'); B.fx.push({kind:'bolt', from:{x:u.x,y:u.y}, to:{x:t.x,y:t.y}, col:'#c9bbff', t:performance.now(), dur:400, wob:true});
      if (t.boss && d20() >= 12) { blog(`${t.name} shakes the whisper off.`); float(t,'resists','#a99a88'); } else { t.stun = true; blog(`${t.name} stops to listen to something that is not there.`); float(t,'dazed','#c9bbff'); } }},
  argument:{name:'Argument with Hood', strain:3, desc:()=>'Once a fight: a downed squadmate within 2 stands up at 6 health. Strain 3.', ok:()=>!B.used.argument,
    tiles:u=>B.units.filter(p => p.side === 'p' && !p.ally && p.hp <= 0 && cheb(u,p) <= 2 && freeNear(p.x, p.y, p)),
    run(u,x,y){ const t = B.units.find(p => p.side === 'p' && !p.ally && p.hp <= 0 && p.x === x && p.y === y); if (!t) return; const at = freeNear(t.x, t.y, t); if (!at) return; // someone may be standing over the body
      B.used.argument = 1; AUDIO.play('heal'); t.x = at.x; t.y = at.y; t.hp = 6; t.deadAt = null; t.healed = performance.now(); sparks(t.x, t.y, 20, '#9fe0b8', .5); blog(`${u.name} argues with Hood in Ehrlii. ${t.name} gets up, which settles it for now.`); }},
};
function abOk(u, k){ const a = AB[k]; if (!a) return false; if (a.strain && B && B.def.nomagic) return false; if (a.boom && B && B.def.nothrow) return false; if (a.item === 'cusser' && B && B.def.style === 'roof') return false; /* Fiddler's order: no cussers on the roofs */ if (a.item && !(S.inv[a.item] > 0)) return false; if (a.ok && !a.ok(u)) return false; if (a.tiles && !a.tiles(u).length) return false; return true; }
function scatter(u, x, y, failOn, dist){
  const nat = d20() + (S.card === 'oponn' ? 1 : 0);
  if (nat <= failOn && !has(u.id,'longfuse')) { const [dx,dy] = DIRS[R(8)]; let nx = x, ny = y;
    for (let i=0;i<dist;i++) if (!wall(nx+dx, ny+dy)) { nx += dx; ny += dy; }
    blog(`<em>The throw goes wide!</em>`); return {x:nx, y:ny}; }
  return {x, y};
}
/* the arc is only drawn; the blast runs on a timer, so a throw still lands if the screen stops drawing (the app backgrounded mid-throw) */
function throwArc(u, pt, then){ const dur = REDUCE() ? 1 : 420; B.fx.push({kind:'arc', from:{x:u.x,y:u.y}, to:pt, t:performance.now(), dur}); later(then, dur); }
function blast(pt, dice, col){
  B.fx.push({kind:'boom', x:pt.x, y:pt.y, r:dice.length - 1, col, t:performance.now()});
  B.units.filter(u => u.hp > 0).forEach(u => { const d = cheb(u, pt); if (d < dice.length) { const [n,s,p] = dice[d]; hurt(u, roll(n,s,p)); if (u.side === 'p') blog(`${u.name} is caught in the blast.`); } });
  updBattleUI(); if (B.cur && B.cur.side === 'p') afterAct(); else if (checkEnd()) updBattleUI();
}
/* flanking: attacker gets +2 if an ally is adjacent to the target on the far side (works for melee and ranged) */
function flankers(a, t, from){
  const ax = (from || a).x, ay = (from || a).y;
  return B.units.filter(b => b !== a && b.side === a.side && b.hp > 0 && !b.stun && cheb(b, t) === 1 && (b.x - t.x)*(ax - t.x) + (b.y - t.y)*(ay - t.y) < 0);
}
function flanked(a, t, from){ return flankers(a, t, from).length > 0; }
/* attacks of opportunity: leaving a tile next to an enemy gives that enemy one free melee swing per turn */
function threatsAt(u, x, y){ return B.units.filter(e => e.side !== u.side && e.hp > 0 && !e.stun && cheb(e, {x,y}) === 1); }
function provokes(u, from, to){ return threatsAt(u, from.x, from.y).filter(e => e.aooTurn !== B.turn || (e.side === 'p' && !e.ally && has(e.id,'holdline'))); }
/* the numbers behind a blow: the attacker's bonus, the target's armour, the lowest natural roll that crits, and whether it flanks */
function atkCalc(a, t, o={}){
  const mine = a.side === 'p';
  const fl = !o.aoo && flanked(a, t, o.from);
  const wallBonus = t.side === 'p' && friendsOf(t).some(f => !f.ally && has(f.id,'shieldwall') && cheb(f,t) === 1) ? 2 : 0;
  const discipline = t.side === 'p' && !t.ally && SQUAD().some(id => has(id,'discipline')) ? 1 : 0;
  const aooBonus = o.aoo && !a.ally && a.side === 'p' && (has(a.id,'holdline') || has(a.id,'sappers_eye')) ? 2 : 0;
  const bonus = a.atk + (mine && S.card === 'oponn' ? 1 : 0) + (mine && a.rallyUntil >= B.round ? 2 : 0) + (!mine && S.card === 'knight' ? -1 : 0) + (fl ? 2 : 0) + aooBonus;
  const ghost = t.side === 'p' && !t.ally && has(t.id,'ghost') ? 2 : 0;
  const ac = t.ac + (t.veilUntil >= B.round ? veilPen() : 0) + wallBonus + discipline + ghost;
  return {bonus, ac, critOn:mine && S.card === 'assassin' ? 19 : 20, fl};
}
/* chance to hit in percent: a natural 1 always misses, a crit always hits */
function hitPct(c){ let n = 0; for (let r = 1; r <= 20; r++) if (r >= c.critOn || (r !== 1 && r + c.bonus >= c.ac)) n++; return n * 5; }
function attack(a, t, o={}){
  const nat = d20(), mine = a.side === 'p';
  const {bonus, ac, critOn, fl} = atkCalc(a, t, o);
  const crit = nat >= critOn;
  const hit = crit || (nat !== 1 && nat + bonus >= ac);
  const verb = o.verb || a.verb;
  const ranged = cheb(a, t) > 1;
  const lash = a.kind === 'tuft' && !B.def.nomagic;
  if (ranged) B.fx.push({kind:'bolt', from:{x:a.x,y:a.y}, to:{x:t.x,y:t.y}, col:lash ? '#9a86e0' : '#cfc8b8', t:performance.now(), dur:220, wob:lash});
  else B.anim = {u:a, tx:t.x, ty:t.y, t0:performance.now()};
  a.facing = t.x >= a.x ? 1 : -1;
  AUDIO.play(lash ? 'shadow' : a.kind === 'kettle' || a.kind === 'xbow' ? 'bow' : hit ? 'sword' : 'miss');
  const math = SET.dice ? ` <span class="stat">(${nat}+${bonus} vs ${ac})</span>` : '';
  const tags = [o.aoo ? 'free attack' : '', fl ? 'flanking +2' : ''].filter(Boolean).join(', ');
  const tagTxt = tags ? ` <span class="stat">[${tags}]</span>` : '';
  const land = ranged ? pace(200) : pace(140); // the blow lands when the bolt arrives or the lunge connects
  if (!hit) { blog(`${a.name} ${verb} ${t.name} and misses${tagTxt}${math}.`); later(() => { float(t, 'miss', '#a99a88'); if (!ranged) sparks(t.x, t.y - .2, 4, '#cfc8b8', .5); }, land); return {hit:false}; }
  const dd = o.dmg || a.dmg; const dmg = roll(crit ? dd[0]*2 : dd[0], dd[1], dd[2]) + (t.markedUntil >= B.round ? 2 : 0);
  blog(`${a.name} ${verb} ${t.name}${crit ? ', <em>critical</em>' : ''}: ${dmg} damage${tagTxt}${math}.`);
  later(() => { if (t.hp <= 0) return; if (crit) sparks(t.x, t.y, 16, '#ffcf7a'); else sparks(t.x, t.y - .1, 5, '#f08a7c', .6);
    hurt(t, dmg, crit);
    if (S.card === 'chains' && a.side === 'e' && t.side === 'p' && !t.ally && a.hp > 0) { hurt(a, 2); sparks(a.x, a.y, 10, '#9a9aa6', .5); blog(`<em>The chains bite back.</em> ${a.name} takes 2.`); }
    updBattleUI(); }, land);
  return {hit:true, dmg};
}
function castStrain(u, cost){
  if (!cost) return; u.strain += cost;
  if (u.strain > STR_MAX) { const over = u.strain - STR_MAX, dmg = over * 3; u.strain = STR_MAX; blog(`<em>${u.name} overdraws the warren.</em> Blood from the nose, ${dmg} damage.`); hurt(u, dmg); }
}

/* player input */
function battleTap(x, y){
  if (!B || B.busy || B.over || !B.cur || B.cur.side !== 'p' || !$('#sheet').hidden) return;
  const u = B.cur, t = unitAt(x,y);
  if (B.mode && B.mode !== 'act') {
    const a = AB[B.mode];
    if (a.aoe) {
      if (cheb(u,{x,y}) > abRange(u,a) || wall(x,y)) { B.mode = 'act'; B.aim = null; return updBattleUI(); }
      if (B.aim && B.aim.x === x && B.aim.y === y) return useAb(B.mode, x, y);
      AUDIO.play('click'); B.aim = {x,y}; return updBattleUI();
    }
    if (a.tiles(u).some(q => q === t || (q.x === x && q.y === y))) return useAb(B.mode, x, y);
    B.mode = 'act'; return updBattleUI();
  }
  if (t && t.side === 'e' && !B.acted && cheb(u,t) <= u.rng) { B.acted = true; if (B.mvLeft < u.mv) B.moved = true; B.busy = true; attack(u, t); later(() => { B.busy = false; afterAct(); }, pace(380)); updBattleUI(); return; }
  if (t) { B.ping = {u:t, t:performance.now()}; blog(`${t.name}: ${t.hp}/${t.maxhp} health, armour ${t.ac}${t.rng > 1 ? `, range ${t.rng}` : ''}${t.side === 'e' && !B.acted ? (cheb(u,t) <= u.rng ? '' : ' · out of reach') : ''}.`); return; }
  if (!B.moved && B.reach && B.reach.has(K(x,y)) && !(x === u.x && y === u.y)) moveCur(x, y);
}
async function moveCur(x, y){
  const u = B.cur, path = pathFrom(B.reach, x, y), b0 = B; B.busy = true; B.reach = null;
  let stepped = 0;
  for (const st of path) {
    if (await opportunity(u, st)) break; // cut down mid-stride
    u.facing = st.x >= u.x ? 1 : -1; u.x = st.x; u.y = st.y; stepped++; AUDIO.play('step'); await wait(130); if (B !== b0) return; }
  if (B !== b0) return;
  B.mvLeft = Math.max(0, (B.mvLeft ?? u.mv) - (u.hp > 0 ? path.length : stepped)); // leftover movement stays usable this turn
  B.busy = false; B.moved = B.mvLeft <= 0; afterAct();
}
/* resolve free attacks against u for stepping out of its current tile; returns true if u drops */
async function opportunity(u, to){
  const es = provokes(u, u, to); if (!es.length) return false;
  for (const e of es) {
    e.aooTurn = B.turn; e.facing = u.x >= e.x ? 1 : -1;
    blog(`<em>${u.name} steps away from ${e.name}.</em>`);
    attack(e, u, {aoo:true, verb:'takes a free swing at'}); updBattleUI(); await wait(420);
    if (!B || u.hp <= 0) return true;
  }
  return false;
}
function useAb(k, x, y){
  const u = B.cur, a = AB[k];
  if (a.item) S.inv[a.item]--;
  B.acted = true; if (B.mvLeft < u.mv) B.moved = true; B.mode = 'act'; B.aim = null; B.busy = true;
  a.run(u, x, y); castStrain(u, a.strain && u.id === 'tuft' && S.card === 'magi' ? a.strain - 1 : a.strain);
  if (a.aoe) { updBattleUI(); return; } // blast() resumes the turn when it lands
  later(() => { B.busy = false; afterAct(); }, pace(350)); updBattleUI();
}
/* can the current unit still take a step this turn? */
const canStep = u => !B.moved && (B.mvLeft ?? u.mv) > 0 && DIRS.some(([dx,dy]) => free(u.x+dx, u.y+dy, u));
function afterAct(){
  if (!B || B.over) return;
  if (checkEnd()) { updBattleUI(); return; }
  if (B.cur.hp <= 0) { updBattleUI(); return endTurn(); }
  if (B.acted && !canStep(B.cur)) { B.moved = true; updBattleUI(); B.busy = true; return later(endTurn, pace(450)); } // nothing left to do: hand the turn on
  B.busy = false; updBattleUI();
}

/* enemy AI (it also drives allies, and the playtest bot's squad) */
async function ai(u, turnId){
  try { await aiTurn(u, turnId); }
  catch (e) { console.error('battle ai', e); if (B && !B.over && B.turn === turnId) { updBattleUI(); if (!checkEnd()) endTurn(); } } // a fault never leaves the turn hanging
}
/* the free swings stepping out of x,y gives away to u's enemies (each swings once a turn; Brisk with Hold the Line, always) */
const leaveCost = (u, x, y) => threatsAt(u, x, y).filter(e => e.aooTurn !== B.turn || (e.side === 'p' && !e.ally && has(e.id,'holdline'))).length;
/* walk u along a path, paying free swings on the way; false if the battle or the turn went away meanwhile */
async function aiWalk(u, path, gone){
  for (const st of path) { if (await opportunity(u, st) || gone()) break; u.facing = st.x >= u.x ? 1 : -1; u.x = st.x; u.y = st.y; if (u.kind !== 'shade') AUDIO.play('step'); await wait(160); if (gone()) return false; }
  return !gone();
}
async function aiTurn(u, turnId){
  if (!B || B.over || B.turn !== turnId) return;
  const b0 = B, gone = () => B !== b0 || B.turn !== turnId; // the battle was left or restarted, or the turn moved on, while this one played out
  const done = () => { updBattleUI(); if (!checkEnd()) endTurn(); };
  const inRange = () => foesOf(u).filter(p => cheb(u,p) <= u.rng);
  if (u.boss && u.kind === 'stone') { u.tc = (u.tc || 0) + 1; const adj = party().filter(p => cheb(u,p) === 1);
    if (u.tc % 3 === 0 && adj.length) { blog(`<em>The Stonebound slams the floor.</em> Stone and grief in every direction.`); AUDIO.play('slam'); shakeMap();
      B.fx.push({kind:'boom', x:u.x, y:u.y, r:1, col:'#a08de0', t:performance.now()}); sparks(u.x, u.y, 40, '#9a86e0'); adj.forEach(p => hurt(p, roll(2,6)));
      await wait(900); if (gone()) return; return done(); } }
  if (u.ai === 'raest') { u.tc = (u.tc || 0) + 1; // the Tyrant: a lance of Omtose Phellack on odd turns, a slow walk on even ones
    if (u.tc % 2 === 1) { const pool = party(), sq = pool.filter(p => !p.ally), tg = (sq.length ? sq : pool)[R((sq.length ? sq : pool).length)];
      if (tg) { u.facing = tg.x >= u.x ? 1 : -1; blog(`<em>The Tyrant speaks a word of Omtose Phellack.</em> The air around ${tg.name} turns to knives.`); AUDIO.play('shadow'); AUDIO.play('slam');
        B.fx.push({kind:'lance', from:{x:u.x,y:u.y}, to:{x:tg.x,y:tg.y}, col:'#bfe8ff', t:performance.now(), dur:1200}); await wait(420);
        if (gone() || B.over) return; shakeMap(); sparks(tg.x, tg.y, 34, '#bfe8ff', 1.1); B.fx.push({kind:'boom', x:tg.x, y:tg.y, r:1, col:'#bfe8ff', t:performance.now()});
        hurt(tg, roll(2,8,2)); party().filter(p => p !== tg && cheb(p, tg) === 1).forEach(p => { hurt(p, roll(1,8,0)); sparks(p.x, p.y, 12, '#bfe8ff', .7); });
        updBattleUI(); await wait(800); if (gone()) return; return done(); } } }
  const opp = foesOf(u);
  if (opp.length) {
    // score every reachable tile: in reach of a target, flanking it if it can, but never paying a free swing for a flank; a crossbow
    // keeps a step of room; out of burner fire; otherwise as close as it can get, by the route that gives away the fewest free swings
    const reach = reachSafe(u.x, u.y, (x,y) => free(x,y,u), u.mv, (x,y) => leaveCost(u, x, y));
    const swingW = u.hp <= 8 ? 110 : 70; // a badly hurt thing is warier of free swings
    let best = null, bestS = -Infinity;
    reach.forEach(n => {
      const here = {x:n.x, y:n.y}, tg = opp.filter(p => cheb(here, p) <= u.rng);
      let s = 0;
      if (tg.length) { s += 100; if (tg.some(p => flanked(u, p, here))) s += 60; }
      else s -= Math.min(...opp.map(p => cheb(here, p))) * 5;
      if (u.rng > 1) s -= opp.filter(p => cheb(here, p) === 1).length * 30;
      if (B.fires.some(f => f.x === n.x && f.y === n.y)) s -= 25;
      s -= n.c * swingW; s -= n.d;
      if (s > bestS) { bestS = s; best = n; }
    });
    let walked = false;
    if (best && best.d > 0) { if (!await aiWalk(u, best.path, gone)) return; walked = true; }
    else if (!inRange().length) {
      // nothing reachable in range this turn: close the distance along the shortest open path
      const path = findPath(u.x, u.y, (x,y) => free(x,y,u), (x,y) => opp.some(p => p.hp > 0 && cheb({x,y}, p) <= u.rng));
      if (path && path.length) { if (!await aiWalk(u, path.slice(0, u.mv), gone)) return; walked = true; }
    }
    if (u.hp <= 0) return done();
    if (walked && inRange().length) { await wait(140); if (gone()) return; } // a breath between arriving and striking, so the eye can follow
  }
  const tg = inRange().sort((a,b) => (flanked(u,b) - flanked(u,a)) || (a.hp - b.hp))[0];
  if (tg) { attack(u, tg); await wait(650); if (gone()) return;
    for (let i = 1; i < (u.attacks || 1); i++) { if (gone() || B.over || u.hp <= 0) break; // more than one blow a turn
      const nx = tg.hp > 0 && cheb(u, tg) <= u.rng ? tg : inRange().sort((a,b) => a.hp - b.hp)[0]; if (!nx) break; attack(u, nx, {verb:u.verb2 || 'cuts again at'}); await wait(650); } }
  if (gone()) return;
  done();
}

/* battle UI */
/* battle-only styles live with the battle code; added to the page once */
function battleStyle(){
  if (document.getElementById('bstyle')) return;
  const st = document.createElement('style'); st.id = 'bstyle';
  st.textContent = `.bhud{align-items:center}.bhud .bhead{min-width:0;flex:1 1 auto}
.bhud .loc{font-size:1.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bhud .sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;margin-top:2px}.bhud .sub.open{white-space:normal}
.objective b{color:#ffe0a0;font-weight:600;white-space:nowrap}
#order{gap:4px;-webkit-mask-image:linear-gradient(90deg,#000 86%,transparent);mask-image:linear-gradient(90deg,#000 86%,transparent)}
#order .chip{position:relative;overflow:hidden;padding:4px 8px 5px;cursor:pointer}
#order .chip i{position:absolute;left:0;bottom:0;height:2px;background:currentColor;opacity:.55}
#order .chip.now{background:rgba(201,151,63,.14)}
#order .chip.e.now{border-color:#e0574a;color:#f7b9ad;box-shadow:0 0 10px rgba(224,87,74,.3);background:rgba(224,87,74,.12)}
#order .chip.ally.now{border-color:#7f9ad0;color:#cfdcf5;box-shadow:0 0 10px rgba(127,154,208,.3)}
#order .chip.rnd{border-style:dashed;background:none;color:var(--dim);cursor:default}
.cvwrap canvas{margin:0 auto}
.ubar .uhead{align-items:center}
.ubar .tag{font-family:var(--label);font-size:.72rem;letter-spacing:.08em;padding:1px 7px;border:1px solid var(--line2);color:var(--mute);border-radius:2px}
.ubar .tag.you{color:#1a1208;background:var(--brass2);border-color:var(--brass2)}
.ubar .tag.foe{color:#f7b9ad;border-color:#6a2e28;background:rgba(224,87,74,.12)}
.ubar .tag.ally{color:#cfdcf5;border-color:#2a3a56}
.abil .btn small{opacity:.7;margin-left:4px;font-size:.78em}
.abil #bEnd{margin-left:auto}`;
  document.head.appendChild(st);
}
/* size the map to the screen: full width, but on a short phone shrink it (not below a thumb-sized tile) so the unit bar
   underneath stays on screen; then give the canvas a band of headroom so tall figures on the top row are not cut off */
function fitBattle(){
  const wrap = $('.cvwrap'), cv = $('#cv'); if (!wrap || !cv || !B) return;
  wrap.style.width = ''; wrap.style.marginInline = '';
  const full = wrap.clientWidth - 2, top = wrap.getBoundingClientRect().top + window.scrollY;
  const Tw = Math.max(16, Math.floor(full / 8)), Th = Math.floor((window.innerHeight - top - 175) / 10.5);
  const T = Math.min(Tw, Math.max(34, Th));
  if (T < Tw) { wrap.style.width = (T*8 + 2) + 'px'; wrap.style.marginInline = 'auto'; }
  fitCanvas(8, 10); battleHeadroom();
  B.fitW = window.innerWidth; B.fitH = window.innerHeight;
}
/* on a short phone, when a squadmate's turn starts, scroll just enough that their buttons are on screen, never past the top of the map */
function barInView(){
  const ub = $('#ubar'), wrap = $('.cvwrap'); if (!ub || !wrap || !$('#sheet').hidden) return;
  const over = ub.getBoundingClientRect().bottom - window.innerHeight + 8, room = wrap.getBoundingClientRect().top - 4;
  const by = Math.min(over, room); if (by > 4) window.scrollBy({top:by, behavior:REDUCE() ? 'auto' : 'smooth'});
}
function battleHeadroom(){
  const cv = $('#cv'); if (!cv || !G.ctx || G.cv !== cv) return;
  const T = G.T, H = Math.round(T * .5), dpr = G.dpr;
  cv.height = (10*T + H) * dpr; cv.style.height = (10*T + H) + 'px';
  G.ctx = cv.getContext('2d'); G.ctx.setTransform(dpr,0,0,dpr,0,0); G.oy = H;
  cv.onpointerdown = e => { if (view !== 'battle') return; const r = cv.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / T), y = Math.floor((e.clientY - r.top - H) / T); if (x >= 0 && y >= 0 && x < 8 && y < 10) battleTap(x, y); };
}
window.addEventListener('resize', () => { if (view !== 'battle' || !B) return; // a phone's address bar coming and going is not worth a re-layout
  if (Math.abs(window.innerWidth - (B.fitW || 0)) > 2 || Math.abs(window.innerHeight - (B.fitH || 0)) > 120) fitBattle(); else battleHeadroom(); });
const ukey = u => u.key || (u.key = 'u' + B.units.indexOf(u)); // one display slot per unit (two allies of a kind used to share one)
function updBattleUI(){
  if (!B || view !== 'battle') return;
  $('#bRound').textContent = B.surpriseRound ? 'Surprise round' : `Round ${Math.max(1, B.round)}`;
  // turn order, from whoever is acting now; then, past the round marker, who comes before them again
  const ord = B.order.length ? B.order : B.initOrder, i0 = Math.max(0, B.idx), alive = u => u.hp > 0;
  const chip = u => `<span class="chip ${u.side} ${u.ally ? 'ally' : ''} ${u === B.cur ? 'now' : ''}" data-u="${B.units.indexOf(u)}"><i style="width:${Math.round(u.hp / u.maxhp * 100)}%"></i>${esc(u.name)}</span>`;
  const nowList = ord.slice(i0).filter(alive), nextAll = (B.surpriseRound ? B.initOrder : ord).filter(alive), ci = B.cur ? nextAll.indexOf(B.cur) : -1;
  const nextList = B.round < 1 ? [] : ci >= 0 ? nextAll.slice(0, ci) : nextAll;
  $('#order').innerHTML = nowList.map(chip).join('') + (nextList.length ? `<span class="chip rnd">round ${B.round + 1}</span>` + nextList.map(chip).join('') : '');
  $('#blog').innerHTML = B.log.map(l => `<div>${l}</div>`).join('');
  const ob = B.def.objective;
  if ($('#objective') && ob) $('#objective').innerHTML = `${ob.text} · <b>${B.round >= ob.rounds && !B.over ? 'last round' : `round ${Math.max(1, Math.min(B.round, ob.rounds))} of ${ob.rounds}`}</b>`;
  const u = B.cur, ub = $('#ubar');
  B.reach = null; B.hl = {atk:new Set(), tgt:new Set(), aoo:new Set(), flank:new Set(), pct:new Map()};
  if (!u || B.over) { ub.innerHTML = `<div class="bhint">${B.over ? 'The fighting stops.' : 'Rolling initiative…'}</div>`; return; }
  if (u.side === 'e' || u.ally) { ub.innerHTML = `<div class="uhead"><b>${esc(u.name)}</b><span class="tag ${u.ally ? 'ally' : 'foe'}">${u.ally ? 'ally' : 'enemy turn'}</span><span class="stat hp">${u.hp}/${u.maxhp} health</span>${u.stun ? '<span class="stat">dazed</span>' : ''}</div><div class="bhint">${u.ally ? 'They fight for themselves. It happens to help.' : 'Watch the one ringed in red.'}</div>`; return; }
  const mvLeft = B.mvLeft ?? u.mv;
  if (!B.moved && !B.busy) B.reach = reachSafe(u.x, u.y, (x,y) => free(x,y,u), mvLeft, (x,y) => leaveCost(u, x, y));
  // enemies in reach: ringed, with the chance to hit (and whether it flanks)
  if (!B.acted) foes().forEach(f => { if (cheb(u,f) > u.rng) return; const c = atkCalc(u, f), k = K(f.x,f.y); B.hl.atk.add(k); B.hl.pct.set(k, hitPct(c)); if (c.fl) B.hl.flank.add(k); });
  // move tiles whose cheapest route still gives an enemy a free swing
  if (B.reach) B.reach.forEach(n => { if (n.d && n.c) B.hl.aoo.add(K(n.x,n.y)); });
  const inReach = B.hl.atk.size > 0, canMove = !!B.reach && B.reach.size > 1;
  let hint;
  if (!B.acted && !B.moved) hint = mvLeft < u.mv ? `${mvLeft} move left. Attacking now ends your movement.` : inReach ? 'Tap a gold tile to move, or a ringed enemy to attack.' : 'Tap a gold tile to move. Nothing is in reach yet.';
  else if (!B.acted) hint = inReach ? 'Out of moves. Tap a ringed enemy, use an ability, or end the turn.' : 'Out of moves, and nothing in reach. Use an ability or end the turn.';
  else hint = canMove ? `You can still move (${mvLeft}), or end the turn.` : 'Done.';
  if (B.hl.aoo.size && canMove) hint += ' <span class="warn">A red corner means a free swing on the way.</span>';
  if (B.mode && B.mode !== 'act') { const a = AB[B.mode];
    if (!a.aoe) { hint = `${a.desc()} Tap a highlighted target, or the button again to cancel.`; a.tiles(u).forEach(t => B.hl.tgt.add(K(t.x,t.y))); }
    else { for (let y=0;y<10;y++) for (let x=0;x<8;x++) if (!wall(x,y) && cheb(u,{x,y}) <= abRange(u,a)) B.hl.tgt.add(K(x,y));
      if (!B.aim) hint = `${a.desc()} Tap a tile to aim.`;
      else { const caught = B.units.filter(v => v.hp > 0 && cheb(v, B.aim) <= a.aoe), mine = caught.filter(v => v.side === 'p'), theirs = caught.length - mine.length;
        hint = `Tap the marked tile again to throw. ${theirs ? `It catches ${theirs === 1 ? 'one enemy' : theirs + ' enemies'}.` : 'No enemy in the blast.'}${mine.length ? ` <span class="warn">And ${mine.map(v => esc(v.name)).join(', ')}.</span>` : ''}`; } } }
  const buffs = [u.veilUntil >= B.round ? 'veiled' : '', u.rallyUntil >= B.round ? 'rallied' : ''].filter(Boolean).join(' · ');
  const endHot = B.acted || (B.moved && !inReach); // nothing much left: make End turn the obvious button
  ub.innerHTML = `<div class="uhead"><b>${esc(u.name)}</b><span class="tag you">your turn</span><span class="stat hp">${u.hp}/${u.maxhp} health</span>${u.magic ? `<span class="stat st">strain ${u.strain}/${STR_MAX}</span>` : ''}<span class="stat">${u.rng > 1 ? `range ${u.rng}` : 'melee'} · move ${mvLeft}/${u.mv}</span>${buffs ? `<span class="stat">${buffs}</span>` : ''}</div>
    <div class="bhint">${hint}</div>
    <div class="abil">${u.ab.map(k => { const a = AB[k]; const cnt = a.item ? `<small>×${S.inv[a.item] || 0}</small>` : ''; const dis = B.acted || !abOk(u,k);
      return `<button class="btn ${B.mode === k ? 'on' : ''}" id="ab_${k}" data-k="${k}" ${dis ? 'disabled' : ''}>${a.name}${cnt}</button>`; }).join('')}
      <button class="btn ${endHot ? 'primary' : ''}" id="bEnd">End turn</button></div>`;
  ub.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
    if (!B || B.busy || B.cur !== u) return; const k = b.dataset.k; AUDIO.play('click');
    if (B.mode === k) { B.mode = 'act'; B.aim = null; return updBattleUI(); }
    if (AB[k].self) return useAb(k, u.x, u.y);
    B.mode = k; B.aim = null; updBattleUI(); });
  $('#bEnd').onclick = () => { if (B && !B.busy && B.cur === u) { AUDIO.play('click'); endTurn(); } };
}
/* a safety net: if a turn has sat busy for a long while on screen (not counting time the app was in the background), hand it on */
function battleWatchdog(now){
  const dt = now - (B.wdLast || now); B.wdLast = now;
  const key = B.turn + (B.busy ? 'b' : 'f');
  if (!B.busy || B.over || key !== B.wdKey) { B.wdKey = key; B.wdT = 0; return; }
  if (dt < 250) B.wdT += dt;
  if (B.wdT < 20000 * Math.max(1, SET.speed)) return;
  B.wdT = 0; console.warn('battle: turn ' + B.turn + ' hung; moving on');
  if (B.cur && B.cur.side === 'p' && !B.cur.ally && B.cur.hp > 0) { B.busy = false; B.mode = 'act'; B.aim = null; updBattleUI(); } else endTurn();
}
function drawBattle(t){
  const {ctx, T} = G; if (!ctx || !B) return; const def = B.def, now = performance.now(), H = G.oy || 0, RM = REDUCE();
  battleWatchdog(now);
  // headroom above the top row: the ground fades up into the dark, so a tall figure standing on row one keeps its head
  if (H) { ctx.fillStyle = '#060505'; ctx.fillRect(0, 0, 8*T, H); ctx.globalAlpha = .5; ctx.drawImage(G.bgc, 0, 0, G.bgc.width, Math.round(H*G.dpr), 0, 0, 8*T, H); ctx.globalAlpha = 1;
    if (!G.hrg || G.hrgH !== H) { G.hrg = ctx.createLinearGradient(0, 0, 0, H); G.hrg.addColorStop(0, 'rgba(6,5,5,1)'); G.hrg.addColorStop(1, 'rgba(6,5,5,.45)'); G.hrgH = H; }
    ctx.fillStyle = G.hrg; ctx.fillRect(0, 0, 8*T, H); }
  ctx.save(); ctx.translate(0, H);
  ctx.drawImage(G.bgc, 0, 0, 8*T, 10*T);
  ctx.drawImage(G.dec, 0, 0, 8*T, 10*T);
  // burner fires
  B.fires.forEach(f => { const px = f.x*T, py = f.y*T; glow(ctx, px + T/2, py + T/2, T*1.1, '#ff7a3a', .35 + Math.sin(t/90 + f.x*3 + f.y)*.1);
    for (let i=0;i<4;i++){ const h = T*(.35 + hash(f.x,f.y,i)*.4)*(.7 + Math.sin(t/(60 + i*13) + i)*.3), bx = px + T*(.15 + i*.22); poly(ctx, [[bx - T*.08, py + T*.9],[bx + T*.08, py + T*.9],[bx + Math.sin(t/80 + i)*T*.05, py + T*.9 - h]], `rgba(255,${120 + i*25},40,.85)`); poly(ctx, [[bx - T*.04, py + T*.9],[bx + T*.04, py + T*.9],[bx, py + T*.9 - h*.5]], 'rgba(255,240,180,.8)'); }
    if (Math.random() < .3 && !RM && B.parts.length < 400) B.parts.push({x:f.x + Math.random(), y:f.y + .8, vx:(Math.random()-.5)*.1, vy:-.15 - Math.random()*.2, life:1, decay:.03, col:'#ffb060', size:1.5}); });
  const myTurn = B.cur && B.cur.side === 'p' && !B.cur.ally && !B.over;
  // ranged attack radius: tinted zone with a dashed border, only for the current player unit with a ranged weapon
  if (myTurn && !B.acted && B.cur.rng > 1 && !(B.mode && B.mode !== 'act')) {
    const u = B.cur, r = u.rng, x0 = Math.max(0, u.x - r), y0 = Math.max(0, u.y - r), x1 = Math.min(7, u.x + r), y1 = Math.min(9, u.y + r);
    const p = RM ? 0 : (Math.sin(t/420)+1)*.5;
    ctx.fillStyle = 'rgba(224,87,74,.07)'; ctx.fillRect(x0*T, y0*T, (x1-x0+1)*T, (y1-y0+1)*T);
    // fade the tint toward the edge of reach so the last tile reads as the limit
    for (let y=y0;y<=y1;y++) for (let x=x0;x<=x1;x++) { const d = cheb(u,{x,y}); if (d === r) { ctx.fillStyle = `rgba(224,87,74,${.09 + p*.05})`; ctx.fillRect(x*T+1, y*T+1, T-2, T-2); } }
    ctx.strokeStyle = `rgba(240,138,124,${.55 + p*.3})`; ctx.lineWidth = 2; ctx.setLineDash([6,4]); ctx.lineDashOffset = RM ? 0 : -t/60;
    ctx.strokeRect(x0*T + 1.5, y0*T + 1.5, (x1-x0+1)*T - 3, (y1-y0+1)*T - 3); ctx.setLineDash([]); ctx.lineDashOffset = 0;
    // small range tag on the border
    ctx.fillStyle = 'rgba(13,11,9,.85)'; ctx.font = `bold ${Math.round(T*.26)}px sans-serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    const tag = `range ${r}`, tw = ctx.measureText(tag).width + 8; ctx.fillRect(x0*T + 3, y0*T + 3, tw, T*.34); ctx.fillStyle = '#f08a7c'; ctx.fillText(tag, x0*T + 7, y0*T + 5); ctx.textBaseline = 'alphabetic';
  }
  if (B.reach) B.reach.forEach(n => { if (n.d === 0) return; const bad = B.hl && B.hl.aoo && B.hl.aoo.has(K(n.x,n.y));
    ctx.fillStyle = bad ? 'rgba(201,120,63,.16)' : 'rgba(201,151,63,.14)'; ctx.fillRect(n.x*T+1, n.y*T+1, T-2, T-2);
    ctx.strokeStyle = bad ? 'rgba(240,138,124,.75)' : 'rgba(232,192,115,.4)'; ctx.lineWidth = bad ? 1.5 : 1; ctx.strokeRect(n.x*T+1.5, n.y*T+1.5, T-3, T-3);
    if (bad) { ctx.fillStyle = 'rgba(240,138,124,.9)'; ctx.beginPath(); ctx.moveTo(n.x*T+T-2, n.y*T+2); ctx.lineTo(n.x*T+T-2, n.y*T+T*.3); ctx.lineTo(n.x*T+T-T*.3, n.y*T+2); ctx.fill(); } });
  if (B.hl) B.hl.tgt.forEach(k => { const [x,y] = k.split(',').map(Number); ctx.fillStyle = 'rgba(154,134,224,.18)'; ctx.fillRect(x*T+1, y*T+1, T-2, T-2); });
  if (B.aim) { const a = AB[B.mode]; const r = a ? a.aoe : 1, p = RM ? .5 : (Math.sin(t/200)+1)*.5;
    ctx.fillStyle = `rgba(224,87,74,${.18 + p*.1})`; ctx.fillRect((B.aim.x-r)*T, (B.aim.y-r)*T, (2*r+1)*T, (2*r+1)*T);
    ctx.strokeStyle = 'rgba(240,138,124,.6)'; ctx.lineWidth = 1; ctx.strokeRect((B.aim.x-r)*T + .5, (B.aim.y-r)*T + .5, (2*r+1)*T - 1, (2*r+1)*T - 1);
    ctx.strokeStyle = '#f08a7c'; ctx.lineWidth = 2; ctx.setLineDash([4,3]); ctx.strokeRect(B.aim.x*T+2, B.aim.y*T+2, T-4, T-4); ctx.setLineDash([]); }
  // corpses first
  B.units.filter(u => u.hp <= 0).forEach(u => { const k = clamp((now - (u.deadAt || 0)) / 900, 0, 1); const d = dispOf(ukey(u), u.x, u.y);
    ctx.save(); ctx.translate(d.x*T + T/2, d.y*T + T*.6); ctx.rotate(ease(k) * Math.PI/2 * (u.facing || 1)); ctx.globalAlpha = 1 - k*.55; drawFigure(ctx, u.kind, 0, 0, T/32*(u.boss ? 1.3 : 1), t, {still:true}); ctx.restore(); });
  // living units
  const cur = B.cur, labels = [];
  B.units.filter(u => u.hp > 0).sort((a,b) => a.y - b.y).forEach(u => {
    const d = dispOf(ukey(u), u.x, u.y);
    let ox = 0, oy = 0;
    if (B.anim && B.anim.u === u) { const k = (now - B.anim.t0) / (280 * SET.speed); if (k >= 1) B.anim = null; else { const s = Math.sin(k * Math.PI) * .45; ox = (B.anim.tx - u.x) * s; oy = (B.anim.ty - u.y) * s; } }
    const cx = (d.x + ox)*T + T/2, cy = (d.y + oy)*T + T*.6, sc = T/32*(u.boss ? 1.3 : 1);
    if (u === cur && !B.over) { // whose turn: gold for the squad, red for an enemy, blue for an ally, and a ripple as the turn starts
      const col = u.side === 'e' ? '240,138,124' : u.ally ? '159,179,217' : '232,192,115', p = RM ? 0 : (Math.sin(t/260)+1)*.5;
      ctx.strokeStyle = `rgba(${col},${.5+p*.45})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy - T*.02, T*.42 + p*2, T*.17 + p, 0, 0, 7); ctx.stroke();
      const k = (now - (B.turnAt || 0)) / 550; if (k < 1 && !RM) { ctx.strokeStyle = `rgba(${col},${(1-k)*.8})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy - T*.02, T*(.42 + k*.5), T*(.17 + k*.2), 0, 0, 7); ctx.stroke(); } }
    if (B.ping && B.ping.u === u && now - B.ping.t < 1200) { const k = (now - B.ping.t) / 1200; ctx.strokeStyle = `rgba(233,223,201,${(1-k)*.9})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy - T*.02, T*(.46 + (RM ? 0 : Math.sin(k*Math.PI*3)*.06)), T*.2, 0, 0, 7); ctx.stroke(); }
    if (u.side === 'p') glow(ctx, cx, cy - T*.4, T*1.6, '#e8b060', .06);
    if (u.veilUntil >= B.round) { glow(ctx, cx, cy - T*.4, T*.9, '#9a86e0', .25); }
    if (u.markedUntil >= B.round) { ctx.strokeStyle = 'rgba(242,196,107,.8)'; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]); ctx.beginPath(); ctx.ellipse(cx, cy + T*.04, T*.4, T*.16, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
    const arrive = u.arrived ? clamp((now - u.arrived) / 450, 0, 1) : 1;
    drawFigure(ctx, u.kind, cx, cy, sc, t, {phase:u.x*3 + u.y, dir:u.facing || (u.side === 'e' ? -1 : 1), still:u.stun, alpha:RM ? 1 : .15 + arrive*.85});
    if (u.flash && now - u.flash < 160) { ctx.globalCompositeOperation = 'lighter'; ell(ctx, cx, cy - T*.4, T*.35, T*.45, `rgba(255,120,100,${(1 - (now - u.flash)/160)*.6})`); ctx.globalCompositeOperation = 'source-over'; }
    if (u.healed && now - u.healed < 500) glow(ctx, cx, cy - T*.4, T*.9, '#9fe0b8', (1 - (now - u.healed)/500)*.4);
    const k = K(u.x,u.y);
    if (B.hl && B.hl.atk.has(k) && myTurn) { ctx.strokeStyle = '#f08a7c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy - T*.02, T*.44, T*.18, 0, 0, 7); ctx.stroke();
      labels.push({x:cx, y:cy - T*(u.boss ? 1.18 : .98), txt:`${B.hl.pct.get(k)}%${B.hl.flank.has(k) ? ' · flank' : ''}`, col:B.hl.flank.has(k) ? '#f2c46b' : '#f4c2b8'}); }
    const w = T*.7, px = cx - w/2, py = cy + T*.3; ctx.fillStyle = '#0d0b09'; ctx.fillRect(px, py, w, Math.max(3, T*.08));
    ctx.fillStyle = u.side === 'p' ? (u.ally ? '#8fa6cf' : '#7fb394') : '#d9695a'; ctx.fillRect(px, py, w * u.hp / u.maxhp, Math.max(3, T*.08));
    if (u.stun) { ctx.fillStyle = '#e9dfc9'; ctx.font = `${Math.round(T*.3)}px sans-serif`; ctx.textAlign = 'left'; ctx.fillText('z', cx + T*.3, cy - T*.7 + Math.sin(t/300)*2); }
  });
  // darkness: lantern light around the party (the layer covers the headroom band too)
  if (def.dark) {
    const layer = G.darkc || (G.darkc = document.createElement('canvas')), lw = Math.round(8*T*G.dpr), lh = Math.round((10*T + H)*G.dpr);
    if (layer.width !== lw || layer.height !== lh) { layer.width = lw; layer.height = lh; }
    const lc = layer.getContext('2d'); lc.setTransform(G.dpr,0,0,G.dpr,0,0); lc.globalCompositeOperation = 'source-over'; lc.clearRect(0,0,8*T,10*T + H); lc.fillStyle = 'rgba(8,5,14,.86)'; lc.fillRect(0,0,8*T,10*T + H);
    lc.globalCompositeOperation = 'destination-out'; lc.translate(0, H);
    const lamp = (x, y, r) => { const g = lc.createRadialGradient(x, y, r*.2, x, y, r); g.addColorStop(0,'rgba(0,0,0,1)'); g.addColorStop(.6,'rgba(0,0,0,.7)'); g.addColorStop(1,'rgba(0,0,0,0)'); lc.fillStyle = g; lc.fillRect(x-r, y-r, r*2, r*2); };
    const fl = RM ? 1 : 1 + Math.sin(t/110)*.04 + Math.sin(t/43)*.03;
    party().forEach(u => { const d = G.disp[ukey(u)] || u; lamp(d.x*T + T/2, d.y*T + T/2, T*(u.kind === 'kettle' ? 3.2 : 2.3)*fl); });
    B.fires.forEach(f => lamp(f.x*T + T/2, f.y*T + T/2, T*2.2*fl));
    B.units.filter(u => u.side === 'e' && u.hp > 0).forEach(u => { const d = G.disp[ukey(u)] || u; lamp(d.x*T + T/2, d.y*T + T/2, T*(u.ai === 'raest' ? 2.2 : u.kind === 'rime' ? 1.3 : u === cur ? 1.3 : .9)); }); // the Tyrant and his dead carry their own cold light; whoever is acting shows
    ctx.drawImage(layer, 0, 0, lw, lh, 0, -H, 8*T, 10*T + H);
    if (!RM) for (let i=0;i<8;i++) ell(ctx, hash(i,3)*8*T + Math.sin(t/3000 + i)*T, (hash(i,4)*10*T + t*.01) % (10*T), T*1.4, T*.4, 'rgba(60,45,100,.06)');
  }
  // hit chances over the enemies in reach, above the dark
  if (labels.length) { const fs = Math.max(10, Math.round(T*.24)); ctx.font = `bold ${fs}px 'Alegreya Sans', sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    labels.forEach(l => { const tw = ctx.measureText(l.txt).width + 8; ctx.fillStyle = 'rgba(13,11,9,.85)'; ctx.fillRect(l.x - tw/2, l.y - fs - 1, tw, fs + 5); ctx.fillStyle = l.col; ctx.fillText(l.txt, l.x, l.y + 1); }); }
  // particles
  B.parts = B.parts.filter(p => p.life > 0);
  B.parts.forEach(p => { p.x += p.vx*.06; p.y += p.vy*.06; p.vy += .02; p.life -= p.decay; ctx.globalAlpha = clamp(p.life, 0, 1); ctx.fillStyle = p.col; ctx.fillRect(p.x*T, p.y*T, p.size, p.size); }); ctx.globalAlpha = 1;
  // effects
  B.fx = B.fx.filter(f => now - f.t < (f.dur ? f.dur + 40 : 950));
  B.fx.forEach(f => { if (now < f.t) return; const k = clamp((now - f.t) / (f.dur || 950), 0, 1);
    if (f.kind === 'boom') { ctx.globalAlpha = (1 - k) * .9; ctx.fillStyle = f.col; const s = (f.r + .5) * T * (0.4 + k*.7); ctx.beginPath(); ctx.arc(f.x*T + T/2, f.y*T + T/2, s, 0, 7); ctx.fill(); ctx.globalAlpha = (1 - k) * .5; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x*T + T/2, f.y*T + T/2, s*1.3, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; glow(ctx, f.x*T + T/2, f.y*T + T/2, s*2.5, f.col, (1-k)*.4); }
    else if (f.kind === 'ring') { ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.col; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(f.x*T + T/2, f.y*T + T*.6, T*(.3 + k*.7), T*(.12 + k*.28), 0, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
    else if (f.kind === 'bolt') { const x = lerp(f.from.x, f.to.x, k)*T + T/2, y = lerp(f.from.y, f.to.y, k)*T + T*.5 + (f.wob ? Math.sin(k*20)*T*.15 : 0); ctx.strokeStyle = f.col; ctx.lineWidth = f.wob ? 2.5 : 1.5; ctx.beginPath(); ctx.moveTo(lerp(f.from.x, f.to.x, Math.max(0,k-.15))*T + T/2, lerp(f.from.y, f.to.y, Math.max(0,k-.15))*T + T*.5); ctx.lineTo(x, y); ctx.stroke(); if (f.wob) glow(ctx, x, y, T*.6, f.col, .5); }
    else if (f.kind === 'lance') { const x0 = f.from.x*T + T/2, y0 = f.from.y*T + T*.3, x1 = f.to.x*T + T/2, y1 = f.to.y*T + T*.45, a = k < .6 ? 1 : 1 - (k - .6)/.4, reach = clamp(k*3, 0, 1);
      const xe = lerp(x0, x1, reach), ye = lerp(y0, y1, reach); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
      for (let j=0;j<3;j++){ ctx.strokeStyle = j === 2 ? `rgba(255,255,255,${a*.9})` : rgba(f.col, a*(j ? .7 : .3)); ctx.lineWidth = j === 0 ? T*.34 : j === 1 ? T*.12 : T*.04; ctx.beginPath(); ctx.moveTo(x0, y0);
        for (let q=1;q<=8;q++){ const kk = q/8; ctx.lineTo(lerp(x0, xe, kk) + (q < 8 ? (hash(q, j, Math.floor(now/60)) - .5)*T*.3 : 0), lerp(y0, ye, kk) + (q < 8 ? (hash(j, q, Math.floor(now/60)) - .5)*T*.3 : 0)); } ctx.stroke(); }
      glow(ctx, x0, y0, T*1.2, f.col, a*.5); glow(ctx, xe, ye, T*1.6, f.col, a*.6); ctx.restore(); }
    else if (f.kind === 'arc') { const x = lerp(f.from.x, f.to.x, k)*T + T/2, y = lerp(f.from.y, f.to.y, k)*T + T/2 - (f.drop ? 0 : Math.sin(k*Math.PI)*T*1.6); if (k < 1) { ell(ctx, x, y, T*.12, T*.12, '#3a3230'); ctx.fillStyle = '#ffb060'; ctx.fillRect(x + T*.08, y - T*.16 - Math.random()*3, 2, 2); } }
    else if (f.kind === 'txt') { const big = f.big, fs = Math.round(T*(big ? .5 : .36)); ctx.globalAlpha = 1 - k*k; ctx.fillStyle = f.col; ctx.font = `700 ${fs}px 'Alegreya Sans', sans-serif`; ctx.textAlign = 'center'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
      const pop = big && !RM ? 1 + Math.max(0, .35 - k)*1.2 : 1; if (pop !== 1) { ctx.save(); ctx.translate(f.x*T + T/2, f.y*T + T*.3 - k*T*.55); ctx.scale(pop, pop); ctx.fillText(f.txt, 0, 0); ctx.restore(); }
      else ctx.fillText(f.txt, f.x*T + T/2, f.y*T + T*.3 - k*T*.55); ctx.shadowBlur = 0; ctx.globalAlpha = 1; } });
  // vignette
  if (!G.vig || G.vigT !== T) { G.vig = ctx.createRadialGradient(4*T, 5*T, T*3, 4*T, 5*T, T*7); G.vig.addColorStop(0, 'rgba(0,0,0,0)'); G.vig.addColorStop(1, 'rgba(0,0,0,.55)'); G.vigT = T; }
  ctx.fillStyle = G.vig; ctx.fillRect(0, -H, 8*T, 10*T + H);
  // the end of the fight: a banner across the middle of the field
  if (B.banner) { const k = clamp((now - B.banner.t) / 450, 0, 1), a = RM ? 1 : ease(k), by = 4.2*T, bh = 1.6*T;
    ctx.globalAlpha = a*.82; ctx.fillStyle = '#0a0807'; ctx.fillRect(0, by, 8*T, bh); ctx.globalAlpha = a;
    ctx.fillStyle = B.banner.col; ctx.fillRect(T*(4 - 3.2*a), by + 3, T*6.4*a, 1); ctx.fillRect(T*(4 - 3.2*a), by + bh - 4, T*6.4*a, 1);
    ctx.font = `${Math.round(T*.72)}px 'IM Fell English SC', Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = B.banner.col; ctx.shadowBlur = 18;
    ctx.fillText(B.banner.txt, 4*T, by + bh/2 + (1 - a)*T*.25); ctx.shadowBlur = 0; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 1; }
  ctx.restore();
}
