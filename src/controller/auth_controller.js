const createError = require('http-errors');
const User = require('../models/user_model');
const {auth_services} = require('../service/index');

module.exports = {
    register: async (req, res, next) => {
        try{
            const validateData = await auth_services.validateUserInput(req.body);
            await auth_services.userExists(validateData.email);
            const user = await auth_services.registerUser(validateData);
            const token = await auth_services.signAccessToken(user.id);

            res.status(201).json({ 
                status: 'success',
                message: 'User registered successfully',
                user, 
                ...token
            });
        }
        catch (error) {
            if (error.isJoi === true) error.status = 422;
            next(error);
        }
    },

    login: async (req, res, next)=> {
        try {
            const validateData = await auth_services.validateUserInput(req.body);
            const user = await auth_services.findUserByEmail(validateData.email );
            
            await auth_services.validatePassword(user, validateData.password);

            await auth_services.generateAuthTokens(user.id);

            res.status(200).json({
                status: 'success',
                message: 'User logged in successfully',
                user,
                ...token
            });
        }
        catch (error) {
            if (error.isJoi === true) {
                return next(createError.BadRequest('Invalid Username/Password'));
            }
            next(error);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const userId = await auth_services.handleRefreshToken(req.body.refreshToken);
            const tokens = await auth_services.generateAuthTokens(userId);

            res.status(200).json({
                success: true,
                message: 'Tokens refreshed successfully',
                data: tokens
            });
        }
        catch(error){
            next(error);
        }
    },

    logout: async (req, res, next) => {
        try {
            await auth_services.revokeToken(req.body.refreshToken);

            res.status(200).json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}