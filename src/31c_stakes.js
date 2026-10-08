/* ============ v3.12 stakes: second areas, enemy tricks, Ohl's other hands, wounds that carry, and the gods ============ */

/* ---- second areas: a fight with def.stage2 goes on into a second map after the first is cleared. Wounds, strain, spent
   munitions and once-a-fight abilities carry; a squadmate who went down is dragged up at a quarter of their health. ---- */
function battleDef(id, stage){
  const d0 = BATTLES[id], tw = d0 && DIFF() !== DIFFS.story && BTUNE[id] && BTUNE[id].waves && stage !== 2 ? BTUNE[id].waves : null;
  const d = tw ? Object.assign({}, d0, {waves:[...(d0.waves || []), ...tw]}) : d0; // the tuning table's extra waves (31c)
  if (!d || stage !== 2 || !d.stage2) return d;
  const s2 = d.stage2;
  return Object.assign({}, d, {waves:undefined, objective:undefined, allies:s2.keepAllies ? d.allies : undefined, surprise:undefined}, s2,
    {stage2:null, isStage2:true, xp:(d.xp || 0) + (s2.xp ?? Math.round((d.xp || 0) * .5))});
}
/* the breath between the two areas: a line of story, then on */
function stageBreak(){
  if (!B) return; const id = B.id, d = BATTLES[id], s2 = d && d.stage2; if (!s2) return win();
  const carry = {}, used = Object.assign({}, B.used), strain = {};
  B.units.filter(u => u.side === 'p' && !u.ally).forEach(u => { carry[u.id] = u.hp > 0 ? u.hp : Math.max(1, Math.round(u.maxhp * .25)); strain[u.id] = u.strain || 0; });
  const downed = B.units.filter(u => u.side === 'p' && !u.ally && u.hp <= 0).map(u => u.name);
  S.binv = Object.assign({}, S.inv); // the satchel goes on as it is now, not as it was when the first area began
  const opt = Object.assign({}, B.opt, {stage:2, carry, used, strain, pre:null, surprise:s2.surprise || null, drop:null});
  S.bopt = opt; save();
  const sh = $('#sheet'); sh.hidden = false;
  sh.innerHTML = `<div class="sp">${esc(s2.title || d.title)}</div><div class="note">The first ground is taken. Wounds, strain and spent munitions carry into the next.${downed.length ? ` ${downed.join(' and ')} ${downed.length > 1 ? 'are' : 'is'} dragged back up at a quarter of their health.` : ''}</div>
    <div class="txt">${fmt(typeof s2.text === 'function' ? s2.text() : (s2.text || 'There is more of it, further in.'))}</div>
    <div class="choices"><button class="choice" id="bOn">Push on</button></div>`;
  sh.scrollTop = 0;
  $('#bOn').onclick = () => { AUDIO.play('click'); sh.hidden = true; startBattle(id, opt); };
}

/* ---- the road gets harder: enemies scale with the chapter (Soldier and Bridgeburner; Story keeps the old pitch).
   Tuned with tools/balance.mjs against a squad at the level the road brings it to. ---- */
