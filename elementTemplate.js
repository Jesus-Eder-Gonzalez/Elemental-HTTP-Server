'use strict';
const fs = require('fs');

const template = function(elName, elSymb, elNum, elDesc){
let path = `./public/${elName.toLowerCase()}.html`;
let htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${elName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${elName}</h1>
  <h2>${elSymb}</h2>
  <h3>Atomic number ${elNum}</h3>
  <p>${elDesc}</p>
  <p><a href="/">back</a></p>
</body>
</html>`;
console.log(htmlPage);
fs.writeFile(path, htmlPage, (err) => {
  if (err) {
    return false;
  }
});
return path;
}

template('Boring', 'B', 53, 'Not a real Element.');