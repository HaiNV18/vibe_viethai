// Form & Input Validation Helpers

export class ValidationUtil {
  static isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  static isValidPassword(password) {
    return typeof password === 'string' && password.length >= 8;
  }

  static isNotEmpty(str) {
    return typeof str === 'string' && str.trim().length > 0;
  }

  static isPositiveInteger(val) {
    const num = Number(val);
    return Number.isInteger(num) && num >= 0;
  }

  static isValidUrl(url) {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }
}
