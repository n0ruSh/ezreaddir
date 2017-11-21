#!/usr/bin/env node

let ezreaddir = require('../index.js');

let path = process.argv[2];

ezreaddir(path, (err, result) => {
    console.log(result);
});