# 运维小技巧

## 更改用户分组

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

## 查两个文件交集

```bash
# 取重复元素的时候用到
# Only output lines that are repeated in the input.
# 需要保证两个文件本身都是唯一的
cat head.20200413.txt head.1001.txt |sort | uniq -d | wc -l
```

## 静态IP配置

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

## 查看HTTPS证书是否过期

```bash
curl -Iv https://study.gupaoedu.com
```

## JVM查看

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

## 数据库备份

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

## Nginx日志切割脚本

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

## Nginx配置-页面使用HTML5 History模式

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

## crontab定时任务

```bash
# 文件位置
# /root/works/works.list

SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# nginx日志分割
0 0 * * * /root/works/nginx_cut.sh >> /root/works/logs/nginx_cut.log 2>&1
```

## 配置

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

## 挂载Linux磁盘

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

## 删除N天前日志

```bash
# 查找7天前的日志文件
find . -type f -mtime +7 -name "*.log"

# 查找7天前的日志文件并删除
find . -type f -mtime +7 -name "*.log" | xargs -I {} rm -rf {}
```

## 测速

开发和测试环境文件上传都很快，基本能达到2~3M/s，而生产很慢环境，于是开始分析原因。初步判断是由于接入了负载，不稳定造成的。遂进行服务器直连网速测试。

```bash
# 上传测试
# 服务端
nc -l -p 17911 > /dev/null

# 客户端
nc ip 17911 < /dev/zero 

# 服务端监控(如果有多个网卡，需要切换到对应外网网卡才行，一般是eth0)
nload -u H
```

## svg转png

参考：https://cairosvg.org/

```bash
# 安装cairosvg
pip3 install cairosvg

# 执行转换
cairosvg Google.svg -o google.png 
```

```python
# python代码方式
import cairosvg
cairosvg.svg2pdf(url='image.svg', write_to='image.pdf')
```

## 初学者入门

```bash
# 查找xxx
locate xxx
```

```bash
# 在哪里
which cal
```

```bash
# 解释
whatis cal
```

```bash
# 用户信息
users
id
```
