import { gql, useMutation } from "@apollo/client";
import { Button, Card, Input, Select, Space, Spin } from "antd";
import { Form } from "antd";
import { useContext } from "react";
import { ProductModel } from "../../models";
import { MainPageContext } from "../../pages";

const NewOrderFormComponent = () => {
  const mainPageContext = useContext(MainPageContext);
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
  const { data, loading: productLoading } = mainPageContext.getProductGQL!;

  if (productLoading)
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

  const productOptions = (data.getProducts as ProductModel[]).map((item) => ({
    key: item.id,
    value: item.id,
    label: item.name
  }));
  const submitForm = async (formValues: {
    customer_name: string;
    food: string;
  }) => {
    const { customer_name, food } = formValues;
    await addInvoice({
      variables: {
        newInvoiceCustomerName: customer_name,
        newInvoiceFoods: { product_id: food }
      },
      refetchQueries: [{ query: mainPageContext.getInvoicesString! }]
    });
  };

  return (
    <div>
      <Card className=" rounded-md" title="ເພີ່ມອໍເດີ້ໃໝ່">
        <Form form={form} layout="vertical" onFinish={submitForm}>
          <Form.Item
            label="ຊື່ລູກຄ້າ"
            name="customer_name"
            key="customer_name"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
          >
            <Input type="text" disabled={addInvoiceResult.loading} />
          </Form.Item>
          <Form.Item
            label="ອາຫານ"
            name="food"
            key="food"
            rules={[{ required: true, message: "ກະລຸນາເລືອກລາຍການອາຫານ" }]}
          >
            <Select
              disabled={addInvoiceResult.loading}
              loading={productLoading}
              options={productOptions}
            />
          </Form.Item>
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
