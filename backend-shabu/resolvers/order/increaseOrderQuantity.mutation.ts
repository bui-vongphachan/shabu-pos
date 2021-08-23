import { Types } from "mongoose"
import { OrderModel, InvoiceModel } from "../../models"

export const increaseOrderQuantity = async (_: any, args: {
    invoice_id: string,
    order_id: string,
    quantity: number
}) => {

    const orders = await OrderModel.aggregate([
        {
            $match: { _id: Types.ObjectId(args.order_id) }
        },
        {
            $addFields: {
                newQuantity: {
                    $add: ["$quantity", args.quantity]
                },
                newTotalPrice: {
                    $multiply: [
                        { $add: ["$quantity", args.quantity] }, "$size.price"
                    ]
                }
            }
        }
    ])

    if (orders.length !== 1) throw new Error("Order not found")

    await OrderModel.findOneAndUpdate(
        { _id: args.order_id },
        {
            $set: {
                quantity: orders[0].newQuantity,
                totalPrice: orders[0].newTotalPrice
            }
        },
        { new: true }
    )

    return await InvoiceModel.updateTotalPrice(args.invoice_id)
}