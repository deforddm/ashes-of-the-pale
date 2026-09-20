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
function blog(m){ B.log.unshift(m); B.log = B.log.slice(0,5); const el = $('#blog'); if (el) el.innerHTML = B.log.map(l => `<div>${l}</div>`).join(''); }
function float(u, txt, col){ B.fx.push({kind:'txt', x:u.x, y:u.y, txt, col, t:performance.now()}); }
function hurt(u, n){ u.hp = Math.max(0, u.hp - n); float(u, '−'+n, '#f08a7c'); u.flash = performance.now(); bloodDecal(u.x, u.y, n >= 8);
  if (u.side === 'p') redFlash(); if (n >= 8) shakeMap();
  if (u.hp === 0) { u.deadAt = performance.now(); AUDIO.play('death'); blog(u.side === 'p' ? `<em>${u.name} goes down!</em>` : `${u.name} falls.`); } else AUDIO.play('hurt'); }
function heal(u, n){ const before = u.hp; u.hp = Math.min(u.maxhp, u.hp + n); float(u, '+'+(u.hp-before), '#9fe0b8'); u.healed = performance.now(); }
function sparks(x, y, n, col, spd = 1){ if (REDUCE()) return; for (let i=0;i<n;i++){ const a = Math.random()*7, s = (Math.random()*.6 + .3)*spd; B.parts.push({x:x + .5, y:y + .5, vx:Math.cos(a)*s, vy:Math.sin(a)*s - .3, life:1, decay:.02 + Math.random()*.03, col, size:1 + Math.random()*2}); } }

function mkParty(id, x, y){
  const t = TPL[id], L = S.lvl - 1;
  const u = {id, side:'p', name:NAME(id), sig:t.sig, col:t.col, maxhp:t.hp + L*4 + (S.card === 'obelisk' ? 4 : 0), ac:t.ac, atk:t.atk + L, dmg:t.dmg, rng:t.rng, mv:t.mv + (S.card === 'hounds' ? 1 : 0), init:t.init, ab:[...t.ab], magic:t.magic, strain:0, verb:VERB[id], x, y, kind:id};
  // gear
  Object.values(S.gear[id] || {}).forEach(g => { const it = ITEMS[g]; if (!it) return; u.ac += it.ac || 0; u.atk += it.atk || 0; u.maxhp += it.hp || 0; u.mv += it.mv || 0; u.rng += it.rng || 0; if (it.dmg) u.dmg = it.dmg; });
  // veteran picks and talents
  if (has(id,'iron')) u.maxhp += 6; if (has(id,'keen')) u.atk += 1; if (has(id,'fleet')) u.mv += 1; if (has(id,'nerve')) u.init += 1;
  ['quorl','shadowstep','mockra','argument'].forEach(k => { if (has(id,k)) u.ab.splice(u.ab.length - 1, 0, k); }); // before Salve
  u.hp = u.maxhp; return u;
}
function mkFoe(k, x, y, extra=0){ const f = FOES[k]; return {id:k, kind:k, side:'e', ...f, maxhp:f.hp+extra, hp:f.hp+extra, col:'#d9695a', x, y}; }
function mkAlly(k, x, y){ const f = FOES[k]; return {id:'ally_' + k, kind:k, side:'p', ally:true, ...f, name:f.name + ' (ally)', maxhp:f.hp, hp:f.hp, col:'#9fb3d9', x, y, ab:[]}; }
function freeNear(x, y, self){ if (free(x,y,self)) return {x,y}; for (let r=1;r<4;r++) for (const [dx,dy] of DIRS) { const nx = x+dx*r, ny = y+dy*r; if (free(nx,ny,self)) return {x:nx,y:ny}; } return null; }

