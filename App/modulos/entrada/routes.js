const { express } = require('../../config');
const Router = express.Router;

const entradaRouter = require('./services/entrada/router');
const bannerRouter = require('./services/banner/router');
let router = new Router();

router.use('/entrada', entradaRouter);
router.use('/banner', bannerRouter);

module.exports = router;