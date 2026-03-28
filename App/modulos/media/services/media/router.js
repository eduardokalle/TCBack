const { express } = require("../../../../config");
const { reconocer } = require('../../../seguridad/services/autenticacion/utils/reconocer');
const { autorizar } = require('../../../seguridad/services/autenticacion/utils/autorizar');

const Router = express.Router;

const { listar } = require('./controller');
const { upload } = require('./controller');
const { borrar } = require('./controller');

let router = new Router();

router.get('/listar/:page/:filter', autorizar, listar);
router.post('/upload', autorizar, upload);
router.delete('/borrar/:ids', autorizar, borrar);

module.exports = router;