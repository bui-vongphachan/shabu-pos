import { Typography } from "antd";
import moment from "moment";
import { Fragment, useContext } from "react";
import { TableInvoiceContext } from "../../pages/report/[table_id]";

const InvoiceRecordTableInvoiceComponent = () => {
  const tableInvoiceContext = useContext(TableInvoiceContext);
  const { invoice } = tableInvoiceContext;

  if (!invoice) {
    return <span>Error</span>
  }

  let totalSpentTime = moment
    .duration(moment(new Date()).diff(invoice.arrived_time))
    .asMinutes();
  let totalSpentTimeText = "";
  if (totalSpentTime > 1000)
    totalSpentTimeText = `${Math.floor(totalSpentTime / 60)} ຊົ່ວໂມງ`;
  else totalSpentTimeText = `${Math.floor(totalSpentTime)} ນາທີ`;

  return (
    <Fragment>
      <Typography.Title level={4}>
        ໂຕະໝາຍເລກ {invoice.table.name}
      </Typography.Title>
      <table className=" w-full">
        <tbody>
          <tr>
            <td className=" px-3 py-1">ຈຳນວນຄົນ</td>
            <td className=" px-3 py-1">{invoice.customers}</td>
          </tr>
          <tr className="bg-emerald-200">
            <td className=" px-3 py-1">ເວລາມາ</td>
            <td className=" px-3 py-1">
              {moment(invoice.arrived_time).format("HH:mm")}
            </td>
          </tr>
          <tr>
            <td className=" px-3 py-1">ເວລາທີ່ໃຊ້</td>
            <td className=" px-3 py-1">{totalSpentTimeText}</td>
          </tr>
          <tr>
            <td className=" px-3 py-1">ອໍເດີ້</td>
            <td className=" px-3 py-1">{invoice.orders.length}</td>
          </tr>
          <tr>
            <td className=" px-3 py-1">ລາຄາລວມ</td>
            <td className=" px-3 py-1">
              {invoice.total_price.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
};

export default InvoiceRecordTableInvoiceComponent;
