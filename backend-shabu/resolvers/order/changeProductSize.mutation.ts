import { InvoiceModel, OrderModel, ProductSizeModel } from "../../models"

export const changeOrderSize = async (_: any, args: {
    invoice_id: string,
    order_id: string,
    size_id: string
}) => {

    const size = await ProductSizeModel.findOne({ _id: args.size_id })

    if (!size) throw new Error("Product size not found")

    const order = await OrderModel.findOne({ _id: args.order_id })

    if (!order) throw new Error("Product order not found")

    await OrderModel.findOneAndUpdate(
        { _id: args.order_id },
        {
            $set: {
                "size.id": size.id,
                "size.name": size.name,
                "size.price": size.price,
                totalPrice: order.quantity * size.price
            }
        }
    )

    return  await InvoiceModel.updateTotalPrice(args.invoice_id)
}