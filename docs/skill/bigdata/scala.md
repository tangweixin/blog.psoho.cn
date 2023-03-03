# Scala基础语法

## 基础知识

### Scala中的数据类型、变量、常量

任何数据都是对象，`1`就是一个对象

基本数据类型，Byte Short Int Long String Char...

字符串的插值操作，相当于字符串拼接

```scala
var s1:String = "Jack"
s"I like Rose and ${s1}"
```

`Unit`和`Nothing`类型

`Unit`类型，相当于Java中的`void`

`Nothing`，如果程序执行过程中，产生了异常，则返回Nothing

### 函数：Scala的头等公民

1. 内置函数

2. 自定义函数： 关键字 `def`

   格式： def 函数名称([参数列表:参数的类型]*): 返回值的类型 = {}

   ```scala
   // 求和
   def sum(x:Int, y:Int): Int = x + y
   
   // 求阶乘
   def factor(x: Int): Int = {
     if(x <= 1)
     	1
     else
     	// 执行递归
     	x * factor(x - 1)
   }
   ```

   注意：不要写`return`，函数最后一句就是函数的返回值

<!--more-->

## 语法基础

### 一、循环语句

```scala
// for, while, do...while
// 使用foreach执行迭代
```

### 二、函数参数

1. 函数参数的求值策略

   1. call by value :  只求值一次
   2. call by name : => 每次调用都求值

2. 函数参数的类型

   1. 默认参数

    ```scala
   def fun1(name: String = "Tom"): String = s"Hello ${name}"
    ```

   2. 代名参数

    ```scala
   def fun2(str: String = "Good Morning", name: String = "Tom", age: Int = 20): String = s"${str}, Hello ${name} age=${age}"
   
   // 调用时，可以指定具体的参数名
   println(fun2(name = "JJ"))
    ```

   3. 可变参数

   ```scala
   def fun3(args: Int*) = args.reduce(_ + _)   // 求和
   
   // 调用
   println(fun3(1, 2, 3, 4, 5))
   ```


### 三、懒值

延迟加载，只有真正调用的时候，才会计算求值

### 四、数组

```scala
// 定长数组
val a = new Array[Int](10)

// 变长数组
val b = ArrayBuffer[String]()
b.append("b") // 追加一个元素
b += "1" // 追加一个元素
b += ("3", "4", "5") // 追加多个元素
b.foreach(println)
```

### 五、映射

```scala
// 不可变Map
val scores = Map("Tom" -> 80, "Mary" -> 85, "Mike" -> 82)

// 可变的Map
val words = scala.collection.mutable.Map(("Alice", 80), ("Bob", 95), ("Marry", 75))
```

### 六、元组

```scala
// Tuple: 不同类型的值的集合
val t1 = (1, 3.14, "PI")
//    val t1 = Tuple3(1, 3.14, "PI")

// 获取元素
println(t1._1)
println(t1._2)
println(t1._3)

// 迭代器
t1.productIterator.foreach(println)
```


## 面向对象

### 一、面向对象的基本概念

1. 封装: class
2. 继承
3. 多态

### 二、定义类

```scala
class Student1 {

  // 定义属性
  var stuID: Int = 0 // 自动生成get和set方法
  val uuid: Long = 8888 // 只有get没有set
  private var stuName: String = _
  private[this] var age: Int = 2 // 类私有的
  @BeanProperty var high: Int = 0 // 自动生成get和set方法

  // 定义成员方法（函数）：get和set
  def getStuName(): String = stuName

  def setStuName(newName: String) = this.stuName = newName

  override def toString: String = s"stuID=${stuID}, stuName=${stuName}, age=${age}"

}
```

### 三、内部类

```scala
// 内部类
class Student2 {

  var name: String = _
  var age: Int = 0

  var courseList = ArrayBuffer[Course]()

  // 定义内部类
  class Course(var name: String, var course: Int) {
    override def toString: String = s"${name} \t ${course}"
  }
}
```

### 四、类的构造器：两种

1. 柱构造器

   ```scala
   // 柱构造器
   class Course(var name: String, var course: Int) 
   ```

2. 辅助构造器

   ```scala
   // 主构造器
   class Student3(var stuName: String, var age: Int) {
   
     // 辅助构造器
     def this(age: Int) {
       this("No Name", age)
       println("调用了辅助构造器")
     }
   
     override def toString: String = s"${stuName} \t ${age}"
   }
   ```

### 五、Object对象：相当于Java中的static

1. Object中的内容都是静态的
2. 在scala中，没有静态修饰符static
3. 如果class的名字，跟object的名字一样，这时候就把object叫做类的伴生对象
4. 应用：
   1. 使用object实现单例模式
   2.  使用App对象，应用程序对象，可以省略main函数

### 六、apply方法：可以省略new关键字，根据自 己的需要进行初始化

```scala
class Student4(var name: String) {
  override def toString: String = s"${name}"
}

// 需要使用伴生对象
object Student4 {

  def apply(name: String): Student4 = {
    println("调用了apply")
    new Student4(name)
  }
}

object A6apply {

  def main(args: Array[String]): Unit = {

    var s = new Student4("Thomas")
    println(s)

    // 使用apply，可以省略new关键字
    var s2 = Student4("Toom")
    println(s2)

  }
}
```

### 七、继承

```scala
// 继承
object A7Extends {

  def main(args: Array[String]): Unit = {

    var p = new Person("Thomas", 100)
    println(p.sayHi())

    p = new Employee("Jane", 102, 88888)
    println(p.sayHi())
    
    // 匿名子类
    p = new Person("Jack", 10) {
      override def sayHi(): String = super.sayHi() + "我是匿名子类的方法"
    }
    println(p.sayHi())
  }

}


class Person(val name: String, val age: Int) {
  def sayHi(): String = s"Hi, ${name}, I am ${age} years old."
}

// 使用子类的构造参数，覆盖父类的构造参数
class Employee(override val name: String, override val age: Int, var salary: Int) extends Person(name, age) {
	// 覆盖父类的方法
  override def sayHi(): String = super.sayHi() + s" Salary is ${salary}"
}
```

### 八、特质（trait）:类似Java中的抽象类，并且支持多继承

抽象

```scala
// 抽象
object A8Abstract {

  def main(args: Array[String]): Unit = {

    var v1 = new Car
    println(v1.sayHi())

    var v2 = new Bike
    println(v2.sayHi())
  }

}


// 抽象类: 车
abstract class Vehicle() {
  var len: Long

  def sayHi(): String
}

// 子类：小汽车， 自行车
class Car extends Vehicle {
  // 长度
  override var len: Long = 5050

  override def sayHi(): String = s"This is Car. lenth=${len}"
}

class Bike extends Vehicle {
  override var len: Long = 150

  override def sayHi(): String = s"This is Bike. lenth=${len}"
}
```

多重继承

```scala
// 多重继承
object A9ExtendsTrait {

  def main(args: Array[String]): Unit = {

    var p = new Person3(1001, "Thomas")
    println(p.sayHi())

  }

}

// trait 特质
trait Human {
  val id: Int
  val name: String
}

trait Actions {
  def sayHi(): String
}

class Person3(val id: Int, val name: String) extends Actions with Human {
  override def sayHi(): String = s"Hi ${name}, ID=${id}"
}
```



### 九、包和对象

包对象

```scala
package d4

package object DemoPakcageObject {
  
  val name: String = "100"
  
  class InnerClassA {
    
  }
}

import d4.DemoPakcageObject._

var x = new InnerClassA
```

