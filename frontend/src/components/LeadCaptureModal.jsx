import React, { useState } from "react";
import { Modal, Button, Form as BootstrapForm, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getSessionEmail } from "../utils/authSession";
import { endpoints } from "../utils/apiConfig";

const LeadCaptureModal = ({ show, onHide, toolsData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userEmail: getSessionEmail() || "",
    companyName: "",
    role: "",
    teamSize: "",
    bot_field: "", // honeypot
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(endpoints.createLead(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tools: toolsData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to generate audit. Please try again.");
      }

      // Hide modal and navigate to public share URL
      onHide();
      navigate(`/share/${result.publicShareId}`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={loading ? undefined : onHide} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton={!loading}>
        <Modal.Title className="fw-bold text-primary">Get Your Audit Results</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <p className="text-muted mb-4">
          Your audit is ready! Please provide your details below to unlock your personalized cost savings report and alternative tool recommendations.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <BootstrapForm onSubmit={handleSubmit}>
          {/* Honeypot field - visually hidden to prevent bots from spamming the API */}
          <div style={{ display: "none" }} aria-hidden="true">
            <BootstrapForm.Group className="mb-3">
              <BootstrapForm.Label>Do not fill this out</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                name="bot_field"
                value={formData.bot_field}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </BootstrapForm.Group>
          </div>

          <BootstrapForm.Group className="mb-3" controlId="fullName">
            <BootstrapForm.Label className="fw-semibold">Full Name <span className="text-danger">*</span></BootstrapForm.Label>
            <BootstrapForm.Control
              type="text"
              name="fullName"
              required
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
            />
          </BootstrapForm.Group>

          <BootstrapForm.Group className="mb-3" controlId="userEmail">
            <BootstrapForm.Label className="fw-semibold">Email Address <span className="text-danger">*</span></BootstrapForm.Label>
            <BootstrapForm.Control
              type="email"
              name="userEmail"
              required
              placeholder="john@example.com"
              value={formData.userEmail}
              onChange={handleChange}
              disabled={loading}
            />
          </BootstrapForm.Group>

          <BootstrapForm.Group className="mb-3" controlId="companyName">
            <BootstrapForm.Label className="fw-semibold text-muted">Company Name (Optional)</BootstrapForm.Label>
            <BootstrapForm.Control
              type="text"
              name="companyName"
              placeholder="Acme Corp"
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading}
            />
          </BootstrapForm.Group>

          <BootstrapForm.Group className="mb-3" controlId="role">
            <BootstrapForm.Label className="fw-semibold text-muted">Role / Job Title (Optional)</BootstrapForm.Label>
            <BootstrapForm.Control
              type="text"
              name="role"
              placeholder="e.g. CTO, Finance Manager"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            />
          </BootstrapForm.Group>

          <BootstrapForm.Group className="mb-4" controlId="teamSize">
            <BootstrapForm.Label className="fw-semibold text-muted">Team Size (Optional)</BootstrapForm.Label>
            <BootstrapForm.Select name="teamSize" value={formData.teamSize} onChange={handleChange} disabled={loading}>
              <option value="">Select team size...</option>
              <option value="1-10">1 - 10 employees</option>
              <option value="11-50">11 - 50 employees</option>
              <option value="51-200">51 - 200 employees</option>
              <option value="200+">200+ employees</option>
            </BootstrapForm.Select>
          </BootstrapForm.Group>

          <Button variant="primary" type="submit" className="w-100 fw-bold py-2" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Generating Audit...
              </>
            ) : (
              "View My Audit Results"
            )}
          </Button>
        </BootstrapForm>
      </Modal.Body>
    </Modal>
  );
};

export default LeadCaptureModal;