const FSCALE = [{hp:1.2, atk:1, dmg:0}, {hp:1.45, atk:2, dmg:1}, {hp:1.6, atk:3, dmg:1}, {hp:1.7, atk:3, dmg:2}, {hp:1.7, atk:3, dmg:2}, {hp:1.8, atk:4, dmg:2}, {hp:1.9, atk:4, dmg:3}, {hp:1.95, atk:4, dmg:3}];
/* per fight on top of the chapter's curve ('id' or 'id:2' for a second area): the hold-out fights needed teeth, a few new ones less */
const BTUNE = {
  'stone:2':{hp:1.1, atk:1, dmg:1}, hounds_line:{atk:4, dmg:4, waves:[{round:3, foes:[['shade',1,0],['shade',6,0]], text:'Shadow comes after the Hound in pieces, low to the ground.'}]}, hounds_claw:{atk:4, dmg:4, waves:[{round:2, foes:[['shade',6,1]], text:'Something smaller comes through behind it.'}]}, c1_wagon:{atk:2},
  barrow:{hp:1.1, atk:1}, outriders:{hp:1.2, atk:2}, c2_deserters:{atk:1}, cutpurses:{atk:1}, knives:{hp:.92}, c3_toughs:{hp:1.15, atk:1},
  andii_roof:{atk:5, dmg:5}, c4_clan:{hp:1.15, atk:1}, c5_dig:{atk:1}, the_rent:{hp:1.2, atk:3, dmg:3},
  garden_hound:{atk:6, dmg:6, waves:[{round:2, foes:[['shade',0,1],['shade',7,1]], text:'Two lesser shadows come over the garden wall after it.'}]}, tyrant_garden:{atk:4, dmg:3}, lorn_alley:{atk:-3, dmg:-3}, // the alley is mortal: kept near its old edge
  last_accounting:{hp:.75, atk:-1}, 'last_accounting:2':{hp:.8, atk:-1}, c7_worrygate:{hp:.8, atk:-1}, // the gate was 6–25% for a smart squad
};
const foeScale = () => { if (DIFF() === DIFFS.story) return {hp:1, atk:0, dmg:0};
  const c = FSCALE[clamp((S && S.chapter) || 0, 0, FSCALE.length - 1)], t = (B && (BTUNE[B.id + (B.def && B.def.isStage2 ? ':2' : '')] || BTUNE[B.id])) || {};
  return {hp:c.hp * (t.hp || 1), atk:c.atk + (t.atk || 0), dmg:c.dmg + (t.dmg || 0)}; };
/* the longer road pays more fights; each pays a little less, so the squad levels about as it did (and not to the cap by Chapter Four) */
const XPK = .6;

