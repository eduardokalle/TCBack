const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');

const Op = Sequelize.Op;

const listarTipo = async (req, res) => {

    let tipoIes;

    try {
    	//tipoIes = await Institucion.aggregate('sector', 'DISTINCT', { plain: false });

        tipoIes = await Institucion.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('sector')), 'sector']]
        })
    }
    catch (error) {
        console.log("Tipo Inst");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        tipoIes: tipoIes
    });
}

module.exports = {
    listarTipo: listarTipo
}