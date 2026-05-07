import React, { useState } from "react";
import ToolInput from "../components/ToolInput";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();

  const [toolsData, setToolsData] = useState([
    { tool: "", plan: "", cost: "", seats: "" },
  ]);

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTool = () => {
    setToolsData([
      ...toolsData,
      { tool: "", plan: "", cost: "", seats: "" },
    ]);
  };

  const removeTool = (index) => {
    setToolsData(toolsData.filter((_, i) => i !== index));
  };

  const updateTool = (index, field, value) => {
    const updated = [...toolsData];
    updated[index][field] = value;
    setToolsData(updated);
  };

  const validateAll = () => {
    const newErrors = toolsData.map((t) => ({
      tool: t.tool ? "" : "Tool required",
      plan: t.plan ? "" : "Plan required",
      cost: t.cost > 0 ? "" : "Cost must be > 0",
      seats: t.seats > 0 ? "" : "Seats must be > 0",
    
    }));

    setErrors(newErrors);

    return newErrors.every(
      (e) => !e.tool && !e.plan && !e.cost && !e.seats && !e.version
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools: toolsData.map((t) => ({
            tool: t.tool,
            plan: t.plan,
            cost: Number(t.cost),
            seats: Number(t.seats),
            
          })),
        }),
      });

      const data = await res.json();

      console.log("Saved:", data);

      navigate("/result");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="container py-4">
      <div className="card p-4">

        <h2>Audit AI</h2>

        <form onSubmit={handleSubmit}>

          {toolsData.map((tool, index) => (
            <ToolInput
              key={index}
              index={index}
              toolData={tool}
              updateTool={updateTool}
              removeTool={removeTool}
              errors={errors[index] || {}}
            />
          ))}

          <button type="button" onClick={addTool}>
            + Add Tool
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Analyze"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Form;