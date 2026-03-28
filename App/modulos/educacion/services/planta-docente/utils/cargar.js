const { Programa } = require('../../../models/programa');
const { Institucion } = require('../../../models/institucion');
const { ProgramaPeriodo } = require('../../../models/programaPeriodo');
const { PlantaDocente } = require ('../../../models/plantaDocente')
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const cargar = async (req, res) => {

    let input = req.body.input;
    let rows = req.body.rows;

    //console.log(rows);

    if(rows.length > 0) {

        console.log("procesar "+rows.length+" filas");
    
        let iesSnies;
        let tiempo;
        let nivel;
        let anno;
        let cantidadHombres;
        let cantidadMujeres;
        let cantidadTotal;

        let institucion;
        let plantaDocente;

        let filasProcesadas = 0;
        let datosProcesados = [];

        for(let row of rows) {
            console.log(row);

            iesSnies = row[0];
            tiempo = row[1];
            nivel = row[2];
            anno = row[3];
            cantidadHombres = row[4];
            cantidadMujeres = row[5];
            cantidadTotal = row[6];

            try {
                institucion = await Institucion.findOne({
                    attributes: ['id'],
                    where: [{
                        codigo_snies: iesSnies,
                        sede_titular: 1
                    }]
                });
            }
            catch(error) {
                console.log(error);
                return res.status(400).send('error');
            }

            if(institucion) {

                let encontrarPlantaDocente;
                try {
                    encontrarPlantaDocente = await PlantaDocente.findOne({
                            attributes: ['id'],
                            where: [{
                                institucion_id: institucion.id,
                                anno: anno,
                                tiempo_dedicacion_id: tiempo,
                                nivel_formacion_docente_id: nivel
                            }]
                        });
                }
                catch (error) {
                        console.log("PROG");
                        console.log(error);
                        return res.status(400).send('error');
                }

                if (encontrarPlantaDocente) {
                    plantaDocente = await PlantaDocente.update({
                            institucion_id: institucion.id,
                            anno: anno,
                            tiempo_dedicacion_id: tiempo,
                            nivel_formacion_docente_id: nivel,
                            hombres: cantidadHombres,
                            mujeres: cantidadMujeres,
                            total: cantidadTotal
                        },
                        { 
                            where: { id: encontrarPlantaDocente.id } 
                        });

                        filasProcesadas++;
                        datosProcesados.push({ iesSnies: iesSnies, 
                                                anno: anno, tiempoDedicacion: 
                                                tiempo, 
                                                nivelFormacion: nivel,
                                                cantidadHombres: cantidadHombres,
                                                cantidadMujeres: cantidadMujeres,
                                                cantidadTotal: cantidadTotal
                                            });
                }
                else {

                    try {
                      	plantaDocente = await PlantaDocente.create({
                            institucion_id: institucion.id,
                            anno: anno,
                            tiempo_dedicacion_id: tiempo,
                            nivel_formacion_docente_id: nivel,
                            hombres: cantidadHombres,
                            mujeres: cantidadMujeres,
                            total: cantidadTotal
                        });

                        filasProcesadas++;
                        datosProcesados.push({ iesSnies: iesSnies, 
                                                anno: anno, 
                                                tiempoDedicacion: tiempo, 
                                                nivelFormacion: nivel,
                                                cantidadHombres: cantidadHombres,
                                                cantidadMujeres: cantidadMujeres,
                                                cantidadTotal: cantidadTotal
                                            });
                    }
                    catch (error) {
                        console.log("Hay un error con la información de la institucion con código SNIES "+iesSnies);
                        console.log(error);
                        return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                        datosProcesados: datosProcesados,
                                                        error: "Hay un error con la información de la institucion con código SNIES "
                                                            +iesSnies+", nivel de formación "+nivel+", tiempo de deciación "+tiempo+" y año "+anno });
                    }
                }
            }
            else {
                return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                datosProcesados: datosProcesados,
                                                error: "No se encontró la institución con código SNIES "+iesSnies });
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
