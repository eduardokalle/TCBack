const { sequelize, Sequelize } = require('../../../config.js');
const { EntradaTipo } = require('./entradaTipo');
const { EntradaCategoria } = require('./entradaCategoria');
const { Archivo } = require('../../media/models/archivo');

const Entrada = sequelize.define('entrada', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoincrement: true
	},
	fecha: {
		field: 'fecha',
		type: Sequelize.DATE
	},
	titulo: {
		field: 'titulo',
		type: Sequelize.STRING
	}, 
	resumen: {
		field: 'resumen',
		type: Sequelize.STRING
	}, 
	texto: {
		field: 'texto',
		type: Sequelize.STRING
	},
	destacada: {
		field: 'destacada',
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

Entrada.belongsTo(Archivo, {
	as: 'imagen', 
	foreignKey: 'imagen_id', 
});

Entrada.belongsTo(EntradaTipo, {
	as: 'tipo', 
	foreignKey: 'entrada_tipo_id', 
});

Entrada.belongsTo(EntradaCategoria, {
	as: 'categoria', 
	foreignKey: 'entrada_categoria_id', 
});

EntradaTipo.hasMany(Entrada, {
	as: 'entradas', 
	foreignKey: 'entrada_tipo_id', 
});

module.exports = {
    Entrada
}