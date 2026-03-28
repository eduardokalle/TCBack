const { express } = require('../../../../config');
const { autorizar } = require('../../../seguridad/services/autenticacion/utils/autorizar');

const Router = express.Router;

const { listar, borrar } = require('./controller.js');

let router = new Router();

router.get('/listar/:desde/:cuantos', autorizar, listar);
router.delete('/borrar/:id', autorizar, borrar)

module.exports = router;