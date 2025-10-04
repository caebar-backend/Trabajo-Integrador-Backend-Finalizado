# 🎓 Proyecto Integrador: **Spotify** – Backend con Node.js y MySQL

## 🎯 Objetivo
Construir una **plataforma de streaming musical** (estilo Spotify) con **Node.js + Express + MySQL**, que contemple un **modelo relacional correcto**, endpoints REST bien documentados y **validaciones** para prevenir errores frecuentes.

Este es un **proyecto base** con toda la estructura necesaria para que completes el desarrollo de una API REST. Todos los archivos están creados pero **vacíos** - tu trabajo es implementar la funcionalidad.

---

## 🚀 Comenzar con el Proyecto

### 1. Fork y Clonación del Repositorio

```bash
# 1. Hacer fork del repositorio en GitHub
# Ve a: https://github.com/FabioDrizZt/Trabajo-Integrador-Spotify-Backend/
# Haz clic en "Fork" para crear tu copia

# 2. Clonar tu fork
git clone https://github.com/TU_USUARIO/Trabajo-Integrador-Spotify-Backend.git

# 3. Navegar al directorio del proyecto
cd Trabajo-Integrador-Spotify-Backend

# 4. Instalar dependencias
npm install

# 5. Configurar variables de entorno
cp env.example .env
# Editar .env con tus datos de MySQL
```

### 2. Configurar la Base de Datos
```bash
# Ejecutar el script SQL en MySQL
mysql -u tu_usuario -p < scripts.sql
```

### 3. Iniciar el Servidor
```bash
# Modo desarrollo
npm run dev

# El servidor estará disponible en http://localhost:3000
```

---

## 📦 Dataset de referencia
Usa `Datos_Spotify.xlsx` o `Datos_Spotify.json` (artistas, discográficas, álbumes, canciones, géneros, usuarios, playlists, suscripciones, datos de pago y pagos) como guía para **poblar** la base y validar casos reales.

---

## 🗂️ Estructura del Proyecto

```
📁 Proyecto Spotify Backend/
├── 📄 package.json              # Dependencias ya configuradas ✅
├── 📄 env.example               # Variables de entorno (copia a .env)
├── 📄 .gitignore               # Archivos a ignorar en Git ✅
├── 📄 server.js                # Punto de entrada (COMPLETAR)
├── 📄 scripts.sql              # Base de datos completa ✅
├── 📄 api.http                 # Pruebas REST Client ✅
├── 📄 readme.md                # Especificación del proyecto ✅
├── 📁 src/
│   ├── 📄 app.js               # Configuración Express (COMPLETAR)
│   ├── 📁 config/
│   │   ├── 📄 database.js      # Conexión MySQL (COMPLETAR)
│   ├── 📁 models/              # Modelos de datos (COMPLETAR)
│   │   ├── 📄 Usuario.js
│   │   ├── 📄 Artista.js
│   │   ├── 📄 Album.js
│   │   ├── 📄 Cancion.js
│   │   ├── 📄 Genero.js
│   │   ├── 📄 Playlist.js
│   │   ├── 📄 Suscripcion.js
│   │   ├── 📄 MetodoPago.js
│   │   └── 📄 Pago.js
│   ├── 📁 routes/              # Rutas Express (COMPLETAR)
│   │   ├── 📄 index.js
│   │   ├── 📄 usuarios.js
│   │   ├── 📄 artistas.js
│   │   ├── 📄 albumes.js
│   │   ├── 📄 canciones.js
│   │   ├── 📄 generos.js
│   │   ├── 📄 playlists.js
│   │   ├── 📄 suscripciones.js
│   │   ├── 📄 metodos-pago.js
│   │   ├── 📄 pagos.js
│   │   └── 📄 vistas.js        # ⭐ EJERCICIOS ADICIONALES
│   ├── 📁 controllers/         # Lógica de negocio (COMPLETAR)
│   │   ├── 📄 usuariosController.js
│   │   ├── 📄 artistasController.js
│   │   ├── 📄 albumesController.js
│   │   ├── 📄 cancionesController.js
│   │   ├── 📄 generosController.js
│   │   ├── 📄 playlistsController.js
│   │   ├── 📄 suscripcionesController.js
│   │   ├── 📄 metodosPagoController.js
│   │   ├── 📄 pagosController.js
│   │   └── 📄 vistasController.js  # ⭐ EJERCICIOS ADICIONALES
│   ├── 📁 data/               # Datos de referencia ✅
│   │   ├── 📄 Datos_Spotify.json
│   │   └── 📄 Datos_Spotify.xlsx
│   └── 📁 docs/               # Documentación ✅
│       └── 📄 swagger.yaml
```

