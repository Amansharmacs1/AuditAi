import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const addHeader = (doc, title, subtitle) => {
  doc.setFontSize(18);
  doc.setTextColor(11, 60, 93);
  doc.text(title, 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(subtitle, 14, 24);

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 28, 196, 28);
};

const addSectionTitle = (doc, y, text) => {
  doc.setFontSize(12);
  doc.setTextColor(20, 93, 160);
  doc.text(text, 14, y);
};

export const downloadSingleAuditPdf = ({
  filename,
  auditDate,
  tools = [],
  summary = "",
}) => {
  const doc = new jsPDF();
  const safeFilename = filename || "audit-report.pdf";
  const total = tools.reduce(
    (sum, tool) => sum + Number(tool.cost || 0),
    0
  );

  addHeader(
    doc,
    "AuditAI - Audit Report",
    `Generated on ${new Date().toLocaleString()}`
  );

  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text(
    `Audit Date: ${auditDate || new Date().toLocaleString()}`,
    14,
    36
  );
  doc.text(`Total Monthly Spend: $${total}`, 14, 42);

  addSectionTitle(doc, 52, "Tool Breakdown");
  autoTable(doc, {
    startY: 56,
    head: [["Tool", "Plan", "Seats", "Monthly Cost"]],
    body: tools.map((tool) => [
      tool.tool || tool.name || "-",
      tool.plan || "-",
      String(tool.seats ?? "-"),
      `$${Number(tool.cost || 0)}`,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [20, 93, 160] },
  });

  const nextY = doc.lastAutoTable.finalY + 10;
  addSectionTitle(doc, nextY, "AI Summary");

  const summaryLines = doc.splitTextToSize(
    summary || "No AI summary available for this audit.",
    180
  );
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.text(summaryLines, 14, nextY + 6);

  doc.save(safeFilename);
};

export const downloadHistoryPdf = (audits = []) => {
  const doc = new jsPDF();
  const generatedAt = new Date().toLocaleString();

  addHeader(
    doc,
    "AuditAI - Audit History Report",
    `Generated on ${generatedAt}`
  );

  const tableRows = audits.map((audit, index) => {
    const total = (audit.tools || []).reduce(
      (sum, tool) => sum + Number(tool.cost || 0),
      0
    );

    return [
      `#${index + 1}`,
      new Date(audit.createdAt).toLocaleString(),
      String((audit.tools || []).length),
      `$${total}`,
    ];
  });

  addSectionTitle(doc, 38, "All Audits");
  autoTable(doc, {
    startY: 42,
    head: [["Audit", "Created At", "Tools", "Monthly Total"]],
    body: tableRows.length
      ? tableRows
      : [["-", "No audits found", "-", "-"]],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [20, 93, 160] },
  });

  let y = doc.lastAutoTable.finalY + 10;

  audits.forEach((audit, index) => {
    const requiredHeight = 42;
    if (y + requiredHeight > 280) {
      doc.addPage();
      y = 20;
    }

    const total = (audit.tools || []).reduce(
      (sum, tool) => sum + Number(tool.cost || 0),
      0
    );

    addSectionTitle(doc, y, `Audit #${index + 1}`);
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.text(
      `Date: ${new Date(audit.createdAt).toLocaleString()}`,
      14,
      y + 6
    );
    doc.text(`Monthly Total: $${total}`, 14, y + 12);
    doc.text(
      `AI Summary: ${(audit.summary || "No summary").slice(0, 140)}${
        (audit.summary || "").length > 140 ? "..." : ""
      }`,
      14,
      y + 18
    );

    y += 28;
  });

  doc.save("audit-history-report.pdf");
};
