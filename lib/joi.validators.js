const Joi = require('@hapi/joi')

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

const loginSchema = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required()
})

module.exports = {
  registerSchema,
  loginSchema
}
