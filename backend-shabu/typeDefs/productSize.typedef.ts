import { gql } from "apollo-server";

export const productSizeTypeDef = gql`
  type ProductSize {
    id: ID
    name: String
    price: Float
    created_date: Date
  },
  input addSizeInput {
    name: String
    price: Float
  }
  type Mutation {
    addSize(product_id: ID, sizes: [addSizeInput]): Product
  }
`;
