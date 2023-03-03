---
title: 大数据-SparkStreaming
date: 2019-10-23 09:09:03
tags:
 - Spark
 - SparkStreaming
categories:
 - 大数据
---

## 概念

### 什么是SparkStream？

Spark Streaming makes it easy to build scalable fault-tolerant streaming applications.

特点：

* 易用，已经集成在Spark中
* 容错性：底层也是RDD
* 支持Java、Scala、Python语言

### 核心组件

* StreamingContext
* DStream(离散流)
* DStream的

### DStream离散流

不连续的RDD

![22-03-什么是DStream和转换操作-0001](http://pic.qn.prodapi.cn/typora/hexo/thomas/kh0dc.png)

算子：

* transform
* updateStateByKey
* 

