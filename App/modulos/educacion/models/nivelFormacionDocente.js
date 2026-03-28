const { sequelize, Sequelize } = require('../../../config.js');

const NivelFormacionDocente = sequelize.define('nivel_formacion_docente', {
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
	NivelFormacionDocente
}