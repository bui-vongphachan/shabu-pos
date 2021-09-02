import { Button, List, Select, Skeleton, Space, Table } from "antd";
import { RightOutlined } from '@ant-design/icons';
import { useContext } from "react";
import { HomePageContext } from "../../..";
import Search from "antd/lib/input/Search";
import { Option } from "antd/lib/mentions";
import { ProductModel } from "../../../../models";

const ProductSelectionHomeComponent = (props: { modalHeight: number }) => {
    const homePageContext = useContext(HomePageContext);
    const columns = [
        {
            title: 'ຊື່',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ປະເພດ',
            dataIndex: 'category',
            key: 'category',
        }
    ]

    return (
        <div>
            <Space className=" mb-3 relative" align="baseline">
                <Search
                    allowClear
                    enterButton="ຄົ້ນຫາ"
                    size="middle"
                />
                <Select
                    className=" absolute top-0"
                    defaultValue="lucy"
                    style={{ width: 120 }}
                    options={[
                        {
                            key: "hum",
                            title: "hum",
                            value: "hum",
                        }
                    ]}
                />
            </Space>
            <Table components={{
                body: {
                    row: (s: any) => {
                        const product = (s.children[0].props.record as ProductModel)
                        return <tr
                            key={product.id}
                            className={` hover:bg-indigo-400 hover:text-white`}
                            style={{ cursor: "pointer" }}
                            onClick={() => homePageContext.selectProduct(product)}
                        >
                            {s.children}
                        </tr>
                    }
                }
            }} pagination={false} columns={columns} dataSource={homePageContext.products} />
        </div>
    )
}

export default ProductSelectionHomeComponent