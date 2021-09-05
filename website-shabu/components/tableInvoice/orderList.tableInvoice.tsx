import { Divider, List, Typography } from "antd";
import { useRouter } from "next/router";
import { Fragment, useContext } from "react";
import { TableInvoiceContext } from "../../pages/report/[table_id]";

const OrderListTableInvoiceComponent = () => {
  const tableInvoiceContext = useContext(TableInvoiceContext);
  const { invoice, table_id, setSelectedOrder, setUpdateOrderModalOpen } =
    tableInvoiceContext;

  const router = useRouter();

  if (!invoice) return <span>ss</span>;

  return (
    <Fragment>
      <Divider orientation="left">ລາຍການທີ່ສັ່ງ</Divider>
      <List
        className=" rounded-md lg:w-6/12 md:w-10/12 w-full"
        bordered
        dataSource={invoice.orders}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <a
                key="list-loadmore-edit"
                href={`${table_id}/edit-order`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedOrder(item);
                  setUpdateOrderModalOpen(true);
                }}
              >
                ແກ້ໄຂ
              </a>,
              <a key="list-loadmore-edit">ລົບ</a>
            ]}
          >
            <Typography.Text className=" mr-4">{++index}</Typography.Text>
            <List.Item.Meta
              title={item.name}
              description={`${item.size.name} x ${item.quantity}`}
            />
            <div>{item.totalPrice.toLocaleString()}</div>
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default OrderListTableInvoiceComponent;
