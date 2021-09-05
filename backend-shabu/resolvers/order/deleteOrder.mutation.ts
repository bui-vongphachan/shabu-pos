import { InvoiceModel, OrderModel } from "../../models";

export const deleteOrder = async (
  _: any,
  args: {
    invoice_id: string;
    order_id: string;
  }
) => {
  const order = await OrderModel.findOneAndUpdate(
    { _id: args.order_id },
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    }
  );

  if (!order) throw new Error("Order not found");

  await InvoiceModel.updateTotalPrice(args.invoice_id);

  return true;
};
