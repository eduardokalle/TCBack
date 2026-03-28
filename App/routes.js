const { express } = require("./config");
const Router = express.Router;

const directorioRouter = require("./modulos/directorio/routes");
const educacionRouter = require('./modulos/educacion/routes')
const poblacionRouter = require('./modulos/poblacion/routes');
const reporteRouter = require('./modulos/reporte/routes');
const seguridadRouter = require('./modulos/seguridad/routes');
const entradaRouter = require('./modulos/entrada/routes');
const coreRouter = require('./modulos/core/routes');
const mediaRouter = require('./modulos/media/routes');

let router = new Router();


router.use(express.static('uploads'));

router.use("/directorio", directorioRouter);
router.use("/educacion", educacionRouter);
router.use("/poblacion", poblacionRouter);
router.use("/reporte", reporteRouter);
router.use("/seguridad", seguridadRouter);
router.use("/entrada", entradaRouter);
router.use("/core", coreRouter);
router.use("/media", mediaRouter);



module.exports = router;