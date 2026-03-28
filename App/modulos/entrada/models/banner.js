const { sequelize, Sequelize } = require('../../../config.js');
const { Archivo } = require('../../media/models/archivo');

const Banner = sequelize.define('banner', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoincrement: true
	},
	titulo: {
		field: 'titulo',
		type: Sequelize.STRING
	}, 
	link: {
		field: 'link',
		type: Sequelize.STRING
	},
	estado: {
		field: 'estado',
		type: Sequelize.INTEGER
	},
	palabrasClave: {
		field: 'palabras_clave',
		type: Sequelize.JSON
	}
}, {
	timestamps: false,
	freezeTableName: true 
});

Banner.belongsTo(Archivo, {
	as: 'imagen', 
	foreignKey: 'imagen_id', 
});

module.exports = {
    Banner
}