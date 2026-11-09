// Shared stage for the OV Gateway film: markup, floor layout, camera and helpers.
// Pages include gsap + MotionPathPlugin, then this file, then their own timeline.
// Exposes globals: $, world, P, gx, gBot, hubTop, hubC, PANEL, cam, applyCam, tl, shot, line, pulse,
// stream, step, blur, tag, hubPulse, caption.
const LAUNCH = window.LAUNCH;   // shots/launch.js
document.getElementById('world').innerHTML = `
  <div class="wglow" style="left:700px;top:0;width:1600px;height:1300px"></div>
  <div class="wglow" style="left:1900px;top:100px;width:1400px;height:1100px;background:radial-gradient(closest-side,rgba(139,128,217,.08),rgba(139,128,217,0))"></div>

  <!-- ④ OpenViking library floor, hub centred under the gate -->
  <div id="floorWrap" class="floor-wrap" style="left:-200px;top:1000px;width:3100px;height:1300px;perspective-origin:50% -30%">
    <div class="floor" id="floor" style="left:0;top:0;width:3100px;height:1300px;background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.92))"></div>
  </div>
  <div class="scan" id="scan" style="width:1300px;height:520px"></div>
  <img src="../assets/ov-mark.svg" id="hubmark" class="abs" style="width:120px;height:120px;filter:drop-shadow(0 12px 16px rgba(7,9,13,.18))">

  <svg class="wfx" id="fx"></svg>

  <!-- ① the in-house agent -->
  <div class="win lift" id="app" style="left:80px;top:330px;width:780px;height:540px">
    <div class="win-bar"><div class="org">内</div><div class="title">研发助手</div><div class="sub">企业自研 Agent</div><div class="spacer"></div><div class="chip" id="appNoPlug" style="opacity:0">⊘ 不支持插件</div><div class="chip" id="appDay" style="opacity:0">周一 · 新对话</div><div class="chip cyan" id="appGw">经过网关</div></div>
    <div class="rail"><i class="on"></i><i></i><i></i><i></i></div>
    <div class="app-body">
      <div class="chat">
        <div class="msg-user" id="bubble">上次定的发布日期是哪天？</div>
        <div class="msg-bot fail" id="failAns" style="opacity:0;position:absolute;left:30px;right:30px;top:120px"><div class="av"></div><div>抱歉，我看不到之前的对话记录。能告诉我是哪个项目吗？</div></div>
        <div class="msg-bot" id="answer" style="opacity:0"><div class="av" style="background:rgba(79,214,240,.25)"></div><div>
          <div class="recall-note">已从记忆补充：发布计划</div>
          <div class="notice-line">↳ 已查阅 OpenViking：release-plan.md</div>
          <div id="atext"></div>
        </div></div>
        <div class="msg-user" id="monQ" style="opacity:0;position:absolute;right:30px;top:28px">以后部署一律走 Helm，别再给我 Docker Compose 的方案。</div>
        <div class="msg-bot" id="monA" style="opacity:0;position:absolute;left:30px;right:30px;top:170px"><div class="av"></div><div id="monText"></div></div>
      </div>
      <div class="input">输入消息…</div>
    </div>
  </div>

  <!-- ② gateway -->
  <div class="abs" style="left:1150px;top:150px;width:400px;text-align:center;font:600 26px var(--sans);color:var(--text)">OpenViking 网关</div>
  <div class="gate" id="gate" style="left:1250px;top:250px;height:560px;width:200px">
    <div class="addr" style="left:-160px;right:-160px">${LAUNCH.gatewayDomain}</div>
  </div>
  <div class="port" id="pTool" style="left:1475px;top:690px;color:var(--text-3)"><i></i><span class="litdot"></span>工具</div>
  <div class="ctag cy" id="tagRecall">召回 ↓ 按新消息检索</div>
  <div class="ctag pu" id="tagTool">执行 openviking_read ↓</div>
  <div class="ctag cy" id="tagSave">存回 ↓ 本轮对话</div>

  <!-- ③ upstream model → reasoning panel -->
  <div class="model" id="model" style="left:2160px;top:390px;width:320px;height:320px">
    <div class="sheen" id="sheen"></div>
    <div class="compact" id="compact"><div class="lbl">模型</div></div>
    <div class="pc" id="pc">
      <div class="ph"><b>模型</b><span class="vchip" id="vendors">Anthropic</span><span class="pnote">推理过程示意</span></div>
      <div class="plabel">本次输入</div>
      <div class="rows">
        <div class="row" id="r1"><span class="tag">用户</span>上次定的发布日期是哪天？</div>
        <div class="row cy" id="r2"><span class="tag">记忆</span>2.0 发布推迟到 12 月 8 日<em>召回摘要</em></div>
        <div class="row" id="r3"><span class="tag">工具定义</span>openviking_find · openviking_read …<em>只读</em></div>
        <div class="row pu" id="r4"><span class="tag">工具结果</span>原因：支付回归测试未完成<em>release-plan.md</em></div>
      </div>
      <div class="plabel">推理时间线</div>
      <div class="track" id="track">
        <div class="tseg s-in" id="t1"></div><div class="tseg s-r" id="t2"></div><div class="tseg s-w" id="t3"></div><div class="tseg s-r" id="t4"></div><div class="tseg s-g" id="t5"></div>
        <div class="playhead" id="ph"></div>
      </div>
      <div class="tlabels" id="tl"><span id="l1">输入</span><span id="l2">推理</span><span id="l3">调用工具 · 等待网关执行</span><span id="l4">继续推理</span><span id="l5">生成回复</span></div>
      <div class="caps">
        <div id="c1">读取输入：用户问题 + <b>召回的记忆</b></div>
        <div id="c2">结合记忆：<b>发布推迟到 12 月 8 日</b></div>
        <div id="c3">摘要里没有原因 → <b class="pu">决定读取原文</b></div>
        <div id="c4">等待网关执行 <b class="pu">openviking_read</b> …</div>
        <div id="c5">结合原文：<b class="pu">原因是支付回归测试未完成</b></div>
        <div id="c6">生成回复</div>
      </div>
      <div class="plabel">输出</div>
      <div class="pout" id="pout"></div>
    </div>
  </div>

  <!-- moving objects -->
  <div class="capwrap" id="cap"><div class="capsule"><div class="seg user">上次定的发布日期是哪天？</div><div class="seg memseg" id="capMem">记忆 · 推迟到 12 月 8 日</div></div></div>
  <div class="pill cyan" id="query" style="opacity:0">检索：上次定的发布日期</div>
  <div class="mem hit" id="hitcard" style="width:660px;opacity:0;transform-origin:50% 100%">
    <div class="uri">viking://user/linxia/memories/events/release-plan.md</div>
    <div class="txt">2.0 发布从 12 月 1 日推迟到 12 月 8 日</div>
    <div class="type"><span class="chip cyan" style="height:30px;font-size:18px">事件</span></div>
  </div>
  <div class="pill purple" id="toolcall" style="opacity:0;font-family:var(--mono)">openviking_read(release-plan.md)</div>
  <div class="doc" id="doc" style="opacity:0">
    <div class="dh"><img src="../assets/ov-mark-small.svg" style="width:20px;height:20px">memories/events/release-plan.md</div>
    <div class="db">2.0 发布从 12 月 1 日推迟到 12 月 8 日。<br><span class="hl" id="docHl">原因：支付回归测试未完成。</span>负责人：林夏 · 10 月 28 日评审决定</div>
  </div>
  <div class="pill purple" id="result" style="opacity:0">原因：支付回归测试未完成</div>
  <div class="pill reply" id="reply" style="opacity:0">12 月 8 日。上周评审时决定推迟一周……</div>
  <div class="pill line" id="turnQ" style="opacity:0">上次定的发布日期是哪天？</div>
  <div class="pill line" id="turnA" style="opacity:0">12 月 8 日。上周评审时决定推迟一周……</div>
  <div class="mem" id="newcard" style="width:600px;opacity:0;border:2px solid var(--cyan);transform-origin:50% 50%">
    <div class="uri">viking://user/linxia/memories/events/release-followup.md</div>
    <div class="txt">林夏在跟进 2.0 发布：关注支付回归测试</div>
    <div class="type"><span class="chip cyan" style="height:30px;font-size:18px">事件</span></div>
  </div>
  <div class="chip" id="timechip" style="position:absolute;opacity:0;background:#fff;box-shadow:var(--shadow);height:42px;font-size:21px">停顿 10 分钟后 · 提交 → 后台提取记忆</div>
  <!-- ===== objects used by shots 03–05 (hidden unless a shot reveals them) ===== -->
  <div id="leftovers" style="position:absolute;left:0;top:0;opacity:0">
    <!-- the in-house agent's own integration work, as a flow beside it -->
    <div class="code-card" id="lc1" style="left:930px;top:370px"><span class="c">①</span> <span class="k">search_memory</span>(query, user)</div>
    <div class="flowarrow" id="la1" style="left:1100px;top:436px">↓</div>
    <div class="code-card" id="lc2" style="left:930px;top:480px"><span class="c">②</span> <span class="k">inject_context</span>(messages)</div>
    <div class="flowarrow" id="la2" style="left:1100px;top:546px">↓</div>
    <div class="code-card" id="lc3" style="left:930px;top:590px"><span class="c">③</span> <span class="k">save_session</span>(turn)</div>
    <div class="flowarrow" id="la3" style="left:1100px;top:656px">↓</div>
    <div class="code-card" id="lc4" style="left:930px;top:700px"><span class="c">④</span> <span class="k">extract_memory</span>(session)</div>
    <div class="code-card" id="lc5" style="left:930px;top:800px;color:#8B959C">+ <span class="k">retry</span> · <span class="k">timeout</span> · <span class="k">auth</span></div>
    <!-- …and every other app needs the same again -->
    <div class="ghost-win" id="ghost3" style="left:1460px;top:80px;width:480px;height:330px"><div class="gb"><div class="org">知</div>知识助手</div></div>
    <div class="ghost-win" id="ghost4" style="left:1480px;top:600px;width:480px;height:320px"><div class="gb"><div class="org">销</div>销售 Copilot</div></div>
    <div class="code-card mini" id="lc6" style="left:1520px;top:200px;transform:rotate(-1.5deg)"><span class="k">search_memory</span>()</div>
    <div class="code-card mini" id="lc7" style="left:1540px;top:258px;transform:rotate(1.2deg)"><span class="k">inject_context</span>()</div>
    <div class="code-card mini" id="lc8" style="left:1515px;top:316px;transform:rotate(-1deg)"><span class="k">save_session</span>()</div>
    <div class="code-card mini" id="lc9" style="left:1540px;top:720px;transform:rotate(1.4deg)"><span class="k">search_memory</span>()</div>
    <div class="code-card mini" id="lc10" style="left:1560px;top:778px;transform:rotate(-1.2deg)"><span class="k">inject_context</span>()</div>
    <div class="code-card mini" id="lc11" style="left:1535px;top:836px;transform:rotate(1deg)"><span class="k">save_session</span>()</div>
    <div class="code-card mini" id="lc12" style="left:-600px;top:620px;transform:rotate(-1.4deg)"><span class="k">search_memory</span>()</div>
    <div class="code-card mini" id="lc13" style="left:-580px;top:678px;transform:rotate(1.2deg)"><span class="k">inject_context</span>()</div>
    <div class="code-card mini" id="lc14" style="left:-605px;top:736px;transform:rotate(-1deg)"><span class="k">save_session</span>()</div>
  </div>

  <div id="plug" style="position:absolute;left:-1900px;top:40px;width:1080px;height:640px;opacity:0"></div>

  <div class="lanetag" id="lblDirect" style="left:-880px;top:228px;opacity:0"><div class="t">直连模型</div><div class="a">api.openai.com</div></div>
  <div class="lanetag on" id="lblGw" style="left:80px;top:228px;opacity:0"><div class="t">经过网关</div><div class="a">${LAUNCH.gatewayHost}</div></div>
  <div class="win" id="direct" style="left:-880px;top:330px;width:780px;height:540px;opacity:0">
    <div class="win-bar"><div class="org">内</div><div class="title">研发助手</div><div class="sub">企业自研 Agent</div><div class="spacer"></div><div class="chip">直连模型</div></div>
    <div class="rail"><i class="on"></i><i></i><i></i><i></i></div>
    <div class="app-body">
      <div class="chat">
        <div class="msg-user" id="dBubble" style="opacity:0">上次定的发布日期是哪天？</div>
        <div class="msg-bot fail" id="dAnswer" style="opacity:0"><div class="av"></div><div id="dText"></div></div>
      </div>
      <div class="input" id="dInput">输入消息…</div>
    </div>
  </div>

  <div class="win" id="appKf" style="left:-640px;top:90px;width:600px;height:330px;opacity:0">
    <div class="win-bar"><div class="org">客</div><div class="title">客服 Bot</div><div class="sub">工作流</div><div class="spacer"></div><div class="chip" id="kfNoPlug" style="opacity:0">⊘ 不支持插件</div><div class="chip" id="kfDay" style="opacity:0">周一 · 新对话</div></div>
    <div class="app-body full">
      <div class="flowstrip">
        <div class="cap">流程</div>
        <div class="flow"><div class="node">消息</div><div class="edge"></div><div class="node">意图识别</div><div class="edge"></div><div class="node llm" id="kfN1">模型调用</div><div class="edge"></div><div class="node llm" id="kfN2">模型调用</div><div class="edge"></div><div class="node">回复</div></div>
        <div class="kfaddr" id="kfAddr">模型服务地址 → ${LAUNCH.gatewayHost}</div>
        <div class="slots" id="kfSlots" style="opacity:0"><span class="cap2">接入记忆</span><div class="slot filled">✓ MCP 工具</div><div class="slot empty" id="slotR">自动召回</div><div class="slot empty" id="slotS">自动保存</div></div>
      </div>
      <div class="chat" id="kfChat" style="opacity:0;padding:20px 24px;gap:14px">
        <div class="msg-user" id="kfQ" style="font-size:24px">上次定的发布日期是哪天？</div>
        <div class="msg-bot fail" id="kfA" style="font-size:24px"><div class="av"></div><div>抱歉，我看不到之前的对话记录……</div></div>
      </div>
    </div>
  </div>
  <div class="win" id="appYw" style="left:-640px;top:820px;width:600px;height:250px;opacity:0">
    <div class="win-bar"><div class="org">运</div><div class="title">运维 Bot</div><div class="sub">工作流</div><div class="spacer"></div><div class="chip" id="ywDay" style="opacity:0;height:30px;font-size:17px;padding:0 10px">周三 · 新对话</div><div class="chip cyan" id="ywGw" style="opacity:0;height:30px;font-size:17px;padding:0 10px">经过网关</div></div>
    <div class="app-body full"><div class="flowstrip"><div class="flow"><div class="node">消息</div><div class="edge"></div><div class="node llm">模型调用</div><div class="edge"></div><div class="node">回复</div></div></div>
      <div class="chat" id="ywChat" style="opacity:0;padding:20px 24px;gap:14px">
        <div class="msg-user" id="ywQ" style="font-size:25px;opacity:0">新服务怎么部署好？</div>
        <div class="msg-bot" id="ywA" style="font-size:25px;opacity:0"><div class="av" style="background:rgba(79,214,240,.25)"></div><div>
          <div class="recall-note">已从记忆补充：部署偏好</div><div id="ywText"></div></div></div>
      </div>
    </div>
  </div>

  <!-- ===== objects used by shots 07–09 (hidden unless a shot reveals them) ===== -->
  <div class="mem" id="helmCard" style="width:600px;opacity:0;border:2px solid var(--cyan);transform-origin:50% 50%">
    <div class="uri">viking://user/linxia/memories/preferences/deploy.md</div>
    <div class="txt">部署用 Helm，不用 Docker Compose</div>
    <div class="type"><span class="chip cyan" style="height:30px;font-size:18px">偏好</span></div>
  </div>
  <div class="pill line" id="monTurn" style="opacity:0">以后部署一律走 Helm……</div>
  <div class="pill line" id="ywReq" style="opacity:0">新服务怎么部署好？</div>
  <div class="pill reply" id="ywRep" style="opacity:0">按你的习惯，直接用 Helm……</div>

  <div class="chip" id="cloudChip" style="position:absolute;left:1350px;top:-1660px;opacity:0;height:46px;font-size:22px;background:#fff;box-shadow:var(--shadow);color:var(--cyan-deep)">火山引擎公有云 · 开通即用，无需部署</div>
  <div id="console" style="left:700px;top:-1560px;opacity:0">
    <div class="csb">
      <div class="cbrand"><img src="../assets/ov-mark-small.svg">OpenViking</div>
      <div class="cgrp">工作区</div><div class="cit">首页</div><div class="cit">文件系统</div><div class="cit">检索</div><div class="cit">会话</div>
      <div class="cgrp">活动</div><div class="cit">请求日志</div><div class="cit">任务中心</div>
      <div class="cgrp">集成</div><div class="cit on">OpenViking 网关</div>
    </div>
    <div class="cmain">
      <div class="ch1">OpenViking 网关 <span class="cbeta">Beta</span><span class="crun" id="conRun">● 运行中</span></div>
      <div class="cdesc">让任何使用 API Key 的模型客户端都能用上 OpenViking 记忆。</div>
      <div class="caddr" id="conAddr">网关地址 <code>${LAUNCH.gatewayUrl}</code><span class="ccp">复制</span></div>
      <div class="ctabs"><span>概览</span><span id="tabUp">上游</span><span>上下文配置</span><span id="tabKey" class="on">密钥</span><span>请求日志</span><span>接入</span></div>
      <div class="cpanel" id="pKeys">
        <div class="cbar2"><p>每个 API Key（${LAUNCH.keyPrefix} 开头，与其他接入方式通用）属于一个 OpenViking 用户，使用一份上下文配置和一组上游。</p><div class="cbtn" id="conIssue">签发密钥</div></div>
        <table class="ctable">
          <tr><th>名称</th><th>密钥</th><th>OpenViking 用户</th><th>上下文配置</th><th>上游</th><th></th></tr>
          <tr id="kr1"><td>林夏 · 研发助手</td><td><code>${LAUNCH.keyPrefix}••••7f3a</code></td><td>linxia</td><td>默认 · 只读工具</td><td><span class="cpill">anthropic</span><span class="cpill">openai</span></td><td class="crv">吊销</td></tr>
          <tr id="kr2"><td>乔安 · 客服 Bot</td><td><code>${LAUNCH.keyPrefix}••••c21e</code></td><td>qiaoan</td><td>默认 · 只读工具</td><td><span class="cpill">openai</span></td><td class="crv">吊销</td></tr>
          <tr id="kr3" style="opacity:0"><td>ci-bot</td><td><code>${LAUNCH.keyPrefix}••••09bd</code></td><td>ci-bot</td><td>不存回 · 无工具</td><td><span class="cpill">openai</span></td><td class="crv">吊销</td></tr>
        </table>
      </div>
      <div class="cpanel" id="pUp" style="opacity:0">
        <div class="cbar2"><p>上游是网关转发到的模型服务。服务商 API Key 只保存在网关上，客户端使用 OpenViking API Key（${LAUNCH.keyPrefix}…）。</p><div class="cbtn">添加上游</div></div>
        <table class="ctable">
          <tr><th>名称</th><th>服务商</th><th>协议</th><th>API Key</th></tr>
          <tr><td>anthropic</td><td>Anthropic</td><td>Anthropic Messages</td><td class="ckey" id="key1"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none"/></svg>已保存</td></tr>
          <tr><td>openai</td><td>OpenAI</td><td>OpenAI Chat Completions</td><td class="ckey" id="key2"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none"/></svg>已保存</td></tr>
        </table>
      </div>
    </div>
    <div class="cdlg" id="dlg" style="opacity:0">
      <div class="cdt">签发 API Key</div>
      <div class="cdd">密钥签发后立即可用。完整密钥只在签发成功后显示一次。</div>
      <div class="cfield"><span>名称</span><div class="cin" id="dv1"></div></div>
      <div class="cfield"><span>给谁用</span><div class="cin" id="dv2"></div></div>
      <div class="cfield"><span>上下文配置</span><div class="cin" id="dv3"></div></div>
      <div class="cfield"><span>上游</span><div class="cin" id="dv4"></div></div>
      <div class="cbtn" id="dlgBtn" style="align-self:flex-end;margin-top:8px">签发密钥</div>
    </div>
    <svg class="ccur" id="conCur" viewBox="0 0 24 24" style="opacity:0"><path d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.6 L12 13.8 L19 13.8 Z" fill="#07090D" stroke="#fff" stroke-width="1.4"/></svg>
    <div class="ctag2" style="${LAUNCH.consoleTag ? '' : 'display:none'}">${LAUNCH.consoleTag}</div>
  </div>

  <div class="logcard" id="logCard" style="opacity:0">
    <div class="lh">请求日志 · 脱敏查看</div>
    <div class="lrow"><span>10:42:07</span><span>新消息</span><span>claude-sonnet</span><span class="ok">200</span><span>2.1k Token</span><span>记忆 3</span><span>已保存</span></div>
    <div class="ldet">
      <div><b>请求 ID</b> req_8f21…</div><div><b>对话</b> gateway-0f3a</div><div><b>协议</b> OpenAI Chat</div><div><b>API Key</b> 林夏 · 研发助手</div><div><b>耗时</b> 1.8 s</div><div><b>召回</b> 3 条</div>
    </div>
    <div class="lempty" id="logEmpty">消息与记忆原文 · 已脱敏，不留存</div>
  </div>

  <div class="editor" id="editor" style="left:60px;top:380px;width:1170px;height:400px;opacity:0">
    <div class="bar"><i></i><i></i><i></i><span>config/llm.py</span></div>
<pre><span class="ln">1</span><span class="kw">client</span> = OpenAI(
<span class="erow" id="row2"><span class="ln">2</span>    base_url = <span class="str" id="urlVal">"https://api.openai.com/v1"</span><span class="caret" id="caret2" style="opacity:0"></span>,</span><span class="erow" id="row3"><span class="ln">3</span>    api_key  = <span class="str" id="keyVal">"sk-••••3f9a"</span><span class="caret" id="caret3" style="opacity:0"></span>,</span><span class="ln">4</span>)
<span class="ln">5</span><span class="kw">model</span> = <span class="str">"&lt;model&gt;"</span><span class="same" id="same" style="opacity:0">不变</span></pre>
  </div>
`;

