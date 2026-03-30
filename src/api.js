const BASE_URL_WEATHER = "https://api.open-meteo.com/v1/forecast";
const BASE_URL_AQI = "https://air-quality-api.open-meteo.com/v1/air-quality";
const BASE_URL_ARCHIVE = "https://archive-api.open-meteo.com/v1/archive";

export const fetchDashboardData = async (lat, lon, dateStr) => {
  const weatherUrl = `${BASE_URL_WEATHER}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto&start_date=${dateStr}&end_date=${dateStr}`;

  const aqiUrl = `${BASE_URL_AQI}?latitude=${lat}&longitude=${lon}&current=european_aqi,pm10,pm2_5,carbon_monoxide,carbon_dioxide,nitrogen_dioxide,sulphur_dioxide&hourly=pm10,pm2_5&timezone=auto&start_date=${dateStr}&end_date=${dateStr}`;

  try {
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl),
    ]);

    if (!weatherRes.ok || !aqiRes.ok)
      throw new Error("Failed to fetch dashboard data");

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();

    return { weather: weatherData, aqi: aqiData };
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    throw error;
  }
};

export const fetchHistoricalData = async (lat, lon, startDate, endDate) => {
  const weatherUrl = `${BASE_URL_ARCHIVE}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=Asia%2FKolkata&start_date=${startDate}&end_date=${endDate}`;

  const aqiUrl = `${BASE_URL_AQI}?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5&timezone=Asia%2FKolkata&start_date=${startDate}&end_date=${endDate}`;

  try {
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl),
    ]);

    if (!weatherRes.ok)
      throw new Error("Failed to fetch historical weather data");

    const weatherData = await weatherRes.json();
    let aqiData = null;

    if (aqiRes.ok) {
      aqiData = await aqiRes.json();
    } else {
      console.warn(
        "AQI data might not be available for this historical range.",
      );
    }

    return { weather: weatherData, aqi: aqiData };
  } catch (error) {
    console.error("Historical Fetch Error:", error);
    throw error;
  }
};
