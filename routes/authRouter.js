const express = require('express');
const authController = require('./../controller/authController');
const router = express.Router();
router.post('/signup',authController.signup);
router.post('/login',authController.login)
router.post('/token',authController.token)
router.get('/logout',authController.logout)
router.post('/forgetPassword',authController.foregetPassword)
router.post('/resetPassword',authController.resetPassword)
router.get('/:userId',authController.getUser)
module.exports = router;