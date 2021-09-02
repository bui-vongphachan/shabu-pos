import { getTables } from "./getTables.query"
import { addTable } from "./addTable.mutation"
import { getReadyTables } from "./getReadyTable.query"

export const tableResolver = {
    Query: { getTables, getReadyTables },
    Mutation: { addTable }
};