function startBattle(id, opt={}){
  S.scene = 'battle'; S.battle = id; S.bopt = opt; S.node = null; S.bg = 'tunnel'; save();
  const snap = JSON.stringify(S);
  const def = BATTLES[id];
  view = 'battle'; AUDIO.setScene(def.music || 'battle');
  B = {def, id, opt, snap, warren:def.warren, units:[], order:[], idx:-1, round:0, fires:[], fx:[], parts:[], log:[], used:{}, cur:null, moved:false, acted:false, mode:null, aim:null, busy:true, over:false, turn:0, anim:null};
  SQUAD().forEach((pid,i) => { const p = def.party[i] || def.party[def.party.length - 1]; const at = freeNear(p[0], p[1]) || {x:p[0], y:p[1]}; B.units.push(mkParty(pid, at.x, at.y)); });
  (def.allies || []).forEach(a => { const at = freeNear(a[1], a[2]); if (at) B.units.push(mkAlly(a[0], at.x, at.y)); });
  def.foes.forEach((f,i) => { if (opt.drop && opt.drop.includes(i)) return; B.units.push(mkFoe(f[0], f[1], f[2], f[0]==='stone' && S.f.noisy ? 10 : 0)); });
  const squadInit = SQUAD().some(id => has(id,'sappers_eye')) ? 2 : 0;
  const initRoll = u => d20() + u.init + (u.side === 'p' ? squadInit : 0);
  B.units.forEach(u => u.ini = initRoll(u));
  B.initOrder = [...B.units].sort((a,b) => b.ini - a.ini);
  B.surprise = opt.surprise || null;
  $('#app').innerHTML = `<header class="hud"><div><div class="loc">${def.title}</div><div class="sub warren">${def.warrenText}</div></div><div class="hudr"><span id="bRound"></span>${hudButtons()}</div></header>
    ${def.objective ? `<div class="objective" id="objective"></div>` : ''}
    <div class="order" id="order"></div>
    <div class="cvwrap"><canvas id="cv" aria-label="Battle map"></canvas></div>
    <div class="ubar" id="ubar"></div>
    <div class="log" id="blog"></div>`;
  bindHud();
  G.disp = {};
  fitCanvas(8, 10);
  if (opt.pre) { AUDIO.play('boom', .8); B.fx.push({kind:'boom', x:3.5, y:1, r:1, col:'#f2c46b', t:performance.now()}); sparks(3.5, 1, 30, '#f2c46b'); shakeMap(); foes().forEach(f => hurt(f, roll(1,10))); blog(`Kettle's sharper skips across the floor and goes off in the middle of them. The whole tunnel hears it.`); }
  if (def.objective) blog(`<em>${def.objective.text}</em>`);
  if (def.allies && def.allies.length) blog(`Others fight beside you tonight. They are not yours.`);
  if (B.surprise === 'p') blog(`Surprise: your squad moves first.`);
  if (B.surprise === 'e') { blog(`<em>Something moves before you do.</em>`); if (id === 'stone' || def.foes.some(f => f[0] === 'hound')) AUDIO.play('growl'); }
  setTimeout(nextTurn, 500);
}
function newRound(){
  B.round++; B.idx = 0;
  const ob = B.def.objective;
  if (ob && ob.type === 'survive' && B.round > ob.rounds && !B.over) { B.over = true; blog(`<em>Held.</em>`); setTimeout(win, 700); return; }
  // reinforcements
  (B.def.waves || []).filter(w => w.round === B.round).forEach(w => {
    w.foes.forEach(f => { const at = freeNear(f[1], f[2]); if (!at) return; const u = mkFoe(f[0], at.x, at.y); u.ini = d20() + u.init; B.units.push(u); B.initOrder.push(u); sparks(at.x, at.y, 24, '#9a86e0', .8); });
    if (w.text) blog(`<em>${w.text}</em>`); AUDIO.play('growl'); shakeMap(); });
  if (B.surprise) { B.order = B.initOrder.filter(u => u.side === B.surprise); B.surprise = null; B.surpriseRound = true; }
  else { B.order = B.initOrder; B.surpriseRound = false; }
  B.fires = B.fires.filter(f => f.until >= B.round);
}
function nextTurn(){
  if (checkEnd()) return;
  B.idx++;
  if (B.idx >= B.order.length) newRound();
  const u = B.order[B.idx];
  if (!u || u.hp <= 0) return nextTurn();
  B.cur = u; B.moved = false; B.mvLeft = u.mv; B.acted = false; B.mode = null; B.aim = null; B.turn++;
  if (u.strain) u.strain = Math.max(0, u.strain - 1);
  if (B.fires.some(f => f.x === u.x && f.y === u.y)) { blog(`${u.name} is caught in burner fire.`); hurt(u, roll(1,6)); }
  if (u.hp <= 0) { updBattleUI(); if (checkEnd()) return; return setTimeout(nextTurn, 600); }
  if (u.stun) { u.stun = false; blog(`${u.name} is dazed and loses the turn.`); updBattleUI(); return setTimeout(nextTurn, 800); }
  if (u.side === 'p' && !u.ally) { B.busy = false; B.mode = 'act'; updBattleUI(); }
  else { B.busy = true; updBattleUI(); setTimeout(() => ai(u, B.turn), 550 * SET.speed); }
}
function endTurn(){ if (!B || B.over) return; B.busy = true; B.mode = null; B.aim = null; setTimeout(nextTurn, 250); }
function checkEnd(){
  if (!B || B.over) return true;
  const ob = B.def.objective;
  if (!foes().length && !(ob && ob.type === 'survive' && (B.def.waves || []).some(w => w.round > B.round))) { B.over = true; setTimeout(win, 900); return true; }
  if (!squadUnits().length) { B.over = true; setTimeout(lose, 1100); return true; }
  return false;
}
function win(){
  const up = gainXP(B.def.xp);
  S.scene = 'talk'; save(); AUDIO.play('win');
  note(`${B.def.objective ? 'Held' : 'Victory'}. +${B.def.xp} experience. Ohl patches up the squad; everyone is back on their feet.`, 'good');
  if (up) note(`The squad reaches level ${S.lvl}: +4 health and +1 to hit for everyone.`, 'good');
  updBattleUI();
  talk(B.def.after);
}
function lose(){
  AUDIO.play('lose');
  const sh = $('#sheet'); sh.hidden = false;
  sh.innerHTML = `<div class="sp">The squad goes down in the dark</div><div class="txt"><p>Hood's gate is a long walk, and no one in the Fourth is in a hurry to make it. Try it again.</p></div>
    <div class="choices"><button class="choice" id="bRetry">Retry the fight</button></div>`;
  $('#bRetry').onclick = () => { AUDIO.play('click'); sh.hidden = true; S = JSON.parse(B.snap); startBattle(S.battle, S.bopt || {}); };
}

