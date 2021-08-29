import { ProductSizeModel } from "./productSize";

export interface ProductModel {
    id: string
    name: string
    category: string
    sizes: ProductSizeModel[]
    created_date: string,
    schema_version: number
}