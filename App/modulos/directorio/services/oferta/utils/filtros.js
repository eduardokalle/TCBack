const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Region } = require('../../../../poblacion/models/region');
const { NivelFormacion } = require('../../../../educacion/models/nivelFormacion');
const { Programa } = require('../../../../educacion/models/programa');
const { Metodologia } = require('../../../../educacion/models/metodologia');
const { Institucion } = require('../../../../educacion/models/institucion');
const { AreaConocimiento } = require('../../../../educacion/models/areaConocimiento');
const { NucleoConocimiento } = require('../../../../educacion/models/nucleoConocimiento');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');
const Op = Sequelize.Op;

const filtros = async ({
    areaConocimiento,
    nucleoConocimiento,
    ies,
    tipoIes,
    nivelFormacion,
    metodologia,
    region, 
    departamento,
    municipio,
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
    	coincidencia: joi.string().allow('')
	};

	const { error, value } = joi.validate({ areaConocimiento,
										    nucleoConocimiento,
										    ies,
										    tipoIes,
										    nivelFormacion,
										    metodologia,
										    departamento,
										    municipio,
										    coincidencia
										}, schema);

	if(!error) {
		let data = {};

		const wherePrograma = {};
		wherePrograma.estado = 1;

		const whereInstitucion = {};
		const whereCiudad = {};
		const whereDepartamento = {};
		const whereNucleoConocimiento = {};
		const whereNivelFormacion = {};

		if(carrera == '') {
			if(coincidencia && coincidencia !== '') {
				wherePrograma.nombre = { [Op.like]: `%${coincidencia}%` };
			}

			if (municipio !== '') {
				whereInstitucion.ciudad_id = municipio;
			}
			else if (departamento !== '') {
				whereCiudad.departamento_id = departamento;
			}

			if (nucleoConocimiento !== '') {
				wherePrograma.nucleo_conocimiento_id = nucleoConocimiento;
			}
			else if (areaConocimiento !== '') {
				whereNucleoConocimiento.area_conocimiento_id = areaConocimiento;
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
					whereNivelFormacion.es_pregrado = 1;
				}
				else if(nivelFormacion == 20000) {
					whereNivelFormacion.es_pregrado = 0;
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

		let programa;
		try {
			programa = await Programa.findAll({
				attributes: ['codigo_snies', 'nombre', 'nivel_academico', 'estado', 'duracion_programa', 'ciclos_propedeuticos', 'titulo',
							'codigo_icfes', 'creditos', 'url_pensum', 'url_web', 'acreditacion', 'duracion_periodo', 
							'nivel_formacion_id', 'metodologia_id'],
				where: wherePrograma,
				include: [{
					model: Institucion,
					as: 'institucion',
					attributes: ['id', 'codigo_snies', 'nombre', 'sector', 'acreditacion', 'es_principal', 'fecha_registro',
								'telefono_contacto', 'direccion_domicilio', 'programas_vigentes', 
								'fecha_acreditacion', 'resolucion_acreditacion', 'vigencia_acreditacion', 'url_web'],
					where: whereInstitucion,
					include: [{
						model: Ciudad,
						as: 'ciudad',
						attributes: ['id', 'nombre'],
						where: whereCiudad,
						include: [{
							model: Departamento,
							as: 'departamento',
							attributes: ['id']
						}]
					}]
				},
				{
					model: NivelFormacion, 
					as: 'nivel_formacion', 
					attributes: ['id', 'nombre'],
					where: whereNivelFormacion
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
				}],
				order: [['nombre', 'asc']],
				//limit: 5000
			});
		}
		catch (error) {
			console.log(error);
			return res.status(400).send('error');
		}

		let areas;
		try {
			areas = await AreaConocimiento.findAll({
				attributes: ['id', 'nombre'],
				include: [{
					model: NucleoConocimiento, 
					as: 'nucleos', 
					attributes: ['id', 'nombre'],
					where: whereNucleoConocimiento,
					required: false
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

		let instituciones;
		try {
			instituciones = await Institucion.findAll({
				attributes: ['id', 'nombre', 'sector'],
				order: [['nombre', 'ASC']],
				where: whereInstitucion,
				include: [{
					model: Ciudad,
					as: 'ciudad',
					attributes: ['nombre'],
					where: whereCiudad
				}]
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		let departamentos;
		try {
			departamentos = await Departamento.findAll({
				attributes: ['id', 'nombre'],
				include: [{
					model: Ciudad,
					as: 'municipios',
					attributes: ['id', 'nombre'],
					where: whereCiudad,
					required: false
				}],
				order: [
					[ 'nombre', 'ASC' ],
					[ { model: Ciudad, as: 'municipios'}, 'nombre', 'ASC' ]
				]
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		let niveles_formacion;
		try {
			niveles_formacion = await NivelFormacion.findAll({
				attributes: ['id', 'nombre', 'es_pregrado'],
		  		order: [['es_pregrado', 'DESC'], ['nombre', 'ASC']]
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		let metodologias;
		try {
			metodologias = await Metodologia.findAll({
				attributes: ['id', 'nombre'],
				order: [['nombre', 'ASC']]
			});
		}
		catch (error) {
			return res.status(400).send('error');
		}

		if(programa.length < 1000) {
			cargar_caracter(programa, data);
			cargar_areas(programa, areas, data);
			cargar_instituciones(programa, instituciones, data);
			cargar_departamentos(programa, departamentos, data);
			cargar_niveles_formacion(programa, niveles_formacion, data);
			cargar_metodologias(programa, metodologias, data);
			data.formato = true;
		}
		else {
			data.areas = areas;
			data.departamentos = departamentos;
			data.instituciones = instituciones;
			data.metodologias = metodologias;
			data.niveles_formacion = niveles_formacion;
			data.tipoIes = tipoIes;
			data.formato = false;
		}

		data.totalprogramas = programa.length;

		res.send({
			data: data
		});
	}
	else {
		//res.status(500).send('Error de validación');
		res.status(500).send(error);
	}
}

function cargar_caracter(programa, data) {

    let caracter_privada = 0;
    let caracter_publica = 0;
    let total = 0;

    for(let p in programa) {

        total++;
        if(programa[p].institucion.sector == 'PRIVADA') {
            if(caracter_privada < 100) {
                caracter_privada++;
            }
            else {
                caracter_privada = '100+';  
            }
        }
        else {
            if(caracter_publica < 100) {
                caracter_publica++;
            }
            else {
                caracter_publica = '100+';  
            }
        }
    }

    data.total = total;
    data.tipoIes = { privada: caracter_privada, oficial: caracter_publica };
    return data;
}

function cargar_areas(programa, areas, data) {

	let filtro_areas = JSON.parse(JSON.stringify(areas));

	for(let p in programa) {

		for (let a in filtro_areas) {

			if (!("total" in filtro_areas[a])) {
				filtro_areas[a].total = 0;
			}

			if (filtro_areas[a].id === programa[p].nucleo_conocimiento.area.id) {
				if(filtro_areas[a].total < 100) {
					filtro_areas[a].total += 1;
				}
				else {
					filtro_areas[a].total = '100+';	
				}
			}

			for (let n in filtro_areas[a].nucleos) {

				if (!("total" in filtro_areas[a].nucleos[n])) {
					filtro_areas[a].nucleos[n].total = 0;
				}

				if (filtro_areas[a].nucleos[n].id === programa[p].nucleo_conocimiento.id) {
					if(filtro_areas[a].nucleos[n].total < 100) {
						filtro_areas[a].nucleos[n].total += 1;
					}
					else {
						filtro_areas[a].nucleos[n].total = '100+';	
					}
				}
			}
		}
	}

	data.areas = filtro_areas;
	return data;
}

function cargar_instituciones(programa, instituciones, data) {
    let filtro_instituciones = JSON.parse(JSON.stringify(instituciones));

    for(let p in programa) {

        for (let i in filtro_instituciones) {

            if (!("total" in filtro_instituciones[i])) {
                filtro_instituciones[i].total = 0;
            }

            if (filtro_instituciones[i].id === programa[p].institucion.id) {
                if(filtro_instituciones[i].total < 100) {
                    filtro_instituciones[i].total += 1;
                }
                else {
                    filtro_instituciones[i].total = '100+'; 
                }
            }
        }
    }

    for (let i in filtro_instituciones) {
        filtro_instituciones[i].nombre = filtro_instituciones[i].nombre+' sede '+filtro_instituciones[i].ciudad.nombre;
    }

    data.instituciones = filtro_instituciones;
    return data;
}

function cargar_departamentos(programa, departamentos, data) {

    let filtro_departamentos = JSON.parse(JSON.stringify(departamentos));

    for(let p in programa) {

        for (let d in filtro_departamentos) {

            if (!("total" in filtro_departamentos[d])) {
                filtro_departamentos[d].total = 0;
            }

            if (filtro_departamentos[d].id === programa[p].institucion.ciudad.departamento.id) {
                if(filtro_departamentos[d].total < 100) {
                    filtro_departamentos[d].total += 1;
                }
                else {
                    filtro_departamentos[d].total = '100+'; 
                }
            }

            for (let m in filtro_departamentos[d].municipios) {

                if (!("total" in filtro_departamentos[d].municipios[m])) {
                    filtro_departamentos[d].municipios[m].total = 0;
                }

                if (filtro_departamentos[d].municipios[m].id === programa[p].institucion.ciudad.id) {
                    if(filtro_departamentos[d].municipios[m].total < 100) {
                        filtro_departamentos[d].municipios[m].total += 1;
                    }
                    else {
                        filtro_departamentos[d].municipios[m].total = '100+';   
                    }
                }
            }
        }
    }

    data.departamentos = filtro_departamentos;
    return data;
}

function cargar_niveles_formacion(programa, niveles_formacion, data) {
    let filtro_niveles_formacion = JSON.parse(JSON.stringify(niveles_formacion));

    let sumaPregrados = 0;
    let sumaPosgrados = 0;

    let pregrados = [];
    let posgrados = [];

    let incluidos = [];

    for(let p in programa) {

        for (let f in filtro_niveles_formacion) {

        	if(!incluidos.includes(filtro_niveles_formacion[f].nombre)) {

				incluidos.push(filtro_niveles_formacion[f].nombre);

                if(filtro_niveles_formacion[f].es_pregrado === 1) {
                    pregrados.push(filtro_niveles_formacion[f]);
                }
                else {
                    posgrados.push(filtro_niveles_formacion[f]);
                }
        	}
        	
            if (!("total" in filtro_niveles_formacion[f])) {
                filtro_niveles_formacion[f].total = 0;
            }

            if (filtro_niveles_formacion[f].id === programa[p].nivel_formacion_id) {

            	if(filtro_niveles_formacion[f].es_pregrado === 1) {
                    sumaPregrados++;
                }
                else {
                    sumaPosgrados++;
                }


                if(filtro_niveles_formacion[f].total < 100) {
                    filtro_niveles_formacion[f].total += 1;
                }
                else {
                    filtro_niveles_formacion[f].total = '100+'; 
                }
            }
        }
    }

    let listado = [];

    listado.push({
    	id: 10000,
    	nombre: "+ Todos los pregrados",
    	total: sumaPregrados
    });

    listado = listado.concat(pregrados);

    listado.push({
    	id: 20000,
    	nombre: "+ Todos los posgrados",
    	total: sumaPosgrados
    });

    listado = listado.concat(posgrados);

    //data.niveles_formacion = filtro_niveles_formacion;
    data.niveles_formacion = listado;
    return data;
}

function cargar_metodologias(programa, metodologias, data) {
    let filtro_metodologias = JSON.parse(JSON.stringify(metodologias));

    for(let p in programa) {

        for (let m in filtro_metodologias) {

            if (!("total" in filtro_metodologias[m])) {
                filtro_metodologias[m].total = 0;
            }

			if (filtro_metodologias[m].id === programa[p].metodologia_id) {
				if(filtro_metodologias[m].total < 100) {
					filtro_metodologias[m].total += 1;
				}
				else {
					filtro_metodologias[m].total = '100+';	
				}
			}
		}
	}

    data.metodologias = filtro_metodologias;
    return data;
}

module.exports = {
    filtros: filtros
}