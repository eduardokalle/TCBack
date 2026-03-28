const { sequelize, Sequelize } = require('../../../config.js');
const { Institucion } = require('./institucion');
const { TiempoDedicacion } = require('./tiempoDedicacion');
const { NivelFormacionDocente } = require('./nivelFormacionDocente');

const PlantaDocente = sequelize.define('planta_docente', {
	id: {
		primaryKey: true,
		field: 'id', 
		type: Sequelize.INTEGER, 
		autoIncrement: true
	}, 
	anno: {
		field: 'anno',
		type: Sequelize.INTEGER
	}, 
	hombres: {
		field: 'cantidad_hombres',
		type: Sequelize.STRING
	}, 
	mujeres: {
		field: 'cantidad_mujeres',
		type: Sequelize.STRING
	}, 
	total: {
		field: 'cantidad_total',
		type: Sequelize.STRING
	}
}, {
	freezeTableName: true,
	timestamps: false
});

Institucion.hasMany(PlantaDocente, {
	as: 'planta_docente',
	foreignKey: 'institucion_id'
});

PlantaDocente.belongsTo(Institucion, {
	as: 'institucion',
	foreignKey: 'institucion_id'
});

PlantaDocente.belongsTo(TiempoDedicacion, {
	as: 'tiempo_dedicacion',
	foreignKey: 'tiempo_dedicacion_id'
});

PlantaDocente.belongsTo(NivelFormacionDocente, {
	as: 'nivel_formacion_docente',
	foreignKey: 'nivel_formacion_docente_id'
});

module.exports = {
	PlantaDocente
}