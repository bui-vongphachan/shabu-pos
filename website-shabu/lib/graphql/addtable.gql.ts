import { gql } from "@apollo/client";

export const addTableQueryString = gql`
    mutation addTableMutation($addTableName: String) {
        addTable(name: $addTableName) {
            id
            name
            created_date
        }
    }`;