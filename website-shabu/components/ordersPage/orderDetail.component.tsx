import { Avatar, Button, Card, List, Skeleton } from "antd";
import QueueAnim from "rc-queue-anim";
import { useContext } from "react";
import { OrdersPageContext } from "../../pages/orders";

const OrderDetailComponent = () => {
  const orderPageContext = useContext(OrdersPageContext);

  const { selectedInvoice } = orderPageContext;

  if (!selectedInvoice) return <span></span>;

  const orderID = selectedInvoice.id.substring(
    selectedInvoice.id.length - 6,
    selectedInvoice.id.length
  );
  return (
    <QueueAnim className="demo-content">
      <Card
        title={orderID.toUpperCase()}
        className=" sticky top-0 rounded-md"
        extra={<Button className=" rounded-md">ເພີ່ມລາຍການ</Button>}
      >
        <List
          style={{ height: "70vh", overflow: "scroll" }}
          itemLayout="horizontal"
          dataSource={selectedInvoice.orders}
          locale={{ emptyText: "ບໍ່ມີລາຍການ" }}
          renderItem={(item, index) => (
            <div
              key={index}
              className=" px-3 mb-3 rounded-md border-2 hover:shadow-md cursor-pointer "
            >
              <List.Item
                actions={[
                  <a key="list-loadmore-edit">ແກ້ໄຂ</a>,
                  <a key="list-loadmore-more">ລົບ</a>
                ]}
              >
                <Skeleton avatar title={false} loading={false}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    }
                    title={item.name}
                    description={item.size.name}
                  />
                  {item.totalPrice.toLocaleString()}
                </Skeleton>
              </List.Item>
            </div>
          )}
        />
      </Card>
    </QueueAnim>
  );
};

export default OrderDetailComponent;
