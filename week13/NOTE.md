## 学习笔记

### 对象&组件

#### 对象
- 属性
- 方法
- 继承

#### 组件
- Properties
- Methods
- Inherit
- Attribute
- Config & State
- Event
- Lifecycle
- Children

#### Attribute vs Properties
- Attribute 强调描述生
- Properties 强调从属关系


### Lifecycle

- created -> mount -> mount -> unmount -> destroyed 挂/卸载
- created -> JS change/set -> render/update -> destroyed
- created -> User Input -> render/update -> destroyed
- unmount -> created
- render/update -> created


### 配置 JSX 环境
webpack 可以把不同 import required 打包到一个文件 babel 可以把新版本（ES6+）JS 编译成老版本（ES5）的 JS
- webpack
- webpack-cli
- babel-loader
- babel plugin

@babel/core babel7 编译库的核心包。

@babel/preset-env 是各种 babel-preset-2015 2016... 的集合，如果只需要编译转换 2016 的语法，只需配置 browserslist 即可。默认为 defaults === > 0.5%, last 2 versions, Firefox ESR, not dead.

@babel/plugin-transform-react-jsx JSX 语法解析。
```
yarn add webpack webpack-cli -D
yarn add @babel/core @babel/preset-env -D
```


### Carousel
transition + transform + setInterval

1. Carousel 元素横向排放

2. 让 Carousel 动起来的时候有过渡效果
- ease-in 通常用在退出动画
- ease-out 进入动画
- transition: ease .5s;

定时播放 Carousel
```
// 每隔几秒去改变元素在水平方向上的坐标
setInterval(() => {
	element.style.transform = `translateX(-100%)`;
}, 3000);
```

3. 解决播放到最后一张空白的问题
```
current = current % elements.length;
// 对 current 进行取余，这样 current 就永远不会超过 elements.length，到第 4 张后，取余得 0, 就回到第 1 张。
```

4. 解决播放到最后一放时，Carousel 从右往左移动的问题
```
let pos = current + offset
pos = (pos + children.length) % children.length 

children[pos].style.transition = 'none'
children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
```
