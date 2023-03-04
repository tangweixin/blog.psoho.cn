# ffmpeg命令收藏

## 参考

* [FFmpeg：视频转码、剪切、合并、播放速调整](https://blog.csdn.net/angus_17/article/details/80696989)

## 音频转换

::: code-group

```bash [wav]
ffmpeg -i audio.wav -acodec libmp3lame audio.mp3
```

```bash [ogg]
ffmpeg -i audio.ogg -acodec libmp3lame audio.mp3
```

```bash [ac3]
ffmpeg -i audio.ac3 -acodec libmp3lame audio.mp3
```

```bash [aac]
ffmpeg -i audio.aac -acodec libmp3lame audio.mp3
```

:::


## mov转mp4

备注：微信的压缩会把视频尺寸修改掉，例如：720 × 1280会压缩成368 × 640

使用H.264编码 (压缩率50%)

使用H.265编码 (压缩率90%)

::: code-group

```bash [H.264]
ffmpeg -i  IMG_0948.MOV -vcodec libx264  IMG_0948.h264.mp4
```

```bash [H.265]
ffmpeg -i  IMG_0948.MOV -vcodec libx265  IMG_0948.h265.mp4
```

:::


## rmvb转mp4

::: code-group

```bash [默认]
ffmpeg -i "demo.rmvb" -vcodec libx264 "demo.mp4"
```

```bash [指定编码]
# This converts to h264 video and aac audio. These codecs quite common at present.
# Video defaults to CRF 23 while audio should default to 128k.
ffmpeg -i "emo.rmvb" -c:v h264 -c:a aac "demo.mp4"
```

::: 


## 音频+视频

::: code-group

```bash [合并音视频]
ffmpeg -i a.mp4 -i a.m4a -vcodec copy -acodec copy a1.mp4
```
```bash [视频去除音频]
ffmpeg -i video.mp4 -vcodec copy -an video2.mp4
```

:::

## 视频裁剪

因为微信只能发送不超过5分钟的视频，所以需要进行裁剪。

```bash
# 从0秒开始，裁剪到5分钟
ffmpeg -i a.mp4 -ss 00:00:00.0 -to 00:05:00.0 out.mp4

# 从5分钟开始，裁剪到最后
ffmpeg -i a.mp4 -ss 00:05:00.0 out2.mp4
```

## 给视频加水印

参考: [使用ffmpeg给视频添加图片及文字水印](https://www.jianshu.com/p/c0e151775075)

### 添加图片水印

```bash
# 在视频右下角加水印
ffmpeg -i draw.io.mp4 -i qrcode.jpg -filter_complex 'overlay=main_w-overlay_w-10:main_h-overlay_h-10' draw.io.mp4.output.mp4

# 在视频左下角加水印
ffmpeg -i draw.io.mp4 -i qrcode.jpg -filter_complex 'overlay=x=10:y=main_h-overlay_h-10' draw.io.mp4.lb.output.mp4

# 在视频右上角加水印
ffmpeg -i draw.io.mp4 -i qrcode.jpg -filter_complex 'overlay=main_w-overlay_w-10:y=10' draw.io.mp4.rt.output.mp4

# 在视频左上角加水印
ffmpeg -i draw.io.mp4 -i qrcode.jpg -filter_complex 'overlay=x=10:y=10' draw.io.mp4.lt.output.mp4
```

### 添加文字水印

```bash
# 添加文字水印
ffmpeg -i draw.io.mp4 -vf "drawtext=fontfile=Alibaba-PuHuiTi-Regular.otf: text='技术是第一生产力':x=10:y=10:fontsize=26:fontcolor=#ff1e56" output.mp4
```

