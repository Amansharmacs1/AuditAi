import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4DA8DA", "#2E8BC0", "#145DA0", "#0B3C5D", "#1B4965"];

const ShareResult = () => {
  const { shareId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [summary, setSummary] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

  const [copySuccess, setCopySuccess] = useState(false);
  const shareUrl = window.location.href;

  useEffect(() => {
    const fetchSharedAudit = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/leads/share/${shareId}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to load shared audit.");
        }

        const auditData = json.data;
        if (!auditData || !auditData.tools) {
          throw new Error("Invalid audit data.");
        }

        const formatted = auditData.tools.map((tool) => ({
          name: tool.tool,
          plan: tool.plan || "-",
          cost: Number(tool.totalCost ?? (tool.cost * tool.seats)),
          seats: tool.seats,
        }));

        setData(formatted);
        setSummary(auditData.aiSummary || "");
        setRecommendations(auditData.recommendations || []);
        setTotalSavings(auditData.totalSavings || 0);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedAudit();
  }, [shareId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = `I found $${totalSavings}/mo in potential SaaS savings using AuditAI! Check out my optimization breakdown:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  // Loader
  if (loading) {
    return (
      <div className="container py-5 text-center mt-5">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <h4>Loading Shared Audit...</h4>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="container py-5 text-center mt-5">
        <h3 className="text-danger">Audit Not Found</h3>
        <p className="text-muted">{error}</p>
        <Link to="/" className="btn btn-primary mt-3">Run Your Own Audit</Link>
      </div>
    );
  }

  const totalSpend = data.reduce((sum, t) => sum + Number(t.cost || 0), 0);

  return (
    <>
      <Helmet>
        <title>SaaS Spend Audit | AuditAI</title>
        <meta name="description" content={`Saved potential of $${totalSavings * 12}/year using AuditAI`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="My SaaS Spend Optimization Audit" />
        <meta property="og:description" content={`I found $${totalSavings}/mo in SaaS savings. Generate your own audit with AuditAI.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={shareUrl} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="My SaaS Spend Optimization Audit" />
        <meta name="twitter:description" content={`Saved potential of $${totalSavings * 12}/year using AuditAI. Find out how much you can save!`} />
      </Helmet>

      <div className="container py-5">
        
        {/* VIRAL BANNER */}
        <div className="bg-white border rounded-4 p-4 d-flex flex-column flex-md-row align-items-center justify-content-between mb-4 shadow-sm">
          <div>
            <h5 className="fw-bold text-primary mb-1">AuditAI Public Result</h5>
            <p className="text-muted mb-0 small">This is a read-only shared audit. Start your own analysis to find hidden savings.</p>
          </div>
          <Link to="/" className="btn btn-primary fw-bold px-4 py-2 mt-3 mt-md-0 shadow-sm text-nowrap">
            Generate Your Own Audit
          </Link>
        </div>

        <div className="card p-4 p-md-5 shadow border-0 rounded-4">
          
          {/* HERO: TOTAL SAVINGS */}
          <div className="text-center mb-5 text-white p-4 p-md-5 rounded-4 shadow-sm position-relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0B3C5D, #145DA0)" }}>
            <h2 className="fw-bold mb-4 opacity-75">Audit Optimization Results</h2>
            <div className="row justify-content-center">
              <div className="col-md-5 mb-4 mb-md-0 border-md-end border-light border-opacity-25">
                <p className="mb-2 fs-5 text-light opacity-75">Total Monthly Spend</p>
                <h1 className="display-4 fw-bold text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                  ${totalSpend}
                </h1>
              </div>
              <div className="col-md-5">
                <p className="mb-2 fs-5 text-light opacity-75">Potential Monthly Savings</p>
                <h1 className="display-4 fw-bold text-success" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)", color: "#4ade80" }}>
                  ${totalSavings}
                </h1>
              </div>
            </div>
            
            {/* Share Controls */}
            <div className="mt-5 pt-4 border-top border-light border-opacity-25">
              <p className="mb-3 fw-semibold">Share this audit with your team</p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button className="btn btn-light fw-bold" onClick={handleCopyLink}>
                  {copySuccess ? "✅ Link Copied!" : "🔗 Copy Link"}
                </button>
                <button className="btn btn-info text-white fw-bold" onClick={shareOnTwitter} style={{ backgroundColor: "#1DA1F2", borderColor: "#1DA1F2" }}>
                  🐦 Twitter
                </button>
                <button className="btn btn-primary text-white fw-bold" onClick={shareOnLinkedIn} style={{ backgroundColor: "#0077b5", borderColor: "#0077b5" }}>
                  💼 LinkedIn
                </button>
              </div>
            </div>
          </div>

          {/* AI SUMMARY */}
          {summary && (
            <div className="p-4 mb-5 rounded bg-light border-start border-5 border-primary shadow-sm">
              <h5 className="fw-bold text-primary mb-3">Executive Summary</h5>
              <p className="mb-0" style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333" }}>{summary}</p>
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
                      <div className="card-body p-4">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-3">
                          <h4 className="card-title fw-bold mb-0 text-primary">{rec.tool}</h4>
                          <span className="badge bg-success fs-6 px-3 py-2 rounded-pill shadow-sm">Save ${rec.savings}/mo</span>
                        </div>
                        <div className="mb-3 p-3 bg-white rounded shadow-sm d-flex align-items-center border-start border-4 border-warning">
                          <span className="fw-bold text-dark me-2">Recommended Action:</span> 
                          <span className="text-danger fw-bold">{rec.action}</span>
                        </div>
                        <p className="card-text text-secondary mb-0" style={{ fontSize: "1.05rem", lineHeight: "1.6" }}>
                          {rec.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-success p-4 rounded-4 text-center">
                <h4 className="alert-heading fw-bold">🎯 Highly Optimized Stack</h4>
                <p className="mb-0">This stack is currently optimized. We found zero waste based on the active plan configurations.</p>
              </div>
            )}
          </div>

          {/* CURRENT SPEND OVERVIEW */}
          <hr className="my-5 opacity-25" />
          <div className="row mt-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <h4 className="fw-bold mb-4" style={{ color: "#0B3C5D" }}>Current Tools List</h4>
              <ul className="list-group list-group-flush rounded-3 shadow-sm border">
                {data.map((tool, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom"
                  >
                    <div className="fw-semibold">
                      {tool.name} <span className="text-muted fw-normal ms-1">({tool.plan})</span>
                    </div>
                    <div className="text-muted small">
                      {tool.seats} {tool.seats === 1 ? 'seat' : 'seats'}
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
    </>
  );
};

export default ShareResult;
