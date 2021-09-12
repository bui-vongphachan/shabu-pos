import { ProductModel } from "../../models";

export const deleteProduct = async (_: any, args: { product_id: string }) => {
  const { product_id } = args;
  
  await ProductModel.findOneAndUpdate(
    { _id: product_id },
    { $set: { isDeleted: true } }
  );

  return true;
};
