import { Divider, List, Modal, Radio, Typography } from "antd";
import { Fragment, useContext } from "react";
import { TableInvoiceContext } from "../../pages/report/[table_id]";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRemoveOrder } from "../../lib/graphql/order";
import { useState } from "react";
import classNames from "classnames";

const OrderListTableInvoiceComponent = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [updateSizeResult, updateSize] = useRemoveOrder();
  const tableInvoiceContext = useContext(TableInvoiceContext);
  const {
    invoice,
    setSelectedOrder,
    setUpdateOrderModalOpen,
    GET_INVOICE,
    table_id
  } = tableInvoiceContext;

  if (!invoice) return <span>ss</span>;

  return (
    <Fragment>
      <Divider orientation="left">ລາຍການທີ່ສັ່ງ</Divider>
      <Radio.Group
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value)}
        size="small"
      >
        <Radio.Button
          className={classNames({
            "bg-gray-100": true
          })}
          value="ongoing"
        >
          ສັ່ງແລ້ວ
        </Radio.Button>
        <Radio.Button
          className={classNames({
            "bg-gray-100": true
          })}
          value="removed"
        >
          ຍົກເລີກ
        </Radio.Button>
      </Radio.Group>
      {activeTab === "ongoing" ? (
        <List
          locale={{ emptyText: "ວ່າງ" }}
          className=" rounded-md lg:w-6/12 md:w-10/12 w-full"
          bordered
          dataSource={invoice.orders.filter((order) => !order.isDeleted)}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <a
                  key="list-loadmore-edit"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedOrder(item);
                    setUpdateOrderModalOpen(true);
                  }}
                >
                  ແກ້ໄຂ
                </a>,
                <a
                  key="list-loadmore-edit"
                  onClick={(e) => {
                    e.preventDefault();
                    Modal.confirm({
                      title: (
                        <span>
                          ລົບ{" "}
                          <span className=" font-extrabold">{item.name}</span>{" "}
                          ອອກຈາກບິນນີ້
                        </span>
                      ),
                      icon: <ExclamationCircleOutlined />,
                      okText: "ຢືນຢັນ",
                      cancelText: "ຍົກເລີກ",
                      onOk: (close) => {
                        updateSize(
                          {
                            deleteOrderInvoiceId: invoice.id,
                            deleteOrderOrderId: item.id
                          },
                          [
                            {
                              query: GET_INVOICE!,
                              variables: {
                                getInvoiceTableId: table_id,
                                getInvoiceIsPaid: false
                              }
                            }
                          ],
                          () => close()
                        );
                      }
                    });
                  }}
                >
                  ລົບ
                </a>
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
      ) : (
        <List
          locale={{ emptyText: "ວ່າງ" }}
          className=" rounded-md lg:w-6/12 md:w-10/12 w-full"
          bordered
          dataSource={invoice.orders.filter((order) => order.isDeleted)}
          renderItem={(item, index) => (
            <List.Item>
              <Typography.Text className=" mr-4">{++index}</Typography.Text>
              <List.Item.Meta
                title={item.name}
                description={`${item.size.name} x ${item.quantity}`}
              />
              <div>{item.totalPrice.toLocaleString()}</div>
            </List.Item>
          )}
        />
      )}
    </Fragment>
  );
};

export default OrderListTableInvoiceComponent;
