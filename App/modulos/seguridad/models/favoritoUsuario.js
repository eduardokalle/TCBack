const { sequelize, Sequelize } = require('../../../config');
const { Usuario } = require('./usuario');

const FavoritoUsuario = sequelize.define('favorito_usuario', {
	id: {
		primaryKey: true,
		field: 'id',
		type: Sequelize.INTEGER,
		autoIncrement: true
	},
	fecha: {
		field: 'fecha',
		type: Sequelize.DATE
	}
}, {
	timestamps: false,
	freezeTableName: true 
});

FavoritoUsuario.belongsTo(Usuario, {
	as: 'usuario',
	foreignKey: 'usuario_id'
});


module.exports = {
    FavoritoUsuario
}