/* ---- enemy tricks: one or two a kind, announced in the log. Off on Story. ---- */
const FOE_SK = {
  xbow:['pin'], clawcrossbow:['pin'],
  shade:['drain'], warrenspawn:['bleed'],
  hound:['pounce','howl'], houndhurt:['pounce','howl'],
  assassin:['shadowstep','bleed'], clawknife:['shadowstep','bleed'], knife:['bleed'], guildknife:['bleed'],
  guildveteran:['parry','bleed'], greycloak:['mark','parry'],
  wight:['chill'], rime:['chill'], ward:['root'],
  rhivi:['hitrun'], cutpurse:['hitrun'], bruiser:['shove'],
  houseguard:['reach'], housecaptain:['reach','rally'],
  clawmage:['daze'], andiihunter:['darkness'],
};
const SORC = ['drain','shadowstep','howl','daze','darkness','mark']; // what otataral takes away
function foeSkills(k, f){ if (DIFF() === DIFFS.story) return []; return (f.sk || FOE_SK[k] || []).slice(); }
const hasSk = (u, k) => !!(u && u.sk && u.sk.includes(k) && !(u.otat && SORC.includes(k)));
/* what a blow from an enemy leaves behind on a squadmate */
function foeRiders(a, t, dmg){
  if (!a || a.side !== 'e' || !t || t.side !== 'p') return;
  if (hasSk(a, 'bleed') && t.hp > 0) { t.bleed = 2; float(t, 'bleeding', '#e0574a'); }
  if ((hasSk(a, 'chill') || hasSk(a, 'pin')) && t.hp > 0) { t.slowTurn = true; float(t, hasSk(a, 'pin') ? 'pinned' : 'chilled', hasSk(a, 'pin') ? '#cfc8b8' : '#bfe8ff'); }
  if (hasSk(a, 'root') && t.hp > 0) { t.prone = true; float(t, 'held', '#9a86e0'); }
  if (hasSk(a, 'drain') && a.hp > 0 && dmg > 0) { heal(a, dmg); blog(`${a.name} drinks something out of ${t.name} and is whole again.`); }
  if (hasSk(a, 'shove') && t.hp > 0) { const dx = Math.sign(t.x - a.x), dy = Math.sign(t.y - a.y), nx = t.x + dx, ny = t.y + dy;
    if ((dx || dy) && free(nx, ny, t)) { t.x = nx; t.y = ny; blog(`${a.name} shoves ${t.name} back a pace.`); float(t, 'shoved', '#cfc8b8');
      if (B.fires.some(f => f.x === nx && f.y === ny)) { blog(`${t.name} goes back into the fire.`); hurt(t, roll(1,6)); } } }
}
/* the squad's own state at the start of its turn: bleeding, slowed, held down. Returns false if the turn is lost to it. */
function squadTurnStart(u){
  if (u.bleed > 0) { u.bleed--; blog(`${u.name} is bleeding.`); hurt(u, roll(1,4)); }
  if (u.slowTurn) { u.slowTurn = false; B.mvLeft = Math.max(0, u.mv - 2); float(u, 'slowed', '#bfe8ff'); }
  if (u.prone) { u.prone = false; B.mvLeft = 0; blog(`${u.name} spends the turn getting up.`); float(u, 'getting up', '#cfc8b8'); }
  B.units.forEach(p => { if (p.stanch === u) p.stanch = null; }); // Ohl's hold lasts until his next turn
}
/* an enemy's trick before its ordinary move: true if it used the whole turn */
async function foeSpecial(u, gone){
  const sq = party().filter(p => !p.ally), t0 = sq.slice().sort((a, b) => a.hp - b.hp)[0]; if (!sq.length) return false;
  u.cd = u.cd || {}; const ready = k => hasSk(u, k) && !(u.cd[k] > B.round);
  const adjFree = t => DIRS.map(([dx, dy]) => ({x:t.x + dx, y:t.y + dy})).filter(p => free(p.x, p.y, u));
  // free actions first
  if (ready('howl') && B.round >= 1 && !B.used['howl_' + u.kind]) { B.used['howl_' + u.kind] = 1; B.howlUntil = B.round + 1; AUDIO.play('growl'); shakeMap(); blog(`<em>${u.name} howls.</em> Every hand in the Fourth shakes: −1 to hit through the next round.`); await wait(500); if (gone()) return true; }
  if (ready('rally') && u.hp < u.maxhp / 2 && !u.rallied) { u.rallied = true; B.foeRallyUntil = B.round + 1; blog(`${u.name} bellows for the household. The guards take heart: +2 to hit through the next round.`); float(u, 'rally', '#f08a7c'); await wait(400); if (gone()) return true; }
  if (ready('darkness') && u.hp < u.maxhp && !u.darkened) { u.darkened = true; u.darkUntil = B.round + 1; blog(`Kurald Galain closes round ${u.name} like a cloak: −2 to hit it through the next round.`); float(u, 'darkness', '#3a3070'); await wait(400); if (gone()) return true; }
  if (ready('mark')) { const t = sq.filter(p => cheb(u, p) <= 6).sort((a, b) => a.hp - b.hp)[0]; if (t) { u.cd.mark = B.round + 2; t.clawMarkUntil = B.round + 1; blog(`${u.name} looks at ${t.name} and writes something down. <em>Every Claw blade on the field knows the name now: +2 to hit them.</em>`); float(t, 'marked', '#f08a7c'); await wait(400); if (gone()) return true; } }
  // whole-turn tricks
  if (ready('daze')) { const t = sq.filter(p => cheb(u, p) <= 4 && canShoot(u, p))[0]; if (t && R(3) === 0) { u.cd.daze = B.round + 2;
    const res = d20() + (TPL[t.id] ? statOf(t.id, 'wits') : 0) + (t.steady ? 2 : 0); if (t.steady) { t.steady = false; blog(`${t.name} was steady for it.`); } B.fx.push({kind:'bolt', from:{x:u.x,y:u.y}, to:{x:t.x,y:t.y}, col:'#c9bbff', t:performance.now(), dur:400, wob:true}); AUDIO.play('shadow');
    if (res >= 14) { blog(`${u.name} whispers into ${t.name}'s head. ${t.name} does not listen${SET.dice ? ` (${res} vs 14)` : ''}.`); float(t, 'resists', '#a99a88'); }
    else { t.stun = true; blog(`${u.name} whispers into ${t.name}'s head, and ${t.name} stops to listen${SET.dice ? ` (${res} vs 14)` : ''}.`); float(t, 'dazed', '#c9bbff'); }
    await wait(650); return true; } }
  if (ready('pounce') && !sq.some(p => cheb(u, p) === 1)) { const t = sq.filter(p => cheb(u, p) <= 5 && adjFree(p).length).sort((a, b) => cheb(u, a) - cheb(u, b))[0];
    if (t) { u.cd.pounce = B.round + 2; const at = adjFree(t).sort((a, b) => cheb(u, a) - cheb(u, b))[0]; sparks(u.x, u.y, 12, '#3a3070', .6); u.facing = t.x >= u.x ? 1 : -1; u.x = at.x; u.y = at.y; AUDIO.play('growl');
      blog(`<em>${u.name} leaps.</em>`); await wait(250); if (gone()) return true; const r = attack(u, t, {verb:'comes down on', bonus:2}); if (r.hit) later(() => { if (t.hp > 0) { t.prone = true; float(t, 'knocked down', '#cfc8b8'); } }, pace(200)); await wait(650); return true; } }
  if (ready('shadowstep') && !u.stepped) { const t = t0 && adjFree(t0).length ? t0 : null;
    if (t && cheb(u, t) > 1) { u.stepped = true; const at = adjFree(t).sort((a, b) => (flanked(u, t, b) ? -1 : 0) - (flanked(u, t, a) ? -1 : 0))[0]; sparks(u.x, u.y, 12, '#9a86e0', .5); u.x = at.x; u.y = at.y; u.facing = t.x >= u.x ? 1 : -1; AUDIO.play('shadow');
      blog(`${u.name} steps into a shadow and out of another, behind ${t.name}.`); await wait(250); if (gone()) return true; attack(u, t); await wait(650); return true; } }
  return false;
}
/* after its blow, a Rhivi rider or a cutpurse does not stay to be hit back */
async function foeAfter(u, gone){
  if (!hasSk(u, 'hitrun') || u.hp <= 0) return;
  const sq = party(); if (!sq.some(p => cheb(u, p) === 1)) return;
  let best = null, bd = -1; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const x = u.x + dx, y = u.y + dy; if ((dx || dy) && free(x, y, u)) { const d = Math.min(...sq.map(p => cheb({x, y}, p))); if (d > bd) { bd = d; best = {x, y}; } } }
  if (best && bd > 1) { u.x = best.x; u.y = best.y; blog(`${u.name} is gone again before anyone can answer.`); AUDIO.play('step'); await wait(300); }
}

