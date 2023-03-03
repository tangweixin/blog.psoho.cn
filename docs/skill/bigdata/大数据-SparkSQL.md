---
title: 大数据-SparkSQL
date: 2019-10-19 09:11:37
tags:
 - Spark
 - SparkSQL
categories:
 - 大数据
---

## 概念

### 基本概念

1. 什么是Spark SQL，特点
   1. Spark SQL is Apache Spark's module for working with structured data.
   2. 用于处理结构化机数据的一个模块
   3. 特点
      1. 容易集成：不需要单独安装
      2. 统一的数据访问方式：JDBC、JSON、Hive、Parquet(SparkSQL默认的数据源)
      3. 兼容Hive
      4. 标准的数据连接：JDBC、ODBC
2. 为什么要学习SparkSQL
   1. 基于Spark(内存)，效率比较高，相对于Hive，不过可以配置Hive on Spark。
3. 核心概念
   1. 表（DataFrame或者DataSet）
   2. DateFrame = Schema（结构） + RDD （数据）
4. 创建DataFrame
   1. 使用case class
      1. 定义表的schema
   2. 使用Spark Session
      1. Spark 2.0之后，提供的统计操作接口
   3. 直接读取一个带格式的文件
5. 创建Dataset
   1. 使用case class
   2. 使用saprk session
   3. 直接读取一个带格式的文件
6. 视图
   1. 本地视图
      1. 只在当前session中有效，退出后就不可用了。
   2. 全局视图
      1. 可以在不同的session中使用





