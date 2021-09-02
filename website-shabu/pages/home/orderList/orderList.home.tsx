import { Card, List, Skeleton } from "antd";
import { useContext } from "react";
import { HomePageContext } from "../..";
import { OrderModel } from "../../../models/order";

const OrderListHomeComponent = () => {
    const homePageContext = useContext(HomePageContext);
    return (
        <List
            locale={{ emptyText: "ຍັງບໍ່ມີໂຕະ" }}
            className=""
            itemLayout="horizontal"
            dataSource={homePageContext.invoice?.orders}
            renderItem={(item: OrderModel, index) => (
                <List.Item key={index} >
                    <Skeleton loading={false}>
                        <Card
                          
                            style={{ cursor: "pointer" }}
                            className=" hover:shadow-lg p-3 "
                            title={item.name}>
                         {item.totalPrice.toLocaleString()}
                        </Card>
                    </Skeleton>
                </List.Item>
            )}
        />
    )
}

export default OrderListHomeComponent