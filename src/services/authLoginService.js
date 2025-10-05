const jwt = require('jsonwebtoken')
const chalk = require('chalk')
const Usuario = require('../models/Usuario')

process.loadEnvFile()

async function login(email, password_hash, id_rol) {
  const usuario = await Usuario.findOne({ where: { email } })
  console.log(chalk.greenBright('Se encontró el usuario: '), usuario.email)

  if (!usuario || usuario.password_hash !== password_hash || usuario.id_rol !== id_rol) {
    console.log(chalk.redBright('Credenciales inválidas para obtener token'))
    throw new Error('Credenciales inválidas para obtener token')
   }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
  console.log(chalk.cyanBright('Token generado: '), token)
  return token
}

module.exports = { login }