
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  // computedStyle 是kv结构的对象
  for (let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      // 视频里是parseInt 我觉得应该是parseFloat
      element.style[prop] = parseFloat(element.style[prop]);
    }
  }

  return element.style;
}


function layout(element) {
  if (!element.computedStyle) {
    return;
  }
  let elementStyle = getStyle(element);
  if (elementStyle.display !== "flex") {
    return;
  }

  let items = element.children.filter(e => e.type === 'elememt');
  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  let style = elementStyle;
  // width和height空的都设为 null
  ["width", "height"].forEach(prop => {
    if (style[prop] === "auto" || style[prop] === "") {
      style[prop] = null;
    }
  })

  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.alignItems || style.alignItems === "auto") {
    style.alignItems = "stretch";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start";
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "stretch";
  }

  let mainSize, mainStart, mainEnd, mainSign, mainBase;
  let crossSize, crossStart, crossEnd, crossSign, crossBase;

  if (style.flexDirection === 'row') {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1; // 从右往左排就是属性相减，mainSign = -1
    mainBase = 0;

    crossSize = "height";
    crossStart = "top";
    crossEnd = 'bottom';
  }

  if (style.flexDirection === 'row-reverse') {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = -1; 
    mainBase = style.width;

    crossSize = "height";
    crossStart = "top";
    crossEnd = 'bottom';
  }

  if (style.flexDirection === 'column') {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexDirection === 'column-reverse') {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = -1;
    mainBase = style.height;

    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (style.flexWrap === 'wrap-reverse') {
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }

  // 如果为true则父元素主轴没有设置尺寸，由子元素自行撑开
  let isAutoMainSize = false;
}