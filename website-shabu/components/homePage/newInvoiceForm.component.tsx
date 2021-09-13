import { gql, useMutation } from "@apollo/client";
import { Button, Card, Input } from "antd";
import { Form } from "antd";
import QueueAnim from "rc-queue-anim";
import { useContext, useEffect } from "react";
import { MainPageContext } from "../../pages";
import OrderFieldComponent from "./orderField.component";

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

  const submitForm = async (formValues: {
    customer_name: string;
    orders: [{ product: string; size: string; quantity: number }];
  }) => {
    const { customer_name, orders } = formValues;
    addInvoice({
      variables: {
        newInvoiceCustomerName: customer_name,
        newInvoiceFoods: orders.map((item) => ({
          product_id: item.product,
          size_id: item.size,
          quantity: item.quantity
        }))
      },
      refetchQueries: [{ query: mainPageContext.getInvoicesString! }]
    }).then(() => {
      form.resetFields();
      clearCart();
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      orders: selectedProducts.map((item) => ({ ...item }))
    });
  }, [selectedProducts]);

  return (
    <div>
      <Card className=" rounded-md" title="ເພີ່ມອໍເດີ້ໃໝ່">
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={submitForm}
        >
          <Form.Item
            label="ຊື່ລູກຄ້າ"
            name="customer_name"
            key="customer_name"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
          >
            <Input type="text" disabled={addInvoiceResult.loading} />
          </Form.Item>
          <Form.List name="orders">
            {(fields, { add, remove }) =>
              fields.map((field, index) => (
                <QueueAnim key={index}>
                  <div key={index}>
                    <OrderFieldComponent
                      index={index}
                      field={field}
                      remove={(index: number) => remove(index)}
                    />
                  </div>
                </QueueAnim>
              ))
            }
          </Form.List>

          <Form.Item>
            <Button disabled={addInvoiceResult.loading} htmlType="submit">
              ເພີ່ມ
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NewOrderFormComponent;
