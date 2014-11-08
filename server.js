'use strict';

var express = require('express');
var bodyparser = require('body-parser');
var fs = require('fs');

var app = express();
var dir = __dirname + '/data/';
var ext = '.json';

app.use(bodyparser.json());
app.set('port', process.env.PORT || 3000);

app.post('/:filename', function(req, res) {
  var str = JSON.stringify(req.body);
  var path = dir + req.params.filename + ext;

  fs.mkdir(dir, '0777', function(err) {
    if (err && err.code !== 'EEXIST') { return res.status(500).end(); }

    fs.writeFile(path, str, function(err) {
      if (err) { return res.status(500).end(); }
      res.end();
    });
  });
});

app.get('/:filename', function(req, res) {
  var path = dir + req.params.filename + ext;

  fs.exists(path, function(exists) {
    if (!exists) { return res.status(204).end(); }

    fs.readFile(path, {encoding: 'utf8'}, function(err, data) {
      if (err) { return res.status(500).end(); }
      res.json(JSON.parse(data));
    });
  });
});

app.listen(app.get('port'));
