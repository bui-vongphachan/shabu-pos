import { DocumentNode, gql, useQuery } from "@apollo/client";
import { Spin } from "antd";
import { createContext, useState } from "react";
import DefaultLayout from "../../layouts/default";
import { ProductModel } from "../../models";
import AddProductMenuComponent from "./addProduct.menu";
import ProductEditorMenuComponent from "./productEditor.menu";
import ProductListMenuComponent from "./productList.menu";

export const MenuPageContext = createContext<{
  products: ProductModel[];
  getProductGQL: DocumentNode | null;
  setProducts: (products: ProductModel[]) => void;
}>({
  getProductGQL: null,
  products: [],
  setProducts: function () {}
});

const Menu = () => {
  const getProductGQL = gql`
    query Query {
      getProducts {
        id
        name
        options {
          name
          price
        }
        sizes {
          name
          price
        }
      }
    }
  `;

  const [products, setProducts] = useState<ProductModel[]>([]);
  const { loading, error, data } = useQuery(getProductGQL);

  if (loading)
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh"
        }}
      />
    );

  const context = { getProductGQL, products: data.getProducts, setProducts };

  return (
    <MenuPageContext.Provider value={context}>
      <div className="mt-3 mx-auto grid gap-3 lg:grid-cols-3 container">
        <AddProductMenuComponent />
        <ProductListMenuComponent />
        <ProductEditorMenuComponent />
      </div>
    </MenuPageContext.Provider>
  );
};

Menu.getLayout = DefaultLayout;

export default Menu;
