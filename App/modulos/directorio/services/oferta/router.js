const { express } = require('../../../../config');
const { reconocer } = require('../../../seguridad/services/autenticacion/utils/reconocer');
const Router = express.Router;

const { oferta } = require('./controller');
const { filtros } = require('./controller');
const { favorito } = require('./controller');
const { solicitud } = require('./controller');
const { programa } = require('./controller');

let router = new Router();

router.use('/oferta', reconocer, oferta);
router.use('/filtros', filtros);
router.use('/favorito', reconocer, favorito);
router.use('/solicitud', reconocer, solicitud);
router.use('/programa', reconocer, programa)

module.exports = router;