const { express } = require('../../../../config');
const Router = express.Router;

const { reporte_cobertura }  = require('./controller');	
const { reporte_distribucion }  = require('./controller');
const { reporte_nuevos }  = require('./controller');
const { reporte_poblacion }  = require('./controller');
const { reporte_docentes }  = require('./controller');


let router = new Router();

router.use('/cobertura', reporte_cobertura);
router.use('/distribucion', reporte_distribucion);
router.use('/nuevos', reporte_nuevos);
router.use('/poblacion', reporte_poblacion);
router.use('/docentes', reporte_docentes);

module.exports = router;