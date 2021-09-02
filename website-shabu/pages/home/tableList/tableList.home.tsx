import { Card, List, Skeleton } from "antd";
import { useContext } from "react";
import { HomePageContext } from "../..";

const TableListHomeComponent = () => {
    const homePageContext = useContext(HomePageContext);
    return (
        <List
            grid={{
                gutter: 3,
                xs: 2,
                sm: 3,
                md: 3,
                lg: 3,
                xl: 3,
                xxl: 3,
            }}
            locale={{ emptyText: "ຍັງບໍ່ມີໂຕະ" }}
            className=""
            itemLayout="horizontal"
            dataSource={homePageContext.readyTables}
            renderItem={(item, index) => (
                <List.Item key={index} >
                    <Skeleton loading={false}>
                        <Card
                            onClick={() => {
                                if (homePageContext.selectedTable === item)
                                    homePageContext.setSelectedTable(null)
                                else
                                    homePageContext.setSelectedTable(item)
                            }}
                            style={{ cursor: "pointer" }}
                            className=" hover:shadow-lg p-3 "
                            title={`${item.table.name}`}>
                            {`${item.status}`}
                        </Card>
                    </Skeleton>
                </List.Item>
            )}
        />
    )
}

export default TableListHomeComponent