const EOF = Symbol("EOF");
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

// 配对良好的html片段最后整个的栈应该是空的，所以设置一个初始的根节点方便我们把整棵树拿出来
// 先入后出 => 栈顶是数组最后一个元素
let stack = [{ type: "document", children: [] }];

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