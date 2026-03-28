const { listar } = require('./utils/listar');
const { crear } = require('./utils/crear');
const { editar } = require('./utils/editar');
const { borrar } = require('./utils/borrar');
const { detalle } = require('./utils/detalle');
const { cargar } = require('./utils/cargar');

const programa_listar = async (req, res) => {
    listar(req, res);
}

const programa_crear = async (req, res) => {
    crear(req, res);
}

const programa_editar = async (req, res) => {
    editar(req, res);
}

const programa_borrar = async (req, res) => {
    borrar(req, res);
}

const programa_detalle = async (req, res) => {
    detalle(req, res);
}

const programa_cargar = async (req, res) => {
	cargar(req, res);
}

module.exports = { 
	listar: programa_listar,
	crear: programa_crear,
	editar: programa_editar,
	borrar: programa_borrar,
	detalle: programa_detalle,
	cargar: programa_cargar
}
