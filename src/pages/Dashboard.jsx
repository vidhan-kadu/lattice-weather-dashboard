import { useState, useEffect } from "react";
import { fetchDashboardData } from "../api";
import WeatherCard from "../components/WeatherCard";
import ResponsiveChart from "../components/ResponsiveChart";
import { format } from "date-fns";
import {
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Activity,
  Timer,
} from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFahrenheit, setIsFahrenheit] = useState(false);

  // Default date to today
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("GPS failed, using fallback location (Mumbai)", err);
          setLocation({ lat: 19.076, lon: 72.8777 }); // Fallback to Mumbai
        },
        { timeout: 5000 },
      );
    } else {
      setLocation({ lat: 19.076, lon: 72.8777 });
    }
  }, []);

  useEffect(() => {
    if (!location) return;

    let isMounted = true;
    setLoading(true);

    fetchDashboardData(location.lat, location.lon, selectedDate)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [location, selectedDate]);

  if (loading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Fetching real-time localized insights...</p>
      </div>
    );

  if (error)
    return (
      <div className="loader-container text-accent">
        <p>Error loading dashboard: {error}</p>
      </div>
    );

  if (!data) return null;

  const hourlyTimeCoords = data.weather.hourly.time;

  const tempChartData = hourlyTimeCoords.map((t, i) => {
    let rawTemp = data.weather.hourly.temperature_2m[i];
    let tempValue = isFahrenheit ? (rawTemp * 9) / 5 + 32 : rawTemp;
    return {
      time: format(new Date(t), "HH:mm"),
      Temp: Number(tempValue.toFixed(1)),
    };
  });

  const humidityChartData = hourlyTimeCoords.map((t, i) => ({
    time: format(new Date(t), "HH:mm"),
    Humidity: data.weather.hourly.relative_humidity_2m[i],
  }));

  const precipChartData = hourlyTimeCoords.map((t, i) => ({
    time: format(new Date(t), "HH:mm"),
    Precipitation: data.weather.hourly.precipitation[i],
  }));

  const visibChartData = hourlyTimeCoords.map((t, i) => ({
    time: format(new Date(t), "HH:mm"),
    Visibility: data.weather.hourly.visibility[i],
  }));

  const windChartData = hourlyTimeCoords.map((t, i) => ({
    time: format(new Date(t), "HH:mm"),
    WindSpeed: data.weather.hourly.wind_speed_10m[i],
  }));

  const aqiHourlyData = data.aqi?.hourly?.time
    ? data.aqi.hourly.time.map((t, i) => ({
        time: format(new Date(t), "HH:mm"),
        PM10: data.aqi.hourly.pm10[i],
        PM2_5: data.aqi.hourly.pm2_5[i],
      }))
    : [];

  const handleDateChange = (e) => setSelectedDate(e.target.value);

  const currW = data.weather.current;
  const currD = data.weather.daily;
  const currA = data.aqi?.current || {};

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Current Outlook</h1>
          <p className="text-secondary">
            Localized insights for {location?.lat.toFixed(2)}°,{" "}
            {location?.lon.toFixed(2)}°
          </p>
        </div>
        <div className="date-selector-wrapper">
          <Timer size={18} className="text-accent" />
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
        </div>
      </div>

      <div className="metrics-grid">
        <WeatherCard
          icon={Thermometer}
          title="Temperature"
          value={`${currW.temperature_2m || "--"}°C`}
          sub={
            <span>
              Min: {currD.temperature_2m_min?.[0]}°C | Max:{" "}
              {currD.temperature_2m_max?.[0]}°C
            </span>
          }
        />
        <WeatherCard
          icon={Droplets}
          title="Atmospheric"
          value={`${currW.relative_humidity_2m || "--"}%`}
          sub={`UV Index: ${currD.uv_index_max?.[0] || "--"} | Precip: ${currW.precipitation} mm`}
        />
        <WeatherCard
          icon={Sun}
          title="Sun Cycle"
          value={
            currD.sunrise?.[0]
              ? format(new Date(currD.sunrise[0]), "HH:mm")
              : "--"
          }
          sub={`Sunset: ${currD.sunset?.[0] ? format(new Date(currD.sunset[0]), "HH:mm") : "--"}`}
        />
        <WeatherCard
          icon={Wind}
          title="Wind & Rain Prob"
          value={`${currD.wind_speed_10m_max?.[0] || "--"} km/h`}
          sub={`Precip Prob Max: ${currD.precipitation_probability_max?.[0] || "--"}%`}
        />
        <WeatherCard
          icon={Activity}
          title="Air Quality (AQI)"
          value={`${currA.european_aqi || "--"}`}
          sub={`PM2.5: ${currA.pm2_5 || "--"} | PM10: ${currA.pm10 || "--"}`}
        />
        <WeatherCard
          icon={Activity}
          title="Gases (μg/m³)"
          value={`CO: ${currA.carbon_monoxide || "--"}`}
          sub={`CO2: ${currA.carbon_dioxide || "--"} | NO2: ${currA.nitrogen_dioxide || "--"} | SO2: ${currA.sulphur_dioxide || "--"}`}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2>Hourly Visualizations</h2>
        <button
          className="glass-panel"
          style={{
            padding: "0.4rem 0.8rem",
            cursor: "pointer",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
          onClick={() => setIsFahrenheit(!isFahrenheit)}
        >
          Toggle temp to {isFahrenheit ? "°C" : "°F"}
        </button>
      </div>

      <div className="charts-grid">
        <div className="chart-container-card glass-panel">
          <h3>Temperature ({isFahrenheit ? "°F" : "°C"})</h3>
          <ResponsiveChart
            data={tempChartData}
            lines={[{ key: "Temp", color: "#ff7300" }]}
            ySuffix={isFahrenheit ? "°F" : "°C"}
          />
        </div>

        <div className="chart-container-card glass-panel">
          <h3>Relative Humidity (%)</h3>
          <ResponsiveChart
            data={humidityChartData}
            lines={[{ key: "Humidity", color: "#38bdf8" }]}
            ySuffix="%"
            type="area"
          />
        </div>

        <div className="chart-container-card glass-panel">
          <h3>Precipitation (mm)</h3>
          <ResponsiveChart
            data={precipChartData}
            lines={[{ key: "Precipitation", color: "#6366f1" }]}
            type="bar"
            ySuffix=" mm"
          />
        </div>

        <div className="chart-container-card glass-panel">
          <h3>Visibility (m)</h3>
          <ResponsiveChart
            data={visibChartData}
            lines={[{ key: "Visibility", color: "#10b981" }]}
            ySuffix="m"
            type="area"
          />
        </div>

        <div className="chart-container-card glass-panel">
          <h3>Wind Speed (km/h)</h3>
          <ResponsiveChart
            data={windChartData}
            lines={[{ key: "WindSpeed", color: "#a855f7" }]}
            ySuffix=" km/h"
          />
        </div>

        <div className="chart-container-card glass-panel">
          <h3>PM10 & PM2.5 (μg/m³)</h3>
          <ResponsiveChart
            data={aqiHourlyData}
            lines={[
              { key: "PM10", color: "#f59e0b" },
              { key: "PM2_5", color: "#ef4444" },
            ]}
            ySuffix=" μg"
            type="line"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
