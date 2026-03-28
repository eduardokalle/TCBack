const { express } = require('../../../../config');
const Router = express.Router;

const { niveles_formacion } = require('./controller');

let router = new Router();

router.get('/listar', niveles_formacion);

module.exports = router;