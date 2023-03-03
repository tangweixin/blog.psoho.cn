# Spark-基础知识

## Spark-Core

[http://spark.apache.org/](http://spark.apache.org/)

 **Apache Spark™** is a unified analytics engine for large-scale data processing.

特征：

* 快：基于内存，比hadoop3.x之前的运算速度快100倍
* 易用：`Java`,`Python`,
* 通用：生态好，Spark-Core, Spark-SQL, Spark-Streaming, Spark-MLLib, GraphX
* 兼容性好：兼容`hadoop`


为什么`Spark`没法取代`Hadoop`？因为`Spark`只有数据的计算，没有数据的存储。

为什么要学习`Spark`：因为快

## Spark体系架构


## 伪分布模式搭建

```bash
# 修改配置文件
vim conf/spark-env.sh

# 设置系统环境变量
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_202.jdk/Contents/Home
export SPARK_MASTER_HOST=127.0.0.1
export SPARK_MASTER_PORT=7077
```

## 基本操作

### 提交任务

```bash
# 切换到spark目录
cd /Users/thomas/spark

# 提交任务（蒙特卡罗求PI）
spark-submit --master spark://127.0.0.1:7077 --class org.apache.spark.examples.SparkPi examples/jars/spark-examples_2.11-2.1.0.jar 300
```

### Spark-Shell

两种模式：

1. 本地模式：不需要链接到`Spark`集群上，在本地直接运行，用于开发和测试。
   * 命令：bin/spark-shell
   * 日志：`Spark context available as 'sc' (master = local[*], app id = local-1571129149566).`
   
2. 集群模式：真正的连接到`Spark`集群上，
   * 命令：bin/spark-shell --master
   * 日志：`==`
   
3. 在spark-shell开发Wordcount程序

   * 处理本地文件：直接打印结果

     ```scala
     sc.textFile("/Users/thomas/Documents/workspace/idea/me/demo-hadoop/data/input/data.txt").flatMap(_.split(" ")).map((_, 1)).reduceByKey(_+_).collect
     ```

   * 处理HDFS文件： 输出到HDFS上

     ```scala
     // 直接输出
     sc.textFile("hdfs://127.0.0.1:9000/input/data.txt").flatMap(_.split(" ")).map((_, 1)).reduceByKey(_+_).collect
     
     // 存到HDFS上面
     sc.textFile("hdfs://127.0.0.1:9000/input/data.txt").flatMap(_.split(" ")).map((_, 1)).reduceByKey(_+_).saveAsTextFile("hdfs://127.0.0.1:9000/output/20191015")
     
     // 部分输出
     (is,1)
     (love,2)
     (capital,1)
     (Beijing,2)
     ```

分析WordCount数据处理过程

### RDD和RDD的特性、RDD的算子（函数、方法）

* RDD： 弹性分布式数据集 （Reslient Distributed Datasets）
  * 是一组分区，由分区组成，每个分区运行在不同的worker上
  * 算子（函数）：
    * Transformation:  延迟计算，不会触发计算
      * map: 对原来的RDD进行某种操作，返回一个新的RDD
      * filter: 过滤
      * flatMap: 压平操作
      * mapParitions, mapPartitionsWithIndex：对RDDI中的每个分区进行操作
      * sample：采样
      * union，intersection：集合运算
      * distinct：去重
      * groupByKey, reduceByKey, aggregateByKey：聚合操作，分组
      * sortByKey, sortBy：排序
      * join, cogroup, cartesian, pipe：重新分区
      * coalesce, repartition, repartitionAndSortWithinPartitions
    * Action：立即执行计算（例如：打印结果、保存文件等）
      * reduce
      * collect
      * count
      * first
      * take
      * takeSample
      * takeOrdered
      * saveAsTextFile
      * saveAsSequenceFile
      * saveAsObjectFile
      * countByKey
      * foreach：类似map，没有返回值
  * 特性：
    * RDD的缓存机制：默认将RDD的数据缓存在内存中
      * 作用：提高性能
      * 需要手动标识RDD可以被缓存，否则不会缓存。`persist`和`cache`
      * 缓存的位置由`StorageLevel`来确定的
    * RDD的容错：通过检查点（checkpoint）来实现
      * HDFS中：由SecondaryNameNode来进行日志合并
      * Oracle数据库中：完全检查点、增量检查点，会以最高的优先级唤醒数据库的写进程。把内存中的脏数据，写到DB
      * RDD中：
        * Lineage(血统)-->表示任务执行的生命周期、过程
        * 如果血统越长，越容易出错。
      * RDD的类型有两种：
        * 本地目录：需要将spark-shell运行在本地模式上（setMaste("local")），用于开发和测试
        * HDFS的目录：需要把任务运行在集群模式上，真正用于生产
        * 通过调用SparkContext.setCheckpointDir("目录")
    * RDD之间存在依赖关系：根据依赖的关系，来划分任务执行的Stage阶段
      * 宽依赖：类似**超生**，多个子RDD的分区依赖一个父RDD的分区（一对多）
      * 窄依赖：类似**独生子女**，每一个父RDD的分区，最多被一个RDD的分区使用。
  * 可选：自定义分区规则来创建RDD，类似MapReduce中的分区（生成分区文件数）
  
* 如何创建RDD

  * 通过`SparkContext.parallelize`来创建

    ```scala
    val rdd1 = sc.parallelize(Array(1,2,3,4,5,6,7,8), 3)
    rdd1.partitions.length
    ```

  * 通过读取外部的数据源来创建，比如HDFS

    ```scala
    val rdd1 = sc.textFile("hdfs://127.0.0.1:9000/input/data.txt")
    ```

RDD-Aggregate分组求和
