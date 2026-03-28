const { express } = require('../../../../config');
const Router = express.Router;

const { metodologias } = require('./controller');

let router = new Router();

router.get('/listar', metodologias);

module.exports = router;