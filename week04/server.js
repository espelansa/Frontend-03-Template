const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
  let body = [];
  request
    .on('error', (err) => {
      console.error(err);
    })
    .on('data', (chunk) => {
      console.log(chunk.toString());
      body.push(chunk.toString());
    })
    .on('end', () => {
      body = body.join("");
      console.log("body:", body);
      response.writeHead(200, { 'Content-Type': 'text/html' });
      fs.readFile('./index.html', 'utf-8', function(err, data) {
        if (err) {
          throw err;
        }
        response.end(data);
      });
    })
}).listen(8088);

console.log('Server Started');