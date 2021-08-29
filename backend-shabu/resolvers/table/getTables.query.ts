import { TableModel } from "../../models";

export const getTables = async () => {
    const item = await TableModel.find().sort({ created_date: -1 })
    return item;
}