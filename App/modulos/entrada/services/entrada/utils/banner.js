const { Banner } = require('../../../models/banner');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');
const Op = Sequelize.Op;

const path = require('path');
const appDir = path.dirname(require.main.filename);

const banners = async (req, res) => {

    const attributes = {
        attributes: ['id', 'titulo', 'link', 'imagen_url', 'palabras_clave'],
        include: [{
            model: Archivo,
            as: 'imagen',
            attributes: ['id', 'url']
        }],
        where: {
            estado: 1
        }
    }

    let banners;
    try {
        banners = await Banner.findAll(attributes);
    }
    catch (error) {
        return res.status(400).send('error');
    }

    let data = [];
    let resultBanners = JSON.parse(JSON.stringify(banners));
    let item = {};

    for(let b in resultBanners) {

        item = {};

        item.id = resultBanners[b]['id'];
        item.titulo = resultBanners[b]['titulo'];
        item.link = resultBanners[b]['link'];
        item.palabras_clave = resultBanners[b]['palabras_clave'];
        item.imagen_url = '';
        item.imagen_id = null;

        if(resultBanners[b]['imagen']) {
            item.imagen_url = serverURL+resultBanners[b]['imagen']['url'];
            item.imagen_id = resultBanners[b]['imagen']['id'];
        }

        data.push(item);
    }

    res.send(data);
    //res.send(banners);
}


module.exports = {
    banners: banners
}