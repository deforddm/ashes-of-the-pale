/* ============ the artwork canvas in play ============
   ART (19c, generated) holds the pictures; this file puts them on screen. Settings › Artwork switches between the
   painted set (default) and the game's original drawings, which every hook falls back to. */
const ARTON = () => SET.art !== false;
let artCssDone = false;
function artCssOnce(){ if (artCssDone) return; artCssDone = true; const st = document.createElement('style'); st.id = 'artcss'; st.textContent = ART_CSS; document.head.appendChild(st); }
/* inline picture (keeps its animation); '' when the setting is Classic or the picture does not exist. always: ignore the setting */
function art(key, cls = '', always = false){ const s = ART[key]; if (!s || (!always && !ARTON())) return ''; artCssOnce(); return `<span class="art ${cls}" aria-hidden="true">${s}</span>`; }
/* the same picture as an Image, for drawing on a canvas (a still frame); null until it has loaded */
const artImgs = {};
function artImg(key){ if (!ARTON() || !ART[key]) return null; let im = artImgs[key];
  if (!im) { const [w, h] = ART_SIZE[key]; im = artImgs[key] = new Image(); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(ART[key].replace('<svg ', `<svg width="${w}" height="${h}" `)); }
  return im.complete && im.naturalWidth ? im : null; }
function artCover(ctx, im, x, y, w, h){ const s = Math.max(w / im.naturalWidth, h / im.naturalHeight), iw = im.naturalWidth * s, ih = im.naturalHeight * s;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih); ctx.restore(); }
function artWarm(){ Object.keys(ART).filter(k => k.startsWith('deck/')).forEach(artImg); }

/* how far this player has read: a finished book (any sergeant on the title) unlocks everything */
function artReach(){ if (S) return S.chapters && S.chapters[7] != null ? 8 : (S.chapter || 0);
  return roster().list.reduce((m, e) => Math.max(m, e.done ? 8 : (e.ch || 0)), 0); }
