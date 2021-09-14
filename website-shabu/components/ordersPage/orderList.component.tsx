import { List, Spin } from "antd";
import { useContext } from "react";
import { InvoiceModel } from "../../models/invoice";
import { OrdersPageContext } from "../../pages/orders";

const OrderListComponent = () => {
  const orderPageContext = useContext(OrdersPageContext);
  const { data, error, loading } = orderPageContext.getInvoicesResult!;
  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%"
        }}
      />
    );
  }

  if (error) return <span>ERROR</span>;

  const invoices: InvoiceModel[] = !data.getInvoices ? [] : data.getInvoices;

  return (
    <div className=" overflow-scroll" style={{ maxHeight: `calc(89vh)` }}>
      <List
        className=""
        itemLayout="horizontal"
        dataSource={invoices}
        locale={{ emptyText: "ບໍ່ມີລາຍການ" }}
        renderItem={(item, index) => (
          <List.Item key={index} className=" hover:shadow-md p-3 ">
            <List.Item.Meta
              title={`${invoices.length - index}. ${item.customer_name}`}
              description={item.orders.length + " ລາຍການ"}
            />
            {item.final_price.toLocaleString()}
          </List.Item>
        )}
      />
    </div>
  );
};

export default OrderListComponent;
