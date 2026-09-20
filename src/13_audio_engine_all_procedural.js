/* ============ audio engine (all procedural) ============ */
const AUDIO = (() => {
  let ac = null, master, mus, sfx, amb, delay, started = false;
  let scene = null, schedTimer = null, ambNodes = [], musicNodes = [], nextBeat = 0, beat = 0;
  const PHRYG = [0, 1, 3, 5, 7, 8, 10]; // D phrygian degrees
  const ROOT = 73.42; // D2
  const f = (deg, oct = 0) => ROOT * Math.pow(2, (PHRYG[((deg % 7) + 7) % 7] + 12 * (Math.floor(deg / 7) + oct)) / 12);
  function init(){
    if (ac) return true;
    try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { return false; }
    master = ac.createGain(); master.connect(ac.destination);
    mus = ac.createGain(); sfx = ac.createGain(); amb = ac.createGain();
    // gentle delay/reverb-ish on music bus
    delay = ac.createDelay(1.2); delay.delayTime.value = .42; const fb = ac.createGain(); fb.gain.value = .32; const dl = ac.createBiquadFilter(); dl.type = 'lowpass'; dl.frequency.value = 1400;
    delay.connect(dl); dl.connect(fb); fb.connect(delay); const dmix = ac.createGain(); dmix.gain.value = .35; dl.connect(dmix); dmix.connect(master);
    mus.connect(master); mus.connect(delay); sfx.connect(master); amb.connect(master);
    applyVolumes(); started = true; return true;
  }
  function applyVolumes(){ if (!ac) return; master.gain.value = SET.master; mus.gain.value = SET.music; sfx.gain.value = SET.sfx; amb.gain.value = SET.amb; }
  function unlock(){ if (!init()) return; if (ac.state === 'suspended') ac.resume(); if (scene) setScene(scene, true); }
  const now = () => ac.currentTime;
  function noiseBuf(sec = 2, brown = false){ const n = ac.sampleRate * sec, b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0); let last = 0;
    for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; if (brown) { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; } return b; }
  let NB = null, BB = null;
  function env(g, t, a, peak, d, sus = 0){ g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(Math.max(.0001, sus), t + a + d); }
  function tone(freq, {type = 'sine', a = .01, d = .3, v = .3, t = now(), bus = sfx, slide = null, filt = null, detune = 0} = {}){
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t); o.detune.value = detune;
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t + a + d);
    let last = o; if (filt) { const fl = ac.createBiquadFilter(); fl.type = filt.type || 'lowpass'; fl.frequency.value = filt.f; fl.Q.value = filt.q || 1; o.connect(fl); last = fl; }
    last.connect(g); g.connect(bus); env(g, t, a, v, d); o.start(t); o.stop(t + a + d + .05); return o;
  }
  function noise({a = .005, d = .2, v = .4, t = now(), f = 1200, q = 1, type = 'bandpass', slide = null, bus = sfx, brown = false} = {}){
    NB = NB || noiseBuf(2); BB = BB || noiseBuf(3, true);
    const s = ac.createBufferSource(); s.buffer = brown ? BB : NB; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (slide) fl.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t + a + d);
    const g = ac.createGain(); s.connect(fl); fl.connect(g); g.connect(bus); env(g, t, a, v, d); s.start(t); s.stop(t + a + d + .05);
  }
  const SFX = {
    click(){ tone(900, {type:'square', d:.04, v:.05, filt:{f:1800}}); },
    step(){ noise({d:.07, v:.12, f:300 + R(200), q:.7, type:'lowpass'}); },
    sword(){ const t = now(); noise({t, d:.08, v:.5, f:3200, q:.6, type:'highpass'}); tone(2600 + R(600), {t, type:'triangle', d:.25, v:.12}); tone(3900 + R(400), {t, type:'sine', d:.35, v:.08}); tone(120, {t, type:'sine', d:.12, v:.3, slide:50}); },
    miss(){ noise({d:.22, v:.25, f:600, slide:2400, q:2}); },
    bow(){ const t = now(); noise({t, d:.05, v:.5, f:900, type:'lowpass'}); tone(180, {t, type:'triangle', d:.18, v:.25, slide:60}); noise({t:t+.02, d:.25, v:.12, f:3000, slide:900, q:3}); },
    hurt(){ const t = now(); tone(90, {t, d:.18, v:.45, slide:40}); noise({t, d:.12, v:.3, f:500, type:'lowpass'}); },
    death(){ const t = now(); tone(140, {t, type:'sawtooth', d:.9, v:.25, slide:35, filt:{f:600}}); noise({t, d:.5, v:.25, f:400, slide:80, type:'lowpass'}); },
    boom(big = 1){ const t = now(); noise({t, a:.005, d:.7*big, v:.9, f:3000, slide:80, type:'lowpass', brown:true}); tone(60, {t, d:.9*big, v:.8, slide:25}); noise({t:t+.05, d:.4, v:.4, f:5000, type:'highpass'}); },
    burner(){ const t = now(); noise({t, a:.05, d:.9, v:.55, f:900, slide:300, q:.8, type:'lowpass', brown:true}); noise({t, d:1.1, v:.2, f:2500, q:1.5}); },
    magic(){ const t = now(); [0,2,4,7].forEach((d,i) => tone(f(d+7, 2), {t:t+i*.06, type:'sine', a:.02, d:.5, v:.12})); noise({t, a:.1, d:.6, v:.08, f:4000, q:4}); },
    shadow(){ const t = now(); tone(440, {t, type:'sawtooth', a:.05, d:.6, v:.12, slide:110, filt:{f:900, q:3}}); noise({t, a:.08, d:.7, v:.15, f:1200, slide:200, q:2}); },
    heal(){ const t = now(); [0,4,7,11].forEach((d,i) => tone(f(d, 3), {t:t+i*.09, type:'triangle', a:.02, d:.7, v:.1})); },
    shuffle(){ const t = now(); for (let i = 0; i < 6; i++) noise({t:t+i*.07, d:.05, v:.3, f:2000 + R(800), q:2}); },
    flip(){ const t = now(); noise({t, d:.09, v:.4, f:1800, q:1.5}); tone(f(0, 3), {t:t+.05, type:'sine', a:.02, d:.35, v:.08}); },
    reveal(){ const t = now(); [1, 2, 3.01, 4.7].forEach((h,i) => tone(f(0,1)*h, {t, type:'sine', a:.02, d:2.6 - i*.4, v:.22/(i+1)})); noise({t, a:.3, d:1.6, v:.08, f:2600, q:3}); },
    slam(){ const t = now(); tone(45, {t, d:1.2, v:.9, slide:20}); noise({t, d:.9, v:.7, f:1500, slide:60, type:'lowpass', brown:true}); },
    up(){ const t = now(); [0,3,7,10,14].forEach((d,i) => tone(f(d, 2), {t:t+i*.1, type:'triangle', a:.02, d:.8, v:.14})); },
    coin(){ const t = now(); tone(3200, {t, type:'sine', d:.15, v:.12}); tone(4800, {t:t+.03, type:'sine', d:.25, v:.08}); },
    win(){ const t = now(); [[0,0],[3,.2],[7,.4],[5,.7],[7,1.0]].forEach(([d,dt]) => tone(f(d, 1), {t:t+dt, type:'triangle', a:.03, d:1.1, v:.18, bus:mus})); },
    lose(){ const t = now(); [0,1,5].forEach(d => tone(f(d, 0), {t, type:'sawtooth', a:.4, d:3, v:.12, filt:{f:500}, bus:mus})); },
    dice(ok){ const t = now(); noise({t, d:.06, v:.3, f:2500, q:2}); noise({t:t+.08, d:.06, v:.25, f:2200, q:2}); tone(ok ? f(7,2) : f(1,1), {t:t+.2, type:'triangle', a:.02, d:.5, v:.12}); },
    drip(){ tone(1800 + R(900), {type:'sine', a:.002, d:.18, v:.1, slide:600, bus:amb}); },
    growl(){ const t = now(); tone(70, {t, type:'sawtooth', a:.15, d:1.2, v:.25, slide:45, filt:{f:300, q:2}}); noise({t, a:.1, d:1.1, v:.2, f:250, type:'lowpass', brown:true}); },
  };
  function play(k, ...a){ if (!ac || ac.state !== 'running' || !SET.sfx) return; try { SFX[k](...a); } catch(e) {} }
  /* ambience */
  function stopAmb(){ ambNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e) {} }); ambNodes = []; }
  function startAmb(kind){
    stopAmb(); NB = NB || noiseBuf(2); BB = BB || noiseBuf(3, true);
    const t = now();
    if (kind === 'wind' || kind === 'title') { // wind over ruins
      const s = ac.createBufferSource(); s.buffer = BB; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = 'bandpass'; fl.frequency.value = 320; fl.Q.value = .8;
      const lfo = ac.createOscillator(); lfo.frequency.value = .07; const lg = ac.createGain(); lg.gain.value = 180; lfo.connect(lg); lg.connect(fl.frequency);
      const g = ac.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5, t + 3); s.connect(fl); fl.connect(g); g.connect(amb); s.start(); lfo.start(); ambNodes.push(s, lfo, g);
      const emb = setInterval(() => { if (ac.state === 'running' && Math.random() < .5) noise({d:.03 + Math.random()*.05, v:.06 + Math.random()*.08, f:1800 + R(2500), q:3, bus:amb}); }, 260); ambNodes.push({stop(){ clearInterval(emb); }});
    }
    if (kind === 'tunnel' || kind === 'dark') { // low room tone, drips, pebbles
      const s = ac.createBufferSource(); s.buffer = BB; s.loop = true; const fl = ac.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = kind === 'dark' ? 160 : 240;
      const g = ac.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.55, t + 2); s.connect(fl); fl.connect(g); g.connect(amb); s.start(); ambNodes.push(s, g);
      const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = kind === 'dark' ? 36.7 : 49; const og = ac.createGain(); og.gain.setValueAtTime(0, t); og.gain.linearRampToValueAtTime(kind === 'dark' ? .22 : .1, t + 3); o.connect(og); og.connect(amb); o.start(); ambNodes.push(o, og);
      const dr = setInterval(() => { if (ac.state === 'running' && Math.random() < .35) SFX.drip(); }, 900); ambNodes.push({stop(){ clearInterval(dr); }});
      if (kind === 'dark') { const wh = setInterval(() => { if (ac.state === 'running' && Math.random() < .3) tone(f(R(7), 2) * 2, {type:'sine', a:.6, d:1.4, v:.04, bus:amb, detune:R(30)-15}); }, 2200); ambNodes.push({stop(){ clearInterval(wh); }}); }
    }
  }
  /* generative music */
  function stopMusic(){ if (schedTimer) clearInterval(schedTimer); schedTimer = null; musicNodes.forEach(n => { try { n.stop(); } catch(e) {} }); musicNodes = []; }
  const MOTIFS = [[0,-1,0,2],[4,3,1,0],[7,5,4,3],[0,3,4,7],[2,1,0,-3],[4,7,8,7],[0,0,3,2],[7,8,10,7]];
  let motif = 0, mi = 0, padUntil = 0;
  function pad(t, degs, dur, v){
    degs.forEach(d => { const o = ac.createOscillator(), o2 = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain();
      o.type = 'sawtooth'; o2.type = 'sawtooth'; o.frequency.value = f(d, 0); o2.frequency.value = f(d, 0); o2.detune.value = 7; fl.type = 'lowpass'; fl.frequency.value = 380; fl.Q.value = .7;
      o.connect(fl); o2.connect(fl); fl.connect(g); g.connect(mus); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + dur*.4); g.gain.linearRampToValueAtTime(0, t + dur);
      o.start(t); o2.start(t); o.stop(t + dur + .1); o2.stop(t + dur + .1); musicNodes.push(o, o2); });
  }
  function sched(){
    const look = now() + .6, bpm = scene === 'battle' ? 96 : scene === 'title' ? 54 : 62, bl = 60 / bpm;
    while (nextBeat < look) {
      const t = nextBeat, b = beat;
      if (t >= padUntil) { const prog = scene === 'battle' ? [[0,4],[1,5],[0,3],[-2,1]] : [[0,4],[0,3],[-2,2],[-1,3]]; const ch = prog[Math.floor(b / 8) % prog.length]; pad(t, ch, bl * 8 + .3, scene === 'battle' ? .09 : .07); padUntil = t + bl * 8; }
      if (scene === 'battle') {
        if (b % 4 === 0 || b % 8 === 6) tone(52, {t, d:.3, v:.6, slide:28, bus:mus});
        if (b % 4 === 2) noise({t, d:.12, v:.18, f:220, type:'lowpass', bus:mus, brown:true});
        if (b % 2 === 1 && Math.random() < .6) tone(f(MOTIFS[motif][mi], 1), {t, type:'square', a:.01, d:bl*.9, v:.05, filt:{f:700, q:2}, bus:mus});
      } else {
        const sparse = scene === 'title' ? .55 : scene === 'end' ? .5 : .35;
        if (b % 2 === 0 && Math.random() < sparse) { const d = MOTIFS[motif][mi]; tone(f(d, 2), {t, type:'triangle', a:.08, d:bl*2.2, v:.11, bus:mus}); tone(f(d, 2), {t:t+.02, type:'sine', a:.1, d:bl*2.2, v:.06, bus:mus, detune:6}); }
        if (scene === 'end' && b % 8 === 4) tone(f(0, 1), {t, type:'sine', a:.3, d:bl*3, v:.1, bus:mus});
        if (scene !== 'title' && b % 16 === 12) tone(f(-7, 1), {t, type:'sine', a:.05, d:1.6, v:.14, bus:mus}); // distant bell
      }
      if (b % 2 === 1) { mi++; if (mi >= 4) { mi = 0; if (Math.random() < .5) motif = R(MOTIFS.length); } }
      nextBeat += bl; beat++;
    }
  }
  function setScene(s, force){
    if (s === scene && !force) return; scene = s;
    if (!ac || ac.state !== 'running') return;
    stopMusic(); nextBeat = now() + .1; beat = 0; padUntil = 0;
    startAmb({title:'title', explore:'wind', tunnel:'tunnel', battle:'tunnel', dark:'dark', end:'wind'}[s] || 'wind');
    if (s === 'dark') scene = 'battle';
    schedTimer = setInterval(sched, 200); sched();
  }
  document.addEventListener('visibilitychange', () => { if (!ac) return; if (document.hidden) ac.suspend(); else ac.resume(); });
  return {unlock, play, setScene, applyVolumes, get ready(){ return !!ac && ac.state === 'running'; }};
})();
['pointerdown','keydown'].forEach(ev => window.addEventListener(ev, () => AUDIO.unlock(), {passive:true}));
