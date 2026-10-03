/**
 * CSV Utility Module
 * Handcrafted CSV parser and serializer compliant with RFC 4180
 */
window.CSVUtils = (function () {
  /**
   * Parse a CSV string into array of objects (if header present) or array of arrays
   * @param {string} text - Raw CSV text
   * @param {boolean} hasHeader - Whether first line is header
   * @returns {Array<Object>|Array<Array<string>>}
   */
  function parseCsv(text, hasHeader = true) {
    if (!text || typeof text !== 'string') return [];

    // Standardize line endings (\r\n -> \n, \r -> \n)
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const rows = [];
    let currentRow = [];
    let currentToken = '';
    let inQuotes = false;
    let i = 0;

    while (i < normalized.length) {
      const char = normalized[i];
      const nextChar = normalized[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            // Escaped quote inside quoted field ("")
            currentToken += '"';
            i += 2;
            continue;
          } else {
            // Closing quote
            inQuotes = false;
            i++;
            continue;
          }
        } else {
          currentToken += char;
          i++;
          continue;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
          i++;
          continue;
        } else if (char === ',') {
          currentRow.push(currentToken.trim());
          currentToken = '';
          i++;
          continue;
        } else if (char === '\n') {
          currentRow.push(currentToken.trim());
          // Add row if not empty line
          if (currentRow.length > 1 || currentRow[0] !== '') {
            rows.push(currentRow);
          }
          currentRow = [];
          currentToken = '';
          i++;
          continue;
        } else {
          currentToken += char;
          i++;
          continue;
        }
      }
    }

    // Append last token if present
    if (currentToken !== '' || currentRow.length > 0) {
      currentRow.push(currentToken.trim());
      if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
      }
    }

    if (!hasHeader || rows.length === 0) {
      return rows;
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const result = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      // Skip empty lines
      if (row.length === 1 && row[0] === '') continue;
      
      const obj = {};
      for (let c = 0; c < headers.length; c++) {
        obj[headers[c]] = row[c] !== undefined ? row[c] : '';
      }
      result.push(obj);
    }

    return result;
  }

  /**
   * Escape a single CSV field value according to RFC 4180
   * @param {any} val 
   * @returns {string}
   */
  function escapeCsvField(val) {
    if (val === null || val === undefined) return '';
    let str = String(val);
    // If value contains comma, double-quote, or newline, wrap in quotes and escape internal quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  /**
   * Serialize array of objects or array of arrays into CSV text
   * @param {Array<Object>|Array<Array<any>>} rows 
   * @param {Array<string>} headers - Optional list of keys if rows are objects
   * @returns {string}
   */
  function serializeCsv(rows, headers = null) {
    if (!rows || rows.length === 0) return '';

    const lines = [];

    if (Array.isArray(rows[0])) {
      // Array of arrays
      for (const row of rows) {
        lines.push(row.map(escapeCsvField).join(','));
      }
    } else if (typeof rows[0] === 'object') {
      // Array of objects
      const keys = headers || Object.keys(rows[0]);
      lines.push(keys.map(escapeCsvField).join(','));
      for (const row of rows) {
        const line = keys.map(k => escapeCsvField(row[k]));
        lines.push(line.join(','));
      }
    }

    return lines.join('\r\n');
  }

  return {
    parseCsv,
    escapeCsvField,
    serializeCsv
  };
})();
