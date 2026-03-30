<div align="center">

# 🌤️ Lattice Weather Dashboard

**A high-performance, responsive weather dashboard built with React 19**

[![Live Demo](https://img.shields.io/badge/_Live_Demo-Vercel-000?style=for-the-badge&logo=vercel)](https://lattice-weather-dashboard.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

_Real-time weather insights & historical trends — powered by browser GPS and the Open-Meteo API_

</div>

---

## ✨ Key Features

- 📍 **Auto GPS Detection** — Localized weather on page load (fallback: Mumbai)
- 🌡️ **Live Weather Metrics** — Temperature, humidity, UV, wind, precipitation & sun cycle
- 🏭 **Air Quality** — AQI, PM2.5, PM10, CO, CO₂, NO₂, SO₂
- 📊 **6 Interactive Hourly Charts** — With zoom (Brush), tooltips & °C/°F toggle
- 📅 **Historical Analysis** — Custom date-range trends up to 2 years
- 📱 **Fully Responsive** — Desktop, tablet & mobile optimized
- ⚡ **Sub-500ms Render** — Parallel API calls via `Promise.all()`

---

## 🖥️ Pages

### Page 1 — Current Weather & Hourly Forecast

Displays current metrics (temp, humidity, UV, wind, AQI, gases) and 6 hourly charts (temperature, humidity, precipitation, visibility, wind speed, PM10 & PM2.5) for a selected date.

### Page 2 — Historical Date Range

Analyze long-term trends with selectable dates (max 2 years): temperature (mean/max/min), sun cycle (IST), precipitation totals, wind trends, and air quality.

---

## 🏗️ Tech Stack

| Technology                | Purpose                                                 |
| :------------------------ | :------------------------------------------------------ |
| **React 19** + **Vite 8** | UI framework & build tooling                            |
| **React Router v7**       | Client-side navigation                                  |
| **Recharts**              | Interactive charts (Line, Area, Bar + Brush zoom)       |
| **date-fns**              | Date formatting                                         |
| **Lucide React**          | Icon set                                                |
| **Open-Meteo API**        | Weather, archive & air quality data (no API key needed) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── WeatherCard.jsx        # Reusable metric card
│   └── ResponsiveChart.jsx    # Universal chart component
├── pages/
│   ├── Dashboard.jsx          # Current weather & hourly charts
│   └── Historical.jsx         # Historical trend analysis
├── api.js                     # Open-Meteo API layer
├── App.jsx                    # Routing & navigation
└── main.jsx                   # Entry point
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/vidhan-kadu/lattice-weather-dashboard.git
cd lattice-weather-dashboard
npm install
npm run dev
```

Open `http://localhost:5173` — allow location access for localized data.

---

## 🔗 Links

|              |                                                                                       |
| ------------ | ------------------------------------------------------------------------------------- |
| **Live App** | [lattice-weather-dashboard.vercel.app](https://lattice-weather-dashboard.vercel.app/) |
| **API Docs** | [open-meteo.com/en/docs](https://open-meteo.com/en/docs)                              |

---

<div align="center">

**Built with ❤️ for the Lattice Innovations ReactJS Selection Test.**

</div>
