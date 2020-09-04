学习笔记

## 正常流的块级排布

### float

1. float影响行盒子尺寸
2. clear属性让float元素强制换行，clear是找一个干净的空间来执行浮动的含义

### margin collapse

因为任何一个元素它产生的盒模型里面它所谓的margin只是要求周围有这么多的空白，而不会说我一定要跟别的边距有这么大的空白。  
margin collapse只会发生在正常流的BFC里面