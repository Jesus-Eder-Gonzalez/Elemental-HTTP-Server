'use strict';

const fs = require('fs');

function createIndex(newPath) {
  let elements;
  fs.readFile('elements', 'UTF8', (err, data) => {
    elements = data.split(',');
    console.log(elements);
    elements.push(`${newPath}`);

    let newIndex = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>The Elements</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <h1>The Elements</h1>
      <h2>These are all the known elements.</h2>
      <h3>These are ${elements.length}</h3>
      <ol>`;
      elements.forEach(element => {
        let elementName = element.split('.')[0].slice(1);
        let elementPath = element;
        let currentElement = `\n        <li>
          <a href="${elementPath}">${elementName}</a>
        </li>`
        newIndex += currentElement;
      }); 
      newIndex += `\n    </ol>
      </body>
      </html>`;
      fs.writeFile('elements', elements, (err)=>console.log(err));
      fs.writeFile('./public/index.html',newIndex, (err) => console.log(err));
  });
}

module.exports = {
  createNewIndex: createIndex
}