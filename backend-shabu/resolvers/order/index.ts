import { addOrderToInvoice } from "./addOrderToInvoice.mutation"
import { updateOrderQuantity } from "./updateOrderQuantity.mutation"
import { changeOrderSize } from "./changeProductSize.mutation"
import { deleteOrder } from "./deleteOrder.mutation"
import { getOrder } from "./getOrder.query"
export const orderResolver = {
    Query: { getOrder },
    Mutation: {
        addOrderToInvoice,
        updateOrderQuantity,
        changeOrderSize,
        deleteOrder
    }
};
