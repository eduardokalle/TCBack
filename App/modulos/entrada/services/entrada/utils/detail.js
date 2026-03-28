const { Entrada } = require('../../../models/entrada');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');

const Op = Sequelize.Op;

const detail = async (req, res) => {

    const id = req.params.id;

    let entrada;

        try {
            entrada = await Entrada.findOne({
                attributes: ['id', 'entrada_tipo_id', 'entrada_categoria_id', 'imagen_id', 'fecha', 
                                'titulo', 'resumen', 'texto', 'destacada', 'imagen_url', 'estado', 'palabras_clave'],
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

    let item = {};

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


    res.send({
        //entrada: entrada
        entrada: item
    });
}

module.exports = {
    detail: detail
}