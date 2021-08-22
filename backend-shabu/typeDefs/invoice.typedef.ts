import { gql } from "apollo-server";

export const invoiceTypeDef = gql`
  type Invoice {
    id: String
    isPaid: Boolean
    table: Table
    customers: Int
    orders: [Order]
    time_spent: Int
    total_price: Float
    final_price: Float
    money_received: Float
    money_return: Float
    printed_time: Date
    arrived_time: Date
    created_date: Date
  }
  type Query {
    getInvoice(table_id: String, isPaid: Boolean): Invoice
  },
  input addInvoiceProductInput {
    id: ID,
    quantity: Int,
    size: ID,
  }
  type Mutation {
    addInvoice(
      table: ID,
      customers: Int,
      products: [addInvoiceProductInput],
    ): Invoice,
    addProductToInvoice(
      invoice_id: ID,
      products: [addInvoiceProductInput],
    ): Invoice,
  }
`;
