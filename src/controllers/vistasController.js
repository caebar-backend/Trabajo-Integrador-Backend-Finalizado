/**
 * Controlador de Vistas - EJERCICIOS ADICIONALES
 * Los estudiantes deben implementar consultas complejas con JOINs
 */

const { pool } = require("../config/database");

class VistasController {
  // TODO: EJERCICIO 1 - Implementar vista de canciones populares por país
  // static async cancionesPopularesPorPais(req, res) {
  //   try {
  //     // Consulta SQL con JOINs para obtener:
  //     // - nombre_cancion, nombre_artista, nombre_album, nombre_pais, total_reproducciones
  //     // - Agrupar por país y mostrar las canciones más reproducidas
  //     // - Incluir JOINs entre: cancion -> album -> artista, usuario -> pais
  //     // - Ordenar por total_reproducciones DESC
  //
  //     const query = `
  //       SELECT
  //         c.titulo as nombre_cancion,
  //         ar.nombre as nombre_artista,
  //         al.titulo as nombre_album,
  //         p.nombre_pais,
  //         SUM(c.reproducciones) as total_reproducciones
  //       FROM cancion c
  //       INNER JOIN album al ON c.id_album = al.id_album
  //       INNER JOIN artista ar ON al.id_artista = ar.id_artista
  //       INNER JOIN playlist_cancion pc ON c.id_cancion = pc.id_cancion
  //       INNER JOIN playlist pl ON pc.id_playlist = pl.id_playlist
  //       INNER JOIN usuario u ON pl.id_usuario = u.id_usuario
  //       INNER JOIN pais p ON u.id_pais = p.id_pais
  //       WHERE pl.estado = 'activa'
  //       GROUP BY c.id_cancion, p.id_pais
  //       ORDER BY p.nombre_pais, total_reproducciones DESC
  //     `;
  //
  //     // Ejecutar consulta y retornar resultados
  //   } catch (error) {
  //     // Manejar errores
  //   }
  // }
  // TODO: EJERCICIO 2 - Implementar vista de ingresos por artista y discográfica
  // static async ingresosPorArtistaDiscografica(req, res) {
  //   try {
  //     // Consulta SQL con JOINs para obtener:
  //     // - nombre_artista, nombre_discografica, nombre_pais_discografica,
  //     //   total_ingresos, cantidad_suscripciones_activas
  //     // - Incluir JOINs entre: pago -> suscripcion -> usuario -> playlist -> cancion -> album -> artista/discografica
  //     // - Calcular ingresos totales por artista y discográfica
  //     // - Contar suscripciones activas relacionadas
  //
  //     const query = `
  //       SELECT
  //         ar.nombre as nombre_artista,
  //         d.nombre as nombre_discografica,
  //         p.nombre_pais as nombre_pais_discografica,
  //         SUM(pa.importe) as total_ingresos,
  //         COUNT(DISTINCT s.id_suscripcion) as cantidad_suscripciones_activas
  //       FROM pago pa
  //       INNER JOIN suscripcion s ON pa.id_suscripcion = s.id_suscripcion
  //       INNER JOIN usuario u ON s.id_usuario = u.id_usuario
  //       INNER JOIN playlist pl ON u.id_usuario = pl.id_usuario
  //       INNER JOIN playlist_cancion pc ON pl.id_playlist = pc.id_playlist
  //       INNER JOIN cancion c ON pc.id_cancion = c.id_cancion
  //       INNER JOIN album al ON c.id_album = al.id_album
  //       INNER JOIN artista ar ON al.id_artista = ar.id_artista
  //       INNER JOIN discografica d ON al.id_discografica = d.id_discografica
  //       INNER JOIN pais p ON d.id_pais = p.id_pais
  //       WHERE s.fecha_renovacion > NOW() AND pl.estado = 'activa'
  //       GROUP BY ar.id_artista, d.id_discografica
  //       ORDER BY total_ingresos DESC
  //     `;
  //
  //     // Ejecutar consulta y retornar resultados
  //   } catch (error) {
  //     // Manejar errores
  //   }
  // }
}

module.exports = VistasController;
