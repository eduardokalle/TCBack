const cors = require('cors');
const morgan = require('morgan');
const express = require('express');

const { port, morganMode } = require('./config');
const routes = require('./App/routes');

const serve = (app) => {
  app.set('port', port);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(morgan(morganMode));

  app.use('/', routes);
}

module.exports = {
  serve
}