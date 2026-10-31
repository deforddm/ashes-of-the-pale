/* ============ backups (v4.10.0, ported from From the Ranks v8.2.0) ============
   Every save lives in the browser's storage for this site, and "clear browsing data" wipes it with everything else.
   The only thing that survives that is a copy kept somewhere else: a backup file (every sergeant, the settings, the
   deeds seen) saved to the phone or sent on to Drive or mail, or a save code copied out. This file makes both easy
   and reminds the player when a backup is overdue. It never changes what a save holds. */
const BKEY = 'ashes-of-the-pale-backup'; // {at: ms, n: progress at that backup}
function backupMark(){ let m = null; try { m = JSON.parse(localStorage.getItem(BKEY)); } catch(e) {} return m && m.at ? m : null; }
/* how far the device has come: every sergeant's chapter count. Three chapters past the last backup is overdue. */
function backupProgress(list){ return (list || roster().list).reduce((n, e) => n + 1 + (e.ch || 0) + (e.done ? 1 : 0), 0); }
function backupDue(){ const list = roster().list; if (!list.length) return false; const m = backupMark(); const p = backupProgress(list);
  if (!m) return p >= 2; return p - (m.n || 0) >= 3; }
function markBackup(){ try { localStorage.setItem(BKEY, JSON.stringify({at:Date.now(), n:backupProgress()})); } catch(e) {} }
/* the file: every sergeant's whole save, the settings, the version seen. Plain JSON, so it can be read with any editor if it ever has to be. */
function backupData(){ if (S) save();
  const sgts = roster().list.map(e => loadSlot(e.id)).filter(Boolean);
  let seen = null; try { seen = localStorage.getItem(SEENKEY); } catch(e) {}
  return {ftr:1, game:'ashes', v:VERSION, at:new Date().toISOString(), sergeants:sgts, settings:typeof SET !== 'undefined' ? SET : null, seen}; }
const backupText = () => JSON.stringify(backupData());
const backupName = () => `ashes-of-the-pale-saves-${new Date().toISOString().slice(0, 10)}.json`;
function backupFile(){ return new File([backupText()], backupName(), {type:'application/json'}); }
/* download: a Blob link. On a phone this lands in Downloads (Android) or asks where to put it (iPhone: Files). */
function downloadBackup(){ try { const f = backupFile(), u = URL.createObjectURL(f), a = document.createElement('a'); a.href = u; a.download = f.name; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 60000); markBackup(); return true; } catch(e) { return false; } }
/* share: the phone's own share sheet (Drive, mail, Files, another device), where the browser has one that takes files */
function canShareBackup(){ try { return !!(navigator.share && navigator.canShare && navigator.canShare({files:[new File(['x'], 'x.json', {type:'application/json'})]})); } catch(e) { return false; } }
function shareBackup(){ try { return navigator.share({files:[backupFile()], title:'Ashes of the Pale saves'}).then(() => { markBackup(); return true; }, () => false); } catch(e) { return Promise.resolve(false); } }
/* restore: a backup file, or a single save code, or a single save pasted as text. Returns what it found, never writes. */
function parseBackup(text){ const t = String(text || '').trim(); if (!t) return null; let o = null;
  try { o = JSON.parse(t); } catch(e) { try { o = JSON.parse(decodeURIComponent(escape(atob(t)))); } catch(e2) { return null; } }
  if (o && o.ftr === 1 && Array.isArray(o.sergeants)) return {sergeants:o.sergeants.filter(s => s && s.v === 1), settings:o.settings && typeof o.settings === 'object' ? o.settings : null, seen:o.seen || null, at:o.at || null};
  if (o && o.v === 1) return {sergeants:[o], settings:null, seen:null, at:null};
  return null; }
/* which sergeants in a backup would replace one already here (same name) */
function backupClashes(b){ const list = roster().list; return b.sergeants.filter(s => list.find(e => sameName(e.name, s.name))).map(s => String(s.name || 'Hask').slice(0, 18)); }
function restoreBackup(b){ let n = 0;
  for (const raw of b.sergeants) { if (raw && raw.book && raw.book !== 'gotm') continue; /* Ashes is Book One only; later books live in From the Ranks */ let s; try { s = migrate(JSON.parse(JSON.stringify(raw))); } catch(e) { continue; }
    s.name = String(s.name || 'Hask').slice(0, 18); const ex = roster().list.find(e => sameName(e.name, s.name)); s.sid = ex ? ex.id : newSid();
    try { localStorage.setItem(slotKey(s.sid), JSON.stringify(s)); const r = roster(); r.list = [rosterMeta(s), ...r.list.filter(e => e.id !== s.sid)]; localStorage.setItem(RKEY, JSON.stringify(r)); n++; } catch(e) {} }
  if (b.settings && typeof SET !== 'undefined') { try { Object.assign(SET, b.settings); saveSet(); } catch(e) {} }
  if (b.seen) { try { if (!localStorage.getItem(SEENKEY)) localStorage.setItem(SEENKEY, b.seen); } catch(e) {} }
  if (n) markBackup(); // what was just restored is, by definition, backed up
  return n; }
/* the reminder line: on the title under the roster and on every chapter's end page */
function backupLine(){ const m = backupMark(), due = backupDue(); if (!roster().list.length) return '';
  const when = m ? `Last backed up ${agoText(m.at) || 'today'}.` : 'Never backed up.';
  return `<div class="bkline ${due ? 'due' : ''}" role="status"><span class="fine">${when} ${due ? 'Clearing the browser\'s data erases every save on this device; a backup file does not.' : ''}</span><button class="btn sm" id="bBk">${due ? 'Back up saves' : 'Backups'}</button></div>`; }
function bindBackupLine(){ const b = document.getElementById('bBk'); if (b) b.onclick = () => { AUDIO.play('click'); openModal('save'); }; }
/* ask the browser to keep this site's storage out of its automatic clean-ups (it still goes when the player clears data by hand) */
let persistAsked = false;
function askPersist(){ if (persistAsked) return; persistAsked = true; try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch(e) {} }
