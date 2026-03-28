const { sequelize, Sequelize } = require('../../../config.js');
const { EntradaCategoria } = require('./entradaCategoria');

const EntradaTipo = sequelize.define('entrada_tipo', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoincrement: true
	}
}, {
	timestamps: false,
	freezeTableName: true 
});

EntradaTipo.hasMany(EntradaCategoria, {
	as: 'categorias', 
	foreignKey: 'entrada_tipo_id', 
});

module.exports = {
    EntradaTipo
}