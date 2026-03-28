const { express } = require('../../config');
const Router = express.Router;

const reporteRouter = require('./services/reporte/router');




let router = new Router();

router.use('/reporte', reporteRouter);

module.exports = router;