import { getTables } from "./getTables.query"
import { addTable } from "./addTable.mutation"

export const tableResolver = {
    Query: { getTables },
    Mutation: { addTable }
};
