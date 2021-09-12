import { useMutation } from "@apollo/client";
import { Button, Form, Input, Modal, notification } from "antd";
import gql from "graphql-tag";
import { useEffect } from "react";
import { useContext } from "react";
import { MenuPageContext } from ".";

const ProductEditorMenuComponent = () => {
  const menuPageContext = useContext(MenuPageContext);
  const [updateProduct, updateProductResponse] = useMutation(
    gql`
      mutation AddProductMutation(
        $updateProductProductId: ID
        $updateProductName: String
      ) {
        updateProduct(
          product_id: $updateProductProductId
          name: $updateProductName
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
  const submitForm = async (formValue: { name: string }) => {
    await updateProduct({
      variables: {
        updateProductProductId: selectedProduct?.id,
        updateProductName: formValue.name
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
    form.setFieldsValue({ name: selectedProduct?.name });
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
