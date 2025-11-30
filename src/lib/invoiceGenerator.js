import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (orderData) => {
  if (!orderData) return;

  const doc = new jsPDF();

  const customer = orderData.shippingAddress || {};
  const orderId = orderData._id || "";
  const date = new Date(orderData.createdAt).toLocaleDateString();

  // ===========================
  // HEADER
  // ===========================
  doc.setFontSize(20).setTextColor("#02066F");
  doc.text("Awesome Accessories", 14, 20);

  doc.setFontSize(11).setTextColor("#333");
  doc.text("GSTIN: 07AUEPJ8060D1ZT", 14, 28);
  doc.text("Email: support@bulkwala.com | Phone: 9310701078", 14, 33);
  doc.text(
    "Address: M-77, Block-M, Shyam Park, Uttam Nagar, New Delhi – 110059",
    14,
    38
  );

  doc.setFontSize(15).setTextColor("#000");
  doc.text("Tax Invoice", 195, 20, { align: "right" });

  doc.setDrawColor("#02066F");
  doc.setLineWidth(0.8);
  doc.line(14, 43, 195, 43);

  // ===========================
  // BILLING INFO
  // ===========================
  doc.setFontSize(13).setTextColor("#000");
  doc.text("Bill To:", 14, 52);

  doc.setFontSize(11).setTextColor("#333");
  doc.text(customer.name || "", 14, 58);
  doc.text(customer.street || "", 14, 64);
  doc.text(
    `${customer.city || ""}, ${customer.state || ""} - ${
      customer.postalCode || ""
    }`,
    14,
    70
  );
  doc.text(`Phone: ${customer.phone || ""}`, 14, 76);

  doc.text(`Invoice No: ${orderId.slice(-6).toUpperCase()}`, 195, 52, {
    align: "right",
  });
  doc.text(`Date: ${date}`, 195, 58, { align: "right" });
  doc.text(`Payment Mode: ${orderData.paymentMode}`, 195, 64, {
    align: "right",
  });
  doc.text(`Payment Status: ${orderData.paymentStatus}`, 195, 70, {
    align: "right",
  });

  // ===========================
  // PRODUCT TABLE
  // ===========================
  const columns = [
    { header: "Product", dataKey: "product" },
    { header: "Qty", dataKey: "qty" },
    { header: "GST%", dataKey: "gst" },
    { header: "GST Amt", dataKey: "gstAmt" },
    { header: "Taxable", dataKey: "taxable" },
    { header: "Total", dataKey: "total" },
  ];

  const rows = [];

  orderData.products.forEach((item) => {
    const p = item.product;
    const qty = item.quantity || 1;
    const rate = p.discountPrice || p.price || 0;
    const gstRate = p.gstSlab || 18;

    const taxable = rate / (1 + gstRate / 100);
    const gstAmount = rate - taxable;

    rows.push({
      product: p.title,
      qty,
      gst: `${gstRate}%`,
      gstAmt: (gstAmount * qty).toFixed(2),
      taxable: (taxable * qty).toFixed(2),
      total: (rate * qty).toFixed(2),
    });
  });

  autoTable(doc, {
    startY: 90,
    columns,
    body: rows,

    headStyles: {
      fillColor: "#02066F",
      textColor: "#fff",
      fontSize: 10,
      halign: "center",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: "#000",
      overflow: "linebreak",
    },
    alternateRowStyles: { fillColor: "#F1F4FF" },

    columnStyles: {
      product: { cellWidth: 80 },
      qty: { cellWidth: 15, halign: "center" },
      gst: { cellWidth: 18, halign: "center" },
      gstAmt: { cellWidth: 25, halign: "right" },
      taxable: { cellWidth: 25, halign: "right" },
      total: { cellWidth: 25, halign: "right" },
    },
  });

  // ===========================
  // SUMMARY (LEFT, WITH SANITIZATION)
  // ===========================
  let y = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(13).setTextColor("#000");
  doc.text("Summary", 14, y);
  y += 10;

  const summaryRows = [
    ["Items Total:", orderData.itemsPrice],
    ["Shipping:", orderData.shippingPrice],
    ...(orderData.couponDiscount > 0
      ? [["Coupon Discount:", -orderData.couponDiscount]]
      : []),
    ...(orderData.referralDiscount > 0
      ? [["Referral Discount:", -orderData.referralDiscount]]
      : []),
    ...(orderData.flashDiscount > 0
      ? [["Flash Offer:", -orderData.flashDiscount]]
      : []),
    ...(orderData.prepaidDiscount > 0
      ? [["Prepaid Discount:", -orderData.prepaidDiscount]]
      : []),
  ];

  doc.setFontSize(11).setTextColor("#333");

  summaryRows.forEach(([label, value]) => {
    const isNegative = value < 0;
    const absVal = Math.abs(value);

    // sanitize any weird invisible characters, keep only digits and dot
    const cleanNumber = absVal
      .toFixed(2)
      .toString()
      .replace(/[^\d.]/g, "")
      .trim();

    const sign = isNegative ? "-" : "";
    const line = `${label} ${sign}₹${cleanNumber}`;

    doc.text(line, 14, y);
    y += 6;
  });

  // ===========================
  // GRAND TOTAL (LEFT, SANITIZED)
  // ===========================
  const totalIsNegative = orderData.totalPrice < 0;
  const totalAbs = Math.abs(orderData.totalPrice);
  const grandClean = totalAbs
    .toFixed(2)
    .toString()
    .replace(/[^\d.]/g, "")
    .trim();
  const totalSign = totalIsNegative ? "-" : "";

  doc.setFontSize(12).setFont("helvetica", "bold");
  doc.text(`Grand Total (Inc GST): ${totalSign}₹${grandClean}`, 14, y + 8);

  // FOOTER
  doc.setDrawColor("#02066F");
  doc.line(14, y + 14, 195, y + 14);

  doc.setFontSize(9).setTextColor("#666");
  doc.text(
    "Thank you for shopping with Awesome Accessories – This is a computer-generated invoice.",
    14,
    y + 22
  );

  doc.save(`Invoice_${orderId}.pdf`);
};
