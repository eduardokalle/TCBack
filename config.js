const { path } = require('./App/config');

const rootPath = path.resolve(__dirname, '.');
const port = process.env.NODE_ENV == 'production' ? 49153 : 5000;
const morganMode = process.env.NODE_ENV == 'production' ? 'tiny' : 'dev';

module.exports = {
  rootPath,
  port,
  morganMode
}