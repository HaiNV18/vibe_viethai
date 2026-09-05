const weatherCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

/**
 * Maps WMO Weather Code to Vietnamese description and FontAwesome icon
 * @param {number} code WMO Weather Code
 * @returns {{ description: string, iconClass: string }}
 */
export function mapWmoCodeToVietnamese(code) {
  switch (code) {
    case 0:
      return { description: 'Trời quang đãng, nắng ấm', iconClass: 'fa-sun' };
    case 1:
      return { description: 'Hầu như không mây', iconClass: 'fa-sun' };
    case 2:
      return { description: 'Có mây rải rác', iconClass: 'fa-cloud-sun' };
    case 3:
      return { description: 'Trời u ám nhiều mây', iconClass: 'fa-cloud' };
    case 45:
    case 48:
      return { description: 'Có sương mù', iconClass: 'fa-smog' };
    case 51:
    case 53:
    case 55:
      return { description: 'Mưa phun nhẹ', iconClass: 'fa-cloud-rain' };
    case 61:
    case 63:
      return { description: 'Mưa vừa', iconClass: 'fa-cloud-showers-heavy' };
    case 65:
      return { description: 'Mưa rất to', iconClass: 'fa-cloud-showers-heavy' };
    case 71:
    case 73:
    case 75:
      return { description: 'Có tuyết rơi', iconClass: 'fa-snowflake' };
    case 80:
    case 81:
    case 82:
      return { description: 'Mưa rào nặng hạt', iconClass: 'fa-cloud-showers-water' };
    case 95:
    case 96:
    case 99:
      return { description: 'Có dông bão sét', iconClass: 'fa-cloud-bolt' };
    default:
      return { description: 'Thời tiết bình thường', iconClass: 'fa-cloud' };
  }
}

export const WeatherService = {
  /**
   * Fetches weather data for a city using Open-Meteo APIs with Timeout & Error handling
   * @param {string} cityName 
   * @param {number} timeoutMs Timeout in milliseconds (default 5000ms)
   * @returns {Promise<{ city: string, country: string, temp: number, description: string, iconClass: string, windspeed: number }>}
   */
  async getWeatherByCity(cityName, timeoutMs = 5000) {
    if (!cityName || !cityName.trim()) {
      throw new Error('Vui lòng nhập tên thành phố.');
    }

    const cleanCity = cityName.trim();
    const cacheKey = cleanCity.toLowerCase();
    const now = Date.now();

    // Check Cache
    if (weatherCache.has(cacheKey)) {
      const cached = weatherCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_TTL_MS) {
        return cached.data;
      }
    }

    // Helper for fetch with timeout
    const fetchWithTimeout = async (url) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        if (!res.ok) throw new Error('API_ERROR');
        return await res.json();
      } catch (err) {
        clearTimeout(id);
        if (err.name === 'AbortError') {
          throw new Error('API phản hồi quá chậm. Vui lòng thử lại sau.');
        }
        throw err;
      }
    };

    // Step 1: Geocoding API to search coordinates
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=vi&format=json`;
    const geoData = await fetchWithTimeout(geoUrl);

    if (!geoData || !geoData.results || geoData.results.length === 0) {
      throw new Error(`Không tìm thấy thông tin thành phố "${cleanCity}".`);
    }

    const location = geoData.results[0];
    const { latitude, longitude, name: foundCity, country } = location;

    // Step 2: Forecast API to get current weather
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherRes = await fetchWithTimeout(weatherUrl);

    if (!weatherRes || !weatherRes.current_weather) {
      throw new Error('Không thể tải dữ liệu thời tiết lúc này.');
    }

    const cw = weatherRes.current_weather;
    const weatherInfo = mapWmoCodeToVietnamese(cw.weathercode);

    const result = {
      city: foundCity || cleanCity,
      country: country || 'Việt Nam',
      temp: Math.round(cw.temperature),
      description: weatherInfo.description,
      iconClass: weatherInfo.iconClass,
      windspeed: cw.windspeed
    };

    // Save to Cache
    weatherCache.set(cacheKey, { timestamp: now, data: result });

    return result;
  }
};
