export default function WeatherCard({ icon: Icon, title, value, sub }) {
  return (
    <div
      className="weather-card glass-panel flex-center"
      style={{ alignItems: "flex-start" }}
    >
      <div className="card-header">
        <div
          style={{
            background: "rgba(56, 189, 248, 0.1)",
            padding: "0.5rem",
            borderRadius: "50%",
            display: "flex",
          }}
        >
          <Icon size={20} className="text-accent" />
        </div>
        <span>{title}</span>
      </div>
      <div className="card-value">{value}</div>
      <div className="card-subtext">{sub}</div>
    </div>
  );
}
