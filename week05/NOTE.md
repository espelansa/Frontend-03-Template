# 学习笔记

## CSS

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
