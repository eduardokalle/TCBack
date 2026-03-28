const { todas } = require('./utils/todas');
const { titulares } = require('./utils/titulares');
const { listarTipo } = require('./utils/listarTipo');
const { listar } = require('./utils/listar');
const { crear } = require('./utils/crear');
const { editar } = require('./utils/editar');
const { borrar } = require('./utils/borrar');
const { detalle } = require('./utils/detalle');

const instituciones = async (req, res) => {
	todas(req.body, res);
}

const instituciones_titulares = async (req, res) => {
	titulares(req.body, res);
}

const institucion_tipo_listar = async (req, res) => {
    listarTipo(req, res);
}

const institucion_listar = async (req, res) => {
    listar(req, res);
}

const institucion_crear = async (req, res) => {
    crear(req, res);
}

const institucion_editar = async (req, res) => {
    editar(req, res);
}

const institucion_borrar = async (req, res) => {
    borrar(req, res);
}

const institucion_detalle = async (req, res) => {
    detalle(req, res);
}


module.exports = { 
	instituciones,
	institucionesTitulares: instituciones_titulares,
	listarTipo: institucion_tipo_listar,
	listar: institucion_listar,
	crear: institucion_crear,
	editar: institucion_editar,
	borrar: institucion_borrar,
	detalle: institucion_detalle,
}
