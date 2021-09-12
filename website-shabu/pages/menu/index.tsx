import { DocumentNode, gql, useQuery } from "@apollo/client";
import { Button, Result, Spin } from "antd";
import { createContext, useState } from "react";
import DefaultLayout from "../../layouts/default";
import { ProductModel } from "../../models";
import AddProductMenuComponent from "./addProduct.menu";
import ProductEditorMenuComponent from "./productEditor.menu";
import ProductListMenuComponent from "./productList.menu";

export const MenuPageContext = createContext<{
  isUpdateModalOpen: boolean;
  selectedProduct: ProductModel | null;
  products: ProductModel[];
  getProductGQL: DocumentNode | null;
  setProducts: (products: ProductModel[]) => void;
  setSelectedProduct: (product: ProductModel) => void;
  setUpdateModal: (status: boolean) => void;
}>({
  isUpdateModalOpen: false,
  selectedProduct: null,
  getProductGQL: null,
  products: [],
  setProducts: function () {},
  setSelectedProduct: function () {},
  setUpdateModal: function () {}
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

  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(
    null
  );
  const [isUpdateModalOpen, setUpdateModal] = useState(false);
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

  if (error)
    return <Result status="error" title="ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ." />;

  const context = {
    getProductGQL,
    isUpdateModalOpen,
    selectedProduct,
    products: data.getProducts,
    setProducts,
    setSelectedProduct,
    setUpdateModal
  };

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
