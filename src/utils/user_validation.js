const Joi = require('joi');

const userValidationSchema = {
    register: Joi.object({
        userName: Joi.string()
            .required()
            .trim()
            .messages({
                'string.empty': 'Username is required',
                'any.required': 'Username is required'
            }),

        email: Joi.string()
            .required()
            .email()
            .lowercase()
            .messages({
                'string.email': 'Please provide a valid email address',
                'string.empty': 'Email is required',
                'any.required': 'Email is required'
            }),

        password: Joi.string()
            .required()
            .min(8)
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.pattern.base': 'Password must contain at least one letter and one number',
                'string.empty': 'Password is required',
                'any.required': 'Password is required'
            }),

        userProfile: Joi.string()
            .uri()
            .default('https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png')
            .messages({
                'string.uri': 'Profile URL must be a valid URL'
            }),

        phone: Joi.string()
            .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
            .messages({
                'string.pattern.base': 'Please provide a valid phone number'
            }),

        userStatus: Joi.boolean()
            .default(false),

        device_token: Joi.string()
            .required()
            .allow(null)
            .messages({
                'string.empty': 'Device token is required',
                'any.required': 'Device token is required'
            })
    }),

    update: Joi.object({
        userName: Joi.string()
            .trim(),

        email: Joi.string()
            .email()
            .lowercase(),

        userProfile: Joi.string()
            .uri(),

        phone: Joi.string()
            .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),

        userStatus: Joi.boolean(),

        device_token: Joi.string()
            .allow(null)
    })
};

module.exports = userValidationSchema;