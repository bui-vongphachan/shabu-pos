import { Avatar, List, Skeleton } from "antd";
import { useContext } from "react";
import { MenuPageContext } from ".";
import { ProductModel } from "../../models";

const ProductListMenuComponent = () => {
  const menuPageContext = useContext(MenuPageContext);

  return (
    <List
      className=""
      itemLayout="horizontal"
      dataSource={menuPageContext.products}
      locale={{ emptyText: "ບໍ່ມີລາຍການອາຫານ" }}
      renderItem={(item, index) => (
        <List.Item
          key={index}
          actions={[
            <a key="list-loadmore-edit">edit</a>,
            <a key="list-loadmore-more">delete</a>
          ]}
          className=" hover:shadow-md p-3 "
        >
          <Skeleton loading={false}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={
                    "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                  }
                />
              }
              title={`${menuPageContext.products.length - ++index}. ${
                item.name
              }`}
              description={item.category}
            />
            {item.category}
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default ProductListMenuComponent;
