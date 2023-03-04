---
title: Spring常用工具类
date: 2019-09-04 19:28:38
tags:
 - Java
 - Spring
categories:
 - 后端
---

## 简介

本篇介绍`spring`自带的工具类，熟练掌握后有助于提升开发效率。

## spring-core

该包主要提供一些基础的工具类，包名为：`org.springframework.util`。

### Base64Utils

Base64编解码

```java
String text = "Hello World!";
String s = Base64Utils.encodeToString(text.getBytes());     // 编码
System.out.println(s);
s = new String(Base64Utils.decodeFromString(s));            // 解码
System.out.println(s);
```

<!--more-->

### ClassUtils

类相关，主要包括获取类的相关信息，包括方法、接口、反射信息等

```java
Method m = ClassUtils.getMethod(ClassUtilsDemo.class, "main", String[].class);      // 获取方法信息
System.out.println(m);

Boolean f = ClassUtils.isCglibProxy(new ClassUtilsDemo());          // 判断是否是Cglib代理的类
System.out.println(f);

System.out.println(ClassUtils.getShortName(ClassUtils.class));                  // 获取短类名
System.out.println(ClassUtils.getShortNameAsProperty(ClassUtils.class));        // 获取短类名首字母小写
```

### CollectionUtils

集合、数组相关操作

```java
List<String> list = CollectionUtils.arrayToList(new String[]{"Hello", "world", "!"});   // 数组转列表
System.out.println(list);
System.out.println(CollectionUtils.isEmpty(new HashMap<>()));           // 集合是否为空
System.out.println(CollectionUtils.isEmpty(new ArrayList<>()));         // 集合是否为空
```

### DigestUtils

获取字节、流的MD5签名

```java
String s = DigestUtils.md5DigestAsHex("Thomas".getBytes());     // MD5签名
System.out.println(s);      // 2042101ac1f6e7741bfe43f3672e6d7c
```

### FileCopyUtils

拷贝文件和流

```java
File f = new File("pom.xml");
byte[] b = FileCopyUtils.copyToByteArray(f);        // 拷贝文件到字节数组
System.out.println(b.length);
```

### ObjectUtils

对象相关操作

```java
System.out.println(ObjectUtils.isArray(new Object[]{}));    // 是否为数组
System.out.println(ObjectUtils.isEmpty(new Object[]{}));    // 是否为空
```

### ReflectionUtils

反射相关操作：获取字段、修改字段、获取方法、调用方法等

```java
private String age;

public static void main(String[] args) {
  Field f = ReflectionUtils.findField(ReflectionUtilsDemo.class, "age");     // 获取age字段
  System.out.println(f.isAccessible());   // false
  ReflectionUtils.makeAccessible(f);      // 修改字段的可访问性
  System.out.println(f.isAccessible());   // true
}
```

### ResourceUtils
获取资源文件

```java
File f = ResourceUtils.getFile("classpath:application.yml");    // 获取资源文件
System.out.println(f);      // /Users.../target/classes/application.yml
```

### SerializationUtils

序列化、反序列化对象

```java
Map<String, Object> map = new HashMap<>();
map.put("name", "Thomas");
byte[] bs = SerializationUtils.serialize(map);      // 序列化Map对象
Object obj = org.apache.commons.lang3.SerializationUtils.deserialize(bs);   // 反序列化
System.out.println(obj);        // {name=Thomas}
```

### StreamUtils

流相关操作，拷贝流、拷贝流到`byte`数组、拷贝流到`String`等。

```java
ByteArrayInputStream in = new ByteArrayInputStream("Hello World!".getBytes());
byte[] buf = StreamUtils.copyToByteArray(in);
System.out.println(buf.length);             // 12
System.out.println(new String(buf));        // Hello World!

String text = StreamUtils.copyToString(in, Charset.defaultCharset());   // 从一个流中获取字符串
System.out.println(text);

ByteArrayOutputStream out = new ByteArrayOutputStream();
StreamUtils.copy(in, out);      // 拷贝输入流到输出流
```

### StringUtils

字符串相关操作

```java
System.out.println(StringUtils.hasText(" \n"));             // false  是否为包括非空白字符
String name = "/Users/thomas/Documents/aaa/bbb/hi.txt";
System.out.println(StringUtils.getFilename(name));              // hi.txt 获取文件名称
System.out.println(StringUtils.getFilenameExtension(name));     // txt  获文件取扩展名
```

### SystemPropertyUtils

获取系统环境变量

```java
String javaHome = SystemPropertyUtils.resolvePlaceholders("${JAVA_HOME}");  // 获取系统环境变量
System.out.println(javaHome);   // /Library/Java/JavaVirtualMachines/jdk1.8.0_202.jdk/Contents/Home
```

### ReflectUtils

所在包为：`org.springframework.cglib.core`

提供cglib的常用方法

```java
Object obj = ReflectUtils.newInstance(HashMap.class);       // 创建一个HashMap实例
if(obj instanceof Map) {
  Map<String, Object> map = (Map<String, Object>) obj;
  map.put("name", "Thomas");
  System.out.println(map);
}
```

### AnnotationUtils

所在包为：`org.springframework.core.annotation`

用于操作注解

```java
public class AnnotationUtilsDemo {

    @Transient
    @Order
    public static void main(String[] args) {
        Method m = ClassUtils.getMethod(AnnotationUtilsDemo.class, "main", String[].class); // 获取main方法
        Annotation[] as = AnnotationUtils.getAnnotations(m);    // 获取方法上的所有注解
        System.out.println(CollectionUtils.arrayToList(as));
        // [@java.beans.Transient(value=true), @org.springframework.core.annotation.Order(value=2147483647)]
    }

}
```

### OrderUtils

所在包为：`org.springframework.core.annotation`

获取`org.springframework.core.annotation.Order`、`javax.annotation.Priority`的优先级

```java
@Order(18)
@Priority(17)
public class OrderUtilsDemo {

    public static void main(String[] args) {
        System.out.println(OrderUtils.getOrder(OrderUtilsDemo.class));          // 获取排序数值 18
        System.out.println(OrderUtils.getPriority(OrderUtilsDemo.class));       // 获取优先级数值 17
    }

}
```

## spring-beans

该包主要提供一些bean相关的工具类，包名为：`org.springframework.beans`。

### BeanUtils

主要用来拷贝对象的属性，只能拷贝带有`setter`、`getter`方法的属性

```java
public class BeanUtilsDemo {

    static class Foo {
        String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }

    public static void main(String[] args) {
        Foo f1 = new Foo();
        f1.name = "Foo1";
        Foo f2 = new Foo();
        BeanUtils.copyProperties(f1, f2);   // 拷贝属性，注意：只能拷贝有setter,getter方法的属性
        System.out.println(f1.name);
        System.out.println(f2.name);
    }

}
```



