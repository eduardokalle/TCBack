const { express } = require("../../../../config");
const { autorizar } = require('../../../seguridad/services/autenticacion/utils/autorizar');

const Router = express.Router;

const { entradas } = require('./controller');
const { destacadas } = require('./controller');
const { detalle } = require('./controller');
const { banners } = require('./controller');

const { listar, crear, editar, borrar, detail } = require('./controller.js');

const { listarTipos } = require('./controller');

let router = new Router();

router.post('/listar', entradas);
router.post('/destacadas', destacadas);
router.get('/banner', banners);

router.get('/listar/:tipo/:desde/:cuantos', listar);
router.post('/crear', autorizar, crear);
router.put('/editar/:id', autorizar, editar);
router.delete('/borrar/:id', autorizar, borrar)
router.get('/detalle/:id', detail)

router.get('/tipos', listarTipos)

router.get('/:id', detalle);

module.exports = router;