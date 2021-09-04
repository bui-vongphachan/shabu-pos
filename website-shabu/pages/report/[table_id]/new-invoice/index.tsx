import { Button, InputNumber, PageHeader, Select, Table } from "antd"
import { useRouter } from "next/router"
import { useState } from "react"
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
        }
    ]
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