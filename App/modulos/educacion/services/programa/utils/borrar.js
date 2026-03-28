const { Programa } = require('../../../models/programa');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log("Programa borrar");

    console.log(req.params);

    let programa;

    try {
        programa = await Programa.destroy({
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
        programa: programa
    });
}

module.exports = {
    borrar: borrar
}