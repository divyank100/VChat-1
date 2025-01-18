const createErrors = require('http-errors');
const User = require('../models/user_model');
const userValidationSchema  = require('../utils/user_validation');

const { signAccessToken, signRefreshToken, verifyRefreshToken, } = require('../middleware/jwt_auth_middleware');

class AuthService {
    async registerUser(userData) {
        try {
            // 1. Validate input
            const validatedData = await userValidationSchema.validate(userData, {
                abortEarly: false,
                allowUnknown: true
            });

            // 2. Check if user exists
            const existingUser = await User.findOne({ email: validatedData.email });
            if (existingUser) {
                throw createErrors.Conflict(`User with email ${validatedData.email} already exists`);
            }

            // 3. Create new user
            const user = new User({
                userName: validatedData.userName,
                email: validatedData.email,
                password: validatedData.password,
                userProfile: validatedData.userProfile,
                phone: validatedData.phone,
                userStatus: validatedData.userStatus,
                device_token: validatedData.device_token
            });

            const savedUser = await user.save();

            // 4. Generate tokens
            const tokens = await this.generateAuthTokens(savedUser._id.toString());

            return { user: savedUser, tokens };
        } catch (error) {
            if (error.isJoi) {
                throw createErrors.BadRequest(error.details.map(d => d.message).join(', '));
            }
            throw error;
        }
    }

    async loginUser(credentials) {
        try {
            // 1. Validate login input
            const validatedData = await userValidationSchema.validateAsync(credentials, {
                abortEarly: false,
                allowUnknown: true
            });

            // 2. Find user
            const user = await User.findOne({ email: validatedData.email });
            if (!user) {
                throw createErrors.NotFound('User not found');
            }

            // 3. Verify password
            const isValidPassword = await user.isValidPassword(validatedData.password);
            if (!isValidPassword) {
                throw createErrors.Unauthorized('Invalid email or password');
            }

            // 4. Generate tokens
            const tokens = await this.generateAuthTokens(user._id.toString());

            return { user, tokens };
        } catch (error) {
            if (error.isJoi) {
                throw createErrors.BadRequest('Invalid email or password');
            }
            throw error;
        }
    }

    async generateAuthTokens(userId) {
        const accessToken = await signAccessToken(userId);
        const refreshToken = await signRefreshToken(userId);
        return { accessToken, refreshToken };
    }

    async handleRefreshToken(refreshToken) {
        if (!refreshToken) {
            throw createErrors.BadRequest('Refresh token is required');
        }
        const userId = await verifyRefreshToken(refreshToken);
        return userId;
    }
    
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

module.exports =  new AuthService();