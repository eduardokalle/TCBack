const { Programa } = require('../../../models/programa');
const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Usuario } = require('../../../../seguridad/models/usuario');
const { Sequelize } = require('../../../../../config');

const Op = Sequelize.Op;

const detalle = async (req, res) => {

    const id = req.params.id;

    let programa;

        try {
            programa = await Programa.findOne({
                attributes: ['id', 'institucion_id', 'metodologia_id', 'nivel_formacion_id', 'nucleo_conocimiento_id', 
                            'codigo_snies', 'nombre', 'nivel_academico', 'estado', 'duracion_programa', 'ciclos_propedeuticos', 
                            'titulo', 'codigo_icfes', 'creditos', 'url_pensum', 'url_web', 'acreditacion', 'duracion_periodo', 'valor_matricula'],
                include: [
                {
                    model: Institucion,
                    as: 'institucion',
                    attributes: ['id', 'nombre'],
                    include: [{
                        model: Ciudad,
                        as: 'ciudad',
                        attributes: ['id', 'nombre']
                    }],
                    required: true
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
        programa: programa
    });
}

module.exports = {
    detalle: detalle
}