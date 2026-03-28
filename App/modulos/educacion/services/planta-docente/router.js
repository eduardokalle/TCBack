const { express } = require('../../../../config');
const { autorizar } = require('../../../seguridad/services/autenticacion/utils/autorizar');

const Router = express.Router;

const { listar, crear, editar, borrar, detalle, cargar } = require('./controller.js');

let router = new Router();

router.get('/listar/:institucionId/:desde/:cuantos', autorizar, listar);
router.post('/crear', autorizar, crear);
router.put('/editar/:id', autorizar, editar);
router.delete('/borrar/:id', autorizar, borrar)
router.get('/detalle/:id', detalle)
router.post('/carga-masiva', autorizar, cargar);

module.exports = router;