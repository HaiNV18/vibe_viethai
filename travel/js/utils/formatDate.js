/**
 * Formats YYYY-MM-DD to DD/MM/YYYY
 * @param {string} dateStr 
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Converts minutes to hours & minutes string (e.g. 130 -> "2h10m")
 * @param {number} minutes 
 * @returns {string}
 */
export function formatDuration(minutes) {
  if (!minutes) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) {
    return `${hrs}h${mins}m`;
  } else if (hrs > 0) {
    return `${hrs}h`;
  }
  return `${mins}m`;
}
