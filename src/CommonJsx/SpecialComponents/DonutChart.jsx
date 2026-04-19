import { PieChart, Pie, Cell } from "recharts";
import "../../Styles/Donut.css";
export default function DonutChart({ progress }) {
  const data = [
    { name: "Ready", value: progress },
    { name: "Not ready", value: 100 - progress },
  ];

  const COLORS = ["#0088FE", "#FF8042"];
  return (
    <div className="donutContainer">
      <PieChart width={152} height={152}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={20}
          outerRadius={70}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      <div className="infoContainer">
        <div>
          <div className="readyDonut"></div>
          <p>Ready {data[0].value}%</p>
        </div>
     
      </div>
    </div>
  );
}
