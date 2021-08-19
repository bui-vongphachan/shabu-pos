import { gql } from "apollo-server";

export const productTypeDef = gql`
  type ProductSize {
    name: String
    price: Float
  },
  type Product {
    id: String
    name: String
    category: String
    sizes: [ProductSize]
    created_date: Date
  }
  type ProductCategory {
    _id: String
    count: Int
  }
  type Query {
    products: [Product]
    productCategories: [ProductCategory]
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
