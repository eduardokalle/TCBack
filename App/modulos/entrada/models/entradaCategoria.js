const { sequelize, Sequelize } = require('../../../config.js');

const EntradaCategoria = sequelize.define('entrada_categoria', {
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

module.exports = {
    EntradaCategoria
}