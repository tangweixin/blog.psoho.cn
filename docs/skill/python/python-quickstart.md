# Python安装

## On Cenots

参考文档

```bash
# 下载文件
wget https://www.python.org/ftp/python/3.9.12/Python-3.9.12.tar.xz

# 安装依赖
yum -y groupinstall "Development tools"
yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel

#创建文件夹
mkdir /usr/local/python3 

#解压编译安装
tar -xvJf  Python-3.9.12.tar.xz
cd Python-3.9.12
./configure --prefix=/usr/local/python3
make && make install

#给个软链
ln -s /usr/local/python3/bin/python3 /usr/bin/python3
ln -s /usr/local/python3/bin/pip3 /usr/bin/pip3
```



## On Debian

参考文档

* [installing-python-3.7-on-debian-8](https://jameskiefer.com/posts/installing-python-3.7-on-debian-8/)

```bash
# 下载，需要香港加速
root@hksb01:software# wget https://www.python.org/ftp/python/3.7.3/Python-3.7.3.tar.xz 

# 安装相关依赖
apt-get install libssl-dev
apt-get install zlib*
apt-get install  tk-dev
apt-get install libffi-dev

# 配置
root@node1:Python-3.7.3# ./configure --prefix=/usr/local/python3 --with-ssl

./configure --prefix=/usr/local/python3 --with-openssl=/usr/src/openssl-1.0.2o --enable-optimizations

# 启用优化，会很耗时间
# root@xc1:software# ./configure --prefix=/usr/local/python3 --with-ssl --enable-optimizations

make
make install
```

### 快速安装

参考文档：

* [Python的官方docker镜像](https://github.com/docker-library/python/blob/34c9df35e9a69e9f0edde88e861b543edb8bc07a/3.7/stretch/Dockerfile)

```bash
# 快速安装
apt-get install tk-dev uuid-dev libssl-dev libffi-dev zlib* -y
./configure --prefix=/usr/local/python3 --build="$gnuArch"  --prefix=/usr/local/python3 --enable-optimizations
make -j "$(nproc)"
make install

# 配置环境变量即可
```

### 镜像配置

> 临时使用

```bash
# 临时配置
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

# 单独安装需使用--trusted-host参数
pip install webob -i http://mirror.youweb.com/pypi/simple --trusted-host mirror.youweb.com
```

> 永久修改，如果不存`~/.pip/pip.conf`文件，则新建一个。

```bash
# vim ~/.pip/pip.conf 
[global]
index-url=http://mirrors.aliyun.com/pypi/simple/
[install]
trusted-host=mirrors.aliyun.com
```

> 可选镜像源

* [豆瓣](https://pypi.douban.com/simple)
* [阿里云](http://mirrors.aliyun.com/pypi/simple/)
* [清华大学](https://pypi.tuna.tsinghua.edu.cn/simple)

### 生成项目的依赖文件requirements.txt

```bash
pip3 install pipreqs
pipreqs /path/of/your/project
# requirements.txt
```

### 虚拟环境操作

```bash

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 退出虚拟环境
deactivate

# 查看依赖
pip3 list 

# 导出依赖
pip3 freeze > requirements.txt 

# 安装依赖
pip3 install -r requirements.txt

# 使用代理
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
```

### 虚拟环境使用2

参考：

* https://blog.csdn.net/qq_43208303/article/details/84982510
* https://www.cnblogs.com/xuexidememeda/p/11257182.html

```bash
# 安装Anaconda

# 创建虚拟环境
conda create -n py3pandas 

# 激活虚拟环境
activate py3pandas

# 安装依赖
pip3 install ipykernel -i https://pypi.tuna.tsinghua.edu.cn/simple

# 安装虚拟环境特有依赖
pip3 install pandas -i https://pypi.tuna.tsinghua.edu.cn/simple

# 使用虚拟环境
python -m ipykernel install --name py3pandas
```
