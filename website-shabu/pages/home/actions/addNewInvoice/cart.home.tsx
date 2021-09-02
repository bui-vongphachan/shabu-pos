import { Button, Descriptions, InputNumber, Select, Table } from "antd"
import { useContext, useEffect, useRef, useState } from "react";
import { HomePageContext } from "../../..";
import { ProductInCartModel, ProductModel } from "../../../../models";

const CartHomeComponent = (props: { modalHeight: number }) => {
    const homePageContext = useContext(HomePageContext);
    const [cardBoxHeight, setCardBoxHeight] = useState(0)
    const [summaryBoxHeight, setSummaryBoxHeight] = useState(0)
    const cardBoxRef: any = useRef(null)
    const summaryBoxRef: any = useRef(null)
    const columns = [
        {
            title: 'ຊື່',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'ຂະໜາດ',
            render: (product: ProductInCartModel, _: any, index: number) => {
                return (
                    <div>
                        <Select
                            defaultValue={product.sizes[product.sizeIndex].name}
                            style={{ width: 120 }}
                            options={product.sizes.map(item => {
                                return {
                                    key: item.id,
                                    title: item.name,
                                    value: item.name,
                                }
                            })}
                            onChange={(value: any, option: any) => {
                                const sizeIndex = product.sizes.findIndex(size => size.id === option.key)
                                homePageContext.productsInCart[index].sizeIndex = sizeIndex
                                homePageContext.setProductsInCart([...homePageContext.productsInCart])
                            }}
                        />
                    </div>)
            }
        },
        {
            title: 'ຈຳນວນ',
            render: (product: ProductInCartModel, _: any, index: number) => <div>
                <InputNumber
                    min={1}
                    max={100}
                    defaultValue={product.quantity}
                    value={product.quantity}
                    onChange={(value) => {
                        homePageContext.productsInCart[index].quantity = value
                        homePageContext.setProductsInCart([...homePageContext.productsInCart])
                    }}
                />
            </div>
        },
        {
            title: 'ລວມ',
            render: (product: ProductInCartModel) => (
                <span>
                    {
                        (
                            product.quantity * product.sizes[product.sizeIndex].price
                        ).toLocaleString()
                    }
                </span>)
        },
        {
            title: 'ຈັດການ',
            render: (product: any, _: any, index: number) => {
                return <Button onClick={() => { homePageContext.removeItemFromCart(index) }}>ລົບ</Button>
            }
        }
    ]
    /*  useEffect(() => {
         if (!!cardBoxRef || !!summaryBoxRef) {
             setSummaryBoxHeight(summaryBoxRef.current.clientHeight)
             setCardBoxHeight(cardBoxRef.current.clientHeight)
         }
     }) */
    return (
        <div>
            <div
                /*   ref={cardBoxRef} */
                style={{ backgroundColor: "red" }}
            >
                <Table
                    /*  style={{
                         backgroundColor: "red",
                         height: "70vh",
                         //    maxHeight: `40%`,
                         // height: `calc(100% - ${cardBoxHeight + summaryBoxHeight}px)`,
                         overflow: "auto"
                     }} */
                    //   scroll={{ y: props.modalHeight }}
                    locale={{ emptyText: "ຍັງບໍ່ທັນເລືອກ" }}
                    className="mt-11"
                    pagination={false}
                    columns={columns}
                    dataSource={homePageContext.productsInCart}
                />
            </div>
            {
                homePageContext.productsInCart.length === 0 ? null :
                    <div
                        /* ref={summaryBoxRef} */
                        style={{ direction: "rtl" }}>
                        <Descriptions title="ສະຫຼຸບ" bordered className=" w-6/12 mt-2" style={{ direction: "ltr" }}>
                            <Descriptions.Item label="ລາຄາລວມ">
                                {
                                    (
                                        homePageContext.productsInCart.reduce((sum, product) => (
                                            sum + (product.quantity * product.sizes[product.sizeIndex].price)
                                        ), 0)
                                    ).toLocaleString()
                                } KIP
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
            }
        </div>
    )
}

export default CartHomeComponent