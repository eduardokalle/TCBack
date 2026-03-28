const { sequelize, Sequelize } = require('../../../config.js');

const TiempoDedicacion = sequelize.define('tiempo_dedicacion', {
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
	ponderacion: {
		field: 'ponderacion',
		type: Sequelize.FLOAT
	}
}, {
	freezeTableName: true,
	timestamps: false
});

module.exports = {
	TiempoDedicacion
}