import { useMutation } from "@apollo/client"
import { Button, Descriptions, InputNumber, PageHeader, Select, Table } from "antd"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import DefaultLayout from "../../../../layouts/default"
import { client } from "../../../../lib/apolloSetup"
import { getProducts, ProductInCartModel, ProductModel } from "../../../../models"
import { addInvoiceToTableQueryString } from "../../../../models/invoice"
import ProductSelectionNewInvoiceComponent from "./productSelection.newInvoice"
import SizeSelectionNewInvoiceComponent from "./sizeSelection.newInvoice"

const NewInvoicePage = (props: {
    products: ProductModel[]
}) => {
    const { products } = props
    const [productsInCart, setProductInCart] = useState<ProductInCartModel[]>([])
    const router = useRouter()
    const { table_id } = router.query;
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
    const [addInvoiceToTableMutation, addInvoiceToTableResponse] = useMutation(addInvoiceToTableQueryString)
    const addInvoiceToTable = async () => {
        try {
            const { errors } = await addInvoiceToTableMutation({
                variables: {
                    addInvoiceTable: table_id,
                    addInvoiceCustomers: 0,
                    addInvoiceProducts: productsInCart.map(item => {
                        return {
                            id: item.id,
                            quantity: item.quantity,
                            size: item.sizes[item.sizeIndex].id,
                        }
                    })
                }
            })

            if (!errors) {

            }
        } catch (error) {
            console.log(error)
        }
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
                loading={addInvoiceToTableResponse.loading}
                className=" overflow-scroll"
                locale={{ emptyText: "ວ່າງ" }}
                rowKey={(record, index) => index!.toString()}
                pagination={false}
                columns={columns}
                dataSource={productsInCart}
            />
            <Button
                loading={addInvoiceToTableResponse.loading}
                disabled={addInvoiceToTableResponse.loading}
                size="small"
                onClick={() => {
                    productsInCart.push({ ...products[0], sizeIndex: 0, quantity: 1 })
                    setProductInCart([...productsInCart])
                }}>ເພີ່ມລາຍການ</Button>
            <div className=" px-3 mt-10 w-full">
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
                <Button
                    size="large"
                    block
                    type="primary"
                    className=" my-10 mx-auto h-auto rounded-md"
                    loading={addInvoiceToTableResponse.loading}
                    disabled={addInvoiceToTableResponse.loading || productsInCart.length === 0}
                    onClick={() => addInvoiceToTable()}
                >
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