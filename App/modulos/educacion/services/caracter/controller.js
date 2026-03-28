const { Caracter } = require('../../models/caracter');

const caracter = async (req, res) => {

	const caracter = await Caracter.findAll({
		attributes: ['id', 'nombre'],
		order: [['nombre', 'ASC']]
	});

	res.send({
		caracter: caracter
	})
}

module.exports = {
	caracter
}