gsap.registerPlugin(MotionPathPlugin);
const $ = (id) => document.getElementById(id);
const world = $('world');

// ---------- floor (3100×1300): hub ring sits at the centre column, right under the gate ----------
const cols = [
  ['memories/preferences', 40, ['deploy.md', 'writing.md', 'code-style.md']],
  ['memories/events', 620, ['review-1028.md', 'release-plan.md', null]],
  ['sessions', 1960, ['gateway-7d21', 'gateway-5c0e', null]],
  ['resources', 2540, ['release-checklist.md', 'payment-runbook.md', 'api-guide.md']],
];
let fh = `<div class="hubring" id="hub" style="left:1300px;top:250px;width:500px;height:500px;border:4px solid rgba(79,214,240,.45);box-shadow:0 0 40px rgba(79,214,240,.25), inset 0 0 50px rgba(79,214,240,.15)"></div>
          <div class="hubring" style="left:1180px;top:130px;width:740px;height:740px;border:2px solid rgba(79,214,240,.14)"></div>`;
// per-person lanes (shot 08): hidden until a shot shows memory isolation
fh = `<div class="lane" id="laneL" style="left:10px;top:10px;width:1180px;height:1060px;border-color:rgba(79,214,240,.55);background:rgba(79,214,240,.07)"><span style="color:#0A7C93">linxia 的记忆</span></div>
      <div class="lane" id="laneR" style="left:1910px;top:10px;width:1180px;height:1060px;border-color:rgba(139,128,217,.55);background:rgba(139,128,217,.07)"><span style="color:#5E52B8">qiaoan 的记忆</span></div>` + fh;
