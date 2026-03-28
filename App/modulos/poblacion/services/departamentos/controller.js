const { Departamento } = require('../../models/departamento');
const { Ciudad } = require('../../models/ciudad');

const { cargar } = require('./utils/cargar');

const departamentos = async (req, res) => {
	const departamentos = await Departamento.findAll({
		attributes: ['id', 'nombre'],
		include: [{
				model: Ciudad,
				as: 'municipios',
				attributes: ['id', 'nombre']
		}],
  		order: [
			[ 'nombre', 'ASC' ],
			[ { model: Ciudad, as: 'municipios'}, 'nombre', 'ASC' ]
 		]
	});

	res.send({
		departamentos: departamentos
	});
}

const poblacion_cargar = async (req, res) => {
	cargar(req, res);
}

module.exports = {
	departamentos: departamentos,
	cargar: poblacion_cargar
}