/**
 * Generate a unique 6-digit referral code
 * @returns {string} - A 6-digit alphanumeric code
 */
function generateReferralCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

/**
 * Generate a unique referral code that doesn't exist in the users array
 * @param {Array} users - Array of existing users
 * @returns {string} - A unique 6-digit referral code
 */
function generateUniqueReferralCode(users) {
  let code;
  let isUnique = false;
  
  while (!isUnique) {
    code = generateReferralCode();
    isUnique = !users.some(user => user.referralCode === code);
  }
  
  return code;
}

/**
 * Generate a unique user ID
 * @param {Array} users - Array of existing users
 * @returns {number} - A unique user ID
 */
function generateUniqueId(users) {
  if (users.length === 0) return 1;
  return Math.max(...users.map(user => user.id)) + 1;
}

module.exports = {
  generateReferralCode,
  generateUniqueReferralCode,
  generateUniqueId
};
