import { InvoiceModel } from "../../models/invoice";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const getInvoice = (invoice: InvoiceModel) => {
  const orderID = invoice.id.substring(
    invoice.id.length - 6,
    invoice.id.length
  );

  const imageHeight = 50;
  const headerHeight = 15;
  const lineHeight = 5;
  const productHeight = 10;
  const subProductHeight = 5;
  const productNewLineHeight = 7;
  const sumaryHeight = 10;
  const signoffHeight = 10;
  let totalHeight = 10;
  let trackingHeight = 0;

  totalHeight += imageHeight;
  totalHeight += headerHeight;
  totalHeight += headerHeight;
  totalHeight += lineHeight;

  if (invoice.orders.length > 0) {
    invoice.orders.forEach((item) => {
      totalHeight += productHeight;
      item.options.forEach(() => {
        totalHeight += subProductHeight;
      });
    });
  }

  totalHeight += productNewLineHeight;
  totalHeight += sumaryHeight;
  totalHeight += productNewLineHeight;
  totalHeight += sumaryHeight;
  totalHeight += productNewLineHeight;
  totalHeight += signoffHeight;
  const doc = new jsPDF("p", "mm", [88, totalHeight], false);

  doc.addFont("/assets/fonts/Phetsarath OT.ttf", "saysettha_OT", "normal");

  trackingHeight += imageHeight;

  doc.addImage(
    "/assets/images/LOGO.png",
    18,
    1,
    trackingHeight,
    trackingHeight,
    "image",
    "FAST"
  );

  doc.setFont("saysettha_OT");
  doc.setFontSize(15);

  trackingHeight += headerHeight;

  doc.text(`ຊີ້ນດາດໂປ້ຍຊຽນ - Poysian BBQ`, 9, trackingHeight);

  doc.setFontSize(13);
  trackingHeight += headerHeight;
  doc.text(`#ບິນ ${orderID.toUpperCase()}`, 4, trackingHeight);

  trackingHeight += lineHeight;

  doc.line(87, trackingHeight, 1, trackingHeight);

  doc.setFontSize(10);

  invoice.orders.forEach((item) => {
    trackingHeight += productHeight;

    doc.text(
      `${item.name} (${item.size.name}) ${
        item.quantity
      } x ${item.size.price.toLocaleString()}`,
      4,
      trackingHeight
    );
    doc.text(item.totalFoodPrice.toLocaleString(), 83, trackingHeight, {
      align: "right"
    });
    if (item.options.length > 0) {
      doc.setFontSize(8);

      item.options.forEach((item) => {
        trackingHeight += subProductHeight;
        doc.text(`- ${item.name}`, 6, trackingHeight);
        doc.text(item.price.toLocaleString(), 83, trackingHeight, {
          align: "right"
        });
      });

      doc.setFontSize(10);
    }
  });

  trackingHeight += productNewLineHeight;
  doc.line(87, trackingHeight, 1, trackingHeight);
  doc.setFontSize(10);

  trackingHeight += sumaryHeight;
  doc.text("ຄ່າອາຫານລວມ", 4, trackingHeight);
  doc.text(invoice.totalFoodPrice.toLocaleString(), 83, trackingHeight, {
    align: "right"
  });

  trackingHeight += productNewLineHeight;
  doc.text("ຄ່າສົ່ງ", 4, trackingHeight);
  doc.text(invoice.delivery_price.toLocaleString(), 83, trackingHeight, {
    align: "right"
  });
  trackingHeight += sumaryHeight;
  doc.setFontSize(13);
  doc.text("ຍອດລວມ", 4, trackingHeight);
  doc.text(invoice.final_price.toLocaleString(), 83, trackingHeight, {
    align: "right"
  });

  trackingHeight += productNewLineHeight;
  doc.line(87, trackingHeight, 1, trackingHeight);

  doc.setFontSize(13);
  trackingHeight += signoffHeight;
  doc.text("ຂອບໃຈທີ່ອຸດໜຸນ", 29, trackingHeight);

  doc.output("dataurlnewwindow");
};
