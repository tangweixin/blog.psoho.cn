---
title: spring-cloud-alibaba
date: 2020-11-21 22:46:16
tags:
 - spring
categories:
 - java
---

## Spring Cloud Alibaba

### 什么是Spring Cloud

* 快速构建分布式应用的工具集

什么是Spring Cloud Alibaba

* Spring Cloud的子项目
* 致力于提供微服务开发的一站式解决方案
  * 包含微服务开发的必备组件
  * 基于`Spring Cloud`，符合`Spring Cloud`标准
  * 阿里巴巴的微服务解决方案

工具集

常用子项目

## 负载均衡

* 服务器端的负载均衡
  * nginx
* 客户端的负载均衡
  * ribbon



参考：

* [学习笔记](https://www.imooc.com/article/288660)
* [spring-cloud](https://spring.io/projects/spring-cloud)
* https://github.com/alibaba/spring-cloud-alibaba
* [nacos](https://nacos.io/zh-cn/)
* [https://github.com/alibaba/nacos](https://github.com/alibaba/nacos)
* https://github.com/alibaba/Sentinel
* https://github.com/apache/dubbo
* https://github.com/seata/seata
* https://github.com/OpenFeign/feign
* https://docs.spring.io/spring-cloud-openfeign/docs/2.2.5.RELEASE/reference/html/
* https://rocketmq.apache.org/
* 

### Feign

#### 配置优先级

`全局代码` < `全局属性` < `细粒度代码` < `细粒度属性`

> 尽量使用属性配置

`RestTemplate` VS `Feign`

在一个项目中，只使用`Feign`，

共存带来的，往往不是相得益彰；而是，风格的不同意，额外的学习成本，额外的代码理解成本。

#### Feign性能优化

* 连接池，提升15%左右
* 日志配置，使用basic。

#### 常见问题

* [学习笔记](https://www.imooc.com/article/289005)

