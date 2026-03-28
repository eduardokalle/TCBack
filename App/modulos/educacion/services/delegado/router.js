const { express } = require('../../../../config');
const { autorizar } = require('../../../seguridad/services/autenticacion/utils/autorizar');

const Router = express.Router;

const { crear, borrar } = require('./controller.js');

let router = new Router();

router.post('/crear', autorizar, crear);
router.delete('/borrar/:id', autorizar, borrar)

module.exports = router;