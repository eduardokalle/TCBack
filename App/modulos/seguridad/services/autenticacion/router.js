const { express } = require('../../../../config');
const { autorizar } = require('./utils/autorizar');
const Router = express.Router;

const { registro }  = require('./controller');
const { login }  = require('./controller');
const { forgot } = require('./controller');
const { reset } = require('./controller');
const { verificar } = require('./controller');
const { activar } = require('./controller');
const { perfil } = require('./controller');
const { perfilEditar } = require('./controller');

let router = new Router();

router.post('/registro', registro);
router.get('/login/forgot/:email', forgot);
router.post('/login/reset', reset);
router.get('/login/verificar/:email/:token', verificar);
router.get('/login/:email/:contrasena', login);
router.post('/activar', activar);
router.get('/perfil', autorizar, perfil);
router.post('/perfil', autorizar, perfilEditar);

module.exports = router;