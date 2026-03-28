const { Entrada } = require('../../../models/entrada');
const { EntradaCategoria } = require('../../../models/entradaCategoria');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');
const Op = Sequelize.Op;

const entradas = async ({
    tipo,
    desde,
    limite  
}, res) => {

    const attributes = {
        attributes: ['id', 'entrada_tipo_id', 'fecha', 'titulo', 'resumen', 'texto', 'imagen_url', 'palabras_clave'],
        order: [['fecha', 'DESC']],
        include: [{
                    model: EntradaCategoria,
                    as: 'categoria',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Archivo,
                    as: 'imagen',
                    attributes: ['id', 'url']
                }],
        where: {
            entrada_tipo_id: tipo
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
    entradas: entradas
}