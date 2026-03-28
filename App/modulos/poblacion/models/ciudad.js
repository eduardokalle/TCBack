const { sequelize, Sequelize } = require('../../../config');

const Ciudad = sequelize.define('ciudad', {
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
	timestamps: false,
	freezeTableName: true
});


module.exports = {
	Ciudad
}