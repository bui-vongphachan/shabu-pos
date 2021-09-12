import { Button, Card, Form, Input, Space } from "antd";
import { Fragment, useContext } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { gql, useMutation } from "@apollo/client";
import { AddProductMutationString } from "../../lib/graphql/product/addProduct.gql";
import { MenuPageContext } from ".";
import { getProductsQueryString } from "../../lib/graphql/product/getProducts.gql";

const AddProductMenuComponent = () => {
  const menuPageContext = useContext(MenuPageContext);
  const [form] = Form.useForm();
  const [addProduct, addProductResponse] = useMutation(
    gql`
      mutation AddProductMutation(
        $addProductName: String
        $addProductSizes: [ProductSizeInput]
        $addProductOptions: [addProductOptionInput]
      ) {
        addProduct(
          name: $addProductName
          sizes: $addProductSizes
          options: $addProductOptions
        )
      }
    `
  );

  const submitForm = async (formValue: {
    name: string;
    price_one: string;
    size_one: string;
    sizes: [
      {
        name: string;
        price: number;
      }
    ];
    options: [
      {
        name: string;
        price: number;
      }
    ];
  }) => {
    try {
      let size: any[] = [];
      let option: any[] = [];
      if (!!formValue.sizes) {
        size = formValue.sizes.map((size) => {
          return {
            name: size.name,
            price: parseFloat(`${size.price}`)
          };
        });
      }
      if (!!formValue.options) {
        option = formValue.options.map((options) => {
          return {
            name: options.name,
            price: parseFloat(`${options.price}`)
          };
        });
      }

      const { data } = await addProduct({
        variables: {
          addProductName: formValue.name,
          addProductSizes: [
            {
              name: formValue.size_one,
              price: parseFloat(`${formValue.price_one}}`)
            },
            ...size
          ],
          addProductOptions: option
        },
        refetchQueries: [{ query: getProductsQueryString }],
        onQueryUpdated: async (observableQuery) => {
          const { data } = await observableQuery.refetch();
          menuPageContext.setProducts(data);
          form.resetFields();
        }
      });

      menuPageContext.setProducts(data.addProduct);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Card className=" rounded-md" title="ເພີ່ມລາຍການອາຫານ">
        <Form form={form} layout="vertical" requiredMark onFinish={submitForm}>
          <Form.Item
            label="ຊື່ອາຫານ"
            name="name"
            key="name"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
          >
            <Input disabled={addProductResponse.loading} type="text" />
          </Form.Item>
          <Space align="baseline">
            <Form.Item
              label="ຂະໜາດ"
              name="size_one"
              key="size_one"
              fieldKey="size_one"
              rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
            >
              <Input type="text" disabled={addProductResponse.loading} />
            </Form.Item>
            <Form.Item
              label="ລາຄາ"
              name="price_one"
              key="price_one"
              fieldKey="price_one"
              rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
            >
              <Input type="number" disabled={addProductResponse.loading} />
            </Form.Item>
          </Space>
          <Form.List name="sizes">
            {(fields, { add, remove }) => (
              <Fragment>
                {fields.map((field) => (
                  <div>
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        label="ຂະໜາດ"
                        name={[field.name, "name"]}
                        fieldKey={[field.fieldKey, "name"]}
                        rules={[
                          { required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }
                        ]}
                      >
                        <Input
                          type="text"
                          disabled={addProductResponse.loading}
                          autoFocus={true}
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="ລາຄາ"
                        name={[field.name, "price"]}
                        fieldKey={[field.fieldKey, "price"]}
                        rules={[
                          { required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }
                        ]}
                      >
                        <Input
                          type="number"
                          disabled={addProductResponse.loading}
                        />
                      </Form.Item>
                      <div className=" relative">
                        <MinusCircleOutlined
                          disabled={addProductResponse.loading}
                          className=" top-6 absolute"
                          onClick={() => remove(field.name)}
                        />
                      </div>
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    disabled={addProductResponse.loading}
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    ເພີ່ມຂະໜາດອາຫານ
                  </Button>
                </Form.Item>
              </Fragment>
            )}
          </Form.List>
          <Form.List name="options">
            {(fields, { add, remove }) => (
              <Fragment>
                {fields.map((field) => (
                  <div>
                    <Space key={field.key} align="baseline">
                      <Form.Item
                        {...field}
                        label="ຊື່ຕົວເລືອກ"
                        name={[field.name, "name"]}
                        fieldKey={[field.fieldKey, "name"]}
                        rules={[
                          { required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }
                        ]}
                      >
                        <Input
                          type="text"
                          disabled={addProductResponse.loading}
                          autoFocus={true}
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="ລາຄາ"
                        name={[field.name, "price"]}
                        fieldKey={[field.fieldKey, "price"]}
                        rules={[
                          { required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }
                        ]}
                      >
                        <Input
                          type="number"
                          disabled={addProductResponse.loading}
                        />
                      </Form.Item>
                      <div className=" relative">
                        <MinusCircleOutlined
                          className=" top-6 absolute"
                          disabled={addProductResponse.loading}
                          onClick={() => remove(field.name)}
                        />
                      </div>
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    disabled={addProductResponse.loading}
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    ເພີ່ມຕົວເລືອກອາຫານ
                  </Button>
                </Form.Item>
              </Fragment>
            )}
          </Form.List>

          <Form.Item>
            <Button htmlType="submit">ເພີ່ມ</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProductMenuComponent;
