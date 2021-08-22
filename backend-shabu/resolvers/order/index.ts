import { addOrderToInvoice } from "./addOrderToInvoice.mutation"

export const orderResolver = {
    Query: {},
    Mutation: { addOrderToInvoice }
};
