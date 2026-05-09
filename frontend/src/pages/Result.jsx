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

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // AI sections
  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stateAudit = location.state?.audit;
        const stateTools = stateAudit?.tools || [];
        const stateSummary = location.state?.summary || "";

        // Show freshly generated response immediately after submit.
        if (stateTools.length > 0) {
          const formatted = stateTools.map((tool) => ({
            name: tool.tool,
            plan: tool.plan || "-",
            cost: Number(tool.totalCost ?? 0),
            seats: Number(tool.seats ?? 0),
          }));

          setData(formatted);
          setSummary(stateSummary);
          setRecommendations(stateAudit.recommendations || []);
          setTotalSavings(stateAudit.totalSavings || 0);
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
          cost: Number(tool.totalCost ?? (tool.cost * tool.seats)),
          seats: tool.seats,
        }));

        setData(formatted);
        setSummary(latest.summary || "");
        setRecommendations(latest.recommendations || []);
        setTotalSavings(latest.totalSavings || 0);
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
      <div className="card p-4 p-md-5 shadow border-0 rounded-4">

        {/* HERO: TOTAL SAVINGS */}
        <div className="text-center mb-5 text-white p-4 p-md-5 rounded-4 shadow-sm" style={{ background: "linear-gradient(135deg, #0B3C5D, #145DA0)" }}>
          <h2 className="fw-bold mb-4 opacity-75">Audit Results Ready</h2>
          <div className="row justify-content-center">
            <div className="col-md-5 mb-4 mb-md-0 border-md-end border-light border-opacity-25">
              <p className="mb-2 fs-5 text-light opacity-75">Total Monthly Savings</p>
              <h1 className="display-3 fw-bold text-info" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                ${totalSavings}
              </h1>
            </div>
            <div className="col-md-5">
              <p className="mb-2 fs-5 text-light opacity-75">Total Annual Savings</p>
              <h1 className="display-3 fw-bold text-success" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)", color: "#4ade80" }}>
                ${totalSavings * 12}
              </h1>
            </div>
          </div>
          <button
            className="btn btn-light btn-lg mt-4 fw-semibold shadow-sm px-5"
            onClick={handleDownloadPdf}
          >
            Download PDF Report
          </button>
        </div>

        {/* AI SUMMARY */}
        {summary && (
          <div className="p-4 mb-5 rounded bg-light border-start border-5 border-primary shadow-sm">
            <h5 className="fw-bold text-primary mb-3">Executive Summary</h5>
            <p className="mb-0" style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333" }}>{summary}</p>
          </div>
        )}

        {/* UPSELL / LEAD CAPTURE */}
        {totalSavings >= 500 && (
          <div className="alert alert-warning p-4 shadow-sm rounded-4 mb-5" style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a" }}>
            <h4 className="alert-heading fw-bold" style={{ color: "#b45309" }}>🚀 Unlock even more savings with Credex</h4>
            <p className="mb-0 text-dark fs-5" style={{ lineHeight: "1.6" }}>
              You have over <strong>$500/mo</strong> in potential savings! Join <strong>Credex</strong> to automatically capture these savings, negotiate better vendor rates, and secure massive AWS/Azure credits for your startup. 
              <br /><a href="#" className="alert-link mt-2 d-inline-block fw-bold text-decoration-underline" style={{ color: "#d97706" }}>Get started with Credex today →</a>
            </p>
          </div>
        )}

        {(totalSavings > 0 && totalSavings < 500) && (
          <div className="alert alert-info p-4 shadow-sm rounded-4 mb-5" style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }}>
            <h4 className="alert-heading fw-bold" style={{ color: "#1d4ed8" }}>💡 We found optimization opportunities.</h4>
            <p className="mb-4 text-dark fs-5" style={{ lineHeight: "1.6" }}>
              There is some waste in your current stack. Review the breakdown below to capture your <strong>${totalSavings}/mo</strong> in savings.
            </p>
            <div className="bg-white p-4 rounded-3 border" style={{ borderColor: "#bfdbfe" }}>
              <p className="mb-3 fw-bold text-dark fs-5">Maximize your future savings</p>
              <form className="d-flex flex-column flex-md-row gap-3">
                <input type="email" className="form-control form-control-lg" placeholder="Enter your email" required />
                <button type="submit" className="btn btn-primary btn-lg px-4 fw-bold" style={{ backgroundColor: "#2563eb", border: "none" }}>Notify Me</button>
              </form>
              <small className="text-muted d-block mt-3">Get notified when new optimizations or startup credits apply to your stack.</small>
            </div>
          </div>
        )}

        {totalSavings === 0 && (
          <div className="alert alert-success p-4 shadow-sm rounded-4 mb-5" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }}>
            <h4 className="alert-heading fw-bold" style={{ color: "#15803d" }}>🎯 You're spending well.</h4>
            <p className="mb-4 text-dark fs-5" style={{ lineHeight: "1.6" }}>
              We found zero waste in your stack. Your plan selection and seat management are highly optimal!
            </p>
            <div className="bg-white p-4 rounded-3 border" style={{ borderColor: "#bbf7d0" }}>
              <p className="mb-3 fw-bold text-dark fs-5">Stay ahead of price hikes</p>
              <form className="d-flex flex-column flex-md-row gap-3">
                <input type="email" className="form-control form-control-lg" placeholder="Enter your email" required />
                <button type="submit" className="btn btn-success btn-lg px-4 fw-bold" style={{ backgroundColor: "#16a34a", border: "none" }}>Notify Me</button>
              </form>
              <small className="text-muted d-block mt-3">Get notified when new optimizations or startup credits apply to your stack.</small>
            </div>
          </div>
        )}

        {/* PER-TOOL BREAKDOWN */}
        <div className="mb-5 mt-5">
          <h3 className="mb-4 fw-bold" style={{ color: "#0B3C5D" }}>Optimization Breakdown</h3>
          {recommendations.length > 0 ? (
            <div className="row g-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="col-12">
                  <div className="card shadow-sm border-0 h-100 rounded-4 overflow-hidden" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="card-body p-4 p-md-5">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                        <h4 className="card-title fw-bold mb-0 text-primary">{rec.tool}</h4>
                        <span className="badge bg-success fs-5 px-4 py-2 rounded-pill shadow-sm">Save ${rec.savings}/mo</span>
                      </div>
                      <div className="mb-4 p-3 bg-white rounded shadow-sm d-flex align-items-center border-start border-4 border-warning">
                        <span className="fw-bold text-dark fs-5 me-2">Recommended Action:</span> 
                        <span className="text-danger fw-bold fs-5">{rec.action}</span>
                      </div>
                      <p className="card-text text-secondary mb-0" style={{ fontSize: "1.1rem", lineHeight: "1.7" }}>
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-5 bg-light rounded-4 text-muted border">
              <span className="fs-5">No specific tool optimizations found.</span>
            </div>
          )}
        </div>

        {/* CURRENT SPEND OVERVIEW */}
        <hr className="my-5 opacity-25" />
        <div className="row mt-5">
          <div className="col-md-6 mb-4 mb-md-0">
            <h4 className="fw-bold mb-4" style={{ color: "#0B3C5D" }}>Current Spend Overview</h4>
            <div className="p-4 bg-light rounded-4 mb-4">
              <p className="mb-1 text-muted">Total Monthly Spend</p>
              <h3 className="fw-bold m-0">${total}</h3>
            </div>
            <ul className="list-group list-group-flush rounded-3 shadow-sm border">
              {data.map((tool, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom"
                >
                  <div className="fw-semibold">
                    {tool.name} <span className="text-muted fw-normal ms-1">({tool.plan})</span>
                  </div>
                  <div className="fw-bold">
                    ${tool.cost}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6">
            <div style={{ width: "100%", height: 350 }} className="bg-light rounded-4 p-3 d-flex align-items-center justify-content-center">
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="cost"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                    >
                      {data.map((_, index) => (
                         <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-muted">No data to display</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Result;