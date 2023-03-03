---
title: Elastic经典-快速搭建ElasticSearch
date: 2022-01-16 01:53:25
tags:
 - Elastic
categories:
---

## Elastic经典-快速搭建ElasticSearch

一、编辑 `compose.yml`文件

```yaml
version: '3'

services:

  elasticsearch:
    image: elastic/elasticsearch:7.16.0
    container_name: elasticsearch
    restart: unless-stopped
    # privileged: true
    # user: root
    environment:
      - TZ=Asia/Shanghai
      - "node.name=elasticsearch"
      - "discovery.type=single-node"
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - "xpack.security.enabled=true"
      - "xpack.security.authc.api_key.enabled=true"
      - "ELASTIC_PASSWORD=xxxx"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - ./elasticsearch/data:/usr/share/elasticsearch/data
      # - ./elasticsearch/plugins:/usr/share/elasticsearch/plugins
      - ./elasticsearch/logs:/usr/share/elasticsearch/logs
    ports:
      - 9200:9200

networks:
 default:
   name: 'es-single-net'
```

二、启动容器

```bash
docker-compsoe up -d
```

三、访问服务

[http://127.0.0.1:9200/](http://127.0.0.1:9200/)

输入账号密码即可

<!-- more --> 

正常访问

![image-20220116020155593](https://s2.loli.net/2022/01/16/palQGA5gbe8mXVU.png)

