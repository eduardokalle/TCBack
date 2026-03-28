const { Banner } = require('../../../models/banner');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log(req.params);

    console.log("Banner borrar el: "+req.params.id);

    let banner;
    try {
        banner = await Banner.destroy({
            where: {
                id: req.params.id
            }
        })
    }
    catch (error) {
        console.log("Banner.");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        banner: banner
    });
}

module.exports = {
    borrar: borrar
}