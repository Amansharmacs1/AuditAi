import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ToolInput from "../components/ToolInput";
import { useNavigate } from "react-router-dom";
import {
  getSessionEmail,
  getSessionToken,
} from "../utils/authSession";
import { primaryUseCaseOptions } from "../utils/toolPlans";
import LeadCaptureModal from "./LeadCaptureModal";

const STORAGE_KEY = "auditai_spend_form_v1";

const createEmptyTool = () => ({
  tool: "",
  plan: "",
  cost: "",
  seats: "",
});

const defaultFormState = {
  teamSize: "",
  primaryUseCase: "Mixed",
  tools: [createEmptyTool()],
};

const Form = ({ initialValues = {} }) => {

  const navigate = useNavigate();
  const [formState, setFormState] = useState(() => ({
    ...defaultFormState,
    ...initialValues,
    tools:
      initialValues.tools?.length > 0
        ? initialValues.tools
        : defaultFormState.tools,
  }));
  const [errors, setErrors] = useState({
    globals: {},
    tools: {},
  });
  const [didSubmit, setDidSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const persisted = localStorage.getItem(STORAGE_KEY);
    if (!persisted) return;

    try {
      const parsed = JSON.parse(persisted);
      setFormState({
        ...defaultFormState,
        ...parsed,
        tools:
          parsed.tools?.length > 0
            ? parsed.tools
            : [createEmptyTool()],
      });
    } catch (err) {
      // Ignore invalid stored payload safely.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(formState)
    );
  }, [formState]);

  const validationResult = useMemo(() => {
    const nextErrors = {
      globals: {},
      tools: {},
    };

    if (
      formState.teamSize === "" ||
      Number(formState.teamSize) <= 0
    ) {
      nextErrors.globals.teamSize =
        "Team size must be greater than 0";
    }

    if (!formState.primaryUseCase) {
      nextErrors.globals.primaryUseCase =
        "Primary use case is required";
    }

    if (!formState.tools.length) {
      nextErrors.globals.tools =
        "Add at least one tool";
    }

    formState.tools.forEach((tool, index) => {
      const fieldErrors = {};

      if (!tool.tool?.trim()) {
        fieldErrors.tool = "Tool is required";
      }

      if (!tool.plan?.trim()) {
        fieldErrors.plan = "Plan is required";
      }

      if (
        tool.cost === "" ||
        Number(tool.cost) <= 0
      ) {
        fieldErrors.cost =
          "Spend must be greater than 0";
      }

      if (
        tool.seats === "" ||
        Number(tool.seats) <= 0
      ) {
        fieldErrors.seats =
          "Seats must be greater than 0";
      }

      if (Object.keys(fieldErrors).length > 0) {
        nextErrors.tools[index] = fieldErrors;
      }
    });

    const isValid =
      Object.keys(nextErrors.globals).length === 0 &&
      Object.keys(nextErrors.tools).length === 0;

    return { isValid, errors: nextErrors };
  }, [formState]);

  useEffect(() => {
    if (didSubmit) {
      setErrors(validationResult.errors);
    }
  }, [didSubmit, validationResult]);

  // =========================
  // ADD TOOL
  // =========================

  const addTool = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      tools: [...prev.tools, createEmptyTool()],
    }));
  }, []);

  // =========================
  // REMOVE TOOL
  // =========================

  const removeTool = useCallback((index) => {
    setFormState((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  }, []);

  // =========================
  // UPDATE TOOL
  // =========================

  const updateTool = useCallback((
    index,
    field,
    value
  ) => {

    // prevent negative values
    if (
      (field === "cost" ||
        field === "seats") &&
      Number(value) < 0
    ) {
      return;
    }

    setFormState((prev) => {
      const updatedTools = [...prev.tools];
      const previousTool = updatedTools[index];

      updatedTools[index] = {
        ...previousTool,
        [field]: value,
        ...(field === "tool" ? { plan: "" } : {}),
      };

      return {
        ...prev,
        tools: updatedTools,
      };
    });
  }, []);

  const updateGlobalField = useCallback(
    (field, value) => {
      if (
        field === "teamSize" &&
        Number(value) < 0
      ) {
        return;
      }

      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleResetAll = useCallback(() => {
    const resetValue = {
      ...defaultFormState,
      ...initialValues,
      tools:
        initialValues.tools?.length > 0
          ? initialValues.tools
          : [createEmptyTool()],
    };
    setFormState(resetValue);
    setErrors({ globals: {}, tools: {} });
    setDidSubmit(false);
    localStorage.removeItem(STORAGE_KEY);
  }, [initialValues]);

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDidSubmit(true);

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    // Instead of checking auth and immediately fetching API,
    // we show the lead capture modal if validation passes!
    setShowModal(true);
  };

  const summary = useMemo(() => {
    const totalMonthlySpend = formState.tools.reduce(
      (sum, tool) => sum + Number(tool.cost || 0),
      0
    );
    const totalSeats = formState.tools.reduce(
      (sum, tool) => sum + Number(tool.seats || 0),
      0
    );

    return {
      totalMonthlySpend,
      totalSeats,
      toolsCount: formState.tools.length,
    };
  }, [formState.tools]);

  return (

    <div className="container py-5">

      <div
        className="card shadow-lg border-0 p-4 p-md-5"
        style={{
          borderRadius: "20px",
        }}
      >

        <div className="text-center mb-4">

          <h2
            className="fw-bold"
            style={{
              color: "#0B3C5D",
            }}
          >
            Audit Your AI Spend
          </h2>

          <p className="text-muted">
            Analyze and optimize
            your SaaS AI costs
          </p>

        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Team Size
              </label>
              <input
                type="number"
                min="0"
                className={`form-control ai-input ${
                  errors.globals?.teamSize
                    ? "border-danger"
                    : ""
                }`}
                placeholder="e.g. 12"
                value={formState.teamSize}
                onChange={(e) =>
                  updateGlobalField(
                    "teamSize",
                    e.target.value
                  )
                }
              />
              {errors.globals?.teamSize && (
                <small className="text-danger">
                  {errors.globals.teamSize}
                </small>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Primary Use Case
              </label>
              <select
                className={`form-select ai-input ${
                  errors.globals?.primaryUseCase
                    ? "border-danger"
                    : ""
                }`}
                value={formState.primaryUseCase}
                onChange={(e) =>
                  updateGlobalField(
                    "primaryUseCase",
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select use case
                </option>
                {primaryUseCaseOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.globals?.primaryUseCase && (
                <small className="text-danger">
                  {errors.globals.primaryUseCase}
                </small>
              )}
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              {formState.tools.length === 0 ? (
                <div className="card border-0 p-4 text-center bg-light">
                  <p className="mb-3 text-muted">
                    No tools added yet.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={addTool}
                  >
                    + Add Tool
                  </button>
                </div>
              ) : (
                formState.tools.map((tool, index) => (
                  <ToolInput
                    key={`${index}-${tool.tool}-${tool.plan}`}
                    index={index}
                    toolData={tool}
                    updateTool={updateTool}
                    removeTool={removeTool}
                    canRemove={formState.tools.length > 1}
                    errors={
                      errors.tools?.[index] || {}
                    }
                  />
                ))
              )}
            </div>

            <div className="col-lg-4">
              <div
                className="card border-0 shadow-sm p-4"
                style={{
                  position: "sticky",
                  top: "90px",
                  background: "#f4f9fd",
                  borderRadius: "16px",
                }}
              >
                <h5
                  className="fw-bold mb-3"
                  style={{ color: "#0B3C5D" }}
                >
                  Summary
                </h5>
                <div className="mb-2">
                  <small className="text-muted">
                    Total Monthly Spend
                  </small>
                  <div className="fw-bold fs-5">
                    ${summary.totalMonthlySpend.toFixed(2)}
                  </div>
                </div>
                <div className="mb-2">
                  <small className="text-muted">
                    Total Seats
                  </small>
                  <div className="fw-bold fs-5">
                    {summary.totalSeats}
                  </div>
                </div>
                <div>
                  <small className="text-muted">
                    Tools Added
                  </small>
                  <div className="fw-bold fs-5">
                    {summary.toolsCount}
                  </div>
                </div>
                {errors.globals?.tools && (
                  <small className="text-danger mt-2 d-block">
                    {errors.globals.tools}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-3 mt-4">

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={addTool}
            >
              + Add Tool
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleResetAll}
            >
              Reset All
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                loading || !validationResult.isValid
              }
            >
              {loading
                ? "Analyzing..."
                : "Analyze Spend"}
            </button>
          </div>

          {!validationResult.isValid && (
            <small className="text-muted d-block mt-2">
              Complete all required fields to analyze spend.
            </small>
          )}

        </form>

      </div>

      <LeadCaptureModal
        show={showModal}
        onHide={() => setShowModal(false)}
        toolsData={formState.tools.map(t => ({
          tool: t.tool.trim(),
          plan: t.plan.trim(),
          cost: Number(t.cost),
          seats: Number(t.seats),
        }))}
      />
    </div>
  );
};

export default Form;