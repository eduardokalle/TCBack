const { Metodologia } = require('../../models/metodologia');

const metodologias = async (req, res) => {

	const metodologias = await Metodologia.findAll({
		attributes: ['id', 'nombre'],
		order: [['nombre', 'ASC']]
	});

	res.send({
		metodologias: metodologias
	})
}

module.exports = {
	metodologias
}
