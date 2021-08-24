import { addOrderToInvoice } from "./addOrderToInvoice.mutation"
import { updateOrderQuantity } from "./updateOrderQuantity.mutation"
import { changeOrderSize } from "./changeProductSize.mutation"
export const orderResolver = {
    Query: {},
    Mutation: { addOrderToInvoice, updateOrderQuantity, changeOrderSize }
};
