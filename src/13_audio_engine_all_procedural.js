/* ============ audio engine (all procedural) ============ */
/* Everything is synthesised with WebAudio; there are no samples.
   AUDIO.setScene(kind) takes the kind the game asks for ('title', 'explore', 'tunnel', 'dark', 'battle', 'fete',
   'lake', 'end') and, from where the game is (the area, the talk backdrop, the battle's setting), picks a music cue
   and an ambience. Each runs as a layer; when either changes, the old layer fades out under the new one.
   AUDIO.play(name, ...args) fires a one-shot. Buses: music, sfx and ambience, each with a send to one shared
   convolution reverb, into master, a sub-sonic high-pass and a limiter. The context starts on the first gesture and is
   suspended while the page is hidden or the sound is muted. One timer does all the scheduling, and only while it can be heard. */
const AUDIO = (() => {
  let ac = null, offline = false, master, busMus, busSfx, busAmb, wetMus, wetSfx, wetAmb, musSend, sfxTo, sfxWet;
  let want = null, pend = false, hush = false, mus = null, amb = null, fading = [], timer = null, muteT = 0;
  let bufs = {}, recent = {};
  const warned = {};
  const PHRYG = [0, 1, 3, 5, 7, 8, 10]; // D phrygian degrees
  const ROOT = 73.42; // D2
  const f = (deg, oct = 0) => ROOT * Math.pow(2, (PHRYG[((deg % 7) + 7) % 7] + 12 * (Math.floor(deg / 7) + oct)) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)], chance = p => Math.random() < p, P = () => rnd(-.8, .8);
  const now = () => ac.currentTime;
  const live = () => !!ac && (offline || ac.state === 'running');
  const muted = () => !(SET.master > 0) || !(SET.music > 0 || SET.sfx > 0 || SET.amb > 0);
  const vol = k => Math.max(0, Math.min(1, +SET[k] || 0));
  const res = () => { try { const p = ac.resume(); if (p && p.then) p.then(sync, () => {}); } catch(e) {} };
  const sus = () => { try { const p = ac.suspend(); if (p && p.catch) p.catch(() => {}); } catch(e) {} };
  const warn = (k, m) => { if (!warned[k]) { warned[k] = 1; console.warn('AUDIO: ' + m); } };

  /* ---- the graph ---- */
  function gn(v, to){ const g = ac.createGain(); g.gain.value = v; if (to) g.connect(to); return g; }
  function F(type, fr, q, to){ const n = ac.createBiquadFilter(); n.type = type; n.frequency.value = fr; if (q != null) n.Q.value = q; if (to) n.connect(to); return n; }
  function init(){
    if (ac) return true;
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return false;
    try { ac = new C(); } catch(e) { return false; }
    build(); ac.onstatechange = sync; return true;
  }
  function build(){
    const lim = ac.createDynamicsCompressor(); // a limiter: catches stacked explosions, leaves everything else alone
    lim.threshold.value = -6; lim.knee.value = 4; lim.ratio.value = 12; lim.attack.value = .002; lim.release.value = .2; lim.connect(ac.destination);
    master = gn(0, F('highpass', 30, .7, lim));
    const verb = ac.createConvolver(); verb.buffer = ir(2.6); verb.connect(gn(.5, master)); const verbIn = gn(1, verb);
    busMus = gn(0, master); busSfx = gn(0, master); busAmb = gn(0, master);
    wetMus = gn(0, verbIn); wetSfx = gn(0, verbIn); wetAmb = gn(0, verbIn);
    musSend = gn(.3, wetMus); sfxTo = busSfx; sfxWet = gn(.35, wetSfx);
    applyVolumes();
  }
  function ir(sec){ // a dark stone hall: decaying noise that loses its top end as it dies
    const sr = ac.sampleRate, n = Math.floor(sr * sec), b = ac.createBuffer(2, n, sr);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let l = 0;
      for (let i = 0; i < n; i++) { const u = i / n; l += (.5 - .43 * u) * (Math.random() * 2 - 1 - l); d[i] = l * Math.exp(-6.5 * u) * Math.min(1, i / (sr * .015)); } }
    return b;
  }
  /* noise: w white, b brown, p pink. Mono two-second buffers for one-shots (started at a random point, so no two are
     alike); stereo beds for ambience, whose tail is cross-faded into the head so the loop has no seam. */
  function noiseBuf(kind, ch, sec){
    const sr = ac.sampleRate, n = Math.floor(sr * sec), x = Math.floor(sr * .3), b = ac.createBuffer(ch, n, sr), tmp = new Float32Array(n + x);
    for (let c = 0; c < ch; c++) {
      const d = b.getChannelData(c); let l = 0, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, ss = 0;
      for (let i = 0; i < n + x; i++) { const w = Math.random() * 2 - 1; let y;
        if (kind === 'b') { l = (l + .02 * w) / 1.02; y = l; }
        else if (kind === 'p') { b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759; b2 = .969 * b2 + w * .153852; b3 = .8665 * b3 + w * .3104856; b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898; y = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362; b6 = w * .115926; }
        else y = w;
        tmp[i] = y; ss += y * y; }
      const k = (kind === 'w' ? .577 : kind === 'b' ? .2 : .3) / Math.sqrt(ss / (n + x));
      for (let i = x; i < n; i++) d[i] = tmp[i] * k;
      for (let i = 0; i < x; i++) { const u = i / x; d[i] = (tmp[i] * Math.sqrt(u) + tmp[n + i] * Math.sqrt(1 - u)) * k; }
    }
    return b;
  }
  const mono = k => bufs[k] || (bufs[k] = noiseBuf(k, 1, 2));
  const wide = k => bufs[k + '2'] || (bufs[k + '2'] = noiseBuf(k, 2, 4.5));

  /* ---- voices: every one is enveloped from and back to silence, and cleans itself up when it ends ---- */
  function env(g, t, a, peak, d){ g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); }
  function vout(head, t, a, v, d, to, pan, wet){
    const g = ac.createGain(); env(g, t, a, v, d); head.connect(g); let o = g;
    if (pan && ac.createStereoPanner) { o = ac.createStereoPanner(); o.pan.value = Math.max(-1, Math.min(1, pan)); g.connect(o); }
    o.connect(to); if (wet) o.connect(wet);
    return () => { try { o.disconnect(); if (o !== g) g.disconnect(); } catch(e) {} };
  }
  function tone(fr, {type = 'sine', a = .01, d = .3, v = .3, t = now(), to = sfxTo, wet = null, slide = null, filt = null, det = 0, pan = 0, vib = 0, am = null} = {}){
    const o = ac.createOscillator(), end = t + a + d + .05, extra = []; o.type = type; o.frequency.setValueAtTime(fr, t); if (det) o.detune.value = det;
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + a + d);
    let head = o;
    if (filt) { const fl = F(filt.type || 'lowpass', filt.f, filt.q || .7); if (filt.pk) { fl.frequency.setValueAtTime(filt.f, t); fl.frequency.exponentialRampToValueAtTime(filt.pk, t + a + .001); fl.frequency.exponentialRampToValueAtTime(filt.e || filt.f, t + a + d); } head.connect(fl); head = fl; extra.push(fl); }
    if (vib) { const l = ac.createOscillator(), lg = gn(0); l.frequency.value = rnd(4.6, 5.6); lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(vib, t + a + d * .5); l.connect(lg); lg.connect(o.detune); l.start(t); l.stop(end); extra.push(l, lg); }
    if (am) { const l = ac.createOscillator(), lg = gn(am[1]), mg = gn(1 - am[1]); l.frequency.value = am[0]; l.connect(lg); lg.connect(mg.gain); head.connect(mg); head = mg; l.start(t); l.stop(end); extra.push(l, lg, mg); }
    const off = vout(head, t, a, v, d, to, pan, wet);
    o.start(t); o.stop(end); o.onended = () => { off(); extra.forEach(n => { try { n.disconnect(); } catch(e) {} }); try { o.disconnect(); } catch(e) {} };
    return o;
  }
  function noise({a = .005, d = .2, v = .4, t = now(), f: fr = 1200, q = 1, type = 'bandpass', slide = null, to = sfxTo, wet = null, buf = 'w', pan = 0} = {}){
    const s = ac.createBufferSource(), b = mono(buf), fl = F(type, fr, q), end = t + a + d + .05; s.buffer = b; s.loop = true;
    fl.frequency.setValueAtTime(fr, t); if (slide) fl.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t + a + d);
    s.connect(fl); const off = vout(fl, t, a, v, d, to, pan, wet);
    s.start(t, Math.random() * (b.duration - .5)); s.stop(end); s.onended = () => { off(); try { s.disconnect(); fl.disconnect(); } catch(e) {} };
  }

  /* ---- sound effects ---- */
  const SFX = {
    click(){ tone(rnd(860, 940), {type:'square', a:.002, d:.04, v:.05, filt:{f:1800}}); },
    step(){ const t = now(), p = rnd(-.15, .15); noise({t, a:.004, d:rnd(.05, .08), v:rnd(.2, .26), f:rnd(550, 800), q:.8, type:'lowpass', pan:p}); noise({t, a:.002, d:.025, v:.035, f:rnd(1400, 1900), q:1.2, pan:p}); },
    sword(){ const t = now(), p = rnd(-.2, .2), m = rnd(.92, 1.08);
      noise({t, a:.002, d:.07, v:.42, f:2100 * m, q:.9, pan:p});
      [[1, .07, .45], [2.63, .04, .3], [4.1, .02, .18]].forEach(([r, v, d]) => tone(980 * m * r, {t, a:.002, d, v, pan:p, wet:sfxWet}));
      tone(150, {t, d:.14, v:.35, slide:60}); noise({t, a:.002, d:.1, v:.35, f:450, q:.8, type:'lowpass', pan:p}); },
    miss(){ const t = now(), p = rnd(-.4, .4); noise({t, a:.07, d:.08, v:.42, f:450, slide:1500, q:1.6, pan:p}); noise({t:t + .1, a:.01, d:.16, v:.3, f:1500, slide:500, q:1.6, pan:-p}); },
    bow(){ const t = now(); noise({t, d:.04, v:.4, f:1100, type:'lowpass'}); tone(220, {t, type:'triangle', d:.2, v:.2, slide:110}); tone(440, {t, type:'triangle', d:.1, v:.07, slide:230}); noise({t:t + .02, a:.03, d:.22, v:.13, f:2400, slide:800, q:2.5}); },
    hurt(){ const t = now(), p = rnd(-.2, .2); noise({t, a:.002, d:.09, v:.6, f:650, q:.6, pan:p}); tone(rnd(170, 200), {t, type:'sawtooth', a:.005, d:.16, v:.2, slide:85, filt:{f:1200}, pan:p}); tone(95, {t, d:.16, v:.3, slide:45}); },
    death(){ const t = now(); tone(210, {t, type:'sawtooth', a:.02, d:.8, v:.13, slide:70, filt:{f:700, q:2}}); tone(110, {t, d:.7, v:.22, slide:38}); noise({t, a:.05, d:.6, v:.14, f:500, slide:120, type:'lowpass', buf:'b'}); noise({t:t + .28, a:.004, d:.22, v:.4, f:650, type:'lowpass'}); },
    boom(big = 1){ const t = now(); noise({t, a:.004, d:.8 * big, v:.9, f:2600, slide:70, type:'lowpass', buf:'b', wet:sfxWet}); tone(70, {t, d:.8 * big, v:.45, slide:28}); noise({t, a:.002, d:.16, v:.4, f:1400, q:.7}); noise({t:t + .04, d:.5 * big, v:.16, f:3200, slide:1100, q:.7, wet:sfxWet}); },
    burner(){ const t = now(); noise({t, a:.05, d:.9, v:.55, f:900, slide:300, q:.8, type:'lowpass', buf:'b'}); noise({t, a:.08, d:1.1, v:.14, f:2000, q:1.2}); for (let i = 0; i < 7; i++) noise({t:t + rnd(.1, 1), d:.012, v:rnd(.08, .16), f:rnd(1400, 2800), q:2, pan:P()}); },
    magic(){ const t = now(); [0, 2, 4, 7].forEach((d, i) => tone(f(d + 7, 2), {t:t + i * .06, a:.02, d:.5, v:.12, wet:sfxWet, pan:(i - 1.5) * .25})); noise({t, a:.1, d:.6, v:.07, f:3600, q:4, wet:sfxWet}); },
    shadow(){ const t = now(); tone(440, {t, type:'sawtooth', a:.05, d:.6, v:.12, slide:110, filt:{f:900, q:3}, wet:sfxWet}); noise({t, a:.08, d:.7, v:.15, f:1200, slide:200, q:2, wet:sfxWet}); },
    heal(){ const t = now(); [0, 4, 7, 11].forEach((d, i) => tone(f(d, 3), {t:t + i * .09, type:'triangle', a:.02, d:.7, v:.09, wet:sfxWet})); },
    shuffle(){ const t = now(); for (let i = 0; i < 6; i++) noise({t:t + i * .07 + rnd(0, .02), d:.05, v:.28, f:rnd(1600, 2300), q:2, pan:rnd(-.3, .3)}); },
    flip(){ const t = now(); noise({t, d:.09, v:.4, f:1700, q:1.5}); tone(f(0, 3), {t:t + .05, a:.02, d:.35, v:.08, wet:sfxWet}); },
    reveal(){ const t = now(); [1, 2, 3.01, 4.7].forEach((h, i) => tone(f(0, 1) * h, {t, a:.02, d:2.6 - i * .4, v:.22 / (i + 1), wet:sfxWet})); noise({t, a:.3, d:1.6, v:.07, f:2400, q:3, wet:sfxWet}); },
    slam(){ const t = now(); tone(60, {t, d:1.1, v:.6, slide:24}); tone(130, {t, type:'triangle', d:.35, v:.25, slide:55}); noise({t, a:.003, d:.9, v:.7, f:1600, slide:70, type:'lowpass', buf:'b', wet:sfxWet}); noise({t, a:.002, d:.12, v:.35, f:900, q:.8});
      for (let i = 0; i < 6; i++) noise({t:t + rnd(.08, .7), d:.03, v:rnd(.05, .12), f:rnd(900, 2200), q:2, pan:P()}); },
    up(){ const t = now(); [0, 3, 7, 10, 14].forEach((d, i) => tone(f(d, 2), {t:t + i * .1, type:'triangle', a:.02, d:.8, v:.13, wet:sfxWet})); },
    coin(){ const t = now(), m = rnd(.95, 1.05); [[2100, .1, .22], [3350, .05, .16], [5200, .018, .08]].forEach(([fr, v, d]) => tone(fr * m, {t, a:.002, d, v})); [[2350, .06, .18], [3700, .03, .12]].forEach(([fr, v, d]) => tone(fr * m, {t:t + .07, a:.002, d, v})); },
    win(){ const t = now(); [[0, 0], [3, .2], [7, .4], [5, .7], [7, 1]].forEach(([d, dt]) => tone(f(d, 1), {t:t + dt, type:'triangle', a:.03, d:1.1, v:.18, to:busMus, wet:musSend})); },
    lose(){ const t = now(); [0, 1, 5].forEach(d => { tone(f(d, 0), {t, type:'sawtooth', a:.4, d:3, v:.11, filt:{f:500}, to:busMus, wet:musSend}); tone(f(d, 1), {t, type:'sawtooth', a:.5, d:2.6, v:.04, filt:{f:900}, to:busMus, wet:musSend}); }); },
    dice(ok){ const t = now(); noise({t, d:.06, v:.3, f:2300, q:2}); noise({t:t + .08, d:.06, v:.25, f:2000, q:2}); tone(ok ? f(7, 2) : f(1, 1), {t:t + .2, type:'triangle', a:.02, d:.5, v:.12}); },
    growl(){ const t = now(); tone(78, {t, type:'sawtooth', a:.18, d:1.3, v:.3, slide:52, filt:{f:300, pk:750, e:260, q:3}, am:[27, .45]}); tone(156, {t, type:'sawtooth', a:.2, d:1.1, v:.07, slide:104, filt:{f:600, q:4}, am:[31, .4]}); noise({t, a:.12, d:1.2, v:.2, f:380, q:1.2, buf:'b', wet:sfxWet}); },
  };
  function play(k, ...a){
    const fn = SFX[k];
    if (!fn) return warn(k, 'no sound named "' + k + '"');
    if (!ac) return;
    const stinger = k === 'win' || k === 'lose';
    if (stinger) settle();
    if (!live() || muted() || !(vol(stinger ? 'music' : 'sfx') > 0)) return;
    const t = now(), p = recent[k], r = recent[k] = p && t - p.t < .06 ? {t:p.t, n:p.n + 1} : {t, n:0};
    if (r.n > 2) return; // a burst of the same sound in one instant (a blast hitting five foes) is heard once, not five times louder
    const was = sfxTo; if (r.n) sfxTo = gn(r.n === 1 ? .5 : .3, busSfx);
    try { fn(...a); } catch(e) {}
    if (r.n) { const g = sfxTo; setTimeout(() => { try { g.disconnect(); } catch(e) {} }, 5000); }
    sfxTo = was;
  }

  /* ---- layers: a music cue or an ambience, with a near input (dry, a little reverb) and a far one (dull, mostly reverb) ---- */
  function layer(bus, wet, key, wn){
    const L = {key, keep:new Set(), dry:gn(0, bus), wet:gn(0, wet)};
    L.near = gn(1, L.dry); L.near.connect(gn(wn, L.wet));
    L.far = F('lowpass', 2400, .5); L.far.connect(gn(.35, L.dry)); L.far.connect(L.wet);
    return L;
  }
  function glide(p, v, s){ // ramp from wherever it is now. Chrome drops a sample to zero if a running ramp is plainly cancelled, and restarts from a finished ramp's end on cancelAndHold, so hold only a ramp that is still running
    const t = now(); s = Math.max(.02, s); if (p._e > t && p.cancelAndHoldAtTime) p.cancelAndHoldAtTime(t); else { p.cancelScheduledValues(t); p.setValueAtTime(p.value, t); } p.linearRampToValueAtTime(v, t + s); p._e = t + s; }
  function fadeTo(L, v, s){ glide(L.dry.gain, v, s); glide(L.wet.gain, v, s); }
  function retire(L, s){
    if (!L) return; L.step = null; fadeTo(L, 0, s); L.end = now() + s + .05; fading.push(L);
    const slow = fading.filter(x => !x.quick); if (slow.length > 3) { const o = slow[0]; o.quick = true; fadeTo(o, 0, .05); o.end = now() + .07; } // rapid scene changes: cut the oldest short, but never with a click
  }
  function kill(L){ const t = now(); L.keep.forEach(n => { try { n.stop(t); } catch(e) {} }); L.keep.clear(); [L.dry, L.wet, L.near, L.far].forEach(n => { try { n.disconnect(); } catch(e) {} }); }
  function reap(t){ fading = fading.filter(L => { if (t < L.end) return true; kill(L); return false; }); }
  function settle(){ if (mus && (mus.key === 'battle' || mus.key === 'dark')) { retire(mus, 2.5); mus = null; hush = true; } } // a fight is over: let its music go

  /* ---- music: generative, in D phrygian ---- */
  const MOT = [[0,-1,0,2],[4,3,1,0],[7,5,4,3],[0,3,4,7],[2,1,0,-3],[4,7,8,7],[0,0,3,2],[7,8,10,7],[4,5,4,1],[0,1,0,-2],[3,2,1,0],[5,4,1,0]];
  const PL = [[[0,4],[0,3],[-2,2],[-1,3]], [[0,4],[1,5],[0,4],[-2,2]], [[-2,2],[-1,3],[0,4],[0,4]], [[0,4],[-1,3],[1,5],[0,4]]];
  const PE = [[[0,2,4],[-2,0,2],[-1,1,3],[0,2,4]], [[0,2,4],[1,3,5],[-2,0,2],[0,2,4]], [[-2,0,2],[-1,1,3],[0,2,4],[0,4]]];
  const PB = [[[0,4],[1,5],[0,3],[-2,1]], [[0,4],[0,4],[1,5],[-1,3]], [[0,4],[-2,2],[1,5],[0,4]]];
  const PD = [[[0,1],[0,4],[-3,1],[0,1]], [[0,4],[1,5],[-3,1],[-2,1]], [[0,1,4],[-3,1],[0,4],[1,5]]];
  function pad(L, t, degs, dur, v, cut){ // detuned saws, spread left and right; the filter opens and closes with the swell
    const fl = F('lowpass', cut * .5, .5), g = gn(0, L.near), end = t + dur; let n = 0;
    fl.frequency.setValueAtTime(cut * .5, t); fl.frequency.linearRampToValueAtTime(cut, t + dur * .45); fl.frequency.linearRampToValueAtTime(cut * .55, end);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + dur * .4); g.gain.linearRampToValueAtTime(0, end); fl.connect(g);
    degs.forEach((d, i) => [-1, 1].forEach(s => { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f(d); o.detune.value = s * rnd(4, 8);
      let h = o; if (ac.createStereoPanner) { h = ac.createStereoPanner(); h.pan.value = s * (.25 + .15 * i); o.connect(h); } h.connect(fl);
      o.start(t); o.stop(end + .05); n++; L.keep.add(o);
      o.onended = () => { L.keep.delete(o); try { o.disconnect(); if (h !== o) h.disconnect(); } catch(e) {} if (--n === 0) try { fl.disconnect(); g.disconnect(); } catch(e) {} }; }));
  }
  function glass(L, t, fr, v){ tone(fr, {t, a:.03, d:2.8, v, to:L.far, pan:P() * .5}); tone(fr * 2.005, {t, a:.03, d:1.4, v:v * .3, to:L.far}); }
  function toll(t, fr, v, to){ [[.5, 1, 6], [1, .8, 4], [1.19, .45, 3], [1.5, .3, 2.4], [2, .35, 2], [2.52, .16, 1.3], [3.01, .1, .9]].forEach(([r, k, d]) => tone(fr * r, {t, a:.004, d, v:v * k, to, det:rnd(-4, 4)})); } // a bell with a minor third in it
  function melody(L, t, d, bl){
    if (L.inst === 'cello') tone(f(d, 1), {t, type:'sawtooth', a:.35, d:bl * 2.6, v:.075, filt:{f:300, pk:1000, e:380, q:.8}, vib:9, to:L.near});
    else if (L.inst === 'glass') glass(L, t, f(d, 3), .04);
    else { tone(f(d, 2), {t, type:'triangle', a:.08, d:bl * 2.2, v:.14, vib:7, to:L.near}); tone(f(d, 2), {t:t + .02, a:.1, d:bl * 2.2, v:.05, det:6, to:L.near}); }
  }
  function section(L){ // what the next few bars do: play, thin out, or rest, so a long session breathes
    const S0 = L.st.secs.filter(s => !(s[0] === 'rest' && L.sec === 'rest')); let r = Math.random() * S0.reduce((a, s) => a + s[1], 0);
    const s = S0.find(s => (r -= s[1]) <= 0) || S0[0];
    L.sec = s[0]; L.left = s[2] - 1; L.prog = pick(L.st.prog); L.inst = pick(L.st.inst || ['flute']); L.motif = pick(MOT); L.mi = 0;
    if (L.st.pats) { L.pat = pick(L.st.pats); L.fill = pick(L.st.fills); }
  }
  function lyric(L, t, b){ // title, explore and the endings: a pad every two bars, a line that comes and goes, a bell far off
    const P0 = L.st, bl = L.len;
    if (b % 8 === 0) { if (!(L.left-- > 0)) section(L); const ch = L.ch = L.prog[(b >> 3) % L.prog.length];
      if (L.sec !== 'rest') pad(L, t, ch, bl * 8 + .5, P0.pv * (L.sec === 'thin' ? .75 : 1), P0.cut);
      else if (chance(.6)) pad(L, t, [ch[0]], bl * 8 + .5, P0.pv * .6, P0.cut * .7); }
    if (b % 2 === 0) { const d = L.motif[L.mi];
      if (L.sec === 'full' && chance(P0.dens)) melody(L, t, d, bl);
      else if (L.sec === 'thin' && b % 4 === 0 && chance(P0.dens * .5)) glass(L, t, f(d, 3), .03);
      if (++L.mi >= 4) { L.mi = 0; if (chance(.5)) L.motif = pick(MOT); } }
    if (b % P0.bellEvery === P0.bellAt && chance(P0.bell)) toll(t, f(pick(P0.bellDeg), 1), P0.bv, L.far);
  }
  function heart(L, t, v){ [[0, 1], [.24, .7]].forEach(([dt, k]) => { tone(66, {t:t + dt, a:.004, d:.2, v:.32 * v * k, slide:42, to:L.near}); noise({t:t + dt, a:.004, d:.07, v:.12 * v * k, f:300, type:'lowpass', to:L.near}); }); }
  function dread(L, t, b){ // dark talk: no drums, a slow heart, clusters, a high note that is slightly wrong
    const bl = L.len;
    if (b % 8 === 0) { if (!(L.left-- > 0)) section(L); const ch = L.ch = L.prog[(b >> 3) % L.prog.length], rest = L.sec === 'rest'; pad(L, t, rest ? [ch[0]] : ch, bl * 8 + .5, rest ? .045 : .06, rest ? 280 : 450); }
    if (L.sec === 'pulse' && b % 2 === 0) heart(L, t, b % 8 === 0 ? 1 : .75);
    if (L.sec !== 'rest' && b % 4 === 2 && chance(.3)) glass(L, t, f(pick([1, 4, 5, 8, 11]), 2) * (chance(.35) ? 1.03 : 1), .03);
    if (b % 16 === 8 && chance(.3)) noise({t, a:bl * 3, d:.08, v:.07, f:220, slide:900, type:'lowpass', buf:'b', to:L.near}); // a swell that stops dead
  }
  function kick(L, t, v){ tone(115, {t, a:.002, d:.32, v:.6 * v, slide:42, to:L.near}); noise({t, a:.002, d:.07, v:.3 * v, f:900, q:.7, type:'lowpass', to:L.near}); }
  function tom(L, t, v){ tone(195, {t, a:.002, d:.18, v:.3 * v, slide:118, to:L.near}); noise({t, a:.002, d:.06, v:.18 * v, f:1400, q:1, to:L.near}); }
  function horn(L, t, fr, dur, v){ tone(fr, {t, type:'sawtooth', a:.07, d:dur, v, filt:{f:260, pk:1400, e:420, q:1.1}, vib:6, to:L.near}); tone(fr * 1.004, {t, type:'sawtooth', a:.09, d:dur, v:v * .6, filt:{f:240, pk:1100, e:380}, to:L.near, pan:.3}); }
  function battle(L, t, s){ // eighth notes: drums, a low ostinato, a horn over it, and bars where it all drops out
    const P0 = L.st, st = s % 8, bar = s >> 3, e = L.len;
    if (st === 0 && bar % 2 === 0) { if (!(L.left-- > 0)) section(L); L.ch = L.prog[(bar >> 1) % L.prog.length]; pad(L, t, L.ch, e * 16 + .4, P0.pv * (L.sec === 'break' ? 1.3 : 1), P0.cut); }
    const c = (L.sec === 'break' ? 'K.......' : bar % 4 === 3 ? L.fill : L.pat)[st];
    if (c === 'K' || c === 'k') kick(L, t, c === 'K' ? 1 : .6); else if (c === 'S' || c === 's') tom(L, t, c === 'S' ? 1 : .55);
    if (L.sec !== 'break') { const o = P0.ost[st]; if (o !== '.') tone(f(L.ch[0] + (o === 'b' ? 1 : 0), 1), {t, type:'sawtooth', a:.006, d:e * .85, v:o === 'X' ? .045 : .03, filt:{f:180, pk:o === 'X' ? 1200 : 800, e:220, q:1.4}, to:L.near}); }
    if (st % 4 === 0) { if (L.sec === 'full' && chance(P0.dens)) horn(L, t, f(L.motif[L.mi], 1), e * 3.6, P0.hv); if (++L.mi >= 4) { L.mi = 0; if (chance(.5)) L.motif = pick(MOT); } }
  }
  const STYLE = {
    title:{bpm:54, fn:lyric, lvl:2, wet:.45, prog:PL, pv:.06, cut:600, dens:.42, inst:['glass','flute'], bell:.7, bellEvery:8, bellAt:4, bellDeg:[0], bv:.07, secs:[['full',4,3],['thin',3,3],['rest',2,2]]},
    calm:{bpm:60, fn:lyric, lvl:2.4, wet:.4, prog:PL, pv:.065, cut:650, dens:.38, inst:['flute','cello','glass'], bell:.5, bellEvery:16, bellAt:12, bellDeg:[0,-3], bv:.05, secs:[['full',5,4],['thin',4,3],['rest',2,2]]},
    end:{bpm:50, fn:lyric, lvl:1.6, wet:.45, prog:PE, pv:.06, cut:700, dens:.55, inst:['flute','glass','cello'], bell:.6, bellEvery:16, bellAt:0, bellDeg:[0], bv:.06, secs:[['full',6,4],['thin',3,3],['rest',1,1]]},
    dread:{bpm:52, fn:dread, lvl:1.7, wet:.5, prog:PD, secs:[['pulse',4,3],['still',3,3],['rest',2,2]]},
    battle:{bpm:96, sub:2, fn:battle, lvl:1.5, wet:.28, prog:PB, pv:.055, cut:800, dens:.55, hv:.07, ost:'XxxXxxXx',
      pats:['K...K.S.','K..K..S.','K.K...S.','K...K.Ss'], fills:['K.S.KSSS','K.sSK.SS','KsS.KsSS'], secs:[['full',5,4],['drive',3,2],['break',1,1]]},
    dark:{bpm:84, sub:2, fn:battle, lvl:1.6, wet:.35, prog:PD, pv:.06, cut:600, dens:.4, hv:.065, ost:'X.x.Xbx.',
      pats:['K......k','K...K...','K..k..S.','K...k.s.'], fills:['K.k.K.SS','K..sK.SS'], secs:[['full',4,4],['drive',3,2],['break',2,1]]},
  };
  function startMusic(key, fin){
    const st = STYLE[key], L = layer(busMus, wetMus, key, st.wet);
    Object.assign(L, {st, fn:st.fn, i:0, left:0, next:now() + .08, len:60 / st.bpm / (st.sub || 1), step:musicStep});
    fadeTo(L, st.lvl || 1, fin); return L;
  }
  function musicStep(L, t, look){ if (L.next < t - .3) L.next = t + .05; while (L.next < look) { if (vol('music') > 0) L.fn(L, L.next, L.i); L.next += L.len; L.i++; } }

  /* ---- ambience: stereo noise beds and drones, plus events at random intervals ---- */
  function bed(L, {buf = 'b', type = 'bandpass', f: fr = 400, q = .7, v = .3, drift = 0, rate = .07}){
    const s = ac.createBufferSource(), fl = F(type, fr, q), g = gn(v, L.near); s.buffer = wide(buf); s.loop = true; s.playbackRate.value = rnd(.94, 1.06);
    s.connect(fl); fl.connect(g); s.start(now(), Math.random() * 3); L.keep.add(s);
    if (drift) { const o = ac.createOscillator(); o.frequency.value = rate * rnd(.8, 1.25); o.connect(gn(drift, fl.frequency)); o.start(); L.keep.add(o); }
    return {g, fl, v, f:fr};
  }
  function drone(L, fr, v, cut, type = 'sine'){ const o = ac.createOscillator(); o.type = type; o.frequency.value = fr; let h = o; if (cut) { h = F('lowpass', cut, .7); o.connect(h); } h.connect(gn(v, L.near)); o.start(); L.keep.add(o); }
  const on = (L, spec) => Object.keys(spec).forEach(k => L.ev.push({fn:EV[k], m:spec[k]}));
  const EV = {
    gust(L, t){ const w = L.wind; if (!w) return; const hold = rnd(1.5, 4); w.g.gain.setTargetAtTime(w.v * rnd(1.4, 2.2), t, rnd(.6, 1.4)); w.g.gain.setTargetAtTime(w.v, t + hold, rnd(1, 2.2)); w.fl.frequency.setTargetAtTime(w.f * rnd(1.2, 1.7), t, 1); w.fl.frequency.setTargetAtTime(w.f, t + hold, 1.8); },
    ember(L, t){ noise({t, d:rnd(.02, .05), v:rnd(.03, .07), f:rnd(1500, 3000), q:3, to:L.near, pan:P()}); },
    drip(L, t){ tone(rnd(1300, 2500), {t, a:.002, d:.16, v:rnd(.05, .09), slide:rnd(500, 800), to:L.far, pan:P()}); },
    pebble(L, t){ const p = P(); for (let i = 0, n = 2 + R(3); i < n; i++) noise({t:t + i * rnd(.05, .14), d:.015, v:rnd(.03, .06), f:rnd(1600, 2800), q:4, to:L.far, pan:p}); },
    rumble(L, t){ noise({t, a:1.5, d:2.5, v:.3, f:140, q:.7, type:'lowpass', buf:'b', to:L.near}); },
    whisper(L, t){ tone(f(R(7), 3), {t, a:.6, d:1.4, v:.04, to:L.far, det:rnd(-15, 15), pan:P()}); if (chance(.5)) noise({t:t + .2, a:.25, d:.7, v:.04, f:rnd(1700, 2600), q:7, to:L.far, pan:P()}); },
    breath(L, t){ noise({t, a:1.6, d:1.8, v:.14, f:340, q:.8, type:'lowpass', buf:'b', to:L.near}); },
    crackle(L, t){ for (let i = 0, n = 2 + R(5); i < n; i++) noise({t:t + rnd(0, .6), d:rnd(.004, .018), v:rnd(.04, .1), f:rnd(1100, 2800), q:1.5, to:L.near, pan:rnd(-.3, .3)}); },
    clink(L, t){ const b = rnd(900, 1400), p = P(); [[1, .03, .25], [2.76, .014, .14], [4.2, .005, .07]].forEach(([r, v, d]) => tone(b * r, {t, a:.004, d, v, to:L.far, pan:p})); },
    hammer(L, t){ const b = rnd(800, 1100), p = P(), gap = rnd(.5, .6); for (let i = 0, n = 3 + R(3); i < n; i++) [[1, .035, .3], [2.76, .014, .15]].forEach(([r, v, d]) => tone(b * r, {t:t + i * gap, a:.002, d, v, to:L.far, pan:p})); },
    voices(L, t){ const p = P(); for (let i = 0, n = 2 + R(4); i < n; i++) noise({t:t + i * rnd(.14, .3), a:.04, d:rnd(.1, .28), v:rnd(.022, .045), f:rnd(350, 900), q:rnd(4, 7), to:L.near, pan:p}); },
    cheer(L, t){ noise({t, a:.8, d:1.6, v:.06, f:rnd(600, 900), q:.9, to:L.near}); for (let i = 0; i < 6; i++) noise({t:t + rnd(0, 1.2), a:.05, d:rnd(.15, .35), v:rnd(.02, .04), f:rnd(500, 1100), q:5, to:L.near, pan:P()}); },
    pipes(L, t){ const base = R(3), p = P(); for (let i = 0, n = 3 + R(3); i < n; i++) tone(f(base + [0, 2, 4, 3, 1][i], 3), {t:t + i * .22, type:'triangle', a:.04, d:.3, v:.025, to:L.far, det:rnd(-7, 7), pan:p}); },
    fdrum(L, t){ const p = P(); for (let i = 0, n = 4 + R(4); i < n; i++) { const u = t + i * .42 + (i % 2 ? .07 : 0); tone(140, {t:u, d:.18, v:.09, slide:85, to:L.far, pan:p}); noise({t:u, d:.05, v:.05, f:700, type:'lowpass', to:L.far, pan:p}); } },
    lap(L, t){ noise({t, a:.08, d:rnd(.5, .9), v:rnd(.07, .12), f:rnd(700, 1000), slide:180, type:'lowpass', buf:'b', to:L.near, pan:P()}); },
    gull(L, t){ const p = P(); [0, .28].forEach(d => tone(rnd(1500, 1800), {t:t + d, type:'sawtooth', a:.02, d:.22, v:.018, slide:900, filt:{f:2200, q:2}, to:L.far, pan:p})); },
    creak(L, t){ tone(rnd(70, 110), {t, type:'sawtooth', a:.25, d:rnd(.5, .9), v:.03, slide:rnd(60, 90), filt:{type:'bandpass', f:rnd(500, 800), q:5}, vib:25, to:L.near, pan:P()}); },
    cricket(L, t){ const fr = rnd(3900, 4400), p = P(); for (let i = 0, n = 3 + R(3); i < n; i++) tone(fr, {t:t + i * .045, a:.004, d:.02, v:.008, to:L.far, pan:p}); },
    bird(L, t){ const p = P(), b = rnd(2300, 3200); for (let i = 0, n = 2 + R(4); i < n; i++) tone(b * rnd(.9, 1.15), {t:t + i * rnd(.09, .17), a:.006, d:rnd(.05, .1), v:.012, slide:b * rnd(.7, 1.4), to:L.far, pan:p}); },
    owl(L, t){ const p = P(); tone(380, {t, a:.05, d:.3, v:.025, slide:350, to:L.far, pan:p}); tone(370, {t:t + .55, a:.08, d:.55, v:.03, slide:330, to:L.far, pan:p}); },
    hawk(L, t){ tone(rnd(2200, 2600), {t, type:'triangle', a:.05, d:.8, v:.012, slide:rnd(1500, 1800), to:L.far, pan:P()}); },
    hooves(L, t){ const p = P(); for (let i = 0, n = 6 + R(6); i < n; i++) noise({t:t + i * .19 + (i % 2) * .05, d:.03, v:.035, f:rnd(800, 1200), q:2, to:L.far, pan:p}); },
    dog(L, t){ const p = P(); for (let i = 0, n = 1 + R(3); i < n; i++) { const fr = rnd(420, 520); tone(fr, {t:t + i * rnd(.3, .45), type:'sawtooth', a:.01, d:.12, v:.02, slide:fr * .7, filt:{type:'bandpass', f:1000, q:2}, to:L.far, pan:p}); } },
    bell(L, t){ toll(t, f(pick([0, -3]), 1), .05, L.far); },
    ice(L, t){ const p = P(); noise({t, d:.03, v:.08, f:rnd(2000, 3200), q:2, to:L.near, pan:p}); tone(rnd(2600, 3200), {t, a:.002, d:.45, v:.012, slide:rnd(2000, 2400), to:L.far, pan:p}); },
    flap(L, t){ for (let i = 0, n = 2 + R(3); i < n; i++) noise({t:t + i * rnd(.07, .12), d:.06, v:.06, f:rnd(400, 700), type:'lowpass', to:L.near}); },
  };
  const AMB_LVL = {wind:.5, camp:.56, camp_night:.75, plain:.7, dusk:.7, hills:.53, storm:.63, city_night:.75, lake:.8, tunnel:.75, dark:.75, inn:1.5}; // so that each sits a few dB under the music
  const AMB = {
    wind(L){ L.wind = bed(L, {f:320, q:.8, v:.5, drift:180}); on(L, {gust:11, ember:1.1}); },
    camp(L){ L.wind = bed(L, {f:300, q:.8, v:.36, drift:120}); on(L, {gust:13, clink:8, hammer:28, voices:6, ember:3}); },
    camp_night(L){ L.wind = bed(L, {f:260, q:.8, v:.3, drift:100}); on(L, {gust:15, crackle:1.4, cricket:1.6, voices:10, clink:22, owl:45}); },
    interior(L){ bed(L, {type:'lowpass', f:220, v:.3}); on(L, {creak:12, flap:16, voices:18}); },
    inn(L){ bed(L, {f:420, q:.6, v:.16, drift:60}); on(L, {voices:.55, clink:3.2, crackle:1.8, cheer:28}); },
    plain(L){ L.wind = bed(L, {f:300, q:.7, v:.26, drift:120}); bed(L, {buf:'p', f:1500, q:.5, v:.07, drift:500, rate:.11}); on(L, {gust:8, bird:5, hawk:45}); },
    dusk(L){ L.wind = bed(L, {f:280, q:.7, v:.26, drift:120}); bed(L, {buf:'p', f:1400, q:.5, v:.06, drift:450, rate:.1}); on(L, {gust:10, bird:16, cricket:3.5}); },
    night(L){ L.wind = bed(L, {f:260, v:.18}); bed(L, {buf:'p', f:1300, q:.5, v:.04, drift:400, rate:.09}); on(L, {cricket:.7, owl:32, gust:18}); },
    hills(L){ L.wind = bed(L, {f:380, q:.8, v:.42, drift:200}); bed(L, {buf:'p', f:1600, q:.5, v:.035}); on(L, {gust:7, hawk:30, bird:22}); },
    city(L){ bed(L, {f:480, q:.5, v:.22, drift:120, rate:.05}); on(L, {voices:1.6, hooves:13, clink:9, dog:38, bell:50}); },
    city_night(L){ L.wind = bed(L, {f:280, q:.8, v:.3, drift:120}); on(L, {gust:14, dog:28, bell:55, creak:22, voices:14}); },
    tunnel(L){ bed(L, {type:'lowpass', f:240, v:.55}); drone(L, 49, .06); on(L, {drip:2.4, pebble:11, rumble:32}); },
    dark(L){ bed(L, {type:'lowpass', f:160, v:.5}); drone(L, 36.7, .1); drone(L, 73.4, .05, 170, 'sawtooth'); on(L, {drip:4, whisper:5.5, breath:13}); },
    storm(L){ L.wind = bed(L, {f:360, q:.8, v:.42, drift:200, rate:.13}); bed(L, {buf:'p', f:2300, q:3, v:.05, drift:700, rate:.23}); drone(L, 36.7, .07); on(L, {gust:4, ice:2.6}); },
    fete(L){ bed(L, {f:520, q:.6, v:.26, drift:160, rate:.13}); on(L, {voices:.42, pipes:4.2, cheer:22, fdrum:16}); },
    lake(L){ bed(L, {type:'lowpass', f:380, q:.6, v:.34, drift:140, rate:.09}); on(L, {lap:1.8, gull:8, creak:13}); },
  };
  function startAmb(key, fin){
    const L = layer(busAmb, wetAmb, key, .22); L.ev = []; (AMB[key] || AMB.wind)(L);
    L.ev.forEach(e => e.at = now() + rnd(.3, 1) * e.m); L.step = ambStep; fadeTo(L, AMB_LVL[key] || 1, fin); return L;
  }
  function ambStep(L, t, look){ L.ev.forEach(e => { if (e.at < t - .3) e.at = t + rnd(.1, 1) * e.m; while (e.at < look) { if (vol('amb') > 0) try { e.fn(L, Math.max(e.at, t)); } catch(x) {} e.at += e.m * rnd(.35, 1.65); } }); }

  /* ---- what to play where ---- */
  const SCENE_AMB = {camp:'camp', camp_night:'camp_night', fire:'camp_night', tent:'interior', room:'interior', inn:'inn', plain:'plain', plain_dusk:'dusk', plain_night:'night',
    hills:'hills', hills_dusk:'dusk', quorl_hill:'hills', road_east:'hills', city_street:'city', roof:'city_night', roof_night:'city_night', fete_garden:'plain'};
  const DECOR_AMB = {pale:'camp', camp_night:'camp_night', plain:'plain', plain_dusk:'dusk', plain_night:'night', hills:'hills', hills_dusk:'dusk', city_dusk:'city', city_night:'city_night', roof_night:'city_night', cellar:'tunnel'};
  function where(){ try { return {v:view, sk:G && G.sceneKind, decor:view === 'explore' ? AREA().decor : null, b:view === 'battle' && S ? BATTLES[S.battle] : null, id:S && S.battle, ch:S ? S.chapter : 0}; } catch(e) { return {}; } }
  function battleAmb(w){ const d = w.b || {}, st = d.style;
    return st === 'terrace' || st === 'garden' || w.id === 'house_guards' ? 'fete' : st === 'dock' ? 'lake' : st === 'cellar' ? 'tunnel' : st === 'storm' ? 'storm'
      : st === 'city' || st === 'roof' ? (d.dark ? 'city_night' : 'city') : d.dark ? 'dark' : d.open ? 'night' : w.ch === 1 ? 'camp_night' : 'tunnel'; }
  function cue(kind){
    const w = where();
    switch (kind) {
      case 'title': return {mus:'title', amb:'wind'};
      case 'end': return {mus:'end', amb:'wind'};
      case 'battle': return {mus:'battle', amb:battleAmb(w)};
      case 'dark': return w.v === 'battle' ? {mus:'dark', amb:battleAmb(w)} : {mus:'dread', amb:w.sk === 'garden_storm' ? 'storm' : 'dark'};
      case 'tunnel': return {mus:'calm', amb:'tunnel'};
      case 'fete': return {mus:'calm', amb:'fete'};
      case 'lake': return {mus:'calm', amb:'lake'};
      case 'explore': return {mus:'calm', amb:w.v === 'explore' ? DECOR_AMB[w.decor] || 'wind' : w.v === 'intro' && !w.ch ? 'wind' : SCENE_AMB[w.sk] || 'wind'};
    }
    warn('s:' + kind, 'no cue for scene "' + kind + '"'); return {mus:'calm', amb:'wind'};
  }
  function apply(){
    if (!want) return; const c = cue(want);
    if (!hush && (!mus || mus.key !== c.mus)) { const fight = c.mus === 'battle' || c.mus === 'dark'; retire(mus, fight ? .8 : 2.5); mus = startMusic(c.mus, fight ? .15 : 2.5); }
    if (!amb || amb.key !== c.amb) { retire(amb, 2.2); amb = startAmb(c.amb, 2.2); }
  }
  function tick(){ if (!live()) return; const t = now(), look = t + .45; [mus, amb].forEach(L => { if (L && L.step) try { L.step(L, t, look); } catch(e) {} }); reap(t); }
  function sync(){ // run the scheduler exactly while the context is running, visible and not muted
    if (!ac) return;
    if (live() && !muted() && (offline || !document.hidden)) { if (!timer && !offline) timer = setInterval(tick, 120); apply(); tick(); }
    else if (timer) { clearInterval(timer); timer = null; }
  }
  function setScene(kind){ want = kind; hush = false; if (!pend) { pend = true; Promise.resolve().then(() => { pend = false; sync(); }); } } // several calls in one task settle on the last

  /* ---- volumes, unlocking, background ---- */
  function applyVolumes(){
    if (!ac) return;
    const set = (p, v) => glide(p, v, .06);
    set(master.gain, vol('master')); [[busMus, wetMus, 'music'], [busSfx, wetSfx, 'sfx'], [busAmb, wetAmb, 'amb']].forEach(([b, w, k]) => { set(b.gain, vol(k)); set(w.gain, vol(k)); });
    if (offline) return;
    clearTimeout(muteT);
    if (muted()) muteT = setTimeout(() => { if (muted() && ac.state === 'running') sus(); }, 150); // after the fade: a muted game costs nothing
    else if (ac.state !== 'running' && !document.hidden) res();
    sync();
  }
  function unlock(){
    if (!init() || offline || ac.state === 'running' || document.hidden || muted()) return;
    try { const s = ac.createBufferSource(); s.buffer = ac.createBuffer(1, 1, 22050); s.connect(ac.destination); s.onended = () => s.disconnect(); s.start(0); } catch(e) {} // iOS wants a sound started inside the gesture
    res();
  }
  function vis(){ if (!ac || offline) return; if (document.hidden) { if (ac.state === 'running') sus(); } else if (!muted()) res(); sync(); }
  document.addEventListener('visibilitychange', vis); window.addEventListener('pagehide', vis); window.addEventListener('pageshow', vis);
  const _dev = {attach(c){ ac = c; offline = true; bufs = {}; recent = {}; mus = amb = null; fading = []; want = null; hush = false; build(); }, tick, sync, cue,
    force(m, a){ if (m) mus = startMusic(m, .01); if (a) amb = startAmb(a, .01); },
    get state(){ return {want, mus:mus && mus.key, amb:amb && amb.key, fading:fading.length, timer:!!timer, hush, ctx:ac && ac.state}; }};
  return {unlock, play, setScene, applyVolumes, _dev, get ready(){ return live(); }};
})();
['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'].forEach(ev => window.addEventListener(ev, () => AUDIO.unlock(), {passive:true, capture:true}));
