const { sequelize, Sequelize } = require('../../../config.js');

const Caracter = sequelize.define('caracter', {
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
	timestamps: false,
	paranoid: true,
});

module.exports = {
	Caracter
}