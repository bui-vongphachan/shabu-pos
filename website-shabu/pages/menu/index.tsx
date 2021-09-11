import { useQuery } from "@apollo/client";
import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import DefaultLayout from "../../layouts/default";
import { client } from "../../lib/apolloSetup";
import { getProductsQueryString } from "../../lib/graphql/product/getProducts.gql";
import { ProductModel } from "../../models";
import AddProductMenuComponent from "./addProduct.menu";
import ProductEditorMenuComponent from "./productEditor.menu";
import ProductListMenuComponent from "./productList.menu";

export const MenuPageContext = createContext<{
  products: ProductModel[];
  setProducts: (products: ProductModel[]) => void;
}>({
  products: [],
  setProducts: function () {}
});

const Menu = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const { loading, error, data } = useQuery(getProductsQueryString);

  if (loading) return "loading";

  const context = { products: data.getProducts, setProducts };

  return (
    <MenuPageContext.Provider value={context}>
      <div className="mt-3 mx-auto grid gap-3 lg:w-4/12 container">
        <AddProductMenuComponent />
        <ProductListMenuComponent />
      </div>
    </MenuPageContext.Provider>
  );
};

Menu.getLayout = DefaultLayout;

export default Menu;
