import DefaultLayout from "../../../layouts/default";
import { InvoiceModel } from "../../../models/invoice";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { MAIN_QUERY } from "./main.query";
import { createContext } from "react";
import TableInvoice from "../../../components/tableInvoice/index";

export const TableInvoiceContext = createContext<{
  table_id: any;
  invoice: InvoiceModel | null;
}>({
  table_id: null,
  invoice: null
});

const TableDetail = () => {
  const router = useRouter();
  const { table_id } = router.query;
  const { loading, error, data } = useQuery(MAIN_QUERY, {
    variables: {
      getInvoiceTableId: table_id,
      getInvoiceIsPaid: false
    }
  });
  
  if (loading) return <TableInvoice.LoadingTableInvoiceComponent />;

  const invoice = data.getInvoice as InvoiceModel;

  const context = { invoice, table_id };

  if (data === undefined || !invoice)
    return <TableInvoice.InvoiceRecordTableInvoiceComponent />;

  return (
    <TableInvoiceContext.Provider value={context}>
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
