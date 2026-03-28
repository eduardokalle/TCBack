const { Programa } = require('../../../models/programa');
const { ProgramaPeriodo } = require('../../../models/programaPeriodo');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const borrar = async (req, res) => {

    console.log(req.params);

    console.log("Programa periodo borrar el: "+req.params.id);

    let programaPeriodo;
    try {
        programaPeriodo = await ProgramaPeriodo.destroy({
            where: {
                id: req.params.id
            }
        })
    }
    catch (error) {
        console.log("Prg. Perd.");
        console.log(error);
        return res.status(400).send('error');
    }

    res.send({
        programaPeriodo: programaPeriodo
    });
}

module.exports = {
    borrar: borrar
}