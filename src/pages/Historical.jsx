import { useState, useEffect } from "react";
import { fetchHistoricalData } from "../api";
import ResponsiveChart from "../components/ResponsiveChart";
import { format, subDays, differenceInDays } from "date-fns";
import { Calendar } from "lucide-react";

const Historical = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  // Defaults: Last 30 days
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    end: format(subDays(new Date(), 1), "yyyy-MM-dd"), // Archive api often requires lag
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        () => setLocation({ lat: 19.076, lon: 72.8777 }),
        { timeout: 5000 },
      );
    } else {
      setLocation({ lat: 19.076, lon: 72.8777 });
    }
  }, []);

  const handleFetch = async () => {
    if (!location) return;

    // Validate Max 2 years
    const diff = differenceInDays(
      new Date(dateRange.end),
      new Date(dateRange.start),
    );
    if (diff > 730) {
      setError("Please select a date range of maximum 2 years.");
      return;
    }
    if (diff < 0) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetchHistoricalData(
        location.lat,
        location.lon,
        dateRange.start,
        dateRange.end,
      );
      setData(res);
    } catch (err) {
      setError(
        "Error fetching historical data. Archive data might not be available for this exact range.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) handleFetch();
  }, [location]);

  let tempChartData = [];
  let precipChartData = [];
  let sunChartData = [];
  let windChartData = [];
  let aqiChartData = [];

  if (data?.weather?.daily) {
    const d = data.weather.daily;
    d.time.forEach((t, i) => {
      tempChartData.push({
        time: t,
        Mean: d.temperature_2m_mean[i],
        Max: d.temperature_2m_max[i],
        Min: d.temperature_2m_min[i],
      });

      precipChartData.push({
        time: t,
        TotalPrecip: d.precipitation_sum[i],
      });

      const parseTimeToDecimal = (isoStr) => {
        if (!isoStr) return null;
        const dt = new Date(isoStr);
        return Number((dt.getHours() + dt.getMinutes() / 60).toFixed(2));
      };

      sunChartData.push({
        time: t,
        SunriseHR: parseTimeToDecimal(d.sunrise[i]),
        SunsetHR: parseTimeToDecimal(d.sunset[i]),
      });

      windChartData.push({
        time: t,
        MaxSpeed: d.wind_speed_10m_max[i],
        Direction: d.wind_direction_10m_dominant[i], // usually degrees
      });
    });
  }

  if (data?.aqi?.hourly) {
    data.aqi.hourly.time.forEach((t, i) => {
      aqiChartData.push({
        time: format(new Date(t), "yyyy-MM-dd HH:mm"),
        PM10: data.aqi.hourly.pm10[i],
        PM2_5: data.aqi.hourly.pm2_5[i],
      });
    });
  }

  return (
    <div>
      <div
        className="page-header glass-panel"
        style={{ padding: "1.5rem", marginBottom: "2rem" }}
      >
        <div>
          <h1>Historical Analysis</h1>
          <p className="text-secondary">Analyze trends up to 2 years back.</p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div>
            <label
              className="text-secondary"
              style={{
                fontSize: "0.85rem",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Start Date
            </label>
            <div className="date-selector-wrapper">
              <Calendar size={18} className="text-accent" />
              <input
                type="date"
                className="date-input"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <label
              className="text-secondary"
              style={{
                fontSize: "0.85rem",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              End Date
            </label>
            <div className="date-selector-wrapper">
              <Calendar size={18} className="text-accent" />
              <input
                type="date"
                className="date-input"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
            </div>
          </div>
          <button
            className="glass-panel text-accent"
            style={{
              padding: "0.7rem 1.5rem",
              cursor: "pointer",
              border: "1px solid var(--text-accent)",
              fontWeight: "bold",
            }}
            onClick={handleFetch}
          >
            Analyze
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            color: "#ef4444",
            padding: "1rem",
            background: "rgba(239, 68, 68, 0.1)",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Processing historical dataset...</p>
        </div>
      ) : data ? (
        <div className="charts-grid">
          <div
            className="chart-container-card glass-panel"
            style={{ gridColumn: "1 / -1" }}
          >
            <h3>Temperature Trends (°C)</h3>
            <p
              className="text-secondary"
              style={{ fontSize: "0.85rem", marginBottom: "1rem" }}
            >
              Max, Min, and Mean temperatures
            </p>
            <ResponsiveChart
              data={tempChartData}
              lines={[
                { key: "Max", color: "#ef4444" },
                { key: "Mean", color: "#f59e0b" },
                { key: "Min", color: "#3b82f6" },
              ]}
              ySuffix="°C"
            />
          </div>

          <div className="chart-container-card glass-panel">
            <h3>Precipitation Totals (mm)</h3>
            <ResponsiveChart
              data={precipChartData}
              type="bar"
              lines={[{ key: "TotalPrecip", color: "#6366f1" }]}
              ySuffix=" mm"
            />
          </div>

          <div className="chart-container-card glass-panel">
            <h3>Sun Cycle (IST Hours 0-24)</h3>
            <p
              className="text-secondary"
              style={{ fontSize: "0.85rem", marginBottom: "1rem" }}
            >
              Sunrise and Sunset time displayed in 24hr format
            </p>
            <ResponsiveChart
              data={sunChartData}
              lines={[
                { key: "SunriseHR", color: "#f59e0b" },
                { key: "SunsetHR", color: "#8b5cf6" },
              ]}
              ySuffix=" hr"
            />
          </div>

          <div className="chart-container-card glass-panel">
            <h3>Wind Trends (km/h & Degrees)</h3>
            <ResponsiveChart
              data={windChartData}
              lines={[
                { key: "MaxSpeed", color: "#10b981" },
                { key: "Direction", color: "#94a3b8" },
              ]}
            />
          </div>

          <div
            className="chart-container-card glass-panel"
            style={{ gridColumn: "1 / -1" }}
          >
            <h3>Air Quality (PM10 & PM2.5 Trends)</h3>
            {aqiChartData.length > 0 ? (
              <ResponsiveChart
                data={aqiChartData}
                lines={[
                  { key: "PM10", color: "#f59e0b" },
                  { key: "PM2_5", color: "#ef4444" },
                ]}
                ySuffix=" μg"
                type="area"
              />
            ) : (
              <p style={{ color: "var(--text-secondary)" }}>
                AQI historical data unavailable for this specific date range.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Historical;
