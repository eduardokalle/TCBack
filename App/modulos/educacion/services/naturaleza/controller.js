const { Naturaleza } = require('../../models/naturaleza');

const naturaleza = async (req, res) => {

	const naturaleza = await Naturaleza.findAll({
		attributes: ['id', 'nombre'],
		order: [['nombre', 'ASC']]
	});

	res.send({
		naturaleza: naturaleza
	})
}

module.exports = {
	naturaleza
}
