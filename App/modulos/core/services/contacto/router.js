const { express } = require('../../../../config');
const Router = express.Router;

const { enviar } = require('./controller');

let router = new Router();

router.use('/enviar', enviar);

module.exports = router;