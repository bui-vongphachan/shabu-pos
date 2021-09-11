import { Button, Card, Form, Input, Space } from "antd";
import { Fragment, useContext } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { AddProductMutationString } from "../../lib/graphql/product/addProduct.gql";
import { MenuPageContext } from ".";
import { getProductsQueryString } from "../../lib/graphql/product/getProducts.gql";

const AddProductMenuComponent = () => {
  const menuPageContext = useContext(MenuPageContext);

  const [addProduct, addProductResponse] = useMutation(
    AddProductMutationString
  );

  const submitForm = async (formValue: {
    name: string;
    category: string;
    price_one: string;
    size_one: string;
    sizes: [
      {
        name: string;
        price: number;
      }
    ];
  }) => {
    try {
      let size: any[] = [];

      if (formValue.sizes) {
        size = formValue.sizes.map((size) => {
          return {
            name: size.name,
            price: parseFloat(`${size.price}`)
          };
        });
      }

      const { data } = await addProduct({
        variables: {
          addProductName: formValue.name,
          addProductCategory: formValue.category,
          addProductSizes: [
            {
              name: formValue.size_one,
              price: parseFloat(`${formValue.price_one}}`)
            },
            ...size
          ]
        },
        refetchQueries: [{ query: getProductsQueryString }],
        onQueryUpdated: async (observableQuery) => {
          const { data } = await observableQuery.refetch();
          menuPageContext.setProducts(data);
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
        <Form layout="vertical" requiredMark onFinish={submitForm}>
          <Form.Item
            label="ຊື່ອາຫານ"
            name="name"
            key="name"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
          >
            <Input disabled={addProductResponse.loading} />
          </Form.Item>
          {/*    <Form.Item
            label="ປະເພດ"
            name="category"
            key="category"
            rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
          >
            <Input disabled={addProductResponse.loading} />
          </Form.Item> */}
          <Space align="baseline">
            <Form.Item
              label="ຂະໜາດ"
              name="size_one"
              key="size_one"
              fieldKey="size_one"
              rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              label="ຂະໜາດ"
              name="price_one"
              key="price_one"
              fieldKey="price_one"
              rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
            >
              <Input type="number" />
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
                        <Input type="text" />
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
                        <Input type="number" />
                      </Form.Item>
                      <div className=" relative">
                        <MinusCircleOutlined
                          className=" top-6 absolute"
                          onClick={() => {
                            console.log(field);
                            remove(field.name);
                          }}
                        />
                      </div>
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button
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
          <Form.Item>
            <Button htmlType="submit">ເພີ່ມ</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProductMenuComponent;
