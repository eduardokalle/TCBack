const { listar } = require('./utils/listar');
const { crear } = require('./utils/crear');
const { editar } = require('./utils/editar');
const { borrar } = require('./utils/borrar');
const { detalle } = require('./utils/detalle');

const dato_curioso_listar = async (req, res) => {
    listar(req, res);
}

const dato_curioso_crear = async (req, res) => {
    crear(req, res);
}

const dato_curioso_editar = async (req, res) => {
    editar(req, res);
}

const dato_curioso_borrar = async (req, res) => {
    borrar(req, res);
}

const dato_curioso_detalle = async (req, res) => {
    detalle(req, res);
}

module.exports = { 
	listar: dato_curioso_listar,
	crear: dato_curioso_crear,
	editar: dato_curioso_editar,
	borrar: dato_curioso_borrar,
	detalle: dato_curioso_detalle
}
