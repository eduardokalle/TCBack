const { Banner } = require('../../../models/banner');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');

const Op = Sequelize.Op;

const detalle = async (req, res) => {

    const id = req.params.id;

    let banner;

        try {
            banner = await Banner.findOne({
                attributes: ['id', 'titulo', 'imagen_id', 'imagen_url', 'link', 'estado', 'palabras_clave'],
                include: [{
                    model: Archivo,
                    as: 'imagen',
                    attributes: ['id', 'url']
                }],
                where: [{
                    id: id
                }]
            });
        }
        catch (error) {
            console.log("Banner");
            console.log(error);
            return res.status(400).send('error');
        }

    if(banner) {
        let resultBanner = JSON.parse(JSON.stringify(banner));
        let data = [];

        item = {};
        item = JSON.parse(JSON.stringify(resultBanner));

        if(banner['imagen']) {
            item.imagen_url = serverURL+resultBanner['imagen']['url'];
            item.imagen_id = resultBanner['imagen']['id'];
        }
    }

    res.send({
        //banner: banner
        banner: item
    });
}

module.exports = {
    detalle: detalle
}