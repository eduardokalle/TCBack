const { listar } = require('./utils/listar');
const { borrar } = require('./utils/borrar');

const programa_favorito_listar = async (req, res) => {
    listar(req, res);
}

const programa_favorito_borrar = async (req, res) => {
    borrar(req, res);
}

module.exports = { 
	listar: programa_favorito_listar,
	borrar: programa_favorito_borrar,
}
