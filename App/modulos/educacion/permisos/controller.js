const { institucionEditar, institucionBorrar } = require('./institucion');
const { programaCrear, programaEditar, programaBorrar } = require('./programa');
const { programaPeriodoListar, programaPeriodoCrear, programaPeriodoEditar, programaPeriodoBorrar } = require('./programa-periodo');
const { plantaDocenteCrear, plantaDocenteEditar, plantaDocenteBorrar } = require('./planta-docente');
const { programaSolicitudListar, programaSolicitudBorrar } = require('./programa-solicitud');

const educacionPermiso = async (entidad, accion, req, datosUsuario) => {

	switch(true) {
		case ((entidad === 'institucion') && (accion === 'editar')) :
			return await institucionEditar(req.params, datosUsuario);
		break

		case ((entidad === 'programa') && (accion === 'crear')) :
			return await programaCrear(req.body, datosUsuario);
		break

		case ((entidad === 'programa') && (accion === 'editar')) :
			return await programaEditar(req.params, datosUsuario);
		break

		case ((entidad === 'programa') && (accion === 'borrar')) :
			return await programaBorrar(req.params, datosUsuario);
		break

		case ((entidad === 'programa-periodo') && (accion === 'listar')) :
			return await programaPeriodoListar(req.params, datosUsuario);
		break

		case ((entidad === 'programa-periodo') && (accion === 'crear')) :
			return await programaPeriodoCrear(req.body, datosUsuario);
		break

		case ((entidad === 'programa-periodo') && (accion === 'editar')) :
			return await programaPeriodoEditar(req.params, datosUsuario);
		break

		case ((entidad === 'programa-periodo') && (accion === 'borrar')) :
			return await programaPeriodoBorrar(req.params, datosUsuario);
		break

		case ((entidad === 'planta-docente') && (accion === 'crear')) :
			return await plantaDocenteCrear(req.body, datosUsuario);
		break

		case ((entidad === 'planta-docente') && (accion === 'editar')) :
			return await plantaDocenteEditar(req.params, datosUsuario);
		break

		case ((entidad === 'planta-docente') && (accion === 'borrar')) :
			return await plantaDocenteBorrar(req.params, datosUsuario);
		break

		case ((entidad === 'programa-solicitud') && (accion === 'listar')) :
			return await programaSolicitudListar(req.params, datosUsuario);
		break

		case ((entidad === 'programa-solicitud') && (accion === 'borrar')) :
			return await programaSolicitudBorrar(req.params, datosUsuario);
		break
	}

}

module.exports = {
	educacionPermiso: educacionPermiso
}
