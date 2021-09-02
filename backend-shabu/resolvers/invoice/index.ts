import { addInvoice } from "./addInvoice.mutation"
import { getInvoice } from "./getInvoice.query"
import { completeInvoice } from "./completeInvoice.mutation"

export const invoiceResolver = {
    Query: { getInvoice },
    Mutation: { addInvoice, completeInvoice }
};
