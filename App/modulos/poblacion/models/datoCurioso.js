const { sequelize, Sequelize } = require('../../../config');
const { Ciudad } = require('./ciudad');
const { Departamento } = require('./departamento');
const { NucleoConocimiento } = require('../../educacion/models/nucleoConocimiento');

const DatoCurioso = sequelize.define('dato_curioso', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	texto: {
		field: 'texto',
		type: Sequelize.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true
});


DatoCurioso.belongsTo(Departamento, {
	foreignKey: 'departamento_id'
});

DatoCurioso.belongsTo(Ciudad, {
	foreignKey: 'ciudad_id'
});

DatoCurioso.belongsTo(NucleoConocimiento, {
	foreignKey: 'nucleo_conocimiento_id'
});


module.exports = {
	DatoCurioso
}