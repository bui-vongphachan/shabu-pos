import { ProductModel } from "../../models/product.model";

export const getProducts = async () => {
  return await ProductModel.find()
    .populate("sizes")
    .populate({
      path: "sizes",
      match: { isDeleted: false },
    })
    .sort({ created_date: -1 });
};
