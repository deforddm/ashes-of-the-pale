if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => { const nw = reg.installing; nw && nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdate(reg); }); });
  }).catch(()=>{}));
  navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
}
function showUpdate(reg){ const b = document.createElement('button'); b.className = 'btn primary'; b.textContent = 'Update available · tap to reload'; b.style.cssText = 'position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:60;box-shadow:0 8px 30px rgba(0,0,0,.8)';
  b.onclick = () => { reg.waiting ? reg.waiting.postMessage('skip') : location.reload(); }; document.body.appendChild(b); }
