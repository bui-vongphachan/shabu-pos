import { ProductModel } from "../../models/product.model";
import { ProductOptionModel } from "../../models/productOption.model";
import { ProductSizeModel } from "../../models/productSize.model";

export const addProduct = async (
  _: any,
  args: {
    name: string;
    sizes: [{ name: string; price: number }];
    options: [{ name: string; price: number }];
  }
) => {
  const { name, sizes, options } = args;

  const productSizes = await ProductSizeModel.insertMany(sizes);

  const productOptions = await ProductOptionModel.insertMany(options);

  await new ProductModel({
    name,
    sizes: productSizes.map((item) => item.id),
    options: productOptions.map((item) => item.id),
  }).save();

  return true;
};
