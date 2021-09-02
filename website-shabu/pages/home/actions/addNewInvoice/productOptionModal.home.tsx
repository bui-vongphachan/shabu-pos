import { Card, Input, Modal } from "antd"
import Title from "antd/lib/typography/Title";
import { useState } from "react";
import { useContext } from "react";
import { HomePageContext } from "../../..";
import "./Style.module.css"

const ProductOptionModalHomeComponent = () => {
    const [sizeIndex, setSizeIndex] = useState<number | null>(null)
    const homePageContext = useContext(HomePageContext);
    const product = homePageContext.selectedProduct
    const [quantity, setQuantity] = useState("1")
    return (
        <div>
            <Modal
                title="ຕົວເລືອກເພີ່ມເຕີມ"
                width="50%"
                visible={!!homePageContext.selectedProduct}
                onOk={() => {
                    if (sizeIndex === null) return alert("NONONO")
                    homePageContext.saveItemToCart(parseInt(quantity), sizeIndex)
                    setSizeIndex(null)
                    setQuantity("1")
                }}
                onCancel={() => {
                    setSizeIndex(null)
                    homePageContext.selectProduct(null)
                    setQuantity("1")
                }}
            >
                <Title level={5}>ຂະໜາດ</Title>
                <div className=" grid grid-cols-3 gap-3">
                    {
                        product?.sizes.map((size, index) => {
                            return (
                                <Card
                                    key={index}
                                    headStyle={index === sizeIndex ? { color: "white" } : {}}
                                    title={size.name}
                                    className={`${index === sizeIndex ? ` bg-indigo-500 hover:bg-indigo-400 text-white ` : ``} rounded-md border-2 hover:shadow-md cursor-pointer`}
                                    bordered={false}
                                    onClick={() => {
                                        if (index === sizeIndex) setSizeIndex(null)
                                        else setSizeIndex(index)
                                    }}
                                >
                                    {size.price.toLocaleString()}
                                </Card>
                            )
                        })
                    }
                </div>
                <Title className="mt-3" level={5}>ຈຳນວນ</Title>
                <Input
                    min={1}
                    style={{ width: 100 }}
                    size="large"
                    value={quantity}
                    type="number"
                    onChange={e => setQuantity(e.target.value)}
                />
            </Modal>
        </div>
    )
}

export default ProductOptionModalHomeComponent