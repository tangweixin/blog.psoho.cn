# 大数据概述

## 什么是大数据

### 电商推荐系统

* 大量的订单如何存储
* 大量的订单如何计算

### 天气预报

* 大量的天气数据如何存储
* 大量的天气数据如何计算

### 核心问题

* 数据的存储
  * 分布式文件系统 `HDFS`(Hadoop Distributed File System)
* 数据的计算
  * 分布式的计算 `MapReduce` `Spark`(RDD 弹性分布式数据集)

## 数据仓库和大数据

<!--more-->

### 数据仓库（Data Warehouse）

数据仓库就是一个数据库（Oracle, MySQL, MS），一般只做查询。

#### 搭建数据仓库的过程

* 数据源
  * 结构化数据：RDBMS
  * 非结构化数据：文本、日志
* TEL
  * 抽取 > 转换 > 加载
* 数据仓库
  * 原始数据
* 数据分析
  * SQL
  * PL/SQL
  * JDBC程序
* 数据集市
  * HR数据集市
  * 销售数据集市
* 最终用户
  * HR系统
  * 销售系统

## OLTP和OLAP

* OLTP: Online Transaction Processing 联机事务处理（update, insert, delete）传统关系型数据库需要解决的问题
* OLAP: Online Analytic Processing 联机分析处理（select）。数据仓库就是一种OLAP的应用系统。Hadoop、Spark看成是一种数据仓库的解决方案。

## Google的基本思想，三篇论文

###  一、GFS

为何有了Oracle，还需要HDFS、GFS？

- 瓶颈和成本太高
- Google的低成本之道

Google File System  --> HDFS

1. 分布式文件系统
2. 大数据的存储问题
3. HDFS中，记录数据保存的位置信息（元信息），采用倒排索引（Reverted Index）
   1. 什么是索引
      1. 其实就是一个目录
      2. 通过索引，快速找到对应的数据
   2. 什么是倒排索引
      1. 分词 > 去重 > 排序

#### HDFS的体系架构

* Name Node: 名称节点
* Secondary Name Node: 第二名称节点
* Data Node: 数据节点

#### Hadoop安装部署模式

* 本地模式
* 伪分布模式
* 全分布模式

`HDSF = NameNode + SecondaryNameNode + DataNode`


### 二、MapReduce

PageRank网页排名  --> MapReduce

`Yarn = ResourceManager + NodeManager`

启动节点

* [查看HDFS状态](http://127.0.0.1:50070)
* [查看Yarn状态](http://127.0.0.1:8088)

运行单词统计

```bash
# 单词统计
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0.jar wordcount /input/data.txt /output/20191011/wc

# 部分日志
19/10/11 08:48:52 INFO client.RMProxy: Connecting to ResourceManager at /0.0.0.0:8032
19/10/11 08:48:53 INFO input.FileInputFormat: Total input paths to process : 1
19/10/11 08:48:53 INFO mapreduce.JobSubmitter: number of splits:1
19/10/11 08:48:53 INFO mapreduce.JobSubmitter: Submitting tokens for job: job_1570754699917_0001
19/10/11 08:48:53 INFO impl.YarnClientImpl: Submitted application application_1570754699917_0001
19/10/11 08:48:53 INFO mapreduce.Job: The url to track the job: http://127.0.0.1:8088/proxy/application_1570754699917_0001/
19/10/11 08:48:53 INFO mapreduce.Job: Running job: job_1570754699917_0001
19/10/11 08:48:58 INFO mapreduce.Job: Job job_1570754699917_0001 running in uber mode : false
19/10/11 08:48:58 INFO mapreduce.Job:  map 0% reduce 0%
19/10/11 08:49:01 INFO mapreduce.Job:  map 100% reduce 0%
19/10/11 08:49:05 INFO mapreduce.Job:  map 100% reduce 100%
19/10/11 08:49:05 INFO mapreduce.Job: Job job_1570754699917_0001 completed successfully
19/10/11 08:49:05 INFO mapreduce.Job: Counters: 49
	File System Counters
		FILE: Number of bytes read=93
		FILE: Number of bytes written=211351
		FILE: Number of read operations=0
		FILE: Number of large read operations=0
		FILE: Number of write operations=0
		HDFS: Number of bytes read=160
		HDFS: Number of bytes written=55
		HDFS: Number of read operations=6
		HDFS: Number of large read operations=0
		HDFS: Number of write operations=2
	Job Counters 
		Launched map tasks=1
		Launched reduce tasks=1
		Data-local map tasks=1
		Total time spent by all maps in occupied slots (ms)=1349
		Total time spent by all reduces in occupied slots (ms)=1492
		Total time spent by all map tasks (ms)=1349
		Total time spent by all reduce tasks (ms)=1492
		Total vcore-seconds taken by all map tasks=1349
		Total vcore-seconds taken by all reduce tasks=1492
		Total megabyte-seconds taken by all map tasks=1381376
		Total megabyte-seconds taken by all reduce tasks=1527808
	Map-Reduce Framework
		Map input records=3
		Map output records=12
		Map output bytes=108
		Map output materialized bytes=93
		Input split bytes=101
		Combine input records=12
		Combine output records=8
		Reduce input groups=8
		Reduce shuffle bytes=93
		Reduce input records=8
		Reduce output records=8
		Spilled Records=16
		Shuffled Maps =1
		Failed Shuffles=0
		Merged Map outputs=1
		GC time elapsed (ms)=45
		CPU time spent (ms)=0
		Physical memory (bytes) snapshot=0
		Virtual memory (bytes) snapshot=0
		Total committed heap usage (bytes)=347602944
	Shuffle Errors
		BAD_ID=0
		CONNECTION=0
		IO_ERROR=0
		WRONG_LENGTH=0
		WRONG_MAP=0
		WRONG_REDUCE=0
	File Input Format Counters 
		Bytes Read=59
	File Output Format Counters 
		Bytes Written=55




# 查看运行结果
hdfs dfs -cat /output/20191011/wc/part-r-00000
Beijing	2
China	2
I	2
capital	1
is	1
love	2
of	1
the	1

```

### 三、BigTable

大表 --> HBase

`HBase = Zookeeper + HMaster(主节点) + RegionServer(从节点)`

