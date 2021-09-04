import { Button, InputNumber, PageHeader, Select, Table } from "antd"
import { useRouter } from "next/router"
import { useState } from "react"
import DefaultLayout from "../../../../layouts/default"
import { client } from "../../../../lib/apolloSetup"
import { getProducts, ProductInCartModel, ProductModel } from "../../../../models"
import ProductSelectionNewInvoiceComponent from "./productSelection.newInvoice"

const NewInvoicePage = (props: {
    products: ProductModel[]
}) => {
    const { products } = props
    const [productsInCart, setProductInCart] = useState<ProductInCartModel[]>([])
    const router = useRouter()
    const columns = [
        {
            title: 'ຊື່',
            dataIndex: 'name',
            id: 'id',
        },
        {
            title: 'ຂະໜາດ',
            dataIndex: 'category',
            id: 'id',
        },
        {
            title: 'ຈຳນວນ',
            dataIndex: 'category',
            id: 'id',
        }
    ]
    const handleProductChange = (new_product_id: string, previous_product_id: string) => {
        const foundProduct = products.find(item => item.id === new_product_id)
        const foundProductIndex = productsInCart.findIndex(item => item.id === previous_product_id)

        productsInCart[foundProductIndex] = {
            ...foundProduct!,
            sizeIndex: 0,
            quantity: 1
        }

        setProductInCart([...productsInCart])
    }
    return (
        <div>
            <PageHeader
                className="site-page-header"
                onBack={() => router.back()}
                title="ເພີ່ມລາຍການອາຫານ"
            />
            <Table
                rowKey="id"
                scroll={{ y: 300, x: 300 }}
                pagination={false}
                columns={columns}
                dataSource={productsInCart}
                components={{
                    body: {
                        row: (row: any, i: any) => {
                            if (!row.children[0]) {
                                return (
                                    <tr>
                                        <td colSpan={3} className=" text-center">ວ່າງ</td>
                                    </tr>
                                )
                            }

                            const product = (row.children[0].props.record as ProductInCartModel)

                            const sizes = product.sizes

                            return (
                                <tr key={product.id}>
                                    <td>
                                        <ProductSelectionNewInvoiceComponent
                                            products={products}
                                            selected={product.id}
                                            handleProductChange={handleProductChange}
                                        />
                                    </td>
                                    <td></td>
                                    <td>
                                        <InputNumber
                                            min={1}
                                            max={100}
                                            defaultValue={product.quantity}
                                            value={product.quantity}
                                            onChange={(value) => {

                                            }}
                                        />
                                    </td>
                                </tr>
                            )
                        }
                    }
                }}
            />
            <Button size="small" onClick={() => {
                productsInCart.push({ ...products[0], sizeIndex: 0, quantity: 1 })
                setProductInCart([...productsInCart])
            }}>ເພີ່ມລາຍການ</Button>
        </div>
    )
}

export const getServerSideProps = async () => {
    const { data } = await client.query({
        query: getProducts
    })
    return {
        props: {
            products: data.getProducts
        }
    }
}

export default NewInvoicePage