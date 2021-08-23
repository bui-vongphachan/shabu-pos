import { addInvoice } from "./addInvoice.mutation"
import { getInvoice } from "./getInvoice.query"
import { addProductToInvoice } from "./addProductToInvoice.mutation" 

export const invoiceResolver = {
    Query: { getInvoice },
    Mutation: { addInvoice, addProductToInvoice }
};
