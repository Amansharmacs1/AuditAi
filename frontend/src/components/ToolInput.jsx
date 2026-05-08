import React, { memo, useMemo } from "react";
import {
  toolOptions,
  toolPlans,
} from "../utils/toolPlans.js";

const ToolInput = ({
  index,
  toolData,
  updateTool,
  removeTool,
  errors = {},
  canRemove = true,
}) => {
  const plans = useMemo(
    () => toolPlans[toolData.tool] || [],
    [toolData.tool]
  );

  return (

    <div
      className="card border-0 shadow-sm p-3 mb-3"
      style={{
        borderRadius: "16px",
        background: "#f8fbff",
        transition: "all 0.2s ease",
      }}
    >

      <div className="row g-3 align-items-start">

        {/* TOOL SELECT */}
        <div className="col-lg-3 col-md-6">

          <label className="form-label fw-semibold">
            AI Tool
          </label>

          <select
            className={`form-control ai-input ${
              errors.tool
                ? "border-danger"
                : ""
            }`}
            value={toolData.tool}
            onChange={(e) =>
              updateTool(
                index,
                "tool",
                e.target.value
              )
            }
            aria-label={`Tool ${index + 1}`}
          >
            <option value="">
              Select Tool
            </option>
            {toolOptions.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>

          {errors.tool && (
            <small className="text-danger">
              {errors.tool}
            </small>
          )}

        </div>

        {/* PLAN */}
        <div className="col-lg-3 col-md-6">

          <label className="form-label fw-semibold">
            Plan
          </label>

          {plans.length > 0 ? (

            <select
              className={`form-select ai-input ${
                errors.plan
                  ? "border-danger"
                  : ""
              }`}
              value={toolData.plan}
              onChange={(e) =>
                updateTool(
                  index,
                  "plan",
                  e.target.value
                )
              }
              disabled={!toolData.tool}
              aria-label={`Plan ${index + 1}`}
            >

              <option value="">
                Select Plan
              </option>

              {plans.map((plan, i) => (

                <option
                  key={i}
                  value={plan}
                >
                  {plan}
                </option>
              ))}

            </select>

          ) : (

            <select
              className={`form-control ai-input ${
                errors.plan
                  ? "border-danger"
                  : ""
              }`}
              value={toolData.plan}
              disabled
              onChange={(e) =>
                updateTool(
                  index,
                  "plan",
                  e.target.value
                )
              }
            >
              <option value="">
                Select tool first
              </option>
            </select>

          )}

          {errors.plan && (
            <small className="text-danger">
              {errors.plan}
            </small>
          )}

        </div>

        {/* COST */}
        <div className="col-lg-2 col-md-4">

          <label className="form-label fw-semibold">
            Monthly Spend
          </label>

          <input
            className={`form-control ai-input ${
              errors.cost
                ? "border-danger"
                : ""
            }`}
            type="number"
            min="0"
            step="0.01"
            placeholder="$"
            value={toolData.cost}
            onChange={(e) =>
              updateTool(
                index,
                "cost",
                e.target.value
              )
            }
            onBlur={(e) => {

              const value =
                Number(
                  e.target.value
                );

              if (
                !Number.isFinite(value) ||
                value <= 0
              ) {

                updateTool(
                  index,
                  "cost",
                  ""
                );
              }
            }}
            aria-label={`Monthly spend ${index + 1}`}
          />

          {errors.cost && (
            <small className="text-danger">
              {errors.cost}
            </small>
          )}

        </div>

        {/* SEATS */}
        <div className="col-lg-2 col-md-4">

          <label className="form-label fw-semibold">
            Seats
          </label>

          <input
            className={`form-control ai-input ${
              errors.seats
                ? "border-danger"
                : ""
            }`}
            type="number"
            min="0"
            placeholder="Seats"
            value={toolData.seats}
            onChange={(e) =>
              updateTool(
                index,
                "seats",
                e.target.value
              )
            }
            onBlur={(e) => {

              const value =
                Number(
                  e.target.value
                );

              if (
                !Number.isFinite(value) ||
                value <= 0
              ) {

                updateTool(
                  index,
                  "seats",
                  ""
                );
              }
            }}
            aria-label={`Seats ${index + 1}`}
          />

          {errors.seats && (
            <small className="text-danger">
              {errors.seats}
            </small>
          )}

        </div>

        {/* REMOVE */}
        <div className="col-lg-2 col-md-4">

          <label className="form-label fw-semibold opacity-0">
            Remove
          </label>

          <button
            type="button"
            className="btn w-100"
            style={{
              background: "#dc3545",
              color: "#fff",
              borderRadius: "10px",
            }}
            onClick={() =>
              removeTool(index)
            }
            disabled={!canRemove}
            aria-label={`Remove tool row ${index + 1}`}
          >
            Remove
          </button>

        </div>

      </div>

    </div>
  );
};

export default memo(ToolInput);