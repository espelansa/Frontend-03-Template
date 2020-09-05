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


## CSS Animation

### 六大属性

- animation-name
- animation-duration
- animation-timing-function 动画的时间曲线  
在一个关键帧里定义多个属性时变化时会使用transition

- animation-delay 动画开始前的延迟
- animation-iteration-count 动画的播放次数
- animation-direction


## Transition

### 四大属性

- transition-property 要变换的属性
- transition-duration 变化的时长
- transition-timing-function 时间曲线  
所有的 timing-function 都与 [三次贝塞尔曲线](http://cubic-bezier.com) 相关
- transition-delay 延迟

