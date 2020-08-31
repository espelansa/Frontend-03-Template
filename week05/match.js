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
	console.log(element.getAttribute("class"))
	if (selector.slice(1) === element.getAttribute("class")) {
		return true
	}
	return false
}

function father(selector, element) {
	if (simpleMatch(selector, element)) {
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
	if (!simpleMatch(selectors[0], element)) {
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

// 以 > 逻辑为例
function onChild(selector, element) {
	// if (selector.match(/^([\S\s]+)>([\S\s]+)$/)) {
	// 	// RegExp.$1.trim() RegExp.$2.trim() 
	// 	if (simpleMatch(RegExp.$2.trim(), element) && simpleMatch(RegExp.$1.trim(), element.parentNode)) {
	// 		return true;
	// 	}
	// 	return false;
	// }
	// let index = selector.lastIndexOf(">");
	// if (index < 0) {
	// 	return simpleMatch(selector, element);
	// }
	// if (!element) {
	// 	return false;
	// }
	// if (simpleMatch(selector.slice(index + 1), element)) {
	// 	return onChild(selector.slice(0, index), element.parentNode);
	// } else {
	// 	return false;
	// }
	let selectors = selector.split(">").reverse();
	let currentNode = element;
	for (let i = 0; i < selectors.length; i++) {
		if (!simpleMatch(selectors[i], currentNode)) {
			return false;
		} else {

		}
		
	}
}

function onAdjacent(selector, element) {
	if (selector.match(/^([\S\s]+)\+([\S\s]+)$/)) {
		const array = element.parentNode.childNodes; // 类数组对象
		for (let i = 0; i < array.length; i++) {
			if (!array[i].tagName) continue;
			if (simpleMatch(RegExp.$1.trim(), array[i])) {
				for (let j = i + 1; j < array.length; j++) {
					if (!array[j].tagName) continue;
					if (simpleMatch(RegExp.$2.trim(), array[j])) {
						return true;
					}
				}
				return false;
			}
		}
		return false;
	}
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
	return str.split(" ")
}


// 针对的是 > + 混排
function compare(selector, element) {
	let cIndex = selector.lastIndexOf(">");
	let aIndex = selector.lastIndexOf("+");
	if (cIndex > aIndex) {
		if (!onChild(selector.slice(aIndex + 1), element)) {
			return false;
		} else {
			return compare(selector.slice(0, aIndex), element)
		}
	} else if (aIndex > cIndex) {
		if (!onAdjacent(selector.slice(cIndex + 1), element)) {
			return false;
		} else {
			return compare(selector.slice(0, cIndex), element)
		}
	} else {
		return true;
	}
}

function match(selector, element) {
	const selectors = reArrange(selector);
	for (let i = 0; i < selectors.length; i++) {
		
		
	}
}



