---
title: SIP协议实战
date: 2020-04-01 14:07:37
tags:
 - SIP
categories:
 - 后端
---

## SIP协议基础

> 简介：
>
> SIP (Session Initiation Protocol) 全称会话初始协议

参考

* SIP协议测试工具 [https://github.com/SIPp/sipp](https://github.com/SIPp/sipp)
* SIP协议测试工具示例 [https://github.com/pbertera/SIPp-by-example](https://github.com/pbertera/SIPp-by-example)

### 安装sipp

```bash
# 安装
brew install sipp
```

<!-- more -->

### 测试

```bash
# 启动SIP服务端（UAS）
sipp -sn uas

# 运行SIP客户端（UAC）
sipp -sn uac 127.0.0.1
```

