import { TableModel } from "../../models";

export const getTables = async () => {
    const item = await TableModel.find();
    return item;
}