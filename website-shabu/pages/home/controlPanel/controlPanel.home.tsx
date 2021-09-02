import { Card } from "antd"
import { useContext } from "react"
import { HomePageContext } from "../.."
import AddNewInvoiceHomeComponent from "../actions/addNewInvoice/addNewInvoice.home"
import AddNewOrderHomeComponent from "../actions/addNewOrder/addNewOrder.home"
import CancelInvoiceHomeComponent from "../actions/cancelInvoice/cancelInvoice.home"
import PrintReceiptHomeComponent from "../actions/printReceipt/printReceipt.home"
import SwitchTableHomeComponent from "../actions/switchTable/switchTable.home"

const ControlPanelHome = () => {
    const homePageContext = useContext(HomePageContext);
    return (
        <div className="">
            <Card actions={[
                <AddNewInvoiceHomeComponent />,
                <AddNewOrderHomeComponent />,
                <CancelInvoiceHomeComponent />,
                <PrintReceiptHomeComponent />,
                <SwitchTableHomeComponent />
            ]}>
                ໂຕະ {homePageContext.selectedTable?.table.name}
            </Card>
        </div>
    )
}

export default ControlPanelHome