import React from "react";
import { toolPlans } from "../utils/toolPlans.js";

const ToolInput = ({
  index,
  toolData,
  updateTool,
  removeTool,
  errors = {},
}) => {
  // Normalize tool name (case-insensitive)
  const normalizedTool = toolData.tool?.toLowerCase().trim();

  // Get plans if tool exists
  const plans = toolPlans[normalizedTool];

  return (
    <div className="tool-card">
      <div className="row g-2">

        {/* TOOL NAME */}
        <div className="col-md-3">
          <input
            list="tools"
            className={`form-control ${errors.tool ? "border-danger" : ""}`}
            placeholder="Tool (e.g. ChatGPT)"
            value={toolData.tool}
            onChange={(e) =>
              updateTool(index, "tool", e.target.value)
            }
          />

          {/* Suggestions */}
          <datalist id="tools">
            {Object.keys(toolPlans).map((tool, i) => (
              <option key={i} value={tool} />
            ))}
          </datalist>

          {errors.tool && (
            <small className="text-danger">{errors.tool}</small>
          )}
        </div>

        {/* PLAN */}
        <div className="col-md-3">
          {plans ? (
            <select
              className={`form-select ${errors.plan ? "border-danger" : ""}`}
              value={toolData.plan}
              onChange={(e) =>
                updateTool(index, "plan", e.target.value)
              }
            >
              <option value="">Select Plan</option>
              {plans.map((plan, i) => (
                <option key={i} value={plan}>
                  {plan}
                </option>
              ))}
            </select>
          ) : (
            <input
              className={`form-control ${errors.plan ? "border-danger" : ""}`}
              placeholder="Plan"
              value={toolData.plan}
              onChange={(e) =>
                updateTool(index, "plan", e.target.value)
              }
            />
          )}

          {errors.plan && (
            <small className="text-danger">{errors.plan}</small>
          )}
        </div>

        {/* COST */}
        <div className="col-md-2">
          <input
            className={`form-control ${errors.cost ? "border-danger" : ""}`}
            type="number"
            min="0"
            placeholder="$ Cost"
            value={toolData.cost}
            onChange={(e) =>
              updateTool(index, "cost", e.target.value)
            }
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (!value || value <= 0) {
                updateTool(index, "cost", 1);
              }
            }}
          />
          {errors.cost && (
            <small className="text-danger">{errors.cost}</small>
          )}
        </div>

        {/* SEATS */}
        <div className="col-md-2">
          <input
            className={`form-control ${errors.seats ? "border-danger" : ""}`}
            type="number"
            min="0"
            placeholder="Seats"
            value={toolData.seats}
            onChange={(e) =>
              updateTool(index, "seats", e.target.value)
            }
            onBlur={(e) => {
              const value = Number(e.target.value);
              if (!value || value <= 0) {
                updateTool(index, "seats", 1);
              }
            }}
          />
          {errors.seats && (
            <small className="text-danger">{errors.seats}</small>
          )}
        </div>

        {/* REMOVE BUTTON */}
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-danger-custom w-100"
            onClick={() => removeTool(index)}
          >
            Remove
          </button>
        </div>

      </div>
    </div>
  );
};

export default ToolInput;