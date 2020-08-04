function match(string) {
  let state = start;
  for (let c of string) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === "a") {
    return foundA;
  } else {
    // 要把c带上，不然就直接访问下一个字母，这个字母被吞掉了（而它完全可以作为新的一个abcd的开始的a)
    return start(c);
  }
}

// trap 无论输入什么状态都在end里出不去的
function end(c) {
  return end;
}

function foundA(c) {
  if (c === 'b') {
    return foundB;
  } else {
    return start(c);
  }
}

function foundB(c) {
  if (c === 'c') {
    return foundC;
  } else {
    return start(c);
  }
}

function foundC(c) {
  if (c === 'd') {
    return end;
  } else {
    return start(c);
  }
}

console.log(match("I am abce abcd aba"));

