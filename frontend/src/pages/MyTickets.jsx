import React, { useEffect, useState } from "react";
import ReactQrcode from "react-qr-code";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMyTickets } from "../api";
import {
  Card,
  StatusBadge,
  Alert,
  SkeletonCard,
} from "../components/ui/Surfaces";
import Button from "../components/ui/Button";
import { TicketIcon } from "../components/ui/Icons";

const PAGE_SIZE = 10;

/* ---------- PDF generation ---------- */
const hexToRgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const generateTicketPDF = (ticket) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;

  // ===== palette =====
  const BRAND = "#0d9488";
  const ACCENT = "#f97316";
  const TEXT = "#0f172a";
  const MUTED = "#64748b";
  const LIGHT_BG = "#f1f5f9";
  const BORDER = "#e2e8f0";

  // ===== page background =====
  doc.setFillColor("#ffffff");
  doc.rect(0, 0, W, H, "F");

  // ===== header band =====
  doc.setFillColor(...hexToRgb(BRAND));
  doc.rect(0, 0, W, 42, "F");

  // train glyph
  doc.setFillColor("#ffffff");
  doc.circle(20, 21, 8, "F");
  doc.setFillColor(...hexToRgb(BRAND));
  doc.circle(20, 21, 5.5, "F");
  doc.setFillColor("#ffffff");
  doc.rect(18, 15, 4, 12, "F");

  // brand text
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("METRO", 34, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("TICKETING · E-TICKET", 34, 27);

  // ===== token block (right-aligned inside header) =====
  const tokenRightX = W - 8;
  const tokenMaxW = 82;
  const tokenStr = String(ticket.ticketToken || "");

  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TOKEN", tokenRightX, 13, { align: "right" });

  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  const tokenLines = doc.splitTextToSize(tokenStr, tokenMaxW);
  tokenLines.forEach((line, i) => {
    doc.text(line, tokenRightX, 19 + i * 4.5, { align: "right" });
  });

  // ===== ticket card =====
  const cardX = 15;
  const cardY = 58;
  const cardW = W - 30;
  const cardH = 130;

  // shadow
  doc.setFillColor(230, 235, 240);
  doc.roundedRect(cardX + 1.5, cardY + 1.5, cardW, cardH, 6, 6, "F");

  // main card
  doc.setFillColor("#ffffff");
  doc.setDrawColor(...hexToRgb(BORDER));
  doc.setLineWidth(0.4);
  doc.roundedRect(cardX, cardY, cardW, cardH, 6, 6, "FD");

  // top accent bar
  doc.setFillColor(...hexToRgb(ACCENT));
  doc.roundedRect(cardX, cardY, cardW, 4, 6, 6, "F");
  doc.setFillColor(...hexToRgb(ACCENT));
  doc.rect(cardX, cardY + 2, cardW, 2, "F");

  // ===== ROUTE =====
  const routeY = cardY + 30;

  // FROM
  doc.setTextColor(...hexToRgb(MUTED));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("FROM", cardX + 14, routeY - 10);

  doc.setTextColor(...hexToRgb(TEXT));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const srcText = doc.splitTextToSize(ticket.source, 60);
  doc.text(srcText, cardX + 14, routeY);

  // TO
  doc.setTextColor(...hexToRgb(MUTED));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("TO", cardX + cardW - 74, routeY - 10);

  doc.setTextColor(...hexToRgb(TEXT));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const dstText = doc.splitTextToSize(ticket.destination, 60);
  doc.text(dstText, cardX + cardW - 14, routeY, { align: "right" });

  // route line + arrow
  const lineY = routeY + 2;
  doc.setDrawColor(...hexToRgb(BRAND));
  doc.setLineWidth(1.2);
  doc.setLineDashPattern([2, 1.5], 0);
  doc.line(cardX + 68, lineY, cardX + cardW - 68, lineY);
  doc.setLineDashPattern([], 0);

  doc.setFillColor(...hexToRgb(BRAND));
  doc.circle(cardX + 68, lineY, 1.6, "F");
  doc.circle(cardX + cardW - 68, lineY, 1.6, "F");

  const midX = (cardX + cardW) / 2;
  doc.setFillColor(...hexToRgb(ACCENT));
  doc.triangle(
    midX - 3,
    lineY - 2.5,
    midX + 3,
    lineY,
    midX - 3,
    lineY + 2.5,
    "F",
  );

  // status badge
  const status = ticket.status || "Active";
  const badgeW = 22;
  const badgeX = cardX + cardW - badgeW - 6;
  const badgeY = cardY + 10;
  const statusColor =
    status === "Completed"
      ? "#10b981"
      : status === "In Journey"
        ? "#eab308"
        : status === "Expired"
          ? "#94a3b8"
          : BRAND;
  doc.setFillColor(...hexToRgb(statusColor));
  doc.roundedRect(badgeX, badgeY, badgeW, 7, 3.5, 3.5, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(status.toUpperCase(), badgeX + badgeW / 2, badgeY + 4.8, {
    align: "center",
  });

  // ===== divider =====
  const divY = cardY + 82;
  doc.setDrawColor(...hexToRgb(BORDER));
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(cardX + 6, divY, cardX + cardW - 6, divY);
  doc.setLineDashPattern([], 0);

  // tear-off notches
  doc.setFillColor("#ffffff");
  doc.setDrawColor(...hexToRgb(BORDER));
  doc.circle(cardX, divY, 3, "FD");
  doc.circle(cardX + cardW, divY, 3, "FD");

  // ===== bottom section =====
  const bottomY = divY + 5;
  const qrSize = 34;
  const qrX = cardX + 14;
  const qrY = bottomY;
  doc.addImage(ticket.__qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
  doc.setTextColor(...hexToRgb(MUTED));
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Scan at gate", qrX + qrSize / 2, qrY + qrSize + 4, {
    align: "center",
  });

  // details column
  const detailX = qrX + qrSize + 12;
  const detailW = cardX + cardW - 14 - detailX;

  // Start slightly higher so all details remain inside the card
  let dy = bottomY + 2;

  const row = (label, value, opts = {}) => {
    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...hexToRgb(MUTED));
    doc.text(label.toUpperCase(), detailX, dy);

    // Value
    doc.setFont(opts.mono ? "courier" : "helvetica", "bold");
    doc.setFontSize(opts.size || 9);
    doc.setTextColor(...hexToRgb(opts.color || TEXT));

    const lines = doc.splitTextToSize(String(value), detailW);

    doc.text(lines, detailX, dy + 4);

    // Compact spacing
    dy += 8 + Math.max(0, lines.length - 1) * 3.5;
  };

  row("Price", `INR ${ticket.price}`);

  if (ticket.via?.length) {
    row("Via", ticket.via.join(" → "), {
      size: 8,
    });
  }

  row("Issued", new Date(ticket.issuedAt).toLocaleString());

  row("Expires", new Date(ticket.expiredAt).toLocaleString(), {
    size: 9,
    color: "#dc2626",
  });

  // ===== footer =====
  const footY = 235;
  doc.setFillColor(...hexToRgb(LIGHT_BG));
  doc.roundedRect(cardX, footY, cardW, 32, 4, 4, "F");

  doc.setTextColor(...hexToRgb(TEXT));
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("How to use", cardX + 8, footY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...hexToRgb(MUTED));
  const steps = [
    "1.  Scan the QR code at the entry gate to start your journey.",
    "2.  Keep this ticket with you until you exit at the destination.",
    "3.  Show this PDF or the QR to a metro staff member on request.",
  ];
  steps.forEach((s, i) => doc.text(s, cardX + 8, footY + 14 + i * 5.5));

  // legal line
  doc.setFontSize(8);
  doc.setTextColor(...hexToRgb(MUTED));
  doc.text(
    `Metro Ticketing · Generated ${new Date().toLocaleString()} · Ticket ${ticket.ticketToken}`,
    W / 2,
    H - 12,
    { align: "center" },
  );

  // accent bottom rule
  doc.setFillColor(...hexToRgb(BRAND));
  doc.rect(0, H - 6, W, 2, "F");
  doc.setFillColor(...hexToRgb(ACCENT));
  doc.rect(W / 3, H - 6, W / 3, 2, "F");

  doc.save(`metro-ticket-${ticket.ticketToken}.pdf`);
};

