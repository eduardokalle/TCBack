const { sequelize, Sequelize } = require('../../../config');

const Poblacion = sequelize.define('poblacion', {
    id: {
        primaryKey: true,
        field: 'id',
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    departamentoId: {
        field: 'departamento_id',
        type: Sequelize.INTEGER
    },
    ciudadId: {
        field: 'ciudad_id',
        type: Sequelize.INTEGER
    },
    anno: {
        field: 'anno',
        type: Sequelize.DATEONLY
    },
    edadDesde: {
        field: 'edad_desde',
        type: Sequelize.INTEGER(2)
    },
    edadHasta: {
        field: 'edad_hasta',
        type: Sequelize.INTEGER(2)
    },
    cantidadHombres: {
        field: 'cantidad_hombres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    cantidadMujeres: {
        field: 'cantidad_mujeres',
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

/**
 * Para buscarlo todo, sería:
 * Poblacion.findAll()
 * 
 * Para buscar por determinados atributos, sería:
 * Poblacion.findAll({
 *      attributes: ['cantidad_hombres','cantidad_mujeres']
 * })
 * 
 * Para buscar con condiciones (como por rango de años)
 * const Op = Sequelize.Op;
 * Poblacion.findAll({
 *      where: {
 *          [Op.and]: [{
 *              anno: {
 *                      [Op.gte]: '2014-01-01'
 *                  },
 *              anno: {
 *                      [Op.lte]: '2017-01-01'
 *                  }
 *          }]
 *      }
 * })
 */

module.exports = {
    Poblacion
}