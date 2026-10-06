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

/* the full-screen viewer: one picture (a map) or a whole board from the canvas */
function artView(what){
  let v = $('#artview'); if (!v) { v = document.createElement('div'); v.id = 'artview'; document.body.appendChild(v); }
  const B0 = typeof what === 'object' ? what : null;
  v.innerHTML = `<div class="avbar"><span>${esc(B0 ? B0.title : what.startsWith('map/') ? 'Map' : '')}</span><span class="avbtns"><button class="btn" id="avZoom">Full size</button><button class="btn" id="avClose">Close</button></span></div><div class="avbody">${B0
    ? `<div class="avboard" style="--bw:${B0.w};--bh:${B0.h}"><iframe title="${esc(B0.title)}" sandbox="allow-same-origin" loading="lazy"></iframe></div>`
    : art(what, 'avpic', true)}</div>`;
  v.hidden = false; artCssOnce();
  if (B0) { const fr = v.querySelector('iframe'); fr.srcdoc = B0.html; const fit = () => { const box = v.querySelector('.avboard'); if (!box || $('#avZoom').dataset.z) return; const k = Math.min(1, (v.clientWidth - 24) / B0.w); box.style.setProperty('--k', k); }; fit(); v._fit = fit; window.addEventListener('resize', fit); }
  const zb = $('#avZoom'); zb.onclick = () => { AUDIO.play('click'); const z = zb.dataset.z = zb.dataset.z ? '' : '1'; zb.textContent = z ? 'Fit to screen' : 'Full size';
    const pic = v.querySelector('.avpic'); if (pic) pic.classList.toggle('zoom', !!z);
    const box = v.querySelector('.avboard'); if (box) box.style.setProperty('--k', z ? 1 : Math.min(1, (v.clientWidth - 24) / B0.w));
    v.querySelector('.avbody').classList.toggle('zoomed', !!z); };
  const close = () => { AUDIO.play('click'); v.hidden = true; v.innerHTML = ''; if (v._fit) window.removeEventListener('resize', v._fit); v._fit = null; };
  $('#avClose').onclick = close; v.onclick = e => { if (e.target === v || e.target.classList.contains('avbody')) close(); };
  $('#avClose').focus();
}
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

/* the Art tab: every board on the canvas, the ones past where you have read kept back */
const ART_THUMB = {Main:'title/key', Squad:'squad/tuft', Deck:'deck/hounds', Patrons:'patrons/tuft', Chapters:'chapters/1', Arms:'item/barrowflint', Trinkets:'item/fetemask', Munitions:'munitions/cusser',
  Papers:'papers/seal', Insignia:'insignia/patch', Vistas:'vistas/lake', MapGenabackis:'map/genabackis', MapDaru:'map/daru', MapPale:'map/pale', MapGadrobi:'map/gadrobi',
  Cast:'cast/whiskeyjack', Originals:'originals/pell_the_mule', Motifs:'motifs/five_tally_marks_struck_through', Roads:'roads/disband'};
function artTabHTML(){
  const r = artReach(), open = ART_BOARDS.filter(b => b.spoil <= r).length;
  return `<p class="fine">The painted set: every picture made for the Fourth, as boards. Tap one to see it whole. ${open < ART_BOARDS.length ? 'Boards that give away what is still ahead wait until you get there.' : ''}</p>
    <div class="agal">${ART_BOARDS.map((b, i) => { const ok = b.spoil <= r;
      return `<button class="aboard ${ok ? '' : 'locked'}" ${ok ? `data-board="${i}"` : 'disabled'}>${ok ? art(ART_THUMB[b.id], 'thumb', true) : '<span class="art thumb lock" aria-hidden="true"></span>'}<b>${esc(b.title)}</b><small>${ok ? `${b.w} × ${b.h}` : `After ${chWord(Math.min(b.spoil, 7))}`}</small></button>`; }).join('')}</div>
    <p class="fine">Settings › Artwork switches the game between this painted set and its original drawings.</p>`;
}
function bindArtTab(m){ m.querySelectorAll('[data-board]').forEach(b => b.onclick = () => { AUDIO.play('flip'); artView(ART_BOARDS[+b.dataset.board]); }); }

/* the chapter-end backdrop where the canvas has a vista for it */
const ART_ENDVISTA = {2:'vistas/lake', 3:'vistas/canal', 5:'vistas/barrow'};
function artScene(key, cap){ return `<div class="scene artscene">${art(key, 'vista').replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ')}${cap ? `<div class="cap">${cap}</div>` : ''}</div>`; }
/* the viewer owns the keyboard while it is open: Esc closes it, nothing else reaches the game */
window.addEventListener('keydown', e => { if (!artViewOpen()) return; e.stopImmediatePropagation(); if (e.key === 'Escape') { e.preventDefault(); $('#avClose').click(); } }, true);
artWarm();
