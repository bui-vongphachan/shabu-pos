import { Card, List, Skeleton } from "antd"
import DefaultLayout from "../../layouts/default"
import { client } from "../../lib/apolloSetup"
import Link from "next/link"
import { GetReadyTablesQueryString, ReadyTableModel } from "../../models"
import { useQuery } from "@apollo/client"
import { useRouter } from "next/router"

const Report = () => {
    const { loading, error, data } = useQuery(GetReadyTablesQueryString)
    const router = useRouter()
    if (loading) {
        return (
            <div className=" container m-auto grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-1">
                {
                    [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) =>
                        <Skeleton.Input key={index} style={{ minWidth: 100, height: 150 }} active size="large" />
                    )
                }
            </div>)
    }

    return (
        <div className=" container m-auto">
            <List
                grid={{
                    xs: 2,
                    sm: 3,
                    md: 3,
                    lg: 4,
                    xl: 4,
                    xxl: 6,
                }}
                locale={{ emptyText: "ຍັງບໍ່ມີໂຕະ" }}
                className=""
                itemLayout="horizontal"
                dataSource={(data.getReadyTables)}
                renderItem={(item: ReadyTableModel, index) => {
                    let link = `report/${item.table.id}`
                    if (item.status === "ວ່າງ") link = link + `/new-invoice`
                    return <List.Item key={index}>
                        <a
                            href={link}
                            onClick={e => {
                                e.preventDefault()
                                router.push(link)
                            }}>
                            <Card
                                style={{ cursor: "pointer" }}
                                className="cursor-pointer hover:shadow-lg p-3 "
                                title={`${item.table.name}`}>
                                {`${item.status}`}
                            </Card>
                        </a>
                    </List.Item>
                }}
            />
        </div>
    )
}

Report.getLayout = DefaultLayout

export default Report