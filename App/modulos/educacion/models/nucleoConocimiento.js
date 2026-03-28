const { sequelize, Sequelize } = require('../../../config.js');

const NucleoConocimiento = sequelize.define('nucleo_conocimiento', {
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
    NucleoConocimiento
}