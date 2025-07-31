const { generateUniqueReferralCode, generateUniqueId } = require('../utils/helpers');

// In-memory user storage
let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    referralCode: "ABC123",
    points: 0
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    referralCode: "DEF456",
    points: 0
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    referralCode: "GHI789",
    points: 0
  }
];

class User {
  /**
   * Get all users
   * @returns {Array} - Array of all users
   */
  static getAllUsers() {
    return users;
  }

  /**
   * Find user by referral code
   * @param {string} referralCode - The referral code to search for
   * @returns {Object|null} - User object or null if not found
   */
  static findByReferralCode(referralCode) {
    return users.find(user => user.referralCode === referralCode) || null;
  }

  /**
   * Find user by email
   * @param {string} email - The email to search for
   * @returns {Object|null} - User object or null if not found
   */
  static findByEmail(email) {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data object
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} [userData.referralCode] - Optional referral code from existing user
   * @returns {Object} - Created user object
   */
  static createUser({ name, email, referralCode = null }) {
    // Check if email already exists
    if (User.findByEmail(email)) {
      throw new Error('User with this email already exists');
    }

    // Generate unique ID and referral code for the new user
    const newUser = {
      id: generateUniqueId(users),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      referralCode: generateUniqueReferralCode(users),
      points: 0
    };

    // If a referral code was provided, validate it and award points to referrer
    if (referralCode) {
      const referrer = User.findByReferralCode(referralCode);
      if (referrer) {
        referrer.points += 10;
      } else {
        throw new Error('Invalid referral code');
      }
    }

    // Add the new user to the array
    users.push(newUser);
    
    return newUser;
  }

  /**
   * Award points to a user
   * @param {string} referralCode - The referral code of the user to award points to
   * @param {number} points - Number of points to award
   * @returns {boolean} - True if successful, false if user not found
   */
  static awardPoints(referralCode, points) {
    const user = User.findByReferralCode(referralCode);
    if (user) {
      user.points += points;
      return true;
    }
    return false;
  }

  /**
   * Get user count
   * @returns {number} - Total number of users
   */
  static getUserCount() {
    return users.length;
  }
}

module.exports = User;
