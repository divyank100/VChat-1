const JWT = require('jsonwebtoken');
const createErrors = require('http-errors');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.JWT_ACCESS_SECRET;
            const options = {
                expiresIn: '15m',
                // issuer: 'https://www.example.com',
                audience: userId
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createErrors.InternalServerError());
                }
                resolve(token);
            });
        });
    },

    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createErrors.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message =
                    err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    }, 

    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.JWT_REFRESH_SECRET;
            const options = {
                expiresIn: '1y',
                // issuer: 'https://www.example.com',
                audience: userId
            };
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createErrors.InternalServerError());
                }
                resolve(token);
            });
        });
    }, 

    verifyRefreshToken: (req, res, next) => {
        if(!req.headers['authorization']) return next(createErrors.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                const message =
                    err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payload = payload
            next()
        })
    }
}
