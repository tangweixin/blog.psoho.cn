# ES6新特性

## 参考

- [ES6文档](http://es6.ruanyifeng.com/#docs/intro)
- [ES6阮一峰总结](https://www.cnblogs.com/eco-just/p/8461769.html)
- [mozillaJS手册](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference)

## 一、let、const、TDZ

### let命令

#### 基本用法

ES6新增了`let`命令用来声明变量，它的用法类似于`var`，但是所声明的变量只在`let`所在的代码块内有效。

```js
{
  let a = 10;
  var b = 20;
}
a		// VM80:5 Uncaught ReferenceError: a is not defined
b   // 20
```

#### 暂时性死区 

暂时性死区（Temporal Dead Zone）：在代码块内，使用`let`命令声明变量之前，该变量都是不可用的。
由于存在`TDZ`，所以`typeof`运算符不再是安全的了。

`let`不存在`变量提升`的问题。

```js
var tmp = 123;

if (true) {
  tmp = 'abc'; // Uncaught ReferenceError: tmp is not defined
  let tmp;
}
```

<!--more-->

#### 原因

使用`let`和`const`主要是减少运行时错误，防止变量在声明前就使用，从而导致意料之外的行为。
`let`不允许在相同作用域内，重复声明同一个变量。

```js
function func() {
  var a = 10;
  let a = 1;		// Uncaught SyntaxError: Identifier 'a' has already been declared
}

function func() {
  let a = 10;
  var a = 1;		// Uncaught SyntaxError: Identifier 'a' has already been declared
}

function func(){
  let a = 10;
  let a = 1;		// Uncaught SyntaxError: Identifier 'a' has already been declared
}
```

### 块级作用域

#### 为什么需要块级作用域 

防止内层变量覆盖外层变量。

#### 块级作用域

```js
{
  let a = 10;
}
```

可以多层嵌套

```js
{{let a = 1;}}
```

块级作用域的出现，使得`立即执行函数表达式`（IIFE）不再必要了。

### const命令

#### 基本用法

> `const`命令声明一个只读的常量。

一旦声明，常量的值就不能改变。

```js
const a = 10;
a = 2;		// Uncaught TypeError: Assignment to constant variable.
```

一旦声明变量，就必须立即初始化，否则会报错。

```javascript
const foo;		// Uncaught SyntaxError: Missing initializer in const declaration
```



## 二、变量的解构赋值

### 数组的解构赋值

#### 基本用法

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

```js
let [a, b, c] = [1, 2, 5]

// 对于Set也可以使用解构赋值
let [x, y, z] = new Set(['a', 'b', 'c']);

```

#### 默认值

解构可是使用默认值。

```js
let [x, y = 'b'] = ['a']; // x='a', y='b'
```

惰性求值，只有需要初始默认值时，才会执行。

```js
function f() {
  console.log('aaa');
}

let [x = f()] = [1];
```

### 对象的解构赋值

```js
// 变量的值由名称决定，不是按照数组的位置来定的。
let {foo, bar} = {foo: 'f', bar: 'B'}

// 默认值
let {foo, bar='XXX'} = {foo: 'f'}
```

对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量。

```js
let { log, sin, cos } = Math;
```

### 字符串的解构赋值

```js
const [a, b, c, d, e] = 'hello';
```

### 数值和布尔值的解构赋值

```js
let {toString: s} = 123;
s === Number.prototype.toString		// true
```

### 函数参数的解构赋值

```js
function add([x, y]) {
  return x + y;
}
add([1, 2]);			// 3

// 另一个例子
[[1, 2], [3, 4], [5, 6]].map(([a, b]) => a + b);		// (3) [3, 7, 11]

function fun({a=10, b=2}={}) {
  return [a, b];
}
fun({a:1})			// [1, 2]
fun()						// [10, 2]
```

### 用途

#### 函数参数定义以及默认值

```js
function f({a, b, c='C'} = {}) {
  console.info(a, b, c);
}
f({a:1, b:3});	// 1 3 "C"
f({a:1});				// 1 undefined "C"
f();						// undefined undefined "C"
```

#### 提取JSON数据

```js
let jsonData = {
  id: 42,
  status: 'OK',
  data: [888, 100]
}
// 提取后修改字段名称
let {id, status: s, data} = jsonData;
console.info(id, s, data);		// 42 "OK" (2) [888, 100]
```

#### 遍历map

```js
const map = new Map();
map.set('first', 'Hello');
map.set('second', 'World');

for (let [k, v] of map) {
  console.info(k, v);
}

for (let [,v] of map) {
  console.info(v);
}
```



## 三、字符串的扩展

### 字符串操作

#### 字符串遍历

```js
for (let c of 'Hello 世界') {
  console.info(c);
}
```

### #includes、startWith、endWith

```js
let s = 'hello world!';
s.startsWith('hell');
s.endsWith('!');
s.includes('o');
```

### 模板字符串

模板字符串使用反引号（`）表示，也可以用来定义多行字符串。

```js
// 普通字符串
`In JavaScript \n is a line-feed.`

// 多行字符串
`In JavaScript 
is a line-feed.
`

// 字符串中嵌入变量
let name='Thomas', time='today';
`Hello ${name}, How are you ${time}.`			// "Hello Thomas, How are you today."

// 如果字符串中存在反引号，需要在前面加转义字符\
`\`is Template String.`				// "`is Template String."
```

## 四、正则表达式

```
let reg = new RegExp('abc', 'i');
// 等价于
let reg = /abc/i
```

## 五、函数的扩展

### 函数参数的默认值

ES6允许为函数设置默认值，直接写在函数参数后面即可。

```js
function f(x, y=10) {
  console.info(x, y);
}
f(1);		// 1 10
```

参数赋值可以与解构赋值的默认值结合使用。

```js
function f({x, y=5}) {
  console.info(x, y);
}
f({}); // undefined 5
f({x: 1, y: 10});		// 1 10
f();	 // Uncaught TypeError: Cannot destructure property `x` of 'undefined' or 'null'.

// 解决没有参数时报错
function f({x, y=5} = {}) {
  console.info(x, y);
}
f();		// undefined 5
```

利用默认参数，可以指定某一参数不得省略。

```js
function throwError() {
  throw new Error('No Paramater Here!');
}
function f(x=throwError()) {
  console.info('Hi');
}
f();				// Uncaught Error: No Paramater Here!
```

### REST参数（可变参数）

`…`用来表示可变参数

```js
function f(...vs) {
  console.info(vs);
}
f(1, 2, 3, 4, 5);			// (5) [1, 2, 3, 4, 5]
```

排序

```js
let fsort = (...items) => items.sort();
fsort(1, 5, 3, 2, 0);	// (5) [0, 1, 2, 3, 5]

// 顺序
[1, 2 , 8, 1, 0].sort((a, b) => a - b);

// 逆序
[1, 2 , 8, 1, 0].sort((a, b) => b - a);
```

> rest参数后不能再有其它参数，否则会报错！

### 箭头函数

```js
let f = v => v;
// 等同于
function f(v) { return v };
```

如果箭头函数不需要参数或者需要多个参数则使用一个圆括号表示参数部分

```js
let f = () => 5;
// 等同于
function f() {return 5};
```

## 六、数组的扩展

### 扩展运算符

扩展预算符(spread)是三个点 `…`，它好比`rest`参数的逆运算，将一个数组转为用逗号分隔的参数序列。

```js
console.info(...[1, 2, 3]);						// 1 2 3

console.info(1, 2, ...[1, 2, 3]);			// 1 2 1 2 3
```

用于函数调用

```js
let f = (x, y) => x + y;
f(...[1, 2]);			// 3
```

简化函数调用

```js
Math.max(...[1, 2, 9, 0]);			// 9

// 等同于
Math.max(1, 2, 9, 0);
```

数组去重

```js
let a = [1, 2, 3];
let b = [2, 3, 4];
new Set([...a, ...b]);		// Set(4) {1, 2, 3, 4}

// set转数组
[y] = [...new Set([...a, ...b])];		// (4) [1, 2, 3, 4]

// set转数组第二种方式
```

复制数组

```js
let a = [1, 2, 3];
let b = [...a];
```

合并数组

```js
let a = [1, 2, 3];
let b = [2, 3, 4];
let c = [3, 4, 5];
let d = [...a, ...b, ...c];		// (9) [1, 2, 3, 2, 3, 4, 3, 4, 5]
```

与解构赋值结合，用于生成新数组。

```js
let a = [1, 2, 3];
[na, ...arr] = a;
na   	// 1
arr		// (2) [2, 3]
```

字符串转数组，能识别四个字节的Unicode字符

```js
[...'Hello 世界🐶']			// (9) ["H", "e", "l", "l", "o", " ", "世", "界", "🐶"]
```

### Array.from

`Array.from`用于将一个类数组对象转换为数组

```js
Array.from(new Set([1, 2, 3, 4]));	// (4) [1, 2, 3, 4]
```

### Array.of

`Array.of`用于将一组值转换为数组

```js
Array.of(1, 2, 3);		// (3) [1, 2, 3]

```

### find()

`find`方法用户 返回第一个匹配的结果

```js
['a', 'c', 'B'].find(a=> a === 'B')		// B

```

### entries()、keys()、values()

ES6提供3个新的方法用于遍历数组

```js
// keys
for (let k of ['a', 'b', 'c'].keys()) {
  console.info(k)  		// 0, 1, 2
}

// entries
for (let [k, v] of ['a', 'c', 'B'].entries()){
  console.info(k, v)
}
```

### includes

`includes`用于判断数组中是否存在该值

```js
[1, 2, 3].includes(2)		// true
[1, 2, 3].includes(4)		// false
```

### flat()、flatMap()

`flat`和`flatMap`方法，用于将数组拉平，变成一维数组

```js
// 默认只拉平一级
[1, 2, [3, 4]].flat();			// (4) [1, 2, 3, 4]			

// 指定拉平级数
[1, 2, [3, [4, 5]]].flat();		// (4) [1, 2, 3, Array(2)]
[1, 2, [3, [4, 5]]].flat(2);	// (5) [1, 2, 3, 4, 5]

// 可以指定拉平的级数或者无限拉平
[1, 2, [3, [4, 5]]].flat(Infinity);

```

`flatMap`先执行一个函数再拉平



## 七、对象的扩展

### 对象的解构赋值

```js
let {a:x, b:y, ...z} = {a: 'A', b: 'B', c: 'C', d: 'D'}
x // A 
y // B
z // {c: "C", d: "D"}
```

字符解构赋值

```js
{...'hello'}		//	{0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}

```

合并两个对象

```js
// 如果存在相同属性，后面的会覆盖前面的
let a = {a: 'A', x: 'X'};
let b = {b: 'B', x: 'XX'};		
{...a, ...b}				// {a: "A", x: "XX", b: "B"}
```



## 八、Set和Map

### Set

`set`和数组类似，里面的值是唯一的，使用`===`进行比较，所以`1`和`"1"`是两个不同的值，不会进行类型转换。

`set`转数组

```js
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
```

`set`去重复

```js
let uniq = [...new Set([1, 2, 2, 2, 3])]	
uniq		// (3) [1, 2, 3]
```

使用`set`容易实现并集、交集、差集

```js
let a = new Set([1, 2, 3]);
let b = new Set([3, 4, 5]);

// 并集
let union = new Set([...a, ...b]);								// Set(5) {1, 2, 3, 4, 5}

// 交集
let intersect = [...a].filter(e => b.has(e));			// [3]

// 差集
let diffrect = [...a].filter(e =>! b.has(e));			// (2) [1, 2]
```

### Map

JavaScript的对象Object，本质上是键值对的集合(Hash结构)。

```js
let m = new Map();
m.set('a', 'A');
m.get('a');				// A
m.has('a');				// true
m.delete('a');		// true
m.has('a');				// false
```

遍历

```js
let m = new Map([
  ['name', 'Thomas'],
  ['age', '17']
]);

// 遍历键
for (let k of m.keys()) {
  console.info(k);
}
// name
// age

for (let [k, v] of m) {
  console.info(k + ' >>: ' + v);
}
// name >>: Thomas
// age >>: 17
```



## 九、Proxy 

### Proxy基本用法

`Proxy`用于修改某些操作的默认行为，等同于在语言层面做出了修改，属于一种元编程（Meta Programming）。

```js
// 基本语法
let proxy = new Proxy(target, handler);

// 示例： 修改属性的设置和读取行为
let obj = new Proxy({}, {
  get(target, key, receiver) {
    console.info('get: ', target, key, receiver);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.info('set: ', target, key, value, receiver);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.x = 'X';						// set:  {} x X Proxy {}
console.info(obj.x);		// get:  {x: "X"} x Proxy {x: "X"} 
```

## 十、Promise

### Promise简介

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

`Promise`对象有以下两个特点。

（1）对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从`pending`变为`fulfilled`和从`pending`变为`rejected`。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对`Promise`对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

基本语法

```js
let promise = new Promise((resolve, reject) => {
  // ...
  if(true) {
    resolve();
  }else{
    reject();
  }
});

promise.then((value)=>{
  // success
}).catch((error)=>{
  // error
}).finally(()=>{
  // finnaly
});
```

简单示例

```js
let timeout = (ms) => {
  return new Promise((resolve, reject)=>{
    setTimeout(resolve, ms, 'OK');
  });
}

timeout(1200).then((v)=>{
  console.info(`完成: ${v}`, this);
});
```

加载图片示例

```js
let loadImg = (url) => {
  return new Promise((resolve, reject)=>{
    let img = new Image();
    img.onload = () =>{resolve(img)};
    img.onerror = (error) => {reject(error)};
    img.src = url;
  })
}

loadImg('https://goss3.vcg.com/creative/vcg/800/new/VCG211191062387.jpg').then((img)=>{
  console.info('img', img);
}, (err)=> {
  console.warn('Load image has failure!', err);
});

```



## 十一、async函数

### 基本用法

`async`函数本质上是`Generator`的语法糖

```js
let f = async() => { return 'Hello world!' };
f().then((v)=>{console.info(`v=${v}`)});
// v=Hello world! 

let f = async() => {throw new Error('NullPointException.')};
f().catch((e)=>{console.info(e)});
// Error: NullPointException.
//    at f (<anonymous>:1:27)
//    at <anonymous>:2:1
```











