# Docker入门指南

## Docker安装及配置

### 安装

通过脚本安装

```bash
curl -sSL https://get.docker.com/ | sh
```

### 镜像加速

```bash
# 修改配置文件
vim /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://kjeon24c.mirror.aliyuncs.com"
  ]
}

# 粘贴不启用自动缩进
:set noai

https://reg-mirror.qiniu.com
https://registry.docker-cn.com
https://dockerhub.azk8s.cn
https://docker.mirrors.ustc.edu.cn
https://hub-mirror.c.163.com
https://mirror.ccs.tencentyun.com

# 重启docker服务
service docker restart


# 配置指定网段，防止和云服务器IP冲突，导致网络不可访问
vim /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://kjeon24c.mirror.aliyuncs.com"
  ],
  "bip":"192.168.0.1/24"
}
```

## Docker-compse

### 安装

`docker-compose`和`docker`是一对好伙伴，一般用`docker-compse`方便管理镜像和容器，因为手动敲`docker`命令实在记不住也容易出错。

[https://docs.docker.com/compose/install/#install-compose-on-linux-systems](https://docs.docker.com/compose/install/#install-compose-on-linux-systems)

```bash
# 下载二进制文件
#sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

 sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose


# 添加可执行权限
chmod +x /usr/local/bin/docker-compose

# 建立软连接
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# docker-compose命令自动补全
curl -L https://raw.githubusercontent.com/docker/compose/1.24.0/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose
```

## 实战经验

### 启动容器

```bash
# 启动容器
docker run --name mysql-demo -p 13306:3306 -v $PWD/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD="123456" -d mysql:5.8

# 运行容器
docker run --name centos7 -p 8080:80 -v $PWD/soft:/root/soft -d -it centos:centos7

# 进入容器
docker exec -it centos7 bash

# 删除容器
docker rm centos7
```

### 进入容器

```bash
# 进入容器
docker exec -it 72f45548ee75 sh
```

### 镜像导入导出

```bash

# 镜像导出
docker save -o busybox.tar busybox
#docker save -o busybox.tar db8ee88ad75f  # 如果用镜像ID的方式，导入时会没有镜像名称

# 镜像导入
docker load < busybox.tar 
#docker load --input ./ubuntu18.tar
```

### 容器导入导出

```bash
# 导出容器
docker export <容器名> > <保存路径>
docker export ubuntu18 > ./ubuntu18.tar

# 导入容器
docker import <文件路径>  <容器名>
docker import ./ubuntu18.tar ubuntu18
```



#### 发布镜像到仓库(hub.docker.com)

```bash
# 登录hub.docker.com
docker login

# 给镜像打标签
docker tag <image> username/repository:tag

# 发布镜像
docker push username/repository:tag
```



### 常用命令

| 命令                                         | 描述                     |
| -------------------------------------------- | ------------------------ |
| `docker ps`                                  | 查看运行的所有容器       |
| `docker rm <容器ID>`                         | 删除容器                 |
| `docker exec it <容器ID> sh`                 | 进入容器                 |
| `docker cp <容器ID>:<容器内目录> 宿主机目录` | 从容器中拷贝文件到宿主机 |
| `docker images` | 查看本地镜像列表 |
| `docker search <镜像名[:版本号]>` | 搜索镜像 |
| `docker rmi <镜像ID>` | 删除镜像 |
| `docker pull <镜像名>` | 拉取镜像 |
| `docker run ` | 拉取镜像，创建容器，运行容器|
| `docker history <镜像ID>` | 查看镜像的历史记录 |

### 如何获取镜像

会翻墙的小伙伴[hub.docker.com](https://hub.docker.com/)，不会翻墙的小伙伴[aliyun.com](https://cr.console.aliyun.com/cn-qingdao/instances/images)，当然也用命令行的方式。

### 磁盘空间不足

默认docker镜像存放目录在`/var/lib/docker/`，由于是系统默认磁盘，通常容量不是很大。一段时间后，会因为磁盘空间占满，导致docker无法正常使用。

```bash
# 停止服务
systemctl stop docker

# 在大容量目录下，新建docker目录
mkdir -p /data/docker/lib

# 复制原有内容
rsync -avz /var/lib/docker /data/docker/lib/

# 编辑daemon.josn文件
/etc/docker/daemon.json
{
  "graph": "/data/docker/lib/docker"
}

# 重载服务
systemctl daemon-reload

# 重启服务
systemctl start docker

# 验证docker是否正常（命令可能执行失败，有些容器可能起不来，这时候，需要在docker旧目录中，找到一个docker的日志文件，将其删除即可）
docker info
docker ps

# 删除旧目录
rm -rf /var/lib/docker
```

### 限制日志大小

#### 方式一

```bash
vim /etc/docker/daemon.json
```

```json
{
  "registry-mirrors": [
    "https://kjeon24c.mirror.aliyuncs.com"
  ],
  "log-driver":"json-file",
  "log-opts": {"max-size":"500m", "max-file":"3"}
}
```

#### 方式二

```yaml
nginx:
  image: nginx:1.12.1
  restart: always
  logging:
    driver: "json-file"
    options:
      max-size: "5g"
```

### 方式三

```bash
docker run -d --log-opt max-size=1g nginx
```

### 清除日志脚本

```bash
#!/bin/sh
echo "======== start clean docker containers logs ========"
logs=$(find /var/lib/docker/containers/ -name *-json.log)
for log in $logs
do
echo "clean logs : $log"
cat /dev/null > $log
done
echo "======== end clean docker containers logs ========"
```


## 参考文档

* [docker官方文档-起步](https://docs.docker.com/get-started/)
* [docker命令大全](https://docs.docker.com/engine/reference/commandline/docker/)
* [docker-cmopose参考文档](https://docs.docker.com/compose/)
* [Docker-从入门到实践](https://yeasy.gitbooks.io/docker_practice/content/)

