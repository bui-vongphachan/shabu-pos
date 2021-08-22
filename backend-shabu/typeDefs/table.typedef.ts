import { gql } from "apollo-server";

export const tableTypeDef = gql`
  type Table {
    id: String
    name: String
    created_date: Date
  },
  type Query {
    getTables: [Table],
  },
  type Mutation {
    addTable(name: String): [Table]
  }
`;
