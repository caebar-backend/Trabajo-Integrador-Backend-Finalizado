const { login } = require('../services/authLoginService')
const chalk = require('chalk')

async function loginController(req, res) {
  try {
    const { email, password_hash} = req.body
    const token = await login(email, password_hash)
    console.log(chalk.greenBright('Token generado: '), token)
    res.json({ token })
  } catch (error) {
    console.log(chalk.redBright('Error en el login: '), error.message)
    res.status(401).json({ mensaje: error.message })
  }
}

module.exports = { loginController }