## 思考题
#### 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？
个人理解如下：    
因为 first-line 伪类的虚拟start tag是插在它被绑定的元素的start tag的右侧的。所以如果给 first-line 设置float之类的属性，会让其脱离原来的文档流，那么会重新赋予块元素（原来）的第二行虚拟tag，如此重复不仅无法实现想要的样式，且造成页面不停重排，消耗性能。
而 first-letter 伪类的虚拟tag只要把那个圈出来的字包括住即可，所以不受影响。
> Note that the length of the first line depends on a number of factors, including the width of the page, the font size, etc.    
first-line。
> Note that the :first-letter pseudo-element tags abut the content (i.e., the initial character), while the :first-line pseudo-element start tag is inserted right after the start tag of the element to which it is attached.

```html
<p><first-line><first-letter>S</first-letter>ome students...</first-line>
play games on the playground.</p>
```

## 学习笔记

### at-rules

#### @charset  
主要作用是声明CSS字符集

#### @import

#### @media

#### @page
主要是跟我们打印相关

#### @keyframes
定义动画

#### @fontface
web font 功能 => icon font

#### @supports
用来检查某些CSS功能存不存在，但他本身还有兼容性问题，目前还不推荐使用

#### @namespace

### rule

#### Selector

- selector group  
计算选择器的优先级  
eg: #id div.a#d {...}  
[0, 2, 1, 1]  
s = 0 * N^3 + 2 * N^2 + 1 * N^1 + 1 * N^0  
只要N足够大

从w3.org上找到的规则  
>A selector's specificity is calculated as follows:  
>1. count the number of ID selectors in the selector (= a)  
>2. count the number of class selectors, attributes selectors, and pseudo-classes in the selector (= b)  
>3. count the number of type selectors and pseudo-elements in the selector (= c)  
>4. ignore the universal selector  
>5. Selectors inside the negation pseudo-class are counted like any other, but the negation itself does not count as a pseudo-class.

- selector
  - \>
  - 空格
  - \+
  - ~

- simple selector
  - type (element type)
  - \*
  - \. (class selector)
  - \# (id selector)
	- [attr=value]
  - :
  - ::
  - :not()

#### Declaration

- key
  - variable
  - properties

- value
	- calc
	- number
	- length
	- ......
