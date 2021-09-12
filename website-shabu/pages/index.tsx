import {
  DocumentNode,
  QueryResult,
  useLazyQuery,
  useQuery
} from "@apollo/client";
import gql from "graphql-tag";
import { useEffect } from "react";
import { createContext } from "react";
import NewOrderFormComponent from "../components/homePage/newOrderForm.component";
import OrderListComponent from "../components/homePage/invoiceList.componen";
import DefaultLayout from "../layouts/default";
import { InvoiceModel } from "../models/invoice";

export const MainPageContext = createContext<{
  getProductGQL: QueryResult | null;
  getInvoicesResult: QueryResult | null;
  getInvoicesString: DocumentNode | null;
}>({
  getProductGQL: null,
  getInvoicesResult: null,
  getInvoicesString: null
});

const Home = () => {
  const getProductGQL = useQuery(gql`
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
        orders {
          id
          name
        }
      }
    }
  `;

  const getInvoicesResult = useQuery(getInvoicesString);

  let context = { getProductGQL, getInvoicesResult, getInvoicesString };

  return (
    <MainPageContext.Provider value={context}>
      <div className=" gap-3 grid grid-cols-2 lg:w-6/12 m-auto mt-3">
        <NewOrderFormComponent />

        <OrderListComponent />
      </div>
    </MainPageContext.Provider>
  );
};

Home.getLayout = DefaultLayout;

export default Home;
