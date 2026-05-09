import React, {
  useEffect,
  useState,
} from "react";
import {
  getSessionEmail,
  getSessionToken,
} from "../utils/authSession";
import {
  downloadHistoryPdf,
  downloadSingleAuditPdf,
} from "../utils/pdfReport";

const History = () => {

  const [history, setHistory] = useState([]);

  const [loading, setLoading] =
    useState(true);
  const [deletingId, setDeletingId] =
    useState("");
  const [error, setError] = useState("");
  const [openAuditId, setOpenAuditId] =
    useState("");

  const fetchHistory = async () => {

    try {
      setError("");

      const email =
        getSessionEmail();
      const token =
        getSessionToken();

      if (!email || !token) {
        setHistory([]);
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/audit/history/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message || "Failed to load history"
        );
        setHistory([]);
        return;
      }

      setHistory(data.data || []);

    } catch (err) {

      setError("Unable to load history right now");

    } finally {

      setLoading(false);

    }
  };

  const handleDeleteAudit = async (auditId) => {
    const token = getSessionToken();

    if (!token) return;

    try {
      setDeletingId(auditId);
      setError("");

      const res = await fetch(
        `http://localhost:8080/api/audit/${auditId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message || "Failed to delete audit"
        );
        return;
      }

      setHistory((prev) =>
        prev.filter((item) => item._id !== auditId)
      );
    } catch (err) {
      setError("Unable to delete this audit right now");
    } finally {
      setDeletingId("");
    }
  };

  const handleDownloadSingleAudit = (audit) => {
    downloadSingleAuditPdf({
      filename: `audit-${audit._id || "report"}.pdf`,
      auditDate: new Date(audit.createdAt).toLocaleString(),
      tools: audit.tools || [],
      summary: audit.summary || "",
    });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading history...</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <h2
        className="fw-bold mb-4"
        style={{ color: "#0B3C5D" }}
      >
        Your Audit History
      </h2>

      <div className="mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => downloadHistoryPdf(history)}
          disabled={history.length === 0}
        >
          Download Full History PDF
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {history.length === 0 ? (

        <div className="card p-4 text-center">
          <h5>No audits found</h5>
        </div>

      ) : (

        history.map((audit, index) => {

          const total =
            audit.tools.reduce(
              (sum, t) =>
                sum + t.totalCost,
              0
            );

          return (
            <div
              key={audit._id || index}
              className="card shadow-sm p-4 mb-4"
              style={{
                borderRadius: "16px",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">

                <div>
                  <h5 className="fw-bold">
                    Audit #{index + 1}
                  </h5>

                  <p className="text-muted mb-0">
                    {new Date(
                      audit.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="text-end">
                  <h5
                    style={{
                      color: "#145DA0",
                    }}
                  >
                    ${total}
                  </h5>

                  <small className="text-muted">
                    Total Spend
                  </small>

                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() =>
                        setOpenAuditId((prev) =>
                          prev === audit._id
                            ? ""
                            : audit._id
                        )
                      }
                    >
                      {openAuditId === audit._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() =>
                        handleDownloadSingleAudit(audit)
                      }
                    >
                      PDF
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        handleDeleteAudit(audit._id)
                      }
                      disabled={deletingId === audit._id}
                    >
                      {deletingId === audit._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>

              {openAuditId === audit._id && (
                <>
                  <hr />

                  <h6 className="fw-bold mb-3">
                    Tool Details
                  </h6>

                  {audit.tools.map((tool, i) => (
                    <div
                      key={i}
                      className="d-flex justify-content-between mb-2"
                    >
                      <span>
                        {tool.tool} ({tool.plan}) | Seats:{" "}
                        {tool.seats}
                      </span>

                      <span>
                        Monthly: ${tool.cost} | Total: $
                        {tool.totalCost}
                      </span>
                    </div>
                  ))}

                  <div className="mt-4">
                    <h5 className="mb-3 text-dark fw-bold">
                      Executive Summary
                    </h5>
                    <div
                      className="p-3 rounded"
                      style={{
                        background: "#f8fbff",
                        borderLeft:
                          "4px solid #145DA0",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {audit.summary
                        ? audit.summary.replace(/\*\*/g, '').replace(/^#+\s*/gm, '').replace(/^[\*\-]\s+/gm, '• ')
                        : "No executive summary found for this audit."}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })

      )}
    </div>
  );
};

export default History;