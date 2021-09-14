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
    delivery_price: number;
  }
) => {
  const { foods, customer_name, delivery_price } = args;

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
        size: {
          id: size?.id,
          name: size?.name,
          price: size?.price,
        },
      };
    })
  );

  const newOrders = await OrderModel.insertMany(orders);
  const totalPrice = newOrders.reduce((sum, item) => sum + item.totalPrice, 0);

  await new InvoiceModel({
    orders: newOrders.map((item) => item.id),
    customer_name,
    total_price: totalPrice,
    delivery_price: delivery_price,
    final_price: totalPrice + delivery_price,
  }).save();

  return true;
};
