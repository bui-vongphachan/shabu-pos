import { QueryResult, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useState } from "react";
import { createContext } from "react";
import OrderDetailComponent from "../components/ordersPage/orderDetail.component";
import OrderListComponent from "../components/ordersPage/orderList.component";
import DefaultLayout from "../layouts/default";
import { InvoiceModel } from "../models/invoice";

export const OrdersPageContext = createContext<{
  GetInvoicesResult: QueryResult | null;
  selectedInvoice: InvoiceModel | null;
  setSelectedInvoice: (data: InvoiceModel | null) => void;
}>({
  GetInvoicesResult: null,
  selectedInvoice: null,
  setSelectedInvoice: () => {}
});

const OrdersPage = (props: { invoices: InvoiceModel[] }) => {
  const GetInvoicesResult = useQuery(getInvoicesString);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModel | null>(
    null
  );

  const context = {
    GetInvoicesResult,
    selectedInvoice,
    setSelectedInvoice
  };

  return (
    <OrdersPageContext.Provider value={context}>
      <div className=" container mt-3 mx-auto grid grid-cols-6 gap-3">
        <div className=" md:col-span-3 lg:col-span-3">
          <OrderListComponent />
        </div>
        <div className=" md:col-span-3 lg:col-span-3">
          <OrderDetailComponent />
        </div>
      </div>
    </OrdersPageContext.Provider>
  );
};

OrdersPage.getLayout = DefaultLayout;

export default OrdersPage;

const getInvoicesString = gql`
  query Query {
    getInvoices {
      id
      customer_name
      final_price
      totalFoodPrice
      delivery_price
      orders {
        id
        name
        options {
          id
          name
          price
        }
        size {
          name
          price
        }
        quantity
        totalFoodPrice
        totalPrice
      }
    }
  }
`;
