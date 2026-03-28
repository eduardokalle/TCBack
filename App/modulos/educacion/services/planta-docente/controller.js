const { listar } = require('./utils/listar');
const { crear } = require('./utils/crear');
const { editar } = require('./utils/editar');
const { borrar } = require('./utils/borrar');
const { detalle } = require('./utils/detalle');
const { cargar } = require('./utils/cargar');

const planta_docente_listar = async (req, res) => {
    listar(req, res);
}

const planta_docente_crear = async (req, res) => {
    crear(req, res);
}

const planta_docente_editar = async (req, res) => {
    editar(req, res);
}

const planta_docente_borrar = async (req, res) => {
    borrar(req, res);
}

const planta_docente_detalle = async (req, res) => {
    detalle(req, res);
}

const planta_docente_cargar = async (req, res) => {
	cargar(req, res);
}

module.exports = { 
	listar: planta_docente_listar,
	crear: planta_docente_crear,
	editar: planta_docente_editar,
	borrar: planta_docente_borrar,
	detalle: planta_docente_detalle,
	cargar: planta_docente_cargar
}
