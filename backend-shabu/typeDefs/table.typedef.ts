import { gql } from "apollo-server";

export const tableTypeDef = gql`
  type Table {
    id: String
    name: String
    created_date: Date
    schema_version: Int
  },
  type ReadtTable {
    table: Table,
    status: String,
    orders: Int
  }
  type Query {
    getTables: [Table],
    getReadyTables: [ReadtTable]
  },
  type Mutation {
    addTable(name: String): [Table]
  }
`;
