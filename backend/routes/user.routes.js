const express = require('express');
const { registerUser, loginUser, getUser } = require('../handlers/user.handlers.js');
const { authMiddleware } = require('../middlewares/auth.middleware.js');

const userRouter = express.Router()

userRouter.post('/user/register', registerUser);
userRouter.post('/user/login', loginUser);

module.exports = userRouter