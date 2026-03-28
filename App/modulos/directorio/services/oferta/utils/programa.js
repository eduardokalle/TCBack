const { DatoCurioso } = require('../../../../poblacion/models/datoCurioso');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { NivelFormacion } = require('../../../../educacion/models/nivelFormacion');
const { Metodologia } = require('../../../../educacion/models/metodologia');
const { Programa } = require('../../../../educacion/models/programa');
const { Institucion } = require('../../../../educacion/models/institucion');
const { AreaConocimiento } = require('../../../../educacion/models/areaConocimiento');
const { NucleoConocimiento } = require('../../../../educacion/models/nucleoConocimiento');
const { ProgramaPeriodo } = require('../../../../educacion/models/programaPeriodo');
const { FavoritoUsuario } = require('../../../../seguridad/models/favoritoUsuario');
const { Archivo } = require('../../../../media/models/archivo');
const { Sequelize, serverURL } = require('../../../../../config');
const { joi } = require('../../../../../config');
const Op = Sequelize.Op;

const programa = async ({
    id,
    user_id
}, res) => {

	const schema = {
		id: joi.number().integer().required()
	};

	const { error, value } = joi.validate({ id }, schema);

	if(!error) {

		const data = {};

		let programa;
		try {
			programa = await Programa.findOne({
				attributes: ['id', 'codigo_snies', 'nombre', 'nivel_academico', 'estado', 'duracion_programa', 'ciclos_propedeuticos', 'titulo',
							'codigo_icfes', 'creditos', 'url_pensum', 'url_web', 'acreditacion', 'duracion_periodo', 
							'nivel_formacion_id', 'metodologia_id', 'institucion_id', 'nucleo_conocimiento_id', 'valor_matricula'],
				where: [{ id: id }],
				include: [
				{
					model: Institucion,
					as: 'institucion',
					attributes: ['id', 'codigo_snies', 'nombre', 'sector', 'acreditacion', 'es_principal', 'fecha_registro',
								'telefono_contacto', 'direccion_domicilio', 'programas_vigentes', 
								'fecha_acreditacion', 'resolucion_acreditacion', 'vigencia_acreditacion', 
								'ruta_logo', 'url_web', 'imagen_id', 'ciudad_id'],
					include: [{
						model: Ciudad,
						as: 'ciudad',
						attributes: ['id', 'nombre', 'departamento_id'],
						include: [{
							model: Departamento,
							as: 'departamento',
							attributes: ['id']
						}]
					},
	                {
	                    model: Archivo,
	                    as: 'imagen',
	                    attributes: ['id', 'url']
	                }]
				},
				{
					model: NivelFormacion,
					as: 'nivel_formacion',
					attributes: ['id', 'nombre']
				},
				{
					model: Metodologia,
					as: 'metodologia',
					attributes: ['id', 'nombre']
				},
				{
					model: NucleoConocimiento,
					as: 'nucleo_conocimiento',
					attributes: ['id', 'nombre', 'area_conocimiento_id'],
					include: [{
						model: AreaConocimiento,
						as: 'area',
						attributes: ['id', 'nombre']
					}]
				},
				{
					model: FavoritoUsuario, 
					as: 'favoritos', 
					attributes: ['id', 'fecha'],
					where: { usuario_id: user_id },
					required: false
				},
				{
					model: ProgramaPeriodo, 
					as: 'periodos', 
					attributes: ['id', 'programa_id', 'anno', 'periodo', 'cupos', 'postulados_hombres', 'postulados_mujeres', 
								'admitidos_hombres', 'admitidos_mujeres', 'graduados_hombres', 'graduados_mujeres', 
								'estudiantes_hombres', 'estudiantes_mujeres', 'matriculados_hombres', 'matriculados_mujeres'],
					limit: 10,
					order: [
						['anno', 'desc'], ['periodo', 'desc'],
					],
					required: false
				}]
			});
		}
		catch (error) {
			console.log(" OFERTA ----- ERROR 1");
			console.log(error);
			return res.status(400).send('error');
		}

		return res.send({
			user_id: user_id,
			programa: programa
		});
	}
	else {
		res.status(500).send(error/*'Error de validación'*/);
	}
}

module.exports = {
	programa: programa
}