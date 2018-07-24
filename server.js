'use strict';

const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const template = require('./elementTemplate.js');
const catalog = require('./indexTemplate');

const screen = process.stdout;
const standardHead = { 'Content-Type': 'text/html', 'Date': `${new Date()}`, 'Server': 'NotAProxy' };

let contentDataHash = {};

const httpServer = http.createServer((req, res) => {

  let method = req.method;
  let path = `${req.url === '/' ? `./public/index.html` : `./public${req.url}`}`;
  console.log(method + " " + path);
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
      postMethod(path, req, res);
      break;
    case 'PUT':
    let relativePath = path.slice(8);
      if ((relativePath === '/') ||
        (relativePath === '/index.html') ||
        (relativePath === '/elements') ||
        path.includes('css')) {
        res.writeHead(400);
        return res.end();
      }
      putMethod(path, req, res);
      break;
    default:
      res.writeHead(400);
      res.end('Not a method recognized by this server');
      break;
  }

}).listen(8080);

function putMethod(path, req, res) {

  template.createHTML(req.headers.elementname,
    req.headers.elementsymbol,
    req.headers.elementatomicnumber,
    req.headers.elementdescription, (newPath) => {
      newPath ? res.writeHead(200, `{"Content-Type" : "application/json"}`) :
        res.writeHead(500, `{"Content-Type" : "application/json"}`);
      newPath ? res.end(`"success" : ${newPath ? 'true' : 'false'}`) :
        res.end(`"error" : ${path.slice(8)} does not exist`);
      console.log(`Sent ${newPath ? `200` : `400`}\n`);
    });

}

function postMethod(path, req, res) {
  if (path === './public/elements') {
    template.createHTML(req.headers.elementname,
      req.headers.elementsymbol,
      req.headers.elementatomicnumber,
      req.headers.elementdescription, (newPath) => {
        catalog.createNewIndex(newPath, (success) => {
          success ? res.writeHead(200, `{"Content-Type" : "application/json"}`) :
            res.writeHead(400, `{"Content-Type" : "application/json"}`);
          res.end(`"success" : ${success}`);
          console.log(`Sent ${success ? `200` : `400`}\n`);
        });
      });
  } else {
    error404(res);
    console.log('Sent 404\n');
  }
}

function retrieveMethod(method, filePath, res) {
  let fileExtension = filePath.split('.');
  fileExtension = fileExtension[fileExtension.length - 1];

  fs.stat(filePath, function (err, stats) {

    if (err) {
      error404(res);
    } else {
      contentDataHash[filePath] = {
        'Content-Length': `${stats.size}`,
        'Last-Modified': `${stats.mtime}`,
        'Content-Type': `${(fileExtension === 'html') ? 'text/html' :
          fileExtension === 'css' ? 'text/css' : 'text/plain'}`
      };

      if (method === 'HEAD') {
        res.writeHead(200, Object.assign({}, standardHead, contentDataHash[filePath]));
        res.end();
        console.log('Sent 200\n');
      } else {
        fs.readFile(filePath, 'UTF8', function (err, data) {
          res.writeHead(200, Object.assign({}, standardHead, contentDataHash[filePath]));
          res.write(data);
          res.end();
          console.log('Sent 200\n');
        });
      }
    }
  });
}

function error404(res) {
  res.writeHead(404, standardHead);
  fs.readFile('./public/404.html', 'UTF8', function (err, data) {
    res.write(data);
    res.end();
    console.log('Sent 404\n');
  });
}
