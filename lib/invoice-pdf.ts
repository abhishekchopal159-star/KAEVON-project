export type InvoiceLineItem = {
  name: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
};

export type StyloverseInvoice = {
  orderId: string;
  issueDate: string;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  items: InvoiceLineItem[];
  subtotal: number;
  savings: number;
  deliveryCharge: number;
  total: number;
  demo?: boolean;
};

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

function cleanText(value: unknown) {
  return String(value ?? "")
    .replace(/₹/g, "INR ")
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapePdfText(value: unknown) {
  return cleanText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function formatCurrency(value: number) {
  return `INR ${Math.max(0, value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? cleanText(value) || "Not available"
    : new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
}

function wrapText(value: string, maxCharacters: number) {
  const words = cleanText(value).split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxCharacters) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word.slice(0, maxCharacters);
    }
  });

  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function fillRect(
  x: number,
  y: number,
  width: number,
  height: number,
  color: [number, number, number]
) {
  return `${color.join(" ")} rg ${x} ${y} ${width} ${height} re f`;
}

function strokeLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color = "0.86 0.82 0.77",
  width = 0.6
) {
  return `${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`;
}

function drawText(
  value: unknown,
  x: number,
  y: number,
  size = 10,
  font: "F1" | "F2" = "F1",
  color = "0.12 0.10 0.09"
) {
  return `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${escapePdfText(
    value
  )}) Tj ET`;
}

function pageHeader(
  invoice: StyloverseInvoice,
  pageNumber: number,
  totalPages: number
) {
  const operations = [
    fillRect(0, PAGE_HEIGHT - 116, PAGE_WIDTH, 116, [0.09, 0.08, 0.07]),
    drawText("STYLOVERSE", 42, 792, 21, "F2", "0.91 0.72 0.43"),
    drawText(
      "PRIVATE FASHION HOUSE",
      43,
      774,
      7,
      "F1",
      "0.72 0.66 0.58"
    ),
    drawText("ORDER INVOICE", 405, 790, 15, "F2", "1 1 1"),
    drawText(invoice.orderId, 405, 770, 8, "F1", "0.74 0.69 0.64"),
    drawText(
      `PAGE ${pageNumber} OF ${totalPages}`,
      470,
      738,
      6,
      "F1",
      "0.55 0.51 0.47"
    ),
  ];

  if (invoice.demo !== false) {
    operations.push(
      "q 0.82 0.57 -0.57 0.82 115 280 cm BT /F2 42 Tf 0.94 0.90 0.84 rg (DEMO - NO REAL PAYMENT OR DELIVERY) Tj ET Q"
    );
  }

  return operations;
}

function invoiceMeta(invoice: StyloverseInvoice) {
  const addressLines = wrapText(
    invoice.shippingAddress || "Address not captured",
    48
  ).slice(0, 3);
  const operations = [
    drawText("ISSUED", 42, 690, 7, "F2", "0.62 0.43 0.24"),
    drawText(formatDate(invoice.issueDate), 42, 672, 10),
    drawText("ORDER STATUS", 188, 690, 7, "F2", "0.62 0.43 0.24"),
    drawText(invoice.orderStatus, 188, 672, 10),
    drawText("PAYMENT", 342, 690, 7, "F2", "0.62 0.43 0.24"),
    drawText(
      `${invoice.paymentMethod} - ${invoice.paymentStatus}`,
      342,
      672,
      9
    ),
    strokeLine(42, 650, 553, 650),
    drawText("CLIENT", 42, 624, 7, "F2", "0.62 0.43 0.24"),
    drawText(invoice.customerName || "Styloverse client", 42, 604, 13, "F2"),
    drawText(invoice.customerEmail || "Email not captured", 42, 586, 8),
    drawText(invoice.customerPhone || "Phone not captured", 42, 570, 8),
    drawText("DELIVERY DESTINATION", 315, 624, 7, "F2", "0.62 0.43 0.24"),
    ...addressLines.map((line, index) =>
      drawText(line, 315, 604 - index * 16, 8)
    ),
  ];

  return operations;
}

function itemTableHeader(y: number) {
  return [
    fillRect(42, y - 8, 511, 28, [0.96, 0.93, 0.89]),
    drawText("PIECE", 52, y, 7, "F2", "0.45 0.37 0.29"),
    drawText("VARIANT", 300, y, 7, "F2", "0.45 0.37 0.29"),
    drawText("QTY", 405, y, 7, "F2", "0.45 0.37 0.29"),
    drawText("AMOUNT", 465, y, 7, "F2", "0.45 0.37 0.29"),
  ];
}

function itemRow(item: InvoiceLineItem, y: number) {
  const name = wrapText(item.name || "Styloverse piece", 38)[0];
  const variant = [item.size && `Size ${item.size}`, item.color]
    .filter(Boolean)
    .join(" / ") || "Standard";
  return [
    drawText(name, 52, y, 8, "F2"),
    drawText(variant, 300, y, 7),
    drawText(Math.max(1, item.quantity), 414, y, 8),
    drawText(
      formatCurrency(item.unitPrice * Math.max(1, item.quantity)),
      465,
      y,
      7,
      "F2"
    ),
    strokeLine(42, y - 12, 553, y - 12, "0.91 0.88 0.84", 0.4),
  ];
}

function totalsBlock(invoice: StyloverseInvoice, y: number) {
  const rows: Array<[string, string, boolean]> = [
    ["Subtotal", formatCurrency(invoice.subtotal), false],
    ["Savings", `- ${formatCurrency(invoice.savings)}`, false],
    [
      "Delivery",
      invoice.deliveryCharge
        ? formatCurrency(invoice.deliveryCharge)
        : "Complimentary",
      false,
    ],
    ["TOTAL", formatCurrency(invoice.total), true],
  ];

  return rows.flatMap(([label, value, strong], index) => {
    const rowY = y - index * 24;
    return [
      drawText(label, 350, rowY, strong ? 10 : 8, strong ? "F2" : "F1"),
      drawText(value, 465, rowY, strong ? 10 : 8, "F2"),
      strong
        ? strokeLine(342, rowY + 16, 553, rowY + 16, "0.20 0.17 0.14", 1)
        : "",
    ].filter(Boolean);
  });
}

function pageFooter(invoice: StyloverseInvoice) {
  return [
    strokeLine(42, 48, 553, 48),
    drawText(
      invoice.demo !== false
        ? "Portfolio demonstration only - no payment was processed and no delivery will occur."
        : "Thank you for choosing Styloverse.",
      42,
      30,
      7,
      "F1",
      "0.47 0.43 0.39"
    ),
  ];
}

function createPageStreams(invoice: StyloverseInvoice) {
  const items = invoice.items.length
    ? invoice.items
    : [
        {
          name: "Legacy order - item details unavailable",
          quantity: 1,
          unitPrice: invoice.subtotal,
        },
      ];
  const firstPageCapacity = 10;
  const laterPageCapacity = 20;
  const chunks: InvoiceLineItem[][] = [];
  chunks.push(items.slice(0, firstPageCapacity));

  for (
    let index = firstPageCapacity;
    index < items.length;
    index += laterPageCapacity
  ) {
    chunks.push(items.slice(index, index + laterPageCapacity));
  }

  const totalPages = chunks.length;

  return chunks.map((chunk, pageIndex) => {
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex === totalPages - 1;
    const tableHeaderY = isFirstPage ? 530 : 690;
    const operations = [
      ...pageHeader(invoice, pageIndex + 1, totalPages),
      ...(isFirstPage ? invoiceMeta(invoice) : []),
      ...itemTableHeader(tableHeaderY),
    ];

    chunk.forEach((item, index) => {
      operations.push(
        ...itemRow(item, tableHeaderY - 38 - index * 34)
      );
    });

    if (isLastPage) {
      const lastRowY =
        tableHeaderY - 38 - Math.max(0, chunk.length - 1) * 34;
      operations.push(
        ...totalsBlock(invoice, Math.max(118, lastRowY - 54))
      );
    }

    operations.push(...pageFooter(invoice));
    return operations.join("\n");
  });
}

function buildPdf(invoice: StyloverseInvoice) {
  const pageStreams = createPageStreams(invoice);
  const pageReferences = pageStreams.map(
    (_, index) => `${5 + index * 2} 0 R`
  );
  const objects: string[] = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [${pageReferences.join(
      " "
    )}] /Count ${pageStreams.length} >>`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`,
    `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`,
  ];

  pageStreams.forEach((stream, index) => {
    const contentReference = 6 + index * 2;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentReference} 0 R >>`
    );
    objects.push(
      `<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`
    );
  });

  let output = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(new TextEncoder().encode(output).length);
    output += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = new TextEncoder().encode(output).length;
  output += `xref\n0 ${objects.length + 1}\n`;
  output += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    output += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return output;
}

export function downloadStyloverseInvoice(
  invoice: StyloverseInvoice
) {
  const pdf = buildPdf({
    ...invoice,
    demo:
      invoice.demo ??
      process.env.NEXT_PUBLIC_COMMERCE_MODE !== "live",
  });
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${cleanText(invoice.orderId).replace(
    /[^A-Za-z0-9_-]/g,
    "-"
  )}-styloverse-invoice.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
