---
title: 大数据-Scala集合
date: 2019-11-11 11:25:22
tags:
 - Scala
categories:
 - 大数据
---

## 集合

### 一、集合：可变集合、不可变集合

```scala
// 不可变集合
val math = scala.collection.immutable.Map("Tom" -> 80, "Marry" -> 90, "Mike" -> 95)

val math2 = scala.collection.mutable.Map("Tom" -> 80, "Marry" -> 90, "Mike" -> 95)

// 集合的操作
// 获取集合中的值
println(math.get("Tom"))
println(math("Tom"))
println(math.getOrElse("Tom", None))

// 判断集合中是否有值
println(math.contains("Tom2"))

// 更新集合中的值
//    math("Tom") = 20 // Error:(22, 5) value update is not a member of scala.collection.immutable.Map[String,Int]
math2("Tom") = 20 // 必须是可变集合
println(math2("Tom"))

// 添加新元素
println("**********************添加新元素**********************")
math2 += ("Jack" -> 100)
println(math2)

// 删除元素
println("**********************删除元素**********************")
println(math2.remove("Tom2"))
println(math2.remove("Tom"))
println(math2 -= "Tom") // 第二种方式
```

<!--more-->

### 二、列表：可变列表、不可变列表

```scala
// 字符串列表
val nameList = List("Bob", "Tom", "Mary")
println(nameList)

// int列表
val intList = List(1, 2, 3)
println(intList)

// 空列表
val nullList: List[Nothing] = List()
println(nullList)

// head: 返回第一个元素
// tail: 返回的是除去第一个元素后剩下的元素
println(nameList.head + "\t" + nameList.tail) // Bob	List(Tom, Mary)

// 可变列表
val list = ListBuffer("a", "b", "c")
println(list)

// 新增元素
list += "d"
println(list) // ListBuffer(a, b, c, d)

// 删除元素
list -= "a"
println(list) // ListBuffer(b, c, d)

```

### 三、序列：

```scala
// 序列
val v = Vector(1, 2, 3, 4, 5, 6) // Vector(1, 2, 3, 4, 5, 6)
println(v)

// 第一种方式
val r = Range(0, 5) // Range(0, 1, 2, 3, 4)
println(r)

// 第二种方式
val r2 = 0 until 5 // Range(0, 1, 2, 3, 4)
println(r2)

// 第三种方式
val r3 = 0 to 4 // Range(0, 1, 2, 3, 4)
println(r3)

val r4 = (0 to 9) ++ ('A' to 'Z') // Vector(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z)
println(r4)

// 把Range转成List
val l1 = (1 to 5).toList
println(l1) // List(1, 2, 3, 4, 5)
```

### 四、集（Set）：不重复的元素

```scala
// 集
val s1 = Set(1, 2, 10, 8)
println(s1) // Set(1, 2, 10, 8)

// 往s1中添加元素：重复的，不重复的
println(s1 + 10) // Set(1, 2, 10, 8)
println(s1 + 100) // Set(10, 1, 2, 8, 100)

// 创建一个可以排序的set
var s2 = SortedSet(1, 2, 3, 10, 8)
println(s2)

// 集的操作
//    val s3 = scala.collection.mutable.Set("星期一", "星期二", "星期三", "星期四")
val s3 = scala.collection.mutable.LinkedHashSet("星期一", "星期二", "星期三", "星期四")
println(s3)
s3 += "星期五"
println(s3)

// 判断集合中是否存在某个元素
println(s3 contains "星期二")

// 判断一个集合是否是另一个集合的子集
println(Set("星期二", "星期四") subsetOf s3)

// 集合运算
var set1 = Set(1, 2, 3, 4, 5, 6)
var set2 = Set(5, 6, 7, 8, 9, 10)
println("并集: " + (set1 union set2))
println("交集: " + (set1 intersect set2))
println("差集: " + (set1 diff set2))
```

### 五、模式匹配：相当于Java中的switch.case

```scala
// 模式匹配
// 1. 相当于是一个switch case语句
var sign = 0
var ch1 = '-'
ch1 match {
  case '+' => sign = 1
  case '-' => sign = -1
  case _ => sign = 0
}
println(sign) // -1

// 2.scala的守卫，匹配某种类型的所有值
var ch2 = '6'
var digit: Int = -1
ch2 match {
  case '+' => println("这是一个加号")
  case '-' => println("这是一个减号")
  case _ if Character.isDigit(ch2) => digit = Character.digit(ch2, 10)
}
println(digit)

// 3.模式匹配中的变量
var mystr = "Hello World"
mystr(7) match {
  case '+' => println("这是一个加号")
  case '-' => println("这是一个减号")
  case ch => println("这个字符是：" + ch)
}

// 4.匹配类型
//    var v4: Any = 100 // 最终V4世纪是一个整数
var v4: Any = "100" // 最终V4世纪是一个整数
v4 match {
  case x: Int => println(s"${x}：是一个整数")
  case x: String => println(s"${x}：是一个字符串")
}

// 5. 匹配数组和列表
var myArray = Array(1, 2, 3)
myArray match {
  case Array(0) => println("数组中只有一个零")
  case Array(x, y) => println("数组包含二个元素")
  case Array(x, y, z) => println("数组包含三个元素")
  case Array(x, _*) => println("这是数组")
}

//
var myList = List(1, 2, 3)
myList match {
  case List(0) => println("列表中只有一个零")
  case List(x, y) => println(s"列表中有二个元素: ${x}, ${y}")
  case List(x, y, z) => println(s"列表中有三个元素: ${x}, ${y}, ${z}")
  case List(x, _*) => println("这是类表")
}
```

### 六、样本类case class

* 支持模式匹配
* 定义Spark SQL的Schema，定义Spark SQL的表结构

```scala
object A9class_case {

  def main(args: Array[String]): Unit = {

    // 样本类
    var a: Vehicle = new Car("小汽车")

    // 模式匹配，相当于instanceof
    a match {
      case Car(name) => println("汽车: " + name)
      case Bike(name) => println("自行车: " + name)
      case _ => println("其他交通工具")
    }

    // 
  }

}

// 交通工具
class Vehicle

// 子类， 样本类
case class Car(name: String) extends Vehicle

case class Bike(name: String) extends Vehicle
```