/* abilities */
const AB = {
  rally:{name:'Rally', self:true, desc:()=>'Squadmates within 3 heal 4 and get +2 to hit through next round. Once per fight.', ok:()=>!B.used.rally,
    run(u){ B.used.rally = 1; AUDIO.play('heal'); party().forEach(p => { if (cheb(u,p) <= 3) { heal(p,4); p.rallyUntil = B.round + 1; } }); blog(`${u.name}: "On me, you sorry lot!" The squad steadies.`); }},
  bash:{name:'Shield bash', desc:()=>'Adjacent enemy: 1d6+3 damage, and it loses its next turn on a hit. Recharges after 2 rounds.', ok:u=>!(u.cdBash >= B.round),
    tiles:u=>foes().filter(f => cheb(u,f) === 1),
    run(u,x,y){ const t = unitAt(x,y); u.cdBash = B.round + 2; const r = attack(u, t, {dmg:[1,6,3], verb:'shield-bashes'}); if (r.hit && t.hp > 0) { t.stun = true; blog(`${t.name} reels, dazed.`); } }},
  sharper:{name:'Sharper', item:'sharper', aoe:1, range:4, desc:()=>'Throw, range 4. 1d10+2 where it lands and 1d6 to everything next to it, squad included. A natural 1 scatters it.',
    run(u,x,y){ const pt = scatter(u,x,y,1,1); throwArc(u, pt, () => { blast(pt, [[1,10,2],[1,6,0]], '#f2c46b'); AUDIO.play('boom', .8); sparks(pt.x, pt.y, 26, '#f2c46b'); }); blog(`${u.name} lobs a sharper.`); }},
  burner:{name:'Burner', item:'burner', aoe:1, range:4, desc:()=>'Throw, range 4. 1d6 to everything in a 3×3 and leaves it burning for 2 rounds. A natural 1 scatters it.',
    run(u,x,y){ const pt = scatter(u,x,y,1,1); throwArc(u, pt, () => { blast(pt, [[1,6,0],[1,6,0]], '#ff7a3a'); AUDIO.play('burner'); sparks(pt.x, pt.y, 30, '#ff9a3a', .6);
      for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) if (!wall(pt.x+dx, pt.y+dy)) B.fires.push({x:pt.x+dx, y:pt.y+dy, until:B.round+2}); });
      blog(`${u.name} throws a burner. The tunnel fills with orange light.`); }},
  cusser:{name:'Cusser', item:'cusser', aoe:2, range:3, desc:()=>'Throw, range 3. 3d8 to the centre and everything next to it, 1d8 one step further. Scatters on a 1–2. It\'s a cusser.',
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
  /* talents (level 3 picks) */
  quorl:{name:'Quorl Signal', aoe:1, range:5, desc:()=>'Once a fight: a Moranth drop. A sharper from the sky, range 5, not from the satchel.', ok:()=>!B.used.quorl,
    run(u,x,y){ B.used.quorl = 1; const pt = {x,y}; AUDIO.play('bow'); setTimeout(() => { blast(pt, [[1,10,2],[1,6,0]], '#f2c46b'); AUDIO.play('boom', .8); sparks(pt.x, pt.y, 26, '#f2c46b'); }, 500 * SET.speed); blog(`${u.name} shows a lamp to the sky. Something with wings answers.`); }},
  shadowstep:{name:'Shadow Step', strain:1, desc:()=>'Step through Meanas to any free tile within 4. No free swings. Strain 1.', tiles:u=>{ const out = []; for (let y=0;y<10;y++) for (let x=0;x<8;x++) if (cheb(u,{x,y}) <= 4 && free(x,y,u) && !(x === u.x && y === u.y)) out.push({x,y,step:true}); return out; },
    run(u,x,y){ AUDIO.play('shadow'); sparks(u.x, u.y, 12, '#c9bbff', .4); u.x = x; u.y = y; sparks(x, y, 12, '#c9bbff', .4); blog(`${u.name} is somewhere else.`); }},
  mockra:{name:'Mockra Whisper', strain:2, desc:()=>'An enemy within 4 hears something it believes and loses its next turn. Bosses resist on 12+. Strain 2.', tiles:u=>foes().filter(f => cheb(u,f) <= 4),
    run(u,x,y){ const t = unitAt(x,y); AUDIO.play('shadow'); B.fx.push({kind:'bolt', from:{x:u.x,y:u.y}, to:{x:t.x,y:t.y}, col:'#c9bbff', t:performance.now(), dur:400, wob:true});
      if (t.boss && d20() >= 12) { blog(`${t.name} shakes the whisper off.`); float(t,'resists','#a99a88'); } else { t.stun = true; blog(`${t.name} stops to listen to something that is not there.`); float(t,'dazed','#c9bbff'); } }},
  argument:{name:'Argument with Hood', strain:3, desc:()=>'Once a fight: a downed squadmate within 2 stands up at 6 health. Strain 3.', ok:()=>!B.used.argument,
    tiles:u=>B.units.filter(p => p.side === 'p' && !p.ally && p.hp <= 0 && cheb(u,p) <= 2),
    run(u,x,y){ const t = B.units.find(p => p.side === 'p' && p.hp <= 0 && p.x === x && p.y === y); if (!t) return; B.used.argument = 1; AUDIO.play('heal'); t.hp = 6; t.deadAt = null; t.healed = performance.now(); sparks(t.x, t.y, 20, '#9fe0b8', .5); blog(`${u.name} argues with Hood in Ehrlii. ${t.name} gets up, which settles it for now.`); }},
};
function abOk(u, k){ const a = AB[k]; if (a.item && S.inv[a.item] <= 0) return false; if (a.ok && !a.ok(u)) return false; if (a.tiles && !a.tiles(u).length) return false; return true; }
function scatter(u, x, y, failOn, dist){
  const nat = d20() + (S.card === 'oponn' ? 1 : 0);
  if (nat <= failOn && !has(u.id,'longfuse')) { const [dx,dy] = DIRS[R(8)]; let nx = x, ny = y;
    for (let i=0;i<dist;i++) if (!wall(nx+dx, ny+dy)) { nx += dx; ny += dy; }
    blog(`<em>The throw goes wide!</em>`); return {x:nx, y:ny}; }
  return {x, y};
}
function throwArc(u, pt, then){ B.fx.push({kind:'arc', from:{x:u.x,y:u.y}, to:pt, t:performance.now(), dur:REDUCE() ? 1 : 420}); B.pendingBlast = then; }
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
function provokes(u, from, to){ return threatsAt(u, from.x, from.y).filter(e => (!to || cheb(e, to) > 1) && (e.aooTurn !== B.turn || (e.side === 'p' && !e.ally && has(e.id,'holdline')))); }
function attack(a, t, o={}){
  const nat = d20(), mine = a.side === 'p';
  const fl = !o.aoo && flanked(a, t);
  const wallBonus = t.side === 'p' && friendsOf(t).some(f => !f.ally && has(f.id,'shieldwall') && cheb(f,t) === 1) ? 2 : 0;
  const discipline = t.side === 'p' && !t.ally && SQUAD().some(id => has(id,'discipline')) ? 1 : 0;
  const aooBonus = o.aoo && !a.ally && a.side === 'p' && (has(a.id,'holdline') || has(a.id,'sappers_eye')) ? 2 : 0;
  const bonus = a.atk + (mine && S.card === 'oponn' ? 1 : 0) + (mine && a.rallyUntil >= B.round ? 2 : 0) + (!mine && S.card === 'knight' ? -1 : 0) + (fl ? 2 : 0) + aooBonus;
  const ac = t.ac + (t.veilUntil >= B.round ? veilPen() : 0) + wallBonus + discipline;
  const crit = nat >= (mine && S.card === 'assassin' ? 19 : 20);
  const hit = crit || (nat !== 1 && nat + bonus >= ac);
  const verb = o.verb || a.verb;
  const ranged = cheb(a, t) > 1;
  if (ranged) B.fx.push({kind:'bolt', from:{x:a.x,y:a.y}, to:{x:t.x,y:t.y}, col:a.kind === 'tuft' ? '#9a86e0' : '#cfc8b8', t:performance.now(), dur:220, wob:a.kind === 'tuft'});
  else B.anim = {u:a, tx:t.x, ty:t.y, t0:performance.now()};
  a.facing = t.x >= a.x ? 1 : -1;
  AUDIO.play(a.kind === 'tuft' ? 'shadow' : a.kind === 'kettle' || a.kind === 'xbow' ? 'bow' : hit ? 'sword' : 'miss');
  const math = SET.dice ? ` <span class="stat">(${nat}+${bonus} vs ${ac})</span>` : '';
  const tags = [o.aoo ? 'free attack' : '', fl ? 'flanking +2' : ''].filter(Boolean).join(', ');
  const tagTxt = tags ? ` <span class="stat">[${tags}]</span>` : '';
  if (!hit) { blog(`${a.name} ${verb} ${t.name} and misses${tagTxt}${math}.`); float(t, 'miss', '#a99a88'); return {hit:false}; }
  const dd = o.dmg || a.dmg; const dmg = roll(crit ? dd[0]*2 : dd[0], dd[1], dd[2]);
  blog(`${a.name} ${verb} ${t.name}${crit ? ', <em>critical</em>' : ''}: ${dmg} damage${tagTxt}${math}.`);
  if (crit) { shakeMap(); sparks(t.x, t.y, 16, '#f08a7c'); }
  setTimeout(() => { hurt(t, dmg); updBattleUI(); }, ranged ? 200 * SET.speed : 140 * SET.speed);
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
  if (t && t.side === 'e' && !B.acted && cheb(u,t) <= u.rng) { B.acted = true; if (B.mvLeft < u.mv) B.moved = true; B.busy = true; attack(u, t); setTimeout(() => { B.busy = false; afterAct(); }, 380 * SET.speed); updBattleUI(); return; }
  if (t) { blog(`${t.name}: ${t.hp}/${t.maxhp} health, armour ${t.ac}.`); return; }
  if (!B.moved && B.reach && B.reach.has(K(x,y)) && !(x === u.x && y === u.y)) moveCur(x, y);
}
async function moveCur(x, y){
  const u = B.cur, path = pathFrom(B.reach, x, y); B.busy = true; B.reach = null;
  let stepped = 0;
  for (const st of path) {
    if (await opportunity(u, st)) break; // cut down mid-stride
    u.facing = st.x >= u.x ? 1 : -1; u.x = st.x; u.y = st.y; stepped++; AUDIO.play('step'); await wait(130); }
  B.mvLeft = Math.max(0, (B.mvLeft ?? u.mv) - (u.hp > 0 ? path.length : stepped)); // leftover movement stays usable this turn
  B.busy = false; B.moved = B.mvLeft <= 0; afterAct();
}
/* resolve free attacks against u for stepping out of its current tile; returns true if u drops */
async function opportunity(u, to){
  const es = provokes(u, u, to); if (!es.length) return false;
  for (const e of es) {
    e.aooTurn = B.turn; e.facing = u.x >= e.x ? 1 : -1;
    blog(`<em>${u.name} steps away from ${e.name}.</em>`);
    attack(e, u, {aoo:true, verb:'takes a free swing at'}); updBattleUI(); await wait(420 * SET.speed);
    if (u.hp <= 0) return true;
  }
  return false;
}
function useAb(k, x, y){
  const u = B.cur, a = AB[k];
  if (a.item) S.inv[a.item]--;
  B.acted = true; if (B.mvLeft < u.mv) B.moved = true; B.mode = 'act'; B.aim = null; B.busy = true;
  a.run(u, x, y); castStrain(u, a.strain);
  if (a.aoe) { updBattleUI(); return; } // blast() resumes after the arc lands
  setTimeout(() => { B.busy = false; afterAct(); }, 350 * SET.speed); updBattleUI();
}
function afterAct(){
  if (!B) return;
  if (checkEnd()) { updBattleUI(); return; }
  if (B.cur.hp <= 0) { updBattleUI(); return endTurn(); }
  if (B.moved && B.acted) { updBattleUI(); B.busy = true; return setTimeout(endTurn, 450 * SET.speed); }
  B.busy = false; updBattleUI();
}

