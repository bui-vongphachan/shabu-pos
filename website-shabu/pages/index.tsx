import { QueryResult, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { createContext } from "react"; 
import DefaultLayout from "../layouts/default"; 
import { useState } from "react";
import { ProductModel, ProductSizeModel } from "../models";
import ProductListComponent from "../components/homePage/productList.component";
import NewOrderFormComponent from "../components/homePage/newInvoiceForm.component";

export interface ProductInCart {
  product: ProductModel;
  size: string;
  sizeData: ProductSizeModel;
  quantity: number;
}

export const MainPageContext = createContext<{
  selectedProducts: ProductInCart[];
  getProductsResult: QueryResult | null;
  addToCart: (item: ProductModel) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  updateCart: (index: number, key: any, value: any) => void;
}>({
  selectedProducts: [],
  getProductsResult: null,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateCart: () => {}
});

const Home = () => {
  const [selectedProducts, setSelectedProducts] = useState<ProductInCart[]>([]);
  const getProductsResult = useQuery(gql`
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
  `);

  const addToCart = (item: ProductModel) => {
    const newArray = [
      ...selectedProducts,
      {
        product: item,
        sizeData: item.sizes[0],
        size: item.sizes[0].id,
        quantity: 1
      }
    ];
    setSelectedProducts(newArray);
  };

  const removeFromCart = (itemIndex: number) => {
    selectedProducts.splice(itemIndex, 1);
    setSelectedProducts([...selectedProducts]);
  };

  const clearCart = () => setSelectedProducts([]);

  const updateCart = (index: number, key: any, value: any) => {
    selectedProducts[index] = { ...selectedProducts[index], [key]: value };
    const newArray = selectedProducts;
    setSelectedProducts([...newArray]);
  };

  let context = {
    getProductsResult,
    selectedProducts,
    addToCart,
    removeFromCart,
    clearCart,
    updateCart
  };

  return (
    <MainPageContext.Provider value={context}>
      <div className=" container gap-3 grid grid-cols-3 m-auto mt-3">
        <ProductListComponent />
        <NewOrderFormComponent />
      </div>
    </MainPageContext.Provider>
  );
};

Home.getLayout = DefaultLayout;

export default Home;
