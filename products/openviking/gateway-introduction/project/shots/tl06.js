// Shot 06 timeline (0–26 s). Used by shot06.html and, as the opening state, by seq07-09.html.
tl.set('#cap', { x: P.bubble.x + P.bubble.w, y: P.bubble.cy, opacity: 0, scale: .96 }, 0);
step(0, 0);

// ================= a · depart (0–2.4) =================
tl.to('#bubble', { opacity: 0, scale: .94, duration: .35 }, .3);
tl.to('#cap', { opacity: 1, scale: .82, duration: .45, ease: 'power2.out' }, .35);
const capWaitX = gx + 330, capWaitY = P.gate.y + 250;
tl.to('#cap', { duration: 1.4, motionPath: { path: [{ x: P.bubble.x + P.bubble.w + 40, y: P.bubble.cy - 60 }, { x: gx + 120, y: capWaitY - 80 }, { x: capWaitX, y: capWaitY }], curviness: 1.2 } }, .9);
shot(.8, 1180, 600, 1.0, 1.6);
tl.to('#gate', { boxShadow: '0 0 0 1px rgba(7,9,13,.05), 0 40px 90px rgba(7,9,13,.12), 0 0 80px rgba(79,214,240,.35), inset 0 1px 0 #fff', duration: .4, yoyo: true, repeat: 1 }, 1.9);
blur('#app', 1.9, 5, .7);

// ================= b · recall through the conduit (2.4–5.0) =================
step(2.4, 1);
shot(2.4, gx - 150, (gBot + hubC) / 2 + 120, .8, 1.4);
tag('tagRecall', 2.6, 2.2);
tl.set('#query', { left: gx, top: gBot + 10, scale: .7 }, 2.7);
tl.to('#query', { opacity: 1, scale: .85, duration: .25 }, 2.7);
tl.to('#query', { top: hubTop - 30, duration: .7, ease: 'power1.inOut' }, 2.75);
tl.to('#query', { opacity: 0, scale: .6, duration: .2 }, 3.4);
pulse(2.75, 'rgba(79,214,240,.95)', true, .7);
hubPulse(3.4);
tl.set('#scan', { left: gx, top: hubC }, 3.45);
tl.to('#scan', { opacity: 1, scale: 1.25, duration: 1.0, ease: 'power2.out' }, 3.45);
tl.to('#scan', { opacity: 0, duration: .45 }, 4.3);
tl.to('#f_releaseplanmd', { borderColor: '#4FD6F0', boxShadow: '0 0 0 10px rgba(79,214,240,.18)', duration: .25 }, 4.1);
const hitX = P.slot.cx - 330, hitY = P.slot.y - 200;
tl.set('#hitcard', { left: hitX, top: hitY, scaleY: .4, scaleX: .9, y: 120 }, 4.3);
tl.to('#hitcard', { opacity: 1, scaleY: 1, scaleX: 1, y: 0, duration: .55, ease: 'power3.out' }, 4.35);
tl.to('#f_releaseplanmd', { borderStyle: 'dashed', opacity: .55, duration: .3 }, 4.4);

// ================= c · back up the conduit, attach to the message (5.0–6.6) =================
shot(4.9, 1600, 660, .86, 1.4);
pulse(5.0, 'rgba(79,214,240,.95)', false, .8);
tl.to('#hitcard', { duration: 1.25, ease: 'power2.inOut', scale: .42, transformOrigin: '100% 50%',
  motionPath: { path: [{ x: gx - hitX - 330, y: hubTop - hitY - 160 }, { x: gx - hitX - 330, y: gBot - hitY - 140 }, { x: capWaitX - hitX - 660, y: capWaitY - hitY - 90 }], curviness: .8 } }, 5.0);
