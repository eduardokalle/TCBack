const { Departamento } = require('../../../models/departamento');
const { Ciudad } = require('../../../models/ciudad');
const { Poblacion } = require('../../../models/poblacion');
const { Sequelize } = require('../../../../../config');
const { joi } = require('../../../../../config');

const Op = Sequelize.Op;

const cargar = async (req, res) => {

    let input = req.body.input;
    let rows = req.body.rows;

    //console.log(rows);

    if(rows.length > 0) {

        console.log("procesar "+rows.length+" filas");
    
        let departamentoId;
        let ciudadId;
        let anno;
        let desde;
        let hasta;
        let cantidadHombres;
        let cantidadMujeres;

        let encontrarCiudad;
        let encontrarDepartamento;
        let encontrarPoblacionCiudad;
        let encontrarPoblacionDepartamento;
        let departamento;
        let ciudad;
        let poblacion;

        let buscarEn;
        let filasProcesadas = 0;
        let datosProcesados = [];

        for(let row of rows) {
            console.log(row);

            departamentoId = row[0];
            ciudadId = row[1];
            anno = row[2];
            desde = row[3];
            hasta = row[4];
            cantidadHombres = row[5];
            cantidadMujeres = row[6];

            if(ciudadId) {

                buscarEn = 'ciudad';

                console.log("BUSCAR EN: CIUDAD");

                try {
                    encontrarCiudad = await Ciudad.findOne({
                        attributes: ['id'],
                        where: [{
                            id: ciudadId
                        }],
                    });
                }
                catch (error) {
                    return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                    datosProcesados: datosProcesados,
                                                    error: "No se encontró el municipio con ID "+ciudadId });
                }
            }
            else if(departamentoId) {

                buscarEn = 'departamento';

                console.log("BUSCAR EN: DEPTO");

                try {
                    encontrarDepartamento = await Departamento.findOne({
                        attributes: ['id'],
                        where: [{
                            id: departamentoId
                        }],
                    });
                }
                catch (error) {
                    return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                    datosProcesados: datosProcesados,
                                                    error: "No se encontró el departamento con ID "+ciudadId });
                }
            }
            else {
                return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                    datosProcesados: datosProcesados,
                                                    error: "No se ingresó ID de Departamento o Municipio" });
            }

            if(buscarEn == 'ciudad' && encontrarCiudad) {
                try {
                    encontrarPoblacionCiudad = await Poblacion.findOne({
                        attributes: ['id'],
                        where: [{
                            ciudad_id: ciudadId,
                            anno: anno,
                            edad_desde: desde,
                            edad_hasta: hasta
                        }],
                    });
                }
                catch (error) {
                    return res.status(400).send('error');
                }

                if(encontrarPoblacionCiudad) {
                    try {
                        poblacion = await Poblacion.update({
                                hombres: cantidadHombres,
                                mujeres: cantidadMujeres
                            },
                            { 
                                where: { id: encontrarPoblacionCiudad.id } 
                            });

                            filasProcesadas++;
                            datosProcesados.push({ departamento: '',
                                                    ciudad: ciudadId,
                                                    anno: anno,
                                                    desde: desde,
                                                    hasta: hasta,
                                                    hombres: cantidadHombres,
                                                    mujeres: cantidadMujeres
                                                 });
                    }
                    catch (error) {
                        return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                        datosProcesados: datosProcesados,
                                                        error: "Hay un error con la información del municipio con ID "+ciudadId+
                                                                " en el año "+anno+" para el rango "+desde+" - "+hasta
                                                    });
                    }
                }
                else {

                    try {
                      	poblacion = await Poblacion.create({
                            ciudad_id: ciudadId,
                            anno: anno,
                            edad_desde: desde,
                            edad_hasta: hasta,
                            hombres: cantidadHombres,
                            mujeres: cantidadMujeres
                        });

                        filasProcesadas++;
                        datosProcesados.push({ departamento: '',
                                                ciudad: ciudadId,
                                                anno: anno,
                                                desde: desde,
                                                hasta: hasta,
                                                hombres: cantidadHombres,
                                                mujeres: cantidadMujeres
                                            });
                    }
                    catch (error) {
                        return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                        datosProcesados: datosProcesados,
                                                        error: "Hay un error con la información del municipio con ID "+ciudadId+
                                                                " en el año "+anno+" para el rango "+desde+" - "+hasta
                                                    });
                    }
                }
            }
            else if(buscarEn == 'departamento' && encontrarDepartamento) {
                try {
                    encontrarPoblacionDepartamento = await Poblacion.findOne({
                        attributes: ['id'],
                        where: [{
                            departamento_id: departamentoId,
                            anno: anno,
                            edad_desde: desde,
                            edad_hasta: hasta
                        }],
                    });
                }
                catch (error) {
                    return res.status(400).send('error');
                }

                if(encontrarPoblacionDepartamento) {

                    try {
                        poblacion = await Poblacion.update({
                                hombres: cantidadHombres,
                                mujeres: cantidadMujeres
                            },
                            { 
                                where: { id: encontrarPoblacionDepartamento.id } 
                            });

                            filasProcesadas++;
                            datosProcesados.push({ departamento: departamentoId,
                                                    ciudad: '',
                                                    anno: anno,
                                                    desde: desde,
                                                    hasta: hasta,
                                                    hombres: cantidadHombres,
                                                    mujeres: cantidadMujeres
                                                 });
                    }
                    catch (error) {
                        return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                        datosProcesados: datosProcesados,
                                                        error: "Hay un error con la información del departamento con ID "+departamentoId+
                                                                " en el año "+anno+" para el rango "+desde+" - "+hasta
                                                    });
                    }
                }
                else {

                    try {
                          poblacion = await Poblacion.create({
                            departamento_id: departamentoId,
                            anno: anno,
                            edad_desde: desde,
                            edad_hasta: hasta,
                            hombres: cantidadHombres,
                            mujeres: cantidadMujeres
                        });

                        filasProcesadas++;
                        datosProcesados.push({ departamento: departamentoId,
                                                ciudad: '',
                                                anno: anno,
                                                desde: desde,
                                                hasta: hasta,
                                                hombres: cantidadHombres,
                                                mujeres: cantidadMujeres
                                            });
                    }
                    catch (error) {
                        return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                        datosProcesados: datosProcesados,
                                                        error: "Hay un error con la información del departamento con ID "+departamentoId+
                                                                " en el año "+anno+" para el rango "+desde+" - "+hasta
                                                    });
                    }
                }
            }
            else {
                return res.status(400).send({ filasProcesadas: filasProcesadas, 
                                                    datosProcesados: datosProcesados,
                                                    error: "Hay un error con la información del departamento con ID "+departamentoId+
                                                            " municipio con ID "+ciudadId+" en el año "+anno+" para el rango "+desde+" - "+hasta
                                            });
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
