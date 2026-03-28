const { Entrada } = require('../../../models/entrada');
const { EntradaCategoria } = require('../../../models/entradaCategoria');
const { EntradaTipo } = require('../../../models/entradaTipo');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');
const Op = Sequelize.Op;

const entradaTiposListar = async ({
    tipo,
    desde,
    limite  
}, res) => {

    const attributes = {
        attributes: ['id', 'nombre'],
        order: [['nombre', 'ASC']],
        include: [{
                    model: EntradaCategoria,
                    as: 'categorias',
                    attributes: ['id', 'nombre']
                }]
    } 

    const entradaTipos = await EntradaTipo.findAll(attributes);

    res.send(entradaTipos);
}


module.exports = {
    entradaTiposListar: entradaTiposListar
}