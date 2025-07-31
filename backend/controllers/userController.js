const User = require('../models/User');

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
  try {
    const users = User.getAllUsers();
    
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving users'
    });
  }
};

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, referralCode } = req.body;
    
    // Create the new user
    const newUser = User.createUser({
      name,
      email,
      referralCode
    });
    
    // Response message based on whether referral code was used
    let message = 'User registered successfully';
    if (referralCode) {
      message = 'User registered successfully and 10 points awarded to referrer';
    }
    
    res.status(201).json({
      success: true,
      message,
      data: newUser
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    
    // Handle specific business logic errors
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    if (error.message === 'Invalid referral code') {
      return res.status(400).json({
        success: false,
        message: 'Invalid referral code provided'
      });
    }
    
    // Handle unexpected errors
    res.status(500).json({
      success: false,
      message: 'Internal server error while registering user'
    });
  }
};

/**
 * Get user by referral code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserByReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.params;
    
    const user = User.findByReferralCode(referralCode);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with the provided referral code'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User found successfully',
      data: user
    });
    
  } catch (error) {
    console.error('Error getting user by referral code:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving user'
    });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  getUserByReferralCode
};
