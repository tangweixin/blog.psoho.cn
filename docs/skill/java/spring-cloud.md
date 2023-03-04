# Spring-Cloud


## Spring-Cloud

### 单体应用

* 优点
  * 架构简单
  * 开发、测试、部署方便
* 缺点
  * 复杂性高
    * 模块过多
    * 模块之间的边界模糊
    * 代码质量参差不齐
  * 部署慢，部署频率低
    * 应用大
    * 全量部署
    * 影响范围大
    * 上线风险高
  * 扩展能力受限
  * 阻碍技术创新

### 微服务

架构方法论，架构、开发、测试、部署机制

#### 特性

* 每个微服务可以独立运行在自己的进程里
* 一系列独立运行的微服务共同构建起整个系统
* 每个服务为独立的业务开发，一个微服务只关注某个特定的功能，例如订单管理、用户管理等
* 可以使用不同的语言和数据存储技术（契合项目情况和团队实力）
* 微服务之间通过轻量的通信机制进行通信，例如：`REST API`进行调用。
  * 协议轻量
  * 跨平台
* 全自动的部署机制。

#### 优点

* 单个服务更易于开发、维护
* 单个服务启动较快
* 局部修改容易部署
* 技术栈不受限制
* 按需伸缩

#### 缺点

* 运维要求高
* 分布式应用固有的复杂性（网络延迟、分布式事务）
* 重复劳动

#### 微服务适用场景

* 大型、复杂的项目
* 访问压力大（去中心化）
* 快速迭代的需求

#### 微服务不适用的场景

* 业务稳定（维护项目）
* 迭代周期长
* 

### 微服务拆分

项目初期、不建议把服务拆的太细，后期如果发现某个服务过于庞大，再做拆分。

* 良好的满足业务
* 开发人员的幸福感
* 增量迭代
* 持续进化

项目架构图


## Spring-Cloud-Alibaba

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




## 项目实战

### 创建项目

* 技术选型
  * Spring-boot（快速开发）
  * Spring-mvc（MVC框架）
  * Mybatis（持久层框架）
  * 
* 工程结构规划
* 创建项目、整合框架

包结构规划

> 励志
>
> 你定位问题比别人快，别人解决不了的问题你能解决。往往只是因为你比别人投入了更多精力，花费了更多时间，仅此而已。
