const { Poblacion } = require('../../../../poblacion/models/poblacion');
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

const reporteNuevos = async ({
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
	    anios: joi.number().integer().required(),
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
		const data = [];

		const whereMatriculados = {};
		const wherePrograma = {};
		const whereInstitucion = {};
		const whereCiudad = {};
		const whereDepartamento = {};
		const whereNucleoConocimiento = {};

		const anio_anterior = parseInt(anios) - 1;
		const anios_todos = [anio_anterior, anios];
		whereMatriculados.anno = { [Op.in]: anios_todos };
		whereMatriculados.periodo = 1;

		if (municipios !== '') {
			whereInstitucion.ciudad_id = { [Op.in]: municipios };
		}
		else if (departamentos !== '') {
			whereCiudad.departamento_id = { [Op.in]: departamentos };
		}
		else if (regiones !== '') {
			whereDepartamento.region_id = { [Op.in]: regiones };
		}

		if (nivelesFormacion !== '') {
			wherePrograma.nivel_formacion_id = { [Op.in]: nivelesFormacion };
		}

		if (nucleosConocimiento !== '') {
			wherePrograma.nucleo_conocimiento_id = { [Op.in]: nucleosConocimiento };
		}
		else if (areasConocimiento !== '') {
			whereNucleoConocimiento.area_conocimiento_id = { [Op.in]: areasConocimiento };
		}

		if (metodologias !== '') {
			wherePrograma.metodologia_id = { [Op.in]: metodologias };
		}

		if (ies !== '') {
			wherePrograma.institucion_id = { [Op.in]: ies };
		}

		if (tipoIes !== '') {
			whereInstitucion.sector = { [Op.in]: tipoIes };
		}

		let matriculados;
		try {
			matriculados = await ProgramaPeriodo.findAll({
				attributes: ['id', 'anno', 
								'matriculados_hombres', 'matriculados_mujeres', 'estudiantes_hombres', 'estudiantes_mujeres'
							],
				where: whereMatriculados,
				group: ['programa_id', 'anno'],
				include: [{
					model: Programa,
					as: 'programa', 
					attributes: ['nucleo_conocimiento_id', 'nivel_formacion_id'],
					where: wherePrograma,
					include: [{
						model: Institucion,
						as: 'institucion', 
						attributes: ['id', 'nombre'],
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
						}]
					}, 
					{
						model: NivelFormacion,
						as: 'nivel_formacion',
						attributes: ['nombre']
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
				}]
			});
		} 
		catch (error) {
			return res.status(400).send('error');
		}

		let areas_conocimiento;
		const whereFiltroNucleoConocimiento = {};
		const whereFiltroAreaConocimiento = {};
		if(nucleosConocimiento !== '') {
			whereFiltroNucleoConocimiento.id = { [Op.in]: nucleosConocimiento };
		}
		else if(areasConocimiento !== '') {
			whereFiltroAreaConocimiento.id = { [Op.in]: areasConocimiento };
		}
		try {
			areas_conocimiento = await AreaConocimiento.findAll({
				attributes: ['nombre'],
				where: whereFiltroAreaConocimiento,
				include: [{
					model: NucleoConocimiento,
					as: 'nucleos',
					attributes: ['nombre'],
					where: whereFiltroNucleoConocimiento
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

		let niveles_pregrado;
		try {
			niveles_pregrado = await NivelFormacion.findAll({
				attributes: ['nombre'],
				where: { es_pregrado: 1 },
				order: [['nombre', 'ASC']]
			});
		} 
		catch (error) {
			return res.status(400).send('error');
		}

		let niveles_posgrado;
		try {
			niveles_posgrado = await NivelFormacion.findAll({
				attributes: ['nombre'],
				where: { es_pregrado: 0 },
				order: [['nombre', 'ASC']]
			});
		} 
		catch (error) {
			return res.status(400).send('error');
		}

		iniciar_data(niveles_pregrado, niveles_posgrado, areas_conocimiento, data);

		cargar_indicadores(matriculados, anio_anterior, data);

		res.send({			
			data: data
		});
	}
	else {
		res.status(500).send('Error de validación. Verifica los campos del formulario. <br> - Debes seleccionar un año.');
	}
}

function iniciar_data(niveles_pregrado, niveles_posgrado, areas_conocimiento, data) {
	let pregrado = [];
	for (const pre in niveles_pregrado) {
		pregrado.push({
			subnivel: niveles_pregrado[pre].nombre,
			indicadores: [{ h: { ma: 0, ma1: 0, mta: 0, i: '' }, m: { ma: 0, ma1: 0, mta: 0, i: '' } }]
		});
	}
	
	let posgrado = [];
	for (const pos in niveles_posgrado) {
		posgrado.push({
			subnivel: niveles_posgrado[pos].nombre,
			indicadores: [{ h: { ma: 0, ma1: 0, mta: 0, i: '' }, m: { ma: 0, ma1: 0, mta: 0, i: '' } }]
		});
	}

	let niveles_formacion_array = [{
		nivel: "Pregrado",
		subniveles: JSON.parse(JSON.stringify(pregrado)),
		indicadores: [{ h: { ma: 0, ma1: 0, mta: 0, i: '' }, m: { ma: 0, ma1: 0, mta: 0, i: '' } }]
	},
	{
		nivel: "Posgrado",
		subniveles: JSON.parse(JSON.stringify(posgrado)),
		indicadores: [{ h: { ma: 0, ma1: 0, mta: 0, i: '' }, m: { ma: 0, ma1: 0, mta: 0, i: '' } }]
	}];

	for (let area in areas_conocimiento) {
		let listado_nucleos = [];

		for (let nucleo in areas_conocimiento[area].nucleos) {

			listado_nucleos.push({
				nucleoConocimiento: areas_conocimiento[area].nucleos[nucleo].nombre,
				nivelesFormacion: JSON.parse(JSON.stringify(niveles_formacion_array))
			});
		}

		data.push({
			areaConocimiento: areas_conocimiento[area].nombre,
			nucleos: JSON.parse(JSON.stringify(listado_nucleos)),
			nivelesFormacion: JSON.parse(JSON.stringify(niveles_formacion_array))
		})
	}
	return data;
}

function cargar_matriculados(nivel_formacion, matriculados_hombres_anno, matriculados_mujeres_anno, 
									matriculados_hombres_anno_anterior, matriculados_mujeres_anno_anterior,
									estudiantes_hombres_todos, estudiantes_mujeres_todos, matriculados_nivel_formacion) {

	let matriculados_hombres_anno_nivel = 0;
	let matriculados_mujeres_anno_nivel = 0;
	let matriculados_hombres_anno_subnivel = 0;
	let matriculados_mujeres_anno_subnivel = 0;

	let matriculados_hombres_anno_anterior_nivel = 0;
	let matriculados_mujeres_anno_anterior_nivel = 0;
	let matriculados_hombres_anno_anterior_subnivel = 0;
	let matriculados_mujeres_anno_anterior_subnivel = 0;

	let estudiantes_hombres_todos_nivel = 0;
	let estudiantes_mujeres_todos_nivel = 0;
	let estudiantes_hombres_todos_subnivel = 0;
	let estudiantes_mujeres_todos_subnivel = 0;

	let i1_hombres_nivel = 0;
	let i1_mujeres_nivel = 0;
	let i2_hombres_nivel = 0;
	let i2_mujeres_nivel = 0;
	let i1_hombres_subnivel = 0;
	let i1_mujeres_subnivel = 0;
	let i2_hombres_subnivel = 0;
	let i2_mujeres_subnivel = 0;


	for (let h = 0; h < nivel_formacion.subniveles.length; h++) {

		if (nivel_formacion.subniveles[h].subnivel === matriculados_nivel_formacion) {

			matriculados_hombres_anno_nivel = parseInt(matriculados_hombres_anno) + parseInt(nivel_formacion.indicadores[0].h.ma);
			matriculados_hombres_anno_anterior_nivel = parseInt(matriculados_hombres_anno_anterior) + parseInt(nivel_formacion.indicadores[0].h.ma1);
			estudiantes_hombres_todos_nivel = parseInt(estudiantes_hombres_todos) + parseInt(nivel_formacion.indicadores[0].h.mta);

			matriculados_mujeres_anno_nivel = parseInt(matriculados_mujeres_anno) + parseInt(nivel_formacion.indicadores[0].m.ma);
			matriculados_mujeres_anno_anterior_nivel = parseInt(matriculados_mujeres_anno_anterior) + parseInt(nivel_formacion.indicadores[0].m.ma1);
			estudiantes_mujeres_todos_nivel = parseInt(estudiantes_mujeres_todos) + parseInt(nivel_formacion.indicadores[0].m.mta);

			matriculados_hombres_anno_subnivel = parseInt(matriculados_hombres_anno) + parseInt(nivel_formacion.subniveles[h].indicadores[0].h.ma);
			matriculados_hombres_anno_anterior_subnivel = parseInt(matriculados_hombres_anno_anterior) + parseInt(nivel_formacion.subniveles[h].indicadores[0].h.ma1);
			estudiantes_hombres_todos_subnivel = parseInt(estudiantes_hombres_todos) + parseInt(nivel_formacion.subniveles[h].indicadores[0].h.mta);

			matriculados_mujeres_anno_subnivel = parseInt(matriculados_mujeres_anno) + parseInt(nivel_formacion.subniveles[h].indicadores[0].m.ma);
			matriculados_mujeres_anno_anterior_subnivel = parseInt(matriculados_mujeres_anno_anterior) + parseInt(nivel_formacion.subniveles[h].indicadores[0].m.ma1);
			estudiantes_mujeres_todos_subnivel = parseInt(estudiantes_mujeres_todos) + parseInt(nivel_formacion.subniveles[h].indicadores[0].m.mta);

			/*
			i1_hombres_nivel = matriculados_hombres_anno_nivel - matriculados_hombres_anno_anterior_nivel;
			i1_mujeres_nivel = matriculados_mujeres_anno_nivel - matriculados_mujeres_anno_anterior_nivel;

			i1_hombres_subnivel = matriculados_hombres_anno_subnivel - matriculados_hombres_anno_anterior_subnivel;
			i1_mujeres_subnivel = matriculados_mujeres_anno_subnivel - matriculados_mujeres_anno_anterior_subnivel;

			if (estudiantes_hombres_todos_nivel !== 0) {
				i2_hombres_nivel = ((i1_hombres_nivel / estudiantes_hombres_todos_nivel) * 100).toFixed(5);
			}
			if (estudiantes_mujeres_todos_nivel !== 0) {
				i2_mujeres_nivel = ((i1_mujeres_nivel / estudiantes_mujeres_todos_nivel) * 100).toFixed(5);
			}
			if (estudiantes_hombres_todos_subnivel !== 0) {
				i2_hombres_subnivel = ((i1_hombres_subnivel / estudiantes_hombres_todos_subnivel) * 100).toFixed(5);
			}
			if (estudiantes_mujeres_todos_subnivel !== 0) {
				i2_mujeres_subnivel = ((i1_mujeres_subnivel / estudiantes_mujeres_todos_subnivel) * 100).toFixed(5);
			}

			nivel_formacion.subniveles[h].indicadores[0].h.ma = matriculados_hombres_anno_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].m.ma = matriculados_mujeres_anno_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].h.ma1 = matriculados_hombres_anno_anterior_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].m.ma1 = matriculados_mujeres_anno_anterior_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].h.mta = estudiantes_hombres_todos_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].m.mta = estudiantes_mujeres_todos_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].h.i = `${ i1_hombres_subnivel } (${ i2_hombres_subnivel }%)`;
			nivel_formacion.subniveles[h].indicadores[0].m.i = `${ i1_mujeres_subnivel } (${ i2_mujeres_subnivel }%)`;

			nivel_formacion.indicadores[0].h.ma = matriculados_hombres_anno_nivel;
			nivel_formacion.indicadores[0].m.ma = matriculados_mujeres_anno_nivel;
			nivel_formacion.indicadores[0].h.ma1 = matriculados_hombres_anno_anterior_nivel;
			nivel_formacion.indicadores[0].m.ma1 = matriculados_mujeres_anno_anterior_nivel;
			nivel_formacion.indicadores[0].h.mta = estudiantes_hombres_todos_nivel;
			nivel_formacion.indicadores[0].m.mta = estudiantes_mujeres_todos_nivel;
			nivel_formacion.indicadores[0].h.i = `${ i1_hombres_nivel } (${ i2_hombres_nivel }%)`;
			nivel_formacion.indicadores[0].m.i = `${ i1_mujeres_nivel } (${ i2_mujeres_nivel }%)`;
			*/

			i1_hombres_nivel = matriculados_hombres_anno_nivel; // - matriculados_hombres_anno_anterior_nivel;
			i1_mujeres_nivel = matriculados_mujeres_anno_nivel; // - matriculados_mujeres_anno_anterior_nivel;

			i1_hombres_subnivel = matriculados_hombres_anno_subnivel; // - matriculados_hombres_anno_anterior_subnivel;
			i1_mujeres_subnivel = matriculados_mujeres_anno_subnivel; // - matriculados_mujeres_anno_anterior_subnivel;

			if (estudiantes_hombres_todos_nivel !== 0) {
				i2_hombres_nivel = ((i1_hombres_nivel / estudiantes_hombres_todos_nivel) * 100).toFixed(2);
			}
			if (estudiantes_mujeres_todos_nivel !== 0) {
				i2_mujeres_nivel = ((i1_mujeres_nivel / estudiantes_mujeres_todos_nivel) * 100).toFixed(2);
			}
			if (estudiantes_hombres_todos_subnivel !== 0) {
				i2_hombres_subnivel = ((i1_hombres_subnivel / estudiantes_hombres_todos_subnivel) * 100).toFixed(2);
			}
			if (estudiantes_mujeres_todos_subnivel !== 0) {
				i2_mujeres_subnivel = ((i1_mujeres_subnivel / estudiantes_mujeres_todos_subnivel) * 100).toFixed(2);
			}

			nivel_formacion.subniveles[h].indicadores[0].h.ma = matriculados_hombres_anno_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].m.ma = matriculados_mujeres_anno_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].h.ma1 = matriculados_hombres_anno_anterior_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].m.ma1 = matriculados_mujeres_anno_anterior_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].h.mta = estudiantes_hombres_todos_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].m.mta = estudiantes_mujeres_todos_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].h.i = `${ i2_hombres_subnivel }%`;
			nivel_formacion.subniveles[h].indicadores[0].m.i = `${ i2_mujeres_subnivel }%`;

			nivel_formacion.indicadores[0].h.ma = matriculados_hombres_anno_nivel;
			nivel_formacion.indicadores[0].m.ma = matriculados_mujeres_anno_nivel;
			nivel_formacion.indicadores[0].h.ma1 = matriculados_hombres_anno_anterior_nivel;
			nivel_formacion.indicadores[0].m.ma1 = matriculados_mujeres_anno_anterior_nivel;
			nivel_formacion.indicadores[0].h.mta = estudiantes_hombres_todos_nivel;
			nivel_formacion.indicadores[0].m.mta = estudiantes_mujeres_todos_nivel;
			nivel_formacion.indicadores[0].h.i = `${ i2_hombres_nivel }%`;
			nivel_formacion.indicadores[0].m.i = `${ i2_mujeres_nivel }%`;
		}
	}

	return nivel_formacion;
}

