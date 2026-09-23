/* ============ title / intro ============ */
function showTitle(){
  view = 'title'; const has = loadSave(); B = null; AUDIO.setScene('title');
  $('#app').innerHTML = `<canvas id="titlecv" aria-hidden="true"></canvas><div id="title" class="title">
    <h1>Ashes<span>of the Pale</span></h1>
    <p class="tag">Onearm's Host holds the ruins. Five marines are sent below them, and then south.</p>
    <div class="field"><label for="nm">Your sergeant's name</label><input type="text" id="nm" maxlength="18" value="${esc(has?.name || 'Hask')}" autocomplete="off"></div>
    <div class="row"><button class="btn primary" id="bNew">Begin</button>${has ? '<button class="btn" id="bCont">Continue</button>' : ''}<button class="btn" id="bImp">Load a save code</button><button class="btn icon" id="bSet" aria-label="Settings">${GEAR}</button></div>
    <p class="fine">A Malazan fan tale for personal play. The world and its canon characters belong to Steven Erikson. Gardens of the Moon, from the ranks: the prologue and all seven chapters. Sound on for the full effect. · v${VERSION}</p></div>`;
  startTitleBackdrop($('#titlecv'));
  $('#bNew').onclick = () => { AUDIO.play('click'); S = newState($('#nm').value.trim()); save(); showIntro(); };
  if (has) $('#bCont').onclick = () => { AUDIO.play('click'); S = has; resume(); };
  $('#bImp').onclick = () => { AUDIO.play('click'); openModal('save'); };
  $('#bSet').onclick = () => { AUDIO.play('click'); openSettings(); };
}
function showIntro(){
  view = 'intro'; S.scene = 'intro'; save(); titleAnim = null; AUDIO.setScene('explore');
  $('#app').innerHTML = `<header class="hud"><div><div class="loc">The Pale</div><div class="sub">Genabackis · three days after</div></div><div class="hudr">${hudButtons()}</div></header>
  <div class="scene"><canvas id="scv" width="560" height="240"></canvas><div class="cap">The Second Army lies in pits on the hillside. Nobody talks about whose sorcery fell on whom.</div></div>
  <div class="narr">
    <p>Three days ago the Moon's Spawn drifted away from the Pale, leaving behind a city that had surrendered and an army that hadn't survived the surrender. What's left of the Second Army lies in pits on the hillside. The cadre of mages is down to a handful. Onearm's Host holds the ruins, counts its dead, and doesn't talk about whose sorcery fell on whom.</p>
    <p>You are Sergeant ${esc(S.name)}, Fourth Squad, Seventh Company marines. Your squad came through the siege with all five of you still breathing, which in this army makes you either lucky or suspicious.</p>
    <p>This morning a runner found you with a message from the cadre. It said: <em>my tent, now.</em></p>
  </div>
  <div class="row"><button class="btn primary" id="bGo">Answer the summons</button><button class="btn" id="bSq">Meet the squad</button></div>`;
  G.sceneKind = 'camp';
  $('#bGo').onclick = () => { AUDIO.play('click'); $('#bGo').disabled = true; talk('intro_tat'); };
  $('#bSq').onclick = () => { AUDIO.play('click'); openChars(0); };
  bindHud();
}
function drawCamp(cv, t, night){ // intro backdrop: the pits and the camp under a bruised sky
  const ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  const sky = ctx.createLinearGradient(0,0,0,H); sky.addColorStop(0, night ? '#04040a' : '#08070b'); sky.addColorStop(.6, night ? '#0e0b12' : '#1c1414'); sky.addColorStop(1,'#0a0807'); ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);
  if (night) { ctx.fillStyle = 'rgba(220,220,240,.5)'; for (let i=0;i<40;i++) ctx.fillRect(hash(i,21)*W, hash(i,22)*H*.5, 1, 1); glow(ctx, W*.2, H*.25, W*.25, '#9a86e0', .08 + Math.sin(t/900)*.03); }
  glow(ctx, W*.8, H*.62, W*.5, '#e8923a', (night ? .3 : .22) + Math.sin(t/140)*.03);
  ctx.fillStyle = '#0b0908'; ctx.fillRect(0, H*.62, W, H);
  for (let i=0;i<7;i++){ const x = W*.08 + i*W*.12, y = H*.66 + hash(i,2)*H*.2; ell(ctx, x, y, 30, 8, '#060504'); ctx.fillStyle = 'rgba(200,190,170,.35)'; for (let j=0;j<4;j++) ctx.fillRect(x - 20 + hash(i,j)*40, y - 3 + hash(j,i)*5, 2, 2); }
  for (let i=0;i<4;i++){ const x = W*.6 + i*W*.1, y = H*.6; poly(ctx, [[x-24,y+12],[x,y-24],[x+24,y+12]], i%2 ? '#2a2016' : '#3a2c1c'); poly(ctx, [[x,y-24],[x+24,y+12],[x+8,y+12]], '#1a1410'); }
  const fl = .8 + Math.sin(t/120)*.15; ell(ctx, W*.75, H*.7, 6*fl, 3, '#ffb060'); glow(ctx, W*.75, H*.7, 40, '#ffb060', .4*fl);
  PORDER.forEach((id, i) => drawFigure(ctx, id, W*.15 + i*38, H*.86, 2.4, t, {phase:i}));
  drawFigure(ctx, 'garrow', W*.5, H*.8, 2.2, t, {still:true});
  ctx.fillStyle = 'rgba(200,190,175,.3)'; for (let i=0;i<30;i++) ctx.fillRect(hash(i,9)*W + Math.sin(t/1400 + i)*5, (hash(i,10)*H + t*.03) % H, 1.5, 1.5);
  const v = ctx.createRadialGradient(W/2, H/2, H*.3, W/2, H/2, W*.7); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(0,0,0,.8)'); ctx.fillStyle = v; ctx.fillRect(0,0,W,H);
}

