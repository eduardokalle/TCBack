const { listar } = require('./utils/listar');

const tiempo_dedicacion_listar = async (req, res) => {
    listar(req, res);
}

module.exports = { 
	listar: tiempo_dedicacion_listar
}
