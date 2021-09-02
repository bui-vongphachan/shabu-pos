import { gql } from "@apollo/client";

export const getTablesQueryString = gql`
    query Query {
        getTables {
            id
            name
            created_date
        }
    }`;