const ROMAN = ['Prologue', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const chWord = n => n === 0 ? 'the prologue' : `Chapter ${ROMAN[n] || n}`;

/* the full-screen viewer: one picture (a map), large, with Full size for a closer look */
function avShell(){ let v = $('#artview'); if (!v) { v = document.createElement('div'); v.id = 'artview'; document.body.appendChild(v); } return v; }
function avBind(v){
  const close = () => { AUDIO.play('click'); v.hidden = true; v.innerHTML = ''; };
  $('#avClose').onclick = close; v.onclick = e => { if (e.target === v || e.target.classList.contains('avbody')) close(); };
  $('#avClose').focus();
}
function artView(what){
  const v = avShell(); v.classList.remove('iv');
  v.innerHTML = `<div class="avbar"><span>${what.startsWith('map/') ? 'Map' : ''}</span><span class="avbtns"><button class="btn" id="avZoom">Full size</button><button class="btn" id="avClose">Close</button></span></div><div class="avbody">${art(what, 'avpic', true)}</div>`;
  v.hidden = false; artCssOnce();
  const zb = $('#avZoom'); zb.onclick = () => { AUDIO.play('click'); const z = zb.dataset.z = zb.dataset.z ? '' : '1'; zb.textContent = z ? 'Fit to screen' : 'Full size';
    const pic = v.querySelector('.avpic'); if (pic) pic.classList.toggle('zoom', !!z); v.querySelector('.avbody').classList.toggle('zoomed', !!z); };
  avBind(v);
}

/* an item, full screen: its picture large, and everything the game knows about it.
   Gear (item/*), munitions (munitions/*) and each squadmate's keepsakes (munitions/keep_*), tapped wherever they are drawn. */
const MUNI = {
  sharper:['Sharper', 'Moranth munition · thrown', 'A clay egg the size of a fist that breaks into a hundred knives. Kettle counts them the way priests count prayers.'],
  burner:['Burner', 'Moranth munition · thrown', 'Liquid fire in a waxed clay jar, and the ground goes on burning after. Strapped down whenever there is otataral about, and nobody stands downwind.'],
  cusser:['Cusser', 'Moranth munition · the crossbow cradle', 'The big one. Fired from the cradle under Kettle\'s crossbow, never thrown by anyone who wants to keep the arm. Chub\'s is called Maud, and Kettle keeps her out of ordinary fights.'],
  smoker:['Smoker', 'Moranth munition · from Hedge\'s cellar', 'A grey jar that blooms into a wall. Nothing shoots into the smoke, and nothing shoots out of it.'],
  acid:['Phial of acid', 'Sapper\'s timer', 'Stoppered, carried upright, with a tin of tallow for the wax plugs. The acid eats the wax, the wax lets go, the charge goes. No fuse-cord to smell.'],
  salve:['Healing salve', 'Field dressing · anyone can apply it', 'A tin of salve and a clean binding. One in the pack at the start, more from Quartermaster Pell, and one found each chapter from the Rhivi Plain on. Ellis rations her own, for the hand.'],
};
function itemInfo(key){
  const [kind, id] = String(key).split('/');
  if (kind === 'item' && ITEMS[id]) { const it = ITEMS[id];
    const ch = Object.keys(CHAPTERS).find(n => CHAPTERS[n].gear && CHAPTERS[n].gear[id]);
    const stats = [it.ac && `armour +${it.ac}`, it.atk && `hit +${it.atk}`, it.hp && `health +${it.hp}`, it.mv && `move +${it.mv}`, it.rng && `reach +${it.rng}`,
      it.stat && Object.entries(it.stat).map(([k, v]) => `${k[0].toUpperCase() + k.slice(1)} +${v}`).join(' · ')].filter(Boolean).join(' · ');
    const who = it.who ? it.who.map(w => w === 'sgt' ? 'the sergeant' : TPL[w].name) : null;
    return {name: it.name, kicker: `${it.slot[0].toUpperCase() + it.slot.slice(1)}${ch != null ? ` · found in ${chWord(+ch)}` : ''}`, stat: stats, text: it.line,
      who: who ? `Can be used by ${who.length > 1 ? who.slice(0, -1).join(', ') + ' and ' + who[who.length - 1] : who[0]}.` : 'Anyone in the squad can use it.'}; }
  if (kind === 'munitions' && id.startsWith('keep_')) { const w = id.slice(5), c = TPL[w]; if (!c) return null;
    const nm = w === 'sgt' ? (S && S.name ? `Sergeant ${S.name}` : 'The sergeant') : c.name;
    return {name: `What ${nm} carries`, kicker: 'Keepsakes · never sold, never traded', stat: '', text: c.gear.join('. ') + '.', who: c.quest || ''}; }
  if (kind === 'munitions' && MUNI[id]) { const [name, kicker, text] = MUNI[id]; const n = S && S.inv && S.inv[id] != null ? S.inv[id] : null;
    let mech = ''; try { const a = AB[id]; if (a && a.desc) mech = a.desc(); } catch(e) {}
    return {name, kicker, stat: n != null ? `In the pack: ${n}` : '', text, who: mech}; }
  return null;
}
function itemView(key){
  const I = itemInfo(key); if (!I || !ART[key]) return;
  const v = avShell();
  v.innerHTML = smartq(`<div class="avbar"><span>${esc(I.kicker)}</span><span class="avbtns"><button class="btn" id="avClose">Close</button></span></div>
    <div class="avbody"><div class="ivbox">${art(key, 'ivpic', true)}<div class="ivtext"><h3>${esc(I.name)}</h3>${I.stat ? `<p class="ivstat">${esc(I.stat)}</p>` : ''}<p class="ivline">${esc(I.text)}</p>${I.who ? `<p class="ivwho">${esc(I.who)}</p>` : ''}</div></div></div>`);
  v.classList.add('iv'); v.hidden = false; artCssOnce(); avBind(v);
}
/* a picture you can tap to see it whole: a plain picture when there is nothing more to show (or the Classic set is on) */
function zoomArt(key, cls = '', label = '', withLabel = false){
  const a = art(key, cls), I = a ? itemInfo(key) : null;
  if (!I) return a + (withLabel ? label : '');
  return `<button type="button" class="izb${withLabel ? ' izrow' : ''}" data-iz="${key}" aria-label="Look at ${esc(label || I.name)}">${a}${withLabel ? `<span>${label}</span>` : ''}</button>`;
}
function bindItemZoom(m){ m.querySelectorAll('[data-iz]').forEach(b => b.onclick = e => { e.stopPropagation(); AUDIO.play('flip'); itemView(b.dataset.iz); }); }
const artViewOpen = () => { const v = $('#artview'); return !!(v && !v.hidden); };

/* the journal's pictures: maps the Fourth has walked, the papers it has seen, and the faces it has met */
const ART_MAPS = [['map/pale', 'Pale under the Spawn', 0, 'A sapper’s sketch of the ruins and the Host’s camp.'], ['map/genabackis', 'Genabackis', 2, 'The road from Pale to the city of blue fire.'],
  ['map/daru', 'Darujhistan', 3, 'The city, pinned where the Fourth has been.'], ['map/gadrobi', 'The Gadrobi Hills', 5, 'The ridge, the barrow, and the Adjunct’s camp.']];
function artJournalHTML(){
  if (!ARTON() || !S) return '';
  const r = artReach(), maps = ART_MAPS.filter(m => m[2] <= r);
  const faces = Object.keys(ART_META).filter(k => (k.startsWith('cast/') || k.startsWith('originals/')) && ART_META[k].ch <= Math.min(r, 7) && (ART_META[k].ch < 7 || r >= 7));
  const papers = [r >= 3 ? 'file' : '', r >= 7 ? 'rations' : ''].filter(Boolean);
  return `${maps.length ? `<h4 class="jh">Maps</h4><div class="jmaps">${maps.map(([k, t, , d]) => `<button class="jmap" data-map="${k}">${art(k, 'thumb')}<b>${t}</b><small>${d}</small></button>`).join('')}</div>` : ''}
    ${papers.length ? `<h4 class="jh">Papers</h4><div class="jpapers">${papers.map(k => `<div class="paper p-${k}">${ART['paper/' + k]}</div>`).join('')}</div>` : ''}
    ${faces.length ? `<details class="gloss faces"><summary>Faces on the road <small>${faces.length}</small></summary><div class="jfaces">${faces.map(k => { const L = ART_META[k].lines;
      return `<div class="face">${art(k, 'med')}<b>${esc(L[0])}</b><small>${esc(L[1] || '')}</small><i>${esc(L[L.length - 1] || '')}</i></div>`; }).join('')}</div></details>` : ''}`;
}
function bindArtJournal(m){ m.querySelectorAll('[data-map]').forEach(b => b.onclick = () => { AUDIO.play('flip'); artView(b.dataset.map); }); }

/* the chapter-end backdrop where the canvas has a vista for it */
const ART_ENDVISTA = {2:'vistas/lake', 3:'vistas/canal', 5:'vistas/barrow'};
function artScene(key, cap){ return `<div class="scene artscene">${art(key, 'vista').replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ')}${cap ? `<div class="cap">${cap}</div>` : ''}</div>`; }
/* the viewer owns the keyboard while it is open: Esc closes it, nothing else reaches the game */
window.addEventListener('keydown', e => { if (!artViewOpen()) return; e.stopImmediatePropagation(); if (e.key === 'Escape') { e.preventDefault(); $('#avClose').click(); } }, true);
artWarm();
