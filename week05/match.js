/* 
* 0. *
* 1. type 
* 2. descendant <sp>
* 3. child > first-child
* 4. adjacent "+"
* 5. attribute 包含class
* 6. id
*/

function match(selector, element) {
	return onType(selector, element);
}

function onType(selector, element) {
	if (selector === element.tagName.toLowerCase()) {
		return true;
	}
	return false;
}


// 从根部网上找更容易
// 当且仅当selector.trim()中有" "才访问此函数
function onDescendant(selector, element) {
	let currenctElement = element;
	let selectors = selector.trim().split(" ").reverse();
	for (let selector of selectors) {
		if (match(selector, currenctElement)) {
			// selectors.shift();
			if (!currenctElement.parentNode) {
				return false;
			}
			currenctElement = currenctElement.parentNode;
		}
	}
}

// console.log(onDescendant(sel, ele));	

function onChild(selector, element) {

}