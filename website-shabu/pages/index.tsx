import {
  DocumentNode,
  QueryResult,
  useLazyQuery,
  useQuery
} from "@apollo/client";
import gql from "graphql-tag";
import { useEffect } from "react";
import { createContext } from "react";
import NewOrderFormComponent from "../components/homePage/newInvoiceForm.component";
import OrderListComponent from "../components/homePage/invoiceList.componen";
import DefaultLayout from "../layouts/default";
import { InvoiceModel } from "../models/invoice";
import ProductListComponent from "../components/homePage/productList.component";
import { useState } from "react";
import { ProductModel } from "../models";

export const MainPageContext = createContext<{
  selectedProducts: ProductModel[];
  getProductsResult: QueryResult | null;
  getInvoicesResult: QueryResult | null;
  getInvoicesString: DocumentNode | null;
  addToCart: (item: ProductModel) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}>({
  selectedProducts: [],
  getProductsResult: null,
  getInvoicesResult: null,
  getInvoicesString: null,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {}
});

const Home = () => {
  const [selectedProducts, setSelectedProducts] = useState<ProductModel[]>([]);
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
    setSelectedProducts([...selectedProducts, item]);
  };

  const removeFromCart = (itemIndex: number) => {
    selectedProducts.splice(itemIndex, 1);
    setSelectedProducts([...selectedProducts]);
  };

  const clearCart = () => setSelectedProducts([]);

  let context = {
    getProductsResult,
    getInvoicesResult,
    getInvoicesString,
    selectedProducts,
    addToCart,
    removeFromCart,
    clearCart
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
