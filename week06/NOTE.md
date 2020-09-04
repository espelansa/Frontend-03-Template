学习笔记

## 正常流的块级排布

### float

1. float影响行盒子尺寸
2. clear属性让float元素强制换行，clear是找一个干净的空间来执行浮动的含义

### margin collapse

因为任何一个元素它产生的盒模型里面它所谓的margin只是要求周围有这么多的空白，而不会说我一定要跟别的边距有这么大的空白。  
margin collapse只会发生在正常流的BFC里面

### Block Container
- block
- inline-block
- table-cell
- flex布局的item
- grid布局的cell
- table-caption

### Establish BFC
1. floats 浮动的元素里面
2. absolutely positioned elements里面
3. block container but not block boxes(即排除第一项)
4. block boxes with 'overflow' other than 'visible'

## Flex排版

- 收集盒进行
- 计算盒在主轴方向的排布
- 计算盒在交叉轴方向的排布