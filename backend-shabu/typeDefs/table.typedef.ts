import { gql } from "apollo-server";

export const tableTypeDef = gql`
  type Table {
    id: String
    name: String
    created_date: Date
  },
  type Query {
    tables: [Table],
  },
  type Mutation {
    createTable(name: String): [Table]
  }
`;
