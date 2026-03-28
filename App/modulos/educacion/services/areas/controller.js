const { AreaConocimiento } = require('../../models/areaConocimiento');
const { NucleoConocimiento } = require('../../models/nucleoConocimiento');

const areas = async (req, res) => {
	const areas = await AreaConocimiento.findAll({
		attributes: ['id', 'nombre'],
		include: [{
			model: NucleoConocimiento, 
			as: 'nucleos', 
			attributes: ['id', 'nombre']
		}],
		order: [
			['nombre', 'ASC'],
			[{ model: NucleoConocimiento, as: 'nucleos' }, 'nombre', 'ASC']
		]
	});

	res.send({
       	areas: areas
	});
}

module.exports = {
	areas
} 