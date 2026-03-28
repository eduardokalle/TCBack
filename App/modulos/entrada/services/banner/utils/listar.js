const { Banner } = require('../../../models/banner');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

    const role_id = req.body.role_id;
    const user_id = req.body.user_id;

    const desde = req.params.desde;
    const cuantos = req.params.cuantos;

    let total;
    let banner;
    let bannerTotal;

    try {
        banner = await Banner.findAll({
            attributes: ['id', 'titulo', 'imagen_id', 'imagen_url', 'link', 'estado', 'palabras_clave'],
            include: [{
                    model: Archivo,
                    as: 'imagen',
                    attributes: ['id', 'url']
                }],
            order: [['titulo', 'ASC']],
            offset: parseInt(desde), 
            limit: parseInt(cuantos)
        });
    }
    catch (error) {
        console.log("Banner");
        console.log(error);
        return res.status(400).send('error');
    }

    let resultBanners = JSON.parse(JSON.stringify(banner));
    let data = [];
    let item = {};

    for(let b in resultBanners) {

        item = {};
        item = JSON.parse(JSON.stringify(resultBanners[b]));

        if(resultBanners[b]['imagen']) {
            item.imagen_url = serverURL+resultBanners[b]['imagen']['url'];
            item.imagen_id = resultBanners[b]['imagen']['id'];
        }
        data.push(item);
    }



    try {
        bannerTotal = await Banner.findAndCountAll({
            attributes: ['id']
        });
    }
    catch (error) {
        console.log("Banner");
        console.log(error);
        return res.status(400).send('error');
    }
    total = bannerTotal.count;

    res.send({
        total: total, 
        banner: data
    });
}

module.exports = {
    listar: listar
}