const { express } = require("../../../../config");
const { autorizar } = require('../../../seguridad/services/autenticacion/utils/autorizar');

const Router = express.Router;

const { listar, borrar, editar, detail, roles, editarRol } = require('./controller.js');

let router = new Router();

router.get('/listar/:desde/:cuantos', autorizar, listar);
router.put('/editar/:id', autorizar, editar);
router.put('/editar-rol/:id', autorizar, editarRol);
router.delete('/borrar/:id', autorizar, borrar);
router.get('/detalle/:id', autorizar, detail);
router.get('/roles', roles);


module.exports = router;