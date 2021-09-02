import { gql } from "@apollo/client";

export const HomePageQueryString = gql`
    query Query {
        getReadyTables {
            table {
                id
                name
                created_date
                schema_version
            }
            status
            orders
        },
        getProducts {
            id
            name
            category
            sizes {
                id
                name
                price
                created_date
            }
            created_date
        }
    }
`