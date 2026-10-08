/* ============ tricks in a fight (the data and the earning are in 16b) ============
   Each is an ability on whoever carries it. 'free' ones don't use the bearer's action. Charged ones spend a charge (useAb); the
   once-a-fight ones mark B.used[key]. */
/* The Line covers its bearer and every squadmate next to them until the bearer's next turn */
const lineCovers = t => !!(B && B.line && B.line.u.hp > 0 && t && t.side === 'p' && !t.ally && t.hp > 0 && (t === B.line.u || cheb(t, B.line.u) === 1));
/* Andii dark: smoke-like tiles (nobody shoots in or out) that also blind the enemy standing in them */
const inDark = (x, y) => !!(B && B.smoke && B.smoke.some(s => s.dark && s.x === x && s.y === y && s.until >= B.round));
/* a trick ability is there for its bearer only, with a charge left or not yet used this fight */
function trickOk(u, a){ if (trickBy(a.trick) !== u.id) return false; return TRICKS[a.trick].use === 'chapter' ? trickLeft(a.trick) > 0 : !B.used[TRICKS[a.trick].ab]; }
Object.assign(AB, {
  t_line:{name:TRICKS.line.name, trick:'line', self:true, desc:()=>TRICKS.line.fx,
    run(u){ B.line = {u, turn:B.turn}; AUDIO.play('sword'); shakeMap();
      const in_ = party().filter(p => lineCovers(p)); in_.forEach(p => { float(p, 'the line', '#e8c073'); sparks(p.x, p.y, 8, '#e8c073', .4); });
      blog(`${u.name}: "Shields!" ${in_.length > 1 ? `${in_.filter(p => p !== u).map(p => p.name).join(' and ')} lock${in_.length > 2 ? '' : 's'} in beside them. Rim to rim.` : 'One shield. It will have to do.'}`); }},
  t_song:{name:TRICKS.song.name, trick:'song', self:true, desc:()=>TRICKS.song.fx,
    run(u){ AUDIO.play('heal'); const near = party().filter(p => !p.ally && cheb(p, u) <= 4);
      near.forEach(p => { heal(p, roll(1,6,2)); if (p.stun) { p.stun = false; float(p, 'awake', '#9fe0b8'); } B.fires = B.fires.filter(f => !(f.x === p.x && f.y === p.y)); sparks(p.x, p.y, 10, '#c8e0a0', .35); });
      blog(`${u.name} sings the Rhivi words for the dead, low, the way Sethand's people sing them. The grass in them carries ${near.length > 1 ? 'the squad' : u.name} a little way.`); }},
  t_pull:{name:TRICKS.pull.name, trick:'pull', self:true, free:true, desc:()=>'Spin the coin: this turn\'s attack rolls twice and keeps the better. The Lord pushes back: the squad\'s next check is −2. Does not use the action.',
    ok:u=>!B.acted && u.luckyTurn !== B.turn,
    run(u){ u.luckyTurn = B.turn; S.push = 1; AUDIO.play('coin'); float(u, 'the Lady pulls', '#e8c073'); sparks(u.x, u.y, 10, '#e8c073', .4); blog(`${u.name} spins a coin on a thumbnail and does not look at how it lands.`); }},
  t_bluefire:{name:TRICKS.bluefire.name, trick:'bluefire', boom:true, aoe:1, range:4, desc:()=>TRICKS.bluefire.fx,
    run(u,x,y){ const pt = scatter(u,x,y,1,1); throwArc(u, pt, () => {
      const caught = B.units.filter(v => v.hp > 0 && cheb(v, pt) <= 1); caught.forEach(v => { v.dazzleUntil = B.round + 1; });
      blast(pt, [[2,6,0],[2,6,0]], '#6fb7ff'); AUDIO.play('burner', 1.1); sparks(pt.x, pt.y, 34, '#6fb7ff', .9); sparks(pt.x, pt.y, 14, '#e8f4ff', 1.3); });
      blog(`${u.name} lobs a bladder of lamp-gas. It goes up blue, the colour of every street in Darujhistan, all at once.`); }},
  t_cant:{name:TRICKS.cant.name, trick:'cant', free:true, desc:()=>TRICKS.cant.fx,
    tiles:u=>foes().filter(f => cheb(u,f) <= 6 && f.cantRound !== B.round),
    run(u,x,y){ const t = unitAt(x,y); if (!t) return; t.cantRound = B.round; AUDIO.play('click'); float(t, 'this one', '#f2c46b'); blog(`${u.name}'s fingers say it: a flick, a curl, a cut across the palm. <em>This one. Now.</em>`); }},
  t_rope:{name:TRICKS.rope.name, trick:'rope', free:true, desc:()=>TRICKS.rope.fx,
    tiles:u=>party().filter(p => p !== u && !p.ally && cheb(u,p) <= 5),
    run(u,x,y){ const t = unitAt(x,y); if (!t) return; const ux = u.x, uy = u.y; sparks(ux, uy, 10, '#9a86e0', .4); sparks(t.x, t.y, 10, '#9a86e0', .4);
      u.x = t.x; u.y = t.y; t.x = ux; t.y = uy; AUDIO.play('shadow'); B.moved = true; blog(`${u.name} and ${t.name} are each where the other was. Nobody saw the rope.`); }},
  t_otataral:{name:TRICKS.otataral.name, trick:'otataral', desc:()=>TRICKS.otataral.fx,
    tiles:u=>foes().filter(f => cheb(u,f) <= 3 && !f.otat),
    run(u,x,y){ const t = unitAt(x,y); if (!t) return; t.otat = true; AUDIO.play('burner', .4); sparks(t.x, t.y, 18, '#c8644a', .5); float(t, 'otataral', '#e0846a');
      const lost = []; if (t.ai === 'raest') lost.push('its ice'); if (t.kind === 'stone') lost.push('its slam'); if ((t.attacks || 1) > 1) { t.attacks = 1; lost.push('its second blow'); }
      if (t.rng > 1 && (t.magic || /shadow|sorcer|bolt|lance|warren|spell/i.test(t.verb || ''))) { t.rng = 1; lost.push('its sorcery'); }
      blog(`${u.name} throws a pinch of red dust at ${t.name}. ${lost.length ? `It loses ${lost.join(', ')} for the rest of the fight.` : 'Nothing about it was magic. It sneezes.'}`); }},
  t_dark:{name:TRICKS.dark.name, trick:'dark', sorcery:true, elder:true, aoe:1, range:5, smoke:true, darkness:true, desc:()=>TRICKS.dark.fx,
    run(u,x,y){ const pt = {x, y}; AUDIO.play('shadow'); sparks(x, y, 22, '#3a3070', .5);
      for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) if (!wall(x+dx, y+dy)) B.smoke.push({x:x+dx, y:y+dy, until:B.round+2, dark:true});
      blog(`${u.name} says nothing and inclines their head. Kurald Galain comes down over the ${placeWord(B.def)} like a cloak over a lamp.`);
      updBattleUI(); afterAct(); }},
  t_rime:{name:TRICKS.rime.name, trick:'rime', sorcery:true, elder:true, desc:()=>TRICKS.rime.fx,
    tiles:u=>foes().filter(f => cheb(u,f) <= 4),
    run(u,x,y){ const t = unitAt(x,y); if (!t) return; t.rimeUntil = B.round + 1; AUDIO.play('slam'); sparks(t.x, t.y, 24, '#bfe8ff', .7);
      if (t.boss && d20() >= 12) { blog(`Rime goes over ${t.name} in a ring and cracks. It keeps moving, but it is brittle now.`); float(t, 'brittle', '#bfe8ff'); }
      else { t.stun = true; blog(`Rime goes over ${t.name} in a ring, and it stops, white to the eyes.`); float(t, 'rimed', '#bfe8ff'); } }},
});