function cargar_indicadores(matriculados, anio_anterior, data) {

	let matriculados_hombres_anno = 0;
	let matriculados_mujeres_anno = 0;
	let matriculados_hombres_anno_anterior = 0;
	let matriculados_mujeres_anno_anterior = 0;
	let estudiantes_hombres_todos = 0;
	let estudiantes_mujeres_todos = 0;

	let matriculados_nucleo = '';
	let matriculados_area = '';
	let matriculados_nivel_formacion = '';

	for (const m in matriculados) {

		matriculados_hombres_anno = 0;
		matriculados_mujeres_anno = 0;
		matriculados_hombres_anno_anterior = 0;
		matriculados_mujeres_anno_anterior = 0;
		estudiantes_hombres_todos = 0;
		estudiantes_mujeres_todos = 0;

		if(matriculados[m].anno == anio_anterior) {
			matriculados_hombres_anno_anterior = (matriculados[m].get('matriculados_hombres') !== null)? matriculados[m].get('matriculados_hombres') : 0;
			matriculados_mujeres_anno_anterior = (matriculados[m].get('matriculados_mujeres') !== null)? matriculados[m].get('matriculados_mujeres') : 0;
		}
		else {
			matriculados_hombres_anno = (matriculados[m].get('matriculados_hombres') !== null)? matriculados[m].get('matriculados_hombres') : 0;
			matriculados_mujeres_anno = (matriculados[m].get('matriculados_mujeres') !== null)? matriculados[m].get('matriculados_mujeres') : 0;
			estudiantes_hombres_todos = (matriculados[m].get('estudiantes_hombres') !== null)? matriculados[m].get('estudiantes_hombres') : 0;
			estudiantes_mujeres_todos = (matriculados[m].get('estudiantes_mujeres') !== null)? matriculados[m].get('estudiantes_mujeres') : 0;
		}

		matriculados_area = matriculados[m].programa.nucleo_conocimiento.area.nombre;
		matriculados_nucleo = matriculados[m].programa.nucleo_conocimiento.nombre;
		matriculados_nivel_formacion = matriculados[m].programa.nivel_formacion.nombre;
			
		for (let i = 0; i < data.length; i++) {

			if (data[i].areaConocimiento === matriculados_area) {

				for (let j = 0; j < data[i].nucleos.length; j++) {

					if (data[i].nucleos[j].nucleoConocimiento === matriculados_nucleo) {

						for (let k = 0; k < data[i].nucleos[j].nivelesFormacion.length; k++) {

							data[i].nucleos[j].nivelesFormacion[k] = cargar_matriculados(data[i].nucleos[j].nivelesFormacion[k], 
																							matriculados_hombres_anno, 
																							matriculados_mujeres_anno,
																							matriculados_hombres_anno_anterior,
																							matriculados_mujeres_anno_anterior,
																							estudiantes_hombres_todos,
																							estudiantes_mujeres_todos,
																							matriculados_nivel_formacion);
						}
					}
				}

				for (let k = 0; k < data[i].nivelesFormacion.length; k++) {

					data[i].nivelesFormacion[k] = cargar_matriculados(data[i].nivelesFormacion[k], 
																		matriculados_hombres_anno, 
																		matriculados_mujeres_anno,
																		matriculados_hombres_anno_anterior,
																		matriculados_mujeres_anno_anterior,
																		estudiantes_hombres_todos,
																		estudiantes_mujeres_todos,
																		matriculados_nivel_formacion);
				}
			}
		}
	}
}

module.exports = {
	reporteNuevos: reporteNuevos
}