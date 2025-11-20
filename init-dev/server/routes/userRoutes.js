const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/userController');

router.post('/', registerUser);
router.post('/login', loginUser);

// Novas rotas
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;