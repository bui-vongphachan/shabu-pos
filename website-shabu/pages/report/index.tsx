import { Card, List } from "antd"
import DefaultLayout from "../../layouts/default"
import { client } from "../../lib/apolloSetup"
import Link from "next/link"
import { GetReadyTablesQueryString, ReadyTableModel } from "../../models"

const Report = (props: {
    readyTables: ReadyTableModel[],
}) => {
    return (
        <List
            grid={{
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
            dataSource={props.readyTables}
            renderItem={(item, index) => (
                <List.Item key={index}>
                    <Link href={`report/${item.table.id}`}>
                        <Card
                            style={{ cursor: "pointer" }}
                            className="cursor-pointer hover:shadow-lg p-3 "
                            title={`${item.table.name}`}>
                            {`${item.status}`}
                        </Card>
                    </Link>

                </List.Item>
            )}
        />
    )
}

export const getServerSideProps = async () => {
    const { data } = await client.query({
        query: GetReadyTablesQueryString
    })
    return {
        props: {
            readyTables: data.getReadyTables,
        }
    }
}

Report.getLayout = DefaultLayout

export default Report