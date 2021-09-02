import { InvoiceModel } from "../../models";

export const getInvoice = async (_: any, args: {
    table_id: string,
    isPaid: boolean
}) => {

    const item = await InvoiceModel.findOne({
        "table.id": args.table_id,
        isPaid: args.isPaid
    }).populate("table")

    return item;
}