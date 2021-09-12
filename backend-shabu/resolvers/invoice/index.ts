import { addInvoice } from "./addInvoice.mutation";
import { getInvoices } from "./getInvoices.query";
import { completeInvoice } from "./completeInvoice.mutation";
import { newInvoice } from "./newInvoice.mutation";

export const invoiceResolver = {
  Query: { getInvoices },
  Mutation: { addInvoice, completeInvoice, newInvoice },
};
