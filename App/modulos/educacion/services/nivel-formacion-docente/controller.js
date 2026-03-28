const { listar } = require('./utils/listar');

const nivel_formacion_docente_listar = async (req, res) => {
    listar(req, res);
}

module.exports = { 
	listar: nivel_formacion_docente_listar
}
