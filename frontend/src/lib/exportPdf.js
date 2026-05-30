import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const BRAND = 'diLA Tech Admin';

function fileDate() {
  return new Date().toISOString().slice(0, 10);
}

function addReportHeader(doc, title) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235);
  doc.text(BRAND, 14, 18);

  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(title, 14, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${pageCount}  •  ${BRAND}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }
}

function save(doc, name) {
  addFooter(doc);
  doc.save(`${name}-${fileDate()}.pdf`);
}

export function exportAppsPdf(apps) {
  const doc = new jsPDF();
  addReportHeader(doc, 'Published Apps Report');

  autoTable(doc, {
    startY: 42,
    head: [['App Name', 'Category', 'Rating', 'Downloads', 'Version', 'Size']],
    body: apps.map((app) => [
      app.name || '-',
      app.category || '-',
      app.rating ?? '-',
      app.downloads ? `${app.downloads}` : '-',
      app.version || '-',
      app.size || '-',
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  save(doc, 'dilatech-apps');
}

export function exportReviewsPdf(reviews) {
  const doc = new jsPDF();
  addReportHeader(doc, 'User Reviews Report');

  autoTable(doc, {
    startY: 42,
    head: [['Name', 'Role / Title', 'Rating', 'Review']],
    body: reviews.map((r) => [
      r.name || '-',
      r.title || r.role || '-',
      r.rating ?? '-',
      r.text || '-',
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235] },
    columnStyles: { 3: { cellWidth: 80 } },
  });

  save(doc, 'dilatech-reviews');
}

export function exportSiteStatsPdf(stats) {
  const doc = new jsPDF();
  addReportHeader(doc, 'Site Statistics');

  autoTable(doc, {
    startY: 42,
    head: [['Metric', 'Value']],
    body: [
      ['Published Apps', stats.publishedApps ?? '-'],
      ['Total Downloads', stats.downloads ?? '-'],
      ['Average Rating', stats.rating ?? '-'],
      ['Active Users', stats.activeUsers ?? '-'],
    ],
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  save(doc, 'dilatech-site-stats');
}

export function exportPremiumPdf(premium) {
  const doc = new jsPDF();
  addReportHeader(doc, 'Premium Pricing Settings');

  autoTable(doc, {
    startY: 42,
    head: [['Setting', 'Value']],
    body: [
      ['Monthly Price ($)', premium.monthly ?? '-'],
      ['Yearly Price ($)', premium.yearly ?? '-'],
      ['Discount (%)', premium.discount ?? '-'],
    ],
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [245, 158, 11] },
  });

  const features = Array.isArray(premium.features) ? premium.features.filter(Boolean) : [];
  if (features.length) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 12,
      head: [['Premium Features']],
      body: features.map((f) => [f]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });
  }

  save(doc, 'dilatech-premium');
}

export function exportContactMessagesPdf(messages) {
  const doc = new jsPDF();
  addReportHeader(doc, 'Contact Form Messages');

  autoTable(doc, {
    startY: 42,
    head: [['Date', 'Name', 'Email', 'Message']],
    body: messages.map((m) => [
      m.createdAt ? new Date(m.createdAt).toLocaleString() : '-',
      m.name || '-',
      m.email || '-',
      m.message || '-',
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235] },
    columnStyles: { 3: { cellWidth: 75 } },
  });

  save(doc, 'dilatech-contact-messages');
}

export function exportDashboardPdf({ apps, stats, premium, reviews = [] }) {
  const doc = new jsPDF();
  addReportHeader(doc, 'Dashboard Summary Report');

  const totalDownloadsRaw = apps.reduce((sum, app) => {
    const d = parseFloat(app.downloads || 0);
    const multiplier = String(app.downloads || '').toLowerCase().includes('k') ? 1000 : 1;
    return sum + d * multiplier;
  }, 0);
  const totalDownloads =
    totalDownloadsRaw >= 1000 ? `${(totalDownloadsRaw / 1000).toFixed(0)}k+` : `${totalDownloadsRaw}+`;
  const avgRating = apps.length
    ? (apps.reduce((sum, app) => sum + parseFloat(app.rating || 0), 0) / apps.length).toFixed(1)
    : '0';

  autoTable(doc, {
    startY: 42,
    head: [['Overview Metric', 'Value']],
    body: [
      ['Total Apps', apps.length],
      ['Est. Downloads (from apps)', totalDownloads],
      ['Avg App Rating', avgRating],
      ['Site Active Users', stats?.activeUsers ?? '-'],
      ['Site Downloads (display)', stats?.downloads ?? '-'],
      ['Premium Monthly ($)', premium?.monthly ?? '-'],
      ['Total Reviews', reviews.length],
    ],
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 14,
    head: [['App', 'Category', 'Rating', 'Downloads']],
    body: apps.map((app) => [app.name, app.category, app.rating, app.downloads]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [16, 185, 129] },
  });

  save(doc, 'dilatech-dashboard-report');
}
