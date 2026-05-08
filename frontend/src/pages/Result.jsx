import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSessionToken } from "../utils/authSession";
import { downloadSingleAuditPdf } from "../utils/pdfReport";

const COLORS = ["#4DA8DA", "#2E8BC0", "#145DA0", "#0B3C5D", "#1B4965"];

const renderInlineMarkdown = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    return (
      <React.Fragment key={index}>
        {part}
      </React.Fragment>
    );
  });
};

const renderRichSummary = (text) => {
  if (!text) return null;

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const content = [];
  let bulletBuffer = [];

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;

    content.push(
      <ul key={`bullets-${content.length}`} className="mb-3">
        {bulletBuffer.map((item, index) => (
          <li key={index} style={{ lineHeight: "1.7" }}>
            {renderInlineMarkdown(item)}
          </li>
        ))}
      </ul>
    );

    bulletBuffer = [];
  };

  lines.forEach((line) => {
    // # Heading / ## Sub-heading support
    if (line.startsWith("#")) {
      flushBullets();

      const headingText = line.replace(/^#+\s*/, "");
      content.push(
        <h5
          key={`heading-${content.length}`}
          className="mt-3 mb-2"
          style={{ color: "#0B3C5D", fontWeight: 700 }}
        >
          {renderInlineMarkdown(headingText)}
        </h5>
      );
      return;
    }

    // -, *, 1. bullet support
    if (/^(-|\*|\d+\.)\s+/.test(line)) {
      bulletBuffer.push(line.replace(/^(-|\*|\d+\.)\s+/, ""));
      return;
    }

    flushBullets();

    content.push(
      <p key={`para-${content.length}`} className="mb-2" style={{ lineHeight: "1.8" }}>
        {renderInlineMarkdown(line)}
      </p>
    );
  });

  flushBullets();

  return content;
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI sections
  const [summary, setSummary] = useState("");
  const [savings, setSavings] = useState([]);
  const [alternatives, setAlternatives] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateTools = location.state?.audit?.tools || [];
        const stateSummary = location.state?.summary || "";

        // Show freshly generated response immediately after submit.
        if (stateTools.length > 0) {
          const formatted = stateTools.map((tool) => ({
            name: tool.tool,
            plan: tool.plan || "-",
            cost: Number(tool.cost ?? 0),
            seats: Number(tool.seats ?? 0),
          }));

          setData(formatted);
          setSummary(stateSummary);
          setSavings([]);
          setAlternatives([]);
          setLoading(false);
          return;
        }

        const token = getSessionToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(
          "http://localhost:8080/api/ai/latest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const json = await res.json();
        const latest = json?.data;

        if (!latest?.tools?.length) {
          setLoading(false);
          return;
        }

        const formatted = latest.tools.map((tool) => ({
          name: tool.tool,
          plan: tool.plan || "-",
          cost: Number(tool.cost ?? 0),
          seats: tool.seats,
        }));

        setData(formatted);
        setSummary(latest.summary || "");
        setSavings(latest.costSavingSuggestions || []);
        setAlternatives(latest.alternativeTools || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state, navigate]);

  // Loader
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Analyzing audit data...</h4>
      </div>
    );
  }

  // Empty State
  if (data.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h3>No data found</h3>
        <p>Add tools first to see audit results</p>
      </div>
    );
  }

  const total = data.reduce(
    (sum, t) => sum + Number(t.cost || 0),
    0
  );
  const handleDownloadPdf = () => {
    const reportTools = data.map((tool) => ({
      tool: tool.name,
      plan: tool.plan || "-",
      seats: tool.seats,
      cost: tool.cost,
    }));

    downloadSingleAuditPdf({
      filename: "audit-result-report.pdf",
      tools: reportTools,
      summary,
      auditDate: new Date().toLocaleString(),
    });
  };

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-sm border-0">

        {/* HEADER */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">Audit Result</h2>

          <h4 className="mt-3">
            Total Monthly Spend:{" "}
            <span style={{ color: "#145DA0" }}>
              ${total}
            </span>
          </h4>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={handleDownloadPdf}
          >
            Download PDF Report
          </button>
        </div>

        {/* PIE CHART */}
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="cost"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={3}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BREAKDOWN */}
        <div className="mt-5">
          <h4 className="mb-3">Tool Breakdown</h4>

          <ul className="list-group">
            {data.map((tool, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{tool.name}</strong>
                </div>

                <div>
                  💰 ${tool.cost} | 👥 {tool.seats}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* SUMMARY */}
        {summary && (
          <div
            className="p-4 mt-5 rounded"
            style={{
              background: "#f4f9fd",
              borderLeft: "5px solid #145DA0",
            }}
          >
            <h4
              style={{
                color: "#145DA0",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              AI Summary
            </h4>

            <div style={{ marginBottom: 0 }}>
              {renderRichSummary(summary)}
            </div>
          </div>
        )}

        {/* COST SAVING */}
        {savings.length > 0 && (
          <div
            className="p-4 mt-4 rounded"
            style={{
              background: "#f9fcff",
              borderLeft: "5px solid #2E8BC0",
            }}
          >
            <h4
              style={{
                color: "#145DA0",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              Cost Saving Suggestions
            </h4>

            <ul className="mb-0">
              {savings.map((item, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "12px",
                    lineHeight: "1.7",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ALTERNATIVES */}
        {alternatives.length > 0 && (
          <div
            className="p-4 mt-4 rounded"
            style={{
              background: "#f7fbff",
              borderLeft: "5px solid #0B3C5D",
            }}
          >
            <h4
              style={{
                color: "#0B3C5D",
                fontWeight: "700",
                marginBottom: "15px",
              }}
            >
              Alternative Tools
            </h4>

            <ul className="mb-0">
              {alternatives.map((tool, index) => (
                <li
                  key={index}
                  style={{
                    marginBottom: "12px",
                    lineHeight: "1.7",
                  }}
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default Result;