cols.forEach(([zone, x, files]) => {
  fh += `<div class="zone" style="left:${x}px;top:50px">${zone}</div>`;
  files.forEach((n, r) => {
    const y = 130 + r * 280, id = n ? n.replace(/[^a-z0-9]/gi, '') : `${zone.replace(/\W/g, '')}${r}`;
    fh += n ? `<div class="fcard" id="f_${id}" style="left:${x}px;top:${y}px"><div class="n">${n}</div><div class="l"></div><div class="l s"></div></div>`
            : `<div class="fcard" id="f_${id}" style="left:${x}px;top:${y}px;opacity:0;border:2px dashed rgba(79,214,240,.6);background:rgba(79,214,240,.05)"></div>`;
  });
});
$('floor').innerHTML = fh;

function rect(el) { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; }
// world-space rect, safe to call after the camera has moved (rect() alone returns screen space)
function wrect(el) { const t = world.style.transform; world.style.transform = 'none'; const r = rect(el); world.style.transform = t; return r; }
const GX = rect($('gate')).cx;
// shift the floor so the hub's projected centre lines up with the gate
const hub0 = rect($('hub'));
$('floorWrap').style.left = (parseFloat($('floorWrap').style.left) + GX - hub0.cx) + 'px';
const P = {
  gate: rect($('gate')), hub: rect($('hub')), slot: rect($('f_releaseplanmd')), newslot: rect($('f_memoriesevents2')), sess: rect($('f_sessions2')),
  bubble: rect($('bubble')), chat: rect($('app').querySelector('.chat')), tool: rect($('pTool')),
};
const gx = P.gate.cx, gBot = P.gate.y + P.gate.h, hubTop = P.hub.y + 20, hubC = P.hub.cy;
$('hubmark').style.left = (gx - 60) + 'px'; $('hubmark').style.top = (hubC - 100) + 'px';

