import { DocumentNode, gql, useQuery } from "@apollo/client";
import { Result, Spin } from "antd";
import { createContext, useState } from "react";
import AddProductMenuComponent from "../components/productMenu/addProduct.menu";
import ProductEditorMenuComponent from "../components/productMenu/productEditor.menu";
import ProductListMenuComponent from "../components/productMenu/productList.menu";
import DefaultLayout from "../layouts/default";
import { ProductModel } from "../models";

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
          id
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
      <div className="mt-3 mx-auto grid gap-3 lg:grid-cols-2 lg:w-8/12 xl:w-6/12 container">
        <AddProductMenuComponent />
        <ProductListMenuComponent />
        <ProductEditorMenuComponent />
      </div>
    </MenuPageContext.Provider>
  );
};

Menu.getLayout = DefaultLayout;

export default Menu;
