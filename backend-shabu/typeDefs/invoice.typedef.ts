import { gql } from "apollo-server";

export const invoiceTypeDef = gql`
  type InvoiceProduct {
    product: ID,
    isReceived: Boolean,
    quantity: Int,
    size: String,
    price: Float,
    ordered_date: Date
  }
  type Invoice {
    id: String
    isPaid: Boolean
    table: Table
    customers: Int
    products: [InvoiceProduct]
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
    invoice(table_id: String): Invoice
  },
  input InvoiceProductInput {
    product: ID,
    quantity: Int,
    size: String,
    price: Float,
  }
  type Mutation {
    addInvoice(
      table: ID,
      customers: Int,
      products: [InvoiceProductInput],
      total_price: Float,
    ): Invoice
  }
`;
