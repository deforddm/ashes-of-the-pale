// Book Two's Deck of Dragons (47c, 57b; reader in 47, hooks in 20, 21, 36b): in every Book Two chapter (1-7) the reading is offered
// at the chapter's first halt and works with each reader (Marrow; Yedda when Marrow is away and Yedda came out of Hissar; the old
// Kanese otherwise): the offer and the card screen name the right reader and never Tuft, the card comes from that chapter's pool, the
// flags are set, the card node shows the card and goes back where the halt was going; "✦ Look into the card" comes back to b2_cN_card;
// each Book Two card's effect is applied in a Book Two fight (the four new ones and Book One's six reused); the new cards draw;
// the pack shows the card; and Book One's reading is still Tuft's, word for word.
// Usage: node tools/b2deck_test.mjs   (exit 1 on a failure or a page error)
import { server, browser as launch, openGame } from './page.mjs';
const srv = await server(); const br = await launch();
const { page, errors } = await openGame(br, srv.url, { fast: true });
let fail = 0; const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail = 1; };
const ev = (f, a) => page.evaluate(f, a);
const BAD = /\bundefined\b|\bNaN\b|\$\{|\bTuft\b/;
const START = { 1: 'b2_march', 2: 'b2_c2_start', 3: 'b2_c3_start', 4: 'b2_c4_start', 5: 'b2_c5_start', 6: 'b2_c6_start', 7: 'b2_c7_start' };
const READERS = { marrow: 'Marrow', yedda: 'Yedda', kanese: 'The old Kanese' };

// a Book Two sergeant at chapter n with the given reader; on the chapter's map, at its first halt
const setup = (n, who) => ev(([n, who]) => {
  document.querySelectorAll('#modal,#chars,#settings').forEach(e => e.hidden = true); $('#cardfx').hidden = true; VIS = null; document.body.classList.remove('vision');
  setBook('dg'); S = newStateDG('Hask'); S.chapter = n; S.lvl = Math.min(7, n + 1); S.xp = LEVELS[S.lvl - 1]; S.chain = {water:6, column:20};
  Object.assign(S.f, {b2_key:'daughters', b2_bult:1, b2_coltaine:1, b2_c4_key:'keep'});
  if (who !== 'marrow') { S.squad = S.squad.filter(k => k !== 'marrow'); if (who === 'yedda') S.f.b2_yedda = 1; }
  migrate(S); S.picksDue = []; save(); startExplore(CHAPTERS[n].area.id); return visReader().id;
}, [n, who]);
const sheet = () => ev(() => ({ node: S.node, view, text: ($('#sheet').hidden ? '' : $('#sheet').innerText), btns: [...document.querySelectorAll('#sheet .choice')].map(b => b.textContent.trim()), card: !!document.querySelector('#sheet #icard') }));
const choose = re => ev(src => { const re = new RegExp(src); const b = [...document.querySelectorAll('#sheet .choice')].find(b => re.test(b.textContent)); if (!b) return false; b.click(); return true; }, re.source);
const wait = ms => page.waitForTimeout(ms);

for (let n = 1; n <= 7; n++) {
  for (const who of ['marrow', 'yedda', 'kanese']) {
    const tag = `Ch${n} ${who}`, probs = [];
    const rid = await setup(n, who);
    ok(rid === who, `${tag}: the reader is ${READERS[who]} (${rid})`);
    await ev(n => talk(n), START[n]); await wait(80);
    let s = await sheet();
    const offerLabel = s.btns.find(t => /and the Deck\.$/.test(t));
    ok(!!offerLabel && offerLabel.includes(who === 'kanese' ? 'the old Kanese' : READERS[who]), `${tag}: the halt (${START[n]}) offers "${offerLabel}"`);
    if (!offerLabel) continue;
    await choose(/and the Deck\.$/); await wait(60); s = await sheet();
    ok(s.node === `b2_c${n}_deck` && s.text.includes(READERS[who] === 'The old Kanese' ? 'old Kanese' : READERS[who]), `${tag}: the offer (${s.node}) is in ${READERS[who]}'s voice`);
    if (BAD.test(s.text)) probs.push('offer: ' + s.text.match(new RegExp('.{0,30}(' + BAD.source + ').{0,30}'))[0]);
    ok(s.btns.some(t => t === (who === 'kanese' ? 'Let him draw.' : 'Let her draw.')) && s.btns.some(t => /Not now\./.test(t)), `${tag}: draw or not (${s.btns.join(' | ')})`);
    await choose(/draw\.$/); await wait(150);
    const fx = await ev(n => ({ shown: !$('#cardfx').hidden, card: S.card, pool: B2POOL[n], drawn: S.f[`b2_c${n}_drawn`], reader: S.f[`b2_c${n}_reader`], ct: ($('#cfText .ct') || {}).textContent || '', cn: ($('#cfText .cn') || {}).textContent || '', vis: !!$('#cfVis') }), n);
    ok(fx.shown && fx.pool.includes(fx.card) && fx.drawn === 1 && fx.reader === who, `${tag}: the card screen deals ${fx.card} from the chapter's pool; drawn and reader flags set`);
    if (BAD.test(fx.ct + fx.cn)) probs.push('card screen: ' + fx.ct.slice(0, 80));
    await ev(() => $('#cfGo').click()); await wait(100); s = await sheet();
    ok(s.node === `b2_c${n}_card` && s.card && s.text.includes(await ev(() => CARDS[S.card].name)), `${tag}: back from the card screen at ${s.node}, with the card inline`);
    ok(s.text.includes(`${READERS[who]} lays the reading out`), `${tag}: ${READERS[who]} lays the reading out`);
    if (BAD.test(s.text)) probs.push('card node: ' + s.text.match(new RegExp('.{0,30}(' + BAD.source + ').{0,30}'))[0]);
    const back = s.btns[0];
    await ev(() => document.querySelector('#sheet .choice').click()); await wait(100); s = await sheet();
    const expect = typeof (await ev(n => typeof B2DECK[n].back, n)) === 'string' && (await ev(n => typeof B2DECK[n].back === 'string' ? B2DECK[n].back : null, n));
    ok(expect ? s.node === expect && !s.btns.some(t => /and the Deck\.$/.test(t)) : s.view === 'explore', `${tag}: "${back}" goes on where the halt was going (${expect || 'the map'}), and the offer is gone`);
    ok(!probs.length, `${tag}: text clean ${probs.join(' | ')}`);
  }
  // "Not now": the offer goes away and the chapter goes on
  await setup(n, 'marrow'); await ev(n => talk(n), START[n]); await wait(60); await choose(/and the Deck\.$/); await wait(40); await choose(/Not now\./); await wait(80);
  const no = await ev(n => ({ no: S.f[`b2_c${n}_noCard`], card: S.card }), n);
  ok(no.no === 1 && !no.card, `Ch${n}: "Not now" sets b2_c${n}_noCard and draws nothing`);
}

// ---- "✦ Look into the card" comes back to the chapter's card node (a stand-in vision if the chapter has none yet) ----
for (let n = 1; n <= 7; n++) {
  await setup(n, n % 2 ? 'marrow' : 'kanese');
  const r = await ev(async n => {
    const w = ms => new Promise(r => setTimeout(r, ms)); let dummy = false;
    S.card = B2POOL[n][0]; if (!visionFor(n, S.card)) { dummy = true; VISIONS.b2t_stand = {book:'dg', ch:n, who:'Somebody', where:'Somewhere', fig:'', bg:'deck', cap:'A stand-in.', steps:[{txt:'One.'}, {sp:visReader().name, txt:'Two.'}]}; }
    const want = visionFor(n, S.card), node = cardNodeName();
    cardSequence(() => talk(`b2_c${n}_card`)); await w(200);
    const b = $('#cfVis'); if (!b) return {err:'no Look into the card button', dummy};
    b.click(); await w(150); const id = VIS && VIS.id, during = S.node;
    for (let i = 0; i < 60 && VIS; i++) { const c = $('#sheet #ch0'); if (!c) break; c.click(); await w(30); }
    await w(100); const out = {dummy, want, id, node, during, after:S.node, open:!!VIS, card:!!document.querySelector('#sheet #icard'), tv:(S.tuftVisions || []).includes(id)};
    delete VISIONS.b2t_stand; return out; }, n);
  ok(!r.err && r.id === r.want && r.node === `b2_c${n}_card` && r.during === `b2_c${n}_card` && r.after === `b2_c${n}_card` && !r.open && r.card && r.tv,
    `Ch${n}: a vision${r.dummy ? ' (stand-in)' : ' ' + r.id} from the card screen saves as, and comes back to, ${r.after} ${r.err || ''}`);
}
ok(await ev(() => { setBook('dg'); S = newStateDG('Hask'); S.chapter = 5; const a = cardNodeName(); setBook('gotm'); S = newState('Hask'); S.chapter = 5; return a === 'b2_c5_card' && cardNodeName() === 'c5_card'; }), 'cardNodeName: b2_c5_card in Book Two, c5_card in Book One');

// ---- the effects, in Book Two fights ----
const eff = await ev(() => {
  const out = {}, rnd = Math.random; Math.random = () => .5;
  const go = card => { document.querySelectorAll('#modal').forEach(e => e.hidden = true); setBook('dg'); S = newStateDG('Hask'); S.chapter = 2; S.lvl = 3; S.xp = LEVELS[2]; migrate(S); S.picksDue = []; S.card = card; save(); startBattle('b2_spring', {}); B.busy = true;
    const me = B.units.find(u => u.id === 'haddat'), f = foes()[0]; return {me, f}; };
  try {
    // King of High House Death: +2 on an enemy at half health or less, not above it
    let {me, f} = go(null); f.ac = 1; f.hp = Math.floor(f.maxhp / 2); const k0 = attack(me, f, {}).dmg; B = null;
    ({me, f} = go('b2c_king')); f.ac = 1; f.hp = Math.floor(f.maxhp / 2); const k1 = attack(me, f, {}).dmg; f.hp = f.maxhp; const k2 = attack(me, f, {}).dmg; out.king = [k0, k1, k2]; out.kingLog = B.log.some(l => /King of High House Death/.test(l)); B = null;
    // Queen of High House Life: a healing heals 2 more
    ({me} = go(null)); me.hp = 2; heal(me, 3); const q0 = me.hp; B = null; ({me} = go('b2c_queen')); me.hp = 2; heal(me, 3); out.queen = [q0, me.hp]; B = null;
    // Mason of High House Death: the squad's blast hits each enemy for 2 more; the squad's own people the same as ever
    const mason = card => { const {me, f} = go(card); B.cur = me; f.hp = f.maxhp = 40; const mate = B.units.find(u => u.id === 'sgt'); mate.hp = mate.maxhp = 40; mate.x = f.x; mate.y = f.y + 1 < 10 ? f.y + 1 : f.y - 1;
      B.units.filter(u => u !== f && u !== mate).forEach(u => { u.x = 7 - (u.side === 'e' ? 0 : 7); }); const h0 = f.hp, m0 = mate.hp; blast({x:f.x, y:f.y}, [[1,1,0],[1,1,0]], '#fff'); const r = [h0 - f.hp, m0 - mate.hp]; B = null; return r; };
    out.mason = [mason(null), mason('b2c_mason')];
    // Soldier of High House Death: +1 armour for every squadmate (not allies)
    ({me, f} = go(null)); const s0 = atkCalc(f, me).ac; B = null; ({me, f} = go('b2c_soldier')); out.soldier = [s0, atkCalc(f, me).ac]; B = null;
    // Book One's cards, in a Book Two fight
    ({me, f} = go(null)); const base = {hp:me.maxhp, mv:me.mv, bonus:atkCalc(me, f).bonus, foe:atkCalc(f, me).bonus, crit:atkCalc(me, f).critOn}; B = null;
    ({me, f} = go('obelisk')); out.obelisk = me.maxhp - base.hp; B = null;
    ({me, f} = go('hounds')); out.hounds = me.mv - base.mv; B = null;
    ({me, f} = go('oponn')); out.oponn = atkCalc(me, f).bonus - base.bonus; B = null;
    ({me, f} = go('knight')); out.knight = atkCalc(f, me).bonus - base.foe; B = null;
    ({me, f} = go('assassin')); out.assassin = [base.crit, atkCalc(me, f).critOn]; B = null;
    ({me, f} = go('herald')); hurt(me, 999); const h1 = me.hp; me.hp = 5; hurt(me, 999); out.herald = [h1, me.hp]; B = null;
  } finally { Math.random = rnd; }
  return out; });
ok(eff.king[1] === eff.king[0] + 2 && eff.king[2] === eff.king[0] && eff.kingLog, `King of High House Death: ${eff.king[0]} → ${eff.king[1]} on a half-dead enemy, ${eff.king[2]} on a whole one; its word in the fight log`);
ok(eff.queen[1] === eff.queen[0] + 2, `Queen of High House Life: a 3-point healing brings 2 to ${eff.queen[0]} without, ${eff.queen[1]} with`);
ok(eff.mason[1][0] === eff.mason[0][0] + 2 && eff.mason[1][1] === eff.mason[0][1], `Mason of High House Death: the enemy in the blast takes ${eff.mason[0][0]} → ${eff.mason[1][0]}; the squadmate ${eff.mason[0][1]} → ${eff.mason[1][1]}`);
ok(eff.soldier[1] === eff.soldier[0] + 1, `Soldier of High House Death: squad armour ${eff.soldier[0]} → ${eff.soldier[1]}`);
ok(eff.obelisk === 4 && eff.hounds === 1 && eff.oponn === 1 && eff.knight === -1, `Book One's cards in a Book Two fight: Obelisk +${eff.obelisk} health, Hounds +${eff.hounds} move, Oponn +${eff.oponn} to hit, Knight ${eff.knight} to enemies`);
ok(eff.assassin[0] === 20 && eff.assassin[1] === 19 && eff.herald[0] === 1 && eff.herald[1] === 0, `Assassin crits on ${eff.assassin[1]}; the Herald holds one squadmate at 1, once a fight (${eff.herald})`);

// ---- the pools: canon only, and every card exists with an effect; the new cards draw ----
const pools = await ev(() => { const all = [...new Set(Object.values(B2POOL).flat())];
  return {all, missing:all.filter(k => !CARDS[k] || !CARDS[k].fx || !B2SAY[k]), banned:all.filter(k => ['chains', 'raven', 'magi', 'blank'].includes(k)), lean:Object.entries(B2POOL).map(([n, p]) => p[0] === p[1] && p[1] === p[2])}; });
ok(!pools.missing.length && !pools.banned.length && pools.lean.every(Boolean), `pools: ${pools.all.join(', ')}; each with an effect and Book Two words; no Wain, Raven or Magi; every chapter leans to one card`);
for (const art of [true, false]) {
  const drawn = await ev(art => { SET.art = art; const res = {}; Object.keys(B2CARDS).forEach(id => { const cv = document.createElement('canvas'); cv.width = 240; cv.height = 360; const c = cv.getContext('2d'); drawCard(c, id, 240, 360, true, 1234);
    const d = c.getImageData(30, 30, 180, 230).data, seen = new Set(); for (let i = 0; i < d.length; i += 16) seen.add((d[i] >> 3) + ',' + (d[i + 1] >> 3) + ',' + (d[i + 2] >> 3)); res[id] = seen.size; }); SET.art = true; return res; }, art);
  ok(Object.values(drawn).every(v => v > 40), `the new cards are painted on canvas (${art ? 'painted-art setting, no painted face: falls back' : 'classic setting'}): ${JSON.stringify(drawn)}`);
}

// ---- the pack shows the chapter's card in Book Two ----
await setup(3, 'marrow');
const pack = await ev(() => { S.card = 'b2c_mason'; openModal('pack'); const t = $('#modal').innerText; $('#modal').hidden = true; return /Deck reading/.test(t) && t.includes('Mason of High House Death') && t.includes(CARDS.b2c_mason.fx); });
ok(pack, 'the pack shows Book Two\'s card, name and effect');

// ---- Book One: Tuft's reading, as it was ----
const one = await ev(async () => {
  const w = ms => new Promise(r => setTimeout(r, ms));
  document.querySelectorAll('#modal').forEach(e => e.hidden = true); setBook('gotm'); S = newState('Hask'); S.chapter = 1; migrate(S); S.picksDue = []; save(); startExplore(CHAPTERS[1].area.id);
  talk('c1_deck'); await w(60); const b = [...document.querySelectorAll('#sheet .choice')].find(b => b.textContent === 'Let her draw.'); if (!b) return {err:'no Let her draw.'};
  b.click(); await w(150); const ct = ($('#cfText .ct') || {}).textContent || '', want = smartq(CARDS[S.card].txt);
  $('#cfGo').click(); await w(100);
  return {reader:visReader().name, node:S.node, ct, want, lays:$('#sheet').innerText.includes('Tuft lays the reading out on Whiskeyjack'), pool:['hounds', 'oponn', 'knight', 'assassin'].includes(S.card), book:CARDBOOK && S.book !== 'gotm'}; });
ok(!one.err && one.reader === 'Tuft' && one.node === 'c1_card' && one.ct === one.want && one.lays && one.pool && !one.book, `Book One: Tuft draws from Chapter 1's own pool, the card's own words (${(one.ct || '').slice(0, 40)}…), back to c1_card`);

ok(!errors.length, `no page errors ${errors.slice(0, 3).join(' | ')}`);
await br.close(); srv.kill();
process.exit(fail);
