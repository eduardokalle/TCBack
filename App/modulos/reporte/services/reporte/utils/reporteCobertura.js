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

const reporteCobertura = async ({
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
		const data = [];

		const wherePoblacion = {};
		const whereMatriculados = {};
		const wherePrograma = {};
		const whereInstitucion = {};
		const whereCiudad = {};
		const whereDepartamento = {};
		const whereNucleoConocimiento = {};
		whereMatriculados.periodo = 1;

		if (anios !== '') {
			wherePoblacion.anno = { [Op.in]: anios };
			whereMatriculados.anno = { [Op.in]: anios };
		}
		if (municipios !== '') {
			wherePoblacion.ciudad_id = { [Op.in]: municipios };
			whereInstitucion.ciudad_id = { [Op.in]: municipios };
		}
		else if (departamentos !== '') {
			wherePoblacion.departamento_id = { [Op.in]: departamentos };
			whereCiudad.departamento_id = { [Op.in]: departamentos };
		}
		else if (regiones !== '') {
			whereDepartamento.region_id = { [Op.in]: regiones };
		}
		else {
			wherePoblacion.departamento_id = { [Op.ne]: null };
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

		let edad_desde = 15;
		let edad_hasta = 44;
		if (nivelesFormacion !== '') {

			wherePrograma.nivel_formacion_id = { [Op.in]: nivelesFormacion };
			
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

		wherePoblacion.edad_desde = { [Op.gte]: edad_desde };
		wherePoblacion.edad_hasta = { [Op.lte]: edad_hasta };

		let poblacion;
		try {
			poblacion = await Poblacion.findAll({
				attributes: ['edad_desde', [Sequelize.fn('SUM', Sequelize.col('cantidad_hombres')), 'hombres'], [Sequelize.fn('SUM', Sequelize.col('cantidad_mujeres')), 'mujeres']],
				where: wherePoblacion,
				group: 'edad_desde',
				include: [{
					model: Departamento,
					as: 'departamento',
					attributes: [],
					where: whereDepartamento,
					required: false
				}]
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		let matriculados;
		try {
			matriculados = await ProgramaPeriodo.findAll({
				attributes: [['matriculados_hombres', 'hombres'], ['matriculados_mujeres', 'mujeres']],
				where: whereMatriculados,
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
					}
					]
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
				],
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

		cargar_indicadores(poblacion, matriculados, data);

		res.send({
			data: data
		});
	}
	else {
		res.status(500).send('Error de validación');
	}
}

function iniciar_data(niveles_pregrado, niveles_posgrado, areas_conocimiento, data) {
	let pregrado = [];
	for (const pre in niveles_pregrado) {
		pregrado.push({
			subnivel: niveles_pregrado[pre].nombre,
			indicadores: [{ h: { pm: 0, phn: 0, i: 0 }, m: { pm: 0, phn: 0, i: 0 } }]
		});
	}
	
	let posgrado = [];
	for (const pos in niveles_posgrado) {
		posgrado.push({
			subnivel: niveles_posgrado[pos].nombre,
			indicadores: [{ h: { pm: 0, phn: 0, i: 0 }, m: { pm: 0, phn: 0, i: 0 } }]
		});
	}

	let niveles_formacion_array = [{
		nivel: "Pregrado",
		subniveles: JSON.parse(JSON.stringify(pregrado)),
		indicadores: [{ h: { pm: 0, phn: 0, i: 0 }, m: { pm: 0, phn: 0, i: 0 } }]
	},
	{
		nivel: "Posgrado",
		subniveles: JSON.parse(JSON.stringify(posgrado)),
		indicadores: [{ h: { pm: 0, phn: 0, i: 0 }, m: { pm: 0, phn: 0, i: 0 } }]
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

function cargar_poblacion(poblacion) {

	const cantidades = {
			pregrado_hombres: 0,
			pregrado_mujeres: 0,
			posgrado_hombres: 0,
			posgrado_mujeres: 0	
		};

	for (const key in poblacion) {

		if (poblacion[key].edad_desde < 24) {
			cantidades.pregrado_hombres = parseInt(cantidades.pregrado_hombres) + parseInt(poblacion[key].hombres);
			cantidades.pregrado_mujeres = parseInt(cantidades.pregrado_mujeres) + parseInt(poblacion[key].mujeres);
		}
		else {
			cantidades.posgrado_hombres = parseInt(cantidades.posgrado_hombres) + parseInt(poblacion[key].hombres);
			cantidades.posgrado_mujeres = parseInt(cantidades.posgrado_mujeres) + parseInt(poblacion[key].mujeres);
		}
	}	

	return cantidades;
}

function cargar_matriculados(nivel_formacion, poblacion, matriculados_hombres, matriculados_mujeres, matriculados_nivel_formacion) {

	let matriculados_hombres_nivel;
	let matriculados_mujeres_nivel;
	let matriculados_hombres_subnivel;
	let matriculados_mujeres_subnivel;
	let indicador_hombres_nivel;
	let indicador_mujeres_nivel;
	let indicador_hombres_subnivel;
	let indicador_mujeres_subnivel;
	let poblacion_hombres;
	let poblacion_mujeres;

	for (let h = 0; h < nivel_formacion.subniveles.length; h++) {

		if (nivel_formacion.subniveles[h].subnivel === matriculados_nivel_formacion) {

			if (nivel_formacion.nivel === 'Pregrado') {
				poblacion_hombres = parseInt(poblacion.pregrado_hombres);
				poblacion_mujeres = parseInt(poblacion.pregrado_mujeres);
			}
			else {
				poblacion_hombres = parseInt(poblacion.posgrado_hombres);
				poblacion_mujeres = parseInt(poblacion.posgrado_mujeres);
			}

			matriculados_hombres_nivel = parseInt(matriculados_hombres) + parseInt(nivel_formacion.indicadores[0].h.pm);
			matriculados_mujeres_nivel = parseInt(matriculados_mujeres) + parseInt(nivel_formacion.indicadores[0].m.pm);

			matriculados_hombres_subnivel = parseInt(matriculados_hombres) + parseInt(nivel_formacion.subniveles[h].indicadores[0].h.pm);
			matriculados_mujeres_subnivel = parseInt(matriculados_mujeres) + parseInt(nivel_formacion.subniveles[h].indicadores[0].m.pm);

			indicador_hombres_subnivel = 0;
			indicador_hombres_nivel = 0;
			if (poblacion_hombres !== 0) {
				indicador_hombres_subnivel = ((matriculados_hombres_subnivel / poblacion_hombres) * 100).toFixed(5);
				indicador_hombres_nivel = ((matriculados_hombres_nivel / poblacion_hombres) * 100).toFixed(5);
			}

			indicador_mujeres_subnivel = 0;
			indicador_mujeres_nivel = 0;
			if (poblacion_mujeres !== 0) {
				indicador_mujeres_subnivel = ((matriculados_mujeres_subnivel / poblacion_mujeres) * 100).toFixed(5);
				indicador_mujeres_nivel = ((matriculados_mujeres_nivel / poblacion_mujeres) * 100).toFixed(5);
			}

			nivel_formacion.subniveles[h].indicadores[0].h.pm = matriculados_hombres_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].m.pm = matriculados_mujeres_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].h.phn = poblacion_hombres;
			nivel_formacion.subniveles[h].indicadores[0].m.phn = poblacion_mujeres;
			nivel_formacion.subniveles[h].indicadores[0].h.i = indicador_hombres_subnivel;
			nivel_formacion.subniveles[h].indicadores[0].m.i = indicador_mujeres_subnivel;

			nivel_formacion.indicadores[0].h.pm = matriculados_hombres_nivel;
			nivel_formacion.indicadores[0].m.pm = matriculados_mujeres_nivel;
			nivel_formacion.indicadores[0].h.phn = poblacion_hombres;
			nivel_formacion.indicadores[0].m.phn = poblacion_mujeres;
			nivel_formacion.indicadores[0].h.i = indicador_hombres_nivel;
			nivel_formacion.indicadores[0].m.i = indicador_mujeres_nivel;
		}
	}
	return nivel_formacion;
}

function cargar_indicadores(poblaciones, matriculados, data) {

	let matriculados_hombres = 0;
	let matriculados_mujeres = 0;

	let matriculados_nucleo = '';
	let matriculados_area = '';
	let matriculados_nivel_formacion = '';

	const poblacion = cargar_poblacion(poblaciones);

	for (const m in matriculados) {

		matriculados_hombres = (matriculados[m].get('hombres') !== null)? matriculados[m].get('hombres') : 0;
		matriculados_mujeres = (matriculados[m].get('mujeres') !== null)? matriculados[m].get('mujeres') : 0;
		
		matriculados_area = matriculados[m].programa.nucleo_conocimiento.area.nombre;
		matriculados_nucleo = matriculados[m].programa.nucleo_conocimiento.nombre;
		matriculados_nivel_formacion = matriculados[m].programa.nivel_formacion.nombre;

		for (let i = 0; i < data.length; i++) {

			if (data[i].areaConocimiento === matriculados_area) {

				for (let j = 0; j < data[i].nucleos.length; j++) {

					if (data[i].nucleos[j].nucleoConocimiento === matriculados_nucleo) {

						for (let k = 0; k < data[i].nucleos[j].nivelesFormacion.length; k++) {
							
							data[i].nucleos[j].nivelesFormacion[k] = cargar_matriculados(data[i].nucleos[j].nivelesFormacion[k], 
																							poblacion, 
																							matriculados_hombres, 
																							matriculados_mujeres,
																							matriculados_nivel_formacion);
						}
					}
				}

				for (let k = 0; k < data[i].nivelesFormacion.length; k++) {

					data[i].nivelesFormacion[k] = cargar_matriculados(data[i].nivelesFormacion[k], 
																		poblacion, 
																		matriculados_hombres, 
																		matriculados_mujeres,
																		matriculados_nivel_formacion);
				}
			}
		}
	}
}

module.exports = {
	reporteCobertura: reporteCobertura
}