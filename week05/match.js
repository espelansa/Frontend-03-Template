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
	return selectors;
}

// simple match
function simpleMatch(selector, element) {
	

}

function onType(selector, element) {
	console.log('onType', selector, element.tagName)
	if (selector === element.tagName.toLowerCase()) {
		return true;
	}
	return false;
}

// 除了简写的class
function onAttribute(selector, element) {
	if (selector.match(/^([\S\s]+)\[([\S\s]+)\]$/)) {
		const array = element.attributes;
		for (let i = 0; i < array.length; i++) {
			if (array[i].name === RegExp.$2 && simpleMatch(RegExp.$1, element)) {
				return true;
			}
		}
		return false;
	}
}

function onId(selector, element) {
	// console.log(element.getAttribute("id"))
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
	if (selector.simpleMatch(/^([\S\s]+)>([\S\s]+)$/)) {
		// RegExp.$1.trim() RegExp.$2.trim() 
		if (simpleMatch(RegExp.$2.trim(), element) && simpleMatch(RegExp.$1.trim(), element.parentNode)) {
			return true;
		}
		return false;
	}
}

function onAdjacent(selector, element) {
	if (selector.simpleMatch(/^([\S\s]+)\+([\S\s]+)$/)) {
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



