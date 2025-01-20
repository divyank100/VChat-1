const express = require('express')
const router = express.Router()
const {AuthController} = require('../../../controller/index')


router.post('/register', AuthController.register)

router.post('/login', AuthController.login)

router.post('/forgot-password',AuthController.forgotPassword)

router.post('/refresh-token', AuthController.refreshToken)

router.delete('/logout', AuthController.logout)

module.exports = router