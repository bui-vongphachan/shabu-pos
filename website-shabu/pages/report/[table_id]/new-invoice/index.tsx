import { Button, Descriptions, InputNumber, PageHeader, Select, Table } from "antd"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import DefaultLayout from "../../../../layouts/default"
import { client } from "../../../../lib/apolloSetup"
import { getProducts, ProductInCartModel, ProductModel } from "../../../../models"
import ProductSelectionNewInvoiceComponent from "./productSelection.newInvoice"
import SizeSelectionNewInvoiceComponent from "./sizeSelection.newInvoice"

const NewInvoicePage = (props: {
    products: ProductModel[]
}) => {

    const { products } = props
    const [productsInCart, setProductInCart] = useState<ProductInCartModel[]>([])
    const router = useRouter()
    const handleProductChange = (product_id: string, productInCartIndex: number) => {
        const foundProduct = products.find(item => item.id === product_id)
        productsInCart[productInCartIndex] = {
            ...foundProduct!,
            sizeIndex: 0,
            quantity: 1
        }

        setProductInCart([...productsInCart])
    }
    const handleSizeChange = (sizeIndex: number, productInCartIndex: number) => {
        productsInCart[productInCartIndex].sizeIndex = sizeIndex
        setProductInCart([...productsInCart])
    }

    const columns = [
        {
            title: '#',
            render: (value: any, product: ProductInCartModel, index: number) => <span>{++index}</span>
        },
        {
            title: 'ຊື່',
            dataIndex: 'name',
            id: 'id',
            render: (value: any, product: ProductInCartModel, index: number) =>
                <ProductSelectionNewInvoiceComponent
                    products={products}
                    selected={product.id}
                    handleProductChange={(product_id) => handleProductChange(product_id, index)}
                />
        },
        {
            title: 'ຂະໜາດ',
            dataIndex: 'category',
            id: 'id',
            render: (value: any, product: ProductInCartModel, productIndex: number) =>
                <SizeSelectionNewInvoiceComponent
                    sizes={product.sizes}
                    selected={product.sizeIndex}
                    handleSizeChange={(sizeIndex) => handleSizeChange(sizeIndex, productIndex)}
                />
        },
        {
            title: 'ຈຳນວນ',
            dataIndex: 'category',
            id: 'id',
            render: (value: any, product: ProductInCartModel, productIndex: number) =>
                <InputNumber
                    min={1}
                    max={100}
                    defaultValue={product.quantity}
                    value={product.quantity}
                    onChange={(value) => {
                        productsInCart[productIndex].quantity = value
                        setProductInCart([...productsInCart])
                    }}
                />
        },
        {
            title: 'ຈັດການ',
            render: (value: any, product: ProductInCartModel, productIndex: number) =>
                <Button onClick={() => {
                    productsInCart.splice(productIndex, 1);
                    setProductInCart([...productsInCart])
                }}>ລົບອອກ</Button>
        }
    ]
    return (
        <Fragment>
            <PageHeader
                className="site-page-header bg-yellow-400 w-full"
                onBack={() => router.back()}
                title="ເພີ່ມລາຍການອາຫານ"
            />
            <Table
                locale={{ emptyText: "ວ່າງ" }}
                rowKey={(record, index) => index!.toString()}
                pagination={false}
                columns={columns}
                dataSource={productsInCart}
            />
            <Button size="small" onClick={() => {
                productsInCart.push({ ...products[0], sizeIndex: 0, quantity: 1 })
                setProductInCart([...productsInCart])
            }}>ເພີ່ມລາຍການ</Button>
            <div className=" mt-10 bg-gray-500 w-full">
                <Descriptions title="ສະຫຼຸບ" bordered>
                    <Descriptions.Item label="ລາຄາລວມ">
                        {
                            (
                                productsInCart.reduce((sum, product) => (
                                    sum + (product.quantity * product.sizes[product.sizeIndex].price)
                                ), 0)
                            ).toLocaleString()
                        } KIP
                    </Descriptions.Item>
                </Descriptions>
                <Button size="large" block type="primary" className=" my-10 mx-auto h-auto rounded-md">
                    <span style={{ fontSize: 20 }}>ສັ່ງອາຫານ</span>
                </Button>
            </div>
        </Fragment>
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