/* ---- Ohl's other hands: Denul Wash for the many, Stanch for the one who is about to go ---- */
Object.assign(AB, {
  wash:{name:'Denul Wash', strain:3, self:true, desc:()=>`Ohl and every squadmate within 3 of him heal 2d4+${2 + lvB()}${B && B.warren && B.warren.denul < 1 ? ' (weakened here)' : ''}, and their bleeding stops. Grows with the squad's level. Strain 3.`,
    run(u){ const d = (B.warren && B.warren.denul) || 1, near = party().filter(p => !p.ally && cheb(p, u) <= 3); AUDIO.play('heal');
      near.forEach(p => { heal(p, Math.max(1, Math.round(roll(2,4,2 + lvB()) * d))); p.bleed = 0; sparks(p.x, p.y, 10, '#9fe0b8', .35); });
      blog(`${u.name} opens his hands and lets Denul out like water from a cup. ${near.length > 1 ? 'Everyone close enough feels it.' : 'There is nobody close enough but him.'}${d < 1 ? ' It comes thin here.' : ''}`); }},
  stanch:{name:'Stanch', strain:2, desc:()=>'A squadmate within 3 cannot drop below 1 health until Ohl\'s next turn, and stops bleeding. No healing. Strain 2.',
    tiles:u=>party().filter(p => !p.ally && cheb(u, p) <= 3 && p.stanch !== u),
    run(u,x,y){ const t = unitAt(x,y); if (!t) return; t.stanch = u; t.bleed = 0; AUDIO.play('heal'); float(t, 'stanched', '#9fe0b8'); sparks(t.x, t.y, 8, '#9fe0b8', .3);
      blog(`${u.name} puts two fingers on ${t === u ? 'his own' : `${t.name}'s`} wound and says something to Hood in Ehrlii. ${t === u ? 'He' : t.name} is not going anywhere until he says so.`); }},
});

/* ---- Bridgeburner: wounds carry from fight to fight until the squad rests (a new chapter, or a rest the story gives) ---- */
function carryWounds(){
  if (!DIFF().carry || !B) return;
  const ohl = B.units.find(u => u.id === 'ohl' && u.side === 'p' && !u.ally && u.hp > 0), k = ohl ? .2 : .1; S.wounds = {};
  B.units.filter(u => u.side === 'p' && !u.ally && SQUAD().includes(u.id)).forEach(u => { const base = u.hp > 0 ? u.hp : Math.round(u.maxhp * .25); S.wounds[u.id] = Math.min(u.maxhp, base + Math.round(u.maxhp * k)); S.wounds[u.id + '_max'] = u.maxhp; });
  const hurtN = SQUAD().filter(id => S.wounds[id] < S.wounds[id + '_max']).length;
  if (hurtN) note(`Bridgeburner: ${ohl ? 'Ohl patches what he can' : 'the squad binds its own cuts'}; the rest they carry into the next fight until they rest.`, 'bad');
}
function rest(t){ if (S && S.wounds) { S.wounds = null; note(t || 'The Fourth rests. Wounds close, mostly.', 'good'); } }
const woundOf = id => S && S.wounds && S.wounds[id] != null ? S.wounds[id] : null;
/* a salve out of the fight, from the pack: only matters when wounds carry */
function salveOut(id){ if (!S.wounds || !(S.inv.salve > 0) || S.wounds[id] == null) return; S.inv.salve--; tally('thrown_salve');
  S.wounds[id] = Math.min(S.wounds[id + '_max'] || 999, S.wounds[id] + 8); AUDIO.play('heal'); save(); }

/* ---- a jar of salve among what the dead leave, once a chapter from Chapter Two ---- */
function lootSalve(){ const n = S.chapter || 0; if (n < 2 || S.f['salveLoot' + n]) return; S.f['salveLoot' + n] = 1; S.inv.salve = (S.inv.salve || 0) + 1; note('Among what they left behind: a jar of salve. +1 salve.', 'good'); }

/* ---- when the whole squad goes down: a god answers for the most loyal of them, once a chapter each (on Story, always) ---- */
const PATRONS = {
  brisk:{god:'Hood', title:'Hood, Lord of Death', txt:id => `Somewhere there is a gate the size of the world, and a grey hand resting on it.\n\nBrisk, on her back in the dirt, lifts two fingers to her brow the way she always has, to no one in particular. She has never prayed. She has always saluted. The gate does not close. It only does not open any wider.\n\n*Not her. Not yet. Not the ones she is lying across.*`},
  kettle:{god:'Oponn', title:'Oponn, the Twins', txt:id => `A coin rolls out of Kettle's satchel. Nobody put a coin in Kettle's satchel. It spins on its edge in the dirt for much longer than a coin should, and everyone who is still awake watches it, and it falls the right way.\n\nThe Lady pulls. Somewhere, back to back with her, her brother is already counting what it will cost.`},
  tuft:{god:'Shadowthrone', title:'Shadowthrone, King of High House Shadow', txt:id => `The dark at the edge of the field takes the shape of a Hound and lies down across Tuft's legs, heavy and warm as a dog by a fire. The cards in her sleeve go cold all at once.\n\nHigh House Shadow does not do favours. It keeps accounts. Tuft, when she can talk again, says it was polite.`},
  ohl:{god:'Soliel', title:'Soliel, Mistress of Healing', txt:id => `Ohl, face down, says something in Ehrlii, and for once it is not an argument with Hood. It is a prayer, and it is to a woman.\n\nThe air smells of temple oil from a city two thousand leagues away, and the bleeding stops. Soliel, Mistress of Healing, does not often answer soldiers. Ohl has been asking for twenty-two years.`},
  ellis:{god:'Cotillion', title:'Cotillion, the Rope', txt:id => `Ellis's gloved hand closes on a cord that is not there, and it holds her weight. And the next one's. And the next.\n\nThe Patron of Assassins has a fondness for people who know how to fall, and Ellis has been falling the right way since a dock in Genabaris.`},
  sgt:{god:'Fener', title:'Fener, the Boar of Summer', txt:id => `Something huge and hot goes past in the dark, smelling of summer and blood, and the ground shakes the way it shakes under a charge.\n\nFener, the Boar of Summer, is the god soldiers swear by when they are too tired to swear by anything else. He likes a fight that is not finished. This one is not finished.`},
};
/* who answers next: the squad's own gods, most loyal first (only for those whose loyalty is above nothing), then the soldiers' god */
function patronNext(){
  const ch = S.chapter || 0; if (!S.gods || S.gods.ch !== ch) S.gods = {ch, used:[]};
  const mates = SQUAD().filter(id => id !== 'sgt' && PATRONS[id] && (S.loy[id] || 0) > 0).sort((a, b) => (S.loy[b] || 0) - (S.loy[a] || 0) || SQUAD().indexOf(a) - SQUAD().indexOf(b));
  const order = [...mates, 'sgt'];
  if (DIFF() === DIFFS.story) { const free = order.filter(id => !S.gods.used.includes(id)); if (!free.length) S.gods.used = []; return free[0] || order[0]; }
  return order.find(id => !S.gods.used.includes(id)) || null;
}
/* no god left this chapter: back to the chapter's start, on the same save */
function chapterAgain(){
  const n = S.chapter || 0, keep = {stats:S.stats, sid:S.sid, name:S.name, diff:S.diff, chsnap:S.chsnap, deeds:S.deeds};
  let s;
  if (n === 0) s = newState(S.name);
  else if (S.chsnap && S.chsnap[n]) s = JSON.parse(JSON.stringify(S.chsnap[n]));
  else s = rebuildAt(S, n);
  Object.assign(s, keep); s.gods = {ch:n, used:[]}; S = migrate(s); S.scene = 'chintro'; save(); B = null; $('#sheet').hidden = true;
  if (n === 0) showIntro(); else startChapter(n);
}

/* ============ v3.13 tactics: through the squad, Steady, Post up, hold-out takedowns ============ */
/* the squad passes through its own people (and allies) on the move; enemies block */
const passFriend = (x, y, u) => !wall(x, y) && !B.units.some(v => v !== u && v.hp > 0 && v.x === x && v.y === y && v.side !== u.side);
/* a ranged squadmate who has not fired yet this fight is posted up: the first enemy to step into their reach eats a free shot */
const postedUp = u => !!(B && u && u.side === 'p' && !u.ally && u.hp > 0 && u.rng > 1 && !u.fired && !u.stun);
async function postUp(e, was){
  if (!B || B.over || e.hp <= 0) return false;
  const shooters = party().filter(p => postedUp(p) && cheb(p, e) <= p.rng && cheb(p, was) > p.rng && canShoot(p, e));
  if (!shooters.length) return false;
  const p = shooters.sort((a, b) => cheb(a, e) - cheb(b, e))[0];
  p.facing = e.x >= p.x ? 1 : -1; blog(`<em>${p.name} was posted up for exactly this.</em>`); float(p, 'posted up', '#e8c073');
  attack(p, e, {verb:'was waiting for'}); updBattleUI(); await wait(420); return true;
}
/* hold-out fights: every enemy the Fourth puts down, even one that gets up again or goes home */
function holdDown(u, knelt){ if (!B || !B.def || !B.def.objective || u.side !== 'e') return; B.holdDowns ??= []; B.holdDowns.push({name:u.name, kind:u.kind, knelt:!!knelt});
  blog(knelt ? `<em>${u.name} goes down on one knee.</em> It will get up. It went down.` : `<em>${u.name} goes down.</em>`); }
function holdBonus(){
  const d = B && B.holdDowns; if (!d || !d.length) return;
  const n = Math.min(3, d.length), xp = Math.round((B.def.xp || 0) * .4 * n * XPK); gainXP(xp);
  S.f.holdDowns ??= {}; S.f.holdDowns[B.id] = d.length; S.f.lastHold = {id:B.id, n:d.length, names:d.map(x => x.name), knelt:d.some(x => x.knelt)};
  const names = [...new Set(d.map(x => x.name))], list = names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0];
  note(`They were only meant to hold. They put ${d.length > 1 ? `${d.length} down` : 'one down'} as well: ${list}${d.some(x => x.knelt) ? ', on its knees for a moment' : ''}. +${xp} experience.`, 'good');
  tally('holdDowns', d.length);
}
/* the story can say it: did the Fourth put anything down in this hold-out fight? */
const heldDowns = id => (S && S.f && S.f.holdDowns && S.f.holdDowns[id]) || 0;

/* ============ v3.13 gear: the best hands for each piece ============ */
const avgDmg = d => d ? d[0] * (d[1] + 1) / 2 + (d[2] || 0) : 0;
/* how much a piece of gear is worth on this squadmate: armour for the front, range for the ranged, a stat trinket on whoever rolls that stat */
function gearValue(id, g){
  const it = ITEMS[g], t = TPL[id]; if (!it || !t || (it.who && !it.who.includes(id))) return -1;
  const ranged = t.rng > 1, front = id === 'brisk' || id === 'sgt';
  let v = (it.ac || 0) * (front ? 3 : 2) + (it.atk || 0) * 2.5 + (it.hp || 0) * (front ? .6 : .45) + (it.mv || 0) * (ranged ? 1.2 : 2) + (it.rng || 0) * (ranged ? 2.5 : .3);
  if (it.dmg) v += (avgDmg(it.dmg) - avgDmg(t.dmg)) * 1.5;
  if (it.stat) Object.entries(it.stat).forEach(([k, n]) => { const mine = t.st[k], best = Math.max(...SQUAD().map(o => TPL[o] ? TPL[o].st[k] : 0)); v += n * (mine >= best ? 2.5 : mine >= best - 1 ? 1 : .3); });
  return v + .01; // anything wearable beats nothing
}
/* a new piece goes to whoever it suits best among those with that slot empty */
function placeGear(g){
  const it = ITEMS[g]; if (!it) return null;
  const who = (it.who || SQUAD()).filter(w => SQUAD().includes(w) && S.gear[w] && !S.gear[w][it.slot]).sort((a, b) => gearValue(b, g) - gearValue(a, g))[0];
  if (who && gearValue(who, g) > 0) { S.gear[who][it.slot] = g; return who; } return null;
}
/* Allocate: everything in the kit, re-dealt for the most good (biggest gains first) */
function allocateGear(){
  const kit = [...new Set(S.kit)].filter(g => ITEMS[g]), sq = SQUAD();
  const before = JSON.stringify(S.gear); sq.forEach(w => { S.gear[w] = {}; });
  const pairs = []; kit.forEach(g => sq.forEach(w => { const v = gearValue(w, g); if (v > 0) pairs.push({w, g, v}); }));
  pairs.sort((a, b) => b.v - a.v); const used = new Set();
  pairs.forEach(({w, g}) => { const sl = ITEMS[g].slot; if (used.has(g) || S.gear[w][sl]) return; S.gear[w][sl] = g; used.add(g); });
  save(); return before !== JSON.stringify(S.gear);
}
/* the sheet's numbers: what the gear adds, so it can show the base, the bonus and the total */
function gearBonus(id){ const b = {ac:0, atk:0, hp:0, mv:0, rng:0, might:0, wits:0, guile:0, dmg:null};
  Object.values((S.gear && S.gear[id]) || {}).forEach(g => { const it = ITEMS[g]; if (!it) return; ['ac','atk','hp','mv','rng'].forEach(k => b[k] += it[k] || 0); if (it.stat) Object.entries(it.stat).forEach(([k, n]) => b[k] += n); if (it.dmg) b.dmg = it.dmg; });
  return b; }

/* ============ v3.13 sharper openings: what Kettle's opening sharper changed (a battle's preFx(B) and preText) ============ */
const preUsed = id => !!(S && S.f && S.f.pre && S.f.pre[id]);
/* helpers for a preFx: more of them come at the noise; a tile changes (a wall comes down, a doorway is blocked); fire; smoke */
function preWave(round, foes, text){ B.xwaves ??= []; B.xwaves.push({round, foes, text}); }
function preTile(x, y, ch){ if (!inB(x, y) || unitAt(x, y)) return; const m = B.def.map.slice(); m[y] = m[y].slice(0, x) + ch + m[y].slice(x + 1); B.def = Object.assign({}, B.def, {map:m}); }
function preFire(x, y, rounds = 2, txt){ if (!wall(x, y)) B.fires.push({x, y, until:(B.round || 0) + rounds, txt}); }
function preSmoke(x, y, rounds = 2){ if (!wall(x, y)) B.smoke.push({x, y, until:(B.round || 0) + rounds}); }
function preFoe(kind, x, y){ const at = freeNear(x, y); if (!at || !FOES[kind]) return null; const u = mkFoe(kind, at.x, at.y); u.ini = d20() + (u.init || 0); u.arrived = performance.now(); B.units.push(u); B.initOrder.push(u); return u; }
