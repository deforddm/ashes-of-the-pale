/* ============ settings ============ */
function openSettings(){
  const m = $('#settings'); m.hidden = false;
  const range = (k, label, small) => `<div class="opt"><label for="s_${k}">${label}</label><span class="stat" id="v_${k}">${Math.round(SET[k]*100)}%</span><input type="range" id="s_${k}" min="0" max="1" step=".05" value="${SET[k]}">${small ? `<small>${small}</small>` : ''}</div>`;
  const seg = (k, label, opts, small) => `<div class="opt"><label>${label}</label><div class="seg">${opts.map(([v,l]) => `<button class="btn ${String(SET[k]) === String(v) ? 'on' : ''}" data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div>${small ? `<small>${small}</small>` : ''}</div>`;
  m.innerHTML = `<div class="mbox"><div class="row" style="justify-content:space-between;align-items:center;margin-bottom:12px"><h2 class="m">Settings</h2><button class="btn" id="sClose">Close</button></div>
    <div class="set">
      ${range('master', 'Master volume')}${range('music', 'Music', 'A slow score in D Phrygian, generated as you play. Changes with the scene.')}${range('sfx', 'Sound effects')}${range('amb', 'Ambience', 'Wind over the ruins, the camp at night, the city, the Fete, the lake, dripping stone.')}
      ${seg('shake', 'Screen shake', [[true,'On'],[false,'Off']])}
      ${seg('blood', 'Blood', [[true,'On'],[false,'Off']], 'Wounds leave marks on the ground where they fall.')}
      ${seg('motion', 'Motion', [['auto','System'],['on','Full'],['off','Reduced']], 'Reduced motion shortens animations and the card reading.')}
      ${seg('map', 'Map', [['close','Close'],['whole','Whole']], WIDE() ? 'On a screen this wide the whole map always fits, as big as the window allows. On a phone, Close has bigger tiles that follow the sergeant; Whole has the entire area on screen at once.' : 'Close: bigger tiles that follow the sergeant; drag the map to look around. Whole: the entire area on screen at once.')}
      ${seg('speed', 'Combat pace', [[1.4,'Slow'],[1,'Normal'],[.6,'Fast']])}
      ${seg('fs', 'Text size', [[.9,'Small'],[1,'Normal'],[1.15,'Large']])}
      ${seg('dice', 'Roll numbers', [[true,'On'],[false,'Off']], 'Print every attack and check roll in the log.')}
      ${FINE() ? `<div class="opt keyhelp"><label>Keyboard</label><small><b>Talking</b> <kbd>1</kbd>–<kbd>9</kbd> pick a choice · <kbd>Space</kbd> takes the only one, or hurries the die<br>
        <b>The map</b> <kbd>←</kbd><kbd>↑</kbd><kbd>→</kbd><kbd>↓</kbd> or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> walk · <kbd>Space</kbd> or <kbd>E</kbd> talk to whoever is beside you<br>
        <b>A fight</b> <kbd>1</kbd>–<kbd>9</kbd> abilities · <kbd>Space</kbd> or <kbd>E</kbd> end the turn · <kbd>Esc</kbd> drop an aimed ability<br>
        <b>Anywhere</b> <kbd>J</kbd> journal · <kbd>P</kbd> pack · <kbd>C</kbd> squad · <kbd>Esc</kbd> settings, or close what's open · <kbd>Enter</kbd> the page's main button</small></div>` : ''}
      ${installWay() === 'prompt' ? `<div class="opt"><label>${FINE() ? 'Desktop app' : 'Install'}</label><button class="btn" id="sInst">Install as an app</button><small>${FINE() ? 'Its own window with no browser bars, and a shortcut on your desktop and taskbar. Your sergeants come with it.' : 'On your home screen, full screen, and it works offline.'}</small></div>`
        : installWay() === 'dock' ? `<div class="opt"><label>Mac app</label><small>In Safari's menu bar: File \u203a Add to Dock. The Dock app keeps its own saves: copy your sergeant's save code first (Squad \u203a Save) and load it there.</small></div>` : ''}
      ${S || roster().list.length ? `<div class="opt"><label>This device</label><button class="btn" id="sReset">${S ? `Erase Sergeant ${esc(S.name)}` : 'Erase every sergeant'}</button><small>${S ? 'Only this sergeant\'s save. Anyone else on this device keeps theirs.' : 'Every sergeant saved on this device.'} Settings are kept separately and survive this. v${VERSION}</small></div>` : `<div class="opt"><small>v${VERSION}</small></div>`}
    </div></div>`;
  ['master','music','sfx','amb'].forEach(k => { const el = $('#s_' + k); el.oninput = () => { SET[k] = +el.value; $('#v_' + k).textContent = Math.round(SET[k]*100) + '%'; saveSet(); }; el.onchange = () => AUDIO.play(k === 'music' ? 'heal' : 'click'); });
  m.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = b.dataset.k, v = b.dataset.v; SET[k] = v === 'true' ? true : v === 'false' ? false : isNaN(+v) ? v : +v; saveSet(); AUDIO.play('click'); openSettings(); if (view === 'explore' && (k === 'map' || k === 'fs')) { fitCanvas(ACOLS(), AROWS()); mapBtn(); } });
  if ($('#sInst')) $('#sInst').onclick = async () => { AUDIO.play('click'); const ok = await runInstall(); const b = $('#sInst'); if (b) { b.disabled = true; b.textContent = ok ? 'Installed' : 'Maybe later'; } };
  if ($('#sReset')) $('#sReset').onclick = () => { const b = $('#sReset'); AUDIO.play('click');
    if (b.dataset.arm) { if (S) dropSlot(S.sid); else roster().list.forEach(e => dropSlot(e.id)); S = null; m.hidden = true; m.innerHTML = ''; showTitle(); }
    else { b.textContent = tapWord('Tap again to erase'); b.classList.add('warn'); b.dataset.arm = 1; } };
  $('#sClose').onclick = () => { AUDIO.play('click'); m.hidden = true; m.innerHTML = ''; };
  m.onclick = e => { if (e.target === m) { m.hidden = true; m.innerHTML = ''; } };
}

