/* The service worker. A new version installs and waits; the page offers it ("Update ready") and only reloads when
   the player taps. The first install never reloads anything, and a version activated from another tab leaves this
   page alone (it keeps running the code it loaded with). */
if ('serviceWorker' in navigator) {
  let wantReload = false, lastCheck = 0;
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(reg => {
    const offer = () => { if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg); };
    offer(); // installed on an earlier visit and still waiting
    reg.addEventListener('updatefound', () => { const nw = reg.installing; nw && nw.addEventListener('statechange', () => { if (nw.state === 'installed') offer(); }); });
    // an installed app can stay open for days: look for a new version when it comes back to the front
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && Date.now() - lastCheck > 60000) { lastCheck = Date.now(); reg.update().catch(() => {}); } });
  }).catch(() => {}));
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!wantReload) return; wantReload = false; location.reload(); });
  window.swUpdateNow = reg => { wantReload = true; if (S) save();
    if (reg.waiting) { reg.waiting.postMessage('skip'); setTimeout(() => { if (wantReload) location.reload(); }, 4000); } // the fallback, if the new version is slow to take over
    else location.reload(); };
}
/* the update pill: top of the screen, clear of the notch, with a × to put it off until the next launch.
   In a fight it asks twice, since a reload starts the fight over. */
function showUpdate(reg){
  if ($('#upd')) return;
  const w = document.createElement('div'); w.id = 'upd'; w.className = 'upd'; w.setAttribute('role', 'status');
  w.innerHTML = `<button class="btn primary" id="updGo">Update ready · tap to reload</button><button class="btn icon" id="updX" aria-label="Not now">×</button>`;
  document.body.appendChild(w);
  const b = $('#updGo');
  b.onclick = () => { if (view === 'battle' && !b.dataset.arm) { b.dataset.arm = 1; b.textContent = 'The fight starts over · tap again'; return; }
    b.disabled = true; b.textContent = 'Updating…'; window.swUpdateNow(reg); };
  $('#updX').onclick = () => w.remove();
}
