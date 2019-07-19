'use strict';

/*
 * nodejs-express-mongoose
 * Copyright(c) 2015 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const app = require('express')();
const server = require('http').Server(app);

const io = require('./config/socketio').init(server);
const ioAuthentication = require('./config/socketio').authentication;
const ioConnection = require('./config/socketio').connection;

const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 3000;

const connection = connect();

/**
 * Expose
 */

module.exports = {
  app,
  connection
};

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

connection
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen() {
  if (app.get('env') === 'test') return;
  server.listen(port);
  console.log('Express app started on port ' + port);

  // socket io auth configuration
  io.use(ioAuthentication).on('connection', ioConnection);
}

function connect() {
  var options = { keepAlive: 1, useNewUrlParser: true };
  mongoose.connect(config.db, options);
  return mongoose.connection;
}
