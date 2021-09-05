import { OrderModel } from "../../models";

export const getOrder = async (_: any, args: {
    order_id: string,
}) => {
    const { order_id } = args
    const item = await OrderModel.getFullDetail({ order_id })
    return item;
}