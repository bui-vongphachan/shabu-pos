import { Select } from "antd"
import { ProductSizeModel } from "../../../../models"

const SizeSelectionNewInvoiceComponent = (props: {
    sizes: ProductSizeModel[],
    selected: number,
    handleSizeChange: (sizeIndex: number) => void
}) => {
    const { sizes, selected, handleSizeChange } = props
    const options = sizes.map((size, index) => {
        return {
            key: index,
            label: size.name,
            value: index,
        }
    })

    return (
        <Select
            className=" block"
            value={selected}
            options={options}
            onChange={(value: number) => handleSizeChange(value)}
        />
    )
}

export default SizeSelectionNewInvoiceComponent