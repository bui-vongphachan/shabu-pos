import { InvoiceModel, ProductModel, ProductSizeModel } from "../../models";
import { Types } from "mongoose"
import { UserInputError } from "apollo-server-express";

export const addInvoice = async (_: any, args: {
    table: string,
    customers: number,
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

        const newInvoice = await new InvoiceModel({
            table: args.table,
            customers: args.customers,
            orders: products,
            total_price: products.reduce((prev, curr) => prev + curr.totalPrice, 0)
        }).save()

        const item = await InvoiceModel.findOne({ _id: newInvoice.id }).populate("table")

        return item;
    } catch (error) {
        return error
    }
}