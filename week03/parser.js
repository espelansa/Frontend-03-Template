const css = require('css'); 
const EOF = Symbol("EOF");
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

// 配对良好的html片段最后整个的栈应该是空的，所以设置一个初始的根节点方便我们把整棵树拿出来
// 先入后出 => 栈顶是数组最后一个元素
let stack = [{ type: "document", children: [] }];


let rules = [];
function addCSSRules(text) {
  let ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

function splitSelector(selector) {
  let selectors = [];

  function split() {
    if (selector.match(/^[a-zA-Z]+([\.|#][a-zA-Z_-][\w-]+)+$/)) {
      selectors.push(RegExp.$1);
      selector = selector.replace(RegExp.$1, '');
      split(selector);
    } else {
      selectors.push(selector);
    }
  }
  
  split(selector);

  return selectors;
}

function decide(element, selector) {
  if (selector.charAt(0) === "#") {
    let attr = element.attributes.filter(attr => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    } 
  } else if (selector.charAt(0) === ".") {
    // 作业：要求实现支持空格的class选择器
    // 遍历 element 的 class
    let attrs = element.attributes.filter(attr => attr.name === "class")[0];
    let names = attrs && attrs.value && attrs.value.split(" ");

    if (names) {
      for (let attr of names) {
        if (attr === selector.replace(".", "")) {
          return true;
        }
      }
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}

function match(element, selector) {
  if (!selector || !element.attributes) {
    // element初始化时都被定义了一个key为attribute，值是一个[]
    // 所以可用element.attributes来判断是否是一个文本节点
    return false;
  }

  // 原先逻辑只有三种简单选择器：元素，class 和 id
  // 作业：要求实现复合选择器
  let selectors = splitSelector(selector);

  return selectors.every(selector => decide(element, selector));
}

function computeCSS(element) {
  // 在computeCSS函数中，必须知道元素的所有父元素才能判断元素与规则是否匹配
  // 从stack可以获得本元素所有的父元素
  // 首先获取的是当前元素，获得和计算父元素匹配的顺序是从内向外
  let elements = stack.slice().reverse();

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    // 补充选择器一：element, element [Done]
    for (let selector of rule.selectors) {

      // if (selector.match(/([\S\s]+)([>|+])([\s\S]+)/)) {
      //   selector = [RegExp.$1.trim(), RegExp.$2, RegExp.$3.trim()].join("");
      // }

      let selectorParts = selector.split(" ").reverse();

      if (!match(element, selectorParts[0])) {
        continue;
      }

      // 当且仅当当前元素相同进入后面的代码
      let matched = false;

      // 用j来表示当前的选择器的位置
      let j = 1;
      for (let i =0; i < elements.length; i++) {
        if (match(elements[i], selectorParts[j])) {
          j++;
        }
      }

      if (j >= selectorParts.length) {
        matched = true;
      }

      if (matched) {
        // console.log("Element", element, "matched rule", rule);
        let sp = specificity(rule.selectors[0])
        let computedStyle = element.computedStyle;

        for (let declaration of rule.declarations) {
          if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {};
          }
          if (!computedStyle[declaration.property].specificity) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
          } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
          }
        }

        element.computedStyle = computedStyle;
      }
    } 
  }
}

// 作业：增加复合选择器的解析部分
function specificity(selector) {
  let p = [0, 0, 0, 0];
  let selectorParts = selector.split(" "); 

  for (let selector of selectorParts) {
    let selectors = splitSelector(selector);

    for (let part of selectors) {
      if (part.charAt(0) === "#") {
        p[1] += 1;
      } else if (part.charAt(0) === ".") {
        p[2] += 1;
      } else {
        p[3] += 1;
      }
    }
  }

  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3];
}

function emit(token) {
  let top = stack[stack.length - 1];

  if (token.type === "startTag") {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName;

    for (let p in token) {
      if (p !== "type" && p !== "tagName" ) {
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }

    // 采用一个在startTag的时候去判断哪些标签匹配了css rules的一种方式
    computeCSS(element);

    // 把当前元素挂在其父元素上
    top.children.push(element);
    element.parent = top;

    // 自封闭标签存入就要立马从栈里取出，所以不需要push入栈
    if (!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null;

  } else if (token.type === "endTag") {
    if (top.tagName !== token.tagName) {
      throw new Error('Tag start end doesn\'t match!');
    } else {
      // 在engTag这里如果遇到的是style标签时，就把它的子元素文本节点拿出来，把它的内容作为我们的css的内容。
      // 执行添加CSS规则的操作
      if (top.tagName === 'style') {
        // top.children[0]就是那个css的文本节点
        addCSSRules(top.children[0].content);
      }
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === "text") {
    if (!currentTextNode) {
      currentTextNode = {
        type: "text",
        content: "",
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: "EOF"
    });
    return;
  } else {
    // 文本节点
    emit({
      type: "text",
      content: c
    })
    return data;
  }
}

function tagOpen(c) {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    // 要么是一个开始标签，要么是一个自封闭标签
    currentToken = {
      type: "startTag",
      tagName: ''
    }
    return tagName(c);
  } else {
    return;
  }
}

// 结束标签，处理 </ 后面
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: ""
    }
    return tagName(c);
  } else if (c === ">") {
    // throw err
  } else if (c === EOF) {
    // throw err
  } else {

  }
}

function tagName(c) {
  if (c.match(/^\s$/)) {
    // \s 同 [\t\n\f ]
    return attriOrSelfclosing;
  } else if (c === '/') {
    // <img/>
    return selfClosingStartTag;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c //.toLowerCase()
    return tagName;
  } else if (c === '>') {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

// 这里自己增加了一步，因为selfClosingStartTag 既可以写成 <img/> 也可以写成 <img />
function attriOrSelfclosing(c) {
  if (c === '/') {
    // <img />
    return selfClosingStartTag;
  } else {
    // <div class=...
    return beforeAttributeName(c);
  }
}

function beforeAttributeName(c) {
  if (c.match(/^\s$/)) {
    return beforeAttributeName;
  } else if (c === ">" || c === "/" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    // throw error
  } else {
    currentAttribute = {
      name: "",
      value: "",
    }
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/^\s$/) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {

  } else if (c === "\"" || c === "\'" || c === "<") {

  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c.match(/^\s$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: ""
    };
    return attributeName(c);
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^\s$/) || c === "/" || c === ">" || c === EOF) {
    return beforeAttributeValue;
  } else if (c === "\"") {
    return doubleQuotedAttributeValue;
  } else if (c === "\'") {
    return singleQuotedAttributeValue;
  } else if (c === ">") {

  } else {
    return unQuotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  // 双引号quoted只找双引号结束
  if (c === "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c ==="\u0000") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  // 单引号quoted只找单引号结束
  if (c === "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c ==="\u0000") {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c;
    return singleQuotedAttributeValue;
  }
}

function unQuotedAttributeValue(c) {
  if (c.match(/^\s$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
    
  } else {
    currentAttribute.value += c;
    return unQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^\s$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfClosingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === EOF) {

  } else {
    // class="a"id="b"
    // currentAttribute.value += c;
    return beforeAttributeName(c);
  }
}

function selfClosingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else {
    // throw err
  }
}


module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c)
  }
  console.log(stack[0]);
}