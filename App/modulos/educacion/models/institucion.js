const { sequelize, Sequelize } = require('../../../config.js');
const { Ciudad } = require('../../poblacion/models/ciudad');
const { Usuario } = require('../../seguridad/models/usuario');
const { Caracter } = require('./caracter');
const { Naturaleza } = require('./naturaleza');
const { Archivo } = require('../../media/models/archivo');

const Institucion = sequelize.define('institucion', {
	id: {
		primaryKey: true,
		field: 'id', 
		type: Sequelize.INTEGER, 
		autoIncrement: true
	}, 
	nombre: {
		field: 'nombre',
		type: Sequelize.STRING
	}, 
	sector: {
		field: 'sector',
		type: Sequelize.STRING
	},
	acreditacion: {
		field: 'acreditacion',
		type: Sequelize.INTEGER
	},
	codigo_snies: {
		field: 'codigo_snies',
		type: Sequelize.STRING
	},
	es_principal: {
		field: 'es_principal',
		type: Sequelize.INTEGER
	},
	sede_titular: {
		field: 'sede_titular',
		type: Sequelize.INTEGER
	},
	fecha_registro: {
		field: 'fecha_registro',
		type: Sequelize.DATE
	},
	telefono_contacto: {
		field: 'telefono_contacto',
		type: Sequelize.STRING
	},
	direccion_domicilio: {
		field: 'direccion_domicilio',
		type: Sequelize.STRING
	},
	programas_vigentes: {
		field: 'programas_vigentes',
		type: Sequelize.INTEGER
	},
	fecha_acreditacion: {
		field: 'fecha_acreditacion',
		type: Sequelize.DATE
	},
	resolucion_acreditacion: {
		field: 'resolucion_acreditacion',
		type: Sequelize.STRING
	},
	vigencia_acreditacion: {
		field: 'vigencia_acreditacion',
		type: Sequelize.INTEGER
	},
	url_web: {
		field: 'url_web',
		type: Sequelize.STRING
	},
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE,
	deletedAt: Sequelize.DATE,
}, {
	freezeTableName: true,
	timestamps: true,
	paranoid: true,
	//timestamps: false
});

Institucion.belongsTo(Archivo, {
	as: 'imagen', 
	foreignKey: 'imagen_id', 
});

Institucion.belongsTo(Ciudad, {
	as: 'ciudad',
	foreignKey: 'ciudad_id'
});

Institucion.belongsTo(Caracter, {
	as: 'caracter',
	foreignKey: 'caracter_id'
});

Institucion.belongsTo(Naturaleza, {
	as: 'naturaleza',
	foreignKey: 'naturaleza_id'
});

Institucion.hasMany(Usuario, {
	as: 'delegado',
	foreignKey: 'institucion_id'
});

module.exports = {
	Institucion
}