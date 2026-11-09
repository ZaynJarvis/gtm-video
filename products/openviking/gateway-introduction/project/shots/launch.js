// Launch facts shown on screen, in one place. Change a value, then rebuild: sh tools/build-film.sh
// Anything spoken in the narration (e.g. "即将登陆火山引擎公有云") needs a new TTS take as well; see 发布前确认清单.md.
window.LAUNCH = {
  // gateway address: full URL in the config editor (03) and the console (08); without the scheme on the "经过网关" label
  // and the workflow's address chip; the domain alone above the gate
  gatewayUrl: 'https://api.vikingdb.cn-beijing.volces.com/openviking/gateway',
  // clients use their OpenViking API Key, the same key as every other way of connecting
  keyPrefix: 'ov-',
  // corner tag on the gateway console (08); '' hides it
  consoleTag: '开源版界面示意',
  // plugin count under the constellation (01); site says "14 个 harness" (13 agents + ov CLI).
  // pluginCount: null shows the label alone, e.g. pluginCountLabel: '十余种 Agent 开箱即用'
  pluginCount: null,
  pluginCountLabel: '十余种 Agent 开箱即用',
  // end card (09)
  launchLine: '即将登陆 · 火山引擎公有云',
  ctaUrl: 'openviking.ai/gateway',
};
window.LAUNCH.gatewayHost = window.LAUNCH.gatewayUrl.replace(/^https?:\/\//, '');
// the gate's own label has room for the domain only
window.LAUNCH.gatewayDomain = window.LAUNCH.gatewayHost.split('/')[0];
