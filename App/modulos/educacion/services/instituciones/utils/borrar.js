const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log("Institucion borrar");

    console.log(req.params.id);

    let institucion;

    try {
        institucion = await Institucion.destroy({
            where: {
                id: req.params.id
            }
        })
    }
    catch (error) {
        console.log("Inst");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        institucion: institucion
    });
}

module.exports = {
    borrar: borrar
}