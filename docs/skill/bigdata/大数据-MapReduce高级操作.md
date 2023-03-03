---
title: 大数据-MapReduce高级操作
date: 2019-10-11 22:07:57
tags:
 - MapReduce
categories:
 - 大数据
---

## 高级操作

### 一、序列化

* Java序列化
* MapReduce序列化
  * 核心接口`Writeable`，如果一个类实现了`Writeable`接口，则该类的对象可以作为key和value



### 二、排序

可以创建自己的比较器改变排序规则 `job.setSortComparatorClass(MyTextComparator.class);`

* 规则： 按照k2排序
* 基本数据类型：
  * 数字： 升序排序 `123456`
  * 字符串：字典顺序 `abcdef`
* 对象
  * SQL排序：
    * Order by 后面：列名、表达式、列的别名、序号（从1开始）、多个列
    * desc: 倒序，asc: 正序
    * 排序后得到的结果放在临时表里面
  * 排序：
    * 一个列排序
    * 多个列排序
  * 前提：
    * 该对象必须是K2
    * 必须实现序列化接口：Writeable
    * 对象必须是可排序的：Comparable
    * hadoop里面需要实现接口：`WriteableComparable`
* MapReduce的二次排序--略

<!--more-->

### 三、分区

#### 什么是分区？partition

![05-16-什么是Hash分区-0003](http://pic.qn.prodapi.cn/typora/hexo/thomas/o3nuo.png)

#### MapReduce分区

默认情况下，MR输出只有一个分区，一个分区就是一个文件

根据Map的输出<k2, v2>进行分区

```bash
# 分区的输出结果
/output/20191012/d5/_SUCCESS
/output/20191012/d5/part-r-00000
/output/20191012/d5/part-r-00001
/output/20191012/d5/part-r-00002
```

### 四、合并

#### Combiner概念

* 合并是一种特殊的Reducer
* 合并是在Mapper端执行一次合并，用于减少Mapper输出到Reducer的数据量（减少网络开销），可以提高效率。
* 举例，以wordcount为列

### Combiner的作用（工作原理）

![Combiner的作用](http://pic.qn.prodapi.cn/typora/hexo/thomas/8tnt2.png)

使用combiner改造WordCount程序

![05-18-什么是Combiner-0004](http://pic.qn.prodapi.cn/typora/hexo/thomas/ut2x2.png)

#### 哪些情况不能使用Combiner

不能改变K3, V3输入数据的类型，否则会报错。

`Mapper` -> `Combiner` -> `Reducer`

![05-19-不能使用Combiner的情况-0005](http://pic.qn.prodapi.cn/typora/hexo/thomas/iaa72.png)



## MapReduce核心-Shuffle(洗牌)

Hadoop3.x以前，会有数据落地（产生I/O操作）

![05-20-Shuffle的过程-0007](http://pic.qn.prodapi.cn/typora/hexo/thomas/r3yvu.png)





