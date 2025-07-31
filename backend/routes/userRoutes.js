const express = require('express');
const router = express.Router();

const { 
  getAllUsers, 
  registerUser, 
  getUserByReferralCode 
} = require('../controllers/userController');
const { 
  validateRegisterRequest, 
  validateReferralCodeParam 
} = require('../middleware/validation');

// GET /api/users - Get all users
router.get('/users', getAllUsers);

// POST /api/register - Register a new user
router.post('/register', validateRegisterRequest, registerUser);

// GET /api/users/:referralCode - Get user by referral code
router.get('/users/:referralCode', validateReferralCodeParam, getUserByReferralCode);

module.exports = router;
