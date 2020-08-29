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
	console.log('match', selector)
	console.log('match', element)
	if (selector === element.type) {
		return true;
	}
	return false;
}

function onType(selector, element) {
	if (selector === element.tagName.toLowerCase()) {
		return true;
	}
	return false;
}

let sel = "a b"
let ele = {
	type: 'a',
	children: [
		{ type: 'e' },
		{ type: 'd' },
		{ type: 'b' }
	]
}

function onDescendant(selector, element) {
	console.log('onDesc', selector, element);
	let currentElement = element;
	let children = currentElement.children;
	if (selector.trim().indexOf(" ") > 0) {
		let selectors = selector.trim().split(" ");
		for (let selector of selectors) {
			if (match(selector, currentElement)) {
				selectors.shift();
				if (children) {
					for (let child of children) {
						currentElement = child;
						onDescendant(selectors.join(" "), currentElement);
					}
				} else {
					// element没有下一层时
					if (selectors.length === 0) {
						return true
					}
					return false;
				}	
			}
			return false;
		}
	} else {
		// selector没有下一层时
		if (match(selector, element)) {
			return true;
		}
	}
	return false;
}

console.log(onDescendant(sel, ele));

function onChild(selector, element) {

}