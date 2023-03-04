---
title: spring-cloud-alibaba-sentinel
date: 2020-12-03 17:32:33
tags:
 - spring
categories:
 - java
---

## Spring Cloud Alibaba Sentinel

控制台下载 

* [https://github.com/alibaba/Sentinel/releases](https://github.com/alibaba/Sentinel/releases)

### 雪崩效应

每个微服务不是百分百可用的，如果某个时间点，A服务挂了，B服务发往A的请求也会强制等待，线程无法释放。由于是高并发系统，服务器堆积的线程越来越多。

基础服务故障导致上层服务故障，故障不断放大的过程叫做雪崩效应，也叫级联失效（`Cascadding Failure`）。

### 针对来源

默认default，可以指定微服务名称

### 常见容错方案

* 超时（设置一个比较短的超时时间）
* 限流（设置一个低于阈值的QPS值）
* 舱壁模式（泰坦尼克号，不把鸡蛋放一个篮子里）
* 断路器模式（跳闸：5秒内的错误率、错误次数）

### 流控规则

* 直接（当自己的资源达到阈值，就执行限流）
* 关联（当关联的资源达到阈值，就限流自己）
* 链路
  * 只记录指定链路上的流量（细粒度的针对来源，API级别

#### 流控效果

* 快速失败，直接失败
* Warm Up 预热（一定时间后才会达到阈值，让允许通过的流量缓慢增加）
* 排队等待（匀速排队），阈值类型只能用QPS，不能用线程

### 降级规则（断路器模式）

`@SentinelResource`

RT默认最大4900ms，可通过`-Dcsp.sentinel.statistic.max.rt=xxx`修改

### 热点规则

用在热点参数控制，必须是基本类型或者String。

### 系统规则

根据系统负载情况进行控制

### 授权规则

黑、白名单

### 集群流控





