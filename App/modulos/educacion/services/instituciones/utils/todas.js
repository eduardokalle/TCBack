const { Institucion } = require('../../../models/institucion');
const { Ciudad } = require('../../../../poblacion/models/ciudad');
const { Departamento } = require('../../../../poblacion/models/departamento');
const { Sequelize } = require('../../../../../config');
const Op = Sequelize.Op;

const todas = async (req, res) => {

	const instituciones = await Institucion.findAll({
		attributes: ['id', 'nombre', 'sector', 'sede_titular', 'codigo_snies'],
		include: [{
			model: Ciudad,
			as: 'ciudad',
			attributes: ['id', 'nombre'],
			include: [{
				model: Departamento,
				as: 'departamento',
				attributes: ['id', 'nombre', 'region_id']
			}],
		}],
		order: [['nombre', 'ASC']]
	});

	let data = [];
	for (const i in instituciones) {
		data.push({
			id: instituciones[i].id,
			nombre: `${ instituciones[i].nombre } sede ${ instituciones[i].ciudad.nombre }`,
			sede_titular: instituciones[i].sede_titular,
			sector: instituciones[i].sector,
			municipio: instituciones[i].ciudad.id,
			departamento: instituciones[i].ciudad.departamento.id,
			region: instituciones[i].ciudad.departamento.region_id,
			codigo_snies: instituciones[i].codigo_snies,
		});
	}

	res.send({
		instituciones: data
	});
}

module.exports = {
    todas: todas
}