const { listar } = require('./utils/listar');
const { borrar } = require('./utils/borrar');

const programa_solicitud_listar = async (req, res) => {
    listar(req, res);
}

const programa_solicitud_borrar = async (req, res) => {
    borrar(req, res);
}

module.exports = { 
	listar: programa_solicitud_listar,
	borrar: programa_solicitud_borrar,
}
