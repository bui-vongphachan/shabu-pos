import { DocumentNode, QueryResult, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { createContext } from "react";
import NewOrderFormComponent from "../components/homePage/newInvoiceForm.component";
import OrderListComponent from "../components/homePage/invoiceList.componen";
import DefaultLayout from "../layouts/default";
import ProductListComponent from "../components/homePage/productList.component";
import { useState } from "react";
import { ProductModel, ProductSizeModel } from "../models";

interface productInCart {
  product: ProductModel;
  size: string;
  sizeData: ProductSizeModel;
  quantity: number;
}

export const MainPageContext = createContext<{
  selectedProducts: productInCart[];
  getProductsResult: QueryResult | null;
  getInvoicesResult: QueryResult | null;
  getInvoicesString: DocumentNode | null;
  addToCart: (item: ProductModel) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  updateCart: (index: number, key: any, value: any) => void;
}>({
  selectedProducts: [],
  getProductsResult: null,
  getInvoicesResult: null,
  getInvoicesString: null,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateCart: () => {}
});

const Home = () => {
  const [selectedProducts, setSelectedProducts] = useState<productInCart[]>([]);
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

  const getInvoicesString = gql`
    query Query {
      getInvoices {
        id
        customer_name
        orders {
          id
          name
        }
        total_price
      }
    }
  `;

  const getInvoicesResult = useQuery(getInvoicesString);

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
    getInvoicesResult,
    getInvoicesString,
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
        <OrderListComponent />
      </div>
    </MainPageContext.Provider>
  );
};

Home.getLayout = DefaultLayout;

export default Home;
