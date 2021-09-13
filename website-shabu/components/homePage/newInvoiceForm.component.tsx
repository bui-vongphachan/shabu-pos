import { gql, useMutation } from "@apollo/client";
import { Button, Card, Input } from "antd";
import { Form } from "antd";
import QueueAnim from "rc-queue-anim";
import { useContext } from "react";
import { MainPageContext } from "../../pages";
import OrderFieldComponent from "./orderField.component";

interface FormFields {
  customer_name: string;
  orders: [{ size: string; quantity: number }];
}

const NewOrderFormComponent = () => {
  const mainPageContext = useContext(MainPageContext);
  const { selectedProducts, removeFromCart, clearCart } = mainPageContext;
  const [addInvoice, addInvoiceResult] = useMutation(gql`
    mutation NewInvoiceMutation(
      $newInvoiceCustomerName: String
      $newInvoiceFoods: [NewInvoiceProductInput]
    ) {
      newInvoice(
        customer_name: $newInvoiceCustomerName
        foods: $newInvoiceFoods
      )
    }
  `);

  const [form] = Form.useForm();

  const submitForm = async (formValues: FormFields) => {
    const { customer_name, orders } = formValues;
    addInvoice({
      variables: {
        newInvoiceCustomerName: customer_name,
        newInvoiceFoods: orders.map((item, index) => ({
          product_id: selectedProducts[index].product.id,
          size_id: item.size,
          quantity: parseInt(item.quantity + "")
        }))
      },
      refetchQueries: [{ query: mainPageContext.getInvoicesString! }]
    }).then(() => {
      form.resetFields();
      clearCart();
    });
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={submitForm}
      >
        <Card
          className=" rounded-md"
          title="ເພີ່ມອໍເດີ້ໃໝ່"
          extra={
            <Button
              disabled={
                addInvoiceResult.loading || selectedProducts.length === 0
              }
              htmlType="submit"
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
          {selectedProducts.map((item, index) => (
            <QueueAnim key={index}>
              <div key={index}>
                <OrderFieldComponent index={index} />
              </div>
            </QueueAnim>
          ))}
          <Button
            disabled={addInvoiceResult.loading || selectedProducts.length === 0}
            htmlType="submit"
          >
            ຢືນຢັນ
          </Button>
        </Card>
      </Form>
    </div>
  );
};

export default NewOrderFormComponent;
