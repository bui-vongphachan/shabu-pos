import { UserInputError } from "apollo-server-express"
import { InvoiceModel, ProductModel } from "../../models"


export const addProductToInvoice = async (_: any, args: {
    invoice_id: string,
    products: [
        {
            id: string,
            quantity: number,
            size: string,
        }
    ]
}) => {
    try {
        const fullDetailProducts = await ProductModel.find({
            _id: {
                $in: args.products.map(item => item.id)
            }
        }).populate("sizes")

        const products = fullDetailProducts.map(fullDetailProduct => {
            const inputProduct = args.products.find(inputProduct => fullDetailProduct.id === inputProduct.id)
            const fullDetailProductSize = fullDetailProduct.sizes.find(fullDetailProductSize => fullDetailProductSize.id === inputProduct?.size)
            if (!inputProduct || !fullDetailProductSize) throw new UserInputError("Error occurs")
            return {
                product_id: fullDetailProduct.id,
                name: fullDetailProduct.name,
                size: {
                    id: fullDetailProductSize!.id,
                    name: fullDetailProductSize!.name,
                    price: fullDetailProductSize!.price
                },
                quantity: inputProduct!.quantity,
                totalPrice: inputProduct!.quantity * fullDetailProductSize!.price
            }
        })

        await InvoiceModel.findOneAndUpdate(
            { _id: args.invoice_id },
            {
                $addToSet: {
                    orders: {
                        $each: products
                    }
                },
                $inc: { total_price: products.reduce((prev, curr) => prev + curr.totalPrice, 0) }
            }
        )

        const item = await InvoiceModel.findOne({ _id: args.invoice_id }).populate("table")

        return item;
    } catch (error) {
        return error
    }
}