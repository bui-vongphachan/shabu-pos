import { useMutation } from "@apollo/client";
import { List, notification, Popconfirm, Skeleton } from "antd";
import gql from "graphql-tag";
import { useContext } from "react";
import { MenuPageContext } from "../../pages/menu";
import { GiHotMeal } from "react-icons/gi";

const ProductListMenuComponent = () => {
  const menuPageContext = useContext(MenuPageContext);
  const [deleteProduct, deleteProductResponse] = useMutation(
    gql`
      mutation DeleteProductMutation($deleteProductProductId: ID) {
        deleteProduct(product_id: $deleteProductProductId)
      }
    `
  );
  const { getProductGQL } = menuPageContext;

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
            <a
              key="list-loadmore-edit"
              onClick={() => {
                menuPageContext.setUpdateModal(true);
                menuPageContext.setSelectedProduct(item);
              }}
            >
              ແກ້ໄຂ
            </a>,
            <Popconfirm
              title="ຕ້ອງການລົບລາຍການນີ້ບໍ່?"
              onConfirm={async () =>
                await deleteProduct({
                  variables: { deleteProductProductId: item.id },
                  refetchQueries: [{ query: getProductGQL! }],
                  onQueryUpdated: async (observableQuery) => {
                    const { data } = await observableQuery.refetch();
                    menuPageContext.setProducts(data);
                    notification.open({ message: "ລົບມູນສຳເລັດ" });
                  }
                })
              }
              okText="ຢືນຢັນ"
              cancelText="ຍົກເລີກ"
            >
              <a key="list-loadmore-more">ລົບ</a>
            </Popconfirm>
          ]}
          className=" hover:shadow-md p-3 "
        >
          <Skeleton loading={false}>
            <List.Item.Meta
              avatar={
                <GiHotMeal
                  size="25px"
                  className=" text-indigo-400 hover:text-indigo-500"
                />
              }
              title={`${menuPageContext.products.length - index}. ${item.name}`}
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
