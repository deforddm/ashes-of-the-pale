/* ============ minigames: the games the squad plays between the story ============
   One full-screen table (#mg) that any game draws into: a header with the game's name and a way out, a canvas for the table,
   a line of talk, and the buttons. Each game runs its own canvas animation (MG.anim, called from the main loop) and its own keys
   (MG.keys, removed on close). A game ends with mgClose(result); the story picks up from its done() callback. */
const MG = { anim:null, keys:null, fit:null, done:null, leave:null };
function mgOpen(o){
  const el = $('#mg'); el.hidden = false; el.className = 'mg ' + (o.cls || ''); MG.arrows = !!o.arrows;
  el.innerHTML = `<div class="mgbox"><div class="mghead"><div><div class="kick">${o.kick || ''}</div><h2 class="m">${o.title}</h2></div><button class="btn" id="mgLeave" data-bot="1">${o.leaveText || 'Leave'}</button></div>
    <div class="mgstage"><canvas id="mgcv"></canvas>${o.over || ''}</div><div class="mgpanel" id="mgPanel"></div></div>`;
  const cv = $('#mgcv'), ctx = cv.getContext('2d');
  MG.fit = () => { const dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; if (cv.width !== Math.round(w*dpr) || cv.height !== Math.round(h*dpr)) { cv.width = Math.round(w*dpr); cv.height = Math.round(h*dpr); } ctx.setTransform(dpr,0,0,dpr,0,0); MG.W = w; MG.H = h; };
  MG.refit = () => { cv.style.height = ''; MG.fit(); mgRoom(); };
  MG.fit(); window.addEventListener('resize', MG.refit); MG.ctx = ctx; MG.cv = cv;
  if (window.ResizeObserver) { MG.ro = new ResizeObserver(() => mgRoom()); MG.ro.observe($('#mgPanel')); } // the talk reflowing (a font arriving late) counts too
  MG.leave = o.leave || (() => mgClose({left:true}));
  $('#mgLeave').onclick = () => { AUDIO.play('click'); MG.leave(); };
  MG.done = o.done || null;
  return el;
}
function mgClose(result){
  const el = $('#mg'); MG.anim = null;
  if (MG.keys) window.removeEventListener('keydown', MG.keys); MG.keys = null;
  if (MG.refit) window.removeEventListener('resize', MG.refit); MG.fit = MG.refit = null; if (MG.ro) { MG.ro.disconnect(); MG.ro = null; }
  el.hidden = true; el.innerHTML = ''; const d = MG.done; MG.done = null; MG.leave = null;
  if (d) d(result || {});
}
const mgOpenNow = () => !$('#mg').hidden;
/* the keys a game listens for, off while you're typing or another overlay is on top */
function mgKeys(map){
  if (MG.keys) window.removeEventListener('keydown', MG.keys);
  MG.keys = e => { if (e.ctrlKey || e.metaKey || e.altKey || !mgOpenNow() || !$('#settings').hidden) return; const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, f = map[k];
    if (f) { e.preventDefault(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); f(); } };
  window.addEventListener('keydown', MG.keys);
}
const mgPanel = html => { const p = $('#mgPanel'); if (p) { p.innerHTML = html; mgRoom(); } return p; };
/* when the talk and the buttons would run past the bottom of the window, take the difference off the table (never below a playable
   height); it only ever shrinks while a game is open, so the board doesn't jump about as the lines change, and a resize starts it over */
function mgRoom(){
  const el = $('#mg'), cv = $('#mgcv'); if (!el || el.hidden || !cv || !MG.fit) return;
  const over = el.scrollHeight - el.clientHeight; if (over <= 0) return;
  const h = cv.clientHeight, nh = Math.max(210, h - over - 1); if (nh < h) { cv.style.height = nh + 'px'; MG.fit(); }
}
/* a line of talk in the panel: who, and what they said */
const mgSay = (who, line) => `<p class="mgsay">${who ? `<b>${esc(who)}</b> ` : ''}${smartq(line)}</p>`;
/* the deeds a sergeant has done at the tables, kept on the save (the Deeds page reads them) */
function mgDeed(k, v = 1){ S.deeds ??= {}; S.deeds[k] = (S.deeds[k] || 0) + v; save(); }

/* ---- drawing: a knucklebone die, a table cloth, the fire ---- */
function drawBone(ctx, x, y, s, face, rot = 0, lift = 0){
  ctx.save(); ctx.translate(x, y - lift); ctx.rotate(rot);
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(2, s*.55 + lift, s*.5, s*.14, 0, 0, 7); ctx.fill();
  const r = s*.2, h = s/2; ctx.beginPath(); ctx.moveTo(-h + r, -h); ctx.arcTo(h, -h, h, h, r); ctx.arcTo(h, h, -h, h, r); ctx.arcTo(-h, h, -h, -h, r); ctx.arcTo(-h, -h, h, -h, r); ctx.closePath();
  const g = ctx.createLinearGradient(-h, -h, h, h); g.addColorStop(0, '#f1e6cc'); g.addColorStop(1, '#bba77f'); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(60,40,20,.55)'; ctx.lineWidth = 1; ctx.stroke();
  const pip = (px, py) => { ctx.beginPath(); ctx.arc(px*s*.27, py*s*.27, s*.075, 0, 7); ctx.fillStyle = '#3a2616'; ctx.fill(); };
  if (face === 1) { // the skull: Hood's face
    ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.arc(0, -s*.05, s*.2, Math.PI, 0); ctx.lineTo(s*.2, s*.08); ctx.lineTo(s*.12, s*.16); ctx.lineTo(-s*.12, s*.16); ctx.lineTo(-s*.2, s*.08); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e9dcbd'; ctx.beginPath(); ctx.arc(-s*.08, -s*.02, s*.055, 0, 7); ctx.arc(s*.08, -s*.02, s*.055, 0, 7); ctx.fill();
    ctx.fillStyle = '#2a1a10'; for (let i = -1; i <= 1; i++) ctx.fillRect(i*s*.06 - s*.02, s*.17, s*.04, s*.07);
  } else ({2:[[-1,-1],[1,1]], 3:[[-1,-1],[0,0],[1,1]], 4:[[-1,-1],[1,-1],[-1,1],[1,1]], 5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]], 6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]}[face] || []).forEach(([a, b]) => pip(a, b));
  ctx.restore();
}
function drawTableFire(ctx, W, H, t, o = {}){
  const sky = ctx.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, o.night === false ? '#1a1410' : '#07070b'); sky.addColorStop(1, '#0c0907'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  if (o.stars !== false) { ctx.fillStyle = 'rgba(220,220,240,.4)'; for (let i = 0; i < 40; i++) ctx.fillRect(hash(i, 31)*W, hash(i, 32)*H*.35, 1, 1); }
  ctx.fillStyle = '#0e0b09'; ctx.fillRect(0, H*.42, W, H);
  const fx = o.fx ?? W*.5, fy = o.fy ?? H*.5, fl = .85 + Math.sin(t/130)*.08 + Math.sin(t/47)*.05;
  glow(ctx, fx, fy, Math.max(W, H)*.55, '#e8923a', .28*fl);
  if (o.fire !== false) { ell(ctx, fx, fy + 6, 22, 7, '#2a1c12'); poly(ctx, [[fx - 14, fy + 4], [fx + 14, fy + 4], [fx + Math.sin(t/90)*4, fy - 30*fl]], '#ffb35a'); poly(ctx, [[fx - 7, fy + 4], [fx + 7, fy + 4], [fx + Math.sin(t/70)*2, fy - 16*fl]], '#fff1c2');
    for (let i = 0; i < 6; i++) { const yy = fy - ((t/14 + i*21) % 70); ctx.fillStyle = `rgba(255,${140 + (i*23) % 60},40,${(1 - (fy - yy)/70)*.8})`; ctx.fillRect(fx + Math.sin(t/300 + i)*10, yy, 2, 2); } }
  // the blanket the bones land on
  const bw = Math.min(W*.62, 300), bh = Math.min(H*.3, 96), bx = W/2 - bw/2, by = H*.72 - bh/2;
  ctx.save(); ctx.translate(W/2, H*.72); ctx.transform(1, 0, -.08, 1, 0, 0); ctx.fillStyle = '#3b2a1c'; ctx.fillRect(-bw/2, -bh/2, bw, bh); ctx.strokeStyle = '#5a412a'; ctx.lineWidth = 2; ctx.strokeRect(-bw/2 + 5, -bh/2 + 5, bw - 10, bh - 10); ctx.restore();
  return {bx, by, bw, bh};
}

/* ============ Bones at the fire ============
   Two knucklebones. Throw as often as you like and bank when you're scared: a skull wipes the throw, two skulls (Hood's eyes)
   wipe everything you've banked. A pair that isn't skulls counts double. First to thirty takes the stake. */
