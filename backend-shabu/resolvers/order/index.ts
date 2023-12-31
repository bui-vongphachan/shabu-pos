import { addOrderToInvoice } from "./addOrderToInvoice.mutation"
import { updateOrderQuantity } from "./updateOrderQuantity.mutation"
import { changeOrderSize } from "./changeProductSize.mutation"
import { deleteOrder } from "./deleteOrder.mutation"
export const orderResolver = {
    Query: {},
    Mutation: {
        addOrderToInvoice,
        updateOrderQuantity,
        changeOrderSize,
        deleteOrder
    }
};
