
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const operators = ['+', '-', '*', '/'];

let stream = [];
let token = [];

const start = char => {
  if (numbers.indexOf(char) >=0) {
    token.push(char);
    return inNumber;   
  }
  if (operators.indexOf(char) >=0) {
    emmitToken(char, char);
    return start
  }
  if (typeof char === "string" && !char.trim()) {
    return start;
  }
  if (char === '\r' || char === '\n') {
    return start;
  }
}

const inNumber = char => {
  if(numbers.indexOf(char) >=0) {
    token.push(char);
    return inNumber;
  } else {
    emmitToken("Number", token.join(""));
    token = [];
    return start(char); // put back char
  }
}

function emmitToken(type, value) {
  stream.push({ type, value })
  console.log(value);
}

let input = "1024 + 2 * 256"
let state = start;

for(let c of input.split('')) {
  state = state(c);
}
state(Symbol('EOF'))

console.log(stream);


/* <AdditiveExpression> ::= 
*    <MultiplicativeExpression>
*   |<AdditiveExpression><+><MultiplicativeExpression>
*		|<AdditiveExpression><-><MultiplicativeExpression></MultiplicativeExpression>
*/

function AdditiveExpression(source){
	// source[0] can only be one of "MultiplicativeExpression" or "AdditiveExpression"
  if (source[0].type === "MultiplicativeExpression") {
		let node = {
			type:"AdditiveExpression",
			children:[source[0]]
		}
		source[0] = node;
		return node;
	} 

	if (source[0].type === "AdditiveExpression" && source[1].type === "+") {
		let node = {
			type:"AdditiveExpression",
			operator:"+",
			// source.shift() ===> source[0], source[1]
			children:[source.shift(), source.shift(), MultiplicativeExpression(source)]
		}
		source.unshift(node);
	}

	if (source[0].type === "AdditiveExpression" && source[1].type === "-") {
		let node = {
			type:"AdditiveExpression",
			operator:"-",
			children:[source.shift(), source.shift(), MultiplicativeExpression(source)]
		}
		source.unshift(node);
	}
}


function Expression(source){
	if(source[0].type === "AdditiveExpression" && source[1] && source[1].type === "EOF" ) {
			let node = {
					type:"Expression",
					children:[source.shift(), source.shift()]
			}
			source.unshift(node);
			return node;
	}
	AdditiveExpression(source);
	return Expression(source);
}
function AdditiveExpression(source){
	if(source[0].type === "MultiplicativeExpression") {
			let node = {
					type:"AdditiveExpression",
					children:[source[0]]
			}
			source[0] = node;
			return AdditiveExpression(source);
	} 
	if(source[0].type === "AdditiveExpression" && source[1] && source[1].type === "+") {
			let node = {
					type:"AdditiveExpression",
					operator:"+",
					children:[]
			}
			node.children.push(source.shift());
			node.children.push(source.shift());
			MultiplicativeExpression(source);
			node.children.push(source.shift());
			source.unshift(node);
			return AdditiveExpression(source);
	}
	if(source[0].type === "AdditiveExpression" && source[1] && source[1].type === "-") {
			let node = {
					type:"AdditiveExpression",
					operator:"-",
					children:[]
			}
			node.children.push(source.shift());
			node.children.push(source.shift());
			MultiplicativeExpression(source);
			node.children.push(source.shift());
			source.unshift(node);
			return AdditiveExpression(source);
	}
	if(source[0].type === "AdditiveExpression")
			return source[0];
	MultiplicativeExpression(source);
	return AdditiveExpression(source);
}
function MultiplicativeExpression(source){
	if(source[0].type === "Number") {
			let node = {
					type:"MultiplicativeExpression",
					children:[source[0]]
			}
			source[0] = node;
			return MultiplicativeExpression(source);
	} 
	if(source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === "*") {
			let node = {
					type:"MultiplicativeExpression",
					operator:"*",
					children:[]
			}
			node.children.push(source.shift());
			node.children.push(source.shift());
			node.children.push(source.shift());
			source.unshift(node);
			return MultiplicativeExpression(source);
	}
	if(source[0].type === "MultiplicativeExpression"&& source[1] && source[1].type === "/") {
			let node = {
					type:"MultiplicativeExpression",
					operator:"/",
					children:[]
			}
			node.children.push(source.shift());
			node.children.push(source.shift());
			node.children.push(source.shift());
			source.unshift(node);
			return MultiplicativeExpression(source);
	}
	if(source[0].type === "MultiplicativeExpression")
			return source[0];

	return MultiplicativeExpression(source);
};

// var source = [{
// 	type:"Number",
// 	value: "3"
// }, {
// 	type:"*",
// 	value: "*"
// }, {
// 	type:"Number",
// 	value: "300"
// }, {
// 	type:"+",
// 	value: "+"
// }, {
// 	type:"Number",
// 	value: "2"
// }, {
// 	type:"*",
// 	value: "*"
// }, {
// 	type:"Number",
// 	value: "256"
// }, {
// 	type:"EOF"
// }];
// var ast = Expression(source);

// console.log(ast);


