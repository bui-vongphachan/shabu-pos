import { Form, Input, Radio, Space, Typography } from "antd";
import { useContext } from "react";
import { MainPageContext } from "../../pages";

const OrderFieldComponent = (props: { index: number }) => {
  const mainPageContext = useContext(MainPageContext);
  const { index } = props;
  const { selectedProducts, removeFromCart, updateCart } = mainPageContext;
  return (
    <div className=" w-full border-2 px-3 pt-3 my-3 rounded-md">
      <Space className=" grid grid-cols-2" align="baseline">
        <Typography.Title level={5}>
          {`${1 + index}. ${selectedProducts[index]?.product.name}`}
        </Typography.Title>
        <div className=" text-right">
          <a onClick={() => removeFromCart(index)}>ລົບ</a>
        </div>
      </Space>
      <Form.Item
        label="ຂະໜາດ"
        name={["orders", index, "size"]}
        fieldKey={["orders", index, "size"]}
        style={{ margin: 0 }}
        rules={[{ required: true, message: "ກະລຸນາເລືອກຂະໜາດ" }]}
        initialValue={selectedProducts[index]?.product.sizes[0].id}
      >
        <Radio.Group
          options={selectedProducts[index]?.product.sizes.map((item) => ({
            value: item.id,
            label: item.name
          }))}
          onChange={(e) => {
            const size = selectedProducts[index]?.product.sizes.find(
              (item) => item.id === e.target.value
            );
            updateCart(index, "sizeData", size);
            updateCart(index, "size", e.target.value);
          }}
        />
      </Form.Item>
      <Space className="grid grid-cols-2" align="baseline">
        <Form.Item
          name={["orders", index, "quantity"]}
          fieldKey={["orders", index, "quantity"]}
          rules={[{ required: true, message: "ກະລຸນາປ້ອນຂໍ້ມູນ" }]}
          initialValue={1}
          style={{ marginBottom: "1rem" }}
        >
          <Input
            placeholder="ຈຳນວນ"
            type="number"
            max={20}
            min={1}
            onChange={(e) =>
              updateCart(index, "quantity", parseInt(e.target.value))
            }
          />
        </Form.Item>
        <div className=" text-right">
          {(
            selectedProducts[index]?.quantity *
            selectedProducts[index]?.sizeData.price
          ).toLocaleString()}
        </div>
      </Space>
    </div>
  );
};

export default OrderFieldComponent;
