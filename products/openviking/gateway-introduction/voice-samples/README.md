# 旁白音色样本

2026-10-25 · 火山豆包语音合成 2.0 · 语速 -5 · 48 kHz MP3。五个音色读同一段文字（[sample-text.txt](sample-text.txt)，即脚本 03–04 镜的旁白），每个文件旁边的 JSON 里有请求 ID 和字级时间戳。

| 文件 | 音色 | 时长 | 句间最长停顿 | 判断 |
|---|---|---|---|---|
| [gaolengchenwen.mp3](gaolengchenwen.mp3) | 高冷沉稳 2.0 `zh_male_gaolengchenwen_uranus_bigtts` | 16.0s | 0.6–0.9s | **推荐。** 节奏均匀，句间停顿正好够画面“落一拍”；全片约 80 秒旁白 |
| [yunzhou.mp3](yunzhou.mp3) | 云舟 2.0 `zh_male_m191_uranus_bigtts` | 13.1s | ≤0.44s | 备选。最自然、像对话，但偏快，停顿短，画面会被赶着走 |
| [yuanboxiaoshu.mp3](yuanboxiaoshu.mp3) | 渊博小叔 2.0 `zh_male_yuanboxiaoshu_uranus_bigtts` | 14.8s | ≤0.52s | 响度起伏最小（LRA 2.1），可能偏平 |
| [ruyayichen.mp3](ruyayichen.mp3) | 儒雅逸辰 2.0 `zh_male_ruyayichen_uranus_bigtts` | 17.5s | 1.0–1.4s | codex 阶段的试用音色，作对照 |
| [cixingjieshuo.mp3](cixingjieshuo.mp3) | 磁性解说男声 2.0 `zh_male_cixingjieshuonan_uranus_bigtts` | 23.0s | 1.4–1.5s | 太慢、太“纪录片”，不适合 100 秒产品片 |

**说明**：我听不到音频。上表的“推荐”依据的是官方音色名称定位，加上实测的时长、停顿和响度起伏（ffmpeg silencedetect / ebur128）。音色质感请你试听后定，换音色不影响脚本和画面。
