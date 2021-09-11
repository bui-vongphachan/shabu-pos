import { gql } from "apollo-server";

export const productTypeDef = gql`
  type Product {
    id: ID
    name: String
    category: String
    options: [ProductOption]
    sizes: [ProductSize]
    created_date: Date
    schema_version: Int
  }
  type ProductCategory {
    _id: String
    count: Int
  }
  type Query {
    getProducts: [Product]
    getProductCategories: [ProductCategory]
  }
  input ProductSizeInput {
    name: String
    price: Float
  }
  type Mutation {
    addProduct(
      name: String
      sizes: [ProductSizeInput]
      options: [addProductOptionInput]
    ): Boolean
  }
`;
