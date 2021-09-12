import { gql, useMutation } from "@apollo/client";
import { Button, Card, Input, Select, Space, Spin } from "antd";
import { Form } from "antd";
import { useContext } from "react";
import { ProductModel } from "../../models";
import { MainPageContext } from "../../pages";

const NewOrderFormComponent = () => {
  const mainPageContext = useContext(MainPageContext);
  const [addInvoice, addInvoiceResult] = useMutation(gql`
    mutation NewInvoiceMutation($newInvoiceFoods: [NewInvoiceProductInput]) {
      newInvoice(foods: $newInvoiceFoods)
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
  const submitForm = async (formValues: { food: string }) => {
    await addInvoice({
      variables: { newInvoiceFoods: { product_id: formValues.food } },
      refetchQueries: [{ query: mainPageContext.getInvoicesString! }]
    });
  };

  return (
    <div>
      <Card className=" rounded-md" title="ເພີ່ມອໍເດີ້ໃໝ່">
        <Form form={form} layout="vertical" onFinish={submitForm}>
          <Form.Item
            label="ອາຫານ"
            name="food"
            key="food"
            rules={[{ required: true, message: "ກະລຸນາເລືອກລາຍການອາຫານ" }]}
          >
            <Select loading={productLoading} options={productOptions} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">ເພີ່ມ</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NewOrderFormComponent;
