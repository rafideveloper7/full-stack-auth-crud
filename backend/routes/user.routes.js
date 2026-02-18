const express = require('express');
const { registerUser, loginUser, getCurrentUser } = require('../handlers/user.handlers.js'); 
const { authMiddleware } = require('../middlewares/auth.middleware.js');

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser); 
userRouter.post('/login', loginUser);

// Protected route - current user info
userRouter.get('/me', authMiddleware, getCurrentUser);  

module.exports = userRouter;