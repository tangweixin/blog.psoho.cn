#  android-adb

## 基本命令

```bash
# 显示设备列表 （需要手机开启调试模式、并且接好数据线）
adb devices 

# 进入指定的shell
adb -s ********* shell

# 显示包名
adb shell pm list packages 

# 显示安装包所在位置
adb shell pm list packages -f

# 获取apk包
adb pull /data/app/com.tencent.tbs-1/base.apk ~/Downloads

# 获取当前运行的程序的包名
adb shell dumpsys window | grep 'mCurrentFocus'
  mCurrentFocus=Window{e15545f u0 com.ss.android.article.news/com.ss.android.article.news.activity.MainActivity}
  
# 安装apkbao
adb install -r /Users/thomas/Downloads/getui_sdk.apk 
```

## 截屏

```bash

# 保存截屏
adb shell screencap -p /sdcard/screen.png

# 拉取截屏图片到桌面
adb pull /sdcard/screen.png ~/Desktop/

# 保存截屏直接输出到桌面
adb shell screencap -p > ~/Desktop/screen.png
```

### 获取UI详细信息

参考: 

* [python通过手机号获取微信男女性别](https://blog.csdn.net/m0_38124502/article/details/80549907?utm_source=blogxgwz9)

```bash
# 获取UI详细信息（有些app获取不要-如支付宝）
adb shell uiautomator dump && adb shell cat /sdcard/window_dump.xml > wx.nan.xml 

# 由于xml没有格式化，需要格式化处理下
xmllint --format nv.xml

#### 扩展 ####
# 获取微信性别
xmllint --format nv.xml | grep 'resource-id="com.tencent.mm:id/b2c"' | awk -F 'content-desc="' '{print substr($2, 1, 3)}' 
男
```

