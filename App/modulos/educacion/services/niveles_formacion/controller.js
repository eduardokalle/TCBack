const { NivelFormacion } = require('../../models/nivelFormacion');

const niveles_formacion = async (req, res) => {

	const pregrados = await NivelFormacion.findAll({
		attributes: ['id', 'nombre'],
		where: {
    	es_pregrado: 1
  	},
  	order: [['nombre', 'ASC']]
	});

	const posgrados = await NivelFormacion.findAll({
		attributes: ['id', 'nombre'],
		where: {
	    	es_pregrado: 0
	  	},
  		order: [['nombre', 'ASC']]
	});

	let categorias = [ {'nombre': 'Pregrado', 'subniveles': pregrados}, 
						{'nombre': 'Posgrado', 'subniveles': posgrados} ];

	res.send({
		niveles_formacion: categorias
	});
}

module.exports = {
	niveles_formacion
}