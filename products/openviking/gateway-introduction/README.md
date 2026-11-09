# OpenViking 网关介绍片

中文产品介绍视频的可重建工程，包含 9 个镜头、旁白和字幕。通过 HTML/CSS、GSAP、Playwright 与 FFmpeg 生成 1920×1080、30 fps 视频。

- 内容版本：V7（2026-10-26），对应脚本 V2.1；成片约 117.8 秒。
- 状态：待视频 review；未在本仓库发布成片，发布日期待定。
- 来源：OpenViking 网关介绍片制作工程，由项目维护者提供。
- 素材：原始旁白及 TTS 时间戳保留；OV 标志为几何重建，第三方 Agent Logo 来源于 [OpenViking Integrations](https://openviking.ai/integrations)。第三方商标归各自权利人所有，本目录不额外授予转载或商标使用许可。
- 内容口径和对外发布事项见 [发布前确认清单](发布前确认清单.md)。本次仅归档工程，产品信息沿用该版本。

## 重建

需要 Node.js/npm、Python 3（仅标准库）、FFmpeg（含 ffprobe 和 libx264），以及 Playwright Chromium。已验证环境：macOS arm64、Node.js 26.11.1、Playwright 1.56.1。

```sh
cd products/openviking/gateway-introduction/project
npm ci
npx playwright install chromium --only-shell
OUT=OV-Gateway-full-v7.mp4 sh tools/build-film.sh
```

Linux 如缺少浏览器系统依赖，可在构建环境中使用 `npx playwright install --with-deps chromium --only-shell`。

输出位于 `project/renders/OV-Gateway-full-v7.mp4`，只在本地生成，不入库。构建包含字幕生成、音效合成、旁白混音、逐帧截图、分段编码和全片拼接。无需 TTS 服务凭证；直接使用保存的原始音频。

## 文件

| 路径 | 用途 |
|---|---|
| `脚本-V2.md`、`旁白-V2.1.txt` | 当前分镜脚本和旁白 |
| `动效与界面指导.md` | 视觉与动效设计说明 |
| `project/shots/` | 共享舞台、动画时间线、发布信息及剪辑配置 |
| `project/styleframes/`、`project/assets/` | 样帧源码和品牌素材 |
| `project/audio/`、`project/tools/` | 音效、混音、字幕与构建脚本 |
| `voiceover-v2.1/` | 当前旁白 MP3、逐字时间戳 JSON 及文本 |
| `voiceover/`、`voice-samples/` | 历史旁白和音色参考，含对应时间戳 |

历史文档中指向 `../OV gateway/` 的链接是制作时的参考来源，不属于本仓库，也不参与构建。字体与 GSAP 从 `npm ci` 恢复的依赖中加载。

## 存储约定

提交源码、配置、原始旁白、时间戳、素材和依赖锁文件。不提交 `node_modules/`、`project/renders/`、任何 MP4、可重建的音效/混音 WAV、拼接旁白预览以及运行缓存；规则见 [.gitignore](.gitignore)。

只看静帧可运行 `npm run frames`；动画检查可运行 `sh tools/check-stills.sh`。生成文件仍留在本地供 review。
