import {
  InvoiceModel,
  OrderModel,
  ProductModel,
  ProductSizeModel,
} from "../../models";

export const newInvoice = async (
  _: any,
  args: {
    foods: [
      {
        product_id: string;
        size_id: string;
        quantity: number;
        options: string[];
        description: string;
      }
    ];
    customer_name: string;
    delivery_price: number;
  }
) => {
  const { foods, customer_name, delivery_price } = args;

  const orders = await Promise.all(
    foods.map(async (item) => {
      const product = await ProductModel.findOne({
        _id: item.product_id,
      }).populate("options");

      if (!product) throw new Error("Product not found");

      const size = await ProductSizeModel.findOne({ _id: item.size_id });

      if (!size) throw new Error("Product size not found");

      const options = item.options.map((option_id) => {
        const option = product.options.find(
          (option) => option.id === option_id
        );

        if (!option) throw new Error("Product option not found");

        return {
          name: option.name,
          price: option.price,
          quantity: 1,
        };
      });

      const totalFoodPrice = item.quantity * size!.price;
      return {
        product: product?.id,
        name: product?.name,
        size_id: size?.id,
        quantity: item.quantity,
        size: {
          id: size?.id,
          name: size?.name,
          price: size?.price,
        },
        description: item.description,
        options: options,
        totalFoodPrice: totalFoodPrice,
        totalPrice:
          totalFoodPrice + options.reduce((sum, item) => sum + item.price, 0),
      };
    })
  );

  const newOrders = await OrderModel.insertMany(orders);
  const totalPrice = newOrders.reduce((sum, item) => sum + item.totalPrice, 0);

  const newInvoice = await new InvoiceModel({
    orders: newOrders.map((item) => item.id),
    customer_name,
    total_price: totalPrice,
    totalFoodPrice: totalPrice,
    delivery_price: delivery_price,
    final_price: totalPrice + delivery_price,
  }).save();

  return await InvoiceModel.findOne({ _id: newInvoice.id }).populate("orders");
};
