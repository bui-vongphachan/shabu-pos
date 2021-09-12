import { gql } from "apollo-server-express";
import { InvoiceModel, TableModel } from "../../models";

export const getReadyTables = async () => {
  const invoices = await InvoiceModel.find({ isLeft: false });
  const tables = await TableModel.find().sort({ created_date: -1 });

  const readyTables = tables.map((table) => {
    let data = {
      table: table,
      status: "ວ່າງ",
      orders: 0,
    };
    const found = invoices.find((invoice) => {
      return invoice.table.id.toString() === table.id;
    });
    if (found) {
      data.orders = found.orders.length;
      data.status = "ກຳລັງໃຊ້ງານ";
    }
    return data;
  });
  return readyTables;
};
