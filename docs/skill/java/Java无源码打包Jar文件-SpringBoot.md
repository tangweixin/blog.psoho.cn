# Java无源码打包Jar文件(SpringBoot)

## Java无源码打包Jar文件(SpringBoot)

线上环境，有个工程没有源码，业务环境又遇到需求，反编译（解压Jar）之后，发现通过修改`Mapper.xml`文件，可以解决线上问题。所以，需要把修改后的文件重新打包到`jar`包中去。

执行命令

```bash
jar -0cvfM gupao-community-server-0.0.2-SNAPSHOT.jar -C gupao-community-server-0.0.2-SNAPSHOT .
```

启动项目

```bash
java -jar gupao-community-server-0.0.2-SNAPSHOT.jar
```

成功执行
