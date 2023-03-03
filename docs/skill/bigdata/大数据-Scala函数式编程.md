---
title: 大数据-Scala函数式编程
date: 2019-11-07 21:17:31
tags:
 - Scala
categories:
 - 大数据
---

## 一、Scala中的函数

def关键字

## 二、匿名函数

匿名函数不能写返回值

```scala
// 不能写返回值
(x:Int) => x*3

// 高阶函数里面用到匿名函数
Araay(1, 2, 3).map((x:Int) => x*3)
```

## 三、高阶函数

普通函数

```scala
// 普通函数
def func1(name: String): String = "Hello" + name

// def 函数名(参数名: 参数类型): 返回值类型 = 函数的实现
```

高阶函数：把一个函数作为另一个函数的参数值

```scala
// 高阶函数
def someAction(f:(Double) => Double) = f(10)
```

![image-20191107214705867](http://pic.qn.prodapi.cn/typora/hexo/thomas/no6kh.png)

<!--more-->

## 四、高阶函数示例

```scala
// 高阶函数示例
var ms = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// map: 遍历元素, 返回一个新的集合
println(ms.map(_ * 2)) // List(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)
println(ms) // List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

// foreach: 遍历元素, 不返回结果
println(ms.foreach(_ * 2)) // ()
println(ms)

// filter: 过滤符合条件的元素，返回一个新集合
println(ms.filter(_ % 2 == 0)) // List(2, 4, 6, 8, 10)

// zip: 合并集合(丢弃右边多的元素)
println(List(1, 2, 3).zip(List(4, 5, 6, 7, 8))) // List((1,4), (2,5), (3,6)) // 丢弃右边多的元素

// partition: 分区， 根据断言的结果来进行分区
println(ms.partition(_ % 2 == 0)) // (List(2, 4, 6, 8, 10),List(1, 3, 5, 7, 9))

// find: 查找 满足第一个条件的
println(ms.find(_ % 3 == 0)) // Some(3)
println(ms.find(_ % 3 == 0).getOrElse(None)) // 3

// flatten: 展开，把两个集合展开成一个集合
println(List(List(2, 4, 6, 8, 10), List(1, 3, 5, 7, 9)).flatten) // List(2, 4, 6, 8, 10, 1, 3, 5, 7, 9)

// flatMap: 相当于 map + flatten
println(List(List(2, 4, 6, 8, 10), List(1, 3, 5, 7, 9)).flatMap(x => x.map(_ * 10))) // List(20, 40, 60, 80, 100, 10, 30, 50, 70, 90)

```

## 五、概念：闭包、柯里化



