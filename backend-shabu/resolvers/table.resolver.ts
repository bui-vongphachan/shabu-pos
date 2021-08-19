import { InvoiceModel } from "../models/invoice.model";
import { TableModel } from "../models/table.model";


export const tableResolver = {
    Query: {
        tables: async () => {
            const item = await TableModel.find();
            return item;
        }
    },
    Mutation: {
        createTable: async (_: any, args: { name: string }) => {
            await new TableModel({ name: args.name }).save()
            const items = await TableModel.find()
            return items
        }
    }
};
