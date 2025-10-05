const jwt = require('jsonwebtoken')
const chalk = require('chalk')
process.loadEnvFile()


function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    console.log(chalk.red('No se encontró token en la cabecera de autorización'))
    return res.status(403).json({ mensaje: 'Token requerido' })
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err){
        res.status(401).json({ mensaje: 'Token inválido', error: err.message })
        console.log(chalk.red('Error en el token: '), err.message)
        return 
    } 
    console.log(chalk.greenBright('<--- Token válido ----> '))
    req.usuario = usuario
    next();
  })
}

module.exports = verificarToken