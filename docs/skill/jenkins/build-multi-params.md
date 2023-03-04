# 七、Jenkins构建SpringBoot应用之多参数构建

在实际开发中，有些场景，我们需要选择不同的`git分支`进行项目的构建。Jenkins是对这块是可以支持的，不过需要下载相关的插件。

## 安装插件

进入插件管理

![image-20210619225449542](./assets/008i3skNgy1grnyu4eh0xj31d30u07fw.jpg)

点击`可选插件`，搜索`Git Parameter`插件，并选择`下载安装后重启`

![image-20210619230146801](./assets/008i3skNgy1grnz1aa3wjj31d30u0jym.jpg)

<!-- more -->

勾选重启按钮

![image-20210619230251729](./assets/008i3skNgy1grnz2ehblwj31d30u0tfq.jpg)

重启完成后，在插件管理中，确认插件是否安装成功。

![image-20210619230436418](./assets/008i3skNgy1grnz48fnywj31d30u0jzh.jpg)

## 创建新的构建任务

这里我们采用复制的方法来创建`多参数构建任务`

![image-20210619230633216](./assets/008i3skNgy1grnz68qvd5j31d30u011z.jpg)

输入任务名称`hello-work-build-with-git-paramter`，并选择自由风格软件

![image-20210619230754409](./assets/008i3skNgy1grnz7ob9hmj31d30u0dq1.jpg)

输入想要复制的任务名称`hello-work`

![image-20210619230851923](./assets/008i3skNgy1grnz8okl8mj31d30u0aj2.jpg)

## 参数化构建过程配置

选择`Git参数`

![image-20210619230951252](./assets/008i3skNgy1grnz9quyq9j31d30u0dn7.jpg)

输入参数名称`branch`，选择参数类型，设置默认值为`origin/master`

![image-20210619231201495](./assets/008i3skNgy1grnzbxo9noj31d30u0q99.jpg)

> 重要，否则无法切换分支构建。

设置源码管理中的指定分支为`${branch}`，这是一个变量，需要用`${}`

![image-20210619231510270](./assets/008i3skNgy1grnzf7sqadj31d30u0wl3.jpg)

点击保存。

## 执行`master`构建

点击`Build with Parameters`，选择`master`分支，点击开始构建。

![image-20210619231856320](./assets/008i3skNgy1grnzj58j6jj31d30u0dnv.jpg)

查看构建详情，此时在`master`分支构建。

![image-20210619232038850](./assets/008i3skNgy1grnzkwy0gdj31d30u0du9.jpg)

构建完成，进行验证。

![image-20210619232125135](./assets/008i3skNgy1grnzlq2lohj31d30u0gwe.jpg)

此时，是基于`master`分支构建

![image-20210619232323709](./assets/008i3skNgy1grnzns8cnwj30zk07etbb.jpg)

## 切换分支，执行`develop`构建

点击`Build with Parameters`，选择`develop`分支，点击开始构建。

![image-20210619232519645](./assets/008i3skNgy1grnzpsna9jj31d30u0dnv.jpg)

查看`Git Build Data`，确认是否从`develop`构建

![image-20210619232725388](./assets/008i3skNgy1grnzryy3twj31d30u0aj9.jpg)

再次访问验证，此时访问返回`hello work for develop`，说明是从`develop`分支构建。

![image-20210619232749838](./assets/008i3skNgy1grnzsdxolej30zk07etc7.jpg)

至此，多参数构建，选择`git分支`构建已经演示完毕。