---

## 🔧 Orden Sugerido de Implementación

### 1. **Configuración Base** 
- `src/config/database.js` - Conexión MySQL
- `src/config/index.js` - Variables centralizadas
- `server.js` - Inicialización del servidor
- `src/app.js` - Configuración Express

### 2. **Modelos** 
- Empezar por `Usuario.js` y `Artista.js` (más simples)
- Continuar con `Album.js`, `Cancion.js`, `Genero.js`
- Terminar con `Playlist.js`, `Suscripcion.js`, `MetodoPago.js`, `Pago.js`

### 3. **Middlewares** 
- `validaciones.js` - Esquemas Joi
- `errorHandler.js` - Manejo de errores
- `rateLimiting.js` - Limitación de requests

### 4. **Controladores** 
- Implementar lógica de negocio para cada entidad
- Usar los modelos creados anteriormente

### 5. **Rutas** 
- Conectar controladores con endpoints
- Aplicar middlewares de validación

### 6. **⭐ Ejercicios Adicionales** 
- `vistasController.js` - Consultas con JOINs complejos
- `vistas.js` - Rutas para las vistas

---

## 🗄️ Requisitos del modelo de datos (BD: `spotify`)
Incluye, como mínimo, estas tablas (puedes agregar otras si aportan valor):

- **usuario** (`id_usuario` PK, `email` **UNIQUE NOT NULL**, `password_hash` **NOT NULL**, `fecha_nac`, `sexo` CHAR(1), `cp`, `id_pais` FK → `pais`, `tipo_usuario_actual` FK → `tipo_usuario`, `fecha_ult_mod_password` **DATETIME**).
- **pais** (`id_pais`, `nombre_pais` **UNIQUE**).
- **tipo_usuario** (`id_tipo_usuario`, valores: `free`, `standard`, `premium`).
- **artista** (`id_artista`, `nombre` **UNIQUE**, `imagen_url`).
- **discografica** (`id_discografica`, `nombre`, `id_pais` FK) con **UNIQUE (`nombre`, `id_pais`)**.
- **album** (`id_album`, `titulo`, `id_artista` FK, `id_discografica` FK, `imagen_portada`, `anio_publicacion`, `duracion_total_seg` INT **derivada**). **UNIQUE (`id_artista`, `titulo`)**.
- **genero** (`id_genero`, `nombre` **UNIQUE**).
- **cancion** (`id_cancion`, `titulo`, `duracion_seg` **INT NOT NULL**, `id_album` FK, `reproducciones` BIGINT DEFAULT 0, `likes` BIGINT DEFAULT 0, `fecha_agregada` DATETIME DEFAULT CURRENT_TIMESTAMP).
- **cancion_genero** (N:M) **PK(`id_cancion`,`id_genero`)**.
- **playlist** (`id_playlist`, `titulo`, `id_usuario` FK, `cant_canciones` **INT** derivada, `estado` ENUM('activa','eliminada') DEFAULT 'activa', `fecha_creacion` DATETIME, `fecha_eliminada` DATETIME **NULL**). **CHECK** coherencia `estado`/`fecha_eliminada`.
- **playlist_cancion** (N:M) **PK(`id_playlist`,`id_cancion`)**, `orden`, `fecha_agregada`.
- **suscripcion** (`id_suscripcion`, `id_usuario` FK, `tipo_usuario` FK/ENUM, `fecha_inicio`, `fecha_renovacion`). **CHECK** `fecha_renovacion > fecha_inicio` y **UNIQUE (`id_usuario`,`fecha_inicio`)**.
- **metodo_pago** (`id_metodo_pago`, `id_usuario` FK, `tipo_forma_pago`, `cbu`, `banco_codigo`, `nro_tarjeta_masc` **(últimos 4)**, `mes_caduca`, `anio_caduca`, **sin CVC**). **Permitir múltiples métodos por usuario**.
- **pago** (`id_pago`, `id_usuario` FK, `id_suscripcion` FK, `id_metodo_pago` FK, `importe`, `fecha_pago`).

### 🔒 Reglas y constraints anti-errores (OBLIGATORIAS)
1) **Email obligatorio y único** en `usuario`.
2) **Duración de canciones en segundos (INT)** → no usar formato `mm.ss` como `DECIMAL`.
3) **No duplicar datos**: `cancion` no debe guardar artista/discográfica; eso proviene de `album`.
4) **UNIQUE (`id_artista`,`titulo`)** en `album` para evitar duplicados.
5) **Playlist soft-delete**: si `estado='eliminada'` entonces `fecha_eliminada` **NOT NULL**; si `activa`, entonces `fecha_eliminada` **NULL**.
6) **Métodos de pago**: **sin CVC** y **PAN enmascarado** (guardar solo últimos 4). **N métodos** por usuario; `pago` debe referenciar un `metodo_pago` real.
7) **Cargas mínimas**: al menos **3 usuarios, 3 álbumes y 3 canciones**. Incluye 1 playlist **con canciones** y otra **eliminada** (con fecha).

