const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    console.log(chunk.toString());
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log("body:", body);
    response.writeHead(200, { 'Content-Type': 'text/html', "Transfer-Encoding": "chunked" });
    response.end(' Hello World\n');
  })
}).listen(8088);

console.log('Server Started');