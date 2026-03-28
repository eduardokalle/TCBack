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
    
        let programa;

        let filasProcesadas = 0;
        let datosProcesados = [];

        for(let row of rows) {
            console.log(row);

            iesSnies = row[0];
            codigoCiudad = row[1];
            codigoSnies = row[2];
            estado = row[3];
            nucleo = row[4];
            nombre = row[5];
            titulo = row[6];
            nivelAcademico = row[7];
            nivelFormacion = row[8];
            metodologia = row[9];
            creditos = row[10];
            duracion = row[11];
            periodos = row[12];
            matriucla = row[13];
            propedeuticos = row[14];
            urlWeb = row[15];
            urlPensum = row[16];
            acreditada = row[17];

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
                        where: [{
                            codigo_snies: codigoSnies,
                            institucion_id: institucion.id
                        }]
                    });
                }
                catch (error) {
                        console.log("PROG");
                        console.log(error);
                        return res.status(400).send('error');
                }

                if(programa) {

                    programa = await Programa.update({
                            nombre: nombre,
                            titulo: titulo,
                            metodologia_id: metodologia,
                            nivel_formacion_id: nivelFormacion,
                            nucleo_conocimiento_id: nucleo,
                            nivel_academico: nivelAcademico,
                            estado: estado,
                            duracion_programa: duracion,
                            ciclos_propedeuticos: propedeuticos,
                            creditos: creditos,
                            url_pensum: urlPensum,
                            url_web: urlWeb,
                            acreditacion: acreditada,
                            duracion_periodo: periodos,
                            valor_matricula: matriucla
                        },
                        { 
                            where: { id: programa.id } 
                        });

                        filasProcesadas++;
                        datosProcesados.push({ codigoSnies: codigoSnies,
                                                nombre: nombre,
                                                iesSnies: iesSnies,
                                                codigoCiudad: codigoCiudad,
                                                estado: estado,
                                                nucleo: nucleo
                                             });
                }
                else {

                    try {
                      	programa = await Programa.create({
                            nombre: nombre,
                            titulo: titulo,
                            metodologia_id: metodologia,
                            nivel_formacion_id: nivelFormacion,
                            nucleo_conocimiento_id: nucleo,
                            nivel_academico: nivelAcademico,
                            estado: estado,
                            duracion_programa: duracion,
                            ciclos_propedeuticos: propedeuticos,
                            creditos: creditos,
                            url_pensum: urlPensum,
                            url_web: urlWeb,
                            acreditacion: acreditada,
                            duracion_periodo: periodos,
                            valor_matricula: matriucla,
                            codigo_snies: codigoSnies,
                            institucion_id: institucion.id
                        });

                        filasProcesadas++;
                        datosProcesados.push({ codigoSnies: codigoSnies,
                                                nombre: nombre,
                                                iesSnies: iesSnies,
                                                codigoCiudad: codigoCiudad,
                                                estado: estado,
                                                nucleo: nucleo
                                            });
                    }
                    catch (error) {
                        console.log("Hay un error con la información del programa con código SNIES "+codigoSnies);
                        console.log(error);
                        return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                        datosProcesados: datosProcesados,
                                                        error: "Hay un error con la información del programa con código SNIES "+codigoSnies });
                    }
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
