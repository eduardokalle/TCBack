const { crear } = require('./utils/crear');
const { borrar } = require('./utils/borrar');

const delegado_crear = async (req, res) => {
    crear(req, res);
}

const delegado_borrar = async (req, res) => {
    borrar(req, res);
}

module.exports = { 
	crear: delegado_crear,
	borrar: delegado_borrar,
}
