const { express } = require('../../config');
const Router = express.Router;

const directorioRouter = require('./services/oferta/router');
const datoCuriosoRouter = require('./services/dato-curioso/router');



let router = new Router();

router.use('/directorio', directorioRouter);
router.use('/dato-curioso', datoCuriosoRouter);

module.exports = router;