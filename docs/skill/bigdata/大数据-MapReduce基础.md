# 大数据-MapReduce基础

## 基础知识

分析数据处理的过程（非常，非常，非常重要），遇到问题，一定不要着急写程序，要先把数据处理的过程弄清楚再写程序。

### 运行wordcount程序

```bash
# 运行wordcount统计程序
hadoop jar hadoop-mapreduce-examples-2.6.0.jar wordcount /input/ /output/20191010/wc2

# 查看处理结果
hdfs dfs -ls /output/20191010/wc2
-rw-r--r--   1 thomas supergroup          0 2019-10-11 10:10 /output/20191010/wc2/_SUCCESS
-rw-r--r--   1 thomas supergroup         55 2019-10-11 10:10 /output/20191010/wc2/part-r-00000

# 下划线文件，表示状态文件 _SUCCESS
```

### 分析Wordcount数据处理的过程


<!--more-->

主程序

* 创建任务
* 指定任务的Map和Map输出数据类型
* 指定任务的Reduce和Reduce输出数据类型
* 指定任务的输入、输出路径
* 执行任务

## Yarn调度MapReduce任务的过程

Yarn

* ResourceManager(主节点)
  * 接收客户端任务请求
  * 分配任务和资源(CPU,内存,带宽)
* NodeManager(从节点)
  * 真正执行任务


1. `JobClient`提交任务请求
2. 请求创建任务ID
3. 保存任务(jar包)保存到HDFS上
4. 请求得到文件元信息
   1. 任务的元信息
   2. 数据的元信息
5. 提交任务请求
   1. 任务的元信息
   2. 数据的元信息
   3. 任务ID
6. 分配任务信息
   1. 任务ID
   2. 任务的元信息
   3. 数据的元信息
7. 根据元信息，访问HDFS，去除任务并处理数据
   1. 所以，尽量让`DataNode`和`NodeManager`在一个节点上。



## MapReduce编程案例

### 求部门的工资总额












