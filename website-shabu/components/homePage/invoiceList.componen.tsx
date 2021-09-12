import { List, Popconfirm, Skeleton, Spin } from "antd";
import { useEffect } from "react";
import { useContext } from "react";
import { InvoiceModel } from "../../models/invoice";
import { MainPageContext } from "../../pages";

const OrderListComponent = () => {
  const mainPageContext = useContext(MainPageContext);

  const { data, error, loading } = mainPageContext.getInvoicesResult!;

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
    <div>
      <List
        className=""
        itemLayout="horizontal"
        dataSource={invoices}
        locale={{ emptyText: "ບໍ່ມີລາຍການ" }}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            actions={[
              <a key="list-loadmore-edit">ແກ້ໄຂ</a>,
              <Popconfirm
                title="ຕ້ອງການລົບລາຍການນີ້ບໍ່?"
                okText="ຢືນຢັນ"
                cancelText="ຍົກເລີກ"
              >
                <a key="list-loadmore-more">ລົບ</a>
              </Popconfirm>
            ]}
            className=" hover:shadow-md p-3 "
          >
            <Skeleton loading={false}>
              <List.Item.Meta
                title={`${invoices.length - index}.`}
                description={item.total_price}
              />
              {item.created_date}
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
};

export default OrderListComponent;
