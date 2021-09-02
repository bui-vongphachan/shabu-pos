import { gql } from "@apollo/client";

export const getProductsQueryString = gql`
    query Query {
        getProductCategories {
            _id
            count
        }
    }`