import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const addHeader = (doc, title, subtitle) => {
  doc.setFontSize(18);
  doc.setTextColor(11, 60, 93);
  doc.text(title, 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(subtitle, 14, 24);

  doc.setTextColor(11, 60, 93);
  doc.text("Contact: amansharmacs11@gmail.com", 140, 24);

  doc.setDrawColor(220, 220, 220);
  doc.line(14, 28, 196, 28);
};

const addSectionTitle = (doc, y, text) => {
  doc.setFontSize(12);
  doc.setTextColor(20, 93, 160);
  doc.text(text, 14, y);
};

const measureAndRenderMarkdown = (doc, text, startX, startY, maxWidth, doRender = true) => {
  let currentY = startY;
  const paragraphs = text.split('\n').map(l => l.trim()).filter(Boolean);

  const checkPageBreak = (needed = 0) => {
    if (currentY + needed > 280) {
      if (doRender) {
        doc.addPage();
      }
      currentY = 20;
    }
  };

  paragraphs.forEach(paragraph => {
    checkPageBreak(10);
    let isHeading = false;
    let lineText = paragraph;

    if (lineText.startsWith('#')) {
      isHeading = true;
      doc.setFontSize(11);
    } else {
      doc.setFontSize(10);
    }
    
    // Remove markdown heading (#)
    lineText = lineText.replace(/^#+\s*/, '');
    
    // Replace bullet (* or -) with real bullet character
    if (/^[\*\-]\s+/.test(lineText)) {
      lineText = lineText.replace(/^[\*\-]\s+/, '• ');
    }

    const parts = lineText.split(/(\*\*.*?\*\*)/g);
    let currentX = startX;

    parts.forEach(part => {
      if (!part) return;
      let isBold = false;
      let printText = part;
      
      if (part.startsWith('**') && part.endsWith('**')) {
        isBold = true;
        printText = part.slice(2, -2);
      }
      
      doc.setFont("helvetica", (isHeading || isBold) ? "bold" : "normal");
      
      const tokens = printText.match(/(\S+|\s+)/g) || [];
      tokens.forEach(token => {
        const tokenWidth = doc.getTextWidth(token);
        if (token.trim() !== '' && currentX + tokenWidth > startX + maxWidth) {
          currentY += 5;
          currentX = startX;
          checkPageBreak(5);
        }
        if (doRender && token.trim() !== '') {
          doc.text(token, currentX, currentY);
        }
        currentX += tokenWidth;
      });
    });
    currentY += 7;
  });
  return currentY;
};

const generateDoughnutChartImage = (tools) => {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 300;
  const ctx = canvas.getContext("2d");

  const COLORS = ["#4DA8DA", "#2E8BC0", "#145DA0", "#0B3C5D", "#1B4965", "#A8DADC", "#457B9D"];

  const totalCost = tools.reduce((sum, t) => sum + Number(t.cost || 0), 0);
  let startAngle = -Math.PI / 2;
  
  const cx = 150;
  const cy = 150;
  const outerRadius = 120;
  const innerRadius = 70;

  // Clear background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 600, 300);

  if (totalCost > 0) {
    tools.forEach((tool, index) => {
      const cost = Number(tool.cost || 0);
      if (cost === 0) return;
      const sliceAngle = (cost / totalCost) * 2 * Math.PI;
      
      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();
      
      startAngle += sliceAngle;
    });
  } else {
    ctx.fillStyle = "#e0e0e0";
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Cut out inner circle
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
  ctx.fill();

  // Add text in the middle
  ctx.fillStyle = "#333333";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Total", cx, cy - 15);
  ctx.fillText(`$${totalCost}`, cx, cy + 15);

  // Draw legend
  const legendX = 320;
  let legendY = 50;
  tools.slice(0, 8).forEach((tool, index) => {
    ctx.fillStyle = COLORS[index % COLORS.length];
    ctx.fillRect(legendX, legendY - 12, 15, 15);
    
    ctx.fillStyle = "#333333";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    const toolName = tool.tool || tool.name || "Unknown";
    const cost = Number(tool.cost || 0);
    const perc = totalCost > 0 ? ((cost / totalCost) * 100).toFixed(1) : 0;
    
    let shortName = toolName.length > 15 ? toolName.substring(0, 15) + "..." : toolName;
    ctx.fillText(`${shortName} - $${cost} (${perc}%)`, legendX + 25, legendY);
    
    legendY += 30;
  });

  return canvas.toDataURL("image/png");
};

export const downloadSingleAuditPdf = async ({
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

  // --- VISUAL GRAPH (Top 5 Spend) ---
  let currentY = 54;
  addSectionTitle(doc, currentY, "Top Spend by Tool");
  currentY += 8;

  const sortedTools = [...tools].sort((a, b) => Number(b.cost || 0) - Number(a.cost || 0));
  const maxCost = Math.max(...sortedTools.map(t => Number(t.cost || 0)), 1);
  const maxBarWidth = 100; // maximum width in mm for the bar

  sortedTools.slice(0, 5).forEach((tool) => {
    const cost = Number(tool.cost || 0);
    let barWidth = (cost / maxCost) * maxBarWidth;
    if (barWidth < 2 && cost > 0) barWidth = 2; // minimum visible bar

    // Tool Name Label
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    const label = tool.tool || tool.name || "-";
    // truncate long names
    const shortLabel = label.length > 20 ? label.substring(0, 18) + "..." : label;
    doc.text(shortLabel, 14, currentY + 4);

    // Render Bar
    doc.setFillColor(46, 139, 192); // #2E8BC0
    doc.rect(60, currentY, barWidth, 6, "F");

    // Cost Label Next to Bar
    doc.setTextColor(90, 90, 90);
    doc.text(`$${cost}`, 60 + barWidth + 3, currentY + 4);

    currentY += 8;
  });

  currentY += 10;

  // --- EMBED DOUGHNUT CHART ---
  try {
    const imgData = generateDoughnutChartImage(tools);
    const imgWidth = 140; // width in mm
    const imgHeight = 70; // height in mm (aspect ratio 2:1 since canvas is 600x300)
    const xOffset = (210 - imgWidth) / 2;
    
    addSectionTitle(doc, currentY, "Spend Distribution");
    currentY += 8;
    
    doc.addImage(imgData, "PNG", xOffset, currentY, imgWidth, imgHeight);
    currentY += imgHeight + 10;
  } catch (e) {
    console.error("Failed to add doughnut chart:", e);
  }

  // --- TABLE ---
  addSectionTitle(doc, currentY, "Detailed Tool Breakdown");
  autoTable(doc, {
    startY: currentY + 4,
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

  currentY = doc.lastAutoTable.finalY + 10;
  if (currentY + 20 > 280) {
    doc.addPage();
    currentY = 20;
  }
  
  addSectionTitle(doc, currentY, "Executive Summary");

  const summaryText = summary || "No summary available for this audit.";
  
  doc.setTextColor(50, 50, 50);
  measureAndRenderMarkdown(doc, summaryText, 14, currentY + 8, 180, true);
  doc.setFont("helvetica", "normal");

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
    if (y + 30 > 280) {
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
    let summaryText = audit.summary || "No summary available.";
    
    doc.setTextColor(50, 50, 50);
    y = measureAndRenderMarkdown(doc, summaryText, 14, y + 22, 180, true);
    doc.setFont("helvetica", "normal");

    y += 10;
  });

  doc.save("audit-history-report.pdf");
};

