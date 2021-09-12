import { ProductSizeModel } from "../../models/productSize.model";

export const deleteProductSizes = async (_: any, args: { sizes: [string] }) => {
  const { sizes } = args;

  await ProductSizeModel.updateMany(
    { _id: { $in: sizes } },
    { $set: { isDeleted: true } }
  );

  return true;
};
