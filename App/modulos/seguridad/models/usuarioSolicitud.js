const { sequelize, Sequelize } = require('../../../config');
const { Usuario } = require('./usuario');
const { Programa } = require('../../educacion/models/programa');

const UsuarioSolicitud = sequelize.define('usuario_programa_solicitud', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	programa_id: {
		field: 'programa_id',
		type: Sequelize.INTEGER
	},
	fecha: {
		field: 'fecha',
		type: Sequelize.DATE
	}
}, {
	timestamps: false,
	freezeTableName: true 
});

UsuarioSolicitud.belongsTo(Programa, {
	as: 'programa',
	foreignKey: 'programa_id'
});

UsuarioSolicitud.belongsTo(Usuario, {
	as: 'usuario',
	foreignKey: 'usuario_id'
});

module.exports = {
    UsuarioSolicitud
}