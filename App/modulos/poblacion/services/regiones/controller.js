const { Region } = require('../../models/region');
const { Departamento } = require('../../models/departamento');
const { Ciudad } = require('../../models/ciudad');

const regiones = async (req, res) => {
	const regiones = await Region.findAll({
		attributes: ['id', 'nombre'],
		include: [{
			model: Departamento,
			as: 'departamentos',
			attributes: ['id', 'nombre'],
			include: [{
				model: Ciudad,
				as: 'municipios',
				attributes: ['id', 'nombre']
			}]
		}],
  		order: [
			[ { model: Departamento, as: 'departamentos'}, 'nombre', 'ASC' ],
			[ { model: Departamento, as: 'departamentos'}, { model: Ciudad, as: 'municipios'}, 'nombre', 'ASC' ]
 		]
	});

	res.send({
		regiones: regiones
	});
}

module.exports = {
	regiones
}