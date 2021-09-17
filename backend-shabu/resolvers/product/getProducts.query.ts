import { ProductModel } from "../../models/product.model";

export const getProducts = async () => {
  const item = await ProductModel.find({ isDeleted: false })
    .populate({
      path: "sizes",
      match: { isDeleted: false },
    })
    .populate({
      path: "options",
    })
    .sort({ created_date: -1 });

  return item;
};
