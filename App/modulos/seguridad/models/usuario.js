const { sequelize, Sequelize } = require('../../../config');
const { Rol } = require('./rol');
const { Ciudad } = require('../../poblacion/models/ciudad');

const Usuario = sequelize.define('usuario', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	ciudad_id: {
		field: 'ciudad_id',
		type: Sequelize.INTEGER,
	},
	rol_id: {
		field: 'rol_id',
		type: Sequelize.INTEGER,
	},
	nombre: {
		field: 'nombre',
		type: Sequelize.STRING
	},
	apellido: {
		field: 'apellido',
		type: Sequelize.STRING
	},
	alias: {
		field: 'alias',
		type: Sequelize.STRING
	},
	email: {
		field: 'email',
		type: Sequelize.STRING
	},
	contrasena: {
		field: 'contrasena',
		type: Sequelize.STRING
	},
	fecha_nacimiento: {
		field: 'fecha_nacimiento',
		type: Sequelize.DATEONLY	
	},
	fecha_registro: {
		field: 'fecha_registro',
		type: Sequelize.DATEONLY	
	},
	celular: {
		field: 'celular',
		type: Sequelize.STRING	
	},
	estado: {
		field: 'estado',
		type: Sequelize.INTEGER	
	},
	reset_token: {
		field: 'reset_token',
		type: Sequelize.STRING	
	},
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE,
	deletedAt: Sequelize.DATE,
}, {
	freezeTableName: true, 
	timestamps: true,
	paranoid: true,
});

Usuario.belongsTo(Ciudad, {
	as: 'ciudad',
	foreignKey: 'ciudad_id'
});

Usuario.belongsTo(Rol, {
	as: 'rol',
	foreignKey: 'rol_id'
});

module.exports = {
    Usuario
}