---

## 🌐 API REST – Endpoints requeridos
Prefijo sugerido: `/api/v1`.

### Usuarios
- **GET** `/usuarios` → lista.
- **GET** `/usuarios/:id` → detalle.
- **POST** `/usuarios` → crear (validar email único, hashear password, setear `fecha_ult_mod_password`).
- **PUT** `/usuarios/:id` → actualizar (si cambia `password`, actualizar `fecha_ult_mod_password`).
- **DELETE** `/usuarios/:id` → baja lógica (`activo=false`) o hard-delete si lo justificás.
- **GET** `/usuarios/password-vencidas` → lista usuarios con contraseña > 90 días.

### Artistas
- **GET** `/artistas` y **GET** `/artistas/:id`.
- **POST** `/artistas` → validar `nombre` único.

### Álbumes
- **GET** `/albumes` → filtros: `?artistaId`, `?q`.
- **GET** `/albumes/:id`.
- **GET** `/albumes/:id/canciones`.
- **POST** `/albumes` → validar **UNIQUE (`id_artista`,`titulo`)**.

### Canciones
- **GET** `/canciones` → filtros: `?genero=`, `?artistaId=`, `?albumId=`.
- **GET** `/canciones/:id`.
- **POST** `/canciones` → validar `duracion_seg` (INT>0) y `id_album` existente.
- **PUT** `/canciones/:id`.
- **POST** `/canciones/:id/generos` {`id_genero`} → asocia género.
- **DELETE** `/canciones/:id/generos/:idGenero` → desasocia.

### Géneros
- **GET** `/generos` – **POST** `/generos` (único por nombre).

### Playlists
- **GET** `/playlists` – **GET** `/playlists/:id`.
- **POST** `/playlists`.
- **PUT** `/playlists/:id` (cambiar `titulo` o `estado`; si `eliminada`, setear `fecha_eliminada`).
- **POST** `/playlists/:id/canciones` {`id_cancion`, `orden`} → agregar.
- **DELETE** `/playlists/:id/canciones/:idCancion` → quitar.

### Suscripciones
- **GET** `/suscripciones` – **GET** `/suscripciones/:id`.
- **POST** `/suscripciones` → validar `fecha_renovacion > fecha_inicio` y **UNIQUE (`id_usuario`,`fecha_inicio`)**.

### Métodos de pago
- **GET** `/metodos-pago?usuarioId=`.
- **POST** `/metodos-pago` → crear (sin CVC; `nro_tarjeta_masc` = `**** **** **** 1234`).

### Pagos
- **GET** `/pagos?usuarioId=&desde=&hasta=`.
- **POST** `/pagos` → registrar pago referenciando `id_suscripcion` y `id_metodo_pago` válidos.

---

## ⭐ Ejercicios Adicionales - Vistas con JOINs

Los estudiantes deben implementar estos endpoints que utilizan **consultas complejas con múltiples JOINs**:

### EJERCICIO 1: Canciones Populares por País
- **GET** `/vistas/canciones-populares-por-pais`
- **Archivo**: `src/controllers/vistasController.js` → método `cancionesPopularesPorPais`
- **Objetivo**: Mostrar las canciones más reproducidas agrupadas por país de origen de los usuarios.
- **Datos a incluir**: `nombre_cancion`, `nombre_artista`, `nombre_album`, `nombre_pais`, `total_reproducciones`, `apariciones_en_playlists`.
- **JOINs requeridos**: `cancion` → `album` → `artista`, `playlist_cancion` → `playlist` → `usuario` → `pais`.
- **Lógica**: Agrupar por país y canción, sumar reproducciones, contar apariciones en playlists activas.
- **Ordenamiento**: Por país y luego por total de reproducciones (DESC).

