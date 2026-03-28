const { express } = require('../../../../config');
const Router = express.Router;

const { naturaleza } = require('./controller');

let router = new Router();

router.get('/listar', naturaleza);

module.exports = router;