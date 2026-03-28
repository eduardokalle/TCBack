const { express } = require('../../config');
const Router = express.Router;

const regionesRouter = require('./services/regiones/router');
const departamentosRouter = require('./services/departamentos/router');

let router = new Router();

router.use('/regiones', regionesRouter);
router.use('/departamentos', departamentosRouter);

module.exports = router;