### EJERCICIO 2: Ingresos por Artista y Discográfica
- **GET** `/vistas/ingresos-por-artista-discografica`
- **Archivo**: `src/controllers/vistasController.js` → método `ingresosPorArtistaDiscografica`
- **Objetivo**: Analizar los ingresos generados por cada combinación artista-discográfica.
- **Datos a incluir**: `nombre_artista`, `nombre_discografica`, `nombre_pais_discografica`, `total_ingresos`, `cantidad_suscripciones_activas`, `total_canciones`, `promedio_reproducciones`.
- **JOINs requeridos**: `pago` → `suscripcion` → `usuario` → `playlist` → `playlist_cancion` → `cancion` → `album` → `artista`/`discografica` → `pais`.
- **Lógica**: Calcular ingresos totales, contar suscripciones activas, estadísticas de canciones.
- **Filtros**: Solo suscripciones vigentes (`fecha_renovacion > NOW()`) y playlists activas.
- **Ordenamiento**: Por total de ingresos (DESC).

**💡 Tip para estudiantes**: Estas consultas requieren entender bien las relaciones entre tablas y usar agregaciones (`SUM`, `COUNT`, `AVG`) junto con `GROUP BY`. Son excelentes para practicar JOINs complejos y análisis de datos.

---

## ✅ Validaciones Importantes

### ✅ Reglas que DEBES implementar:
1. **Email único** en usuarios
2. **Duración en segundos** (INT) para canciones
3. **UNIQUE (artista, título)** para álbumes
4. **Soft delete** coherente en playlists
5. **Tarjetas enmascaradas** sin CVC
6. **Fechas válidas** en suscripciones
7. **Hasheo de contraseñas** con bcrypt

### ❌ Errores que debes manejar:
- **400**: Datos faltantes o inválidos
- **409**: Conflictos de unicidad
- **422**: Estructura semánticamente inválida
- **404**: Recursos no encontrados
- **401/403**: Si implementás auth (opcional recomendado)

Respuestas JSON con `{ error: { code, message, details } }`.

---

## 🧪 Cómo Probar tu Implementación

1. **Usar api.http**: Archivo con todas las pruebas listas
2. **Casos positivos**: Crear, leer, actualizar, eliminar
3. **Casos negativos**: Datos inválidos, duplicados, etc.
4. **Ejercicios adicionales**: Probar las vistas con JOINs

Se incluye un archivo **`api.http`** (VS Code – REST Client) con solicitudes listas para probar todos los endpoints, incluidos **casos negativos** que deben fallar si las validaciones están bien.

---

## 🔐 Seguridad y buenas prácticas
- Hashear contraseñas (bcrypt). Nunca devolver `password_hash`.
- Variables de entorno en `.env` (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, etc.).
- Logueo, manejo centralizado de errores, rate limiting básico.

---

## 🎯 Criterios de Evaluación

- **Modelo de datos** (30%): Estructura correcta, constraints, triggers
- **Integridad/Validaciones** (25%): Manejo de errores, validaciones
- **Endpoints** (25%): Funcionalidad completa de la API
- **Ejercicios JOINs** (10%): Implementación de vistas complejas
- **Documentación** (10%): DER, comentarios, README

---

## 💡 Tips para el Éxito

1. **Lee toda la especificación** antes de empezar
2. **Implementa paso a paso** siguiendo el orden sugerido
3. **Prueba frecuentemente** con api.http
4. **Maneja errores apropiadamente** desde el inicio
5. **Comenta tu código** para facilitar la revisión
6. **Crea el DER** para entender las relaciones
7. **No copies código** - entiende lo que implementas

---

## 📚 Recursos de Ayuda

- **README.md**: Especificación completa del proyecto
- **src/docs/swagger.yaml**: Documentación detallada de la API
- **INSTRUCCIONES_ESTUDIANTES.md**: Guía paso a paso para estudiantes

---

## 🆘 ¿Necesitas Ayuda?

1. **Revisa los comentarios** en cada archivo
2. **Consulta la documentación Swagger** para ver ejemplos
3. **Usa los datos de prueba** en scripts.sql
4. **Prueba con casos simples** antes de casos complejos

---

## 🚀 Entrega y rúbrica
- **Scripts SQL** (creación + inserts) ✔
- **API funcional** con endpoints arriba listados ✔
- **Validaciones** anti-errores implementadas ✔
- **DER** (imagen en `/docs`) ✔
- **Documentación** (Swagger o Markdown) ✔
- **Datos mínimos** (≥ 3 usuarios, 3 álbumes, 3 canciones; playlists con canciones; una playlist eliminada) ✔

> Ponderación sugerida: Modelo 30% · Integridad/validaciones 25% · Endpoints 25% · Datos/consistencia 10% · Documentación 10%.

---

## 🏁 Puesta en marcha
1) Crear BD y tablas con `scripts.sql`.
2) `npm i` · configurar `.env` · `npm run dev`.
3) Abrir `api.http` en VS Code y ejecutar solicitudes.

¡Éxito en tu proyecto! 🚀
