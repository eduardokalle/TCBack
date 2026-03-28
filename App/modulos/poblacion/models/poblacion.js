const { sequelize, Sequelize } = require('../../../config');
const { Ciudad } = require('./ciudad');
const { Departamento } = require('./departamento');

const Poblacion = sequelize.define('poblacion', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	departamento_id: {
		field: 'departamento_id',
		type: Sequelize.INTEGER
	},
	ciudad_id: {
		field: 'ciudad_id',
		type: Sequelize.INTEGER
	},
	anno: {
		field: 'anno',
		type: Sequelize.SMALLINT
	},
	edad_desde: {
		field: 'edad_desde',
		type: Sequelize.TINYINT
	},
	edad_hasta: {
		field: 'edad_hasta',
		type: Sequelize.TINYINT
	},
	hombres: {
		field: 'cantidad_hombres',
		type: Sequelize.SMALLINT
	},
	mujeres: {
		field: 'cantidad_mujeres',
		type: Sequelize.SMALLINT
	}
}, {
	timestamps: false,
	freezeTableName: true
});

Poblacion.belongsTo(Departamento, {
	as: 'departamento',
	foreignKey: 'departamento_id'
});

Poblacion.belongsTo(Ciudad, {
	as: 'ciudad',
	foreignKey: 'ciudad_id'
});

module.exports = {
	Poblacion
}