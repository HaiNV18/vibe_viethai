/**
 * Formats a number to Vietnamese Dong currency format (e.g. 5.990.000đ)
 * @param {number} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '0đ';
  }
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}
