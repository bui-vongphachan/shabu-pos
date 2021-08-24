import { Types } from "mongoose"
import { OrderModel, InvoiceModel } from "../../models"

export const updateOrderQuantity = async (_: any, args: {
    invoice_id: string,
    order_id: string,
    quantity: number
}) => {    

    const order = await OrderModel.findOne({ _id: args.order_id})

    if (!order) throw new Error("Order not found")

    await OrderModel.findOneAndUpdate(
        { _id: args.order_id },
        {
            $set: {
                quantity: args.quantity,
                totalPrice: args.quantity * order.size.price
            }
        },
        { new: true }
    )

    return await InvoiceModel.updateTotalPrice(args.invoice_id)
}