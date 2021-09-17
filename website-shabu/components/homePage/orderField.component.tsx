import { Checkbox, Form, Input, Radio, Space, Typography } from "antd";
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
    <div className=" w-full border-2 px-3 pt-3 mb-1 hover:shadow-sm rounded-md">
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
        style={{ margin: 0, marginBottom: "1rem" }}
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
      {productInCart.options.length === 0 ? null : (
        <Form.Item
          label="ຕົວເລືອກພິເສດ"
          fieldKey={["orders", index, "options"]}
          style={{ margin: 0, marginBottom: "1rem" }}
          initialValue={productInCart.selectedOptions}
        >
          <Checkbox.Group
            options={productInCart.options.map((item) => ({
              label: item.name,
              value: item.id
            }))}
            defaultValue={[]}
            onChange={(values) =>
              updateCart(
                index,
                "selectedOptions",
                productInCart.options.filter((item) =>
                  values.find((value) => value === item.id)
                )
              )
            }
          />
        </Form.Item>
      )}
      <Space className="grid grid-cols-2 mt-2" align="baseline">
        <Form.Item
          fieldKey={["orders", index, "quantity"]}
          rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
          initialValue={productInCart.quantity}
          style={{ marginBottom: "1rem" }}
        >
          <small className=" hidden">{productInCart.quantity}</small>
          <Space align="baseline">
            <Typography.Text>ຈຳນວນ: </Typography.Text>
            <Input
              style={{ width: 70 }}
              placeholder="ຈຳນວນ"
              type="number"
              max={20}
              min={1}
              value={productInCart.quantity}
              onChange={(e) =>
                updateCart(index, "quantity", parseInt(e.target.value))
              }
            />
          </Space>
        </Form.Item>

        <div className=" text-right">
          {(
            productInCart.quantity * productInCart.sizeData.price +
            productInCart.selectedOptions.reduce(
              (sum, item) => sum + item.price,
              0
            )
          ).toLocaleString()}
        </div>
      </Space>
      <Form.Item
        label="ລາຍລະອຽດເພີ່ມເຕີມ"
        fieldKey={["orders", index, "description"]}
      >
        <Input.TextArea
          value={productInCart.description}
          onChange={(e) => updateCart(index, "description", e.target.value)}
        />
      </Form.Item>
    </div>
  );
};

export default OrderFieldComponent;
