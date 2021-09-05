import { Divider, Form, InputNumber, Modal, Select, Typography } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useChangeOrderQuantity } from "../../lib/graphql/order/useChangeOrderQuantity.mutation";
import { useChangeOrderSize } from "../../lib/graphql/order/useChangeOrderSize.mutation";
import { InvoiceModel } from "../../models/invoice";
import { OrderModel } from "../../models/order";
import { TableInvoiceContext } from "../../pages/report/[table_id]";

const UpdateOrderTableInvoiceComponent = () => {
  const [updateSizeResult, updateSize] = useChangeOrderSize();
  const [updateQuantityResult, updateQuantity] = useChangeOrderQuantity();
  const [order, setOrder] = useState<OrderModel | null>(null);

  const tableInvoiceContext = useContext(TableInvoiceContext);

  const {
    table_id,
    GET_INVOICE,
    invoice,
    selectedOrder,
    isUpdateOrderModalOpen,
    setUpdateOrderModalOpen
  } = tableInvoiceContext;

  useEffect(() => {
    setOrder(selectedOrder);
  }, [selectedOrder]);

  if (!order) return null;

  const close = () => setUpdateOrderModalOpen(false);

  const { sizes } = order.product;

  return (
    <Modal
      title={order.name}
      visible={isUpdateOrderModalOpen}
      onCancel={() => close()}
      footer={[]}
    >
      <Form>
        <Form.Item
          label="ຂະໜາດ"
          name="size"
          hasFeedback
          initialValue={order.size.name}
          validateStatus={
            updateSizeResult.loading
              ? "validating"
              : updateSizeResult.error
              ? "error"
              : "success"
          }
        >
          <Select
            disabled={updateSizeResult.loading}
            defaultValue={order.size.name}
            style={{ width: "100%" }}
            options={sizes.map((item) => {
              return {
                key: item.id,
                label: (
                  <span>
                    {item.name} &nbsp; ({item.price.toLocaleString()})
                  </span>
                ),
                value: item.id
              };
            })}
            onChange={(value) => {
              updateSize(
                {
                  changeOrderSizeInvoiceId: invoice!.id,
                  changeOrderSizeOrderId: selectedOrder!.id,
                  changeOrderSizeSizeId: value
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
                (data) => {
                  const { orders } = data.getInvoice as InvoiceModel;
                  const found = orders.find((item) => item.id === order.id);
                  setOrder(found!);
                }
              );
            }}
          />
        </Form.Item>
        <Form.Item
          initialValue={order.quantity}
          label="ຈຳນວນ"
          name="quantity"
          className="mb-2"
          hasFeedback
          validateStatus={
            updateQuantityResult.loading
              ? "validating"
              : updateQuantityResult.error
              ? "error"
              : "success"
          }
        >
          <InputNumber
            min={1}
            max={100}
            defaultValue={order.quantity}
            inputMode="numeric"
            name="quantity"
            onBlur={(event) => {
              const num = parseInt(event.target.value);
              if (num < 1 || num > 100) return null;
              updateQuantity(
                {
                  updateOrderQuantityInvoiceId: invoice!.id,
                  updateOrderQuantityOrderId: order!.id,
                  updateOrderQuantityQuantity: parseInt(event.target.value)
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
                (data) => {
                  const { orders } = data.getInvoice as InvoiceModel;
                  const found = orders.find((item) => item.id === order.id);
                  setOrder(found!);
                }
              );
            }}
          />
          <span>&nbsp; x {order.size.price.toLocaleString()}</span>
        </Form.Item>
        <Divider orientation="left">ສະຫຼຸບ</Divider>
        <Typography.Text>
          {(order.quantity * order.size.price).toLocaleString()}
        </Typography.Text>
      </Form>
    </Modal>
  );
};

export default UpdateOrderTableInvoiceComponent;
