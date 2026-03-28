const { express } = require('../../../../config');
const Router = express.Router;

const { caracter } = require('./controller');

let router = new Router();

router.get('/listar', caracter);

module.exports = router;