/* enemy AI */
async function ai(u, turnId){
  if (!B || B.over || B.turn !== turnId) return;
  const inRange = () => foesOf(u).filter(p => cheb(u,p) <= u.rng);
  if (u.boss && u.kind === 'stone') { u.tc = (u.tc || 0) + 1; const adj = party().filter(p => cheb(u,p) === 1);
    if (u.tc % 3 === 0 && adj.length) { blog(`<em>The Stonebound slams the floor.</em> Stone and grief in every direction.`); AUDIO.play('slam'); shakeMap();
      B.fx.push({kind:'boom', x:u.x, y:u.y, r:1, col:'#a08de0', t:performance.now()}); sparks(u.x, u.y, 40, '#9a86e0'); adj.forEach(p => hurt(p, roll(2,6)));
      await wait(900); if (!checkEnd()) endTurn(); else updBattleUI(); return; } }
  if (foesOf(u).length) {
    // score every reachable tile: flank a target > stay out of free-attack range > be in range at all > closer
    const reach = reachMap(u.x, u.y, (x,y) => free(x,y,u), u.mv);
    const stepsProvoke = n => { let k = K(n.x,n.y), c = 0; while (k) { const m = reach.get(k); if (m.p) { const pr = reach.get(m.p); if (threatsAt(u, pr.x, pr.y).some(e => cheb(e, m) > 1)) c++; } k = m.p; } return c; };
    let best = null, bestS = -Infinity;
    reach.forEach(n => {
      const here = {x:n.x, y:n.y}; const tg = foesOf(u).filter(p => cheb(here, p) <= u.rng);
      let s = 0;
      if (tg.length) { s += 100; if (tg.some(p => flanked(u, p, here))) s += 60; }
      else { const nearest = Math.min(...foesOf(u).map(p => cheb(here, p))); s -= nearest * 5; }
      s -= stepsProvoke(n) * 70; s -= n.d; // a free hit isn't worth a flank; fewer steps when otherwise equal
      if (s > bestS) { bestS = s; best = n; }
    });
    if (best && best.d > 0) {
      const path = pathFrom(reach, best.x, best.y);
      for (const st of path) { if (await opportunity(u, st)) break; u.facing = st.x >= u.x ? 1 : -1; u.x = st.x; u.y = st.y; if (u.kind !== 'shade') AUDIO.play('step'); await wait(160); }
      if (u.hp <= 0) { updBattleUI(); if (!checkEnd()) endTurn(); return; }
    } else if (!inRange().length) {
      // nothing reachable in range this turn: close the distance along the shortest path
      const path = findPath(u.x, u.y, (x,y) => free(x,y,u), (x,y) => foesOf(u).some(p => cheb({x,y}, p) <= u.rng));
      if (path) for (const st of path.slice(0, u.mv)) { if (await opportunity(u, st)) break; u.facing = st.x >= u.x ? 1 : -1; u.x = st.x; u.y = st.y; if (u.kind !== 'shade') AUDIO.play('step'); await wait(160); }
      if (u.hp <= 0) { updBattleUI(); if (!checkEnd()) endTurn(); return; }
    }
  }
  const tg = inRange().sort((a,b) => (flanked(u,b) - flanked(u,a)) || (a.hp - b.hp))[0];
  if (tg) { attack(u, tg); await wait(650); }
  updBattleUI();
  if (!checkEnd()) endTurn();
}

