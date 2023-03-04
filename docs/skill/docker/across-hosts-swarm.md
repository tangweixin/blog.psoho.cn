# Docker-跨主机通信（推荐）

推荐使用 `docker swarm` 实现跨主机通讯

## 安装swarm集群

### 创建`swarm`集群

```bash
# 初始化管理节点
docker swarm init --advertise-addr=<IP-ADDRESS-OF-MANAGER>

# 添加节点
docker swarm join --token <TOKEN> \
  --advertise-addr <IP-ADDRESS-OF-WORKER-1> \
  <IP-ADDRESS-OF-MANAGER>:2377
  
# 查看节点
docker node ls

# 查看网络
docker network ls 

# 离开集群
# docker swarm leave

# 删除集群
# docker swarm leave -f
```



```bash
# 初始化管理节点
root@docker01:~# docker swarm init --advertise-addr=172.17.0.5
Swarm initialized: current node (yzb76l5u402828v3uhpusfv8f) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-4i3w7m3k7lkhukxmcgagn8pcyin7qugmltoi7jropzorfyib0w-cvq57sikpeejb3tpqnrdbf1rq 172.17.0.5:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

root@docker01:~# 

# 添加普通节点
root@docker02:~# docker swarm join --token SWMTKN-1-4i3w7m3k7lkhukxmcgagn8pcyin7qugmltoi7jropzorfyib0w-cvq57sikpeejb3tpqnrdbf1rq 172.17.0.5:2377
This node joined a swarm as a worker.

# 查看节点
root@docker01:~# docker node ls
ID                            HOSTNAME   STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
yzb76l5u402828v3uhpusfv8f *   docker01   Ready     Active         Leader           20.10.17
whd1n03zwlyei0um2h4ywur0m     docker02   Ready     Active                          20.10.17
961ra48kv302itlr8v5ihmqnf     docker03   Ready     Active                          20.10.17
root@docker01:~# 

# ##########################################################################################
# 增加管理节点
root@docker01:~# docker swarm join-token manager
To add a manager to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-4i3w7m3k7lkhukxmcgagn8pcyin7qugmltoi7jropzorfyib0w-dpks47on2ueexia3hl0ce3lfy 172.17.0.5:2377

# 查看节点
root@docker01:~# docker node ls 
ID                            HOSTNAME   STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
yzb76l5u402828v3uhpusfv8f *   docker01   Ready     Active         Leader           20.10.17
2m4plmtiigaquqrwu7rwfa02v     docker02   Ready     Active         Reachable        20.10.17
961ra48kv302itlr8v5ihmqnf     docker03   Ready     Active                          20.10.17
root@docker01:~# 
# ##########################################################################################


# 查看网络
root@docker03:~# docker network ls 
NETWORK ID     NAME              DRIVER    SCOPE
230aef713b00   bridge            bridge    local
3e574696ff60   docker_gwbridge   bridge    local
10bcc6c5dd60   host              host      local
vlay27b818mj   ingress           overlay   swarm
5745ca34a364   none              null      local
root@docker03:~# 
```

### 创建堆栈

```bash

# 创建网络
docker network create -d overlay my-overlay

# 查看网络
docker network ls 

# 删除网络
docker network rm my-overlay

# 创建服务(启动三个副本)
docker service create \
  --name my-nginx \
  --network my-overlay \
  --replicas 3 \
  --publish published=8080,target=80 \
  nginx:latest

# 查看容器
docker ps 

# 删除服务
docker service rm my-nginx
```

### 使用 `my-nginx-stack.yaml` 创建堆栈

```yaml
version: '3.9'

services:
  my-nginx:
    image: nginx:latest
    ports:
      - "8080:80"
    deploy:
      mode: replicated
      replicas: 2
      endpoint_mode: vip
    restart: on-failure

networks:
  default:
    driver: overlay
    name: 'my-overlay'
    attachable: true		# 可以被其他容器访问
    
    # 配置网络（可以忽略）
    ipam:
      driver: default
      config:
        - subnet: "192.168.1.0/24"


# 验证服务是否可以被访问到
# docker run -it --rm --network=my-overlay nicolaka/netshoot
# dig my-nginx
```

 部署堆栈

```bash

# 部署堆栈
docker stack deploy -c my-nginx-stack.yaml demo

# 查看堆栈列表
docker stack ls
root@docker01:~# docker stack ls
NAME      SERVICES   ORCHESTRATOR
demo      1          Swarm

# 查看堆栈的任务列表
docker stack ps demo
root@docker01:~# docker stack ps demo
ID             NAME              IMAGE          NODE       DESIRED STATE   CURRENT STATE           ERROR     PORTS
gj5qq1f5h18l   demo_my-nginx.1   nginx:latest   docker02   Running         Running 7 minutes ago             
zfmvia6p764h   demo_my-nginx.2   nginx:latest   docker01   Running         Running 7 minutes ago             
vszj173nrdtn   demo_my-nginx.3   nginx:latest   docker03   Running         Running 7 minutes ago             
root@docker01:~# 

# 查看堆栈中的服务信息
docker stack services demo
root@docker01:~# docker stack services demo
ID             NAME            MODE         REPLICAS   IMAGE          PORTS
w89yp8530ocp   demo_my-nginx   replicated   3/3        nginx:latest   *:8080->80/tcp
root@docker01:~# 

# 删除堆栈
docker stack rm demo
```





### 操作服务

```bash

# 查看服务
docker service ls

# 查看服务任务
docker service ps <NAME>

# 服务伸缩扩容
docker service scale demo_my-nginx=3

# 查看服务任务
root@docker01:~# docker service ps demo_my-nginx
ID             NAME              IMAGE          NODE       DESIRED STATE   CURRENT STATE            ERROR     PORTS
gj5qq1f5h18l   demo_my-nginx.1   nginx:latest   docker02   Running         Running 15 seconds ago             
zfmvia6p764h   demo_my-nginx.2   nginx:latest   docker01   Running         Running 15 seconds ago             
vszj173nrdtn   demo_my-nginx.3   nginx:latest   docker03   Running         Running 15 seconds ago             
root@docker01:~# 
```



## 参考

- https://docs.docker.com/get-started/swarm-deploy/
- https://docs.docker.com/compose/compose-file/compose-file-v3/
- https://blog.csdn.net/footless_bird/article/details/123817170
- https://docs.docker.com/engine/swarm/swarm-tutorial/
- 