const BONES_GOAL = 30;
const BONES = {
  fiddler:{name:'Fiddler', kind:'fiddler', push:(turn, me, you) => turn < (you >= BONES_GOAL - 8 ? 22 : me < you - 9 ? 18 : 13),
    lines:{start:['"Two bones. Throw, bank, don\'t whine."', '"House rules: I keep count. Hedge keeps quiet."'], bust:['"Hood\'s one eye. Fine."', 'He shrugs. "That\'s bones."'], hood:['A long silence. "I\'ll say it once: don\'t."'], bank:['"That\'ll do."', '"Banking. Coward\'s game. Winner\'s game."'], big:['"Sapper\'s patience, Sergeant. Watch and learn."'], win:['"Pay the man. Me. I\'m the man."', 'He holds out a hand without looking up.'], lose:['He pays without a word, and then one word: "Again?"', '"Well thrown. Don\'t let it go to your head. It\'s got enough in it."']}},
  hedge:{name:'Hedge', kind:'hedge', push:(turn, me, you) => turn < (you >= BONES_GOAL - 8 ? 25 : 20),
    lines:{start:['"Onion for luck." He bites it. "Throw."', '"Twelve cussers in a crate and he wants me to play careful. Throw."'], bust:['"Skull! Hood loves me. Hood loves me *too much*."', '"That one didn\'t count. That one was practice."'], hood:['"HOOD\'S EYES." Several Bridgeburners look round. "Don\'t look at me. Look at the bones."'], bank:['"Fine. Fine! Banking. Fid, write it down."', '"Banking. My hand\'s cold. Not scared. Cold."'], big:['"Look at that. LOOK at that. Fid, are you looking?"'], win:['"Ha! Pay the sapper!"', '"That\'s the onion. I told you. The onion."'], lose:['"You cheated. You didn\'t cheat. Again."', 'He hands over the silver with enormous dignity and a bit of onion.']}},
  kettle:{name:'Kettle', kind:'kettle', push:(turn, me, you) => turn < (you >= BONES_GOAL - 8 ? 16 : me < you - 9 ? 15 : 10),
    lines:{start:['"Loser takes first watch. I\'m counting."', '"I\'ve worked out the odds. Don\'t ask me what they are."'], bust:['"That\'s fine. That\'s statistically fine."', '"One skull. One. I counted."'], hood:['Kettle stares at the two skulls as if they owe her money.'], bank:['"Banking. Banking is sensible. Sappers bank."'], big:['"Don\'t talk to me. I\'m on a run."'], win:['"First watch is yours, Sergeant. I\'ll wake you. Gently. Probably."'], lose:['"First watch. Right." She\'s already counting the stars she\'ll be watching.']}},
};
const BONES_CHAT = {
  hedge:{name:'Hedge', to:{meBust:['"Ha!"', '"That\'s the fire, that is. Bad fire."'], meBig:['"He\'s going to push it. Watch him push it."'], meHood:['"Hood\'s EYES! Oh, that\'s beautiful. Sorry, Sergeant. It\'s beautiful."'], meWin:['"Fid lost to a marine. I\'m telling everyone."']}},
  fiddler:{name:'Fiddler', to:{meBust:['"Skull. Hard luck."'], meBig:['"Bank it, Sergeant. That\'s free advice, and it\'s worth what you pay."'], meHood:['He winces for you, briefly, like a man stepping on a nail.'], meWin:['"Hedge, you owe the Sergeant. Don\'t eat it."']}},
  brisk:{name:'Brisk', to:{meBust:['"Should have banked."'], meBig:['"Bank it, Sergeant."'], meHood:['Brisk closes her eyes, briefly, in something like prayer.'], meWin:['"She\'ll pretend she let you."']}},
};
/* opt: {opp, chat, stakes:[silver...] or null, stakeText (no silver: what's played for), place, after(result)} */
function playBones(opt){
  const O = BONES[opt.opp], C = BONES_CHAT[opt.chat], pick = a => a[R(a.length)];
  const g = {me:0, opp:0, turn:0, who:'me', dice:[1 + R(6), 1 + R(6)], roll:0, busy:false, over:false, stake:0, oponn:S.card === 'oponn', oponnUsed:false, talk:'', net:0, games:0};
  const figs = [{kind:O.kind, x:.22}, {kind:C ? opt.chat : null, x:.8}];
  mgOpen({kick:'Bones at the fire', title:`${O.name} deals you in`, leaveText:'Leave the game', done:r => opt.after && opt.after(r),
    leave:() => { if (g.over || g.stake === 0 || (g.me === 0 && g.opp === 0)) return mgClose({left:!g.games, won:g.net > 0, net:g.net, games:g.games, last:g.last}); if (!confirmLeave) { confirmLeave = true; say('', `Leaving now forfeits the stake. Tap Leave again if you mean it.`); return; } g.net -= g.stake; S.silver -= g.stake; save(); mgClose({net:g.net, games:g.games + 1, forfeit:true}); }});
  let confirmLeave = false;
  const say = (who, line) => { g.talk = mgSay(who, line); draw(); };
  const draw = () => {
    if (g.stake === null || (!g.stake && !g.started)) return; // the stake picker is up
    const mine = g.who === 'me' && !g.busy && !g.over && !g.oponnReady, pct = n => Math.min(100, n / BONES_GOAL * 100);
    mgPanel(`<div class="bscore"><div class="bs ${g.who === 'me' && !g.over ? 'on' : ''}"><span>${esc(S.name)}</span><b>${g.me}</b><i style="width:${pct(g.me)}%"></i>${g.who === 'me' && g.turn ? `<em>+${g.turn}</em>` : ''}</div>
      <div class="bs ${g.who === 'opp' && !g.over ? 'on' : ''}"><span>${O.name}</span><b>${g.opp}</b><i style="width:${pct(g.opp)}%"></i>${g.who === 'opp' && g.turn ? `<em>+${g.turn}</em>` : ''}</div></div>
      <p class="fine bgoal">First to ${BONES_GOAL}. A skull wipes the throw; two skulls wipe your bank; a pair counts double.${g.stake ? ` Stake: ${g.stake} silver.` : opt.stakeText ? ` For ${opt.stakeText}.` : ''}</p>
      ${g.talk}
      ${g.over ? `<div class="row mgbtns">${g.again ? `<button class="btn primary" id="bgAgain" data-bot="1">Another game</button>` : ''}<button class="btn ${g.again ? '' : 'primary'}" id="bgDone" data-bot="1">Back to the fire</button></div>`
      : g.oponnReady ? `<div class="row mgbtns"><button class="btn on" id="bgOponn">Oponn's coin: take back the skull</button><button class="btn" id="bgLet" data-bot="1">Let it go</button></div>`
      : `<div class="row mgbtns"><button class="btn primary" id="bgThrow" data-bot="1" ${mine ? '' : 'disabled'}>Throw the bones</button><button class="btn" id="bgBank" data-bot="1" ${mine && g.turn ? '' : 'disabled'}>Bank ${g.turn ? g.turn : ''}</button></div>
        <p class="hint keys"><kbd>Space</kbd> throw · <kbd>B</kbd> bank · <kbd>Esc</kbd> leave</p>`}`);
    if ($('#bgThrow')) $('#bgThrow').onclick = throwMe; if ($('#bgBank')) $('#bgBank').onclick = bank;
    if ($('#bgOponn')) $('#bgOponn').onclick = () => { AUDIO.play('magic'); g.oponnReady = false; g.oponnUsed = true; g.turn = g.lastTurn; say(SQUAD().includes('tuft') ? 'Tuft' : '', SQUAD().includes('tuft') ? '"Oponn\'s coin. Once. Don\'t make me watch you need it twice."' : 'The skull rolls over. Oponn smiles, once.'); };
    if ($('#bgLet')) $('#bgLet').onclick = () => { AUDIO.play('click'); g.oponnReady = false; pass(); };
    if ($('#bgAgain')) $('#bgAgain').onclick = () => { AUDIO.play('click'); stakePick(); };
    if ($('#bgDone')) $('#bgDone').onclick = () => { AUDIO.play('click'); mgClose({won:g.net > 0, net:g.net, games:g.games, last:g.last}); };
  };
  // one throw: the bones tumble, then land; cb(a, b)
  const tumble = cb => { g.busy = true; g.roll = performance.now(); AUDIO.play('shuffle'); draw();
    setTimeout(() => { const a = 1 + R(6), b = 1 + R(6); g.dice = [a, b]; g.roll = 0; AUDIO.play('dice', !(a === 1 || b === 1)); cb(a, b); }, REDUCE() ? 150 : 650 * Math.max(.4, SET.speed)); };
  const score = (a, b) => a === 1 && b === 1 ? 'hood' : a === 1 || b === 1 ? 'bust' : a === b ? (a + b) * 2 : a + b;
  const throwMe = () => { if (g.who !== 'me' || g.busy || g.over) return; confirmLeave = false; g.oponnReady = false;
    tumble((a, b) => { g.busy = false; const s = score(a, b);
      if (s === 'hood') { g.lastTurn = g.turn; g.me = 0; g.turn = 0; say(C ? C.name : '', pick(C ? C.to.meHood : ['Two skulls.'])); return pass(); }
      if (s === 'bust') { g.lastTurn = g.turn; g.turn = 0; if (g.oponn && !g.oponnUsed && g.lastTurn >= 6) { g.oponnReady = true; say('', `A skull. ${g.lastTurn} gone, unless you spend Oponn's coin.`); return; } say(C ? C.name : '', pick(C ? C.to.meBust : ['A skull.'])); return pass(); }
      g.turn += s; if (g.me + g.turn >= BONES_GOAL) { g.me += g.turn; g.turn = 0; return finish('me'); }
      say(C && g.turn >= 15 ? C.name : '', g.turn >= 15 && C ? pick(C.to.meBig) : a === b ? `A pair of ${a}s, doubled: ${s}. ${g.turn} this turn.` : `${a} and ${b}. ${g.turn} this turn.`); }); };
  const bank = () => { if (g.who !== 'me' || g.busy || g.over || !g.turn) return; confirmLeave = false; g.oponnReady = false; g.me += g.turn; AUDIO.play('coin'); say('', `You bank ${g.turn}.`); g.turn = 0; pass(); };
  const pass = () => { if (g.over) return; g.oponnReady = false; if (g.who === 'me') { g.who = 'opp'; g.turn = 0; draw(); setTimeout(oppTurn, 900 * Math.max(.4, SET.speed)); } else { g.who = 'me'; g.turn = 0; draw(); } };
  const oppTurn = () => { if (g.over || g.who !== 'opp') return;
    tumble((a, b) => { g.busy = false; const s = score(a, b);
      if (s === 'hood') { g.opp = 0; g.turn = 0; say(O.name, pick(O.lines.hood)); return setTimeout(pass, 1100 * Math.max(.4, SET.speed)); }
      if (s === 'bust') { g.turn = 0; say(O.name, pick(O.lines.bust)); return setTimeout(pass, 1000 * Math.max(.4, SET.speed)); }
      g.turn += s; if (g.opp + g.turn >= BONES_GOAL) { g.opp += g.turn; g.turn = 0; return finish('opp'); }
      if (O.push(g.turn, g.opp, g.me)) { if (g.turn >= 15) say(O.name, pick(O.lines.big)); else draw(); setTimeout(oppTurn, 800 * Math.max(.4, SET.speed)); }
      else setTimeout(() => { g.opp += g.turn; say(O.name, `${pick(O.lines.bank)} <span class="dim">(${g.turn})</span>`); g.turn = 0; setTimeout(pass, 700 * Math.max(.4, SET.speed)); }, 600 * Math.max(.4, SET.speed)); }); };
  const finish = w => { g.over = true; g.busy = false; g.games++; const won = w === 'me'; g.last = w;
    if (g.stake) { S.silver += won ? g.stake : -g.stake; g.net += won ? g.stake : -g.stake; AUDIO.play(won ? 'coin' : 'click'); }
    mgDeed(won ? 'bonesWon' : 'bonesLost'); if (won && g.me >= BONES_GOAL && g.opp === 0) mgDeed('bonesShutout');
    const capped = opt.cap != null && (S.f[opt.place + '_bonesNet'] || 0) + g.net >= opt.cap;
    g.again = !capped && (!g.stake || S.silver >= Math.min(...opt.stakes));
    say(won ? (C ? C.name : O.name) : O.name, won ? (g.stake ? `You take ${g.stake} silver. ` : '') + pick(C && won ? C.to.meWin.concat(O.lines.lose) : O.lines.lose) : (g.stake ? `${O.name} takes ${g.stake} silver. ` : '') + pick(O.lines.win));
    if (capped) g.talk += mgSay(O.name, `"That's us cleaned out, Sergeant. Go and buy something with our silver. Something we'd hate."`);
    S.f[opt.place + '_bonesNet'] = (S.f[opt.place + '_bonesNet'] || 0) + (g.stake ? (won ? g.stake : -g.stake) : 0); save(); draw(); };
  // the stake, then the game
  const stakePick = () => { g.me = g.opp = g.turn = 0; g.who = 'me'; g.over = false; g.oponnUsed = false; g.oponnReady = false; g.started = false; g.stake = null; confirmLeave = false;
    if (!opt.stakes) { g.stake = 0; g.started = true; g.talk = mgSay(O.name, pick(O.lines.start)); draw(); return; }
    mgPanel(`${mgSay(O.name, pick(O.lines.start))}<p class="fine">What's the stake? You have ${S.silver} silver.</p>
      <div class="row mgbtns">${opt.stakes.map(n => `<button class="btn ${n === opt.stakes[0] ? 'primary' : ''}" data-st="${n}" data-bot="1" ${S.silver >= n ? '' : 'disabled'}>${n} silver</button>`).join('')}</div>
      <p class="fine bgoal">First to ${BONES_GOAL}. Throw as often as you like and bank when you're scared. A skull wipes the throw; two skulls (Hood's eyes) wipe everything you've banked. A pair that isn't skulls counts double.${g.oponn ? ' The Deck gave you Oponn: once a game, a skull can be thrown again.' : ''}</p>`);
    document.querySelectorAll('#mgPanel [data-st]').forEach(b => b.onclick = () => { AUDIO.play('coin'); g.stake = +b.dataset.st; g.started = true; g.talk = mgSay('', 'You throw first.'); draw(); }); };
  mgKeys({' ':() => { if (g.over) { const b = $('#bgAgain') || $('#bgDone'); b && b.click(); } else if (g.stake === null) { const b = $('#mgPanel [data-st]:not([disabled])'); b && b.click(); } else throwMe(); }, b:bank, l:() => { const b = $('#bgLet'); b && b.click(); }, Enter:() => { if (g.over) { const b = $('#bgDone'); b && b.click(); } else bank(); }, '1':() => { const b = $('#mgPanel [data-st]'); b && !b.disabled && b.click(); }, o:() => { const b = $('#bgOponn'); b && b.click(); }});
  // the table
  MG.anim = t => { const ctx = MG.ctx; if (!ctx || !MG.W) return; const W = MG.W, H = MG.H;
    const {bx, bw} = drawTableFire(ctx, W, H, t, {fx:W*.5, fy:H*.4});
    const fs = clamp(H/92, 2, 4.2), off = bw/2 + 16*fs;
    figs.forEach((f, i) => { if (f.kind) drawFigure(ctx, f.kind, clamp(W/2 + (i ? off : -off), W*.09, W*.91), H*.76, fs, t, {still:!(g.who === 'opp' && i === 0 && g.busy), dir:i ? -1 : 1, phase:i}); });
    const k = g.roll ? (performance.now() - g.roll) / 650 : 1, s = Math.min(64, W*.1, H*.17);
    [0, 1].forEach(i => { const face = g.roll ? 1 + (Math.floor(performance.now()/70 + i*3) % 6) : g.dice[i], x = W/2 + (i ? 1 : -1)*s*.8 + (g.roll ? Math.sin(k*9 + i)*10 : 0), lift = g.roll ? Math.abs(Math.sin(k*Math.PI*2.5))*26*(1 - k) : 0;
      drawBone(ctx, x, H*.72, s, face, g.roll ? k*6 + i : (i ? .12 : -.08), lift); });
    if (g.who === 'opp' && !g.over) { ctx.fillStyle = 'rgba(232,192,115,.8)'; ctx.font = `600 ${Math.round(Math.min(15, W*.035))}px 'Alegreya Sans SC', sans-serif`; ctx.textAlign = 'center'; ctx.fillText(`${O.name} throws`, clamp(W/2 - off, W*.09, W*.91), H*.76 - 36*fs); }
  };
  stakePick();
}

