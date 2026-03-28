const { sequelize, Sequelize } = require('../../../config');
const { NucleoConocimiento } = require('./nucleoConocimiento');

const AreaConocimiento = sequelize.define('area_conocimiento', {
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

AreaConocimiento.hasMany(NucleoConocimiento, {
	as: 'nucleos', 
	foreignKey: 'area_conocimiento_id'
});

NucleoConocimiento.belongsTo(AreaConocimiento, {
	as: 'area',
	foreignKey: 'area_conocimiento_id'
});

module.exports = {
    AreaConocimiento
}