tl.to('#hitcard', { opacity: 0, duration: .2 }, 6.15);
tl.to('#capMem', { maxWidth: 420, paddingLeft: 26, paddingRight: 26, duration: .35, ease: 'back.out(1.4)' }, 6.15);
tl.to('#f_releaseplanmd', { borderStyle: 'solid', borderColor: 'rgba(7,9,13,.07)', boxShadow: '0 2px 10px rgba(7,9,13,.05)', opacity: 1, duration: .5 }, 6.3);
tl.to('#floorWrap, #hubmark', { opacity: .7, duration: .6 }, 5.6);

// ================= d · the model opens into a reasoning panel (6.6–8.5) =================
step(6.6, 2);
tl.to('#compact', { opacity: 0, duration: .25 }, 6.6);
tl.to('#model', { left: PANEL.left, top: PANEL.top, width: PANEL.w, height: PANEL.h, borderRadius: 30, duration: .8, ease: 'power3.inOut' }, 6.65);
tl.to('#pc', { opacity: 1, duration: .4 }, 7.25);
tl.to('#sheen', { opacity: .35, duration: .6 }, 6.7);
shot(6.6, PANEL.left + PANEL.w / 2 - 120, PANEL.top + PANEL.h / 2, 1.08, 1.3);
tl.to('#cap', { x: PANEL.left + 760, y: PANEL.top + 190, scale: .7, duration: 1.0, ease: 'power2.inOut' }, 6.85);
tl.to('#cap', { opacity: 0, duration: .25 }, 7.8);
tl.to('#r1', { opacity: 1, duration: .25 }, 7.8);
tl.to('#r2', { opacity: 1, duration: .25 }, 7.98);
tl.to('#r3', { opacity: 1, duration: .25 }, 8.16);
const vendors = ['Anthropic', 'OpenAI', 'DeepSeek', '火山方舟'];
const vo = { i: 0 }; tl.to(vo, { i: 3, duration: 1.8, ease: 'none', onUpdate: () => { $('vendors').textContent = vendors[Math.round(vo.i)]; } }, 7.3);

// ---- reasoning timeline: 8.5 → 17.2, playhead linear; segments grow with it ----
const T0 = 8.5, T1 = 17.2, span = T1 - T0;
const segs = [['t1', 'l1', 8.5, 9.0], ['t2', 'l2', 9.0, 10.8], ['t3', 'l3', 10.8, 15.2], ['t4', 'l4', 15.2, 16.0], ['t5', 'l5', 16.0, 17.2]];
const pct = (t) => (t - T0) / span * 100;
segs.forEach(([s, l, a, b]) => {
  $(s).style.left = pct(a) + '%'; $(s).style.width = (pct(b) - pct(a)) + '%';
  $(l).style.left = pct(a) + '%';
  tl.to(`#${s}`, { scaleX: 1, duration: b - a, ease: 'none' }, a);
  tl.to(`#${l}`, { opacity: 1, color: '#E8EDF1', duration: .2 }, a);
  tl.to(`#${l}`, { opacity: .55, color: '#93A0AA', duration: .3 }, b);
});
tl.set('#ph', { left: '0%' }, 0);
tl.to('#ph', { opacity: 1, duration: .2 }, T0);
tl.to('#ph', { left: '100%', duration: span, ease: 'none' }, T0);
tl.to('#ph', { opacity: 0, duration: .3 }, T1);
tl.fromTo('#sheen', { backgroundPosition: '0px 0px' }, { backgroundPosition: '400px 0px', duration: span, ease: 'none' }, T0);
caption('c1', 8.5);
caption('c2', 9.1);
caption('c3', 10.0);

