/**
 * Controlador de Suscripciones
 * Los estudiantes deben implementar toda la lógica de negocio para suscripciones
 */

const { Suscripcion, sequelize } = require("../models")
const { Op } = require("sequelize")
const chalk = require("chalk")

const postParaSuscripciones = async (req, res) => {
    try {
        const { id_usuario, id_tipo_suscripcion, fecha_inicio, fecha_renovacion, activa } = req.body
        
        if(!id_usuario || !id_tipo_suscripcion || !fecha_inicio || !fecha_renovacion){
            console.log(chalk.red("Faltan parametros para crear suscripcion"))
            res.status(400).json({ mensaje: "Faltan parametros para crear suscripcion" })
            return
        }

        // SOLUCIÓN: Normalizar fechas para comparar solo la parte de fecha (sin hora)
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)// Establecer a medianoche
        
        const fechaInicio = new Date(fecha_inicio)
        fechaInicio.setHours(0, 0, 0, 0); // Normalizar a medianoche
        
        const fechaRenovacion = new Date(fecha_renovacion)
        fechaRenovacion.setHours(0, 0, 0, 0); // Normalizar a medianoche
        
        // Validación corregida - comparar timestamps
        if (fechaInicio < hoy) {
            console.log(chalk.red("La fecha de inicio debe ser posterior a hoy"));
            res.status(400).json({ mensaje: "La fecha de inicio debe ser posterior a hoy" });
            return;
        }

        if (fechaRenovacion <= fechaInicio) {
            console.log(chalk.red("La fecha de renovación debe ser posterior a la fecha de inicio"));
            res.status(400).json({ mensaje: "La fecha de renovación debe ser posterior a la fecha de inicio" });
            return;
        }
        
        // Buscar suscripción existente (usar fechas originales del request para la búsqueda)
        const suscripcionExistente = await Suscripcion.findOne({ 
            where: { 
                id_usuario, 
                id_tipo_suscripcion,
                fecha_inicio: new Date(fecha_inicio), // Usar fecha original
                fecha_renovacion: new Date(fecha_renovacion) // Usar fecha original
            } 
        })
        
        if(suscripcionExistente){
            console.log(chalk.red("Ya existe una suscripción para ese usuario con esos parametros"))
            res.status(400).json({ mensaje: "Ya existe una suscripción para ese usuario con esos parametros" })
            return;
        }

        // Verificar si el usuario ya tiene una suscripción activa y vigente
        const suscripcionVigente = await Suscripcion.findOne({
            where: {
                id_usuario,
                activa: true,
                fecha_renovacion: {
                    [Op.gt]: new Date() // fecha de renovación mayor a ahora
                }
            }
        })

        if (suscripcionVigente) {
            console.log(chalk.yellow("El usuario ya tiene una suscripción activa que no ha vencido"));
            res.status(400).json({ mensaje: "Ya existe una suscripción activa que no ha vencido" });
            return;
        }

        // Crear la suscripción con las fechas originales del request
        const suscripcionNueva = await Suscripcion.create({
            id_usuario,
            id_tipo_suscripcion,
            fecha_inicio: new Date(fecha_inicio), // Fecha original del request
            fecha_renovacion: new Date(fecha_renovacion), // Fecha original del request
            activa: activa !== undefined ? activa : true
        })

        const suscripcionNuevaConsole = {
            id_suscripcion: suscripcionNueva.id_suscripcion,
            id_usuario: suscripcionNueva.id_usuario,
            id_tipo_suscripcion: suscripcionNueva.id_tipo_suscripcion,
            fecha_inicio: suscripcionNueva.fecha_inicio,
            fecha_renovacion: suscripcionNueva.fecha_renovacion,
            activa: suscripcionNueva.activa,
        }

        res.status(201).json({message: "Suscripcion creada", suscripcionNueva})
        console.log(chalk.green(" <-------------- Suscripcion Nueva creada -----------> "))
        console.table(suscripcionNuevaConsole)
        console.log(chalk.blue("Debug fechas:"));
        console.log(chalk.blue(`Hoy: ${hoy.toISOString()}`));
        console.log(chalk.blue(`Fecha inicio: ${fechaInicio.toISOString()}`));
        console.log(chalk.blue(`Fecha renovación: ${fechaRenovacion.toISOString()}`));
        console.log(chalk.green(" <-------------- -----------> "))
        return;
        
    } catch(error) {
        console.log(chalk.red("Error al crear suscripcion:", error.message))
        res.status(500).json({mensaje: "Error al crear suscripcion"})
    }
}

module.exports = { postParaSuscripciones }