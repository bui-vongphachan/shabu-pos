import { gql } from "apollo-server";

export const productSizeTypeDef = gql`
  type ProductSize {
    id: ID
    name: String
    price: Float
    isDeleted: Boolean
    created_date: Date
    schema_version: Int
  },
  input addSizeInput {
    name: String
    price: Float
  }
  type Mutation {
    addSize(product_id: ID, sizes: [addSizeInput]): Product,
    deleteSize(size_id: ID): [Product]
  }
`;