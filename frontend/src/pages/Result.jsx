import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4DA8DA", "#2E8BC0", "#145DA0", "#0B3C5D", "#1B4965"];

const Result = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/audit/latest");
      const json = await res.json();

      const latest = json.data;

      if (!latest) {
        setData([]);
        setLoading(false);
        return;
      }

      const formatted = latest.tools.map((tool) => ({
        name: tool.tool,
        value: tool.totalCost,
      }));

      setData(formatted);

    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  fetchData();
}, []);

  // 🔥 Loader UI
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Analyzing audit data...</h4>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>No data found</h3>
        <p>Add tools first to see audit results</p>
      </div>
    );
  }

  const total = data.reduce((sum, t) => sum + t.value, 0);

  return (
    <div className="container py-5">
      <div className="card card-custom p-4">

        <h2 className="title mb-3 text-center">Audit Result</h2>

        <h4 className="text-center mb-4">
          Total Monthly Spend:{" "}
          <span style={{ color: "#0B3C5D" }}>${total}</span>
        </h4>

        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4">
          <h5>Breakdown</h5>
          <ul className="list-group">
            {data.map((tool, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between"
              >
                <span>{tool.name}</span>
                <span>${tool.value}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Result;