/* ============ hud ============ */
function hudButtons(){ return `<button class="btn" id="bSquad">Squad</button><button class="btn icon" id="bSet" aria-label="Settings">${GEAR}</button>`; }
function bindHud(){ const a = $('#bSquad'), b = $('#bSet'); if (a) a.onclick = () => { AUDIO.play('click'); openChars(0); }; if (b) b.onclick = () => { AUDIO.play('click'); openSettings(); }; }

