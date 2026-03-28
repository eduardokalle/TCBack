const { express } = require('../../../../config');

const Router = express.Router;

const { listar } = require('./controller.js');

let router = new Router();

router.get('/listar', listar);


module.exports = router;