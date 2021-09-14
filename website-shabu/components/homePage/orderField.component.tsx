import { Form, Input, Radio, Space, Typography } from "antd";
import { useContext } from "react";
import { MainPageContext, ProductInCart } from "../../pages";

const OrderFieldComponent = (props: {
  index: number;
  productInCart: ProductInCart;
}) => {
  const mainPageContext = useContext(MainPageContext);
  const { index, productInCart } = props;
  const { removeFromCart, updateCart } = mainPageContext;
  return (
    <div className=" w-full border-2 px-3 pt-3 my-3 rounded-md">
      <Form.Item
        className=" hidden"
        fieldKey={["orders", index, "product_id"]}
        rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
        initialValue={productInCart.product.id}
        style={{ marginBottom: "1rem" }}
      />
      <Space className=" grid grid-cols-2" align="baseline">
        <Typography.Title level={5}>
          {`${1 + index}. ${productInCart.product.name}`}
        </Typography.Title>
        <div className=" text-right">
          <a onClick={() => removeFromCart(index)}>ລົບ</a>
        </div>
      </Space>
      <Form.Item
        label="ຂະໜາດ"
        fieldKey={["orders", index, "size_id"]}
        style={{ margin: 0 }}
        rules={[{ required: true, message: "ກະລຸນາເລືອກຂະໜາດ" }]}
        initialValue={productInCart.size}
      >
        <small className=" hidden">{productInCart.size}</small>
        <Radio.Group
          value={productInCart.size}
          options={productInCart.product.sizes.map((item) => ({
            label: item.name,
            value: item.id
          }))}
          onChange={(e) => {
            const size = productInCart.product.sizes.find(
              (item) => item.id === e.target.value
            );
            updateCart(index, "sizeData", size);
            updateCart(index, "size", e.target.value);
          }}
        />
      </Form.Item>
      <Space className="grid grid-cols-2" align="baseline">
        <Form.Item
          fieldKey={["orders", index, "quantity"]}
          rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
          initialValue={productInCart.quantity}
          style={{ marginBottom: "1rem" }}
        >
          <small className=" hidden">{productInCart.quantity}</small>
          <Input
            placeholder="ຈຳນວນ"
            type="number"
            max={20}
            min={1}
            value={productInCart.quantity}
            onChange={(e) =>
              updateCart(index, "quantity", parseInt(e.target.value))
            }
          />
        </Form.Item>
        <div className=" text-right">
          {(
            productInCart.quantity * productInCart.sizeData.price
          ).toLocaleString()}
        </div>
      </Space>
    </div>
  );
};

export default OrderFieldComponent;
