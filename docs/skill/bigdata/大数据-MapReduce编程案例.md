---
title: 大数据-MapReduce编程案例
date: 2019-10-12 16:07:50
tags:
 - hadoop
 - mapreduce
categories:
 - 大数据
---

## 数据去重

* SQL去重: distinct
* 使用MapReduce实现:
  * 利用`k2`->`k3`自动去重实现

## 多表查询-等值连接

数据库里面的多表查询

* 笛卡尔积：列数相加、行数相乘
* 根据连接条件的不同
  * 等值连接
  * 不等值连接
  * 外链接
  * 自连接

数据处理分析

![05-23-分析等值连接的处理过程-0008](http://pic.qn.prodapi.cn/typora/hexo/thomas/d2eo3.png)

<!--more-->

## 多表查询-自连接

数据处理分析

![05-25-分析自连接的处理过程-0001](http://pic.qn.prodapi.cn/typora/hexo/thomas/u2859.png)





## 倒排索引

实现倒排索引

数据处理分析

![倒排索引数据处理的过程](http://pic.qn.prodapi.cn/typora/hexo/thomas/dn02e.png)





## 框架MRUnit：单元测试

类似JUnit，执行单元测试，可以直接在IDE中执行MR程序。







