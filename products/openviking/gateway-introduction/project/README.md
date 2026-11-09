# 制作工程

当前工程为内容 V7、画面修订 V8，状态及完整安装步骤见[视频 README](../README.md)。HTML/CSS 由 Playwright 截图，GSAP 控制动画时间线。

`styleframes/K1–K9.html` 是历史设计样帧，部分地址、密钥前缀和文案早于当前成片，不应作为当前产品口径或新项目接入模板。当前动画位于 `shots/`，发布信息集中在 `shots/launch.js`；修改它不会更新历史样帧。

| 位置 | 内容 |
|---|---|
| `styleframes/base.css` | 色彩、字体、窗口、胶囊、记忆卡、网关、模型节点、透视地面等共用样式（对应动效指导 §1、§4） |
| `styleframes/apps.css` | 虚构企业应用（研发助手、客服 Bot 等）的界面样式（§6.2） |
| `styleframes/K1–K9.html` | 九张样帧，每张对应脚本 V2 中的一个时刻 |
| `assets/` | OV 标志（按规范几何重建的 Master / Small）、官网 Integrations 页提取的 Agent Logo |
| `renders/styleframes/` | 渲染出的 PNG 与九宫格总览 `contact-sheet.jpg` |

渲染：

```bash
npm run frames          # 全部
node render-frames.mjs K6 K7   # 指定几张
```

字体来自 npm 包（Noto Sans SC、Geist、JetBrains Mono），渲染时检查字体是否加载失败。Chromium 使用当前 Playwright 版本对应的浏览器缓存。首次运行先执行 `npx playwright install chromium --only-shell`；系统需安装 Python 3 和 FFmpeg。

## 镜头动画（GSAP，逐帧确定性渲染）

所有镜头共用一个舞台：`shots/world.css` + `shots/world.js`（世界布局、OpenViking 地面与枢纽、网关通道、模型推理面板、相机与动画辅助函数，以及 01–09 各镜用到的编辑器、直连窗口、更多企业应用、插件集群、网关控制台、按人分区的地面、请求日志卡片，默认隐藏）。舞台布置好相机之后再取坐标，要用 `wrect()`（世界坐标），不要用 `rect()`。每个镜头页面只写自己的时间线；相邻镜头的首尾帧落在同一个相机位置上，可以直接剪接。

| 位置 | 内容 |
|---|---|
| `shots/seq01-02.html` | 01–02 一镜到底（27 秒）：插件星座 → 插件够不着的企业应用，结尾落在 03 的首帧 |
| `audio/sfx_seq0102.py` | 01–02 音效床 |
| `shots/seq03-05.html` | 03–05 一镜到底（35 秒）：改两项设置 → 同一个问题 → 网关是什么，结尾俯冲到 06 的首帧 |
| `audio/sfxlib.py` | 音效合成函数与音效床 `Bed`（传入 `edit=` 后，事件按时间轴给出、按剪辑点落位） |
| `audio/sfx_seq0305.py` | 03–05 音效床 |
| `shots/tl06.js` | 06 镜时间线（0–26 秒），`shot06.html` 和 `seq07-09.html` 共用 |
| `shots/seq07-09.html` | 07–09 一镜到底（39 秒）：先构建 06 的时间线，再从 26 秒接着播，起点就是 06 的末帧 |
| `audio/sfx_seq0709.py` | 07–09 音效床 |
| `tools/check-stills.sh` | 出 07–09 修正点、06→07 剪接点和 05 镜请求胶囊的检查静帧 |
| `shots/launch.js` | 画面上的发布信息：网关域名、插件数量文案、控制台角标、落版的发布时间与 CTA。所有页面都从这里读 |
| `shots/edits.json` | 剪辑点：每段序列里要压缩的空档（时间轴区间 → 输出时长）。区间内按平滑曲线加速，两端保持原速，镜头运动不会跳；旁白从不落在区间内 |
| `editmap.mjs`、`audio/editmap.py` | 同一套时间映射的 JS / Python 实现：出帧按它取时间，音效与旁白按它落位 |
| `audio/mix.py` | 统一混音：`python3 audio/mix.py seq01-02`。各段旁白的切分与落位写在文件里，按剪辑点换算到输出时间；音效被配音侧链压低，整体 -16 LUFS |
| `tools/build-film.sh` | 一条命令：四段音效 → 混音 → 出帧（按剪辑点）→ 编码 → 拼成全片 |
| `tools/make_captions.py` → `shots/captions.js` | 口播字幕：从 TTS 字级时间戳按标点断行，落位与 `audio/mix.py` 的旁白分段一致，所以也跟着剪辑点走；各页面用 `addCaptions()` 烧进画面 |
| `renders/<序列>/<序列>-edit.mp4` | 每段按剪辑点出的成片，全片由这四段拼成 |


| 位置 | 内容 |
|---|---|
| `shots/shot06.html` | 06 镜“跟着一条消息走”：一张 3400×2300 的世界舞台 + 相机，GSAP 时间线驱动，`window.__seek(t)` 可定位到任意时刻 |
| `render-shot.mjs` | `node render-shot.mjs shot06 stills 4.9 14.6` 出指定时刻静帧；`node render-shot.mjs shot06 frames` 按 30 fps 出全部帧 |
| `audio/sfx_shot06.py` | 06 镜音效床（房间底噪 + 关键事件音），时间点与 `tl06.js` 一致 |

重出全片（耗时取决于运行环境）：

```bash
OUT=OV-Gateway-preview-v8.mp4 sh tools/build-film.sh
```

输出到 `renders/OV-Gateway-preview-v8.mp4`。`renders/` 全部为本地生成产物，历史成片不随仓库提供。

静帧检查用的是时间轴时间（`node render-shot.mjs seq07-09 stills 21.5`），不受剪辑点影响。
