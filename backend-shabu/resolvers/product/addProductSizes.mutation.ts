import { ProductModel } from "../../models/product.model";
import { ProductSizeModel } from "../../models/productSize.model";

export const addProductSizes = async (
  _: any,
  args: {
    product_id: string;
    sizes: [{ name: string; price: number }];
  }
) => {
  const { product_id, sizes } = args;

  const productSizes = await ProductSizeModel.insertMany(sizes);

  await ProductModel.findOneAndUpdate(
    { _id: product_id },
    {
      $push: { sizes: { $each: productSizes.map((item) => item.id) } },
    }
  );

  return true;
};
