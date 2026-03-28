const { sequelize, Sequelize } = require('../../../config');
const { Rol } = require('./rol');
const { UrlRestringida } = require('./urlRestringida');

const Permiso = sequelize.define('permiso', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	rol_id: {
		field: 'rol_id',
		type: Sequelize.INTEGER,
	},
	url_id: {
		field: 'url_restringida_id',
		type: Sequelize.INTEGER,
	},
	metodo: {
		field: 'metodo',
		type: Sequelize.BOOLEAN
	},
	verificar: {
		field: 'verificar',
		type: Sequelize.BOOLEAN
	}
}, {
	timestamps: false,
	freezeTableName: true 
});

Permiso.belongsTo(Rol, {
	as: 'rol',
	foreignKey: 'rol_id'
});

module.exports = {
    Permiso
}