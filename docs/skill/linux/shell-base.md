# Shell脚本笔记

## 基本语法

### for循环

```bash
# 输出1~5
for i in $(seq 1 5)
do
    echo $i
done

# 输出1~5
for i in {1..5}
do
    echo $i
done

# 最新语法
for((i=0; i<10; i++))
{
    echo"I am number:$i"
}
```

<!--more-->

### CaseWhen

```bash
case 值 in
模式1)
    command1
    command2
    ...
    commandN
    ;;
模式2）
    command1
    command2
    ...
    commandN
    ;;
esac
```

### 参数变量

| 变量名   | 说明                                         |
| ---- | ------------------------------------------------------------ |
| $#   | 传递到脚本的参数个数                                         |
| $*   | 以一个单字符串显示所有向脚本传递的参数。<br/>如"\$*"用「"」括起来的情况、以"​\$1 ​\$2 … \$n"的形式输出所有参数。 |
| $$   | 脚本运行的当前进程ID号                                       |
| $!   | 后台运行的最后一个进程的ID号                                 |
| $@   | 与\$*相同，但是使用时加引号，并在引号中返回每个参数。<br/>如"​\$@"用「"」括起来的情况、以"\$1" "​\$2" … "\$n" 的形式输出所有参数。 |
| $-   | 显示Shell使用的当前选项，与set命令功能相同。                 |
| $?   | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。 |

### 重定向命令

```bash
< 		重定向标准输入
> 		重定向标准输出
>> 		重定向标准输出追加
2> 		重定向错误输出
2>> 	重定向错误输出追加
&> 		重定向标准输出和错误输出
2>&1	错误的输出沿着标准输出
```

## 常用命令

### 时间处理

```bash
# 格式化日期
date "+%Y-%m-%d %H:%M:%S"
2014-10-20 03:11:56

# 字符串转秒
date -d "2015-08-30" +%s
date -d "20150830" +%s
1440864000

# 秒转字符串
date -d @1440864000 "+%Y-%m-%d"
2015-08-30

# 获取当前日期前一天
date --date='1 days ago' +"%Y-%m-%d"

# 获取当前日期前一天（Mac不同）
date -v-1d +"%Y%m%d"
```

### 切割文件

```bash
# 获取第5~10行的数据
sed -n '11q;5,10p' passwd
```

### 清除当前登录的用户信息

```bash
# 清除当前登录的用户信息（部分）
echo > /var/log/wtmp; echo > /var/log/btmp; unset HISTFILE;
```

## 窗口菜单

### 菜单命令行

```bash
#!/bin/bash
# Bash Menu Script Example

PS3='Please enter your choice: '
options=("Option 1" "Option 2" "Option 3" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Option 1")
            echo "you chose choice 1"
            ;;
        "Option 2")
            echo "you chose choice 2"
            ;;
        "Option 3")
            echo "you chose choice $REPLY which is $opt"
            ;;
        "Quit")
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done
```

### 菜单dialog窗口

```bash
# 对于MacOS需要先安装 dialog  (brew install dialog)

# 菜单窗口
#!/bin/bash

HEIGHT=15
WIDTH=40
CHOICE_HEIGHT=4
BACKTITLE="Backtitle here"
TITLE="Title here"
MENU="Choose one of the following options:"

OPTIONS=(1 "Option 1"
         2 "Option 2"
         3 "Option 3")

CHOICE=$(dialog --clear \
                --backtitle "$BACKTITLE" \
                --title "$TITLE" \
                --menu "$MENU" \
                $HEIGHT $WIDTH $CHOICE_HEIGHT \
                "${OPTIONS[@]}" \
                2>&1 >/dev/tty)

clear
case $CHOICE in
        1)
            echo "You chose Option 1"
            ;;
        2)
            echo "You chose Option 2"
            ;;
        3)
            echo "You chose Option 3"
            ;;
esac
```

