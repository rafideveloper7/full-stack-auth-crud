// backend/routes/user.routes.js
const express = require('express');
const { 
  registerUser, 
  loginUser, 
  updateUserProfile,
  getCurrentUser 
} = require('../handlers/user.handlers');
const { authMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', authMiddleware, getCurrentUser);
router.put('/profile', authMiddleware, updateUserProfile);

// Debug: Log all routes
console.log('✅ User routes registered:');
console.log('  POST /api/user/register');
console.log('  POST /api/user/login');
console.log('  GET /api/user/me');
console.log('  PUT /api/user/profile');

module.exports = router;