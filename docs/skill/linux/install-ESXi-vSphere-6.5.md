# 安装ESXi-vSphere-6.5

## ESXi6.5安装实录

### 制作ESXi启动盘

使用UltralOS，写入硬盘镜像

> 不要使用Rufus等其他软件来制作

![image-20210817165050921](./assets/GHJWiOsRMNvou8x.png)

### 开始安装

插入启动盘，重启服务器，按`F11`进入启动菜单页，选择从`U盘`启动

![image-20210817175637815](./assets/ZJXyDrq6IMoTPij.png)

进入ESXi引导页面，选择安装器`Installer`

![image-20210817170002740](./assets/ugG26VjkJemq5f3.png)

进入安装界面

![image-20210817174749543](./assets/13hJiN4gz7dowAX.png)

进入这一步，基本就OK了，接下来只需要一步一步安装就行了

![image-20210817174909147](./assets/EoG1XQZWOpesuzb.png)

开始安装中

![image-20210817175234255](./assets/iYaX5DUMk7zSwZx.png)

安装完成

![image-20210817175344503](./assets/rSMOigy57YB6dQj.png)

接下来，重启进入配置页面，配置好静态IP和DNS就行了

![image-20210817175510545](./assets/E7N3BoKR6ldVFAm.png)

### 控制台

进入控制台

![image-20210817180735679](./assets/Mik6PNEXHgGz2Vu.png)

替换证书

```bash
1U2YU-0LH81-EZYL9-0UC5K-C2YJ5
```

![image-20210817180924072](./assets/g5poOZEJuPWyCYm.png)
