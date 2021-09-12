import { ProductModel } from "../../models/product.model";
import { ProductOptionModel } from "../../models/productOption.model";
import { ProductSizeModel } from "../../models/productSize.model";

interface UpdateProductSize {
  size_id: string;
  name: string;
  price: number;
}

export const updateProduct = async (
  _: any,
  args: {
    product_id: string;
    name?: string;
    sizes: UpdateProductSize[];
  }
) => {
  const { product_id, name, sizes } = args;

  let condition = {};

  if (name) condition = { ...condition, name: name };
  if (sizes) {
    sizes.forEach(
      async (item) =>
        await ProductSizeModel.findOneAndUpdate(
          { _id: item.size_id },
          { $set: { name: item.name, price: item.price } },
          { new: true }
        )
    );
  }

  await ProductModel.findOneAndUpdate({ _id: product_id }, { $set: condition });
  return true;
};
