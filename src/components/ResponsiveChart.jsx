import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

export default function ResponsiveChart({
  data,
  lines,
  type = "line",
  ySuffix = "",
}) {
  if (!data || data.length === 0)
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        No data available
      </div>
    );

  const renderTooltipFormatter = (value) => {
    return [`${value}${ySuffix}`];
  };

  const ChartComponent =
    type === "area" ? AreaChart : type === "bar" ? BarChart : LineChart;

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={renderTooltipFormatter}
            contentStyle={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
              borderRadius: "8px",
              color: "var(--text-primary)",
            }}
            itemStyle={{ color: "var(--text-accent)" }}
          />
          {lines.map((line) => {
            if (type === "area") {
              return (
                <Area
                  key={line.key}
                  type="monotone"
                  dataKey={line.key}
                  stroke={line.color}
                  fill={line.color}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              );
            }
            if (type === "bar") {
              return (
                <Bar
                  key={line.key}
                  dataKey={line.key}
                  fill={line.color}
                  radius={[4, 4, 0, 0]}
                />
              );
            }
            return (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            );
          })}

          <Brush
            dataKey="time"
            height={30}
            stroke="var(--text-secondary)"
            fill="rgba(255,255,255,0.05)"
            travellerWidth={10}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
