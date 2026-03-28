const { Poblacion } = require('../../../../poblacion/models/poblacion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Region } = require('../../../../poblacion/models/region');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');
const Op = Sequelize.Op;

const reportePoblacion = async ({
    rangoDesde, 
    rangoHasta,
    nivel,
    anio
}, res) => {

	const schema = {
		rangoDesde: joi.number().integer(),
		rangoHasta: joi.number().integer(),
	    nivel: joi.string().valid('R', 'M', 'D').insensitive().required(),
	    anio: joi.number().integer().required(),
	};

	const { error, value } = joi.validate({
										    rangoDesde, 
										    rangoHasta,
										    nivel,
										    anio
										}, schema);

	if(!error) {
		const data = [];

		const wherePoblacion = {};
		const wherePoblacionTotal = {};
		const wherePoblacionPais = {};
		const whereCiudad = {};
		const whereDepartamento = {};
		let group_by = '';

		let edad_desde = 0;
		let edad_hasta = 29;

		if(rangoDesde !== '' && rangoHasta !== '') {
			edad_desde = rangoDesde;
			edad_hasta = rangoHasta;
		}
		wherePoblacion.edad_desde = { [Op.gte]: edad_desde };
		wherePoblacion.edad_hasta = { [Op.lte]: edad_hasta };
		wherePoblacion.anno = anio;

		wherePoblacionPais.departamento_id = 1;
		wherePoblacionPais.edad_desde = { [Op.gte]: edad_desde };
		wherePoblacionPais.edad_hasta = { [Op.lte]: edad_hasta };
		wherePoblacionPais.anno = anio;		

		if (nivel === 'm') {
			wherePoblacion.ciudad_id = { [Op.ne]: null };
			group_by = 'ciudad_id'
		}
		else if (nivel === 'd') {
			wherePoblacion.departamento_id = { [Op.ne]: null };
			group_by = 'poblacion.departamento_id'
		}
		else if (nivel === 'r') {
			wherePoblacion.departamento_id = { [Op.ne]: null };
			group_by = 'region_id'
		}

		let poblacion;
		try {
			poblacion = await Poblacion.findAll({
				attributes: [[Sequelize.fn('SUM', Sequelize.col('cantidad_hombres')), 'hombres'], [Sequelize.fn('SUM', Sequelize.col('cantidad_mujeres')), 'mujeres']],
				where: wherePoblacion,
				group: group_by,
				include: [{
					model: Departamento,
					as: 'departamento',
					attributes: ['id', 'nombre'],
					where: whereDepartamento,
					required: false,
					include: [{
						model: Region,
						as: 'region',
						attributes: ['id', 'nombre'],
						required: false
					}]
				}, {
					model: Ciudad,
					as: 'ciudad',
					attributes: ['id', 'nombre'],
					required: false,
				}],
				order: [
					[{ model: Departamento, as: 'departamento' }, 'nombre', 'ASC'],
					[{ model: Ciudad, as: 'ciudad' }, 'nombre', 'ASC']
				]
			});
		}
		catch (error) {
			return res.status(400).send({id:'error1', err: error});
		}

		delete wherePoblacion.edad_desde;
		delete wherePoblacion.edad_hasta;

		let poblacion_total;
		try {
			poblacion_total = await Poblacion.findAll({
				attributes: [[Sequelize.fn('SUM', Sequelize.col('cantidad_hombres')), 'hombres'], [Sequelize.fn('SUM', Sequelize.col('cantidad_mujeres')), 'mujeres']],
				where: wherePoblacion,
				group: group_by,
				include: [{
					model: Departamento,
					as: 'departamento',
					attributes: ['id', 'nombre'],
					where: whereDepartamento,
					required: false,
					include: [{
						model: Region,
						as: 'region',
						attributes: ['id', 'nombre'],
						required: false
					}]
				}, {
					model: Ciudad,
					as: 'ciudad',
					attributes: ['id', 'nombre'],
					required: false,
				}],
				order: [
					[{ model: Departamento, as: 'departamento' }, 'nombre', 'ASC'],
					[{ model: Ciudad, as: 'ciudad' }, 'nombre', 'ASC']
				]
			});
		}
		catch (error) {
			return res.status(400).send('error2');
		}

		let poblacion_pais;
		try {
			poblacion_pais = await Poblacion.findAll({
				attributes: [[Sequelize.fn('SUM', Sequelize.col('cantidad_hombres')), 'hombres'], [Sequelize.fn('SUM', Sequelize.col('cantidad_mujeres')), 'mujeres']],
				where: wherePoblacionPais
			});
		}
		catch (error) {
			return res.status(400).send('error2');
		}


		let id, nombre, hombres, mujeres, hombres_lugar, mujeres_lugar, i;

		for (const p in poblacion) {
			hombres = poblacion[p].hombres;
			mujeres = poblacion[p].mujeres;

			if (poblacion[p].ciudad !== null) {
				nombre = poblacion[p].ciudad.nombre;
				id = poblacion[p].ciudad.nombre;
				data.push({ id: id, nombre: nombre, hombres: hombres, mujeres: mujeres, total_hombres: 0, total_mujeres: 0, i: 0 });
			}
			else if (poblacion[p].departamento !== null) {
				if (nivel === 'r') {
					id = poblacion[p].departamento.region.nombre;
					nombre = poblacion[p].departamento.region.nombre;
				}
				else {
					id = poblacion[p].departamento.nombre;
					nombre = poblacion[p].departamento.nombre;
				}
				data.push({ id: id, nombre: nombre, hombres: hombres, mujeres: mujeres, total_hombres: 0, total_mujeres: 0, ih: 0, im: 0 });
			}
		}


		for (const pt in poblacion_pais) {
			hombres = poblacion_pais[pt].hombres;
			mujeres = poblacion_pais[pt].mujeres;

			for (const d in data) {

				data[d].total_hombres = hombres;
				data[d].total_mujeres = mujeres;

				if (hombres !== 0) {
					data[d].ih = ((data[d].hombres / hombres) * 100).toFixed(2);
				}
				if (mujeres !== 0) {
					data[d].im = ((data[d].mujeres / mujeres) * 100).toFixed(2);
				}
			}
		}

		/*
		id = 0;
		for (const pt in poblacion_total) {
			hombres = poblacion_total[pt].hombres;
			mujeres = poblacion_total[pt].mujeres;

			if (poblacion_total[pt].ciudad !== null) {
				nombre = poblacion_total[pt].ciudad.nombre;
				id = poblacion_total[pt].ciudad.nombre;
			}
			else if (poblacion_total[pt].departamento !== null) {
				if (nivel === 'r') {
					id = poblacion_total[pt].departamento.region.nombre;
				}
				else {
					id = poblacion_total[pt].departamento.nombre;
				}
			}

			for (const d in data) {
				if (data[d].id === id) {

					data[d].total_hombres = hombres;
					data[d].total_mujeres = mujeres;

					if (hombres !== 0) {
						data[d].ih = ((data[d].hombres / hombres) * 100).toFixed(2);
					}
					if (mujeres !== 0) {
						data[d].im = ((data[d].mujeres / mujeres) * 100).toFixed(2);
					}

				}
			}
		}
		*/

		res.send({
			data: data
		});
	}
	else {
		console.log(error);
		res.status(500).send('Error de validación. <br> - Todos los campos son obligatorios.');
	}
}

module.exports = {
	reportePoblacion: reportePoblacion
}
