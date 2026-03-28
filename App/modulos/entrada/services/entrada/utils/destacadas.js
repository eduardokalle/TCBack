const { Entrada } = require('../../../models/entrada');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');
const Op = Sequelize.Op;
const Fn = Sequelize.fn;

const destacadas = async ({
    tipo,
    desde,
    limite
}, res) => {

    const attributes = {
        attributes: ['id', 'entrada_tipo_id', 'fecha', 'titulo', 'resumen', 'texto', 'imagen_url'],
        //order: [ Fn( 'RAND' ) ],
        include: [{
                    model: Archivo,
                    as: 'imagen',
                    attributes: ['id', 'url']
                }],
        where: {
            entrada_tipo_id: tipo,
            destacada: 1
        }
    }

    if(desde !== '' && limite !== '') {
        attributes.offset = desde;
        attributes.limit = limite;
    }

    const entradas = await Entrada.findAll(attributes);

    let resultEntradas = JSON.parse(JSON.stringify(entradas));
    let data = [];
    let item = {};

    for(let b in resultEntradas) {

        item = {};
        item = JSON.parse(JSON.stringify(resultEntradas[b]));

        if(resultEntradas[b]['imagen']) {
            item.imagen_url = serverURL+resultEntradas[b]['imagen']['url'];
            item.imagen_id = resultEntradas[b]['imagen']['id'];
        }
        data.push(item);
    }

    res.send({ data: data });
}


module.exports = {
    destacadas: destacadas
}