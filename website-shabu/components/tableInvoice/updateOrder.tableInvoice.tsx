import { useMutation, gql } from "@apollo/client";
import {
  Button,
  Descriptions,
  Divider,
  Form,
  InputNumber,
  Modal,
  Select,
  Typography
} from "antd";
import { useContext } from "react";
import { useChangeOrderSize } from "../../lib/graphql/order/useChangeOrderSize.mutation";
import { TableInvoiceContext } from "../../pages/report/[table_id]";

const UpdateOrderTableInvoiceComponent = () => {
  const [updateSizeResult, updateSize] = useChangeOrderSize(gql`
    {
      id
    }
  `);
  const tableInvoiceContext = useContext(TableInvoiceContext);
  const {
    table_id,
    GET_INVOICE,
    invoice,
    selectedOrder,
    isUpdateOrderModalOpen,
    setUpdateOrderModalOpen
  } = tableInvoiceContext;

  if (!selectedOrder) return <span>Empty</span>;

  const { sizes } = selectedOrder.product;

  const close = () => setUpdateOrderModalOpen(false);

  return (
    <Modal
      title={selectedOrder?.name}
      visible={isUpdateOrderModalOpen}
      onCancel={() => close()}
      footer={[]}
    >
      <Form>
        <Form.Item
          label="ຂະໜາດ"
          name="size"
          hasFeedback
          validateStatus={
            updateSizeResult.loading
              ? "validating"
              : updateSizeResult.error
              ? "error"
              : "success"
          }
        >
          <Select
            loading={updateSizeResult.loading}
            disabled={updateSizeResult.loading}
            defaultValue={selectedOrder.size.name}
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
            onChange={(value) =>
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
                ]
              )
            }
          />
          {(() => {
            const { error } = updateSizeResult;
            if (!error) return null;
            return (
              <ul>
                {error.clientErrors.map((item, index) => (
                  <li key={index}>{item.message}</li>
                ))}
              </ul>
            );
          })()}
        </Form.Item>
        {/*  <Form.Item label="ຈຳນວນ" name="quantity" className="mb-2">
          <InputNumber
            min={1}
            max={100}
            defaultValue={selectedOrder.quantity}
            inputMode="numeric"
            onBlur={() => console.log("HAH")}
          />
          <span>&nbsp; x {1000}</span>
        </Form.Item> */}
        <Divider orientation="left">ສະຫຼຸບ</Divider>
        <Typography.Text>dd</Typography.Text>
      </Form>
    </Modal>
  );
};

export default UpdateOrderTableInvoiceComponent;
