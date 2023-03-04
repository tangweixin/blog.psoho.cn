# 八、Jenkins基于角色的用户权限管理

实际开发中，如果对构建任务不加以权限控制，一方面，会造成任务过多。另一方面，可能会因为误操作导致任务被修改或者删除掉。（踩过任务被删的坑）

## 安装插件

进入插件管理

![image-20210626232312302](./assets/008i3skNgy1grw2ztb3bhj31cw0u0qgd.jpg)

安装`Role-based Authorization Strategy`插件并重启

![image-20210626232430501](./assets/008i3skNgy1grw314odcuj31cw0u0k0s.jpg)

## 配置授权策略为`Role-Base`

进入安全设置

![image-20210626232715384](./assets/008i3skNgy1grw33z1b1uj31cw0u0tmb.jpg)

授权策略选择`Role-based Strategy`

![image-20210626232812100](./assets/008i3skNgy1grw34y0fnrj31cw0u0jyx.jpg)

进入`Manage and Assign Roles`

![image-20210626232900512](./assets/008i3skNgy1grw35s6rrgj31cw0u016v.jpg)

## 角色管理

![image-20210626233059959](./assets/008i3skNgy1grw37uz8uyj31cw0u07de.jpg)

新增全局角色（保证用户可以正常访问）

![image-20210626233225737](./assets/008i3skNgy1grw39clrf4j31cw0u0akb.jpg)

增加项目角色

> 通过正则表达式匹配任务名称
>
> 配置相关的任务权限

![image-20210626233839583](./assets/008i3skNgy1grw3ftng18j31cw0u0gu6.jpg)

## 增加测试用户

进入用户管理

![image-20210626234004992](./assets/008i3skNgy1grw3hbdsj9j31cw0u04ct.jpg)

新建两个用户`user1`和`user2`

![image-20210626234147409](./assets/008i3skNgy1grw3j2js96j31cw0u0dma.jpg)

查看新建好的用户

![image-20210626234255489](./assets/008i3skNgy1grw3k9tu48j31cw0u010r.jpg)

## 给用户分配角色

进入角色分配页面

![image-20210626234405031](./assets/008i3skNgy1grw3lg986pj31cw0u0k0n.jpg)

分配全局系统访问角色

![image-20210626234507809](./assets/008i3skNgy1grw3mjsfewj31cw0u0ak2.jpg)

分配项目角色（大家根据自己的实际情况来，这里只做演示）

> 我们给user1分配了前端角色，user2分配了后端角色。记得点击保存。

![image-20210626234701146](assets/image-20210626234701146.png)

## 验证效果

切换到`user1`账号，此时只能查看和构建`hello-work`这个任务，符合预期。

![image-20210626234916176](./assets/008i3skNgy1grw3qukjvhj31mm0u045v.jpg)

点击构建，可以正常构建。

![image-20210626235239214](./assets/008i3skNgy1grw3ue4dzjj31mm0u0ahj.jpg)

切换到`user2`账号

此时，能看到与之对应的两个任务。

![image-20210626235352363](./assets/008i3skNgy1grw3vn42jbj31mm0u0tfy.jpg)

