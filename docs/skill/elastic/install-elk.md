# 快速搭建ELK

## Elastic经典-快速搭建ELK

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
      # - ./elasticsearch/logs:/usr/share/elasticsearch/logs
    ports:
      - 9200:9200
    
  kibana:
    image: elastic/kibana:7.16.0
    container_name: kibana
    restart: unless-stopped
    depends_on:
      - elasticsearch
    ports:
      - 5601:5601
    environment:
      - TZ=Asia/Shanghai
      - I18N_LOCALE=zh-CN
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
      - ELASTICSEARCH_USERNAME=elastic
      - ELASTICSEARCH_PASSWORD=xxxx

  logstash:
    image: elastic/logstash:7.16.0
    container_name: logstash
    restart: unless-stopped
    depends_on:
      - elasticsearch
    environment:
      - TZ=Asia/Shanghai
      - "LS_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - ./logstash/pipeline/logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - 4560:4560


networks:
 default:
   name: 'es-kibana-logstash-net'
```

新建目录配置文件 `./logstash/pipeline/logstash.conf`

```ruby
input {
  tcp {
    mode => "server"
    host => "0.0.0.0"
    port => 4560
    codec => json_lines
  }
}
output {
  elasticsearch {
    hosts => "elasticsearch:9200"
    user => "elastic"
    password => "xxxx"
    index => "logstash-%{+YYYY.MM.dd}"
  }
}
```

二、启动容器

```bash
docker-compsoe up -d
```

三、访问服务

[http://127.0.0.1:5601/](http://127.0.0.1:5601/)

打开登录页面，输入账号密码即可

![image-20220116080906087](./assets/jJCvLcRrhWSnxMd.png)
