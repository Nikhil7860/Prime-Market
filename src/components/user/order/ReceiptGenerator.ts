import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "./types";

export const downloadReceipt = (order: Order) => {
    const doc = new jsPDF();

    // =====================================
    // HEADER
    // =====================================

    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59);

    doc.text("INVOICE", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(90);

    doc.text("My Ecommerce Store", 14, 32);
    doc.text("support@mystore.com", 14, 39);
    doc.text("+91 9876543210", 14, 46);

    doc.setTextColor(50);

    doc.text(`Invoice : ${order._id.slice(-8)}`, 140, 25);
    doc.text(`Customer : ${order.user}`, 140, 32);
    doc.text(`Status : ${order.status}`, 140, 39);

    doc.line(14, 52, 196, 52);

    // =====================================
    // TABLE
    // =====================================

    autoTable(doc, {
        startY: 62,

        head: [
            [
                "Product",
                "Quantity",
                "Price",
                "Subtotal",
            ],
        ],

        body: order.items.map((item) => [
            item.productName,
            item.quantity,
            `₹${item.price.toLocaleString()}`,
            `₹${(item.quantity * item.price).toLocaleString()}`,
        ]),

        theme: "grid",

        headStyles: {
            fillColor: [30, 41, 59],
            textColor: 255,
            halign: "center",
        },

        bodyStyles: {
            halign: "center",
        },

        styles: {
            fontSize: 10,
        },
    });

    const finalY =
        (doc as any).lastAutoTable.finalY + 15;

    // =====================================
    // BILL SUMMARY
    // =====================================

    doc.setFontSize(12);

    doc.text(
        `Coupon Discount : ₹${order.couponDiscount.toLocaleString()}`,
        120,
        finalY
    );

    doc.setFontSize(16);

    doc.setTextColor(37, 99, 235);

    doc.text(
        `Grand Total : ₹${order.totalAmount.toLocaleString()}`,
        120,
        finalY + 12
    );

    // =====================================
    // FOOTER
    // =====================================

    doc.setTextColor(100);

    doc.setFontSize(11);

    doc.text(
        "Thank you for shopping with us.",
        14,
        finalY + 35
    );

    doc.text(
        "This invoice was generated automatically.",
        14,
        finalY + 42
    );

    doc.save(`Invoice-${order._id.slice(-8)}.pdf`);
};