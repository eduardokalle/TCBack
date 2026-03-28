const { ProgramaPeriodo } = require('../../../models/programaPeriodo');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const crear = async (req, res) => {

    let anno = req.body.anno;
    let programa = req.body.programa;
    let periodo = req.body.periodo;
    let valorMatricula = req.body.valorMatricula;
    let cupos = req.body.cupos;
    let postuladosHombres = req.body.postuladosHombres;
    let postuladosMujeres = req.body.postuladosMujeres;
    let admitidosHombres = req.body.admitidosHombres;
    let admitidosMujeres = req.body.admitidosMujeres;
    let matriculadosHombres = req.body.matriculadosHombres;
    let matriculadosMujeres = req.body.matriculadosMujeres;
    let estudiantesHombres = req.body.estudiantesHombres;
    let estudiantesMujeres = req.body.estudiantesMujeres;
    let graduadosHombres = req.body.graduadosHombres;
    let graduadosMujeres = req.body.graduadosMujeres;
    
    const schema = {
        programa: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        anno: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        periodo: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        valorMatricula: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        cupos: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        postuladosHombres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        postuladosMujeres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        admitidosHombres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        admitidosMujeres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        matriculadosHombres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        matriculadosMujeres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        estudiantesHombres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        estudiantesMujeres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        graduadosHombres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        graduadosMujeres: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    };

    const { error, value } = joi.validate({ programa,
                                            anno,
                                            periodo,
                                            valorMatricula,
                                            cupos,
                                            postuladosHombres,
                                            postuladosMujeres,
                                            admitidosHombres,
                                            admitidosMujeres,
                                            matriculadosHombres,
                                            matriculadosMujeres,
                                            estudiantesHombres,
                                            estudiantesMujeres,
                                            graduadosHombres,
                                            graduadosMujeres
                                        }, schema);

    console.log(req.body);

    if(error) {
        res.status(500).send('Error de validación');
    }
    else {
        let programaPeriodo;

        try {
          	programaPeriodo = await ProgramaPeriodo.create({
                programa_id: programa,
                anno: anno,
                periodo: periodo,
                valorMatricula: valorMatricula,
                cupos: cupos,
                postulados_hombres: postuladosHombres,
                postulados_mujeres: postuladosMujeres,
                admitidos_hombres: admitidosHombres,
                admitidos_mujeres: admitidosMujeres,
                matriculados_hombres: matriculadosHombres,
                matriculados_mujeres: matriculadosMujeres,
                estudiantes_hombres: estudiantesHombres,
                estudiantes_mujeres: estudiantesMujeres,
                graduados_hombres: graduadosHombres,
                graduados_mujeres: graduadosMujeres
            });
        }
        catch (error) {
            console.log("Prg Prd.");
            console.log(error);
            return res.status(400).send('error');
        }

        res.send({
            programaPeriodo: programaPeriodo
        });
    }
}

module.exports = {
    crear: crear
}
