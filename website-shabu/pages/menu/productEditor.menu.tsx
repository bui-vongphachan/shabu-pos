import { useMutation } from "@apollo/client";
import { Button, Form, Input, Modal, notification, Space } from "antd";
import gql from "graphql-tag";
import { Fragment, useEffect } from "react";
import { useContext } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { MenuPageContext } from ".";

const ProductEditorMenuComponent = () => {
  const menuPageContext = useContext(MenuPageContext);
  const [updateProduct, updateProductResponse] = useMutation(
    gql`
      mutation AddProductMutation(
        $updateProductProductId: ID
        $updateProductName: String
        $updateProductSizes: [UpdateProductSizeInput]
      ) {
        updateProduct(
          product_id: $updateProductProductId
          name: $updateProductName
          sizes: $updateProductSizes
        )
      }
    `
  );
  const [form] = Form.useForm();
  const {
    selectedProduct,
    isUpdateModalOpen,
    setUpdateModal,
    getProductGQL,
    setSelectedProduct
  } = menuPageContext;
  const submitForm = async (formValue: {
    name: string;
    sizes: [{ size_id: string; name: string; price: number }];
  }) => {
    await updateProduct({
      variables: {
        updateProductProductId: selectedProduct?.id,
        updateProductName: formValue.name,
        updateProductSizes: formValue.sizes.map((item) => {
          return { ...item, price: parseFloat(item.price + "") };
        })
      },
      refetchQueries: [{ query: getProductGQL! }],
      onQueryUpdated: async (observableQuery) => {
        const { data } = await observableQuery.refetch();
        menuPageContext.setProducts(data);
        notification.open({ message: "ແກ້ໄຂ້ມູນສຳເລັດ" });
      }
    });
  };
  useEffect(() => {
    form.setFieldsValue({
      name: selectedProduct?.name,
      sizes: selectedProduct?.sizes.map((item) => {
        return { size_id: item.id, name: item.name, price: item.price };
      })
    });
  }, [selectedProduct]);
  return (
    <Modal
      title={selectedProduct?.name}
      visible={isUpdateModalOpen}
      onCancel={() => setUpdateModal(updateProductResponse.loading)}
      footer={[]}
    >
      <Form form={form} layout="vertical" requiredMark onFinish={submitForm}>
        <Form.Item
          label="ຊື່ອາຫານ"
          name="name"
          key="name"
          initialValue={selectedProduct?.name}
          rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
        >
          <Input disabled={updateProductResponse.loading} type="text" />
        </Form.Item>
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
                      rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
                    >
                      <Input
                        type="text"
                        disabled={updateProductResponse.loading}
                        autoFocus={true}
                      />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      label="ລາຄາ"
                      name={[field.name, "price"]}
                      fieldKey={[field.fieldKey, "price"]}
                      rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
                    >
                      <Input
                        type="number"
                        disabled={updateProductResponse.loading}
                      />
                    </Form.Item>
                    <div className=" relative">
                      <MinusCircleOutlined
                        disabled={updateProductResponse.loading}
                        className=" top-6 absolute"
                        onClick={() => remove(field.name)}
                      />
                    </div>
                  </Space>
                </div>
              ))}
              <Form.Item>
                <Button
                  disabled={updateProductResponse.loading}
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
          <Button
            loading={updateProductResponse.loading}
            disabled={updateProductResponse.loading}
            htmlType="submit"
          >
            ແກ້ໄຂ
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductEditorMenuComponent;
