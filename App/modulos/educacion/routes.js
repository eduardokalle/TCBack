const { express } = require("../../config");
const Router = express.Router;

const areasRouter = require('./services/areas/router');
const institucionesRouter = require('./services/instituciones/router');
const nivelesFormacionRouter = require('./services/niveles_formacion/router');
const metodologiasRouter = require('./services/metodologias/router');
const naturalezaRouter = require('./services/naturaleza/router');
const caracterRouter = require('./services/caracter/router');

const programaRouter = require('./services/programa/router');
const programaPeriodoRouter = require('./services/programa-periodo/router');
const programaSolicitudRouter = require('./services/programa-solicitud/router');
const programaFavoritoRouter = require('./services/programa-favorito/router');
const plantaDocenteRouter = require('./services/planta-docente/router');
const delegadoRouter = require('./services/delegado/router');
const nivelFormacionDocenteRouter = require('./services/nivel-formacion-docente/router');
const tiempoDedicacionRouter = require('./services/tiempo-dedicacion/router');

let router = new Router();

router.use('/areas', areasRouter);
router.use('/instituciones', institucionesRouter);
router.use('/niveles_formacion', nivelesFormacionRouter);
router.use('/metodologias', metodologiasRouter);
router.use('/naturaleza', naturalezaRouter);
router.use('/caracter', caracterRouter);


router.use('/programa', programaRouter);
router.use('/programa-periodo', programaPeriodoRouter);
router.use('/programa-solicitud', programaSolicitudRouter);
router.use('/programa-favorito', programaFavoritoRouter);
router.use('/institucion', institucionesRouter);
router.use('/planta-docente', plantaDocenteRouter);
router.use('/delegado', delegadoRouter);
router.use('/nivel-formacion-docente', nivelFormacionDocenteRouter);
router.use('/tiempo-dedicacion', tiempoDedicacionRouter);



module.exports = router;