import { gql, useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Card,
  Input,
  List,
  Radio,
  Select,
  Space,
  Spin,
  Typography
} from "antd";
import { Form } from "antd";
import QueueAnim from "rc-queue-anim";
import { useContext, useEffect } from "react";
import { MainPageContext } from "../../pages";

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
        orders: selectedProducts.map((item) => ({
          product: item.id,
          size: item.sizes[0].id,
          quantity: 1
        }))
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
                  <div
                    key={index}
                    className=" w-full border-2 px-3 pt-3 my-3 rounded-md"
                  >
                    <Space
                      className="   grid grid-cols-2"
                      key={field.key}
                      align="baseline"
                    >
                      <Typography.Title level={5}>
                        {`${1 + index}. ${selectedProducts[index]?.name}`}
                      </Typography.Title>
                      <div className=" text-right">
                        <a
                          onClick={() => {
                            remove(index);
                            removeFromCart(index);
                          }}
                        >
                          ລົບ
                        </a>
                      </div>
                    </Space>
                    <Form.Item
                      label="ຂະໜາດ"
                      name={[field.name, "size"]}
                      fieldKey={[field.fieldKey, "size"]}
                      style={{ margin: 0 }}
                      rules={[{ required: true, message: "ກະລຸນາເລືອກຂະໜາດ" }]}
                      initialValue={selectedProducts[index]?.sizes[0].id}
                    >
                      <Radio.Group
                        options={selectedProducts[index]?.sizes.map((item) => ({
                          key: item.id,
                          value: item.id,
                          label: item.name
                        }))}
                      />
                    </Form.Item>
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
