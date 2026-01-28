const express = require('express');
const { registerUser, loginUser, getUser } = require('../handlers/user.handlers.js');
const { authMiddleware } = require('../middlewares/auth.middleware.js');

const router = express.Router()

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/users', authMiddleware, getUser);

module.exports = router