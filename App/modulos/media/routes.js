const { express } = require('../../config');
const fileUpload = require('express-fileupload');

const Router = express.Router;

const mediaRouter = require('./services/media/router');

let router = new Router();

router.use(fileUpload());

router.use('/archivo', mediaRouter);


module.exports = router;