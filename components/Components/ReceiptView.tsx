import React from "react";
import { Order } from "@/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Props {
  order: Order;
  amount: number;
  onClose: () => void;
}

const ReceiptView: React.FC<Props> = ({ order, amount, onClose }) => {
  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const handlePrint = async () => {
    const element = document.getElementById("receipt-content");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      removeContainer: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200],
    });

    const imgWidth = 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    pdf.autoPrint();

    window.open(pdf.output("bloburl"), "_blank");
  };

  const handleDownload = async () => {
    const element = document.getElementById("receipt-content");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: "#ffffff",
      useCORS: true,
      removeContainer: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200],
    });

    const imgWidth = 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Receipt-${order.id}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div
        id="receipt-content"
        className="bg-white text-black font-mono text-sm p-5 rounded-xl shadow-inner border border-zinc-200"
        style={{ width: "100%", maxWidth: "320px", margin: "0 auto" }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-lg font-bold tracking-wide">
            ELYSIUM RESTAURANT
          </div>
          <div className="text-xs">21 MG Road, Bengaluru</div>
          <div className="text-xs">GSTIN: 29ABCDE1234F1Z5</div>
          <div className="text-xs mt-2">{new Date().toLocaleString()}</div>
        </div>

        <div className="border-t border-dashed border-black my-2" />

        <div className="text-xs mb-2">Order ID: {order.id}</div>

        <div className="border-t border-dashed border-black my-2" />

        {/* Items */}
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between">
                <span className="font-semibold">{item.name}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="text-xs text-zinc-600">
                {item.quantity} × ₹{item.price.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-black my-3" />

        {/* Totals */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>GST 12%</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="border-t border-black my-2" />

          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-xs mt-2">
            <span>Paid</span>
            <span>₹{amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-3" />

        <div className="text-center text-xs">
          <div>Payment Mode: {order.payments.slice(-1)[0]?.mode}</div>
          <div className="mt-2">Thank you for dining with us</div>
          <div>Visit Again!</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Print
        </button>

        <button
          onClick={handleDownload}
          className="flex-1 py-2 bg-zinc-800 text-white rounded-lg"
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default ReceiptView;
