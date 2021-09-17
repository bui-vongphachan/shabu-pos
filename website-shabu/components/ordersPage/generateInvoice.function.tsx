import { InvoiceModel } from "../../models/invoice";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const getInvoice = (invoice: InvoiceModel) => {
  let totalHeight = 0;

  if (invoice.orders.length > 0) {
    totalHeight += invoice.orders.length * 14;
  }

  const doc = new jsPDF("p", "mm", [88, totalHeight], false);
  doc.addFont("/assets/fonts/Phetsarath OT.ttf", "saysettha_OT", "normal");
  doc.setFont("saysettha_OT");
  doc.setFontSize(10);

  let textLine = 10;

  invoice.orders.forEach((item) => {
    doc.text(
      `${item.name} (${item.size.name}) ${item.quantity} x ${item.size.price}`,
      4,
      textLine
    );

    doc.text(
      `${item.name} (${item.size.name}) ${item.quantity} x ${item.size.price}`,
      4,
      textLine
    );

    doc.text(item.totalPrice.toLocaleString(), 83, textLine, {
      align: "right"
    });
    textLine += 4;

    doc.text(item.options.map((item) => item.name).toString(), 4, textLine);

    textLine += 10;
  });

  {
    doc.line(87, textLine, 1, textLine);
    doc.setFontSize(15);
    doc.text("ຍອດລວມ", 4, textLine + 10);
    doc.text(invoice.final_price.toLocaleString(), 83, textLine + 10, {
      align: "right"
    });
  }

  doc.output("dataurlnewwindow");
};
