# Tesseract

## Tesseract-文字识别

> Tesseract是一款很强大的文字识别引擎

参考

* [官网](https://github.com/tesseract-ocr/tesseract)
* [语言包下载](https://github.com/tesseract-ocr/tessdata)
* [源码编译安装](https://tesseract-ocr.github.io/tessdoc/Compiling.html#macos)
* [Tesseract-文字识别工具](https://cloud.tencent.com/developer/article/1439206)
* [源码下载-4.1.1.tar.gz](https://github.com/tesseract-ocr/tesseract/archive/4.1.1.tar.gz)

## 快速开始

### 安装

```bash

# 安装基本工具
brew install tesseract

# 安装语言包（中文需要）
brew install tesseract-lang

# 此种方式已经不行了，如果需要自己做训练，请使用源码编译安装
# brew install tesseract --HEAD --with-training-tools

# 字库路径
# /usr/local/Cellar/tesseract/4.1.1/share/tessdata/
```

### 使用示例

```bash
# 最简形式
tesseract test.png stdout

# 指定语言(默认eng)
tesseract test.png stdout -l eng

# 显示所有可用语言
tesseract --list-langs

# 使用白名单
tesseract -c tessedit_char_whitelist=0123456789abcedf test.png stdout
```

### 通过python调用

```python
import pytesseract
from PIL import Image

def main():
    """
    限定字符集为MD5
    :return:
    """
    img = Image.open("test.jpg")

    # 使用白名单
    text = pytesseract.image_to_string(img, config=f"-c tessedit_char_whitelist=0123456789abcedf")
    print(text)

if __name__ == '__main__':
    main()
```

>  识别效果(不是很理想，存在遗漏的情况)

## 提高识别率

### 图像处理

通过图像二值化处理，提高识别率

```python
import pytesseract
from PIL import Image

def threshold(img, threshold=180):
    """
    二值化处理
    :param img:
    :param threshold:
    :return:
    """
    img = img.convert('L')
    table = []
    for i in range(256):
        if i < threshold:
            table.append(0)
        else:
            table.append(1)
    return img.point(table, '1')


def main():
    """
    限定字符集为MD5
    :return:
    """
    img = Image.open("test.jpg")

    # 图像二值化处理（经过二值化处理，可以明显减少空格的误识别）
    img = threshold(img)
    # img.show()

    # 使用白名单
    text = pytesseract.image_to_string(img, config=f"-c tessedit_char_whitelist=0123456789abcedf")
    print(text)

if __name__ == '__main__':
    main()
```

> 识别效果（还是有漏识别和误识别的情况）

```tex
038528a8058d4f8f023a072fffb95928
0799b72aa4c856d8161ce3bd959ce2ea
19285f940745eaefc4b0ee1beb81865e
1b5ec3d583190608a01788b19b4baf4
1e1b0e80035a03dc58eca27df6eade5
1f7c96c1f2829e3b816429e2c0914cb4
23a661e827e82f2ba987193a73482e51
31dc012a71f28997f181e0b3b43f2f16
369a395fa1122565ba921251bd3784c2
3c56e1d2562deb950986bc75731702bb
3ea1d43e2bbdd7a599d239cd1c8440057
3f14aef3544d560f966b0e01c15d2136
```

### 使用训练字库

[使用训练字库](https://blog.psoho.cn/2020/04/08/Tesseract-%E8%AE%AD%E7%BB%83%E5%AD%97%E5%BA%93/)

## Tesseract-训练字库

由于业务需要识别纯MD5的文本。

网上找了一圈，各种号称`AI`加持的识别效果并不理想。所以，还是自己动手，丰衣足食。

由于Tesseract默认的字库识别率低、完整度不高，需要训练自己的字库来识别。

参考

* [训练字库](https://tesseract-ocr.github.io/tessdoc/TrainingTesseract-4.00.html)
* [源码编译安装训练工具-中文参考](https://pengshiyu.blog.csdn.net/article/details/104398303)
* [Tesseract4.0训练字库](https://blog.csdn.net/a745233700/article/details/80175883)
* [使用Tesseract训练lang文件并OCR识别集装箱号](https://www.jianshu.com/p/5f847d8089ce)

### 安装训练工具

```bash
# 安装依赖
# Packages which are always needed.
brew install automake autoconf libtool
brew install pkgconfig
brew install icu4c
brew install leptonica
# Packages required for training tools.
brew install pango
# Optional packages for extra features.
brew install libarchive
# Optional package for builds using g++.
brew install gcc

# 下载编译
git clone https://github.com/tesseract-ocr/tesseract/
cd tesseract
./autogen.sh
mkdir build
cd build
# Optionally add CXX=g++-8 to the configure command if you really want to use a different compiler.
../configure PKG_CONFIG_PATH=/usr/local/opt/icu4c/lib/pkgconfig:/usr/local/opt/libarchive/lib/pkgconfig:/usr/local/opt/libffi/lib/pkgconfig
make -j
# Optionally install Tesseract.
sudo make install
# Optionally build and install training tools.
make training
sudo make training-install
```

下载`jTessBoxEditor`工具，下载地址[jTessBoxEditor-2.3.0.zip](https://sourceforge.net/projects/vietocr/files/jTessBoxEditor/jTessBoxEditor-2.3.0.zip/download)

### 准备图片素材

## 开始操作

### 准备tif素材

```bash
# 素材命名规范[lang].[fontname].exp[num].tif
convert md5.jpg md5.test.exp0.tif

# convert 为imagemagick的工具，请自行安装
# brew search imagemagick
```

### 使用tesseract生成.box文件

```bash
# 生成box文件
tesseract md5.test.exp0.tif md5.test.exp0 batch.nochop makebox

# 使用白名单生成
tesseract md5.test.exp0.tif md5.test.exp0 -c tessedit_char_whitelist=0123456789abcedf batch.nochop makebox

# 使用已有字库生成（推荐）
tesseract md5.test.exp0.tif md5.test.exp0 -l md5 batch.nochop makebox
```

### 使用jTessBoxEditor修正.box文件

>  建议先使用少量样本，生成一个初步版的字库。然后再使用更多的样本来生成更复杂的字库。

可以使用`合并`、`切割`、`插入`、`删除`完成box字库的修正操作。这一步很关键，影响识别率。



### 生成font_properties文件

生成`font_properties`文件

```bash
# 生成font_properties文件
echo test 0 0 0 0 0 > font_properties
```

### 使用tesseract生成.tr训练文件

生成`md5.test.exp0.tr`文件

```bash
tesseract md5.test.exp0.tif md5.test.exp0 nobatch box.train
```

### 生成字符集文件

生成`unicharset`文件

> 这里如果没有安装好训练工具会提示unicharset_extractor命令不存在

```bash
unicharset_extractor md5.test.exp0.box
```

### 生成shape文件

```bash
shapeclustering -F font_properties -U unicharset -O md5.unicharset md5.test.exp0.tr
```

### 生成聚字符特征文件

生成 `inttemp`、`pffmtable`、`shapetable`和`md5.unicharset`文件

```bash
mftraining -F font_properties -U unicharset -O md5.unicharset md5.test.exp0.tr
```

### 生成字符正常化特征文件

生成 `normproto` 文件

```bash
cntraining md5.test.exp0.tr
```

### 文件重命名

重命名inttemp、pffmtable、shapetable和normproto这四个文件的名字为[lang].xxx。

```bash
mv normproto md5.normproto
mv inttemp md5.inttemp
mv pffmtable md5.pffmtable
mv shapetable md5.shapetable
```

### 合并训练文件

```bash
combine_tessdata md5.
# offset 1、3、4、5、13这些项不是-1，表示新的字库生成成功。
Combining tessdata files
Output md5.traineddata created successfully.
Version string:4.1.1
1:unicharset:size=1052, offset=192
3:inttemp:size=148852, offset=1244
4:pffmtable:size=152, offset=150096
5:normproto:size=2102, offset=150248
13:shapetable:size=292, offset=152350
23:version:size=5, offset=152642
```

### 拷贝字库到tesseract的字库目录

```bash
cp md5.traineddata /usr/local/share/tessdata/md5.traineddata

# 如果不知道tesseract字库目录在哪里，随便使用一个不存在的字库名称识别一下就会提示错误
#tesseract test.jpg stdout -l xxx

# 提示错误
Error opening data file /usr/local/share/tessdata/xxx.traineddata
Please make sure the TESSDATA_PREFIX environment variable is set to your "tessdata" directory.
Failed loading language 'xxx'
Tesseract couldn't load any languages!
Could not initialize tesseract.
```

## 验证效果

```bash
# 验证字库效果
tesseract test.jpg stdout -l md5
```

## 结合python完整示例

> 先执行图像的二值化，然后调用tesseract进行文本识别，这样效果最佳。

```python
import pytesseract
from PIL import Image


def threshold(img, threshold=180):
    """
    二值化处理
    :param img:
    :param threshold:
    :return:
    """
    img = img.convert('L')
    table = []
    for i in range(256):
        if i < threshold:
            table.append(0)
        else:
            table.append(1)
    return img.point(table, '1')


def main():
    """
    限定字符集为MD5
    :return:
    """
    img = Image.open("test.jpg")

    # 图像二值化处理（经过二值化处理，可以明显减少空格的误识别）
    img = threshold(img)
    # img.show()

    # 使用自定义的训练库
    text = pytesseract.image_to_string(img, lang="md5")
    # text = text.replace(" ", "")
    print(text)


if __name__ == '__main__':
    main()
```