/* ---------- helper: get QR as data URL from an offscreen render ---------- */
const getQrDataUrl = async (ticketToken) => {
  // Renders an SVG QR via react-qr-code in an offscreen container, then
  // draws it onto a canvas → returns a PNG data URL.
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.background = "#ffffff";
  document.body.appendChild(container);

  const ReactDOM = await import("react-dom/client");
  const root = ReactDOM.createRoot(container);

  await new Promise((resolve) => {
    root.render(
      React.createElement(ReactQrcode, {
        value: JSON.stringify({ ticketToken }),
        size: 512,
        bgColor: "#ffffff",
        fgColor: "#000000",
      }),
    );
    // give the SVG a tick to render
    setTimeout(resolve, 50);
  });

  const svg = container.querySelector("svg");
  if (!svg) {
    root.unmount();
    document.body.removeChild(container);
    return null;
  }

  const xml = new XMLSerializer().serializeToString(svg);
  const svg64 = btoa(unescape(encodeURIComponent(xml)));
  const img = new Image();
  const dataUrl = await new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = `data:image/svg+xml;base64,${svg64}`;
  });

  root.unmount();
  document.body.removeChild(container);
  return dataUrl;
};

/* ---------- component ---------- */
const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [downloading, setDownloading] = useState(null); // ticketToken while generating

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyTickets();
        setTickets(res.data.tickets || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch tickets.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [tickets.length]);

  const downloadTicketPDF = async (ticket) => {
    try {
      setDownloading(ticket.ticketToken);
      const qrDataUrl = await getQrDataUrl(ticket.ticketToken);
      generateTicketPDF({ ...ticket, __qrDataUrl: qrDataUrl });
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setDownloading(null);
    }
  };

  // ---- pagination ----
  const totalPages = Math.max(1, Math.ceil(tickets.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageTickets = tickets.slice(pageStart, pageStart + PAGE_SIZE);

  const buildPageList = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("…");
    for (
      let p = Math.max(2, currentPage - 1);
      p <= Math.min(totalPages - 1, currentPage + 1);
      p++
    )
      pages.push(p);
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">My tickets</h1>
        <p className="mt-1 text-sm text-muted">
          All your booked journeys, most recent first.
        </p>
      </header>

      {loading && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && <Alert type="error">{error}</Alert>}

      {!loading && !error && tickets.length === 0 && (
        <Card className="text-center text-muted">
          <TicketIcon className="mx-auto mb-3 h-10 w-10 opacity-50" />
          <p className="font-medium">No tickets yet</p>
          <p className="mt-1 text-sm">
            Book your first journey to see it here.
          </p>
        </Card>
      )}

      <div className="space-y-4">
        {pageTickets.map((ticket, i) => (
          <motion.div
            key={ticket.ticketToken}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card id={ticket.ticketToken} hover>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">
                      {ticket.source} <span className="text-muted">→</span>{" "}
                      {ticket.destination}
                    </h2>
                    <StatusBadge status={ticket.status} />
                  </div>
                  {ticket.via?.length > 0 && (
                    <p className="text-sm text-muted">
                      Via: {ticket.via.join(", ")}
                    </p>
                  )}
                  <p className="text-sm text-muted">Price: ₹{ticket.price}</p>
                  <p className="text-sm text-muted break-all">
                    Token:{" "}
                    <span className="font-mono text-brand">
                      {ticket.ticketToken}
                    </span>
                  </p>
                  <p className="text-xs text-muted">
                    Issued {new Date(ticket.issuedAt).toLocaleString()} ·
                    Expires {new Date(ticket.expiredAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-row items-center gap-4 sm:flex-col">
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-white p-2 shadow-soft">
                    <ReactQrcode
                      className="h-full w-full"
                      value={JSON.stringify({
                        ticketToken: ticket.ticketToken,
                      })}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    className="download-pdf-button"
                    onClick={() => downloadTicketPDF(ticket)}
                    loading={downloading === ticket.ticketToken}
                  >
                    {downloading === ticket.ticketToken
                      ? "Preparing…"
                      : "Download PDF"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {!loading && !error && tickets.length > PAGE_SIZE && (
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-muted">
            Showing{" "}
            <span className="font-medium text-text">
              {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, tickets.length)}
            </span>{" "}
            of <span className="font-medium text-text">{tickets.length}</span>{" "}
            tickets
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border
                bg-surface transition hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            {buildPageList().map((item, idx) =>
              item === "…" ? (
                <span key={`gap-${idx}`} className="px-1 text-sm text-muted">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setPage(item)}
                  aria-current={item === currentPage ? "page" : undefined}
                  className={`h-9 min-w-[36px] rounded-lg px-2 text-sm font-medium transition ${
                    item === currentPage
                      ? "bg-brand text-brand-fg shadow-soft"
                      : "border border-border bg-surface text-muted hover:bg-surface-2"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border
                bg-surface transition hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
