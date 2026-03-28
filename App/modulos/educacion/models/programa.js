const { sequelize, Sequelize } = require('../../../config.js');
const { Institucion } = require('./institucion');
const { NivelFormacion } = require('./nivelFormacion');
const { Metodologia } = require('./metodologia');
const { NucleoConocimiento } = require('./nucleoConocimiento');
const { FavoritoUsuario } = require('../../seguridad/models/favoritoUsuario');

const Programa = sequelize.define('programa', {
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
	institucion_id: {
		field: 'institucion_id',
		type: Sequelize.INTEGER
	},
	metodologia_id: {
		field: 'metodologia_id',
		type: Sequelize.INTEGER
	},
	nivel_formacion_id: {
		field: 'nivel_formacion_id',
		type: Sequelize.INTEGER
	},
	nucleo_conocimiento_id: {
		field: 'nucleo_conocimiento_id',
		type: Sequelize.INTEGER
	},
	codigo_snies: {
		field: 'codigo_snies',
		type: Sequelize.STRING
	},
	nivel_academico: {
		field: 'nivel_academico',
		type: Sequelize.STRING
	},
	estado: {
		field: 'estado',
		type: Sequelize.INTEGER
	},
	duracion_programa: {
		field: 'duracion_programa',
		type: Sequelize.INTEGER
	},
	ciclos_propedeuticos: {
		field: 'ciclos_propedeuticos',
		type: Sequelize.INTEGER
	},
	titulo: {
		field: 'titulo',
		type: Sequelize.STRING
	},
	codigo_icfes: {
		field: 'codigo_icfes',
		type: Sequelize.STRING
	},
	creditos: {
		field: 'creditos',
		type: Sequelize.INTEGER
	},
	url_pensum: {
		field: 'url_pensum',
		type: Sequelize.STRING
	},
	url_web: {
		field: 'url_web',
		type: Sequelize.STRING
	},
	acreditacion: {
		field: 'acreditacion',
		type: Sequelize.INTEGER
	},
	duracion_periodo: {
		field: 'duracion_periodo',
		type: Sequelize.STRING
	},
	valor_matricula: {
		field: 'valor_matricula',
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

Programa.belongsTo(Institucion, {
	as: 'institucion',
	foreignKey: 'institucion_id'
});

Institucion.hasMany(Programa, {
	as: 'programas',
	foreignKey: 'institucion_id'
});

Programa.belongsTo(NivelFormacion, {
	as: 'nivel_formacion',
	foreignKey: 'nivel_formacion_id'
});

Programa.belongsTo(Metodologia, {
	as: 'metodologia',
	foreignKey: 'metodologia_id'
});

Programa.belongsTo(NucleoConocimiento, {
	as: 'nucleo_conocimiento',
	foreignKey: 'nucleo_conocimiento_id'
});

Programa.hasMany(FavoritoUsuario, {
	as: 'favoritos',
	foreignKey: 'programa_id'
});

FavoritoUsuario.belongsTo(Programa, {
	as: 'programa',
	foreignKey: 'programa_id'
});

module.exports = {
	Programa
}