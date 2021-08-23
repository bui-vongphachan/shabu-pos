import { UserInputError } from "apollo-server-express";
import { InvoiceModel, OrderModel, ProductModel } from "../../models";

export const addOrderToInvoice = async (_: any, args: {
    invoice_id: string,
    products: [
        {
            id: string,
            quantity: number,
            size: string
        }
    ]
}) => {
    const fullDetailProducts = await ProductModel.find({
        _id: {
            $in: args.products.map(item => item.id)
        }
    }).populate("sizes")

    const orders = fullDetailProducts.map(fullDetailProduct => {
        const inputProduct = args.products.find(inputProduct => fullDetailProduct.id === inputProduct.id)
        const fullDetailProductSize = fullDetailProduct.sizes.find(fullDetailProductSize => fullDetailProductSize.id === inputProduct?.size)
        if (!inputProduct || !fullDetailProductSize) throw new UserInputError("Error occurs")
        return {
            product: fullDetailProduct.id,
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

    const newOrders = await OrderModel.insertMany(orders)

    await InvoiceModel.findOneAndUpdate(
        { _id: args.invoice_id },
        {
            $addToSet: {
                orders: {
                    $each: newOrders.map(order => order.id)
                }
            },
            $inc: {
                total_price: newOrders.reduce((prev, curr) => prev + curr.totalPrice, 0)
            }
        }
    )

    return await InvoiceModel.getFullDetail(args.invoice_id)
}