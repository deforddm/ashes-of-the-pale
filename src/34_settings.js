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
      ${seg('map', 'Map', [['close','Close'],['whole','Whole']], 'Close: bigger tiles that follow the sergeant; drag the map to look around. Whole: the entire area on screen at once.')}
      ${seg('speed', 'Combat pace', [[1.4,'Slow'],[1,'Normal'],[.6,'Fast']])}
      ${seg('fs', 'Text size', [[.9,'Small'],[1,'Normal'],[1.15,'Large']])}
      ${seg('dice', 'Roll numbers', [[true,'On'],[false,'Off']], 'Print every attack and check roll in the log.')}
      ${S || roster().list.length ? `<div class="opt"><label>This device</label><button class="btn" id="sReset">${S ? `Erase Sergeant ${esc(S.name)}` : 'Erase every sergeant'}</button><small>${S ? 'Only this sergeant\'s save. Anyone else on this device keeps theirs.' : 'Every sergeant saved on this device.'} Settings are kept separately and survive this. v${VERSION}</small></div>` : `<div class="opt"><small>v${VERSION}</small></div>`}
    </div></div>`;
  ['master','music','sfx','amb'].forEach(k => { const el = $('#s_' + k); el.oninput = () => { SET[k] = +el.value; $('#v_' + k).textContent = Math.round(SET[k]*100) + '%'; saveSet(); }; el.onchange = () => AUDIO.play(k === 'music' ? 'heal' : 'click'); });
  m.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { const k = b.dataset.k, v = b.dataset.v; SET[k] = v === 'true' ? true : v === 'false' ? false : isNaN(+v) ? v : +v; saveSet(); AUDIO.play('click'); openSettings(); if (view === 'explore' && (k === 'map' || k === 'fs')) { fitCanvas(ACOLS(), AROWS()); mapBtn(); } });
  if ($('#sReset')) $('#sReset').onclick = () => { const b = $('#sReset'); AUDIO.play('click');
    if (b.dataset.arm) { if (S) dropSlot(S.sid); else roster().list.forEach(e => dropSlot(e.id)); S = null; m.hidden = true; m.innerHTML = ''; showTitle(); }
    else { b.textContent = 'Tap again to erase'; b.classList.add('warn'); b.dataset.arm = 1; } };
  $('#sClose').onclick = () => { AUDIO.play('click'); m.hidden = true; m.innerHTML = ''; };
  m.onclick = e => { if (e.target === m) { m.hidden = true; m.innerHTML = ''; } };
}