/* ============ Kruppe's cups at the Phoenix ============
   Three cups, one coin, three rounds a sitting at rising stakes. Follow the cup. In the last round Kruppe may palm the coin
   (on your first sitting he always does): a glint at his cuff gives him away, and so can a sharp-eyed squadmate. Call the palm
   and he pays double, and a rumour with it. Call it when he was honest and you've insulted him, which costs the stake. */
const CUPS_STAKE = [1, 2, 4];
function playCups(opt){
  const pick = a => a[R(a.length)], sit = (S.f.c3_cupsSits || 0), watcher = () => roller('wits');
  const g = {round:0, net:0, phase:'intro', slotOf:[0, 1, 2], coin:0, cheat:false, palmT:0, swaps:[], sw:0, swT:0, lift:[0, 0, 0], liftTo:[0, 0, 0], pickCup:-1, talk:'', caught:false, lastWin:null, busy:false};
  mgOpen({kick:'The Phoenix Inn', title:'Kruppe\'s cups', leaveText:'Leave the table', done:r => opt.after && opt.after(r),
    leave:() => { if (g.phase === 'shuffle' || g.phase === 'pick') { g.net -= CUPS_STAKE[g.round - 1]; S.silver -= CUPS_STAKE[g.round - 1]; save(); } mgClose({net:g.net, caught:g.caught, rounds:g.round}); }});
  const slotX = i => MG.W/2 + (i - 1) * Math.min(MG.W*.24, 150), baseY = () => MG.H*.78, cupW = () => Math.min(70, MG.W*.15);
  const say = (who, line) => { g.talk = mgSay(who, line); draw(); };
  const draw = () => {
    const st = CUPS_STAKE[g.round - 1] || CUPS_STAKE[0];
    const btns = g.phase === 'intro' ? `<button class="btn primary" id="cpGo" data-bot="1" ${S.silver >= CUPS_STAKE[0] ? '' : 'disabled'}>Sit down (${CUPS_STAKE[0]} silver to start)</button>`
      : g.phase === 'pick' ? [0, 1, 2].map(s => `<button class="btn" data-cup="${s}" data-bot="1">${['Left', 'Middle', 'Right'][s]} cup</button>`).join('') + (g.round === 3 ? `<button class="btn ${g.hint ? 'primary' : ''}" id="cpPalm" data-bot="1">"The coin's in your sleeve, Kruppe."</button>` : '')
      : g.phase === 'reveal' ? (g.round < 3 && S.silver >= CUPS_STAKE[g.round] ? `<button class="btn primary" id="cpNext" data-bot="1">Next round (${CUPS_STAKE[g.round]} silver)</button>` : '') + `<button class="btn ${g.round < 3 && S.silver >= CUPS_STAKE[g.round] ? '' : 'primary'}" id="cpDone" data-bot="1">${g.round < 3 ? 'Enough' : 'Thank him and go'}</button>`
      : '';
    mgPanel(`<div class="cpbar"><span>Round ${Math.max(1, g.round)} of 3</span><span>Stake ${st} silver</span><span>${g.net >= 0 ? '+' : '−'}${Math.abs(g.net)} tonight · ${S.silver} silver</span></div>
      ${g.talk}${g.hintHtml || ''}<div class="row mgbtns">${btns}</div>
      <p class="hint keys"><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> pick a cup${g.round === 3 ? ' · <kbd>P</kbd> call the palm' : ''} · <kbd>Space</kbd> go on · <kbd>Esc</kbd> leave</p>`);
    document.querySelectorAll('#mgPanel [data-cup]').forEach(b => b.onclick = () => choose(+b.dataset.cup));
    if ($('#cpPalm')) $('#cpPalm').onclick = callPalm; if ($('#cpGo')) $('#cpGo').onclick = startRound;
    if ($('#cpNext')) $('#cpNext').onclick = startRound; if ($('#cpDone')) $('#cpDone').onclick = () => { AUDIO.play('click'); mgClose({net:g.net, caught:g.caught, rounds:g.round}); };
  };
  const startRound = () => { if (g.busy || S.silver < CUPS_STAKE[g.round]) return; AUDIO.play('click'); g.round++; g.phase = 'show'; g.pickCup = -1; g.hint = false; g.hintHtml = '';
    g.slotOf = [0, 1, 2]; g.coin = R(3); g.cheat = g.round === 3 && (sit === 0 || Math.random() < .5); g.palmT = 0;
    const n = [5, 7, 9][g.round - 1]; g.swaps = []; for (let i = 0; i < n; i++) { const a = R(3); let b = R(2); if (b >= a) b++; g.swaps.push([a, b]); }
    g.dur = [560, 400, 300][g.round - 1] * (REDUCE() ? 1.2 : 1);
    say('Kruppe', pick(g.round === 1 ? ['"A trifle, a diversion. Observe: the coin. The cup. The *other* cups, which are merely cups."', '"Kruppe shows you the coin. Kruppe hides the coin. Kruppe is famously bad at this."'] : g.round === 2 ? ['"Faster, Kruppe thinks. The Sergeant\'s eyes are too good for slow."', '"Double or nothing, as the gamblers say, and Kruppe has always found nothing so restful."'] : ['"The last round. Kruppe\'s round. Kruppe makes it interesting, for the Sergeant\'s sake."', '"Four silver. Kruppe trembles. Look, his hands tremble."']));
    g.liftTo = [0, 0, 0]; g.liftTo[g.coin] = 1; setTimeout(() => { g.liftTo = [0, 0, 0]; setTimeout(() => { g.phase = 'shuffle'; g.sw = 0; g.swT = performance.now(); AUDIO.play('shuffle'); }, 450); }, 1100); };
  const choose = cup => { if (g.phase !== 'pick') return; AUDIO.play('click'); g.phase = 'reveal'; const st = CUPS_STAKE[g.round - 1], slotCup = [0, 1, 2].find(c => g.slotOf[c] === cup);
    g.pickCup = slotCup; g.liftTo = [0, 0, 0]; g.liftTo[slotCup] = 1; const won = !g.cheat && slotCup === g.coin;
    setTimeout(() => {
      if (won) { g.net += st; S.silver += st; AUDIO.play('coin'); mgDeed('cupsWon'); say('Kruppe', pick(['"Kruppe is undone! Kruppe is ruined! Kruppe is, as it happens, delighted."', '"Such eyes. Kruppe knew it the moment the Sergeant came through the door. Eyes like a debt collector."', '"Found! Kruppe salutes the Sergeant, and the coin, which betrayed him."']) + ` <span class="dim">(+${st})</span>`); }
      else { g.net -= st; S.silver -= st; if (g.cheat) { g.coin = [0, 1, 2].find(c => c !== slotCup); g.cheat = false; } // Kruppe 'finds' it under another cup as he lifts it
        setTimeout(() => { g.liftTo = [1, 1, 1]; }, 500); say('Kruppe', pick(['"Alas! The coin is fickle, like Kruppe\'s third wife."', '"Oh, so close. So very close. Kruppe weeps for the Sergeant. There: a tear."', '"The cups are cruel, Sergeant. Kruppe only works for them."']) + ` <span class="dim">(−${st})</span>`); }
      save(); draw(); }, 550); };
  const callPalm = () => { if (g.phase !== 'pick' || g.round !== 3) return; g.phase = 'reveal'; const st = CUPS_STAKE[2];
    if (g.cheat) { g.caught = true; g.net += st*2; S.silver += st*2; AUDIO.play('coin'); mgDeed('cupsCaught'); S.f.c3_kruppeRumour = 1;
      say('Kruppe', `Kruppe goes perfectly still, like a man who has heard his name in a crowd. Then he beams, and turns his left wrist, and the coin drops out of his cuff onto the table and rings there. "Oh, *well* seen. Kruppe has not been caught since— well. Since. Kruppe pays double." <span class="dim">(+${st*2})</span><br><br>He leans in, and lowers his voice, and it is suddenly not a fat man's voice at all. "And a thing overheard, gratis. The roofs of this city are busy at night, Sergeant. The Guild's watchers carry shuttered lanterns and sweep the roofs on a count of eight, and they never, ever look straight down. Kruppe tells you this for no reason. Kruppe never goes up on roofs."`);
      g.liftTo = [1, 1, 1]; g.coin = -1; }
    else { g.net -= st; S.silver -= st; AUDIO.play('click'); g.liftTo = [0, 0, 0]; g.liftTo[g.coin] = 1;
      say('Kruppe', `"Kruppe is *wounded!*" He lays a hand on his heart, then lifts a cup with the other, and the coin is under it, where it always was. "Cut to the very— the very quick. An honest round, and the Sergeant thinks Kruppe a sharper. Well. Kruppe forgives. Kruppe keeps the four silver, but he forgives." <span class="dim">(−${st})</span>`); }
    save(); draw(); };
  // the canvas: Kruppe's corner of the Phoenix, the table, the cups; tap a cup to pick it
  MG.cv.onpointerdown = e => { if (g.phase !== 'pick') return; const r = MG.cv.getBoundingClientRect(), x = e.clientX - r.left; let best = 0, bd = 1e9; [0, 1, 2].forEach(s => { const d = Math.abs(slotX(s) - x); if (d < bd) { bd = d; best = s; } }); if (bd < cupW()) choose(best); };
  MG.anim = t => { const ctx = MG.ctx; if (!ctx || !MG.W) return; const W = MG.W, H = MG.H, now = performance.now();
    ctx.fillStyle = '#120d09'; ctx.fillRect(0, 0, W, H); const fl = .9 + Math.sin(t/300)*.05; glow(ctx, W*.5, H*.12, W*.7, '#e8a050', .3*fl);
    ctx.fillStyle = '#1c140e'; for (let i = 0; i < 6; i++) ctx.fillRect(0, H*(.1 + i*.07), W, 2); // the beams
    // Kruppe behind his table, from the waist up
    const ty = H*.58, ks = clamp(H/40, 3, 10); drawFigure(ctx, 'kruppe', W*.5, ty + ks, ks, t, {still:g.phase !== 'shuffle'});
    // the table
    ctx.fillStyle = '#3a2618'; ctx.fillRect(0, ty, W, H - ty); ctx.fillStyle = '#4a3220'; ctx.fillRect(0, ty, W, 5); ctx.strokeStyle = 'rgba(0,0,0,.25)'; for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, ty + i*(H - ty)/6); ctx.lineTo(W, ty + i*(H - ty)/6 + 3); ctx.stroke(); }
    glow(ctx, W*.5, ty + 40, W*.4, '#e8a050', .12);
    // the shuffle
    let moving = {};
    if (g.phase === 'shuffle') { const k = (now - g.swT) / g.dur;
      if (g.cheat && g.sw === 0 && k > .3 && !g.palmT) { g.palmT = now; g.coin = -1; }
      if (k >= 1) { const [a, b] = g.swaps[g.sw]; g.slotOf = g.slotOf.map(s => s === a ? b : s === b ? a : s); g.sw++; g.swT = now; AUDIO.play('step');
        if (g.sw >= g.swaps.length) { g.phase = 'pick'; if (g.round === 3) { const r = check('wits', 14); notes = notes.filter(n => !/Wits check/.test(n.t)); const who = NAME(r.who);
            g.hint = g.cheat && r.ok; g.hintHtml = `<p class="mgcheck ${r.ok ? 'ok' : 'bad'}">Wits 14 · ${esc(who)}${SET.dice ? ` · ${r.nat} + ${r.mod} = ${r.tot}` : ''} · ${r.ok ? 'success' : 'failure'}</p>` + mgSay(who, r.ok ? (g.cheat ? pick(['"His left cuff. It went up his sleeve on the first swap. It never came back."', '"Sergeant. The coin isn\'t under any of them. Watch his left wrist."']) : pick(['"His hands are clean this time. I\'d swear to it. Watch the cups."', '"Honest round. I think. Follow the cup."'])) : pick(['"I lost it on the third swap. Sorry, Sergeant."', '"I was watching the cups. Was I meant to be watching something else?"']));
            draw(); } else say('', 'Which cup?'); } }
      else { const [a, b] = g.swaps[g.sw], e = ease(clamp(k, 0, 1)); moving[a] = {to:b, e, up:1}; moving[b] = {to:a, e, up:-1}; } }
    // a glint at Kruppe's cuff as the coin goes up it (for anyone watching his hands)
    if (g.palmT && now - g.palmT < 260) { const gx = W*.5 + ks*6.5, gy = ty - ks*1.5; glow(ctx, gx, gy, 16, '#ffe9a8', .9 * (1 - (now - g.palmT)/260)); }
    const cw = cupW(), by = baseY();
    g.lift = g.lift.map((v, c) => lerp(v, g.liftTo[c], .18));
    [0, 1, 2].map(c => { const s = g.slotOf[c], m = moving[s]; let x = slotX(s), y = by, sc = 1;
      if (m) { x = lerp(slotX(s), slotX(m.to), m.e); y = by - Math.sin(m.e*Math.PI) * cw*.35 * m.up; sc = 1 - Math.sin(m.e*Math.PI)*.08*m.up; }
      return {c, x, y, sc}; }).sort((a, b) => a.y - b.y).forEach(({c, x, y, sc}) => {
      if (g.coin === c) { ell(ctx, x, y + 2, cw*.18, cw*.07, '#e0b262'); ell(ctx, x - 2, y, cw*.08, cw*.03, '#fff1c2'); }
      const lift = g.lift[c] * cw*.7, w = cw*sc, h = cw*.95*sc;
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(x + 3, y + 4, w*.5, w*.14, 0, 0, 7); ctx.fill();
      ctx.save(); ctx.translate(x, y - lift); const cg = ctx.createLinearGradient(-w/2, 0, w/2, 0); cg.addColorStop(0, '#3b2416'); cg.addColorStop(.45, '#7a4a2a'); cg.addColorStop(1, '#2a180e');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(-w*.5, 0); ctx.lineTo(-w*.36, -h); ctx.lineTo(w*.36, -h); ctx.lineTo(w*.5, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#8a5a34'; ctx.fillRect(-w*.36, -h, w*.72, 4); ctx.fillStyle = 'rgba(255,220,160,.25)'; ctx.fillRect(-w*.2, -h + 6, 3, h - 10); ctx.restore();
      if (g.phase === 'pick') { ctx.fillStyle = 'rgba(232,192,115,.75)'; ctx.font = `600 ${Math.round(Math.min(15, W*.034))}px 'Alegreya Sans SC', sans-serif`; ctx.textAlign = 'center'; ctx.fillText(String(g.slotOf[c] + 1), x, y + cw*.4); } });
  };
  mgKeys({'1':() => choose(0), '2':() => choose(1), '3':() => choose(2), p:callPalm, ' ':() => { const b = $('#cpGo') || $('#cpNext') || $('#cpDone'); if (b && !b.disabled) b.click(); }, Enter:() => { const b = $('#cpGo') || $('#cpNext') || $('#cpDone'); if (b && !b.disabled) b.click(); }});
  g.talk = mgSay('Kruppe', sit ? '"The Sergeant returns to Kruppe\'s little game! Kruppe is honoured, and a little frightened, and has had the cups washed."' : '"A humble diversion, a trifle, a nothing: three cups and one coin, and a Malazan sergeant with such *eyes*. Kruppe plays for small silver only; Kruppe is a small man, in his way. Three rounds. Follow the coin."');
  draw();
}
/* a sitting at Kruppe's table from one of the Phoenix's conversations, and back to it after */
function playKruppeCups(from){
  S.f.c3_cupsFrom = from;
  playCups({after:r => { if (r.rounds) S.f.c3_cupsSits = (S.f.c3_cupsSits || 0) + 1; S.f.c3_cupsLast = r.caught ? 'caught' : !r.rounds ? 'left' : r.net > 0 ? 'up' : r.net < 0 ? 'down' : 'even'; save(); talk('c3_cups_after'); }});
}

