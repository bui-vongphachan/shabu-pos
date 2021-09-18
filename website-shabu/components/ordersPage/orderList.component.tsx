import { List, Result, Skeleton, Spin } from "antd";
import classNames from "classnames";
import { useContext } from "react";
import { InvoiceModel } from "../../models/invoice";
import { OrdersPageContext } from "../../pages/orders";

const OrderListComponent = () => {
  const orderPageContext = useContext(OrdersPageContext);

  const { GetInvoicesResult, selectedInvoice, setSelectedInvoice } =
    orderPageContext;

  if (GetInvoicesResult?.loading) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh"
        }}
      />
    );
  }

  if (GetInvoicesResult?.error) {
    return <Result status="error" title="ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ." />;
  }

  const invoices = GetInvoicesResult?.data.getInvoices as InvoiceModel[];

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={invoices}
        locale={{ emptyText: "ບໍ່ມີລາຍການ" }}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            className={classNames({
              " hover:shadow-md p-3 cursor-pointer rounded-md": true,
              " bg-white shadow-md": selectedInvoice?.id === item.id
            })}
            onClick={() => setSelectedInvoice(item)}
          >
            <Skeleton avatar title={false} loading={false} active>
              <List.Item.Meta
                title={`${invoices.length - index}. ${item.customer_name}`}
                description={item.orders.length + " ລາຍການ"}
              />
              {item.final_price.toLocaleString()}
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
};

export default OrderListComponent;
