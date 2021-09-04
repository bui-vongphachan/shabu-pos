import { InvoiceModel } from "../../models";

export const getInvoice = async (_: any, args: {
    table_id: string,
    isPaid: boolean
}) => {
    const { table_id, isPaid } = args
    const item = await InvoiceModel.getFullDetail({ table_id, isPaid })
    return item;
}