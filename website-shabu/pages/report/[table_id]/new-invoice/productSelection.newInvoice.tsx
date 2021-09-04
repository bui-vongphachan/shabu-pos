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
            style={{ minWidth: 100 }}
            className=" block"
            value={selected}
            options={options}
            onChange={value => handleProductChange(value)}
            showSearch
            filterOption={(input, option) => {
                const result = (option?.label as string).includes(input)
                return result
            }}
        />
    )
}

export default ProductSelectionNewInvoiceComponent