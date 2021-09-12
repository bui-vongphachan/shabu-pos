import { InvoiceModel, OrderModel, ProductModel } from "../../models";

export const newInvoice = async (
  _: any,
  args: {
    foods: [
      {
        product_id: string;
      }
    ];
    customer_name: string;
  }
) => {
  const { foods, customer_name } = args;

  const orders = await Promise.all(
    foods.map(async (item) => {
      const product = await ProductModel.findOne({ _id: item.product_id });
      return {
        product: product?.id,
        name: product?.name,
      };
    })
  );

  const newOrders = await OrderModel.insertMany(orders);

  const invoice = await new InvoiceModel({
    orders: newOrders.map((item) => item.id),
    customer_name,
  }).save();

  return true;
};
