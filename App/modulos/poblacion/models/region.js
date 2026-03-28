const { sequelize, Sequelize } = require('../../../config');
const { Departamento } = require('./departamento');

const Region = sequelize.define('region', {
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

Region.hasMany(Departamento, {
	as: 'departamentos',
	foreignKey: 'region_id'
});

Departamento.belongsTo(Region, {
	foreignKey: 'region_id'
});

module.exports = {
	Region
}