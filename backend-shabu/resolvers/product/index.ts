import { getProductCategories } from "./getProductCategories.query";
import { getProducts } from "./getProducts.query";
import { addProduct } from "./addProduct.resolver";
import { updateProduct } from "./updateProduct.mutation";

export const productResolver = {
  Query: { getProducts, getProductCategories },
  Mutation: { addProduct, updateProduct },
};
