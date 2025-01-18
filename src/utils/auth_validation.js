const Joi = require('joi')

const authSchema = Joi.object({
    userName: Joi.string().min(5).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
})

module.exports = {
    authSchema,
}