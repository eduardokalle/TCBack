const { express } = require("../../../../config");
const Router = express.Router;

const { areas } = require('./controller');

let router = new Router();

router.get('/listar', areas);

module.exports = router;