// panel geometry (world coords)
const PANEL = { left: 1960, top: 190, w: 1200, h: 730 };

// ---------- camera ----------
const cam = { cx: 600, cy: 610, s: 1.32 };  // shot 06's opening frame; other shots override
function applyCam() { world.style.transform = `translate(${960 - cam.cx * cam.s}px, ${540 - cam.cy * cam.s}px) scale(${cam.s})`; }
applyCam();
const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
const shot = (t, cx, cy, s, d = 1.4, ease = 'power3.inOut') => tl.to(cam, { cx, cy, s, duration: d, ease, onUpdate: applyCam }, t);

// ---------- helpers ----------
const fx = $('fx'), NS = 'http://www.w3.org/2000/svg';
function line(d, stroke, w, extra = {}) {
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', stroke); p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round');
  Object.entries(extra).forEach(([k, v]) => p.setAttribute(k, v)); fx.appendChild(p); return p;
}
// the conduit: a quiet double rail between gate and store; pulses travel along its centre line
const cLen = hubTop - gBot;
line(`M${gx - 8} ${gBot} L ${gx - 8} ${hubTop}`, 'rgba(14,154,182,.20)', 2);
line(`M${gx + 8} ${gBot} L ${gx + 8} ${hubTop}`, 'rgba(14,154,182,.20)', 2);
function pulse(t, color, down = true, d = .7, len = 160) {
  const p = line(down ? `M${gx} ${gBot} L ${gx} ${hubTop}` : `M${gx} ${hubTop} L ${gx} ${gBot}`, color, 6, { 'stroke-dasharray': `${len} ${cLen + len}` });
  const g = line(down ? `M${gx} ${gBot} L ${gx} ${hubTop}` : `M${gx} ${hubTop} L ${gx} ${gBot}`, color.replace(/[\d.]+\)$/, '.18)'), 24, { 'stroke-dasharray': `${len} ${cLen + len}` });
  [p, g].forEach((el) => { el.style.strokeDashoffset = len; el.style.opacity = 0; tl.set(el, { opacity: 1 }, t); tl.to(el, { strokeDashoffset: -cLen, duration: d, ease: 'power1.inOut' }, t); tl.set(el, { opacity: 0 }, t + d); });
}
function stream(el, text, t, d) { const o = { n: 0 }; tl.to(o, { n: text.length, duration: d, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); } }, t); }
function step(t, i) {
  document.querySelectorAll('#steps span').forEach((sp) => tl.set(sp, { attr: { class: (sp.dataset.s === '3' ? 'pu' : '') + (sp.dataset.s == i ? ' on' : '') } }, t));
}
function blur(sel, t, px, op, d = .6) { tl.to(sel, { filter: `blur(${px}px)`, opacity: op, duration: d }, t); }
function tag(id, t, d) { tl.set(`#${id}`, { left: gx + 230, top: gBot + cLen * .42 }, t); tl.to(`#${id}`, { opacity: 1, duration: .25 }, t); tl.to(`#${id}`, { opacity: 0, duration: .3 }, t + d); }
function hubPulse(t, color = 'rgba(79,214,240,.75)') { tl.to('#hub', { borderColor: color, boxShadow: `0 0 70px ${color}`, duration: .25, yoyo: true, repeat: 1 }, t); }
let capIdx = 0;
function caption(id, t) { if (capIdx) tl.to(`#c${capIdx}`, { opacity: 0, y: -8, duration: .25 }, t); tl.fromTo(`#${id}`, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3 }, t + .05); capIdx = id.slice(1); }

