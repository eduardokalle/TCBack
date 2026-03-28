const { sequelize, Sequelize } = require('../../../config.js');
const { Programa } = require('./programa');

const ProgramaPeriodo = sequelize.define('programa_periodo', {
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
	anno: {
		field: 'anno',
		type: Sequelize.INTEGER
	},
	periodo: {
		field: 'periodo',
		type: Sequelize.INTEGER
	},
	valorMatricula: {
		field: 'valor_matricula',
		type: Sequelize.INTEGER
	},
	cupos: {
		field: 'cupos',
		type: Sequelize.INTEGER
	},
	postulados_hombres: {
		field: 'postulados_hombres',
		type: Sequelize.INTEGER
	},
	postulados_mujeres: {
		field: 'postulados_mujeres',
		type: Sequelize.INTEGER
	},
	admitidos_hombres: {
		field: 'admitidos_hombres',
		type: Sequelize.INTEGER
	},
	admitidos_mujeres: {
		field: 'admitidos_mujeres',
		type: Sequelize.INTEGER
	},
	matriculados_hombres: {
		field: 'matriculados_hombres',
		type: Sequelize.INTEGER
	},
	matriculados_mujeres: {
		field: 'matriculados_mujeres',
		type: Sequelize.INTEGER
	},
	estudiantes_hombres: {
		field: 'estudiantes_hombres',
		type: Sequelize.INTEGER
	},
	estudiantes_mujeres: {
		field: 'estudiantes_mujeres',
		type: Sequelize.INTEGER
	},
	graduados_hombres: {
		field: 'graduados_hombres',
		type: Sequelize.INTEGER
	},
	graduados_mujeres: {
		field: 'graduados_mujeres',
		type: Sequelize.INTEGER
	}
}, {
	freezeTableName: true,
	timestamps: false
});

Programa.hasMany(ProgramaPeriodo, {
	as: 'periodos',
	foreignKey: 'programa_id'
});

ProgramaPeriodo.belongsTo(Programa, {
	as: 'programa',
	foreignKey: 'programa_id'
});

module.exports = {
	ProgramaPeriodo
}