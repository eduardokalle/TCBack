const { express } = require('../../../../config');
const { autorizar } = require('../../../seguridad/services/autenticacion/utils/autorizar');

const Router = express.Router;

const { departamentos, cargar } = require('./controller');

let router = new Router();

router.get('/listar', departamentos);
router.post('/carga-masiva', autorizar, cargar);

module.exports = router;