const { sequelize, Sequelize } = require('../../../config');
const { Permiso } = require('./permiso');

const UrlRestringida = sequelize.define('url_restringida', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	url: {
		field: 'url',
		type: Sequelize.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true 
});

UrlRestringida.hasMany(Permiso, {
	as: 'permisos',
	foreignKey: 'url_restringida_id'
});

module.exports = {
    UrlRestringida
}