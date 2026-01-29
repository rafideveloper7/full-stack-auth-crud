const express = require('express');
const { registerUser, loginUser } = require('../handlers/user.handlers.js');
const { authMiddleware } = require('../middlewares/auth.middleware.js');

const userRouter = express.Router()

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
// userRouter.post('/', authMiddleware, getUser);

module.exports = userRouter