/* ============ Laying the charges: the vault under the Gadrobi crossroads ============
   Three runs of the old vault, twelve cussers between them (three, four, five: the crate, less the dud). Every pipe junction (J)
   must sit inside a cusser's blast, the square around it. Nothing may be in a blast that shouldn't be: the ladder (L), our way out,
   or an arch keystone (A), which holds the street up. And no two cussers may touch, even corner to corner: they'd go together.
   Every run has been solved by search: each needs exactly its count, and has one or two answers. */
const VAULTS = [
  {name:'The north run', k:3, map:['.......', 'J.#....', 'J....A.', '.......', 'LJ#.J.J'],
    intro:'"North run first. Four junctions, three cussers. Mind the arch stone; it\'s older than the city and it knows it."'},
  {name:'Under the fountain', k:4, map:['......J', '..A....', '...###J', 'J.....J', '......J', 'LJ#...J'],
    intro:'"Fountain run. The east wall\'s all pipe. Don\'t get greedy along it."'},
  {name:'The junction', k:5, map:['.JJ..#.', '......J', '.......', '..#.A.J', 'J.....J', 'L.JJJ..'],
    intro:'"The big one. Where the mains cross. Five left, and the dud, which you\'ll leave in the straw where it belongs."'},
];
function playCharges(opt){
  const pick = a => a[R(a.length)];
  const g = {v:0, set:new Set(), cur:{x:3, y:2}, fails:0, done:[], phase:'play', talk:''};
  const V = () => VAULTS[g.v], at = (x, y) => (V().map[y] || '')[x] || '#', rows = () => V().map.length, cols = () => V().map[0].length;
  const pts = () => [...g.set].map(k => k.split(',').map(Number));
  const inBlast = (x, y) => pts().some(([a, b]) => Math.max(Math.abs(a - x), Math.abs(b - y)) <= 1);
  const touching = () => { const p = pts(); return p.filter((a, i) => p.some((b, j) => i !== j && Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) <= 1)); };
  const cells = ch => { const out = []; V().map.forEach((r, y) => [...r].forEach((c, x) => { if (ch.includes(c)) out.push([x, y]); })); return out; };
  mgOpen({kick:'Under the Gadrobi crossroads', title:'Laying the charges', leaveText:'Let Hedge do it', arrows:true, done:r => opt.after && opt.after(r),
    leave:() => mgClose({solved:false, runs:g.done.length})});
  const say = (who, line) => { g.talk = mgSay(who, line); draw(); };
  const draw = () => { const J = cells('J'), cov = J.filter(([x, y]) => inBlast(x, y)).length, left = V().k - g.set.size;
    mgPanel(`<div class="cpbar"><span>${esc(V().name)} · run ${g.v + 1} of ${VAULTS.length}</span><span>Cussers left: <b class="${left < 0 ? 'warnc' : ''}">${left}</b> of ${V().k}</span><span>Junctions: ${cov} of ${J.length}</span></div>
      ${g.talk}
      <div class="row mgbtns">${g.phase === 'play' ? `<button class="btn primary" id="chCheck" data-bot="1" ${g.set.size ? '' : 'disabled'}>Show Hedge</button><button class="btn" id="chClear" ${g.set.size ? '' : 'disabled'}>Clear the run</button>`
        : g.phase === 'next' ? `<button class="btn primary" id="chNext" data-bot="1">${g.v + 1 < VAULTS.length ? 'Next run' : 'Up the ladder'}</button>` : ''}</div>
      <p class="fine">Tap a floor tile to lay a cusser there; tap it again to lift it. Every <b class="jc">junction</b> in a blast; the <b>ladder</b> and the <b class="ac">arch stones</b> out of every blast; no two cussers touching, not even at the corners.</p>
      <p class="hint keys"><kbd>←</kbd><kbd>↑</kbd><kbd>→</kbd><kbd>↓</kbd> move · <kbd>Space</kbd> lay or lift · <kbd>Enter</kbd> show Hedge · <kbd>C</kbd> clear · <kbd>Esc</kbd> let Hedge do it</p>`);
    if ($('#chCheck')) $('#chCheck').onclick = check_; if ($('#chClear')) $('#chClear').onclick = () => { AUDIO.play('click'); g.set.clear(); draw(); };
    if ($('#chNext')) $('#chNext').onclick = next;
  };
  const toggle = (x, y) => { if (g.phase !== 'play') return; const k = K(x, y), c = at(x, y);
    if (g.set.has(k)) { g.set.delete(k); AUDIO.play('click'); return draw(); }
    if (c !== '.') { say('Hedge', c === 'J' ? '"Not ON the pipe. Next to it. You want it cracked, not wearing a hat."' : c === 'L' ? '"That\'s the ladder. We\'ll be wanting that."' : c === 'A' ? '"On the arch stone. Sergeant. On the *arch stone.*"' : '"That\'s brick. Brick doesn\'t take a cusser. Brick takes a cusser personally."'); return; }
    if (g.set.size >= V().k) { say('Hedge', `"That's all ${V().k} of them for this run. Lift one if you want to move it."`); return; }
    g.set.add(k); AUDIO.play('step'); draw(); };
  const check_ = () => { if (g.phase !== 'play') return; AUDIO.play('click');
    const J = cells('J').filter(([x, y]) => !inBlast(x, y)), F = cells('LA').filter(([x, y]) => inBlast(x, y)), T = touching();
    if (T.length) { g.fails++; return say('Hedge', pick(['"Those two are touching. One goes, the other goes, and then *we* go, in several directions."', '"Cussers don\'t hold hands, Sergeant. Spread them."'])); }
    if (F.some(([x, y]) => at(x, y) === 'L')) { g.fails++; return say('Hedge', '"You\'ve blown the ladder. Well. You haven\'t. But you would have, and then how do we get out? We don\'t. That\'s how."'); }
    if (F.length) { g.fails++; return say('Hedge', '"That one takes the arch stone with it, and the street comes in on top of the junction, and the junction\'s the least of your troubles, being under a street."'); }
    if (J.length) { g.fails++; return say('Hedge', J.length === 1 ? '"One junction\'s still dry. Look again. Pipes don\'t hide; they just sit there being pipes."' : `"${numw(J.length, true)} junctions dry. A cusser covers the square around it. Only the square."`); }
    // a clean run
    g.done.push(g.v); g.phase = 'next'; AUDIO.play('coin');
    say('Hedge', g.v === 0 ? pick(['"Huh." He crouches, sights along the pipes, sights again. "Huh. That\'s where I\'d have put them."', '"That\'ll do. That\'ll more than do. Fid! Come and look at this."']) : g.v === 1 ? pick(['"Fountain run\'s good." He sounds almost offended. "Who taught you? Don\'t say Kettle. Don\'t say Kettle."', '"That\'s clean. That\'s the cleanest that run\'s ever been, and I dug it."']) : `"The junction." He's quiet a moment, which from Hedge is a speech. "${g.fails ? 'Took you a couple of goes. Took me more.' : 'First time. Every run, first time.'} All right, Sergeant. You can come down my holes whenever you like."`); };
  const next = () => { AUDIO.play('click'); if (g.v + 1 >= VAULTS.length) return mgClose({solved:true, clean:g.fails === 0, runs:g.done.length});
    g.v++; g.set.clear(); g.phase = 'play'; g.cur = {x:3, y:2}; say('Hedge', VAULTS[g.v].intro); };
  // the vault
  const geo = () => { const W = MG.W, H = MG.H, T = Math.floor(Math.min((W - 16) / cols(), (H - 16) / rows())); return {T, ox:Math.round((W - T*cols())/2), oy:Math.round((H - T*rows())/2)}; };
  MG.cv.onpointerdown = e => { const r = MG.cv.getBoundingClientRect(), {T, ox, oy} = geo(), x = Math.floor((e.clientX - r.left - ox) / T), y = Math.floor((e.clientY - r.top - oy) / T); if (x >= 0 && y >= 0 && x < cols() && y < rows()) { g.cur = {x, y}; toggle(x, y); } };
  MG.anim = t => { const ctx = MG.ctx; if (!ctx || !MG.W) return; const W = MG.W, H = MG.H, {T, ox, oy} = geo();
    ctx.fillStyle = '#0a0807'; ctx.fillRect(0, 0, W, H); glow(ctx, ox + T*.5, oy + T*(rows() - .5), T*3, '#e8b060', .18);
    const J = new Set(cells('J').filter(([x, y]) => inBlast(x, y)).map(([x, y]) => K(x, y))), bad = new Set(cells('LA').filter(([x, y]) => inBlast(x, y)).map(([x, y]) => K(x, y))), tch = new Set(touching().map(([x, y]) => K(x, y)));
    V().map.forEach((row, y) => [...row].forEach((c, x) => { const px = ox + x*T, py = oy + y*T;
      ctx.fillStyle = (x + y) % 2 ? '#1d1712' : '#211a14'; ctx.fillRect(px, py, T, T); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.strokeRect(px + .5, py + .5, T - 1, T - 1);
      if (inBlast(x, y)) { ctx.fillStyle = 'rgba(232,146,58,.16)'; ctx.fillRect(px + 1, py + 1, T - 2, T - 2); }
      if (c === '#') { ctx.fillStyle = '#3a2f26'; ctx.fillRect(px + 2, py + 2, T - 4, T - 4); ctx.strokeStyle = 'rgba(0,0,0,.4)'; for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(px + 2, py + i*T/3); ctx.lineTo(px + T - 2, py + i*T/3); ctx.stroke(); } }
      if (c === 'J') { const on = J.has(K(x, y)); ctx.strokeStyle = '#5a6068'; ctx.lineWidth = T*.18; ctx.beginPath(); ctx.moveTo(px, py + T/2); ctx.lineTo(px + T, py + T/2); ctx.moveTo(px + T/2, py); ctx.lineTo(px + T/2, py + T); ctx.stroke(); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(px + T/2, py + T/2, T*.2, 0, 7); ctx.fillStyle = on ? '#7fb394' : '#8a8f96'; ctx.fill(); if (on) glow(ctx, px + T/2, py + T/2, T*.6, '#7fb394', .35); else glow(ctx, px + T/2, py + T/2, T*.5, '#9ab0c8', .12 + Math.sin(t/500 + x)*.05); }
      if (c === 'L') { ctx.strokeStyle = bad.has(K(x, y)) ? '#e0574a' : '#8a6a44'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px + T*.3, py + 4); ctx.lineTo(px + T*.3, py + T - 4); ctx.moveTo(px + T*.7, py + 4); ctx.lineTo(px + T*.7, py + T - 4); for (let i = 1; i < 4; i++) { ctx.moveTo(px + T*.3, py + i*T/4); ctx.lineTo(px + T*.7, py + i*T/4); } ctx.stroke(); ctx.lineWidth = 1; }
      if (c === 'A') { const b = bad.has(K(x, y)); poly(ctx, [[px + T*.18, py + T*.85], [px + T*.3, py + T*.2], [px + T*.7, py + T*.2], [px + T*.82, py + T*.85]], b ? '#8a3a30' : '#6a5a48'); ctx.strokeStyle = b ? '#e0574a' : '#9a8a70'; ctx.lineWidth = b ? 2 : 1; ctx.stroke(); ctx.lineWidth = 1; if (b) glow(ctx, px + T/2, py + T/2, T*.7, '#e0574a', .25 + Math.sin(t/120)*.1); }
      if (g.set.has(K(x, y))) { const r = T*.3, tc = tch.has(K(x, y)); if (tc) glow(ctx, px + T/2, py + T/2, T*.7, '#e0574a', .3 + Math.sin(t/120)*.12);
        const cg = ctx.createRadialGradient(px + T/2 - r*.3, py + T/2 - r*.3, 1, px + T/2, py + T/2, r); cg.addColorStop(0, '#c8c2b6'); cg.addColorStop(1, '#6e6a62'); ctx.beginPath(); ctx.arc(px + T/2, py + T/2, r, 0, 7); ctx.fillStyle = cg; ctx.fill(); ctx.strokeStyle = tc ? '#e0574a' : '#2a2622'; ctx.stroke();
        ctx.fillStyle = '#2a2622'; ctx.fillRect(px + T/2 - 2, py + T/2 - r - 3, 4, 5); } }));
    if (g.phase === 'play' && FINE()) { const px = ox + g.cur.x*T, py = oy + g.cur.y*T; ctx.strokeStyle = 'rgba(255,224,160,.85)'; ctx.lineWidth = 2; ctx.strokeRect(px + 2, py + 2, T - 4, T - 4); ctx.lineWidth = 1; }
  };
  const mv = (dx, dy) => { g.cur = {x:clamp(g.cur.x + dx, 0, cols() - 1), y:clamp(g.cur.y + dy, 0, rows() - 1)}; };
  mgKeys({ArrowLeft:() => mv(-1, 0), ArrowRight:() => mv(1, 0), ArrowUp:() => mv(0, -1), ArrowDown:() => mv(0, 1), a:() => mv(-1, 0), d:() => mv(1, 0), w:() => mv(0, -1), s:() => mv(0, 1),
    ' ':() => { if (g.phase === 'next') next(); else toggle(g.cur.x, g.cur.y); }, Enter:() => { if (g.phase === 'next') next(); else check_(); }, c:() => { if (g.phase === 'play') { g.set.clear(); draw(); } }});
  g.talk = mgSay('Hedge', `He hands you a lump of chalk. "Three runs, Sergeant. Every junction wants a cusser close enough to crack it: the square round a cusser, that's its reach. Nothing near the ladder; that's our way out. Nothing near the old arch stones, or the street comes in on us. And never two cussers touching, not even at the corners. They'll go together, and then they'll go without you." He grins. "Twelve in the crate. Three runs. Count."`) + mgSay('Hedge', VAULTS[0].intro);
  draw();
}

