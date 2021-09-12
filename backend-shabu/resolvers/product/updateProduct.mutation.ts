import { ProductModel } from "../../models/product.model";
import { ProductOptionModel } from "../../models/productOption.model";
import { ProductSizeModel } from "../../models/productSize.model";

export const updateProduct = async (
  _: any,
  args: {
    product_id: string;
    name?: string;
  }
) => {
  const { product_id, name } = args;

  let condition = {};

  if (name) condition = { ...condition, name: name };

  await ProductModel.findOneAndUpdate(
    { _id: product_id },
    {
      $set: condition,
    }
  );
  return true;
};
