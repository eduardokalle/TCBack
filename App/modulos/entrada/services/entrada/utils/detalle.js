const { Entrada } = require('../../../models/entrada');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');
const Op = Sequelize.Op;

const detalle = async (req, res) => {

	const id = req.id;

    const attributes = {
        attributes: ['id', 'entrada_tipo_id', 'fecha', 'titulo', 'resumen', 'texto', 'imagen_url', 'palabras_clave'],
        order: [['fecha', 'DESC']],
        include: [{
                    model: Archivo,
                    as: 'imagen',
                    attributes: ['id', 'url']
                }],
        where: {
            id: id
        }
    }

    let item = {};
    const entrada = await Entrada.findOne(attributes);
    if(entrada) {
        let resultEntrada = JSON.parse(JSON.stringify(entrada));
        let data = [];

        item = {};
        item = JSON.parse(JSON.stringify(resultEntrada));

        if(entrada['imagen']) {
            item.imagen_url = serverURL+resultEntrada['imagen']['url'];
            item.imagen_id = resultEntrada['imagen']['id'];
        }
    }

    res.send(item);
    //res.send(entrada);
}


module.exports = {
    detalle: detalle
}