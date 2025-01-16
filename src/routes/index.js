const express = require('express')
const router = express.Router()

const v1AuthRoutes = require('./v1/auth/auth_routes')

router.use('/v1/auth', v1AuthRoutes)

module.exports = router