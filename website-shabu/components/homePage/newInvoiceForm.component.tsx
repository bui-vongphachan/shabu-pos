import { gql, useMutation } from "@apollo/client";
import { Button, Card, Input, Modal } from "antd";
import { Form } from "antd";
import QueueAnim from "rc-queue-anim";
import { useContext } from "react";
import { MainPageContext } from "../../pages";
import OrderFieldComponent from "./orderField.component";

interface FormFields {
  customer_name: string;
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
    const { customer_name } = formValues;
    addInvoice({
      variables: {
        newInvoiceCustomerName: customer_name,
        newInvoiceFoods: selectedProducts.map((item) => ({
          product_id: item.product.id,
          size_id: item.size,
          quantity: parseInt(item.quantity + "")
        }))
      },
      refetchQueries: [{ query: mainPageContext.getInvoicesString! }]
    })
      .then(() => {
        form.resetFields();
        clearCart();
      })
      .catch((er) =>
        Modal.error({
          title: "Server error",
          content: er.message
        })
      );
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
            style={{ margin: 0 }}
          >
            <Input type="text" disabled={addInvoiceResult.loading} />
          </Form.Item>
          <div className=" overflow-scroll" style={{ maxHeight: `calc(65vh)` }}>
            {selectedProducts.map((item, index) => (
              <QueueAnim key={index}>
                <div key={index}>
                  <OrderFieldComponent productInCart={item} index={index} />
                </div>
              </QueueAnim>
            ))}
          </div>
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
