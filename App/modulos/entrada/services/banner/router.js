const { express } = require('../../../../config');
const { autorizar } = require('../../../seguridad/services/autenticacion/utils/autorizar');

const Router = express.Router;

const { listar, crear, editar, borrar, detalle } = require('./controller.js');

let router = new Router();

router.get('/listar/:desde/:cuantos', autorizar, listar);
router.post('/crear', autorizar, crear);
router.put('/editar/:id', autorizar, editar);
router.delete('/borrar/:id', autorizar, borrar)
router.get('/detalle/:id', detalle)

module.exports = router;