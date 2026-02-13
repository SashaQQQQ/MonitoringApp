import { PieChart, Pie, Cell } from "recharts";

export default function DonutChart({ progress }) {
  const data = [
    { name: "Ready", value: progress },
    { name: "Not ready", value: 100 - progress },
  ];

  const COLORS = ["#0088FE", "#FF8042"];
  return (
    <div>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div
        style={{
          display: "flex",
          gap: "30%",
          justifyContent: "space-around",
          textAlign: "center",
        }}
      >
        <p>
          Ready <br /> {data[0].value}%
        </p>
        <p>
          Not <br /> ready {data[1].value}%
        </p>
      </div>
    </div>
  );
}