/* ============ The roof run: across the Daru roofs unseen ============
   Turn-based: every step (or a held breath) is one count, and the Guild's watchers swing their shuttered lanterns on a count of
   eight. End a count in the light and you're seen: back to the plank. Their lanterns never light the slates at their own feet
   (Kruppe was right about that). With Kruppe's rumour you know the count, and see where each lantern will swing next.
   The run below was solved by search (15 counts, with waiting). */
const ROOFRUN = { map:['..C.#....', 'S...p..C.', '..C.#....', '....#...>', '.C..p....', '....#.C..', '..C.#....'],
  watchers:[[2, 4, ['E','E','NE','N','N','NW','W','W']], [6, 2, ['W','W','SW','S','S','SE','E','E']], [7, 5, ['N','N','NW','W','W','NW','N','N']]] };
const RR_DIR = {N:[0,-1], S:[0,1], E:[1,0], W:[-1,0], NE:[1,-1], NW:[-1,-1], SE:[1,1], SW:[-1,1]};
function rrLit(t){ const m = ROOFRUN.map, out = new Set();
  ROOFRUN.watchers.forEach(([wx, wy, seq]) => { const d = RR_DIR[seq[((t % 8) + 8) % 8]], cand = [];
    for (let k = 2; k <= 4; k++) { const cx = wx + d[0]*k, cy = wy + d[1]*k; cand.push([cx, cy]);
      if (k >= 3) { if (!d[0] || !d[1]) cand.push([cx + d[1], cy + d[0]], [cx - d[1], cy - d[0]]); else cand.push([cx - d[0], cy], [cx, cy - d[1]]); } }
    cand.forEach(([x, y]) => { if (y < 0 || y >= m.length || x < 0 || x >= m[0].length || m[y][x] === 'C') return; const n = Math.max(Math.abs(x - wx), Math.abs(y - wy));
      for (let i = 1; i < n; i++) { const ix = Math.round(wx + (x - wx)*i/n), iy = Math.round(wy + (y - wy)*i/n); if (m[iy][ix] === 'C') return; } out.add(K(x, y)); }); });
  return out; }
