# Scrapy


## 快速开始

### 安装

```shell
pip3 install scrapy
```

### 新建项目

```bash
scrapy startproject houser
```

生成的文件

```bash
houser/
├── houser
│   ├── __init__.py
│   ├── __pycache__
│   ├── items.py
│   ├── middlewares.py
│   ├── pipelines.py
│   ├── settings.py
│   └── spiders
│       ├── __init__.py
│       └── __pycache__
└── scrapy.cfg

4 directories, 7 files
```

### 生成spider文件

设置起始页（进入spiders目录，然后生成）

```bash
scrapy genspider houser_spider www.cszjw.net
```

运行爬虫（需要回到工程根目录）

```bash
scrapy crawl spider_houser
```

从程序运行

```python
from scrapy import cmdline
cmdline.execute('scrapy crawl code'.split(' '))

# 输出csv格式
cmdline.execute('scrapy crawl code -o code.csv'.split(' '))

# 限制爬取数量
cmdline.execute('scrapy crawl code -s CLOSESPIDER_ITEMCOUNT=10'.split(' '))
```

### 设置

settings.py

```python
ROBOTSTXT_OBEY = False

DEFAULT_REQUEST_HEADERS = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
}

ITEM_PIPELINES = {
   'citycode.pipelines.CitycodePipeline': 300,
}
```

框架图


