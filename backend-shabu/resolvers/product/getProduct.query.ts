import { ProductModel } from "../../models/product.model";

export const getProduct = async (
  _: any,
  args: {
    product_id: string;
  }
) => {
  return await ProductModel.findOne({ _id: args.product_id })
    .populate({
      path: "sizes",
      match: { isDeleted: false },
    })
    .sort({ created_date: -1 });
};
