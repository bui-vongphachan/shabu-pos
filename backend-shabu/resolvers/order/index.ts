import { addOrderToInvoice } from "./addOrderToInvoice.mutation"
import { increaseOrderQuantity } from "./increaseOrderQuantity.mutation"
export const orderResolver = {
    Query: {},
    Mutation: { addOrderToInvoice, increaseOrderQuantity }
};
