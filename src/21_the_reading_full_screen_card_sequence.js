/* ============ the reading: full-screen card sequence ============ */
let cardAnim = null;
/* opt.card: show that card and leave S.card alone. opt.self: Tuft draws for herself; the flanking cards never turn. */
function cardSequence(done, opt = {}){
  const el = $('#cardfx'); el.hidden = false;
  if (!opt.card && !S.card) S.card = ['oponn','obelisk','knight','assassin'][R(4)];
  const cid = opt.card || S.card, self = !!opt.self;
  const picks = ['crown','sceptre','orb'].filter(k => k !== cid).sort(() => Math.random() - .5);
  const c = CARDS[cid] || {name:'?', fx:'', txt:'', hue:'#888'};
  el.innerHTML = `<canvas id="ccv"></canvas><div class="cf" id="cfText"><div class="cn">${esc(c.name)}</div><div class="cfx">${esc(c.fx || '')}</div><div class="ct">${smartq(esc(c.txt || '').replace(/&quot;/g,'"'))}</div><button class="btn primary" id="cfGo">${self ? 'Put the card away' : S.chapter ? "Put the cards away" : "Descend"}</button></div>`;
  const cv = $('#ccv'), ctx = cv.getContext('2d'); const dpr = Math.min(2, window.devicePixelRatio || 1);
  const fit = () => { cv.width = el.clientWidth * dpr; cv.height = el.clientHeight * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }; fit();
  const t0 = performance.now(); let finished = false, cues = {};
  const cue = (k, f) => { if (!cues[k]) { cues[k] = 1; f(); } };
  AUDIO.play('shuffle');
  const end = () => { if (finished) return; finished = true; cardAnim = null; window.removeEventListener('resize', fit); el.hidden = true; el.innerHTML = ''; done(); };
  $('#cfGo').onclick = end;
  let skipTo = null; el.onclick = e => { if (e.target.id === 'cfGo') return; if (performance.now() - t0 < 6200) skipTo = 6200; };
  const TL = REDUCE() ? .35 : 1; // time scale
  cardAnim = () => {
    let t = (performance.now() - t0) / TL; if (skipTo) { t = Math.max(t, skipTo); }
    const W = el.clientWidth, H = el.clientHeight, CW = Math.min(160, W*.3, H*.2), CH = CW*1.5, cx = W/2, cy = H*.38;
    ctx.fillStyle = '#030303'; ctx.fillRect(0,0,W,H);
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, H*.7); g.addColorStop(0, 'rgba(60,45,30,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    // rubble line
    ctx.fillStyle = '#0a0908'; ctx.fillRect(0, H*.78, W, H); for (let i=0;i<14;i++) ell(ctx, hash(i,1)*W, H*.78 + hash(i,2)*10, 20 + hash(i,3)*50, 8, '#0d0b0a');
    // candle/lantern flicker
    const fl = .5 + Math.sin(t/90)*.08 + Math.sin(t/37)*.04; glow(ctx, W*.18, H*.78, W*.5, '#e8923a', fl*.25);
    ctx.fillStyle = 'rgba(200,190,175,.3)'; for (let i=0;i<30;i++) ctx.fillRect(hash(i,5)*W + Math.sin(t/1200+i)*8, (hash(i,6)*H + t*.03*(1+hash(i,7))) % H, 1.5, 1.5);
    const deckX = cx - CW/2, deckY = Math.min(H*.82, H - CH - 10);
    // deck stack
    ctx.globalAlpha = 1 - clamp((t - 5000) / 800, 0, 1); for (let i=0;i<6;i++) drawCardFlip(ctx, null, deckX, deckY - i*1.5, CW, CH, 0, t, -.06 + i*.01); ctx.globalAlpha = 1;
    // shuffle phase: cards arc out and back
    if (t < 1400) { for (let i=0;i<7;i++){ const ph = (t/1400 + i/7) % 1, k = Math.sin(ph*Math.PI); const side = i % 2 ? 1 : -1; drawCardFlip(ctx, null, deckX + side*k*W*.28, deckY - k*H*.2, CW, CH, 0, t, side*k*.6); }
      if (t > 700) cue('sh2', () => AUDIO.play('shuffle')); }
    // spread of three
    const slots = [[-1, .5],[0, .35],[1, .5]].map(([s, yy]) => ({x: cx + s*(CW*1.05) - CW/2, y: H*yy - CH/2, rot: s*.08}));
    const arrive = i => clamp((t - 1500 - i*260) / 600, 0, 1);
    slots.forEach((sl, i) => { const a = ease(arrive(i)); if (a <= 0) return; const flipT = i === 0 ? 2900 : i === 2 ? 3900 : 4900, dur = i === 1 ? 900 : 500;
      const k = self && i !== 1 ? 0 : clamp((t - flipT) / dur, 0, 1), id = i === 1 ? cid : picks[i === 0 ? 0 : 1]; let sc = 1;
      if (i === 1) { const rise = clamp((t - 4600) / 700, 0, 1); sc = 1 + ease(rise) * (W < H ? .5 : .35); } // on a phone held upright the turned card comes up bigger
      const x = lerp(deckX, sl.x, a), y = lerp(deckY, sl.y, a) - (i === 1 ? (sc - 1) * CH*.4 : 0);
      if (k > 0 && i === 1) glow(ctx, x + CW/2, y + CH/2, CW*1.4*sc, c.hue, .12 + k*.28 + Math.sin(t/300)*.04);
      drawCardFlip(ctx, id, x, y, CW, CH, k, t, sl.rot * (1 - a) + sl.rot, sc);
      if (k > .5) cue('f' + i, () => AUDIO.play(i === 1 ? 'reveal' : 'flip'));
      if (i !== 1 && !self) { const ref = clamp((t - flipT - 700) / 800, 0, 1); if (ref > 0) { ctx.save(); ctx.translate(x + CW/2, y + CH/2); ctx.rotate(sl.rot); ctx.globalAlpha = ref * .85; ctx.fillStyle = '#060504'; ctx.fillRect(-CW/2, -CH/2, CW, CH); for (let j=0;j<9;j++) ell(ctx, Math.sin(t/500 + j)*CW*.3, CH/2 - ((t/5 + j*30) % (CH+20)), CW*(.15 + hash(j,1)*.15), 6 + hash(j,2)*6, 'rgba(38,32,30,.55)'); ctx.globalAlpha = 1; ctx.restore(); } }
    });
    // captions
    ctx.fillStyle = '#9c8c78'; ctx.textAlign = 'center'; ctx.font = `italic ${Math.round(Math.min(20, W*.045))}px 'IM Fell English', serif`;
    const cap = self ? (t < 1500 ? 'Tuft shuffles. Her hands are not steady.' : t < 2900 ? 'One card. For herself. The first time.' : t < 4900 ? 'The cards on either side stay face down.' : t < 5800 ? 'She turns it over.' : '')
      : t < 1500 ? 'Tuft shuffles without looking at her hands.' : t < 2900 ? 'Three cards. She never draws for herself.' : t < 3900 ? 'The first card refuses her.' : t < 4900 ? 'The second card refuses her.' : t < 5800 ? 'The third does not.' : '';
    if (cap) ctx.fillText(cap, cx, H*.74);
    if (t > 5600) { cue('flash', () => { const f = $('#flash'); f.classList.remove('go'); void f.offsetWidth; f.classList.add('go'); }); $('#cfText').classList.add('show'); }
  };
  window.addEventListener('resize', fit, {once:false});
}

