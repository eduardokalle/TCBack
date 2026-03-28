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

const oferta = async ({
    areaConocimiento,
    nucleoConocimiento,
    ies,
    tipoIes,
    nivelFormacion,
    metodologia,
    region, 
    departamento,
    municipio,
    limite,
    desde,
    user_id,
    coincidencia,
    carrera
}, res) => {

	const schema = {
		areaConocimiento: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    	nucleoConocimiento: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    	ies: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    	tipoIes: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    	nivelFormacion: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    	metodologia: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    	departamento: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    	municipio: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    	coincidencia: joi.string().allow(''),
    	limite: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
    	desde: joi.alternatives().try(joi.number().integer(), joi.string().valid('')).required(),
	};

	const { error, value } = joi.validate({ areaConocimiento,
										    nucleoConocimiento,
										    ies,
										    tipoIes,
										    nivelFormacion,
										    metodologia,
										    departamento,
										    municipio,
										    limite,
										    desde,
										    coincidencia
										}, schema);

	if(!error) {

		const data = {};

		let flagDatoCurioso = 0;
		const wherePrograma = {};
		wherePrograma.estado = 1;
		const whereDatoCurioso = {};
		const whereInstitucion = {};
		const whereCiudad = {};
		const whereDepartamento = {};
		const whereNucleoConocimiento = {};

		if(carrera == '') {

			if(coincidencia && coincidencia !== '') {
				wherePrograma.nombre = { [Op.like]: `%${coincidencia}%` };
			}

			if (nucleoConocimiento !== '') {
				wherePrograma.nucleo_conocimiento_id = nucleoConocimiento;
				whereDatoCurioso.nucleo_conocimiento_id = nucleoConocimiento;
				flagDatoCurioso = 1;
			}
			else if (areaConocimiento !== '') {
				whereNucleoConocimiento.area_conocimiento_id = areaConocimiento;
			}

			if (municipio !== '') {
				whereInstitucion.ciudad_id = municipio;
				whereDatoCurioso.ciudad_id = municipio;
				flagDatoCurioso = 1;
			}
			else if (departamento !== '') {
				whereCiudad.departamento_id = departamento;
				whereDatoCurioso.departamento_id = departamento;
				flagDatoCurioso = 1;
			}

			if (metodologia !== '') {
				wherePrograma.metodologia_id = metodologia;
			}

			if (ies !== '') {
				wherePrograma.institucion_id = ies ;
			}

			if (tipoIes !== '') {

				tipoIes = (tipoIes == 1)? 'oficial' : 'privada';

				whereInstitucion.sector = { [Op.like]: tipoIes };
			}

			if (nivelFormacion !== '') {
				if(nivelFormacion == 10000) {
					wherePrograma.nivel_academico = 'Pregrado';
				} 
				else if(nivelFormacion == 20000){
					wherePrograma.nivel_academico = 'Posgrado';
				}
				else {
					wherePrograma.nivel_formacion_id = nivelFormacion;
				}
			}
		}
		else {
			const carreraId = carrera.split('-').pop();
			wherePrograma.id = carreraId;
		}


		console.log("-------------- BUSCADOR --------------");


		let programa;
		try {
			programa = await Programa.findAll({
				attributes: ['id', 'codigo_snies', 'nombre', 'nivel_academico', 'estado', 'duracion_programa', 'ciclos_propedeuticos', 'titulo',
							'codigo_icfes', 'creditos', 'url_pensum', 'url_web', 'acreditacion', 'duracion_periodo', 
							'nivel_formacion_id', 'metodologia_id', 'valor_matricula'],
				where: wherePrograma,
				include: [
				{
					model: Institucion,
					as: 'institucion',
					attributes: ['id', 'codigo_snies', 'nombre', 'sector', 'acreditacion', 'es_principal', 'fecha_registro',
								'telefono_contacto', 'direccion_domicilio', 'programas_vigentes', 
								'fecha_acreditacion', 'resolucion_acreditacion', 'vigencia_acreditacion', 
								'ruta_logo', 'url_web', 'imagen_id'],
					where: whereInstitucion,
					include: [{
						model: Ciudad,
						as: 'ciudad',
						attributes: ['id', 'nombre'],
						where: whereCiudad,
						include: [{
							model: Departamento,
							as: 'departamento',
							attributes: ['id'],
							where: whereDepartamento
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
					where: whereNucleoConocimiento,
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
				}],
				order: [['nivel_academico', 'desc'],
						['nombre', 'asc']],
				offset: desde, 
				limit: limite
			});
		}
		catch (error) {
			console.log(" OFERTA ----- ERROR 1");
			console.log(error);
			return res.status(400).send('error');
		}

		let resultPrograma = JSON.parse(JSON.stringify(programa));
		let dataPrograma = [];
	    let itemPrograma = {};

	    for(let b in resultPrograma) {

	        itemPrograma = JSON.parse(JSON.stringify(resultPrograma[b]));

	        if(resultPrograma[b]['institucion']['imagen']) {
	            itemPrograma.institucion.ruta_logo = serverURL+resultPrograma[b]['institucion']['imagen']['url'];
	            itemPrograma.institucion.imagen_id = resultPrograma[b]['institucion']['imagen']['id'];
	        }
	        dataPrograma.push(itemPrograma);
	    }



		let dato_curioso;

		if(flagDatoCurioso == 1) {
			try {
				dato_curioso = await DatoCurioso.findOne({
					attributes: ['texto'],
					where: whereDatoCurioso,
					//order: 'random()'
					order: [
						Sequelize.fn( 'RAND' ),
					]
				});
			}
			catch (error) {
				console.log(" OFERTA ----- ERROR 2");
				console.log(error);
				return res.status(400).send('error');
			}
		}


		let programaTotal;
		try {
			programaTotal = await Programa.findAll({
				attributes: ['id'],
				where: wherePrograma,
				include: [
				{
					model: Institucion,
					as: 'institucion',
					attributes: ['id'],
					where: whereInstitucion,
					include: [{
						model: Ciudad,
						as: 'ciudad',
						attributes: ['id'],
						where: whereCiudad,
						include: [{
							model: Departamento,
							as: 'departamento',
							attributes: ['id'],
							where: whereDepartamento
						}]
					}]
				},
				{
					model: NucleoConocimiento,
					as: 'nucleo_conocimiento',
					attributes: ['id', 'nombre', 'area_conocimiento_id'],
					where: whereNucleoConocimiento,
					include: [{
						model: AreaConocimiento,
						as: 'area',
						attributes: ['id', 'nombre']
					}]
				}]
			});
		}
		catch (error) {
			console.log(" OFERTA ----- ERROR 1");
			console.log(error);
			return res.status(400).send('error');
		}

		//data.programas = programa;
		data.programas = dataPrograma;
		data.dato_curioso = dato_curioso;
		data.total = programaTotal.length;

		return res.send({
			user_id: user_id,
			data: data,
		});
	}
	else {
		res.status(500).send(error/*'Error de validación'*/);
	}
}

module.exports = {
	oferta: oferta
}