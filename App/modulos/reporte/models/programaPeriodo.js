const { sequelize, Sequelize } =  require('../../../config');

const programaPeriodo = sequelize.define('programa_periodo', {
    id: {
        primaryKey: true,
        field: 'id',
        type: Sequelize.INTEGER,
        autoIncrement: true
    },
    programaId: {
        field: 'programa_id',
        type: Sequelize.INTEGER
    },
    anno: {
        field: 'anno',
        type: Sequelize.DATEONLY
    },
    periodo: {
        field: 'edad_desde',
        type: Sequelize.TINYINT
    },
    valorMatricula: {
        field: 'valor_matricula',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    cupos: {
        field: 'cupos',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    postuladosHombres: {
        field: 'postulados_hombres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    postuladosMujeres: {
        field: 'postulados_mujeres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    admitidosHombres: {
        field: 'admitidos_hombres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    admitidosMujeres: {
        field: 'admitidos_mujeres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    graduadosHombres: {
        field: 'graduados_hombres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    graduadosMujeres: {
        field: 'graduados_mujeres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    estudiantesHombres: {
        field: 'estudiantes_hombres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    estudiantesMujeres: {
        field: 'estudiantes_mujeres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    matriculadosHombres: {
        field: 'matriculados_hombres',
        type: Sequelize.INTEGER,
        allowNull: true
    },
    matriculadosMujeres: {
        field: 'matriculados_mujeres',
        type: Sequelize.INTEGER,
        allowNull: true
    }
});

module.exports = {
    programaPeriodo
}