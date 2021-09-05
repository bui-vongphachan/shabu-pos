import { gql } from "apollo-server-express";
import { OrderModel, InvoiceModel } from "../../models";
import { gqlInvoiceFields } from "../../typeDefs";

export const updateOrderQuantity = async (
  _: any,
  args: {
    invoice_id: string;
    order_id: string;
    quantity: number;
  }
) => {
  const order = await OrderModel.findOne({ _id: args.order_id });

  if (!order) throw new Error("Order not found");

  await OrderModel.findOneAndUpdate(
    { _id: args.order_id },
    {
      $set: {
        quantity: args.quantity,
        totalPrice: args.quantity * order.size.price,
      },
    },
    { new: true }
  );

  return true;
  // return await InvoiceModel.updateTotalPrice(args.invoice_id)
};

export const updateOrderQuantityMutation = gql`
    mutation UpdateOrderQuantityMutation(
        $updateOrderQuantityInvoiceId: ID
        $updateOrderQuantityOrderId: ID
        $updateOrderQuantityQuantity: Int
    ) {
        updateOrderQuantity(
            invoice_id: $updateOrderQuantityInvoiceId
            order_id: $updateOrderQuantityOrderId
            quantity: $updateOrderQuantityQuantity
        )
        ${gqlInvoiceFields}
    }
`;
