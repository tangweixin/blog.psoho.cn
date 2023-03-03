# Linux常用脚本

## 构建部署

以下是个人收藏的一些生产环境使用的脚本，写的虽比较简单，却也实用。

### spring-boot构建部署

基础条件：服务器需要安装`maven`,`jdk`。这是一个轻量级的自动部署脚本。

```bash
#!/bin/bash
# desc: spring-boot自动构建部署
# author: Thomas
# date: 2019-03-25
# version: 1.0.0

# 切换到脚本所在目录
cd "$(dirname "$0")"

# 变量定义
app_name=tools-1.0.0.jar
app_home=/home/thomas/apps/tools
active_profile=prod
target_dir=target

echo "1 更新代码"
[ -d ".git" ] && echo "use git" && git pull  # git
[ -d ".svn" ] && echo "use svn" && svn up    # svn

echo "2 构建代码"
mvn clean package -Dmaven.test.skip=true
[ ! -f ${target_dir}/${app_name} ] && echo "打包失败!" && exit

echo "3 部署"
# 目录不存在，自动创建
[ ! -f ${app_home} ] && mkdir -p ${app_home}
cp ${target_dir}/${app_name} ${app_home}/${app_name}

echo "3.1 停止旧应用"
jps -l | grep "${app_name}" | awk '{print $1}' | xargs -I {} kill -9 {}
sleep 2

[ ! -f ${app_home}/logs ] && mkdir -p ${app_home}/logs

cd ${app_home}
echo "3.2 启动新应用"
nohup nice java -jar -server -Xms512m -Xmx512m -Dspring.profiles.active=${active_profile} -Dfile.encoding=UTF-8 -XX:+HeapDumpOnOutOfMemoryError ${app_name} > logs/xxx.log 2>&1 &
sleep 1

echo "查看日志"
tail -f ${app_home}/logs/xxx.log

echo "完成"
```

<!--more-->

### spring-boot工程构建部署到docker容器

```bash
#! /bin/bash
# desc: spring-boot工程打包并部署到docker容器
# author: Thomas
# date: 2019-06-15

# 切换到脚本所在目录
cd `dirname $0`

echo "构建应用"
mvn clean package -Dmaven.test.skip=true
[[ $? != 0 ]] && echo "构建失败" && exit

echo "发布到远端: jxb-app"
rsync -avz jxb-app/target/jxb-app-1.0.0.jar root@lj2:/opt/docker/jxb.prodapi.cn/jxb-app/
echo "重启容器: jxb-app"
ssh root@lj2 'source ~/.bashrc; docker-compose -f /opt/docker/jxb.prodapi.cn/docker-compose.yml restart jxb-app'
```

### 前端工程构建部署

```bash
#! /bin/bash
# desc: 发布到测试环境目录
# author: Thomas
# date: 2019-07-19

cd `dirname $0`
cnpm run build:uat
[[ $? != 0 ]] && echo "构建失败" && exit

# 同步到UAT环境
rsync -avz dist/ root@lj2:/opt/docker/jxb.prodapi.cn/admin/
echo "同步完成"
```

### 从外部传递变量

```yaml
# spring application.properties
spring.redis.host=${REIDS_HOST:127.0.0.1}
spring.redis.port=${REIDS_PORT:6379}
```

```bash
# 启动docker容器
docker runn -d --name jxb-app tangweixin/java:8-jdk -e REIDS_HOST="192.168.0.102" 
```

## 开发环境配置

### Maven

