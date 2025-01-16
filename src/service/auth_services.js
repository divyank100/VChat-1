const createErrors = require('http-errors');
const User = require('../models/user_model');
const { userValidationSchema } = require('../utils/user_validation');

const { signAccessToken, signRefreshToken, verifyRefreshToken, } = require('../middleware/jwt_auth_middleware');

class AuthService {
    async validateUserInput(userData) {
        try {
            const value = await userValidationSchema.register.validateAsync(userData);
            return value;
        } catch (error) {
            throw createErrors.BadRequest(error.message);
        }
    }

    async generateAuthTokens(userId) {
        const accessToken = await signAccessToken(userId);
        const refreshToken = await signRefreshToken(userId);
        return { accessToken, refreshToken };
    }

    async userExists(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        }
        catch (error) {
            throw createErrors.Conflict(`User with email ${email} already exists`);
        }
    }

    async registerUser(userData) {
        try {
            const user = new User(userData);
            const savedUser = await user.save();
            return savedUser;
        } catch (error) {
            throw createErrors.InternalServerError(error.message);
        }
    }

    async findUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) throw createErrors.NotFound('User not found');
            return user;
        }
        catch (error) {
            throw createErrors.NotFound();
        }
    }

    // async loginUser(email, password){
    //     try{
    //         const user = await User.findOne({email});
    //         if(!user) throw createErrors.NotFound('User not registered');
    //         const isMatch = await user.isValidPassword(password);
    //         if(!isMatch) throw createErrors.Unauthorized('Invalid credentials');
    //         return user;
    //     }
    //     catch (error) {
    //         throw createErrors.Unauthorized(`Invalid credentials`);
    //     }
    // }

    async validatePassword(password) {
        try {
            const isMatch = await User.isValidPassword(password);
            if (!isMatch) throw createErrors.BadRequest('userName/password not valid');
            return true;
        }
        catch (error) {
            throw createErrors.BadRequest(error.message);
        }
    }

    async handleRefreshToken(refreshToken) {
        if (!refreshToken) {
            throw createErrors.BadRequest('Refresh token is required');
        }

        if (revokedTokens.has(refreshToken)) {
            throw createErrors.Unauthorized('Refresh token has been revoked');
        }

        const userId = await verifyRefreshToken(refreshToken);
        return userId;
    }

    async revokeToken(refreshToken) {
        if (!refreshToken) {
            throw createErrors.BadRequest('Refresh token is required');
        }

        try {
            const userId = await verifyRefreshToken(refreshToken);
            revokedTokens.add(refreshToken);
            return userId;
        } catch (error) {
            throw createErrors.Unauthorized('Invalid refresh token');
        }
    }

    // Optional: Method to clear expired tokens from the set
    clearExpiredTokens() {
        // In a real implementation, you would want to clear expired tokens
        // from your storage periodically
        revokedTokens.clear();
    }
}

module.exports = new AuthService();