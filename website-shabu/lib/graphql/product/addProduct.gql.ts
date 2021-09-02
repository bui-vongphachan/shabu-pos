import { gql } from "@apollo/client";

export const AddProductMutationString = gql`
    mutation AddProductMutation(
        $addProductName: String
        $addProductCategory: String
        $addProductSizes: [ProductSizeInput]
    ) {
    addProduct(
        name: $addProductName
        category: $addProductCategory
        sizes: $addProductSizes
        ) {
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