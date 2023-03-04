# RocksDB

## Rocksdb

`RocksDB`是Facebook基于`Level-DB`开发的高性能纯K-V数据库，原生支持`C++`和`Java`

相关网页

* [官网](https://rocksdb.org/)
* [pyrocksdb](https://github.com/stephan-hof/pyrocksdb)

### 安装

#### 方式一（Max OS X）

```bash
# Mac OSX 安装RocksDB
brew install rocksdb
# Python安装RocksDB
pip3 install python-rocksdb
```

#### 方式二（docker）

```bash
# 使用docker运行
docker run --rm -it -v $PWD/hello.py:/hello.py tangweixin/rocksdb python /hello.py
```

### python示例

```python
# python示例
import rocksdb
db = rocksdb.DB("test.db", rocksdb.Options(create_if_missing=True))
db.put(b'a', b'data')
print(db.get(b'a'))
# b'data'
```



