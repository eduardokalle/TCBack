const { express } = require('../../../../config');
const Router = express.Router;

const { regiones } = require('./controller');

let router = new Router();

router.get('/listar', regiones);

module.exports = router;