# Swarm实战

## Swarm实战

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



### 创建注册中心Registry

`compose.yml`

```yaml
version: '3'

services:

  # 注册中心
  registry:
    container_name: registry
    image: registry:2.8.1
    restart: on-failure
    ports:
      - 5000:5000
    volumes:
      - registry:/var/lib/registry
    environment:
      TZ: Asia/Shanghai

volumes:
  registry:

networks:
  default:
    driver: overlay
    name: 'open-net'
```



推送镜像到注册中心

```bash
# 启动容器
docker-compose up -d 

# 查看所有镜像
curl -X GET localhost:5000/v2/_catalog

# 测试推送镜像
# 拉取镜像
docker pull busybox:latest
docker tag busybox:latest 127.0.0.1:5000/busybox
docker push 127.0.0.1:5000/busybox
```





### 数据共享卷

```bash
# 安装插件(所有节点都需要)
docker plugin install --grant-all-permissions vieux/sshfs

# ssh免密登录

# 创建卷
docker volume create --driver vieux/sshfs \
  -o sshcmd=root@172.17.0.5:/opt/docker/volumes/sshvolume \
  sshvolume

# docker service create -d \
  --replicas=3 \
  --volume-driver vieux/sshfs \
  --network=gupaoedu-net \
  --name devtest-service \
  --mount source=sshvolume,destination=/usr/share/nginx/html \
  nginx:latest

docker run -d \
  --name sshfs-container \
  --volume-driver vieux/sshfs \
  --mount src=sshvolume,destination=/usr/share/nginx/html \
  nginx:latest
```



## 参考

- https://docs.docker.com/storage/volumes/
- 
