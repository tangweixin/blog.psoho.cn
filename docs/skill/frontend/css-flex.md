# Flex布局

## 一、什么是Flex布局

Flex是Flexible Box的缩写，意为“弹性布局”，用来为盒子模型提供最大灵活性。任何一个容器都可以指定为Flex布局。

```css
.box {
  display: flex;
}
```

行内元素也可以使用flex布局。

```css
.box {
  display: inline-flex;
}
```

> 设置为flex布局后，子元素的`float`、`clear`、`vertical-align`都将失效。

## 二、基本概念

采用flex布局的元素，称为flex容器（flex-container）简称“容器”。它的所有子元素自动称为容器成员，称为flex项目（flex-item），简称“项目”。

![img](http://pic.qn.prodapi.cn/typora/hexo/thomas/tul1q.png)

容器默认存在两根轴，水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`。交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。

项目默认沿主轴排列，单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`。

<!--more-->

## 三、容器的属性

以下6个属性设置在容器上

- `flex-direction`
- `flex-wrap`
- `flex-flow`
- `justify-content`
- `align-items`
- `align-content`

### flex-direction属性

`flex-direction` 属性决定主轴的方向（即项目的排列方向）。

```
.box {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

![img](http://pic.qn.prodapi.cn/typora/hexo/thomas/drm2m.png)

它可能有四个值：

- `row`（默认值）：主轴为水平方向，起点在左端。
- `row-reverse`：主轴为水平方向，起点在右端。
- `column`：主轴为垂直方向，起点在顶端。
- `column-reverse`：主轴为垂直方向，起点在底端。

### flex-wrap属性

默认情况下，项目都排在一条线（又称轴线）上。`flex-wrap` 定义如果一条轴线排不下，该如何换行。

![img](http://pic.qn.prodapi.cn/typora/hexo/thomas/2e1n2.png)

```
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

它可能取三个值：

（1）`nowrap`（默认）不换行。

![img](http://pic.qn.prodapi.cn/typora/hexo/thomas/8wc5t.png)

（2）`wrap`换行，第一行在上方。

![img](http://pic.qn.prodapi.cn/typora/hexo/thomas/yhwvd.jpg)

（3）`wrap-reverse`换行，第一行在下方。

![img](http://pic.qn.prodapi.cn/typora/hexo/thomas/l92xv.jpg)

### flex-flow属性

`flex-flow`属性是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`。

```
.box {
  flex-flow: <flex-direction> || <flex-wrap>;
}
```

### justify-content属性

`justify-content`属性定义了项目在主轴上的对齐方式。

```
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

![img](http://pic.qn.prodapi.cn/typora/hexo/thomas/orzm8.png)

它能取5个值，具体的对齐方式与轴的方向有关。下面假设主轴为从左到右。

- `flex-start`(默认) ：左对齐。
- `flex-end`：右对齐。
- `center`：居中对齐。
- `space-between`： 两端对齐，项目之间的间隔都相等。
- `space-around`： 每个项目两侧间隔相等，所以项目之间的间隔比项目与边框的间隔大一倍。

### algin-items属性

`algin-items`定义项目在交叉轴上如何对齐

```
.box {
  algin-items: flex-start | flex-end | center | baseline | stretch;
}
```



它能取5个值，具体的对齐方式和交叉轴的方向有关，下面假设交叉轴为从上到下。

- `stretch`（默认值）： 如果项目未设置高度或设置为`auto`，将占满整个容器的高度。

- `flex-start`：交叉轴的起点对齐。
- `flex-end`：交叉轴的终点对齐。
- `center`：交叉轴的中点对齐。
- `baseline`：项目的第一行文字的基线对齐。 

### align-content属性

`align-content`定义了项目的多根轴的对齐方式，如果项目只有一根轴，则该属性不起作用。

```
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```



它能取6个值

- `stretch`（默认）：轴线将占满整个交叉轴。
- `flex-start`：与交叉轴的起点对齐。
- `flex-end`：与交叉轴的终点对齐。
- `center`：与交叉轴的中点对齐。
- `space-between`：与交叉轴两端对齐，轴线之间的间隔平均分布。
- `space-around`：每根轴线的两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的距离大一倍。

## 四、项目的属性

项目的属性包括以下6个

- `order`
- `flex-grow`
- `flex-shrink`
- `flex-basis`
- `flex`
- `algin-self`

### order属性

`order`属性定义了项目的排列属性，数值越小，排列越靠前，默认值为0。

```
.item {
  order: <integer>; /* defualt 0 */
}
```



### flex-grow属性

`flex-grow`属性定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大。

```
.item {
  flex-grow: <integer>; /* defualt 0 */
}
```



如果项目的`flex-grow`属性都为1，那么他们将等分剩余空间（如果有的话）。

如果一个项目的`flex-grow`属性为2，其他项目都为1，那么前者占据的剩余空间将比其它项目多一倍。

### flex-shrink属性

`flex-shrink`属性定义了项目的缩小比例，默认为1，如果空间不足，该项目将缩小。

```
.item {
  flex-shrink: <integer>; /* defualt 1 */
}
```



所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。

如果一个项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小。

**注意**: 负值对该属性无效。

### flex-basis属性

`felx-basis`属性定义了在分配多余的空间之前，项目占据的主轴空间（main-size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目本来的大小。

```
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

它可以设置为跟`width`或`height`属性一样的值（如`350px`），则项目将占据固定空间。

### flex属性

`flex`属性是`flex-grow`、`flex-shrink`、`flex-basis`的简写，默认值是`0 1 auto`。后两个属性可选。

```
.item {
  flex: none | [<'flex-grow'> | <'flex-shrink'>? || <'flex-basis'> ]
}
```

该属性还有两个快捷值：`auto`(`1 1 auto`)和`none`(`0 0 auto`)。

建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

### align-self属性

`algin-self`属性允许单个项目有与其它项目不一样的对齐方式，可以覆盖`align-items`属性。

默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`。

```
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

![img](http://pic.qn.prodapi.cn/typora/hexo/thomas/sqqz7.png)

该属性有6个值：除了`auto`其他值与`align-items`完全一致。

- `auto`（默认）： 表示继承父元素的`align-items`属性。
- `flex-start`： 与交叉轴的起点对齐。
- `flex-end`：与交叉轴的终点对齐。
- `center`： 交叉轴的终点对齐。
- `baseline`： 项目的第一行文字的基线对齐。
- `stretch`： 如果项目未设置高度或高度设置为`auto`，将占满整个容器的高度。

## 五、参考

- [a-guide-to-flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [a-visual-guide-to-css3-flexbox-properties](https://scotch.io/tutorials/a-visual-guide-to-css3-flexbox-properties)
- [阮一峰のFlex布局教程](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- [布局示例](http://static.vgee.cn/static/index.html)
