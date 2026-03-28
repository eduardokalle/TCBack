const { express } = require('../../config');
const Router = express.Router;

const autenticacionRouter = require('./services/autenticacion/router');
const usuarioRouter = require('./services/usuario/router');

let router = new Router();

router.use('/autenticacion', autenticacionRouter);
router.use('/usuario', usuarioRouter);

module.exports = router;