# CSS经典

## 公祭日样式

整个网站版面需要设置为灰色。

### 核心代码

> CSS

```css
html {
   filter: grayscale(1);
}
```

> JS 浏览器控制台执行即可

```js
// 一键增加
document.getElementsByTagName('html')[0].style.filter = 'grayscale(1)'
// 一键去除
document.getElementsByTagName('html')[0].style.filter = 'unset'
```

### 大厂参考

**淘宝：**

```css
body, html {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
```

![image-20211213143032321](./assets/MGVFnjkwD56g2vS.png)

**京东：**

```css
html {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
body {
  -webkit-filter: grayscale(100%); 
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
   filter: grayscale(100%);
  filter: gray;
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
```

![image-20211213143101762](./assets/4XPf3tnRHN7rBsW.png)

**腾讯：**

```css
.garyBody{
  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  -webkit-filter: grayscale(1);
}
```

![image-20211213142944927](./assets/U2DY4O9rnmyIjZE.png)

**百度：**

> 缺席

**优酷：**

```css
html {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
}
body{
  filter:gray;
}
```

![image-20211213143610300](./assets/BfYGRLXi5FkWKjV.png)
