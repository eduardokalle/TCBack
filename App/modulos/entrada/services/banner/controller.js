const { listar } = require('./utils/listar');
const { crear } = require('./utils/crear');
const { editar } = require('./utils/editar');
const { borrar } = require('./utils/borrar');
const { detalle } = require('./utils/detalle');

const banner_listar = async (req, res) => {
    listar(req, res);
}

const banner_crear = async (req, res) => {
    crear(req, res);
}

const banner_editar = async (req, res) => {
    editar(req, res);
}

const banner_borrar = async (req, res) => {
    borrar(req, res);
}

const banner_detalle = async (req, res) => {
    detalle(req, res);
}

module.exports = { 
	listar: banner_listar,
	crear: banner_crear,
	editar: banner_editar,
	borrar: banner_borrar,
	detalle: banner_detalle
}
