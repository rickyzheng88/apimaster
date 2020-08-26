const express = require('express');
const { 
    register,
    login,
    getUser,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/register')
    .post(register);

router.route('/login')
    .post(login)

router.route('/user')
    .get(protect, getUser);

router.route('/forgotPassword')
    .post(forgotPassword);

router.route('/resetpassword/:resettoken')
    .put(resetPassword);

router.put('/updatedetails', protect, updateDetails);

router.put('/updatepassword', protect, updatePassword);

module.exports = router;