'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _babelRegister = require('babel-register');

var _babelRegister2 = _interopRequireDefault(_babelRegister);

var _modules = require('./modules');

var _bootstrapRouter = require('./helpers/bootstrap-router');

var _dbConnect = require('./helpers/db-connect');

var _normalizePort = require('./helpers/normalize-port');

var _cors = require('./helpers/cors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var morgan = require('morgan');
var methodOverride = require('method-override');
require('dotenv').config();

//Set up express as the router, grab port from .env file
var app = (0, _express2.default)();
var port = (0, _normalizePort.normalizePort)(process.env.PORT || '3003');

//Use Morgan for dev environment, Use bodyParser for reqs
app.use(morgan('dev'));

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json({ limit: '50mb' }));

//Use helper fns to bootstrap the modules, connect to db, and config CORS
app = (0, _dbConnect.dbConnect)(app);
app = (0, _cors.configCors)(app);
app = (0, _bootstrapRouter.BootstrapRouter)(app, new _modules.Modules());

//set server to listen on port
var server = require('http').Server(app);
server.listen(port, function () {
  console.log('The Server is running at', port);
});

module.exports = app;