const { sequelize, Sequelize } = require('../../../config');

const NivelFormacion = sequelize.define('nivel_formacion', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	nombre: {
		field: 'nombre',
		type: Sequelize.STRING
	},
	es_pregrado: {
		field: 'es_pregrado',
		type: Sequelize.TINYINT
	}
}, {
	timestamps: false,
	freezeTableName: true
});

module.exports = {
	NivelFormacion
}