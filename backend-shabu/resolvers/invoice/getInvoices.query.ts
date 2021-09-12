import { InvoiceModel } from "../../models";

export const getInvoices = async (
  _: any,
  args: {
    table_id: string;
    isPaid: boolean;
  }
) => {
  return await InvoiceModel.find()
    .populate("orders")
    .sort({ created_date: -1 });
};
