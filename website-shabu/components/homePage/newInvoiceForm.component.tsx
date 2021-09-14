import { gql, useMutation } from "@apollo/client";
import { Button, Card, Input, Modal, notification } from "antd";
import { Form } from "antd";
import QueueAnim from "rc-queue-anim";
import { useContext } from "react";
import { MainPageContext } from "../../pages";
import OrderFieldComponent from "./orderField.component";

interface FormFields {
  customer_name: string;
  delivery_price: string | number;
}

const NewOrderFormComponent = () => {
  const mainPageContext = useContext(MainPageContext);
  const { selectedProducts, removeFromCart, clearCart } = mainPageContext;
  const [addInvoice, addInvoiceResult] = useMutation(gql`
    mutation NewInvoiceMutation(
      $newInvoiceCustomerName: String
      $newInvoiceFoods: [NewInvoiceProductInput]
      $newInvoiceDeliveryPrice: Float
    ) {
      newInvoice(
        customer_name: $newInvoiceCustomerName
        foods: $newInvoiceFoods
        delivery_price: $newInvoiceDeliveryPrice
      )
    }
  `);

  const [form] = Form.useForm();

  const submitForm = async (formValues: FormFields) => {
    const { customer_name, delivery_price } = formValues;
    addInvoice({
      variables: {
        newInvoiceCustomerName: customer_name,
        newInvoiceDeliveryPrice: parseFloat(delivery_price + ""),
        newInvoiceFoods: selectedProducts.map((item) => ({
          product_id: item.product.id,
          size_id: item.size,
          quantity: parseInt(item.quantity + "")
        }))
      }
    })
      .then(() => {
        form.resetFields();
        clearCart();
        notification.success({
          message: "ສ້າງອໍເດີ້ສຳເລັດ"
        });
      })
      .catch((er) =>
        Modal.error({
          title: "Server error",
          content: er.message
        })
      );
  };

  return (
    <div className=" col-span-2">
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={submitForm}
        className=" gap-3 grid grid-cols-2"
      >
        <div>
          <Card className=" rounded-md" title="ລາຍການອາຫານ">
            <div
              className=" overflow-scroll"
              style={{ maxHeight: `calc(65vh)` }}
            >
              {selectedProducts.map((item, index) => (
                <QueueAnim key={index}>
                  <div key={index}>
                    <OrderFieldComponent productInCart={item} index={index} />
                  </div>
                </QueueAnim>
              ))}
            </div>
          </Card>
        </div>
        <div>
          <Card
            className=" rounded-md"
            title="ເພີ່ມອໍເດີ້ໃໝ່"
            extra={
              <Button
                htmlType="submit"
                disabled={
                  addInvoiceResult.loading || selectedProducts.length === 0
                }
              >
                ຢືນຢັນ
              </Button>
            }
          >
            <Form.Item
              label="ຊື່ລູກຄ້າ"
              name="customer_name"
              key="customer_name"
              rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
            >
              <Input type="text" disabled={addInvoiceResult.loading} />
            </Form.Item>
            <Form.Item
              label="ຄ່າສົ່ງ"
              name="delivery_price"
              key="delivery_price"
              initialValue="0"
            >
              <Input
                type="number"
                inputMode="numeric"
                min="0"
                disabled={addInvoiceResult.loading}
              />
            </Form.Item>

            <Button
              disabled={
                addInvoiceResult.loading || selectedProducts.length === 0
              }
              htmlType="submit"
            >
              ຢືນຢັນ
            </Button>
          </Card>
        </div>
      </Form>
    </div>
  );
};

export default NewOrderFormComponent;
