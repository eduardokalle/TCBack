const { sequelize, Sequelize } = require('../../../config');
const { Ciudad } = require('./ciudad');

const Departamento = sequelize.define('departamento', {
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

Departamento.hasMany(Ciudad, {
	as: 'municipios', 
	foreignKey: 'departamento_id'
});

Ciudad.belongsTo(Departamento, {
	foreignKey: 'departamento_id'
});

module.exports = {
	Departamento
}