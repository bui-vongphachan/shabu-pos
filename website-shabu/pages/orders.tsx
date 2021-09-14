import { QueryResult, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useState } from "react";
import { createContext } from "react";
import OrderDetailComponent from "../components/ordersPage/orderDetail.component";
import OrderListComponent from "../components/ordersPage/orderList.component";
import DefaultLayout from "../layouts/default";
import { InvoiceModel } from "../models/invoice";

export const OrdersPageContext = createContext<{
  getInvoicesResult: QueryResult | null;
  selectedInvoice: InvoiceModel | null;
  setSelectedInvoice: (data: InvoiceModel | null) => void;
}>({
  getInvoicesResult: null,
  selectedInvoice: null,
  setSelectedInvoice: () => {}
});

const OrdersPage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModel | null>(
    null
  );

  const getInvoicesResult = useQuery(getInvoicesString);

  const context = { getInvoicesResult, selectedInvoice, setSelectedInvoice };

  return (
    <OrdersPageContext.Provider value={context}>
      <div className=" container mt-3 mx-auto grid grid-cols-3 gap-3">
        <OrderListComponent />
        <OrderDetailComponent />
        <div>XXXX</div>
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
      orders {
        id
        name
        size {
          name
        }
        totalPrice
      }
    }
  }
`;
