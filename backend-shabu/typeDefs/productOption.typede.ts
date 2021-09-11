import { gql } from "apollo-server";

export const productOptionTypeDef = gql`
  type ProductOption {
    id: ID
    name: String
    price: Float
    isDeleted: Boolean
    created_date: Date
    schema_version: Int
  }
  input addProductOptionInput {
    name: String
    price: Float
  }
`;
