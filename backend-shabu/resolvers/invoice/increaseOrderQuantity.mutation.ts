import { InvoiceModel } from "../../models"

export const increaseOrderQuantity = async (_: any, args: {
    invoice_id: string,
    order_id: string,
    quantity: number
}) => {
    try {

        const invoice = await InvoiceModel.findOne({ _id: args.invoice_id })

        const order = invoice?.orders.find(order => order.id === args.order_id)

        const newOrder = {
            ...order?.toJSON(),
            quantity: order!.quantity + args.quantity,
            totalPrice: order!.size.price * (order!.quantity + args.quantity)
        }


        await invoice?.updateOne(
            {
                $pull: {
                    orders: {
                        _id: order?.id
                    }
                },
                $addToSet: {
                    orders: newOrder
                }
            }
        )

        return invoice
    } catch (error) {
        return error
    }
}