// ================= e · tool round trip (10.8–15.2) =================
step(10.8, 3);
caption('c4', 10.85);
tl.set('#toolcall', { left: PANEL.left + 40, top: PANEL.top + 470, scale: .7 }, 10.85);
tl.to('#toolcall', { opacity: 1, scale: 1, duration: .35, ease: 'back.out(1.6)' }, 10.85);
tl.to('#toolcall', { duration: 1.0, motionPath: { path: [{ x: -260, y: 60 }, { x: P.tool.x + 30 - (PANEL.left + 40), y: P.tool.cy - (PANEL.top + 470) }], curviness: 1.1 } }, 11.2);
tl.to('#pTool .litdot', { opacity: 1, duration: .25 }, 12.15);
tl.to('#pTool', { color: '#5E52B8', duration: .25 }, 12.15);
tl.to('#toolcall', { opacity: 0, scale: .7, duration: .3 }, 12.2);
shot(11.0, gx - 260, (gBot + hubC) / 2 + 80, .78, 1.7);
tl.to('#floorWrap, #hubmark', { opacity: 1, duration: .5 }, 12.0);
tag('tagTool', 12.35, 1.9);
pulse(12.4, 'rgba(139,128,217,.95)', true, .55);
hubPulse(12.9, 'rgba(139,128,217,.7)');
tl.set('#doc', { left: P.slot.cx - 320, top: P.slot.y - 330 }, 12.9);
tl.to('#f_releaseplanmd', { borderColor: '#8B80D9', boxShadow: '0 0 0 10px rgba(139,128,217,.18)', duration: .25 }, 12.85);
tl.to('#f_releaseplanmd', { borderColor: 'rgba(7,9,13,.07)', boxShadow: '0 2px 10px rgba(7,9,13,.05)', duration: .4 }, 14.3);
tl.fromTo('#doc', { opacity: 0, scaleY: .5, y: 80 }, { opacity: 1, scaleY: 1, y: 0, duration: .6, ease: 'power3.out' }, 12.95);
tl.to('#docHl', { backgroundColor: 'rgba(139,128,217,.15)', boxShadow: 'inset 3px 0 0 #8B80D9', duration: .35 }, 13.65);
const rX = P.slot.cx, rY = P.slot.y - 330 + 56 + 18 + 62;
tl.set('#result', { left: rX, top: rY, scale: .8 }, 14.0);
tl.to('#result', { opacity: 1, scale: 1, duration: .25 }, 14.0);
tl.to('#doc', { opacity: 0, y: 50, duration: .45 }, 14.2);
pulse(14.15, 'rgba(139,128,217,.95)', false, .55);
tl.to('#result', { duration: 1.1, ease: 'power2.inOut',
  motionPath: { path: [{ x: gx - rX, y: hubTop - rY - 40 }, { x: gx - rX, y: gBot - rY - 20 }, { x: gx + 260 - rX, y: 560 - rY }, { x: PANEL.left + 560 - rX, y: PANEL.top + 452 - rY }], curviness: .7 } }, 14.1);
shot(13.9, PANEL.left + PANEL.w / 2 - 120, PANEL.top + PANEL.h / 2, 1.08, 1.3);
tl.to('#pTool .litdot', { opacity: 0, duration: .3 }, 14.4);
tl.to('#pTool', { color: '#8B959C', duration: .3 }, 14.4);
tl.to('#floorWrap, #hubmark', { opacity: .7, duration: .6 }, 14.4);
tl.to('#result', { opacity: 0, duration: .2 }, 15.15);
tl.to('#r4', { opacity: 1, duration: .3 }, 15.15);

// ================= f · continue reasoning, reply (15.2–19.6) =================
step(15.2, 2);
caption('c5', 15.3);
caption('c6', 16.05);
stream($('pout'), '12 月 8 日。上周评审时决定推迟一周，等支付回归测试完成。', 16.05, 1.05);
step(17.0, 4);
const outX = PANEL.left + 340, outY = PANEL.top + PANEL.h - 70;
tl.set('#reply', { left: outX, top: outY, scale: .7 }, 17.05);
tl.to('#reply', { opacity: 1, scale: 1, duration: .25 }, 17.05);
tl.to('#reply', { duration: 1.35, ease: 'power2.inOut',
  motionPath: { path: [{ x: gx + 200 - outX, y: 620 - outY }, { x: gx - outX, y: 600 - outY }, { x: P.chat.x + 380 - outX, y: P.chat.y + 180 - outY }], curviness: .9 } }, 17.1);
