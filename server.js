var path = require('path');
var express = require('express');
var app = express();

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.resolve(process.cwd(), 'dist')));

app.listen(process.env.PORT || 8080);

console.log('server started on port: ', process.env.PORT || 8080);