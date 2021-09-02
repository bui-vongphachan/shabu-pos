import { List, Skeleton } from "antd"
import { TableModel } from "../../models"

interface TableListProps {
    tables: TableModel[]
}

const TableList = (props: TableListProps) => {
    return (
        <List
            locale={{ emptyText: "ຍັງບໍ່ມີໂຕະ" }}
            className=" m-3 w-full"
            itemLayout="horizontal"
            dataSource={props.tables}
            renderItem={(item, index) => (
                <List.Item
                    key={index}
                    actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">delete</a>]}
                    className=" hover:shadow-md p-3 "
                >

                    <Skeleton loading={false}>
                        {`${++index}. ${item.name}`}
                    </Skeleton>
                </List.Item>
            )}
        />
    )
}

export default TableList