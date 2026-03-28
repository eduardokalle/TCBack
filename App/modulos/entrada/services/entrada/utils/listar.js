const { Entrada } = require('../../../models/entrada');
const { EntradaTipo } = require('../../../models/entradaTipo');
const { EntradaCategoria } = require('../../../models/entradaCategoria');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

    const role_id = req.body.role_id;
    const user_id = req.body.user_id;

    const tipo = req.params.tipo;
    const desde = req.params.desde;
    const cuantos = req.params.cuantos;

    const whereTipo = {};
    if(tipo != 0) {
        whereTipo.entrada_tipo_id = tipo;
    }

    let total;
    let entrada;
    let entradaTotal;

    try {
        entrada = await Entrada.findAll({
            attributes: ['id', 'entrada_tipo_id', 'entrada_categoria_id', 'imagen_id', 'fecha', 
                            'titulo', 'resumen', 'texto', 'destacada', 'imagen_url', 'estado', 'palabras_clave'],
            where: whereTipo,
            include: [{
                    model: Archivo,
                    as: 'imagen',
                    attributes: ['id', 'url']
                },
                {
                    model: EntradaCategoria,
                    as: 'categoria',
                    attributes: ['id', 'nombre']
                },
                {
                    model: EntradaTipo,
                    as: 'tipo',
                    attributes: ['id', 'nombre']
                }],
            order: [['fecha', 'DESC']],
            offset: parseInt(desde), 
            limit: parseInt(cuantos)
        });
    }
    catch (error) {
        console.log("Banner");
        console.log(error);
        return res.status(400).send('error');
    }


    let resultEntradas = JSON.parse(JSON.stringify(entrada));
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



    try {
        entradaTotal = await Entrada.findAndCountAll({
            attributes: ['id'],
            where: whereTipo,
        });
    }
    catch (error) {
        console.log("Banner");
        console.log(error);
        return res.status(400).send('error');
    }
    total = entradaTotal.count;

    res.send({
        total: total, 
        entrada: data
    });
}

module.exports = {
    listar: listar
}