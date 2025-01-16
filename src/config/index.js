const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.MONGO_DB_URL,
    DB_NAME: process.env.DB_NAME
}