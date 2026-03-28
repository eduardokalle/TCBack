const { Programa } = require('../../../models/programa');
const { ProgramaPeriodo } = require('../../../models/programaPeriodo');
const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const listar = async (req, res) => {

    const role_id = req.body.role_id;
    const user_id = req.body.user_id;

    const desde = req.params.desde;
    const cuantos = req.params.cuantos;
    const programa_id = req.params.programaId;

    let total;
    let programaPeriodo;
    let programasPeriodoTotal;

    try {
        programaPeriodo = await ProgramaPeriodo.findAll({
            attributes: ['id', 'programa_id', 'anno', 'periodo', 'valor_matricula', 'cupos', 
                            'postulados_hombres', 'postulados_mujeres', 'admitidos_hombres', 'admitidos_mujeres', 
                            'graduados_hombres', 'graduados_mujeres', 'estudiantes_hombres', 'estudiantes_mujeres', 
                            'matriculados_hombres', 'matriculados_mujeres'],
            where: {
                programa_id: programa_id
            },
            order: [['anno', 'DESC'], ['periodo', 'DESC']],
            offset: parseInt(desde), 
            limit: parseInt(cuantos)
        });
    }
    catch (error) {
        console.log("PERD");
        console.log(error);
        return res.status(400).send('error');
    }

    try {
        programasPeriodoTotal = await ProgramaPeriodo.findAndCountAll({
            attributes: ['id'],
            where: {
                programa_id: programa_id
            }
        });
    }
    catch (error) {
        console.log("PERD");
        console.log(error);
        return res.status(400).send('error');
    }
    total = programasPeriodoTotal.count;



    res.send({
        total: total, 
        programaPeriodo: programaPeriodo
    });
}

module.exports = {
    listar: listar
}