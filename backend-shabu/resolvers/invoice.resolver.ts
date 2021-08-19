import { InvoiceModel } from "../models/invoice.model";

export const invoiceResolver = {
    Query: {
        invoice: async (_: any, args: { table_id: string }) => {
            const item = await InvoiceModel.findOne({
                table: args.table_id,
                isPaid: false
            });
            return item;
        },
    },
    Mutation: {
        addInvoice: async (_: any, args: {
            table: string,
            customers: number,
            products: [
                {
                    product: string,
                    quantity: number,
                    size: string,
                    price: number,
                }
            ],
            total_price: number
        }) => {
            const { table, customers, products, total_price } = args
            const item = await new InvoiceModel({
                table,
                customers,
                orders: products,
                total_price
            }).save()
            return item;
        },
    }
};
