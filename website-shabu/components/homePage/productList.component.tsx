import { Card, List, Typography } from "antd";
import { useContext } from "react";
import { ProductModel } from "../../models";
import { MainPageContext } from "../../pages";

const ProductListComponent = () => {
  const { getProductsResult, addToCart } = useContext(MainPageContext);
  const { loading, data } = getProductsResult!;

  return (
    <div className=" overflow-scroll" style={{ maxHeight: `calc(89vh)` }}>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
        itemLayout="horizontal"
        locale={{ emptyText: "ບໍ່ມີລາຍການອາຫານ" }}
        loading={loading}
        dataSource={data?.getProducts}
        renderItem={(item: ProductModel, index) => (
          <List.Item
            key={index}
            className=" hover:shadow-md rounded-md cursor-pointer"
            onClick={() => addToCart(item)}
          >
            <Card bordered>
              <Typography.Title level={5}>{item.name}</Typography.Title>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProductListComponent;