shot(17.0, 640, 610, 1.22, 1.5);
blur('#app', 17.0, 0, 1);
tl.to('#reply', { opacity: 0, duration: .25 }, 18.4);
tl.to('#answer', { opacity: 1, duration: .3 }, 18.3);
tl.set('#bubble', { opacity: 1, scale: 1 }, 18.3);
stream($('atext'), '12 月 8 日。上周评审时决定推迟一周，等支付回归测试完成。', 18.45, 1.15);

// ================= g · save back through the conduit (19.8–26) =================
step(19.8, 5);
shot(19.8, 1560, 1110, .55, 1.5);
tl.to('#floorWrap, #hubmark', { opacity: 1, duration: .6 }, 19.8);
const q0 = { x: P.bubble.cx, y: P.bubble.cy }, a0 = { x: P.chat.x + 380, y: P.chat.y + 200 };
tl.set('#turnQ', { left: q0.x, top: q0.y }, 20.3); tl.set('#turnA', { left: a0.x, top: a0.y }, 20.3);
tl.to(['#turnQ', '#turnA'], { opacity: 1, duration: .3 }, 20.3);
tl.to('#turnQ', { duration: 1.4, ease: 'power2.inOut', motionPath: { path: [{ x: gx - 200 - q0.x, y: 470 - q0.y }, { x: gx - q0.x, y: 560 - q0.y }, { x: gx - q0.x, y: gBot + 60 - q0.y }, { x: gx - q0.x, y: hubTop - q0.y }], curviness: .6 } }, 20.4);
tl.to('#turnA', { duration: 1.4, ease: 'power2.inOut', motionPath: { path: [{ x: gx - 200 - a0.x, y: 540 - a0.y }, { x: gx - a0.x, y: 620 - a0.y }, { x: gx - a0.x, y: gBot + 120 - a0.y }, { x: gx - a0.x, y: hubTop + 50 - a0.y }], curviness: .6 } }, 20.55);
tag('tagSave', 20.9, 1.6);
pulse(21.0, 'rgba(79,214,240,.95)', true, .8);
hubPulse(21.85);
tl.to('#turnQ', { left: P.sess.cx, top: P.sess.cy - 40, x: 0, y: 0, duration: .55, ease: 'power2.inOut' }, 21.85);
tl.to('#turnA', { left: P.sess.cx, top: P.sess.cy + 20, x: 0, y: 0, duration: .55, ease: 'power2.inOut' }, 21.95);
tl.to('#f_sessions2', { opacity: 1, duration: .3 }, 22.3);
tl.set('#f_sessions2', { innerHTML: '<div class="n" style="color:#0A7C93">gateway-0f3a</div><div class="l"></div><div class="l s"></div>' }, 22.35);
tl.to('#f_sessions2', { borderStyle: 'solid', duration: .3 }, 22.6);
tl.set('#timechip', { left: P.sess.cx - 240, top: P.hub.y - 150 }, 22.4);
tl.to('#timechip', { opacity: 1, duration: .4 }, 22.4);
const ncx = P.sess.cx, ncy = P.sess.cy - 150;
tl.to(['#turnQ', '#turnA'], { left: ncx, top: ncy, scale: .5, opacity: 0, duration: .45, ease: 'power2.in' }, 22.65);
tl.set('#newcard', { left: ncx - 300, top: ncy - 70, scale: .3 }, 23.05);
tl.to('#newcard', { opacity: 1, scale: 1, duration: .35, ease: 'back.out(1.6)' }, 23.05);
tl.to('#newcard', { left: P.newslot.cx - 300, top: P.newslot.cy - 80, scale: .8, duration: .85, ease: 'power3.out' }, 23.45);
tl.to('#f_memoriesevents2', { opacity: 1, duration: .3 }, 23.9);
tl.to('#newcard', { boxShadow: '0 0 0 12px rgba(79,214,240,.16), 0 28px 70px rgba(7,9,13,.13)', duration: .4 }, 24.3);
tl.to({}, { duration: Math.max(0, 26 - tl.duration()) });
