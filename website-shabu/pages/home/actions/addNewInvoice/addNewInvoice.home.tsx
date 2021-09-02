import { Modal, Button } from "antd"
import { useContext, useEffect, useRef, useState } from "react"
import useResizeObserver from "use-resize-observer";
import { HomePageContext } from "../../..";
import CartHomeComponent from "./cart.home";
import ProductOptionModalHomeComponent from "./productOptionModal.home";
import ProductSelectionHomeComponent from "./productSelection.home";


const AddNewInvoiceHomeComponent = () => {
    const { ref: newRef, width: newWidth = 1, height: newHeight = 1 } = useResizeObserver<HTMLDivElement>();
    const [modalHeight, setModalHeight] = useState(0)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const homePageContext = useContext(HomePageContext);
    const modalRef: any = useRef(null)
    const showModal = () => setIsModalVisible(true);
    const handleOk = async () => {
        homePageContext.addInvoiceToTable().then(() => {
            setIsModalVisible(false)
            homePageContext.setProductsInCart([])
        })
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        homePageContext.setProductsInCart([])
    }
    useEffect(() => {
        if (modalRef.current) {
            setModalHeight(modalRef.current.clientHeight)
        }
    })
    return (
        <div ref={newRef}>
            <Modal
                style={{ top: 20 }}
                width="100%"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <ProductOptionModalHomeComponent />
                <div
                    ref={modalRef}
                    style={{ height: "85vh" }}
                    className=" grid gap-3 lg:grid-cols-12 md:grid-cols-1">
                    <div className=" lg:col-span-4" >
                        <ProductSelectionHomeComponent modalHeight={modalHeight} />
                    </div>
                    <div className=" lg:col-span-8 lg:block hidden">
                        <CartHomeComponent modalHeight={modalHeight} />
                    </div>
                </div>
            </Modal>
            <Button type="primary" onClick={showModal}>ສັ່ງອາຫານ</Button>
        </div>
    )
}

export default AddNewInvoiceHomeComponent