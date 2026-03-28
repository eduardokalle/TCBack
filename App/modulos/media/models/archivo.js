const { sequelize, Sequelize } = require('../../../config.js');
const { Usuario } = require('../../seguridad/models/usuario');

const Archivo = sequelize.define('archivo', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoincrement: true
	},
	url: {
		field: 'url',
		type: Sequelize.STRING
	},
}, {
	timestamps: false,
	freezeTableName: true 
});

Archivo.belongsTo(Usuario, {
	as: 'usuario', 
	foreignKey: 'usuario_id', 
});

module.exports = {
    Archivo
}