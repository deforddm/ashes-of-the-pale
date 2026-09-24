/* ============ settings ============ */
const SKEY = 'ashes-of-the-pale-settings';
const SET = Object.assign({master:.8, music:.6, sfx:.8, amb:.6, shake:true, motion:'auto', fs:1, speed:1, dice:true, blood:true, map:'close'},
  (() => { try { return JSON.parse(localStorage.getItem(SKEY)) || {}; } catch(e) { return {}; } })());
function saveSet(){ try { localStorage.setItem(SKEY, JSON.stringify(SET)); } catch(e) {} applySet(); }
function applySet(){
  document.documentElement.style.setProperty('--fs', SET.fs);
  document.body.classList.toggle('reduce', SET.motion === 'off');
  document.body.classList.toggle('auto-motion', SET.motion === 'auto');
  AUDIO.applyVolumes();
}
const REDUCE = () => SET.motion === 'off' || (SET.motion === 'auto' && matchMedia('(prefers-reduced-motion: reduce)').matches);

