# CDH安装

## 简介

> 相关资源链接
>
> 安装失败，建议使用docker方式来安装测试环境

* [参考文章](https://blog.csdn.net/jdplus/article/details/45920733)
* [cloudera-manager-centos7-cm5.6.1_x86_64.tar.gz](https://archive.cloudera.com/cm5/cm/5/cloudera-manager-centos7-cm5.6.1_x86_64.tar.gz)
* [mysql-connector-java-8.0.18.jar](https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.18/mysql-connector-java-8.0.18.jar)
* [jdk-7u80-linux-x64.tar.gz](https://download.oracle.com/otn/java/jdk/7u80-b15/jdk-7u80-linux-x64.tar.gz)
* [jdk-8u241-linux-x64.tar.gz](https://download.oracle.com/otn/java/jdk/8u241-b07/1f5b5a70bf22433b84d0e960903adac8/jdk-8u241-linux-x64.tar.gz)

## 基本准备

### 网络配置

```bash
vim /etc/hosts
# 大数据集群
192.168.1.30	cdh30
192.168.1.31	cdh31
192.168.1.32	cdh32
192.168.1.33	cdh33
192.168.1.34	cdh34
```

### 打通SSH，实现免密登录

```bash
# 生成证书并添加到授权列表
ssh-keygen
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# 拷贝证书到每台服务器
scp -R ~/.ssh root@cdh31:~/
scp -R ~/.ssh root@cdh32:~/
scp -R ~/.ssh root@cdh33:~/
scp -R ~/.ssh root@cdh34:~/
```

<!-- more -->

### 安装Oracle-JDK7

```bash

# 解压即可
# tar -zxf jdk-7u80-linux-x64.tar.gz
tar -zxf jdk-8u241-linux-x64.tar.gz

# 
export JAVA_HOME=/root/soft/jdk1.8.0_241
export PATH=${JAVA_HOME}/bin:${PATH}
```

### 安装mysql

```bash
# 安装参考docker安装

# 创建数据库
hive
amon
cm
```

### 关闭防火墙、禁用SELinux

```bash
# 关闭防火墙
service iptables stop		# 临时生效
chkconfig iptables off	# 重启后生效

# 放开指定端口
-A IN_public_allow -p tcp -m tcp --dport 22 -m conntrack --ctstate NEW,UNTRACKED -j ACCEPT
-A IN_public_allow -p tcp -m tcp --dport 7180 -m conntrack --ctstate NEW,UNTRACKED -j ACCEPT
-A IN_public_allow -p tcp -m tcp --dport 9000 -m conntrack --ctstate NEW,UNTRACKED -j ACCEPT
-A IN_public_allow -p tcp -m tcp --dport 7182 -m conntrack --ctstate NEW,UNTRACKED -j ACCEPT
COMMIT

# 禁用SELinux
setenforce 0 # 临时生效
# 修改 /etc/selinux/config 下的 SELINUX=disabled （重启后永久生效）
```

### 配置NTP时间同步服务

```bash
# 略
```

## 正式安装

### 安装Cloudera Manager Server

```bash
# 解压软件
tar -zxf cloudera-manager-centos7-cm5.6.1_x86_64.tar.gz

# 添加驱动
cp mysql-connector-java-8.0.18.jar /root/soft/cm-5.6.1/share/cmf/lib/

# 初始化数据库
/root/soft/cm-5.6.1/share/cmf/schema/scm_prepare_database.sh mysql cm root 03pnflY1xzlg6glT --scm-host cdh30 scm scm scm

# 修改agent配置
vim /root/soft/cm-5.6.1/etc/cloudera-scm-agent/config.ini 
[General]
# Hostname of the CM server.
#server_host=127.0.0.1
server_host=cdh30

# 准备parcel
# 下载地址: https://archive.cloudera.com/cdh5/parcels/5.6.1/CDH-5.6.1-1.cdh5.6.1.p0.3-el7.parcel
CDH-5.6.1-1.cdh5.6.1.p0.3-el7.parcel
CDH-5.6.1-1.cdh5.6.1.p0.3-el7.parcel.sha1
CDH-5.6.1-1.cdh5.6.1.p0.3-el7.parcel

# 启动服务端
/root/soft/cm-5.6.1/etc/init.d/cloudera-scm-server start 

# 启动客户端
/root/soft/cm-5.6.1/etc/init.d/cloudera-scm-agent restart
```



### 安装Agent

```bash
#!/bin/bash
# desc: 同步安装
# author: Thomas
# date: 2020-04-17

for i in `seq 1 4 `
do
    host="cdh3${i}"
    echo "${hosti}"

    # 同步hosts文件
    #rsync -avz /etc/hosts root@${host}:/etc/hosts
    #rsync -avz .bashrc .vimrc .inputrc root@${host}:~/

    # 安装基础软件
    #ssh root@${host} 'yum install vim rsync htop net-tools nmap-ncat socat psmisc lsof -y'

    #ssh root@${host} 'mkdir /root/soft'

    # 安装JVM
    #rsync -avz /root/soft/jdk1.8.0_241 root@${host}:/root/soft/
    #rsync -avz /root/soft/cm-5.6.1 root@${host}:/root/soft/

    # 启动客户端
    ssh root@${host} '/root/soft/cm-5.6.1/etc/init.d/cloudera-scm-agent restart'
    
done
```



### 配置Cloudera Manager

默认账号密码: `admin/admin`

选择需要安装的主机

安装集群

