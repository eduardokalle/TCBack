const { express } = require('../../config');
const Router = express.Router;

const contactoRouter = require('./services/contacto/router');

let router = new Router();

router.use('/contacto', contactoRouter);

module.exports = router;