# HDFS常用命令

## 常用命令

### 格式化NameNode

```bash
# 格式化NameNode
hdfs namenode -format
```

### 创建目录

```bash
# 创建一个名为/scott的目录
hdfs dfs -mkdir /scott

# 创建多级目录
hdfs dfs -mkdir -p /aaa/bbb/ccc
```

### 拷贝本地文件到HDFS

```bash
# 拷贝文件到HDFS
hdfs dfs -put *.csv /scott/
```

### 查看HDFS目录列表

```bash
# 查看HDFS目录列表
hdfs dfs -ls /scott/
```

### 删除HDFS文件

```bash
# 删除HDFS文件
hdfs dfs -rm -r -f /scott/abc.txt
```

### 查看HDFS文件内容

```bash
# 查看HDFS文件内容
hdfs dfs -cat /scott/emp.csv

# 以文本形式查看文件内容
hdfs dfs -text /scott/emp.csv

# 部分文件内容
7369,SMITH,CLERK,7902,1980/12/17,800,0,20
7499,ALLEN,SALESMAN,7698,1981/2/20,1600,300,30
```