function playRoofRun(opt){
  const m = ROOFRUN.map, rows = m.length, cols = m[0].length, ws = new Set(ROOFRUN.watchers.map(([x, y]) => K(x, y))), rumour = !!S.f.c3_kruppeRumour;
  const start = (() => { for (let y = 0; y < rows; y++) { const x = m[y].indexOf('S'); if (x >= 0) return {x, y}; } })();
  const g = {pos:{...start}, t:0, seen:0, over:false, flash:0, moves:0, talk:'', trail:[]};
  const pick = a => a[R(a.length)];
  mgOpen({kick:'The Daru roofs', title:'The roof run', leaveText:'Walk across openly', arrows:true, done:r => opt.after && opt.after(r),
    leave:() => mgClose({done:false, seen:g.seen})});
  const can = (x, y) => y >= 0 && y < rows && x >= 0 && x < cols && '.pS>'.includes(m[y][x]) && !ws.has(K(x, y));
  const say = (who, line) => { g.talk = mgSay(who, line); draw(); };
  const draw = () => mgPanel(`<div class="cpbar"><span>Count ${g.t % 8 + 1} of 8</span><span>Seen: <b class="${g.seen ? 'warnc' : ''}">${g.seen}</b></span><span>${g.moves} steps</span></div>
    ${g.talk}
    <div class="row mgbtns">${g.over ? `<button class="btn primary" id="rrDone" data-bot="1">Onto Kalam's roof</button>` : `<button class="btn" id="rrWait" data-bot="1">Hold your breath (wait a count)</button>`}</div>
    <p class="fine">Tap a slate next to the sergeant to step (diagonals too; planks cross the gaps). Every step is a count. End a count in lantern light and you're seen.${rumour ? ' <b class="jc">Kruppe\'s count:</b> the dashed squares are where the lanterns swing next.' : ''}</p>
    <p class="hint keys"><kbd>←</kbd><kbd>↑</kbd><kbd>→</kbd><kbd>↓</kbd> step · <kbd>Space</kbd> wait a count · <kbd>Esc</kbd> walk across openly</p>`),
    bind = () => { if ($('#rrWait')) $('#rrWait').onclick = () => step(0, 0); if ($('#rrDone')) $('#rrDone').onclick = () => { AUDIO.play('click'); mgClose({done:true, seen:g.seen}); }; };
  const redraw = () => { draw(); bind(); };
  const step = (dx, dy) => { if (g.over) return; const nx = g.pos.x + dx, ny = g.pos.y + dy;
    if ((dx || dy) && (!can(nx, ny) || (dx && dy && !(can(g.pos.x + dx, g.pos.y) && can(g.pos.x, g.pos.y + dy))))) return;
    g.t++; g.moves++; if (dx || dy) { g.trail.unshift({...g.pos}); g.trail = g.trail.slice(0, 4); g.pos = {x:nx, y:ny}; AUDIO.play('step'); } else AUDIO.play('click');
    if (rrLit(g.t).has(K(g.pos.x, g.pos.y))) { g.seen++; g.flash = performance.now(); AUDIO.play('hurt'); mgDeed('roofSeen');
      g.pos = {...start}; g.t = 0; g.trail = [];
      g.talk = mgSay('', pick(['A lantern swings. Light across your boots. Somebody two roofs over whistles, low, and you drop back over the plank before the second whistle.', 'The light finds you. A shout in Daric, a clatter of slate, and you\'re back behind the plank with your heart in your mouth.', 'Seen. The watcher\'s lantern stops dead on you, and so do you, and then you\'re running back the way you came.'])) + (g.seen === 1 && !rumour ? mgSay(SQUAD().includes('ellis') ? 'Ellis' : 'Brisk', SQUAD().includes('ellis') ? '"Watch the lanterns, not the roofs. They swing on a count. Learn it."' : '"They swing the same way every time, Sergeant. Watch a while first."') : g.seen === 1 ? mgSay('Kettle', '"Eight. Kruppe said eight. Count it."') : '');
      return redraw(); }
    if (m[g.pos.y][g.pos.x] === '>') { g.over = true; AUDIO.play('coin'); if (!g.seen) mgDeed('roofsUnseen');
      g.talk = mgSay('', g.seen ? `Onto the last roof. The Guild has seen you ${numw(g.seen)} time${g.seen === 1 ? '' : 's'} tonight, and will remember it.` : 'Onto the last roof, low, in the shadow of the parapet, and not one lantern has touched you. Across the leads, very slightly, Kalam\'s head turns.'); return redraw(); }
    g.talk = ''; redraw(); };
  // the roofs
  const geo = () => { const W = MG.W, H = MG.H, T = Math.floor(Math.min((W - 12) / cols, (H - 12) / rows)); return {T, ox:Math.round((W - T*cols)/2), oy:Math.round((H - T*rows)/2)}; };
  MG.cv.onpointerdown = e => { const r = MG.cv.getBoundingClientRect(), {T, ox, oy} = geo(), x = Math.floor((e.clientX - r.left - ox) / T), y = Math.floor((e.clientY - r.top - oy) / T);
    const dx = x - g.pos.x, dy = y - g.pos.y; if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) step(dx, dy); };
  MG.anim = t => { const ctx = MG.ctx; if (!ctx || !MG.W) return; const W = MG.W, H = MG.H, {T, ox, oy} = geo(), lit = rrLit(g.t), next = rumour && !g.over ? rrLit(g.t + 1) : null;
    ctx.fillStyle = '#05070c'; ctx.fillRect(0, 0, W, H);
    m.forEach((row, y) => [...row].forEach((c, x) => { const px = ox + x*T, py = oy + y*T;
      if (c === '#') { const gb = ctx.createLinearGradient(px, py, px, py + T); gb.addColorStop(0, '#0a1020'); gb.addColorStop(1, '#16305a'); ctx.fillStyle = gb; ctx.fillRect(px, py, T, T); glow(ctx, px + T/2, py + T, T*.9, '#6aa8ff', .12 + Math.sin(t/900 + y)*.03); return; }
      ctx.fillStyle = (x + y) % 2 ? '#1f2530' : '#232a36'; ctx.fillRect(px, py, T, T); ctx.strokeStyle = 'rgba(0,0,0,.4)'; for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(px, py + i*T/4); ctx.lineTo(px + T, py + i*T/4); ctx.stroke(); }
      if (c === 'p') { ctx.fillStyle = '#5a4128'; ctx.fillRect(px + T*.12, py, T*.76, T); ctx.strokeStyle = '#3a2a1a'; ctx.beginPath(); ctx.moveTo(px + T/2, py); ctx.lineTo(px + T/2, py + T); ctx.stroke(); }
      if (c === 'C') { ctx.fillStyle = '#3b3530'; ctx.fillRect(px + T*.2, py + T*.15, T*.6, T*.7); ctx.fillStyle = '#4e463f'; ctx.fillRect(px + T*.16, py + T*.1, T*.68, T*.14); ell(ctx, px + T/2, py + T*.18, T*.16, T*.06, '#171412'); }
      if (c === '>') { ctx.fillStyle = 'rgba(232,192,115,.16)'; ctx.fillRect(px + 2, py + 2, T - 4, T - 4); ctx.strokeStyle = 'rgba(232,192,115,.7)'; ctx.setLineDash([4, 3]); ctx.strokeRect(px + 3, py + 3, T - 6, T - 6); ctx.setLineDash([]); }
      if (c === 'S') { ctx.strokeStyle = 'rgba(159,224,184,.35)'; ctx.strokeRect(px + 3, py + 3, T - 6, T - 6); }
      if (lit.has(K(x, y))) { ctx.fillStyle = `rgba(255,200,110,${.32 + Math.sin(t/140)*.05})`; ctx.fillRect(px, py, T, T); }
      else if (next && next.has(K(x, y))) { ctx.strokeStyle = 'rgba(255,200,110,.55)'; ctx.setLineDash([3, 3]); ctx.strokeRect(px + 3, py + 3, T - 6, T - 6); ctx.setLineDash([]); } }));
    // the watchers, lanterns turned the way they're looking
    ROOFRUN.watchers.forEach(([wx, wy, seq]) => { const d = RR_DIR[seq[g.t % 8]], px = ox + wx*T + T/2, py = oy + wy*T + T*.6;
      glow(ctx, px + d[0]*T*.35, py - T*.3 + d[1]*T*.35, T*1.2, '#ffc070', .35); drawFigure(ctx, 'assassin', px, py, T/34, t, {still:true, dir:d[0] < 0 ? -1 : 1});
      ctx.fillStyle = '#ffd890'; ctx.beginPath(); ctx.arc(px + d[0]*T*.3, py - T*.35 + d[1]*T*.3, T*.07, 0, 7); ctx.fill(); });
    // the squad: the sergeant in front, the others tucked in behind
    g.trail.slice(0, 2).forEach((p, i) => drawFigure(ctx, SQUAD()[i + 1] || 'brisk', ox + p.x*T + T/2, oy + p.y*T + T*.62, T/40, t, {still:true, alpha:.7}));
    drawFigure(ctx, 'sgt', ox + g.pos.x*T + T/2, oy + g.pos.y*T + T*.62, T/34, t, {still:true});
    if (!g.over) { ctx.strokeStyle = 'rgba(232,192,115,.55)'; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = g.pos.x + dx, ny = g.pos.y + dy; if (can(nx, ny) && (!(dx && dy) || (can(g.pos.x + dx, g.pos.y) && can(g.pos.x, g.pos.y + dy)))) ctx.strokeRect(ox + nx*T + 5.5, oy + ny*T + 5.5, T - 11, T - 11); } }
    if (g.flash && performance.now() - g.flash < 500) { ctx.fillStyle = `rgba(255,220,150,${.4*(1 - (performance.now() - g.flash)/500)})`; ctx.fillRect(0, 0, W, H); }
  };
  mgKeys({ArrowLeft:() => step(-1, 0), ArrowRight:() => step(1, 0), ArrowUp:() => step(0, -1), ArrowDown:() => step(0, 1), a:() => step(-1, 0), d:() => step(1, 0), w:() => step(0, -1), s:() => step(0, 1),
    q:() => step(-1, -1), e:() => step(1, -1), z:() => step(-1, 1), c:() => step(1, 1), ' ':() => { if (g.over) { const b = $('#rrDone'); b && b.click(); } else step(0, 0); }, Enter:() => { const b = $('#rrDone'); b && b.click(); }});
  g.talk = mgSay('', 'Three roofs to Kalam\'s, and the Guild has watchers out on the ridges tonight, each with a shuttered lantern, swinging it slow across the slates on a count.') + (rumour ? mgSay('Kettle', '"Count of eight. Kruppe said. And they never look straight down." A beat. "I wrote it on my hand."') : mgSay(SQUAD().includes('ellis') ? 'Ellis' : 'Brisk', SQUAD().includes('ellis') ? '"Low and slow, Sergeant. Watch the lanterns before you move."' : '"Low, Sergeant. Low and slow."'));
  redraw();
}

/* ============ Masks at the Fete: five names for Whiskeyjack ============
   Five masked guests in Lady Simtal's hall, each with a mask and a few tells; seven names to give them (two of the seven are not
   dancing: the alchemist wears no mask tonight, and the boy is up in the gallery). One list, handed to Fiddler once. The tells
   all come from what the squad has seen: the Phoenix, the street before the gate, the terrace. */
const MASKS = [
  {id:'murillio', name:'Murillio', mask:'fox', col:'#5a4a8a', tells:['A fox mask, and silk the colour of a bruise.', 'Rings on three fingers of each hand.', 'He looks at your boots as you pass, and winces for them.']},
  {id:'coll', name:'Coll', mask:'bear', col:'#5a4a3c', tells:['A bear mask that hides nothing of the shoulders.', 'A jug, not a glass. He drinks like a man keeping a promise to someone who isn\'t here.', 'He stands like a soldier who has forgotten he was one.']},
  {id:'challice', name:'Challice D\'Arle', mask:'half', col:'#8a8fa8', tells:['A silver half-mask. Young.', 'She is dancing with a partner she didn\'t choose.', 'She keeps looking past him, at the tall windows, as if somebody might come in through one.']},
  {id:'orr', name:'Turban Orr', mask:'leaves', col:'#3a6a3a', tells:['A mask of gilded leaves, pushed up on the forehead. Green and gold.', 'A rapier worn as if it has been used.', 'Holding court; his eyes keep going to one thin young guard by the balustrade.']},
  {id:'derudan', name:'Derudan', mask:'feathers', col:'#2a2420', tells:['Black feathers, and a long clay pipe smoked through the mask\'s mouth, which should be impossible.', 'Old dark hands. Rings of bone.', 'The candles nearest her lean away.']},
];
const MASK_NAMES = ['Murillio', 'Coll', 'Challice D\'Arle', 'Turban Orr', 'Derudan', 'Baruk', 'Crokus'];
function playMasks(opt){
  const order = [0, 1, 2, 3, 4].sort(() => Math.random() - .5), guests = order.map(i => MASKS[i]);
  const g = {sel:0, as:[null, null, null, null, null], done:false, right:0, talk:''};
  mgOpen({kick:'Lady Simtal\'s hall', title:'Masks at the Fete', leaveText:'Not now', done:r => opt.after && opt.after(r),
    leave:() => mgClose({done:g.done, right:g.right})});
  const say = (who, line) => { g.talk = mgSay(who, line); draw(); };
  const draw = () => { const used = new Set(g.as.filter(Boolean));
    mgPanel(`${g.talk}
      <div class="mkcards">${guests.map((m, i) => `<button class="mkcard ${i === g.sel && !g.done ? 'on' : ''} ${g.done ? (g.as[i] === m.name ? 'ok' : 'bad') : ''}" data-g="${i}" data-bot="1"><span class="mkn">${i + 1}</span><span class="mkt">${m.tells.map(esc).join(' ')}</span><b>${g.done ? (g.as[i] === m.name ? `✓ ${esc(m.name)}` : `✗ ${g.as[i] ? esc(g.as[i]) : 'no name'}: it's ${esc(m.name)}`) : g.as[i] ? esc(g.as[i]) : '<i>who?</i>'}</b></button>`).join('')}</div>
      ${g.done ? '' : `<div class="mkchips">${MASK_NAMES.map((n, i) => `<button class="btn mini ${used.has(n) ? 'used' : ''}" data-n="${i}" data-bot="1"><kbd class="mkk">${'abcdefg'[i]}</kbd>${esc(n)}</button>`).join('')}</div>`}
      <div class="row mgbtns">${g.done ? `<button class="btn primary" id="mkDone" data-bot="1">Back to the terrace</button>` : `<button class="btn primary" id="mkHand" data-bot="1" ${g.as.some(Boolean) ? '' : 'disabled'}>Hand Fiddler the list</button>`}</div>
      <p class="hint keys"><kbd>1</kbd>–<kbd>5</kbd> pick a guest · <kbd>A</kbd>–<kbd>G</kbd> give a name · <kbd>Enter</kbd> hand in the list · <kbd>Esc</kbd> not now</p>`);
    document.querySelectorAll('#mgPanel [data-g]').forEach(b => b.onclick = () => { if (g.done) return; const i = +b.dataset.g; if (g.sel === i && g.as[i]) g.as[i] = null; g.sel = i; AUDIO.play('click'); draw(); });
    document.querySelectorAll('#mgPanel [data-n]').forEach(b => b.onclick = () => name(+b.dataset.n));
    if ($('#mkHand')) $('#mkHand').onclick = hand; if ($('#mkDone')) $('#mkDone').onclick = () => { AUDIO.play('click'); mgClose({done:true, right:g.right}); };
  };
  const name = i => { if (g.done) return; const n = MASK_NAMES[i], prev = g.as.indexOf(n); if (prev >= 0) g.as[prev] = null; g.as[g.sel] = n; AUDIO.play('flip');
    const nx = g.as.findIndex(a => !a); if (nx >= 0) g.sel = nx; draw(); };
  const hand = () => { if (g.done || !g.as.some(Boolean)) return; g.done = true; g.right = guests.filter((m, i) => g.as[i] === m.name).length; AUDIO.play(g.right >= 4 ? 'coin' : 'click');
    mgDeed('masksRight', g.right); if (g.right === 5) mgDeed('masksAll');
    say('Fiddler', g.right === 5 ? '"Five for five." He reads it twice, which is once more than he reads anything. "Whiskeyjack\'s going to ask me who wrote this. I\'m going to tell him."' : g.right >= 3 ? `"${numw(g.right, true)} right." He folds it into his sleeve. "That's more than the Council knows about itself. It'll do."` : g.right ? `"${numw(g.right, true)}." He looks at the list, and at you, and at the list. "Well. It's a Fete. Everybody looks like somebody else."` : '"None." He reads it again, in case. "Sergeant, I think you\'ve named the chandeliers."'); };
  // the hall: five figures under the chandeliers, each in a mask; tap one to pick it
  const fx = i => MG.W * (i + .5) / 5;
  MG.cv.onpointerdown = e => { if (g.done) return; const r = MG.cv.getBoundingClientRect(), x = e.clientX - r.left, i = clamp(Math.floor(x / (MG.W / 5)), 0, 4); g.sel = i; AUDIO.play('click'); draw(); };
  MG.anim = t => { const ctx = MG.ctx; if (!ctx || !MG.W) return; const W = MG.W, H = MG.H;
    ctx.fillStyle = '#16100c'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 3; i++) { const cx = W*(.2 + i*.3), fl = .9 + Math.sin(t/200 + i)*.05; glow(ctx, cx, H*.08, W*.3, '#ffd890', .3*fl); ctx.fillStyle = 'rgba(255,230,170,.8)'; for (let k = 0; k < 7; k++) ctx.fillRect(cx - 30 + k*10, H*.08 + Math.sin(k)*3, 2, 3); }
    for (let x = 0; x < W; x += 28) for (let y = H*.62; y < H; y += 28) { ctx.fillStyle = ((x/28 + Math.floor(y/28)) % 2) ? '#d8d0c0' : '#1a1512'; ctx.globalAlpha = .18; ctx.fillRect(x, y, 28, 28); } ctx.globalAlpha = 1;
    const s = clamp(H/72, 2.4, 5);
    guests.forEach((m, i) => { const x = fx(i), y = H*.8, sway = Math.sin(t/700 + i*1.7)*s*1.2, sel = i === g.sel && !g.done;
      if (sel) glow(ctx, x, y - s*12, s*16, '#e8c073', .3 + Math.sin(t/250)*.08);
      if (g.done) glow(ctx, x, y - s*12, s*14, g.as[i] === m.name ? '#7fb394' : '#e0574a', .28);
      ctx.save(); ctx.translate(x + sway, y); ctx.scale(s, s);
      ell(ctx, 0, 13, 9, 3, 'rgba(0,0,0,.5)'); poly(ctx, [[-7, -6], [7, -6], [9, 12], [-9, 12]], m.col); ell(ctx, 0, -11, 4.6, 4.8, '#c8a488');
      const k = m.mask; ctx.fillStyle = '#000';
      if (k === 'fox') { poly(ctx, [[-5, -12], [5, -12], [0, -6]], '#c8642a'); poly(ctx, [[-5, -13], [-3.5, -18], [-2, -13]], '#c8642a'); poly(ctx, [[5, -13], [3.5, -18], [2, -13]], '#c8642a'); ctx.fillStyle = '#1a0c06'; ctx.fillRect(-3, -12.2, 1.6, 1); ctx.fillRect(1.4, -12.2, 1.6, 1); }
      if (k === 'bear') { ell(ctx, 0, -11.5, 5.4, 5, '#5a3a22'); ell(ctx, -4, -16, 1.8, 1.8, '#5a3a22'); ell(ctx, 4, -16, 1.8, 1.8, '#5a3a22'); ell(ctx, 0, -9.5, 2.2, 1.6, '#3a2414'); ctx.fillStyle = '#0d0805'; ctx.fillRect(-2.8, -13, 1.5, 1.2); ctx.fillRect(1.3, -13, 1.5, 1.2); ctx.fillStyle = '#8a6a44'; ctx.fillRect(7, -3, 3, 7); }
      if (k === 'half') { ctx.fillStyle = '#d8dce8'; ctx.beginPath(); ctx.moveTo(-5, -13); ctx.quadraticCurveTo(0, -15, 5, -13); ctx.lineTo(4.5, -10.5); ctx.quadraticCurveTo(0, -9.5, -4.5, -10.5); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#1a1a22'; ctx.fillRect(-3, -12.4, 1.6, 1); ctx.fillRect(1.4, -12.4, 1.6, 1); ctx.fillStyle = '#3a2418'; ctx.beginPath(); ctx.arc(0, -13.5, 4.8, Math.PI, 0); ctx.fill(); }
      if (k === 'leaves') { for (let a = -4; a <= 4; a++) ell(ctx, a*1.2, -16 + Math.abs(a)*.4, 1.4, 2.2, a % 2 ? '#c9973f' : '#4a7a3a', a*.25); ctx.fillStyle = '#e8c073'; ctx.fillRect(-7, -6, 14, 1); ctx.strokeStyle = '#cfc8b8'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(7, 3); ctx.lineTo(10, 10); ctx.stroke(); }
      if (k === 'feathers') { for (let a = -5; a <= 5; a++) poly(ctx, [[a*.9 - .8, -12], [a*1.6, -19 - (5 - Math.abs(a))*.5], [a*.9 + .8, -12]], a % 2 ? '#1a1410' : '#8a6a3a'); ell(ctx, 0, -10.5, 4.6, 3, '#1a1410'); ctx.strokeStyle = '#d8c8a8'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(1, -9); ctx.lineTo(8, -7); ctx.stroke(); const sm = (t/60) % 20; ctx.fillStyle = `rgba(200,200,210,${.5 - sm/40})`; ctx.beginPath(); ctx.arc(9 + sm*.2, -8 - sm*.6, 1 + sm*.1, 0, 7); ctx.fill(); }
      ctx.restore();
      ctx.fillStyle = sel ? '#e8c073' : 'rgba(200,190,170,.7)'; ctx.font = `600 ${Math.round(clamp(W*.035, 11, 16))}px 'Alegreya Sans SC', sans-serif`; ctx.textAlign = 'center'; ctx.fillText(String(i + 1), x, H*.97);
      if (g.as[i]) { ctx.fillStyle = g.done ? (g.as[i] === m.name ? '#9fe0b8' : '#f08a7c') : '#e8c073'; ctx.font = `italic ${Math.round(clamp(W*.03, 10, 15))}px 'IM Fell English', serif`; ctx.fillText(g.as[i].split(' ')[0], x, y - s*22); } });
  };
  mgKeys(Object.assign({'1':() => { g.sel = 0; draw(); }, '2':() => { g.sel = 1; draw(); }, '3':() => { g.sel = 2; draw(); }, '4':() => { g.sel = 3; draw(); }, '5':() => { g.sel = 4; draw(); }, Enter:() => { if (g.done) { const b = $('#mkDone'); b && b.click(); } else hand(); }, ' ':() => { const b = $('#mkDone'); b && b.click(); }},
    Object.fromEntries('abcdefg'.split('').map((c, i) => [c, () => name(i)]))));
  g.talk = mgSay('Fiddler', '"Whiskeyjack wants names. Five of them, the ones worth knowing, under those masks." He nods at the hall. "Walk it. Look. Tell me who\'s who. You\'ve met half this city already, one way or another; the other half\'s met you."');
  draw();
}
