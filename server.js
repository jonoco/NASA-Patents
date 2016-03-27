'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _jade = require('jade');

var _jade2 = _interopRequireDefault(_jade);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _middleware = require('./middleware');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var PORT = process.env.PORT || 9000;
var API_KEY = process.env.API_KEY || 'DEMO_KEY';
var ROOT_URL = 'https://api.nasa.gov/patents/content';

app.use(_bodyParser2.default.json());
app.use(_express2.default.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
  res.render('index', {});
});

app.get('/search', _middleware.logger, function (req, res) {

  var query = req.query.keyword || null;

  if (query) {
    var limit = 500;
    var tags = false;
    var url = ROOT_URL + '?query=' + query + '&limit=' + limit + '&tags=' + tags + '&api_key=' + API_KEY;

    _axios2.default.get(url).then(function (response) {
      res.render('index', { data: response.data });
      console.log('Response status: ' + response.status);
    }).catch(function (response) {
      if (response instanceof Error) {
        console.log('Error: ', response.message);
        res.render('index', { error: response.message });
      } else {
        console.log('Errored Response status: ' + response.status);
        res.render('index', { error: response.status });
      }
    });
  } else {
    res.render('index', {});
  }
});

// Handle 404
app.use(function (req, res, next) {
  res.status(404).send('Sorry can\'t find that!');
});

// Handle errors
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT + '...');
});