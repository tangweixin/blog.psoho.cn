---
title: 大数据-Scala高级特性
date: 2019-11-12 11:44:11
tags:
 - Scala
categories:
 - 大数据
---

## 高级特性

### 泛型

1. 泛型类

   ```scala
   // 泛型类
   object A1genericity {
   
     def main(args: Array[String]): Unit = {
   
       var a = new GenericityClass[String]
       a.setContent("hello")
       println(a.getContent)
   
       var b = new GenericityClass[Int]
       b.setContent(100)
       println(b.getContent)
     }
   
   }
   
   //
   class GenericityClass[T] {
     @BeanProperty var content: T = _
   }
   ```

2. 泛型函数

   ```scala
   object A2genericity_function {
   
     def main(args: Array[String]): Unit = {
   
       // 泛型函数
       val a = mkArray("A", "B", "C", "D", "E", "F", "G", "H", "I", "J")
       println(a.toList)
   
       val b = mkArray(1, 2, 3, 4, 5, 6, 7, 8, 9)
       println(b.toList)
   
     }
   
     // 泛型函数
     // ClassTag表示运行是的信息
     def mkArray[T: ClassTag](elem: T*) = Array[T](elem: _*)
   
   }
   ```
<!--more-->
3. 上界和下界 upper bound | lower bound

   ```scala
   // 规定泛型的取值范围
   上界：S <: T  规定了S的类型，必须是T的子类或者本身
   下界: U >: T  规定了U的类型，必须是T的父类或者本身
   
   object A3upper_bound {
   
     def main(args: Array[String]): Unit = {
   
       // 泛型上界
       var a = new Car
       takeVehicle(a)
   
       var b = new Vehicle
       takeVehicle(b)
   
     }
   
     def takeVehicle[T <: Vehicle](v: T): Unit = {
       v.drive()
     }
   
   }
   
   // 定义父类
   class Vehicle {
     def drive() = println("Driving")
   }
   
   // 定义子类
   class Car extends Vehicle {
     override def drive(): Unit = println("Car Driving")
   }
   
   // 定义子类
   class Bike extends Vehicle {
     override def drive(): Unit = println("Bike Driving")
   }
   ```

4. 视图界定 view bound

   

5. 协变和逆变

   1. 协变：在类型参数的前面加上`+`
   2. 逆变：在类型参数的前面加上`-`

### 隐式转换

1. 隐式转换函数：多一个关键字`implicit`

2. 隐式参数：使用`implicit`声明的函数参数就叫隐式参数

3. 隐式类：

   ```scala
   object A5implicit_class {
   
     // 通过隐式类来增强类的功能
     implicit class Calc(x: Int) {
       def tadd(y: Int): Int = x + y
     }
   
     def main(args: Array[String]): Unit = {
   
       // 隐式类
       println(1.tadd(2))
   
     }
   
   }
   ```

   

