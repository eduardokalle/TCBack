const { reporteCobertura } = require('./utils/reporteCobertura');
const { reporteDistribucion } = require('./utils/reporteDistribucion');
const { reporteNuevos } = require('./utils/reporteNuevos');
const { reportePoblacion } = require('./utils/reportePoblacion');
const { reporteDocentes } = require('./utils/reporteDocentes');

const reporte_cobertura = async (req, res) => {
	reporteCobertura(req.body, res);
}

const reporte_distribucion = async (req, res) => {
	reporteDistribucion(req.body, res);
}

const reporte_nuevos = async (req, res) => {
	reporteNuevos(req.body, res);
}

const reporte_poblacion = async (req, res) => {
	reportePoblacion(req.body, res);
}

const reporte_docentes = async (req, res) => {
	reporteDocentes(req.body, res);
}

module.exports = {
	reporte_cobertura: reporte_cobertura,
	reporte_distribucion: reporte_distribucion,
	reporte_nuevos: reporte_nuevos,
	reporte_poblacion: reporte_poblacion,
	reporte_docentes: reporte_docentes
}