'use strict';
const fs = require('fs');

const template = function (elName, elSymb, elNum, elDesc, cb) {

  let success = false;

  if (!elName || !elSymb || !elNum || !elDesc) {
    return cb(success);
  }

  let path = `/${elName.toLowerCase()}.html`;
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

  fs.writeFile(`./public${path}`, htmlPage, (err) => {
    if (err) {
      return cb(success);
    } else {
      return cb(path);
    }
  });

}

module.exports = {
  createHTML: template
}

// template('Boring', 'B', 53, 'Not a real Element.');