/**
 * Validates Email address
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validates Username (5 to 15 chars, alphanumeric only)
 * @param {string} username 
 * @returns {boolean}
 */
export function isValidUsername(username) {
  if (!username) return false;
  const re = /^[a-zA-Z0-9]{5,15}$/;
  return re.test(username);
}

/**
 * Validates Password (5 to 15 chars)
 * @param {string} password 
 * @returns {boolean}
 */
export function isValidPassword(password) {
  if (!password) return false;
  return password.length >= 5 && password.length <= 15;
}

/**
 * Validates Phone number (10 to 11 digits)
 * @param {string} phone 
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const re = /^[0-9]{10,11}$/;
  return re.test(phone.replace(/[\s\-\+\(\)]/g, ''));
}
