const { Programa } = require('../../../models/programa');
const { ProgramaPeriodo } = require('../../../models/programaPeriodo');
const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const detalle = async (req, res) => {

    const id = req.params.id;

    let programaPeriodo;

        try {
            programaPeriodo = await ProgramaPeriodo.findOne({
                attributes: ['id', 'programa_id', 'anno', 'periodo', 'valor_matricula', 'cupos', 
                            'postulados_hombres', 'postulados_mujeres', 'admitidos_hombres', 'admitidos_mujeres', 
                            'graduados_hombres', 'graduados_mujeres', 'estudiantes_hombres', 'estudiantes_mujeres', 
                            'matriculados_hombres', 'matriculados_mujeres'],
                include: [{
                    model: Programa,
                    as: 'programa',
                    attributes: ['id', 'nombre', 'institucion_id'],
                    include: [
                    {
                        model: Institucion,
                        as: 'institucion',
                        attributes: ['id', 'nombre', 'sector', 'ciudad_id'],
                        include: [{
                            model: Ciudad,
                            as: 'ciudad',
                            attributes: ['id', 'nombre']
                        }],
                        required: true
                    }],
                }],
                where: [{
                    id: id
                }]
            });
        }
        catch (error) {
            console.log("PROG");
            console.log(error);
            return res.status(400).send('error');
        }

    res.send({
        programaPeriodo: programaPeriodo
    });
}

module.exports = {
    detalle: detalle
}