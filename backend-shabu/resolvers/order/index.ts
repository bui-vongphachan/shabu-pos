import { addOrderToInvoice } from "./addOrderToInvoice.mutation"
import { updateOrderQuantity } from "./updateOrderQuantity.mutation"
export const orderResolver = {
    Query: {},
    Mutation: { addOrderToInvoice, updateOrderQuantity }
};
