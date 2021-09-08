import DefaultLayout from "../../../layouts/default";
import { InvoiceModel } from "../../../models/invoice";
import { useRouter } from "next/router";
import { DocumentNode, gql, useQuery } from "@apollo/client";
import { createContext } from "react";
import TableInvoice from "../../../components/tableInvoice/index";
import { useState } from "react";
import { OrderModel } from "../../../models/order";

export const TableInvoiceContext = createContext<{
  table_id: any;
  invoice: InvoiceModel | null;
  selectedOrder: OrderModel | null;
  isUpdateOrderModalOpen: boolean;
  GET_INVOICE: DocumentNode | null;
  setUpdateOrderModalOpen: (status: boolean) => void;
  setSelectedOrder: (order: OrderModel) => void;
}>({
  table_id: null,
  invoice: null,
  selectedOrder: null,
  isUpdateOrderModalOpen: false,
  GET_INVOICE: null,
  setUpdateOrderModalOpen: () => {},
  setSelectedOrder: () => {}
});

const TableDetail = () => {
  const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
  const [isUpdateOrderModalOpen, setUpdateOrderModalOpen] = useState(false);
  const router = useRouter();
  const { table_id } = router.query;
  const { loading, error, data } = useQuery(GET_INVOICE, {
    variables: {
      getInvoiceTableId: table_id,
      getInvoiceIsPaid: false
    }
  });

  if (loading) return <TableInvoice.LoadingTableInvoiceComponent />;

  if (!data.getInvoice) return <TableInvoice.NoInvoiceTableInvoiceComponent />;

  const context = {
    invoice: data.getInvoice,
    table_id,
    selectedOrder,
    isUpdateOrderModalOpen,
    GET_INVOICE,
    setUpdateOrderModalOpen,
    setSelectedOrder
  };

  return (
    <TableInvoiceContext.Provider value={context}>
      <TableInvoice.UpdateOrderTableInvoiceComponent />
      <div className="container my-3 mx-auto">
        <TableInvoice.InvoiceRecordTableInvoiceComponent />
        <TableInvoice.ActionsTableInvoiceComponent />
        <TableInvoice.OrderListTableInvoiceComponent />
      </div>
    </TableInvoiceContext.Provider>
  );
};

TableDetail.getLayout = DefaultLayout;

export default TableDetail;

const GET_INVOICE = gql`
  query Query($getInvoiceTableId: String, $getInvoiceIsPaid: Boolean) {
    getInvoice(table_id: $getInvoiceTableId, isPaid: $getInvoiceIsPaid) {
      id
      table {
        name
      }
      customers
      arrived_time
      orders {
        id
        name
        quantity
        totalPrice
        isDeleted
        product {
          name
          sizes {
            id
            name
            price
          }
        }
        size {
          id {
            id
          }
          name
          price
        }
      }
      time_spent
      total_price
    }
  }
`;
