import { gql } from "@apollo/client";

export const getProductsQueryString = gql`
    query Query {
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
    }`