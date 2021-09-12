import { getProductCategories } from "./getProductCategories.query";
import { getProducts } from "./getProducts.query";
import { addProduct } from "./addProduct.resolver";
import { updateProduct } from "./updateProduct.mutation";
import { addProductSizes } from "./addProductSizes.mutation";
import { deleteProductSizes } from "./deleteProductSizes.mutation";
import { deleteProduct } from "./deleteProduct.mutation";

export const productResolver = {
  Query: { getProducts, getProductCategories },
  Mutation: {
    addProduct,
    updateProduct,
    deleteProduct,
    addProductSizes,
    deleteProductSizes,
  },
};
