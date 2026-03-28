const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { NivelFormacion } = require('../../../../educacion/models/nivelFormacion');
const { ProgramaPeriodo } = require('../../../../educacion/models/programaPeriodo');
const { Programa } = require('../../../../educacion/models/programa');
const { Institucion } = require('../../../../educacion/models/institucion');
const { AreaConocimiento } = require('../../../../educacion/models/areaConocimiento');
const { NucleoConocimiento } = require('../../../../educacion/models/nucleoConocimiento');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');
const Op = Sequelize.Op;

const reporteDistribucion = async ({
    anios,
    areasConocimiento,
    nucleosConocimiento,
    ies,
    tipoIes, 
    nivelesFormacion,
    metodologias,
    regiones,
    departamentos,
    municipios
}, res) => {

	const schema = {
	    anios: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
	    areasConocimiento: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	nucleosConocimiento: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	ies: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	tipoIes: joi.alternatives().try(joi.array().items(joi.string().valid('PRIVADA', 'OFICIAL').insensitive().required()), joi.string().valid('')).required(),
    	nivelesFormacion: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	metodologias: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	regiones: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	departamentos: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
    	municipios: joi.alternatives().try(joi.array().items(joi.number().integer().required()), joi.string().valid('')).required(),
	};

	const { error, value } = joi.validate({ anios,
										    areasConocimiento,
										    nucleosConocimiento,
										    ies,
										    tipoIes,
										    nivelesFormacion,
										    metodologias,
										    regiones,
										    departamentos,
										    municipios 
										}, schema);

	if(!error) {
		const whereMatriculados = {};
		const wherePrograma = {};
		const whereProgramaTodos = {};
		const whereInstitucion = {};
		const whereCiudad = {};
		const whereDepartamento = {};
		const whereNucleoConocimiento = {};
		let data = [];

		whereInstitucion.sede_titular = 1;
		if (anios !== '') {
			whereMatriculados.anno = { [Op.in]: anios };
			whereMatriculados.periodo = 1;
		}
		if (municipios !== '') {
			whereInstitucion.ciudad_id = { [Op.in]: municipios };
		}
		else if (departamentos !== '') {
			whereCiudad.departamento_id = { [Op.in]: departamentos };
		}
		else if (regiones !== '') {
			whereDepartamento.region_id = { [Op.in]: regiones };
		}

		let edad_desde = 15;
		let edad_hasta = 44;
		if (nivelesFormacion !== '') {

			wherePrograma.nivel_formacion_id = { [Op.in]: nivelesFormacion };
			whereProgramaTodos.nivel_formacion_id = { [Op.in]: nivelesFormacion };

			let niveles_formacion;
			try {
				niveles_formacion = await NivelFormacion.findAll({
					attributes: ['es_pregrado'],
					group: ['es_pregrado'],
					where: { id: { [Op.in]: nivelesFormacion } }
				});
			}
			catch (error) {
				return res.status(400).send('error');
			}

			let incluir_pregrado = false;
			let incluir_posgrado = false;

			for (const key in niveles_formacion) {
				if (niveles_formacion[key].es_pregrado === 1) {
					incluir_pregrado = true;
				}
				if (niveles_formacion[key].es_pregrado === 0) {
					incluir_posgrado = true;
				}
			}

			edad_desde = 25;
			edad_hasta = 24;

			if (incluir_pregrado) {
				edad_desde = 15;
			}
			if (incluir_posgrado) {
				edad_hasta = 44;
			}
		}
		
		if (nucleosConocimiento !== '') {
			wherePrograma.nucleo_conocimiento_id = { [Op.in]: nucleosConocimiento };
			whereNucleoConocimiento.id = { [Op.in]: nucleosConocimiento };
		}
		else if (areasConocimiento !== '') {
			whereNucleoConocimiento.area_conocimiento_id = { [Op.in]: areasConocimiento };
		}

		if (metodologias !== '') {
			wherePrograma.metodologia_id = { [Op.in]: metodologias };
			whereProgramaTodos.metodologia_id = { [Op.in]: metodologias };
		}

		if (ies !== '') {
			wherePrograma.institucion_id = { [Op.in]: ies };
			whereProgramaTodos.institucion_id = { [Op.in]: ies };
		}

		if (tipoIes !== '') {
			whereInstitucion.sector = { [Op.in]: tipoIes };
		}
		
		let institucion_programas_filtro
		try {
			institucion_programas_filtro = await Institucion.findAll({
				attributes: ['id', 'nombre'],
				where: whereInstitucion,
				include: [{
					model: Programa,
					as: 'programas',
					attributes: ['id', 'nombre'],
					where: wherePrograma, 
					group: 'programa_id',
					include: [{
						model: ProgramaPeriodo,
						as: 'periodos',
						attributes: [],
						where: whereMatriculados,
					},
					{
						model: NivelFormacion,
						as: 'nivel_formacion',
						attributes: []
					},
					{
						model: NucleoConocimiento,
						as: 'nucleo_conocimiento',
						attributes: ['id', 'nombre'],
						where: whereNucleoConocimiento,
						include: [{
							model: AreaConocimiento,
							as: 'area',
							attributes: ['id', 'nombre']
						}]
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
				order: [['nombre', 'asc']]
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		let institucion_programas_todos;
		try {
			institucion_programas_todos = await Institucion.findAll({
				attributes: ['id', 'nombre'],
				where: whereInstitucion,
				group: 'programa_id',
				include: [{
					model: Programa,
					as: 'programas',
					attributes: ['id', 'nombre'],
					where: whereProgramaTodos, 
					include: [{
						model: ProgramaPeriodo,
						as: 'periodos',
						attributes: [],
						where: whereMatriculados,
					}, {
						model: NucleoConocimiento,
						as: 'nucleo_conocimiento',
						attributes: ['id', 'nombre'],
						include: [{
							model: AreaConocimiento,
							as: 'area',
							attributes: ['id', 'nombre']
						}]
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
				order: [['nombre', 'asc']]
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		let areas_conocimiento;
		try {
			areas_conocimiento = await AreaConocimiento.findAll({
				attributes: ['nombre'],
				include: [{
					model: NucleoConocimiento,
					as: 'nucleos',
					attributes: ['nombre'],
					where: whereNucleoConocimiento
				}],
				order: [
					['nombre', 'ASC'],
					[{ model: NucleoConocimiento, as: 'nucleos' }, 'nombre', 'ASC']
				]
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		iniciar_data(areas_conocimiento, institucion_programas_todos, data);

		cargar_indicadores(institucion_programas_filtro, data);

		res.send({
			data: data
		});
	}
	else {
		res.status(500).send('Error de validación');
	}
}

function iniciar_data(areas_conocimiento, institucion_programas_todos, data) {
		let listado_areas = [];
		for (const area in areas_conocimiento) {
			let listado_nucleos = [];

			for (let nucleo in areas_conocimiento[area].nucleos) {

				listado_nucleos.push({
					nombre: areas_conocimiento[area].nucleos[nucleo].nombre,
					indicadores: { na: 0, nc: 0, i: 0 }
				});
			}

			listado_areas.push({
				nombre: areas_conocimiento[area].nombre,
				indicadores: { na: 0, nc: 0, i: 0 },
				nucleos: JSON.parse(JSON.stringify(listado_nucleos))
			});
		}

		let total_programas = 0;
		for (const i in institucion_programas_todos) {

			let ies_areas = JSON.parse(JSON.stringify(listado_areas));
			total_programas = institucion_programas_todos[i].programas.length;

			for (const p in institucion_programas_todos[i].programas) {

				for (const a in ies_areas) {
					ies_areas[a].indicadores.nc = total_programas;

					for (const n in ies_areas[a].nucleos) {
						ies_areas[a].nucleos[n].indicadores.nc = total_programas;
					} 
				}
			}

			data.push({
				ie: `${institucion_programas_todos[i].nombre} sede ${institucion_programas_todos[i].ciudad.nombre}`,
				areas: ies_areas
			});
		}
}

function cargar_indicadores(institucion_programas_filtro, data) {
		let ies_nombre = ''
		let ies_filtro_nombre = '';
		let programa_area = '';
		let programa_nucleo = '';
		let indicador_i = 0;

		for (const d in data) {
			ies_nombre = data[d].ie;
			for (const f in institucion_programas_filtro) {
				ies_filtro_nombre = `${institucion_programas_filtro[f].nombre} sede ${institucion_programas_filtro[f].ciudad.nombre}`;

				if(ies_filtro_nombre === ies_nombre) {

					for (const fp in institucion_programas_filtro[f].programas) {

						programa_nucleo = institucion_programas_filtro[f].programas[fp].nucleo_conocimiento.nombre;
						programa_area = institucion_programas_filtro[f].programas[fp].nucleo_conocimiento.area.nombre;

						for (const da in data[d].areas ) {

							if (data[d].areas[da].nombre == programa_area) {

								data[d].areas[da].indicadores.na = parseInt(data[d].areas[da].indicadores.na) + 1;
								indicador_i = data[d].areas[da].indicadores.na / data[d].areas[da].indicadores.nc;
								indicador_i = (indicador_i * 100).toFixed(0)
								data[d].areas[da].indicadores.i = indicador_i;

								for (const dn in data[d].areas[da].nucleos ) {

									if (data[d].areas[da].nucleos[dn].nombre == programa_nucleo) {
										data[d].areas[da].nucleos[dn].indicadores.na = parseInt(data[d].areas[da].nucleos[dn].indicadores.na) + 1;
										indicador_i = data[d].areas[da].nucleos[dn].indicadores.na / data[d].areas[da].nucleos[dn].indicadores.nc;
										indicador_i = (indicador_i * 100).toFixed(0);
										data[d].areas[da].nucleos[dn].indicadores.i = indicador_i;
									}
								}
							}
						}
					}
				}
			}
		}
}

module.exports = {
	reporteDistribucion: reporteDistribucion
}