[下载地址](https://mirrors.tuna.tsinghua.edu.cn/apache/maven/maven-3/)

```bash
# 解压，配置环境变量
# vim .profile   # Mac OS
# vim .bashrc    # Linux 
export MAVEN_HOME=/Users/thomas/software/maven/apache-maven-3.8.1
export PATH=$MAVEN_HOME/bin:$PATH

# 配置镜像加速
# vim ~/.m2/settings.xml
# 将以下文本放置在<mirrors>标签下
```

```xml
<mirror>
    <id>aliyunmaven</id>
    <!-- <mirrorOf>*</mirrorOf> -->
    <mirrorOf>central</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

## 运维

### 更改用户分组

```bash
# 查看用户分组
id gproot
# uid=1000(gproot) gid=1000(gproot) groups=1000(gproot)

# 更改用户分组
usermod gproot -G gproot,docker

# 再次查看用户分组
# uid=1000(gproot) gid=1000(gproot) groups=1000(gproot),994(docker)

# 将用户添加到docker分组中
usermod -aG docker $USER
```

### 查两个文件交集

```bash
# 取重复元素的时候用到
# Only output lines that are repeated in the input.
# 需要保证两个文件本身都是唯一的
cat head.20200413.txt head.1001.txt |sort | uniq -d | wc -l
```

### 静态IP配置

```bash
# CentOS 这里文件名称可能会不一致
vim /etc/sysconfig/network-scripts/ifcfg-ens192 
#ONBOOT=no
ONBOOT=yes
IPADDR=192.168.1.22
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
DNS1=114.114.114.114

# 重启新加载网络配置
nmcli c reload 
```

### 查看HTTPS证书是否过期

```bash
curl -vvl https://study.gupaoedu.com
```

### JVM查看

```bash
#!/bin/bash
# file: getinfo.sh
# desc: 获取当前进程信息
# author: Thomas
pid=$1
[ -z "$pid" ] && echo '请输入进程ID' && exit 4
ps -mp $pid -o THREAD,tid,time | sort -rk 9 |  awk '{printf("%x %s\n", $8, $0) }' > $pid.ps.txt
jstack -l $pid > $pid.jstack.txt
echo "抓取java进程[$pid]信息OK"
```

### 数据库备份

```bash
#! /bin/bash
# desc: 备份数据库(支持表情符)
# author: Thomas
# date: 2019-03-25
# version: 1.0.0

hostname=mysql01
username=root
password="cnuOGlJk0pJ1o6rq"
database=db_name

# 切换到备份目录
cd /root/backup/db_name

# 备份一天前的(crontab 设定脚本凌晨执行)
_date=$( date --date='1 days ago' +"%Y_%m_%d_%H%M%S" )

# 备份当时的(每小时备份)
#_date=$( date +"%Y_%m_%d_%H%M%S" )
backfile=$database"_"$_date.sql

echo "开始备份: ${backfile}"
# dump文件 (支持表情符号)
cmd="mysqldump --single-transaction --default-character-set=utf8mb4 -h $hostname -u $username -p$password $database"
$cmd > $backfile

# 打包并删除sql文件
cmd="tar -zcf ${backfile}.tar.gz ${backfile} --remove-files"
$cmd

echo "完成备份: ${backfile}"
echo
```

### Nginx日志切割脚本

```bash
# nginx日志分割
# /root/works/nginx_cut.sh

#! /bin/bash
# author:       Thomas
# date:         2017-08-19
# desc:         日志按天分割
# ref:          http://www.cnblogs.com/gosky/p/5188893.html

# 定义变量
y=$(date -d "yesterday" +"%Y%m%d")
pid=$( cat /run/nginx.pid  )
dir1=/var/log/nginx
dir2=/var/log/nginx_archive/$y

# 新建归档目录
echo "$pid 新建归档目录 $dir2"
mkdir -p $dir2

# 移动日志文件
for f in $( ls $dir1 | xargs )
do
  f1=$dir1/$f
  #f2=$dir2/${f%.*}.$y.log
  f2=$dir2/$f
  echo mv $f1 $f2
  mv $f1 $f2
done

#向nginx主进程发信号重新打开日志
kill -USR1 $pid

echo "$pid 归档结束 $dir2"
echo ""
```

### Nginx配置-页面使用HTML5 History模式

参考：[https://router.vuejs.org/zh/guide/essentials/history-mode.html#nginx](https://router.vuejs.org/zh/guide/essentials/history-mode.html#nginx)

```nginx
server {
    listen 443 ssl;
    server_name ke.gupaoedu.net;
    ssl_certificate certs/5977686_ke.gupaoedu.net_nginx/5977686_ke.gupaoedu.net.pem;
    ssl_certificate_key certs/5977686_ke.gupaoedu.net_nginx/5977686_ke.gupaoedu.net.key;

    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    client_max_body_size 200m;

    location /admin {
        root /app/html/gupaoedu;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }
}
```

### crontab定时任务

```bash
# 文件位置
# /root/works/works.list

SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# nginx日志分割
0 0 * * * /root/works/nginx_cut.sh >> /root/works/logs/nginx_cut.log 2>&1
```

### 配置

```bash
# /etc/ssh/sshd_config
# sshd 配置
UseDNS no
AddressFamily inet
SyslogFacility AUTHPRIV
PermitRootLogin yes
PasswordAuthentication no

# centos
# service sshd restart 
```

> ssh 无法登陆问题

[解决ssh_exchange_identification:read connection reset by peer 原因](<https://www.cnblogs.com/taoquns/p/9590960.html>)

```bash
echo "sshd: ALL" >> /etc/hosts.allow 
service sshd restart 

# 或者删除/etc/hosts.deny里面对应的IP地址
```

### 挂载Linux磁盘

参考：[Linux格式化数据盘](https://help.aliyun.com/document_detail/25426.html?spm=a2c4g.11186623.2.24.68953b942sTJS4%23concept-jl1-qzd-wdb)

```bash
root@td-fate:~# fdisk -l
root@td-fate:~# fdisk -u /dev/vdb 
p n p 1 p w
root@td-fate:~# fdisk -l
root@td-fate:~# mkfs.ext4 /dev/vdb1 
root@td-fate:~# mkdir /ssd1
root@td-fate:~# mount /dev/vdb1 /ssd1
root@td-fate:~# df -h 
root@td-fate:~# cat /etc/fstab 
root@td-fate:~# cp /etc/fstab /etc/fstab.back.20210414
root@td-fate:~# echo `blkid /dev/vdb1 | awk '{print $2}' | sed 's/\"//g'` /ssd1 ext4 defaults 0 0 >> /etc/fstab
root@td-fate:~# cat /etc/fstab
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/vda1 during installation
UUID=b508d494-0d96-4fa8-8989-1d1b46189eac / ext4    errors=remount-ro 0       1
/dev/sr0        /media/cdrom0   udf,iso9660 user,noauto     0       0
UUID=ad292f76-5085-47cc-9193-be12c59fcc51 /ssd1 ext4 defaults 0 0
root@td-fate:~# 
```

### 删除N天前日志

```bash
# 查找7天前的日志文件
find . -type f -mtime +7 -name "*.log"

# 查找7天前的日志文件并删除
find . -type f -mtime +7 -name "*.log" | xargs -I {} rm -rf {}
```

## MySQL

### MySQL数据库配置

```bash
mysql配置：
bind-address   = 127.0.0.1
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
################################################################
# 配置和RDS一致
################################################################
# 最大连接数限制为300
max_connections=300
# 表名不区分大小写
lower_case_table_names=1
# 锁定等待时间
innodb_lock_wait_timeout=121
# 空闲连接等待时间
wait_timeout=10001
interactive_timeout=10002
# 不能在事务中使用非事务语句，如create table ...
enforce-gtid-consistency=1
### 解决表情符问题
character-set-client-handshake = FALSE
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'
```

### MySQL新建用户并授权

```bash
# 新建用户
CREATE USER `emotion_user`@`%` IDENTIFIED BY 'JTchZ5avAKuI0dBI';

# 授权
GRANT Alter, Alter Routine, Create, Create Routine, Create Temporary Tables, Create View, Delete, Drop, Event, Execute, Grant Option, Index, Insert, Lock Tables, References, Select, Show View, Trigger, Update ON `emotion`.* TO `emotion_user`@`%`;

# 撤销授权
REVOKE Alter, Alter Routine, Create, Create Routine, Create Temporary Tables, Create View, Delete, Drop, Event, Execute, Grant Option, Index, Insert, Lock Tables, References, Select, Show View, Trigger, Update ON `emotion`.* FROM `emotion_user`@`%`;
```

### 导出数据库支持表情符号

```bash
mysqldump --single-transaction --default-character-set=utf8mb4 -h xc --port 30436 -u emotion_user -p'xxxxx' emotion > emotion2.sql
```

## Redis

### 安装

```bash
cd src/
# make


# 根据提示安装即可(需要设置好redis环境变量)
cd utils/
./install_server.sh


# 持久化配置
appendonly yes
appendfilename "appendonly.aof"
appendfsync everysec
requirepass xC6jdsLVxdL9iCWJ
```

### Redis客户端连接

```bash
# 测试连接(-n 数据库 0~16)
redis-cli -h xc2 -p 46379 -a xC6jdsLVxdL9iCWJ -n 0 --raw
Warning: Using a password with '-a' or '-u' option on the command line interface may not be safe.
xc2:46379> 
```

## GIT

### Git常用命令

```bash
# 当前项目记住账号密码
git config credential.helper store

# 全局记住账号密码
git config --global credential.helper store

# Peer's Certificate issuer is not recognized.
git config --global http."sslVerify" false
```

### 推送代码

```bash
# 从命令行创建一个新的仓库
touch README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin http://git.c.yd.prodapi.cn/youdao/cloudysales-h5.git
git push -u origin master

# 从命令行推送已经创建的仓库
git remote add origin http://git.c.yd.prodapi.cn/youdao/cloudysales-h5.git
git push -u origin master
```

### 修改远程仓库地址

```bash
# 第一种方式
#git remote set-url origin [url]
git remote set-url origin http://git.c.yd.prodapi.cn/youdao/cloudysales.git

# 第二种方式(先删除后增加)
git remote rm origin
git remote add origin [url]
```

### 其他操作

```bash
# 在本地新建一个分支
git branch newBranch

# 切换到你的新分支
git checkout newBranch

# 将新分支发布在 github、gitee 上
git push origin newBranch

# 在本地删除一个分支
git branch -d newBranch

# 在 github 远程端删除一个分支(分支名前的冒号代表删除)
# 注意删除远程分支后，如果有对应的本地分支，本地分支并不会同步删除！
git push origin :newBranch 
```

## NodeJS

相关地址

- [cnpm官网](https://cnpmjs.org/)
- [node.js官网](https://nodejs.org/dist/v10.16.3/node-v10.16.3-linux-x64.tar.xz)

```bash
# 安装命令
npm install -g cnpm --registry=https://registry.npm.taobao.org

```

## Jmeter

### 测试导出测试报告

```bash
# 格式
jmeter -n -t [jmx file] -l [results file] -e -o [Path to web report folder]

# 示例
jmeter -n -t 泸州老窖压测-首页.jmx -l 泸州老窖压测-首页.csv -e -o 泸州老窖压测-首页
```

## tcpdump

```bash
# dump traffic on a network
# 抓包工具

# 抓取任意网卡端口为18002的tcp请求，并以ASCII编码打印输出结果
tcpdump -i any -A tcp port 18002

# 列出可用的网络设备
tcpdump -D

```

## htop

```bash

# debian系统安装
apt install htop

# centos安装-快速安装
yum -y install epel-release && yum update -y && yum install htop -y

# centos安装
# 1. Create the repository config file /etc/yum.repos.d/nux-misc.repo:
vim /etc/yum.repos.d/nux-misc.repo
[nux-misc]
name=Nux Misc
baseurl=http://li.nux.ro/download/nux/misc/el7/x86_64/
enabled=0
gpgcheck=1
gpgkey=http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro

# 2. Install rinetd rpm package:
yum --enablerepo=nux-misc install rinetd

```



## 端口转发

### rinetd

全称：Internet TCP redirection server

```bash
# centos
# 需要启动
yum --enablerepo=nux-misc install -y rinetd

# debian
apt install rinetd

# 使用
vim /etc/rinetd.conf 
# to forward connections to port 80 on all addresses to port 80 on 192.168.0.2
# 0.0.0.0 80 192.168.0.2 80
```

### socat

全称： Multipurpose relay (SOcket CAT)

```bash
# centos
# 需要启动
yum install -y socat

# debian
apt install socat

# 使用
# 开启UDP转发
nohup socat UDP4-LISTEN:48390,reuseaddr,fork UDP4:47.106.255.152:48391 >> /var/log/socat.log 2>&1 &

# 开启TCP
socat -d TCP4-LISTEN:53306,reuseaddr,fork TCP4:127.1.1.1:3306
```


## iptables

### iptables-示例

```bash
# 封IP
iptables -I INPUT -s 218.86.35.162 -j DROP

# 解封IP
iptables -D INPUT -s 218.86.35.162 -j DROP
```

*	备份：`iptables-save > /etc/iptables.rules`
* 恢复：`iptables-restore < /etc/iptables.rules`

```bash
# /etc/iptables.rules

# Generated by iptables-save v1.4.14 on Mon May 16 13:39:46 2016
*filter
:INPUT ACCEPT [11134:1744659]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [17440:1564178]

-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -p icmp -j DROP
-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 6379 -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 3000 -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 3690 -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 443 -j ACCEPT

# activemq
-A INPUT -p tcp -m state --state NEW -m tcp --dport 8161 -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 61616 -j ACCEPT

# 反向隧道
-A INPUT -p tcp -m state --state NEW -m tcp --dport 30000:31000 -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 1723 -j ACCEPT

-A INPUT -j REJECT --reject-with icmp-host-prohibited

COMMIT
# Completed on Mon May 16 13:39:46 2016
```

### empty.iptables.rules

```bash
# ~/empty.iptables.rules

# Generated by iptables-save v1.4.14 on Mon Apr 17 22:44:14 2017
*filter
:INPUT ACCEPT [484:67055]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [727:62852]
COMMIT
# Completed on Mon Apr 17 22:44:14 2017
```



## 反向隧道

实现反向隧道的方案有很多种，个人比较喜欢使用`autossh`和`FRP`，这两种各有优势。相对来说，`autossh`比较简单一些。`FRP`能够很好的控制权限。

### 反向隧道-SSH

> 服务器端需要设置如下，否则不会打开外网端口。

```bash
# ssh 反向隧道
# 支持远程主机转发
# GatewayPorts no               # 仅允许本地连接
# GatewayPorts yes              # 允许所有地址连接
GatewayPorts clientspecified    # 由客户端指定

ClientAliveCountMax 3
ClientAliveInterval 10

```

> MacOS、CentOS需要带-M参数

```bash
# 需要—M启动监听(debian可以不指定-M监听端口)
autossh -M 5678 -f -N -R 121.199.66.141:31000:127.0.0.1:80 thomas@121.199.66.141

```

> 划重点: 阿里云最新的服务器绑定的网卡IP不是公网IP，所以需要如下配置
>
> `172.16.13.82`为云服务器的内网IP
>
> **重点：由于阿里云最近又升级了系统，导致所有反向隧道，都监听到127.0.0.1网卡上，导致远程连接不上。**
>
> 所以，使用socat(rinet没有成功)再做一次转发即可。

```bash
autossh -M 5678 -f -N -R 172.16.13.82:31000:127.0.0.1:80 thomas@121.199.66.141

# 需要—M启动监听(debian可以不指定-M监听端口)
autossh -M 5678 -f -N -R 172.16.13.82:30010:127.0.0.1:80 thomas@121.199.75.42

# 如果监听在127.0.0.1网卡上，用socat再做一次转发即可
autossh -M 5678 -f -N -R 121.199.66.141:31000:127.0.0.1:22 thomas@121.199.66.141
nohup socat TCP4-LISTEN:41000,reuseaddr,fork TCP4:127.0.0.1:31000 >> /var/log/socat2.log 2>&1 &
```

### 反向隧道-FRP

> A fast reverse proxy to help you expose a local server behind a NAT or firewall to the internet.

[fast reverse proxy](<https://github.com/fatedier/frp>)

[快速穿透代理](<https://github.com/fatedier/frp/blob/master/README_zh.md>)



## 未分类

### PS1

设置命令行颜色和样式

```bash
#set PS1
# Green: remote login
PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\W\[\033[00m\]\$ '

# Red: root warning
PS1='\[\033[01;31m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\W\[\033[00m\]\$ '

# Cyan: local login
PS1='\[\033[01;36m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\W\[\033[00m\]\$ '

# 紫红色 SVN
PS1='\[\033[01;35m\]\u@\h\[\033[00m\]:\[\033[01;35m\]\W\[\033[00m\]\$ '

# 服务器配置
PS1='\033[1;34m8.129.119.33 \[\033[01;31m\]\u@ crm|ke.gupaoedu.cn\[\033[00m\]:\[\033[01;34m\]\W\[\033[00m\]\$ '

```

### 文字颜色

```bash
# 文字颜色
echo -e "\033[1;30m你好\033[0m"
echo -e "\033[1;31m你好\033[0m"
echo -e "\033[1;32m你好\033[0m"
echo -e "\033[1;33m你好\033[0m"
echo -e "\033[1;34m你好\033[0m"
echo -e "\033[1;35m你好\033[0m"
echo -e "\033[1;36m你好\033[0m"
echo -e "\033[1;37m你好\033[0m"

# 背景色
echo -e "\033[1;40m你好\033[0m"
echo -e "\033[1;41m你好\033[0m"
echo -e "\033[1;42m你好\033[0m"
echo -e "\033[1;43m你好\033[0m"
echo -e "\033[1;44m你好\033[0m"
echo -e "\033[1;45m你好\033[0m"
echo -e "\033[1;46m你好\033[0m"
echo -e "\033[1;47m你好\033[0m"
```

![image-20190506020620624](http://pic.qn.prodapi.cn/typora/hexo/thomas/dh2rd.jpg)





