import { Select } from "antd"
import { ProductModel } from "../../../../models"

const ProductSelectionNewInvoiceComponent = (props: {
    products: ProductModel[],
    selected: string,
    handleProductChange: (new_product_id: string) => void
}) => {
    const { products, selected, handleProductChange } = props
    const options = products.map(product => {
        return {
            key: product.id,
            label: product.name,
            value: product.id,
        }
    })
    return (
        <Select
            className=" block"
            value={selected}
            options={options}
            onChange={value => handleProductChange(value)}
        />
    )
}

export default ProductSelectionNewInvoiceComponent