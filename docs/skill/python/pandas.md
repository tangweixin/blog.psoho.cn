# pandas-数据读写


## 数据读写

### 支持的数据格式

* 文本: `CSV`，`HTML`，`JSON`
* 二进制：`Excel`，`Pickle`，`HDF5`

### 读写Excel文件

```python
# 读取Excel文件
path = '/csv-o49916.xlsx'
df = pd.read_excel(path, sheet_name='Sheet1', header=[0])
df2 = df[(df['命中次数'] >= 9) & (df['城市'] == '淄博')]
print(df2)

# 写入Excel文件
df2.to_excel('tmp.xls', index=None)
```

### 读写csv文件

```python
# 读取csv文件
path = '/aa.csv'
df = pd.read_csv(path, sep=',', skiprows=0, skipfooter=0)
# print(df)
df2 = df[(df['times'] >= 10)][['times', 'url', 'phone', 'o_province']]
print(df2)

# 写入csv文件
df2.to_csv('tmp.csv', sep=';', header=False, index=False, encoding='utf-8')
```



## 数据操作

### 算数运算

两个Series运算

```python
print('Series操作>>>>')
s1 = pd.Series([8, 7, 3], index=list('abc'))
s2 = pd.Series([3, 5, 8], index=list('abc'))
s3 = pd.Series([4, 2, 7], index=list('bcd'))
print(s1)
print(s2)
print(s1 + s2)
s = s1 + s3
print(s.fillna(0))  # 填充NaN

# 使用运算方法
print(s1.add(s3))
print(s1.mul(s2))
```


DataFrame运算

```python
print('DataFrame操作>>>>')
df1 = pd.DataFrame({
  'apples': [3, 2, 0, 1],
  'oranges': [0, 1, 2, 3]
}, index=['June', 'Robert', 'Lily', 'David'])
print(df1)
df2 = pd.DataFrame({
  'apples': [2, 2, 1],
  'oranges': [1, 1, 3],
  'bananas': [1, 2, 1]
}, index=['June', 'Robert', 'Lily'])
print(df2)
print(df1 + df2)
print((df1 + df2).fillna(0.0))
```

### 描述性统计方法


### 函数应用

```python
def func1(x):
    return x * 100


def main():
    print('>>>>>>>')
    s1 = pd.Series([8, 7, 3], index=list('abc'))
    print(s1)
    print(s1.apply(func1))
    print(s1)
  
		print('<<<<<<<<')
    df1 = pd.DataFrame({
        'apples': [1, 2, 3, 4],
        'oranges': [5, 6, 7, 8]
    })
    print(df1)
    print(df1.apply(func1))  # 作用在每一列上面
    print(df1.apply(func1, axis=1))  # 作用在每一行上面
    print(df1)
    print(df1.apply(lambda x: x * 10))  # lambda表达式
    print(df1.apply(lambda s: s.max() - s.min()))  # DF传递的是一个列
    print(df1.apply(lambda s: s.max() - s.min(), axis=1))  # DF传递的是一个列
    
    print(df1.applymap(lambda x: x * 9))    # 仅适用于DataFrame的每一个元素
    print(s1.map(lambda x: x * 9))    # 仅适用于Series的每一个元素
```

### 排序

```python
print('>>>: 排序')
print(s1.sort_index())  # 根据索引排序
print(s1.sort_index(ascending=False))

print(s1.sort_values(ascending=True))  # 根据值进行排序
print(s1.sort_values(ascending=False))

print(df1.sort_index())
print(df1.sort_index(ascending=False))
print(df1.sort_index(ascending=False, axis=1))

print(df1.sort_values(['oranges'], ascending=False))  # 指定排序列
```

### 绘制图表


```python
# 数据来源：https://q.stock.sohu.com/cn/600519/lshq.shtml

print('数据可视化: Matplotlib')
df1 = pd.read_csv('maotai.txt', sep=' ')
df1 = df1.sort_values(['日期'], ascending=True)
plt.rc('font', family='Alibaba PuHuiTi', size=14)  # 解决中文显示问题
t = df1.plot(x='日期', y='成交量(手)')
# t = df1.plot(x='日期', y='成交量(手)', figsize=(16, 6)) # 设置行和列的宽度
plt.show()  # 显示
print(type(t))
# <class 'matplotlib.axes._subplots.AxesSubplot'>
```