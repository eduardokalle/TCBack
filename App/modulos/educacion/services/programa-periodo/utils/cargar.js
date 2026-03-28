const { Programa } = require('../../../models/programa');
const { Institucion } = require('../../../models/institucion');
const { ProgramaPeriodo } = require('../../../models/programaPeriodo');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const cargar = async (req, res) => {

    let input = req.body.input;
    let rows = req.body.rows;

    //console.log(rows);

    if(rows.length > 0) {

        console.log("procesar "+rows.length+" filas");
    
        let codigoCiudad;
        let iesSnies;
        let programaSnies;
        let anno;
        let periodo;
        let cupos;
        let postuladosHombres;
        let postuladosMujeres;
        let admitidosHombres;
        let admitidosMujeres;
        let matriculadosHombres;
        let matriculadosMujeres;
        let estudiantesHombres;
        let estudiantesMujeres;
        let graduadosHombres;
        let graduadosMujeres;

        let institucion;
        let programa;
        let programaPeriodo;

        let filasProcesadas = 0;
        let datosProcesados = [];

        for(let row of rows) {
            console.log(row);

            codigoCiudad = row[0];
            iesSnies = row[1];
            programaSnies = row[2];
            anno = row[3];
            periodo = row[4];
            postuladosHombres = row[5];
            postuladosMujeres = row[6];
            admitidosHombres = row[7];
            admitidosMujeres = row[8];
            graduadosHombres = row[9];
            graduadosMujeres = row[10];
            estudiantesHombres = row[11];
            estudiantesMujeres = row[12];
            matriculadosHombres = row[13];
            matriculadosMujeres = row[14];

            try {
                institucion = await Institucion.findOne({
                    attributes: ['id'],
                    where: [{
                        codigo_snies: iesSnies,
                        ciudad_id: codigoCiudad
                    }]
                });
            }
            catch(error) {
                console.log(error);
                return res.status(400).send('error');
            }

            if(institucion) {

                try {
                    programa = await Programa.findOne({
                        attributes: ['id'],
                        include: [
                        {
                            model: Institucion,
                            as: 'institucion',
                            attributes: ['id', 'nombre'],
                            where: [{
                                id: institucion.id,
                            }],
                            required: true
                        }],
                        where: [{
                            codigo_snies: programaSnies
                        }],
                    });
                }
                catch (error) {
                        console.log("PROG");
                        console.log(error);
                        return res.status(400).send('error');
                }

                if(programa) {

                        let encontrarProgramaPeriodo;
                        try {
                            encontrarProgramaPeriodo = await ProgramaPeriodo.findOne({
                                    attributes: ['id'],
                                    where: [{
                                        programa_id: programa.id,
                                        anno: anno,
                                        periodo: periodo
                                    }]
                                });
                        }
                        catch (error) {
                                console.log("PROG");
                                console.log(error);
                                return res.status(400).send('error');
                        }

                        console.log(encontrarProgramaPeriodo);

                        if (encontrarProgramaPeriodo) {
                            programaPeriodo = await ProgramaPeriodo.update({
                                    valorMatricula: 0,
                                    cupos: cupos,
                                    postulados_hombres: postuladosHombres,
                                    postulados_mujeres: postuladosMujeres,
                                    admitidos_hombres: admitidosHombres,
                                    admitidos_mujeres: admitidosMujeres,
                                    matriculados_hombres: matriculadosHombres,
                                    matriculados_mujeres: matriculadosMujeres,
                                    estudiantes_hombres: estudiantesHombres,
                                    estudiantes_mujeres: estudiantesMujeres,
                                    graduados_hombres: graduadosHombres,
                                    graduados_mujeres: graduadosMujeres
                                },
                                { 
                                    where: { id: encontrarProgramaPeriodo.id } 
                                });

                                filasProcesadas++;
                                datosProcesados.push({ codigoCiudad: codigoCiudad, iesSnies: iesSnies, programaSnies: programaSnies, anno: anno, periodo: periodo  });
                        }
                        else {

                            try {
                              	programaPeriodo = await ProgramaPeriodo.create({
                                    programa_id: programa.id,
                                    anno: anno,
                                    periodo: periodo,
                                    valorMatricula: 0,
                                    cupos: cupos,
                                    postulados_hombres: postuladosHombres,
                                    postulados_mujeres: postuladosMujeres,
                                    admitidos_hombres: admitidosHombres,
                                    admitidos_mujeres: admitidosMujeres,
                                    matriculados_hombres: matriculadosHombres,
                                    matriculados_mujeres: matriculadosMujeres,
                                    estudiantes_hombres: estudiantesHombres,
                                    estudiantes_mujeres: estudiantesMujeres,
                                    graduados_hombres: graduadosHombres,
                                    graduados_mujeres: graduadosMujeres
                                });

                                filasProcesadas++;
                                datosProcesados.push({ codigoCiudad: codigoCiudad, iesSnies: iesSnies, programaSnies: programaSnies, anno: anno, periodo: periodo  });
                            }
                            catch (error) {
                                console.log("Hay un error con la información del programa con código SNIES "+programaSnies);
                                console.log(error);
                                return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                                datosProcesados: datosProcesados,
                                                                error: "Hay un error con la información del programa con código SNIES "+programaSnies });
                            }
                        }

                }
                else {
                    return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                    datosProcesados: datosProcesados,
                                                    error: "No se encontró el programa con código SNIES "+programaSnies+" en esta institución" });
                }
            }
            else {
                return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                datosProcesados: datosProcesados,
                                                error: "No se encontró la institución con código SNIES "+iesSnies+" en el municipio con código "+codigoCiudad });
            }
        }

        res.send({
            filasProcesadas: filasProcesadas, 
            datosProcesados: 
            datosProcesados, mensaje: "Archivo procesado correctamente"
        });
    }
}

module.exports = {
    cargar: cargar
}
