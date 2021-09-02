import { gql } from "apollo-server";

export const productTypeDef = gql`
  type Product {
    id: String
    name: String
    category: String
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
      name: String,
      category: String,
      sizes: [ProductSizeInput]
    ): [Product]
  }
`;
