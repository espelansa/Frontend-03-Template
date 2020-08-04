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
    return start(c);
  }
}

function end(c) {
  return end;
}

function again(c) {
  if (c === "a") {
    return foundA2;
  } else {
    return start(c);
  }
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
    return again;
  } else {
    return start(c);
  }
}

function foundA2(c) {
  if (c === 'b') {
    return foundB2;
  } else {
    return start(c);
  }
}

function foundB2(c) {
  if (c === 'x') {
    return end;
  } else if (c === 'c') {
    return again;
  } 
  else {
    return start(c);
  }
}

console.log(match("abcabyabx"));