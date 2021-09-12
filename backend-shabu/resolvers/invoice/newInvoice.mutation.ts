import {
  InvoiceModel,
  OrderModel,
  ProductModel,
  ProductSizeModel,
} from "../../models";

export const newInvoice = async (
  _: any,
  args: {
    foods: [{ product_id: string; size_id: string; quantity: number }];
    customer_name: string;
  }
) => {
  const { foods, customer_name } = args;

  const orders = await Promise.all(
    foods.map(async (item) => {
      const product = await ProductModel.findOne({ _id: item.product_id });
      const size = await ProductSizeModel.findOne({ _id: item.size_id });
      return {
        product: product?.id,
        name: product?.name,
        size_id: size?.id,
        quantity: item.quantity,
        totalPrice: item.quantity * size!.price,
      };
    })
  );

  const newOrders = await OrderModel.insertMany(orders);

  await new InvoiceModel({
    orders: newOrders.map((item) => item.id),
    customer_name,
    total_price: newOrders.reduce((sum, item) => (sum + item.totalPrice), 0)
  }).save();

  return true;
};
