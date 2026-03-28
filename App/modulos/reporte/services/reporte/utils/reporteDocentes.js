const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { NivelFormacion } = require('../../../../educacion/models/nivelFormacion');
const { Institucion } = require('../../../../educacion/models/institucion');
const { PlantaDocente } = require('../../../../educacion/models/plantaDocente');
const { TiempoDedicacion } = require('../../../../educacion/models/tiempoDedicacion');
const { NivelFormacionDocente } = require('../../../../educacion/models/nivelFormacionDocente');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');
const Op = Sequelize.Op;

const reporteDocentes = async ({
    anio,
    ies,
    tipoIes,
    maxNivelFormacion,
    regiones,
    departamentos,
    municipios
}, res) => {

	const schema = {
	    anio: joi.number().integer().required(),
		ies: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	tipoIes: joi.alternatives().try(joi.array().items(joi.string().valid('PRIVADA', 'OFICIAL').insensitive().required()), joi.string().valid('')).required(),
    	maxNivelFormacion: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	regiones: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	departamentos: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	municipios: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
	};

	const { error, value } = joi.validate({
										    anio,
										    ies,
										    tipoIes,
										    maxNivelFormacion,
										    regiones,
										    departamentos,
										    municipios 
										}, schema);

	if(!error) {
		const whereInstitucion = {};
		const whereDocentes = {};
		const whereCiudad = {};
		const whereDepartamento = {};
		let data = [];

		whereDocentes.anno = anio;

		whereInstitucion.sede_titular = 1;
		whereInstitucion.es_principal = 1;
		if (municipios !== '') {
			whereInstitucion.ciudad_id = { [Op.in]: municipios };
		}
		else if (departamentos !== '') {
			whereCiudad.departamento_id = { [Op.in]: departamentos };
		}
		else if (regiones !== '') {
			whereDepartamento.region_id = { [Op.in]: regiones };
		}

		if (maxNivelFormacion !== '') {
			whereDocentes.nivel_formacion_docente_id = { [Op.in]: maxNivelFormacion };
		}

		if (tipoIes !== '') {
			whereInstitucion.sector = { [Op.in]: tipoIes };	
		}

		if (ies !== '') {
			whereInstitucion.id = { [Op.in]: ies };	
		}

		let institucion_docentes;
		try {
			institucion_docentes = await Institucion.findAll({
				attributes: ['id', 'nombre'],
				where: whereInstitucion,
				include: [{
					model: PlantaDocente,
					as: 'planta_docente',
					attributes: ['hombres', 'mujeres', 'total'],
					where: whereDocentes, 
					required: false,
					include: [{
						model: TiempoDedicacion,
						as: 'tiempo_dedicacion',
						attributes: ['ponderacion']
					},
					{
						model: NivelFormacionDocente,
						as: 'nivel_formacion_docente',
						attributes: ['ponderacion']
					}]
				},
				{
					model: Ciudad,
					as: 'ciudad',
					attributes: ['nombre'],
					where: whereCiudad,
					include: [{
						model: Departamento,
						as: 'departamento',
						attributes: ['id'],
						where: whereDepartamento
					}]
				}],
				order: [
					['nombre', 'ASC']
				]
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		let institucion = {};
		let cantidad_hombres = 0;
		let cantidad_mujeres = 0;
		let cantidad_total = 0;
		let ponderacion_tiempo = 0;
		let ponderacion_nivel = 0

		for (const i in institucion_docentes) {

			institucion = {};
			institucion.nombre = `${ institucion_docentes[i].nombre } sede ${ institucion_docentes[i].ciudad.nombre }`;
			institucion.calificacion_hombres = 0;
			institucion.calificacion_mujeres = 0;
			institucion.calificacion_todos = 0;

			for (const p in institucion_docentes[i].planta_docente) {
				cantidad_hombres = institucion_docentes[i].planta_docente[p].hombres;
				cantidad_mujeres = institucion_docentes[i].planta_docente[p].mujeres;
				cantidad_total = institucion_docentes[i].planta_docente[p].total;

				ponderacion_tiempo = 0;
				if (institucion_docentes[i].planta_docente[p].tiempo_dedicacion) {
					ponderacion_tiempo = institucion_docentes[i].planta_docente[p].tiempo_dedicacion.ponderacion;
				}

				ponderacion_nivel = 0;
				if (institucion_docentes[i].planta_docente[p].nivel_formacion_docente) {
					ponderacion_nivel = institucion_docentes[i].planta_docente[p].nivel_formacion_docente.ponderacion;
				}

				institucion.calificacion_hombres = parseInt(institucion.calificacion_hombres) + parseInt(ponderacion_tiempo*ponderacion_nivel*cantidad_hombres);
				institucion.calificacion_mujeres = parseInt(institucion.calificacion_mujeres) + parseInt(ponderacion_tiempo*ponderacion_nivel*cantidad_mujeres);
				institucion.calificacion_todos = parseInt(institucion.calificacion_todos) + parseInt(ponderacion_tiempo*ponderacion_nivel*cantidad_total);
			}

			data.push(institucion);
		}

		res.send({
			data: data
		});
	}
	else {
		console.log(error);
		res.status(500).send('Error de validación');
	}
}

module.exports = {
	reporteDocentes: reporteDocentes
}