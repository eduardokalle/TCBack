const { Programa } = require('../../../models/programa');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const editar = async (req, res) => {

    let institucion = req.body.institucion;
    let metodologia = req.body.metodologia;
    let nivelFormacion = req.body.nivelFormacion;
    let nucleoConocimiento = req.body.nucleoConocimiento;
    let codigoSnies = req.body.codigoSnies;
    let nombre = req.body.nombre;
    let nivelAcademico = req.body.nivelAcademico;
    let duracionPrograma = req.body.duracionPrograma;
    let ciclosPropedeuticos = req.body.ciclosPropedeuticos;
    let titulo = req.body.titulo;
    let codigoIcfes = req.body.codigoIcfes;
    let creditos = req.body.creditos;
    let urlPensum = req.body.urlPensum;
    let urlWeb = req.body.urlWeb;
    let acreditacion = req.body.acreditacion;
    let duracionPeriodo = req.body.duracionPeriodo;
    let estado = req.body.estado;
    let valorMatricula = req.body.valorMatricula;
    
    const schema = {
        institucion: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        metodologia: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).allow(null),
        nivelFormacion: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        nucleoConocimiento: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        codigoSnies: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        nombre: joi.string().required(),
        //nivelAcademico: joi.alternatives().try(joi.string().valid('Pregrado', 'Posgrado').insensitive(), joi.string().valid('')).required(),
        //estado: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
        duracionPrograma: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).allow('').allow(null),
        ciclosPropedeuticos: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).allow('').allow(null),
        titulo: joi.string().required(),
        codigoIcfes: joi.string().allow('').allow(null),
        creditos: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).allow('').allow(null),
        urlPensum: joi.string().allow('').allow(null),
        urlWeb: joi.string().allow('').allow(null),
        acreditacion: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).allow('').allow(null),
        duracionPeriodo: joi.allow('').allow(null)
    };

    const { error, value } = joi.validate({ institucion,
                                            //metodologia,
                                            nivelFormacion,
                                            nucleoConocimiento,
                                            codigoSnies,
                                            nombre,
                                            //nivelAcademico,
                                            //estado,
                                            duracionPrograma,
                                            ciclosPropedeuticos,
                                            titulo,
                                            codigoIcfes,
                                            creditos,
                                            urlPensum,
                                            urlWeb,
                                            acreditacion,
                                            duracionPeriodo,
                                        }, schema);

    if(error) {
        res.status(500).send('Error de validación');
        console.log(error);
    }
    else {
        let programa;

        if(metodologia == '') metodologia = null;

        try {
            programa = await Programa.update({
                institucion_id: institucion,
                metodologia_id: metodologia,
                nivel_formacion_id: nivelFormacion,
                nucleo_conocimiento_id: nucleoConocimiento,
                codigo_snies: codigoSnies,
                nombre: nombre,
                nivel_academico: nivelAcademico,
                estado: estado,
                duracion_programa: duracionPrograma,
                ciclos_propedeuticos: ciclosPropedeuticos,
                titulo: titulo,
                codigo_icfes: codigoIcfes,
                creditos: creditos,
                url_pensum: urlPensum,
                url_web: urlWeb,
                acreditacion: acreditacion,
                duracion_periodo: duracionPeriodo,
                valor_matricula: valorMatricula
            },
            { where: { id: req.params.id } });
        }
        catch (error) {
            console.log(" Prgr");
            console.log(error);
            return res.status(400).send('error');
        }

        res.send({
            programa: programa
        });
    }
}

module.exports = {
    editar: editar
}