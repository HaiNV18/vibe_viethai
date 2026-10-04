/**
 * CSV Parser & Loader module for Video Admin
 */

const CSV = {
  /**
   * Parse CSV string into an array of objects
   * Handles commas, quotes, and newlines correctly
   * @param {string} text 
   * @returns {Array<Object>}
   */
  parse(text) {
    if (!text || !text.trim()) return [];

    const lines = [];
    let row = [''];
    let inQuotes = false;

    // Normalize line endings
    const cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      const nextChar = cleaned[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          row[row.length - 1] += '"';
          i++;
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push('');
      } else if (char === '\n' && !inQuotes) {
        lines.push(row);
        row = [''];
      } else {
        row[row.length - 1] += char;
      }
    }

    if (row.length > 1 || row[0] !== '') {
      lines.push(row);
    }

    if (lines.length < 2) return [];

    const headers = lines[0].map(h => h.trim());
    const data = [];

    for (let r = 1; r < lines.length; r++) {
      const values = lines[r];
      if (values.length === 1 && values[0].trim() === '') continue; // skip blank line

      const entry = {};
      headers.forEach((header, index) => {
        let val = values[index] !== undefined ? values[index].trim() : '';
        entry[header] = val;
      });
      data.push(entry);
    }

    return data;
  },

  /**
   * Stringify array of objects into CSV format
   * @param {Array<Object>} data 
   * @returns {string}
   */
  stringify(data) {
    if (!data || !data.length) return '';
    const headers = Object.keys(data[0]);
    const lines = [headers.join(',')];

    for (const item of data) {
      const row = headers.map(header => {
        let val = item[header];
        if (val === null || val === undefined) val = '';
        val = String(val);
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      lines.push(row.join(','));
    }

    return lines.join('\n');
  },

  /**
   * Fetch CSV from path with fallback to embedded seeds if fetch fails (e.g. file:// protocol)
   * @param {string} url 
   * @param {string} fallbackKey 
   * @returns {Promise<Array<Object>>}
   */
  async fetch(url, fallbackKey = '') {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.statusText}`);
      }
      const text = await response.text();
      return this.parse(text);
    } catch (err) {
      console.warn(`[CSV] Notice: fetch failed for ${url} (likely file:// protocol without local server). Using embedded seed fallback for "${fallbackKey}".`);
      if (fallbackKey && CSV.FALLBACK_SEEDS[fallbackKey]) {
        return CSV.parse(CSV.FALLBACK_SEEDS[fallbackKey]);
      }
      return [];
    }
  },

  /**
   * Default embedded seeds matching files in data/
   */
  FALLBACK_SEEDS: {
    users: `id,username,email,password,role,status,created_at
1,admin1,admin1@gmail.com,123456,ADMIN,ACTIVE,2026-10-01
2,user1,user1@gmail.com,123456,USER,ACTIVE,2026-10-01`,

    categories: `id,name,slug,description,status
1,Programming,programming,Programming tutorials,ACTIVE
2,Web Development,web-development,Web development tutorials,ACTIVE
3,Design,design,Design tutorials,ACTIVE
4,Business,business,Business tutorials,ACTIVE`,

    videos: `id,title,description,thumbnail_url,video_url,category_id,views,duration,file_size_bytes,status,created_at
1,Introduction to JavaScript,JavaScript basic lesson,https://images.unsplash.com/photo-1579468118864-ddab3493e878?w=400,https://www.w3schools.com/html/mov_bbb.mp4,1,12500,12:30,131072000,PUBLISHED,2026-09-01
2,HTML Basics,HTML introduction,https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400,https://www.w3schools.com/html/mov_bbb.mp4,2,9800,08:45,83886080,PUBLISHED,2026-09-03
3,CSS Flexbox Tutorial,Learn CSS Flexbox,https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400,https://www.w3schools.com/html/mov_bbb.mp4,2,8700,15:20,157286400,PUBLISHED,2026-09-05
4,Responsive Web Design,Responsive layout tutorial,https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400,https://www.w3schools.com/html/mov_bbb.mp4,2,7600,18:10,178257920,PUBLISHED,2026-09-07
5,JavaScript DOM,Working with DOM,https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400,https://www.w3schools.com/html/mov_bbb.mp4,1,6900,11:25,125829120,PUBLISHED,2026-09-10
6,UI Design Basics,Introduction to UI Design,https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400,https://www.w3schools.com/html/mov_bbb.mp4,3,6100,10:05,104857600,PUBLISHED,2026-09-12
7,Git Basics,Learn Git,https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400,https://www.w3schools.com/html/mov_bbb.mp4,1,5300,09:15,94371840,PUBLISHED,2026-09-14
8,Web Accessibility,Accessibility fundamentals,https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400,https://www.w3schools.com/html/mov_bbb.mp4,2,4900,13:40,115343360,PUBLISHED,2026-09-16
9,Introduction to React,React introduction,https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400,https://www.w3schools.com/html/mov_bbb.mp4,1,4500,16:00,146800640,DRAFT,2026-09-18
10,Modern CSS,Modern CSS techniques,https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400,https://www.w3schools.com/html/mov_bbb.mp4,2,3900,14:30,136314880,PUBLISHED,2026-09-20`,

    video_views: `id,video_id,view_date,view_count
1,1,2026-10-01,420
2,1,2026-10-02,510
3,1,2026-10-03,620
4,2,2026-10-01,310
5,2,2026-10-02,450
6,2,2026-10-03,520
7,3,2026-10-01,280
8,3,2026-10-02,390
9,3,2026-10-03,470
10,4,2026-10-01,210
11,4,2026-10-02,330
12,4,2026-10-03,410
13,5,2026-10-01,180
14,5,2026-10-02,260
15,5,2026-10-03,350
16,6,2026-10-01,150
17,6,2026-10-02,220
18,6,2026-10-03,310
19,7,2026-10-01,120
20,7,2026-10-02,190
21,7,2026-10-03,250
22,8,2026-10-01,100
23,8,2026-10-02,170
24,8,2026-10-03,230
25,9,2026-10-01,90
26,9,2026-10-02,130
27,9,2026-10-03,180
28,10,2026-10-01,80
29,10,2026-10-02,120
30,10,2026-10-03,160`,

    video_categories: `video_id,category_id
1,1
2,2
3,2
4,2
5,1
6,3
7,1
8,2
9,1
10,2`
  }
};

window.CSV = CSV;
