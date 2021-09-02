import { gql } from "apollo-server-express";
import { TableModel } from "../../models";

export const addTable = async (_: any, args: { name: string }) => {
    await new TableModel({ name: args.name }).save()
    const items = await TableModel.find().sort({ created_date: -1 })
    return items
}

export const addTableMutation = gql`
    mutation AddProductToInvoiceMutation($addTableName: String) {
            addTable(name: $addTableName) {
                id
                name
                created_date
            }
        }
`