gsap.set(['.pill', '#scan'], { xPercent: -50, yPercent: -50 });
gsap.set('#scan', { scale: .1 });

// plugin cluster: logos already integrated through plugins, each carries a (hidden) OV badge
(() => {
  const L = [['Claude Code', 'claude-code.svg'], ['Codex', 'codex.svg'], ['Cursor', 'cursor.svg'], ['TRAE', 'trae.svg'],
             ['opencode', 'opencode.svg'], ['Kimi Code', 'kimi-code.svg'], ['DeepSeek Harness', 'deepseek.svg'], ['OpenClaw', 'openclaw.jpg']];
  $('plug').innerHTML = L.map(([n, f], i) => {
    const x = 130 + (i % 4) * 270 + (i >= 4 ? 130 : 0), y = 150 + Math.floor(i / 4) * 300;
    const photo = /\.(png|jpg)$/.test(f) ? ' class="photo"' : '';
    return `<div class="lnode" style="left:${x}px;top:${y}px"><div class="disc"><img src="../assets/logos/${f}"${photo}><div class="ovbadge plugbadge" style="opacity:0"><img src="../assets/ov-mark-small.svg"></div></div><div class="nm">${n}</div></div>`;
  }).join('');
})();

// burned-in narration captions (shots/captions.js, generated by tools/make_captions.py); offset = where this
// sequence's own time starts on the page timeline
function addCaptions(name, offset = 0) {
  let el = document.getElementById('subs');
  if (!el) { el = document.createElement('div'); el.id = 'subs'; document.body.appendChild(el); }
  const caps = (window.CAPTIONS || {})[name] || [];
  caps.forEach(([a, b, text], k) => {
    tl.set(el, { textContent: text, opacity: 1 }, offset + a);
    const next = caps[k + 1];
    if (!next || next[0] - b > .12) tl.set(el, { opacity: 0 }, offset + b);
  });
}
