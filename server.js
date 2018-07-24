'use strict';

const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const screen = process.stdout;
const standardHead = { 'Content-Type': 'text/html', 'Date': `${new Date()}`, 'Server': 'NotAProxy' };

let contentDataHash = {};

const httpServer = http.createServer((req, res) => {

  let method = req.method;
  let path = `${req.url === '/' ? `./public/index.html` : `./public${req.url}`}`;

  if (!contentDataHash[path]) {
    contentDataHash[path] = {};
  }

  switch (method) {
    case 'HEAD':
      retrieveMethod(method, path, res);
      break;
    case 'GET':
      retrieveMethod(method, path, res);
      break;
    case 'POST':
      break;
    default:
      break;
  }

}).listen(8080);


function retrieveMethod(method, filePath, res) {
  let fileExtension = filePath.split('.')[filePath.length - 1];

  fs.stat(filePath, function (err, stats) {
    if (err) {
      res.writeHead(404, standardHead);
      fs.readFile('./public/404.html', 'UTF8', function (err, data) {
        res.write(data);
        res.end();
        console.log('Sent 404\n');
      });
    } else {
      contentDataHash[filePath] = {
        'Content-Length': `${stats.size}`,
        'Last-Modified': `${stats.mtime}`,
        'Content-Type': `${(fileExtension === 'html') ? 'text/html' :
          fileExtension === 'css' ? 'text/css' : 'text/plain'}`
      };

      fs.readFile(filePath, 'UTF8', function (err, data) {
        res.writeHead(200, Object.assign({}, standardHead, contentDataHash[filePath]));
        res.write(data);
        res.end();
        console.log('Sent 200\n');
      });
    }
  });
}
