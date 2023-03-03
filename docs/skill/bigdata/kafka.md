# Kafka

## 简介

### 如何启动Kafka

```bash
# 启动Kafka
./kafka-server-start.sh ../config/server.properties 

# 部分日志
[2019-10-24 11:48:48,754] INFO Awaiting socket connections on 0.0.0.0:9092. (kafka.network.Acceptor)
[2019-10-24 11:48:48,896] INFO [Kafka Server 0], started (kafka.server.KafkaServer)

```

### 测试发送消息

```bash

# 创建topic
./kafka-topics.sh --create --zookeeper 127.0.0.1:2181 -replication-factor 1 --partitions 3 --topic mydemo1 
Created topic "mydemo1".

# 创建生产者(发送消息)
./kafka-console-producer.sh --broker-list 127.0.0.1:9092 --topic mydemo1

# 创建消费者(接收消息)
./kafka-console-consumer.sh --zookeeper 127.0.0.1:2181 --topic mydemo1

```