/* battle UI */
function updBattleUI(){
  if (!B || view !== 'battle') return;
  $('#bRound').textContent = B.surpriseRound ? 'Surprise round' : `Round ${Math.max(1, B.round)}`;
  $('#order').innerHTML = (B.order.length ? B.order : B.initOrder).map(u => `<span class="chip ${u.side} ${u === B.cur ? 'now' : ''} ${u.hp <= 0 ? 'dead' : ''}">${esc(u.name)}</span>`).join('');
  $('#blog').innerHTML = B.log.map(l => `<div>${l}</div>`).join('');
  if ($('#objective') && B.def.objective) $('#objective').textContent = `${B.def.objective.text} · round ${Math.max(1,B.round)} of ${B.def.objective.rounds}`;
  const u = B.cur, ub = $('#ubar');
  B.reach = null; B.hl = {atk:new Set(), tgt:new Set()};
  if (!u || B.over) { ub.innerHTML = `<div class="bhint">${B.over ? 'The fighting stops.' : 'Rolling initiative…'}</div>`; return; }
  if (u.side === 'e' || u.ally) { ub.innerHTML = `<div class="uhead"><b>${esc(u.name)}</b><span class="stat hp">${u.hp}/${u.maxhp} health</span></div><div class="bhint">${u.ally ? 'They fight for themselves. It happens to help.' : 'Enemy turn.'}</div>`; return; }
  const mvLeft = B.mvLeft ?? u.mv;
  if (!B.moved && !B.busy) B.reach = reachMap(u.x, u.y, (x,y) => free(x,y,u), mvLeft);
  if (!B.acted) foes().forEach(f => { if (cheb(u,f) <= u.rng) B.hl.atk.add(K(f.x,f.y)); });
  const mvTxt = mvLeft < u.mv ? ` (${mvLeft} of ${u.mv} move left)` : '';
  // which move tiles cost a free enemy attack on the way, and which enemies we'd flank
  B.hl.aoo = new Set(); B.hl.flank = new Set();
  if (B.reach) B.reach.forEach(n => { if (n.d === 0) return; let k = K(n.x,n.y), bad = false; while (k && !bad) { const m = B.reach.get(k); if (m.p) { const pr = B.reach.get(m.p); if (provokes(u, pr, m).length) bad = true; } k = m.p; } if (bad) B.hl.aoo.add(K(n.x,n.y)); });
  if (!B.acted) foes().forEach(f => { if (cheb(u,f) <= u.rng && flanked(u, f)) B.hl.flank.add(K(f.x,f.y)); });
  const threatened = threatsAt(u, u.x, u.y).length > 0;
  let hint = !B.moved && !B.acted ? `Tap a gold tile to move, or a ringed enemy to attack${mvTxt}${mvLeft < u.mv ? ' — acting now ends your movement' : ''}.` : !B.moved ? `You can still move${mvTxt}.` : !B.acted ? 'You can still act.' : '';
  if (threatened && !B.moved && hint) hint += ' <span class="warn">Red-edged tiles take you out of an enemy\'s reach: it gets a free swing as you go.</span>';
  if (B.mode && B.mode !== 'act') { const a = AB[B.mode]; hint = a.desc() + (a.aoe ? ' Tap a tile to aim, then tap it again to throw.' : ' Tap a highlighted target.');
    if (!a.aoe) a.tiles(u).forEach(t => B.hl.tgt.add(K(t.x,t.y)));
    else for (let y=0;y<10;y++) for (let x=0;x<8;x++) if (!wall(x,y) && cheb(u,{x,y}) <= abRange(u,a)) B.hl.tgt.add(K(x,y)); }
  const buffs = [u.veilUntil >= B.round ? 'veiled' : '', u.rallyUntil >= B.round ? 'rallied' : ''].filter(Boolean).join(' · ');
  ub.innerHTML = `<div class="uhead"><b>${esc(u.name)}</b><span class="stat">${TPL[u.id].role}</span><span class="stat hp">${u.hp}/${u.maxhp} health</span>${u.magic ? `<span class="stat st">strain ${u.strain}/${STR_MAX}</span>` : ''}<span class="stat">${u.rng > 1 ? `range ${u.rng}` : 'melee'} · move ${mvLeft}/${u.mv}</span>${buffs ? `<span class="stat">${buffs}</span>` : ''}</div>
    <div class="hpbar"><i style="width:${u.hp/u.maxhp*100}%"></i></div>
    <div class="bhint">${hint}</div>
    <div class="abil">${u.ab.map(k => { const a = AB[k]; const cnt = a.item ? ` ×${S.inv[a.item]}` : ''; const dis = B.acted || !abOk(u,k);
      return `<button class="btn ${B.mode === k ? 'on' : ''}" id="ab_${k}" data-k="${k}" ${dis ? 'disabled' : ''}>${a.name}${cnt}</button>`; }).join('')}
      <button class="btn" id="bEnd">End turn</button></div>`;
  ub.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
    if (B.busy) return; const k = b.dataset.k; AUDIO.play('click');
    if (B.mode === k) { B.mode = 'act'; B.aim = null; return updBattleUI(); }
    if (AB[k].self) return useAb(k, u.x, u.y);
    B.mode = k; B.aim = null; updBattleUI(); });
  $('#bEnd').onclick = () => { if (!B.busy) { AUDIO.play('click'); endTurn(); } };
}
function drawBattle(t){
  const {ctx, T} = G; if (!ctx || !B) return; const def = B.def, now = performance.now();
  ctx.drawImage(G.bgc, 0, 0, 8*T, 10*T);
  ctx.drawImage(G.dec, 0, 0, 8*T, 10*T);
  // burner fires
  B.fires.forEach(f => { const px = f.x*T, py = f.y*T; glow(ctx, px + T/2, py + T/2, T*1.1, '#ff7a3a', .35 + Math.sin(t/90 + f.x*3 + f.y)*.1);
    for (let i=0;i<4;i++){ const h = T*(.35 + hash(f.x,f.y,i)*.4)*(.7 + Math.sin(t/(60 + i*13) + i)*.3), bx = px + T*(.15 + i*.22); poly(ctx, [[bx - T*.08, py + T*.9],[bx + T*.08, py + T*.9],[bx + Math.sin(t/80 + i)*T*.05, py + T*.9 - h]], `rgba(255,${120 + i*25},40,.85)`); poly(ctx, [[bx - T*.04, py + T*.9],[bx + T*.04, py + T*.9],[bx, py + T*.9 - h*.5]], 'rgba(255,240,180,.8)'); }
    if (Math.random() < .3 && !REDUCE()) B.parts.push({x:f.x + Math.random(), y:f.y + .8, vx:(Math.random()-.5)*.1, vy:-.15 - Math.random()*.2, life:1, decay:.03, col:'#ffb060', size:1.5}); });
  // ranged attack radius: tinted zone with a dashed border, only for the current player unit with a ranged weapon
  if (B.cur && B.cur.side === 'p' && !B.acted && B.cur.rng > 1 && !(B.mode && B.mode !== 'act')) {
    const u = B.cur, r = u.rng, x0 = Math.max(0, u.x - r), y0 = Math.max(0, u.y - r), x1 = Math.min(7, u.x + r), y1 = Math.min(9, u.y + r);
    const p = REDUCE() ? 0 : (Math.sin(t/420)+1)*.5;
    ctx.fillStyle = 'rgba(224,87,74,.07)'; ctx.fillRect(x0*T, y0*T, (x1-x0+1)*T, (y1-y0+1)*T);
    // fade the tint toward the edge of reach so the last tile reads as the limit
    for (let y=y0;y<=y1;y++) for (let x=x0;x<=x1;x++) { const d = cheb(u,{x,y}); if (d === r) { ctx.fillStyle = `rgba(224,87,74,${.09 + p*.05})`; ctx.fillRect(x*T+1, y*T+1, T-2, T-2); } }
    ctx.strokeStyle = `rgba(240,138,124,${.55 + p*.3})`; ctx.lineWidth = 2; ctx.setLineDash([6,4]); ctx.lineDashOffset = -t/60;
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
  if (B.aim) { const a = AB[B.mode]; const r = a ? a.aoe : 1; ctx.fillStyle = 'rgba(224,87,74,.22)'; ctx.fillRect((B.aim.x-r)*T, (B.aim.y-r)*T, (2*r+1)*T, (2*r+1)*T);
    ctx.strokeStyle = '#f08a7c'; ctx.lineWidth = 2; ctx.setLineDash([4,3]); ctx.strokeRect(B.aim.x*T+2, B.aim.y*T+2, T-4, T-4); ctx.setLineDash([]); }
  // corpses first
  B.units.filter(u => u.hp <= 0).forEach(u => { const k = clamp((now - (u.deadAt || 0)) / 900, 0, 1); const d = dispOf('u' + u.id + u.x + u.y, u.x, u.y);
    ctx.save(); ctx.translate(d.x*T + T/2, d.y*T + T*.6); ctx.rotate(ease(k) * Math.PI/2 * (u.facing || 1)); ctx.globalAlpha = 1 - k*.55; drawFigure(ctx, u.kind, 0, 0, T/32*(u.boss ? 1.3 : 1), t, {still:true}); ctx.restore(); });
  // living units
  const cur = B.cur;
  B.units.filter(u => u.hp > 0).sort((a,b) => a.y - b.y).forEach(u => {
    const key = 'u' + u.id + (u.side === 'e' ? B.units.indexOf(u) : ''); const d = dispOf(key, u.x, u.y);
    let ox = 0, oy = 0;
    if (B.anim && B.anim.u === u) { const k = (now - B.anim.t0) / (280 * SET.speed); if (k >= 1) B.anim = null; else { const s = Math.sin(k * Math.PI) * .45; ox = (B.anim.tx - u.x) * s; oy = (B.anim.ty - u.y) * s; } }
    const cx = (d.x + ox)*T + T/2, cy = (d.y + oy)*T + T*.6;
    if (u === cur) { const p = REDUCE() ? 0 : (Math.sin(t/260)+1)*.5; ctx.strokeStyle = `rgba(232,192,115,${.45+p*.45})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cx, cy - T*.02, T*.42 + p*2, T*.17 + p, 0, 0, 7); ctx.stroke(); }
    if (u.side === 'p') glow(ctx, cx, cy - T*.4, T*1.6, '#e8b060', .06);
    if (u.veilUntil >= B.round) { glow(ctx, cx, cy - T*.4, T*.9, '#9a86e0', .25); }
    drawFigure(ctx, u.kind, cx, cy, T/32*(u.boss ? 1.3 : 1), t, {phase:u.x*3 + u.y, dir:u.facing || (u.side === 'e' ? -1 : 1), still:u.stun});
    if (u.flash && now - u.flash < 160) { ctx.globalCompositeOperation = 'lighter'; ell(ctx, cx, cy - T*.4, T*.35, T*.45, `rgba(255,120,100,${(1 - (now - u.flash)/160)*.6})`); ctx.globalCompositeOperation = 'source-over'; }
    if (u.healed && now - u.healed < 500) glow(ctx, cx, cy - T*.4, T*.9, '#9fe0b8', (1 - (now - u.healed)/500)*.4);
    if (B.hl && B.hl.atk.has(K(u.x,u.y))) { ctx.strokeStyle = '#f08a7c'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy - T*.02, T*.44, T*.18, 0, 0, 7); ctx.stroke();
      if (B.hl.flank && B.hl.flank.has(K(u.x,u.y))) { const lbl = '+2 flank', fs = Math.round(T*.24); ctx.font = `bold ${fs}px sans-serif`; ctx.textAlign = 'center'; const tw = ctx.measureText(lbl).width + 8; ctx.fillStyle = 'rgba(13,11,9,.85)'; ctx.fillRect(cx - tw/2, cy - T*1.02, tw, fs + 4); ctx.fillStyle = '#f2c46b'; ctx.fillText(lbl, cx, cy - T*1.02 + fs); } }
    const w = T*.7, px = cx - w/2, py = cy + T*.3; ctx.fillStyle = '#0d0b09'; ctx.fillRect(px, py, w, Math.max(3, T*.08));
    ctx.fillStyle = u.side === 'p' ? '#7fb394' : '#d9695a'; ctx.fillRect(px, py, w * u.hp / u.maxhp, Math.max(3, T*.08));
    if (u.stun) { ctx.fillStyle = '#e9dfc9'; ctx.font = `${Math.round(T*.3)}px sans-serif`; ctx.textAlign = 'left'; ctx.fillText('z', cx + T*.3, cy - T*.7 + Math.sin(t/300)*2); }
  });
  // darkness: lantern light around the party
  if (def.dark) {
    const dk = G.dctx; // reuse decal ctx? no — use a temp path with destination-out on a layer
    const layer = G.darkc || (G.darkc = document.createElement('canvas')); if (layer.width !== G.cv.width) { layer.width = G.cv.width; layer.height = G.cv.height; }
    const lc = layer.getContext('2d'); lc.setTransform(G.dpr,0,0,G.dpr,0,0); lc.globalCompositeOperation = 'source-over'; lc.fillStyle = 'rgba(8,5,14,.86)'; lc.clearRect(0,0,8*T,10*T); lc.fillRect(0,0,8*T,10*T);
    lc.globalCompositeOperation = 'destination-out';
    const lamp = (x, y, r) => { const g = lc.createRadialGradient(x, y, r*.2, x, y, r); g.addColorStop(0,'rgba(0,0,0,1)'); g.addColorStop(.6,'rgba(0,0,0,.7)'); g.addColorStop(1,'rgba(0,0,0,0)'); lc.fillStyle = g; lc.fillRect(x-r, y-r, r*2, r*2); };
    const fl = 1 + Math.sin(t/110)*.04 + Math.sin(t/43)*.03;
    party().forEach(u => { const d = G.disp['u' + u.id] || u; lamp(d.x*T + T/2, d.y*T + T/2, T*(u.kind === 'kettle' ? 3.2 : 2.3)*fl); });
    B.fires.forEach(f => lamp(f.x*T + T/2, f.y*T + T/2, T*2.2*fl));
    B.units.filter(u => u.side === 'e' && u.hp > 0).forEach(u => { const d = G.disp['u' + u.id + B.units.indexOf(u)] || u; lamp(d.x*T + T/2, d.y*T + T/2, T*.9); });
    ctx.drawImage(layer, 0, 0, 8*T, 10*T);
    for (let i=0;i<8;i++) ell(ctx, hash(i,3)*8*T + Math.sin(t/3000 + i)*T, (hash(i,4)*10*T + t*.01) % (10*T), T*1.4, T*.4, 'rgba(60,45,100,.06)');
  }
  // particles
  B.parts = B.parts.filter(p => p.life > 0);
  B.parts.forEach(p => { p.x += p.vx*.06; p.y += p.vy*.06; p.vy += .02; p.life -= p.decay; ctx.globalAlpha = clamp(p.life, 0, 1); ctx.fillStyle = p.col; ctx.fillRect(p.x*T, p.y*T, p.size, p.size); }); ctx.globalAlpha = 1;
  // effects
  B.fx = B.fx.filter(f => now - f.t < (f.dur ? f.dur + 40 : 950));
  B.fx.forEach(f => { const k = clamp((now - f.t) / (f.dur || 950), 0, 1);
    if (f.kind === 'boom') { ctx.globalAlpha = (1 - k) * .9; ctx.fillStyle = f.col; const s = (f.r + .5) * T * (0.4 + k*.7); ctx.beginPath(); ctx.arc(f.x*T + T/2, f.y*T + T/2, s, 0, 7); ctx.fill(); ctx.globalAlpha = (1 - k) * .5; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x*T + T/2, f.y*T + T/2, s*1.3, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; glow(ctx, f.x*T + T/2, f.y*T + T/2, s*2.5, f.col, (1-k)*.4); }
    else if (f.kind === 'bolt') { const x = lerp(f.from.x, f.to.x, k)*T + T/2, y = lerp(f.from.y, f.to.y, k)*T + T*.5 + (f.wob ? Math.sin(k*20)*T*.15 : 0); ctx.strokeStyle = f.col; ctx.lineWidth = f.wob ? 2.5 : 1.5; ctx.beginPath(); ctx.moveTo(lerp(f.from.x, f.to.x, Math.max(0,k-.15))*T + T/2, lerp(f.from.y, f.to.y, Math.max(0,k-.15))*T + T*.5); ctx.lineTo(x, y); ctx.stroke(); if (f.wob) glow(ctx, x, y, T*.6, f.col, .5); }
    else if (f.kind === 'arc') { const x = lerp(f.from.x, f.to.x, k)*T + T/2, y = lerp(f.from.y, f.to.y, k)*T + T/2 - Math.sin(k*Math.PI)*T*1.6; ell(ctx, x, y, T*.12, T*.12, '#3a3230'); ctx.fillStyle = '#ffb060'; ctx.fillRect(x + T*.08, y - T*.16 - Math.random()*3, 2, 2);
      if (k >= 1 && B.pendingBlast) { const fn = B.pendingBlast; B.pendingBlast = null; fn(); } }
    else { ctx.globalAlpha = 1 - k*k; ctx.fillStyle = f.col; ctx.font = `700 ${Math.round(T*.36)}px 'Alegreya Sans', sans-serif`; ctx.textAlign = 'center'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
      ctx.fillText(f.txt, f.x*T + T/2, f.y*T + T*.2 - k*T*.6); ctx.shadowBlur = 0; ctx.globalAlpha = 1; } });
  // vignette
  const v = ctx.createRadialGradient(4*T, 5*T, T*3, 4*T, 5*T, T*7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = v; ctx.fillRect(0,0,8*T,10*T);
}
