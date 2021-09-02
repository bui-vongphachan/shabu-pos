import { gql } from "@apollo/client";
import { ProductSizeModel } from "./productSize";

export interface ProductModel {
    id: string
    name: string
    category: string
    sizes: ProductSizeModel[]
    created_date: string,
    schema_version: number
}

export interface ProductInCartModel extends ProductModel {
    sizeIndex: number,
    quantity: number
}

export const getProducts = gql`
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