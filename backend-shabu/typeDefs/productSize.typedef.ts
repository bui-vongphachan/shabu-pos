import { gql } from "apollo-server";

export const productSizeTypeDef = gql`
  type ProductSize {
    id: ID
    name: String
    price: Float
    created_date: Date
  },
  input ProductSizeInput {
    name: String
    price: Float
  }
`;
