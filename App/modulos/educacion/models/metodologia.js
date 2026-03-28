const { sequelize, Sequelize } = require('../../../config');

const Metodologia = sequelize.define('metodologia', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	nombre: {
		field: 'nombre',
		type: Sequelize.STRING
	}
}, {
	freezeTableName: true,
	timestamps: false
});

module.exports = {
	Metodologia
}