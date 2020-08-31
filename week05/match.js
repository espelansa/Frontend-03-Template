/* 
* 1. type 
* 2. descendant <sp>
* 3. child >
* 4. adjacent "+"
* 5. attribute 包含class
* 6. id
*/

// 传入之前把所有空格都已排除在外，只留下div.top#btn[target]等形态
function splitSelector(selector) {
	let selectors = [];
	let str = "";
	for (let char of selector) {
		if (char === "." || char === "#" || char === "[") {
			if (str) {
				selectors.push(str);
				str = ""
			}
		}
		str += char;
	}
	selectors.push(str);
	return selectors;
}

// simple match
function simpleMatch(selector, element) {
	const selectors = splitSelector(selector);
	for (const item of selectors) {
		if (item[0] === ".") {
			if (!onClass(item, element)) {
				return false;
			}
		} else if (item[0] === "#") {
			if (!onId(item, element)) {
				return false;
			}
		} else if (item[0] === "[") {
			if (!onAttribute(item, element)) {
				return false;
			}
		} else {
			if (!onType(item, element)) {
				return false;
			}
		}
	}
	return true;
}

function onType(selector, element) {
	if (selector === element.tagName.toLowerCase()) {
		return true;
	}
	return false;
}

// 除了简写的class
function onAttribute(selector, element) {
	if (selector.match(/^\[([\S\s]+)\]$/)) {
		const array = element.attributes;
		for (let i = 0; i < array.length; i++) {
			if (array[i].name === RegExp.$1) {
				return true;
			}
		}
		return false;
	}
}

function onId(selector, element) {
	if (selector.slice(1) === element.getAttribute("id")) {
		return true
	}
	return false
}

function onClass(selector, element) {
	// console.log(element.getAttribute("class"))
	if (selector.slice(1) === element.getAttribute("class")) {
		return true
	}
	return false
}

// 以 > 逻辑为例
function onChild(selector, element) {
	let selectors = selector.split(">").reverse();
	let currentNode = element;
	for (let i = 0; i < selectors.length; i++) {
		// console.log('selectors[i]', selectors[i], currentNode, currentNode.parentNode)
		if (!simpleMatch(selectors[i], currentNode)) {
			return false;
		} else {
			currentNode = currentNode.parentNode;
			continue
		}
	}
	return true;
}

function onAdjacent(selector, element) {
	const selectors = selector.split("+").reverse();
	const nodes = element.parentNode.childNodes; // 类数组对象

	for (let i = nodes.length - 1; i >= 0; i--) {
		const node = nodes[i];
		if (!node.tagName) continue;
		if (simpleMatch(selectors[0], node)) {
			if (selectors.length === 0) {
				return true		
			}
			continue;
		}
	}
	return false;
}

// 重组复杂的selector, 删除多余的空格
function reArrange(complexSelector) {
	const array = complexSelector.split(" ").filter(value => !!value);
	let str = "";
	for (let i = 0; i < array.length; i++) {
		let item = array[i];
		if (item[0] === ">" || item[0] === "+") {
			str += item;
		} else if (item[item.length - 1] === ">" || item[item.length - 1] === "+") {
			str += item;
		} else {
			if (str[str.length - 1] === ">" || str[str.length - 1] === "+") {
				str += item
			} else {
				str = str + " " + item
			}
		}
	}
	return str;
}


// 针对的是 > + 混排
function compare(selector, element) {
	let cIndex = selector.lastIndexOf(">");
	let aIndex = selector.lastIndexOf("+");
	// console.log(cIndex, aIndex)
	if (cIndex > aIndex) {
		if (aIndex < 0) {
			return onChild(selector, element)
		} else {
			if (!onChild(selector.slice(aIndex + 1), element)) {
				return false;
			}
			return compare(selector.slice(0, cIndex), element)
		}
	} else if (aIndex > cIndex) {
		if (cIndex < 0) {
			return onAdjacent(selector, element)
		} else {
			if (!onAdjacent(selector.slice(cIndex + 1), element)) {
				return false;
			}
			return compare(selector.slice(0, aIndex), element)
		}
	} else {
		return simpleMatch(selector, element);
	}
}

function father(selector, element) {
	if (compare(selector, element)) {
		return element;
	} else {
		const parentNode = element.parentNode;
		if (!parentNode) {
			return false;
		}
		return father(parentNode, selector)
	}
}

// 从节点向树干上找更容易
// 当且仅当selector.trim()中有" "才访问此函数
function onDescendant(selector, element) {
	let selectors = selector.trim().split(" ").reverse();
	console.log(selectors)
	if (!compare(selectors[0], element)) {
		return false;
	}
	for (let i = 1; i < selectors.length; i++) {
		const selector = selectors[i];
		element = father(selector, element);
		if (!element) {
			return false;
		}
	}
	return true;
}

function match(selector, element) {
	return onDescendant(reArrange(selector), element)
}